-- Kendi hazırladığımız denemelerde soru resimleri.
-- Resmi kitapçıklar burada SAKLANMAZ; onlar booklet_url ile dışarıdan açılır.
create table exam_question_images (
  exam_id    uuid not null references exams(id) on delete cascade,
  section    text not null,
  no         smallint not null,
  path       text not null check (char_length(path) between 5 and 200),
  width      smallint check (width between 1 and 4000),
  height     smallint check (height between 1 and 8000),
  updated_at timestamptz not null default now(),
  primary key (exam_id, section, no),
  foreign key (exam_id, section, no) references exam_questions(exam_id, section, no) on delete cascade
);

alter table exam_question_images enable row level security;
create policy admin_all on exam_question_images for all using (is_admin()) with check (is_admin());
-- Yayındaki sınavların soru resimleri herkese açık (cevap içermez)
create policy images_public on exam_question_images for select
  using (exists (select 1 from exams e where e.id = exam_id and e.status = 'yayinda'));

grant select on exam_question_images to anon, authenticated;
grant insert, update, delete on exam_question_images to authenticated;

-- Depolama: herkese açık okuma (CDN), yazma yalnızca admin
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exam-images', 'exam-images', true, 1572864, array['image/webp','image/png','image/jpeg'])
on conflict (id) do nothing;

create policy exam_images_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'exam-images' and public.is_admin());
create policy exam_images_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'exam-images' and public.is_admin())
  with check (bucket_id = 'exam-images' and public.is_admin());
create policy exam_images_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'exam-images' and public.is_admin());
