-- Optik form için soru sayısı herkese açık olmalı; cevap anahtarı ise kapalı kalır.
alter table exam_sections add column question_count smallint not null default 0;

create or replace function trg_sync_question_count() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_exam uuid; v_sec text;
begin
  v_exam := coalesce(new.exam_id, old.exam_id);
  v_sec  := coalesce(new.section, old.section);
  update exam_sections s set question_count =
    (select count(*) from exam_questions q where q.exam_id = v_exam and q.section = v_sec)
   where s.exam_id = v_exam and s.code = v_sec;
  return null;
end $$;
revoke execute on function trg_sync_question_count() from public, anon, authenticated;

create trigger sync_question_count after insert or delete or update of section on exam_questions
for each row execute function trg_sync_question_count();

update exam_sections s set question_count =
  (select count(*) from exam_questions q where q.exam_id = s.exam_id and q.section = s.code);
