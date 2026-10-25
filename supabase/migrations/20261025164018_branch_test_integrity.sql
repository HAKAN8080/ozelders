-- Branş testi bütünlüğü: cevap anahtarı başvurana gösterilmez, yalnız ilk deneme sayılır.

create or replace function get_exam_result(p_attempt uuid, p_token uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_a exam_attempts; v_e exams; v_rank int; v_count int; v_detail jsonb := null; v_topics jsonb := null;
begin
  select * into v_a from exam_attempts where id = p_attempt;
  if not found then return null; end if;
  if not (v_a.access_token = p_token or (auth.uid() is not null and v_a.user_id = auth.uid()) or is_admin()) then
    return null;
  end if;
  select * into v_e from exams where id = v_a.exam_id;

  select count(*) + 1 into v_rank from exam_attempts where exam_id = v_a.exam_id and total_net > v_a.total_net;
  select count(*) into v_count from exam_attempts where exam_id = v_a.exam_id;

  -- Soru bazında sonuç ve konu raporu: sadece giriş yapmış kullanıcı (veli hesabı)
  if auth.uid() is not null and (v_e.purpose = 'deneme' or is_admin()) then
    select jsonb_agg(jsonb_build_object(
             'section', q.section, 'no', q.no, 'correct', q.correct, 'topic', q.topic,
             'answer', v_a.answers -> q.section ->> q.no::text)
           order by s.position, q.no)
      into v_detail
      from exam_questions q join exam_sections s on s.exam_id = q.exam_id and s.code = q.section
     where q.exam_id = v_a.exam_id;

    select jsonb_agg(t order by t->>'section_pos', t->>'topic') into v_topics from (
      select jsonb_build_object(
               'section', q.section, 'section_pos', min(s.position)::text,
               'topic', coalesce(q.topic, 'Diğer'),
               'questions', string_agg(q.no::text, ', ' order by q.no),
               'total', count(*),
               'correct', count(*) filter (where (v_a.answers -> q.section ->> q.no::text) = q.correct)) as t
        from exam_questions q join exam_sections s on s.exam_id = q.exam_id and s.code = q.section
       where q.exam_id = v_a.exam_id
       group by q.section, coalesce(q.topic, 'Diğer')
    ) x;
  end if;

  return jsonb_build_object(
    'exam', jsonb_build_object('slug', v_e.slug, 'title', v_e.title, 'subtitle', v_e.subtitle),
    'name', v_a.display_name, 'created_at', v_a.created_at,
    'results', v_a.results, 'total_net', v_a.total_net,
    'rank', v_rank, 'participants', v_count,
    'is_owner', (auth.uid() is not null and v_a.user_id = auth.uid()),
    'claimable', (auth.uid() is not null and v_a.user_id is null and v_a.access_token = p_token),
    'detail', v_detail, 'topics', v_topics);
end $$;

create or replace function teacher_application_branch_test(p_attempt uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_app teacher_applications; v_att exam_attempts; v_total int; v_score numeric;
begin
  select * into v_app from teacher_applications where profile_id = auth.uid();
  if v_app.id is null or v_app.stage <> 'test' or v_app.rejected_at is not null then raise exception 'Branş testi aşamasında değilsin'; end if;
  select a.* into v_att from exam_attempts a join exams e on e.id = a.exam_id
   where a.id = p_attempt and a.user_id = auth.uid() and e.purpose = 'brans_testi';
  if v_att.id is null then raise exception 'Deneme bulunamadı'; end if;
  -- Yalnız bu testteki ilk deneme sayılır (tekrar çözüp en iyisini seçmek yok)
  if exists (select 1 from exam_attempts x where x.exam_id = v_att.exam_id and x.user_id = auth.uid()
              and (x.created_at, x.id) < (v_att.created_at, v_att.id)) then
    raise exception 'Bu testteki ilk denemen sayılır';
  end if;
  -- Test, başvurudaki branşlardan birini içermeli
  if not exists (select 1 from exam_sections s where s.exam_id = v_att.exam_id and s.code = any(v_app.subjects)) then
    raise exception 'Bu test seçtiğin branşlarla eşleşmiyor';
  end if;
  select coalesce(sum(question_count), 0) into v_total from exam_sections where exam_id = v_att.exam_id;
  -- Puan = toplam net / soru sayısı × 100
  v_score := round(100.0 * greatest(v_att.total_net, 0) / nullif(v_total, 0), 2);
  update teacher_applications set
    branch_test_attempt_id = v_att.id, branch_test_score = v_score, branch_test_at = now(),
    stage = case when v_score >= 85 then 'demo'::teacher_status else stage end,
    rejected_at = case when v_score < 85 then now() end,
    rejection_reason = case when v_score < 85 then 'Branş testi %85 barajının altında' end,
    updated_at = now()
  where id = v_app.id;
  return jsonb_build_object('score', v_score, 'passed', v_score >= 85);
end $$;
