-- Kendi hazırladığımız denemelerin kitapçık PDF'i bizim depoda durur.
-- Resmi kitapçıklar burada SAKLANMAZ; onlar booklet_url ile kendi sitesinden açılır.
alter table exams add column booklet_path text check (booklet_path is null or char_length(booklet_path) between 5 and 200);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exam-booklets', 'exam-booklets', true, 31457280, array['application/pdf'])
on conflict (id) do nothing;

create policy exam_booklets_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'exam-booklets' and public.is_admin());
create policy exam_booklets_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'exam-booklets' and public.is_admin())
  with check (bucket_id = 'exam-booklets' and public.is_admin());
create policy exam_booklets_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'exam-booklets' and public.is_admin());
