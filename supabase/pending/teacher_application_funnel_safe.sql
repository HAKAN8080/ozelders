-- Öğretmen başvuru hunisi: pazaryeri modeli, komisyon bandı, 3.–12. sınıf, çoklu branş.
-- Aşamalar: basvuru → test → demo → belge → oryantasyon → golge (onaylı, ilk 3 ders gözetimli) → aktif

-- 1) Başvuru tablosu
alter table teacher_applications
  add column stage teacher_status not null default 'basvuru',
  add column subjects text[] not null default '{}',
  add column university text check (char_length(university) <= 120),
  add column department text check (char_length(department) <= 120),
  add column graduation_year smallint check (graduation_year between 1960 and 2035),
  add column bio text check (char_length(bio) <= 1200),
  add column demo_availability text check (char_length(demo_availability) <= 400),
  add column demo_scheduled_at timestamptz,
  add column demo_meeting_url text check (demo_meeting_url ~ '^https://'),
  add column branch_test_attempt_id uuid references exam_attempts(id) on delete set null,
  -- Belge doğrulama: e-Devlet barkodları yalnız doğrulanana kadar tutulur, doğrulanınca silinir (KVKK)
  add column diploma_barcode text check (char_length(diploma_barcode) <= 40),
  add column criminal_record_barcode text check (char_length(criminal_record_barcode) <= 40),
  -- Pazaryeri beyanları (zaman damgasıyla)
  add column independent_contractor_ack_at timestamptz,  -- bağımsız hizmet sağlayıcıyım, vergim bana ait
  add column submerchant_consent_at timestamptz,         -- ödeme kuruluşunda bireysel alt mağaza olmayı kabul
  add column tax_status text check (tax_status in ('bireysel', 'serbest_meslek', 'sirket')),
  add column submitted_at timestamptz,
  add column rejected_at timestamptz,
  add column updated_at timestamptz not null default now();

alter table teacher_applications alter column grades_min set default 3, alter column grades_max set default 12;
alter table teacher_applications add constraint app_grades check (grades_min between 1 and 12 and grades_max between grades_min and 12);
create index on teacher_applications (stage) where rejected_at is null;

-- 2) Öğretmen: branşlar, sınıf aralığı, komisyon bandı
alter table teachers
  add column subjects text[] not null default '{}',
  add column commission_band text not null default 'baslangic'
    check (commission_band in ('baslangic', 'gumus', 'altin', 'usta')),
  add column band_changed_at timestamptz;
alter table teachers alter column grades_min set default 3, alter column grades_max set default 12;

-- 3) Ödeme modeli: pazaryeri (bireysel alt mağaza); TCKN/IBAN bizde tutulmaz
alter table teacher_payout_info
  add column payout_model text not null default 'pazaryeri' check (payout_model in ('pazaryeri', 'smm', 'bordro', 'stopajli')),
  add column submerchant_key text,
  add column submerchant_status text check (submerchant_status in ('bekliyor', 'aktif', 'hata')),
  add column iban_last4 text check (iban_last4 ~ '^[0-9]{4}$');

-- 4) Branş testleri sınav motorunu kullanır; deneme listesinde görünmez
alter table exams add column purpose text not null default 'deneme' check (purpose in ('deneme', 'brans_testi'));

