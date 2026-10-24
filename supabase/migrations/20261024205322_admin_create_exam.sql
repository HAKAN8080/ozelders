-- Admin: sınavı bölümleri ve cevap anahtarıyla TEK işlemde oluşturur (yarım kayıt kalmaz).
-- p = {"slug","title","subtitle","grade","booklet_url","booklet_label","duration_min",
--      "sections":[{"code","name","questions":[{"no","correct","topic"}]}]}
create or replace function admin_create_exam(p jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_sec jsonb; v_q jsonb; v_pos int := 0; v_url text;
begin
  if not is_admin() then raise exception 'Yetki yok'; end if;
  if jsonb_typeof(p -> 'sections') <> 'array' or jsonb_array_length(p -> 'sections') not between 1 and 8 then
    raise exception 'En az 1, en fazla 8 bölüm olmalı';
  end if;
  v_url := nullif(btrim(p ->> 'booklet_url'), '');
  if v_url is not null and v_url !~ '^https://[^\s]+$' then raise exception 'Kitapçık bağlantısı https:// ile başlamalı'; end if;

  insert into exams (slug, title, subtitle, grade, booklet_url, booklet_label, duration_min, status)
  values (p ->> 'slug', btrim(p ->> 'title'), nullif(btrim(p ->> 'subtitle'), ''),
          coalesce((p ->> 'grade')::smallint, 8), v_url, nullif(btrim(p ->> 'booklet_label'), ''),
          (p ->> 'duration_min')::smallint, 'taslak')
  returning id into v_id;

  for v_sec in select * from jsonb_array_elements(p -> 'sections') loop
    v_pos := v_pos + 1;
    insert into exam_sections (exam_id, code, name, position)
    values (v_id, v_sec ->> 'code', btrim(v_sec ->> 'name'), v_pos);
    for v_q in select * from jsonb_array_elements(v_sec -> 'questions') loop
      insert into exam_questions (exam_id, section, no, correct, topic)
      values (v_id, v_sec ->> 'code', (v_q ->> 'no')::smallint, upper(v_q ->> 'correct'),
              nullif(btrim(v_q ->> 'topic'), ''));
    end loop;
  end loop;

  insert into audit_log(actor_id, action, entity, entity_id) values (auth.uid(), 'exam_create', 'exams', v_id);
  return v_id;
end $$;

revoke all on function admin_create_exam(jsonb) from public, anon;
grant execute on function admin_create_exam(jsonb) to authenticated;
