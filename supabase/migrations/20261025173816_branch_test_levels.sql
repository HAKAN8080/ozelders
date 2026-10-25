-- Branş testi kademesi: test sınıfı 3–4 / 5–8 / 9–12 kademesine düşer, başvuranın sınıf aralığıyla eşleşir.
-- Başvuran aralığındaki her kademe testini çözebilir; geçtiği kademe ve branş onaylanır.

alter table teacher_applications add column branch_tests jsonb not null default '[]';
-- [{exam_id, attempt_id, subject, grades_min, grades_max, score, passed, at}]
alter table teachers add column branch_levels jsonb not null default '[]';
-- [{subject, grades_min, grades_max}] — eşleştirme bu listeye göre yapılır

create or replace function grade_band(g smallint)
returns int4range language sql immutable as $$
  select case when g <= 4 then int4range(3, 4, '[]') when g <= 8 then int4range(5, 8, '[]') else int4range(9, 12, '[]') end
$$;

-- Başvurana uygun yayındaki branş testleri (branş + kademe kesişimi)
create or replace function teacher_branch_tests()
returns table (exam_id uuid, slug text, title text, duration_min smallint, question_count int, subject text,
               grades_min int, grades_max int)
language sql stable security definer set search_path = public as $$
  select e.id, e.slug, e.title, e.duration_min,
         (select coalesce(sum(s2.question_count), 0)::int from exam_sections s2 where s2.exam_id = e.id),
         s.code, lower(grade_band(e.grade)), upper(grade_band(e.grade)) - 1
    from teacher_applications a
    join exams e on e.purpose = 'brans_testi' and e.status = 'yayinda'
    join lateral (select s.code from exam_sections s where s.exam_id = e.id and s.code = any(a.subjects)
                  order by array_position(a.subjects, s.code) limit 1) s on true
   where a.profile_id = auth.uid()
     and grade_band(e.grade) && int4range(a.grades_min, a.grades_max, '[]')
   order by array_position(a.subjects, s.code), e.grade
$$;

