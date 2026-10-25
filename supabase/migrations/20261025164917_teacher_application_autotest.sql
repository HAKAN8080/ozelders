-- Başvuru gönderilince doğrudan branş testi aşamasına geçer (ön eleme için admin beklenmez).

create or replace function teacher_application_save(p jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_app teacher_applications; v_uid uuid := auth.uid(); v_subjects text[];
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;
  select * into v_app from teacher_applications where profile_id = v_uid;

  if v_app.id is null or (v_app.stage = 'basvuru' and v_app.submitted_at is null) then
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
      not_civil_servant_declared, not_civil_servant_declared_at, submitted_at, stage, updated_at)
    values (
      v_uid, (p ->> 'segment')::teacher_segment, v_subjects[1], v_subjects,
      coalesce((p ->> 'grades_min')::smallint, 3), coalesce((p ->> 'grades_max')::smallint, 12),
      nullif(p ->> 'experience_years', '')::smallint,
      nullif(btrim(p ->> 'university'), ''), nullif(btrim(p ->> 'department'), ''),
      nullif(p ->> 'graduation_year', '')::smallint, nullif(btrim(p ->> 'bio'), ''),
      true, now(), case when coalesce((p ->> 'submit')::boolean, false) then now() end,
      case when coalesce((p ->> 'submit')::boolean, false) then 'test'::teacher_status else 'basvuru'::teacher_status end, now())
    on conflict (profile_id) do update set
      segment = excluded.segment, branch = excluded.branch, subjects = excluded.subjects,
      grades_min = excluded.grades_min, grades_max = excluded.grades_max,
      experience_years = excluded.experience_years, university = excluded.university,
      department = excluded.department, graduation_year = excluded.graduation_year, bio = excluded.bio,
      submitted_at = excluded.submitted_at, stage = excluded.stage, updated_at = now()
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