-- ---------------------------------------------------------------------
-- Başvuran: başvuru oluşturur / günceller. Aşamaya göre yalnız izinli alanlar.
-- ---------------------------------------------------------------------
create or replace function teacher_application_save(p jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_app teacher_applications; v_uid uuid := auth.uid(); v_subjects text[];
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;
  select * into v_app from teacher_applications where profile_id = v_uid;

  if v_app.id is null or v_app.stage = 'basvuru' and v_app.submitted_at is null then
    -- İlk adım: başvuru formu
    v_subjects := array(select distinct jsonb_array_elements_text(coalesce(p -> 'subjects', '[]'::jsonb)));
    if coalesce(array_length(v_subjects, 1), 0) not between 1 and 4 then raise exception 'En az 1, en fazla 4 branş seç'; end if;
    if exists (select 1 from unnest(v_subjects) s where s !~ '^[a-z]{2,20}$') then raise exception 'Geçersiz branş'; end if;
    if coalesce((p ->> 'not_civil_servant')::boolean, false) is not true then
      raise exception 'Devlet memuru olmadığına dair beyan gerekli';
    end if;
    if (p ->> 'segment') is null then raise exception 'Durumunu seç'; end if;

    insert into teacher_applications as a (
      profile_id, segment, branch, subjects, grades_min, grades_max, experience_years,
      university, department, graduation_year, bio,
      not_civil_servant_declared, not_civil_servant_declared_at, submitted_at, updated_at)
    values (
      v_uid, (p ->> 'segment')::teacher_segment, v_subjects[1], v_subjects,
      coalesce((p ->> 'grades_min')::smallint, 3), coalesce((p ->> 'grades_max')::smallint, 12),
      nullif(p ->> 'experience_years', '')::smallint,
      nullif(btrim(p ->> 'university'), ''), nullif(btrim(p ->> 'department'), ''),
      nullif(p ->> 'graduation_year', '')::smallint, nullif(btrim(p ->> 'bio'), ''),
      true, now(), case when coalesce((p ->> 'submit')::boolean, false) then now() end, now())
    on conflict (profile_id) do update set
      segment = excluded.segment, branch = excluded.branch, subjects = excluded.subjects,
      grades_min = excluded.grades_min, grades_max = excluded.grades_max,
      experience_years = excluded.experience_years, university = excluded.university,
      department = excluded.department, graduation_year = excluded.graduation_year, bio = excluded.bio,
      submitted_at = excluded.submitted_at, updated_at = now()
    returning * into v_app;
    if v_app.submitted_at is not null then
      insert into audit_log(actor_id, action, entity, entity_id) values (v_uid, 'teacher_apply', 'teacher_applications', v_app.id);
    end if;
    return v_app.id;
  end if;

  if v_app.rejected_at is not null then raise exception 'Başvuru sonuçlandı'; end if;

  -- Sonraki aşamalarda başvuranın dolduracağı alanlar
  if v_app.stage = 'demo' then
    update teacher_applications set
      intro_video_url = coalesce(nullif(btrim(p ->> 'intro_video_url'), ''), intro_video_url),
      demo_availability = coalesce(nullif(btrim(p ->> 'demo_availability'), ''), demo_availability),
      updated_at = now()
    where id = v_app.id;
  elsif v_app.stage = 'belge' then
    if coalesce((p ->> 'criminal_record_consent')::boolean, false) is not true then
      raise exception 'Adli sicil kaydı sorgusu için açık rıza gerekli';
    end if;
    update teacher_applications set
      diploma_barcode = nullif(btrim(p ->> 'diploma_barcode'), ''),
      criminal_record_barcode = nullif(btrim(p ->> 'criminal_record_barcode'), ''),
      criminal_record_consent_at = coalesce(criminal_record_consent_at, now()),
      updated_at = now()
    where id = v_app.id;
  elsif v_app.stage = 'oryantasyon' then
    if coalesce((p ->> 'independent_contractor')::boolean, false) is not true
       or coalesce((p ->> 'submerchant_consent')::boolean, false) is not true
       or coalesce((p ->> 'contract')::boolean, false) is not true then
      raise exception 'Sözleşme ve beyanların hepsi onaylanmalı';
    end if;
    if (p ->> 'tax_status') not in ('bireysel', 'serbest_meslek', 'sirket') then raise exception 'Vergi durumunu seç'; end if;
    update teacher_applications set
      independent_contractor_ack_at = coalesce(independent_contractor_ack_at, now()),
      submerchant_consent_at = coalesce(submerchant_consent_at, now()),
      contract_signed_at = coalesce(contract_signed_at, now()),
      contract_version = coalesce(p ->> 'contract_version', '2026-10'),
      tax_status = p ->> 'tax_status',
      updated_at = now()
    where id = v_app.id;
  else
    raise exception 'Bu aşamada doldurulacak bir şey yok';
  end if;
  return v_app.id;
end $$;

-- Branş testi: başvuranın kendi denemesini bağlar; %85 ve üstü → demo aşaması
create or replace function teacher_application_branch_test(p_attempt uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_app teacher_applications; v_att exam_attempts; v_total int; v_score numeric;
begin
  select * into v_app from teacher_applications where profile_id = auth.uid();
  if v_app.id is null or v_app.stage <> 'test' or v_app.rejected_at is not null then raise exception 'Branş testi aşamasında değilsin'; end if;
  select a.* into v_att from exam_attempts a join exams e on e.id = a.exam_id
   where a.id = p_attempt and a.user_id = auth.uid() and e.purpose = 'brans_testi';
  if v_att.id is null then raise exception 'Deneme bulunamadı'; end if;
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

-- ---------------------------------------------------------------------
-- Admin: onay → öğretmen kaydı (gölge dönem), rol, ödeme bilgisi satırı
-- ---------------------------------------------------------------------
create or replace function admin_approve_teacher(p_app uuid, p_display_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_app teacher_applications;
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

  insert into teachers (profile_id, display_name, bio, intro_video_url, status, subjects, grades_min, grades_max, commission_band, band_changed_at)
  values (v_app.profile_id, left(btrim(p_display_name), 40), v_app.bio, v_app.intro_video_url, 'golge',
          v_app.subjects, v_app.grades_min, v_app.grades_max, 'baslangic', now())
  on conflict (profile_id) do update set status = 'golge', subjects = excluded.subjects,
    grades_min = excluded.grades_min, grades_max = excluded.grades_max;

  insert into teacher_payout_info (profile_id, payout_model, submerchant_status)
  values (v_app.profile_id, 'pazaryeri', 'bekliyor') on conflict (profile_id) do nothing;

  -- Velisi olduğu öğrenci yoksa rolü öğretmen yap (hem veli hem öğretmen olanlar veli kalır)
  update profiles set role = 'ogretmen'
   where id = v_app.profile_id and role = 'veli' and not exists (select 1 from students s where s.parent_id = v_app.profile_id);

  update teacher_applications set stage = 'golge', orientation_done_at = coalesce(orientation_done_at, now()), updated_at = now()
   where id = p_app;
  insert into audit_log(actor_id, action, entity, entity_id) values (auth.uid(), 'teacher_approve', 'teacher_applications', p_app);
  return v_app.profile_id;
end $$;

revoke all on function teacher_application_save(jsonb) from public, anon;
revoke all on function teacher_application_branch_test(uuid) from public, anon;
revoke all on function admin_approve_teacher(uuid, text) from public, anon;
grant execute on function teacher_application_save(jsonb) to authenticated;
grant execute on function teacher_application_branch_test(uuid) to authenticated;
grant execute on function admin_approve_teacher(uuid, text) to authenticated;

-- Başvuran tabloya doğrudan yazamaz (yalnız fonksiyonlar; aşama atlatmayı engeller). Admin RLS ile yazar.
revoke insert on teacher_applications from authenticated, anon;
