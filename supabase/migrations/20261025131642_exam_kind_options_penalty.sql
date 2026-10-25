-- Lise ve YKS'ye açılış: sınav türü, şık sayısı ve yanlış cezası sınav başına.
--   LGS: 4 şık, 3 yanlış 1 doğruyu götürür
--   TYT/AYT/YDT: 5 şık, 4 yanlış 1 doğruyu götürür
--   Okul / diğer: genelde 4-5 şık, ceza yok (0)
alter table exams
  add column kind text not null default 'lgs' check (kind in ('lgs', 'tyt', 'ayt', 'ydt', 'okul', 'diger')),
  add column option_count smallint not null default 4 check (option_count in (4, 5)),
  add column wrong_penalty smallint not null default 3 check (wrong_penalty in (0, 3, 4));

create index on exams (kind, grade) where status = 'yayinda';

-- Puanlama: şık sayısı ve ceza sınavdan okunur
create or replace function submit_exam_attempt(
  p_exam uuid, p_answers jsonb, p_name text default null, p_grade smallint default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_exam exams; v_sec record; v_q record; v_ans text;
  v_d int; v_y int; v_b int; v_net numeric; v_total numeric := 0;
  v_results jsonb := '[]'::jsonb; v_clean jsonb := '{}'::jsonb; v_sec_clean jsonb;
  v_id uuid; v_token uuid; v_name text; v_letters text[];
begin
  select * into v_exam from exams where id = p_exam and status = 'yayinda';
  if not found then raise exception 'Sınav bulunamadı ya da yayında değil'; end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then raise exception 'Geçersiz cevap formatı'; end if;
  if pg_column_size(p_answers) > 20000 then raise exception 'Cevap verisi çok büyük'; end if;
  v_letters := case when v_exam.option_count = 5 then array['A','B','C','D','E'] else array['A','B','C','D'] end;

  for v_sec in select * from exam_sections where exam_id = p_exam order by position loop
    v_d := 0; v_y := 0; v_b := 0; v_sec_clean := '{}'::jsonb;
    for v_q in select * from exam_questions where exam_id = p_exam and section = v_sec.code order by no loop
      v_ans := upper(coalesce(p_answers -> v_sec.code ->> v_q.no::text, ''));
      if not (v_ans = any(v_letters)) then
        v_b := v_b + 1;
      else
        v_sec_clean := v_sec_clean || jsonb_build_object(v_q.no::text, v_ans);
        if v_ans = v_q.correct then v_d := v_d + 1; else v_y := v_y + 1; end if;
      end if;
    end loop;
    v_net := case when v_exam.wrong_penalty = 0 then v_d
                  else round(v_d - v_y / v_exam.wrong_penalty::numeric, 2) end;
    v_total := v_total + v_net;
    v_results := v_results || jsonb_build_object(
      'code', v_sec.code, 'name', v_sec.name, 'dogru', v_d, 'yanlis', v_y, 'bos', v_b, 'net', v_net);
    v_clean := v_clean || jsonb_build_object(v_sec.code, v_sec_clean);
  end loop;

  v_name := nullif(btrim(regexp_replace(coalesce(p_name, ''), '[^A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû ]', '', 'g')), '');
  insert into exam_attempts (exam_id, user_id, display_name, grade, answers, results, total_net)
  values (p_exam, auth.uid(), left(v_name, 40),
          case when p_grade between 1 and 12 then p_grade end, v_clean, v_results, v_total)
  returning id, access_token into v_id, v_token;

  return jsonb_build_object('id', v_id, 'token', v_token);
end $$;

-- Admin: tür / şık / ceza da tek işlemde
create or replace function admin_create_exam(p jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_sec jsonb; v_q jsonb; v_pos int := 0; v_url text; v_opts smallint;
begin
  if not is_admin() then raise exception 'Yetki yok'; end if;
  if jsonb_typeof(p -> 'sections') <> 'array' or jsonb_array_length(p -> 'sections') not between 1 and 8 then
    raise exception 'En az 1, en fazla 8 bölüm olmalı';
  end if;
  v_url := nullif(btrim(p ->> 'booklet_url'), '');
  if v_url is not null and v_url !~ '^https://[^\s]+$' then raise exception 'Kitapçık bağlantısı https:// ile başlamalı'; end if;
  v_opts := coalesce((p ->> 'option_count')::smallint, 4);

  insert into exams (slug, title, subtitle, grade, booklet_url, booklet_label, duration_min, status, kind, option_count, wrong_penalty)
  values (p ->> 'slug', btrim(p ->> 'title'), nullif(btrim(p ->> 'subtitle'), ''),
          coalesce((p ->> 'grade')::smallint, 8), v_url, nullif(btrim(p ->> 'booklet_label'), ''),
          (p ->> 'duration_min')::smallint, 'taslak',
          coalesce(p ->> 'kind', 'lgs'), v_opts, coalesce((p ->> 'wrong_penalty')::smallint, 3))
  returning id into v_id;

  for v_sec in select * from jsonb_array_elements(p -> 'sections') loop
    v_pos := v_pos + 1;
    insert into exam_sections (exam_id, code, name, position)
    values (v_id, v_sec ->> 'code', btrim(v_sec ->> 'name'), v_pos);
    for v_q in select * from jsonb_array_elements(v_sec -> 'questions') loop
      if v_opts = 4 and upper(v_q ->> 'correct') = 'E' then
        raise exception '4 şıklı sınavda E cevabı olamaz (% / %. soru)', v_sec ->> 'name', v_q ->> 'no';
      end if;
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
revoke all on function submit_exam_attempt(uuid, jsonb, text, smallint) from public;
grant execute on function submit_exam_attempt(uuid, jsonb, text, smallint) to anon, authenticated;