create or replace function teacher_application_branch_test(p_attempt uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_app teacher_applications; v_att exam_attempts; v_test record; v_total int; v_score numeric; v_pass boolean;
  v_left int;
begin
  select * into v_app from teacher_applications where profile_id = auth.uid() for update;
  if v_app.id is null or v_app.rejected_at is not null or v_app.stage not in ('test', 'demo', 'belge', 'oryantasyon') then
    raise exception 'Branş testi çözebileceğin bir aşamada değilsin';
  end if;
  select a.* into v_att from exam_attempts a join exams e on e.id = a.exam_id
   where a.id = p_attempt and a.user_id = auth.uid() and e.purpose = 'brans_testi';
  if v_att.id is null then raise exception 'Deneme bulunamadı'; end if;
  if exists (select 1 from exam_attempts x where x.exam_id = v_att.exam_id and x.user_id = auth.uid()
              and (x.created_at, x.id) < (v_att.created_at, v_att.id)) then
    raise exception 'Bu testteki ilk denemen sayılır';
  end if;
  select * into v_test from teacher_branch_tests() t where t.exam_id = v_att.exam_id;
  if v_test is null then raise exception 'Bu test seçtiğin branş ve sınıf aralığıyla eşleşmiyor'; end if;
  if exists (select 1 from jsonb_array_elements(v_app.branch_tests) b where (b ->> 'exam_id')::uuid = v_att.exam_id) then
    raise exception 'Bu testin sonucu zaten işlendi';
  end if;

  v_total := v_test.question_count;
  v_score := round(100.0 * greatest(v_att.total_net, 0) / nullif(v_total, 0), 2);
  v_pass := v_score >= 85;

  update teacher_applications set
    branch_tests = branch_tests || jsonb_build_object(
      'exam_id', v_att.exam_id, 'attempt_id', v_att.id, 'subject', v_test.subject,
      'grades_min', v_test.grades_min, 'grades_max', v_test.grades_max,
      'score', v_score, 'passed', v_pass, 'at', now()),
    branch_test_attempt_id = coalesce(branch_test_attempt_id, case when v_pass then v_att.id end),
    branch_test_score = greatest(coalesce(branch_test_score, 0), v_score),
    branch_test_at = now(),
    stage = case when v_pass and stage = 'test' then 'demo'::teacher_status else stage end,
    updated_at = now()
  where id = v_app.id
  returning * into v_app;

  -- Test aşamasında hiç geçilen test yoksa ve çözülecek test kalmadıysa başvuru sonuçlanır
  select count(*) into v_left from teacher_branch_tests() t
   where not exists (select 1 from jsonb_array_elements(v_app.branch_tests) b where (b ->> 'exam_id')::uuid = t.exam_id);
  if v_app.stage = 'test' and v_left = 0 then
    update teacher_applications set rejected_at = now(),
      rejection_reason = 'Branş testi %85 barajının altında' where id = v_app.id;
  end if;
  return jsonb_build_object('score', v_score, 'passed', v_pass, 'remaining', v_left);
end $$;

-- Onay: öğretmen yalnız geçtiği branş ve kademelerde, başvurduğu aralıkla kesişen sınıflarda ders verir
create or replace function admin_approve_teacher(p_app uuid, p_display_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_app teacher_applications; v_levels jsonb; v_subjects text[]; v_min int; v_max int;
begin
  if not is_admin() then raise exception 'Yetki yok'; end if;
  select * into v_app from teacher_applications where id = p_app for update;
  if v_app.id is null then raise exception 'Başvuru yok'; end if;
  if v_app.stage <> 'oryantasyon' or v_app.contract_signed_at is null or v_app.submerchant_consent_at is null then
    raise exception 'Onay için sözleşme ve beyanlar tamamlanmalı';
  end if;
  if v_app.criminal_record_verified_at is null or v_app.diploma_verified_at is null or v_app.id_verified_at is null then
    raise exception 'Belgeler doğrulanmamış';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
           'subject', b ->> 'subject',
           'grades_min', greatest((b ->> 'grades_min')::int, v_app.grades_min),
           'grades_max', least((b ->> 'grades_max')::int, v_app.grades_max))), '[]'),
         array_agg(distinct b ->> 'subject'),
         min(greatest((b ->> 'grades_min')::int, v_app.grades_min)),
         max(least((b ->> 'grades_max')::int, v_app.grades_max))
    into v_levels, v_subjects, v_min, v_max
    from jsonb_array_elements(v_app.branch_tests) b where (b ->> 'passed')::boolean;
  if v_min is null then raise exception 'Geçilmiş branş testi yok'; end if;

  insert into teachers (profile_id, display_name, bio, intro_video_url, status, subjects, grades_min, grades_max,
                        branch_levels, commission_band, band_changed_at)
  values (v_app.profile_id, left(btrim(p_display_name), 40), v_app.bio, v_app.intro_video_url, 'golge',
          v_subjects, v_min, v_max, v_levels, 'baslangic', now())
  on conflict (profile_id) do update set status = 'golge', subjects = excluded.subjects,
    grades_min = excluded.grades_min, grades_max = excluded.grades_max, branch_levels = excluded.branch_levels;

  insert into teacher_payout_info (profile_id, payout_model, submerchant_status)
  values (v_app.profile_id, 'pazaryeri', 'bekliyor') on conflict (profile_id) do nothing;

  update profiles set role = 'ogretmen'
   where id = v_app.profile_id and role = 'veli' and not exists (select 1 from students s where s.parent_id = v_app.profile_id);

  update teacher_applications set stage = 'golge', orientation_done_at = coalesce(orientation_done_at, now()), updated_at = now()
   where id = p_app;
  insert into audit_log(actor_id, action, entity, entity_id) values (auth.uid(), 'teacher_approve', 'teacher_applications', p_app);
  return v_app.profile_id;
end $$;

revoke all on function teacher_branch_tests() from public, anon;
grant execute on function teacher_branch_tests() to authenticated;
revoke all on function grade_band(smallint) from public, anon;
grant execute on function grade_band(smallint) to authenticated;
