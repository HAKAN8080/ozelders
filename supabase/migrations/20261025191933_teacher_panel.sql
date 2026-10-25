-- Öğretmen paneli: müsaitlik kaydı (tek seferde, doğrulamalı) ve admin "aktif yap" (teachers.status kolonu
-- authenticated rolüne kapalı olduğu için güvenli fonksiyonla).

-- Haftalık müsaitliği bütünüyle değiştirir. p_slots: [{"weekday":1,"start":"18:00","end":"21:00"}, ...]
create or replace function teacher_save_availability(p_slots jsonb)
returns int language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_n int; s jsonb; v_s time; v_e time; v_d int;
begin
  if v_uid is null or not exists (select 1 from teachers where profile_id = v_uid and status in ('golge', 'aktif')) then
    raise exception 'Öğretmen hesabı bulunamadı';
  end if;
  if jsonb_typeof(p_slots) <> 'array' or jsonb_array_length(p_slots) > 60 then raise exception 'Geçersiz takvim'; end if;
  for s in select * from jsonb_array_elements(p_slots) loop
    v_d := (s ->> 'weekday')::int; v_s := (s ->> 'start')::time; v_e := (s ->> 'end')::time;
    if v_d not between 1 and 7 then raise exception 'Geçersiz gün'; end if;
    if v_s < time '08:00' or v_e > time '21:00' then raise exception 'Dersler 08:00–21:00 arasında olabilir'; end if;
    if v_e - v_s < interval '1 hour' then raise exception 'Her aralık en az 1 saat olmalı'; end if;
    if extract(minute from v_s)::int % 30 <> 0 or extract(minute from v_e)::int % 30 <> 0 then
      raise exception 'Saatler tam ya da buçuk olmalı';
    end if;
  end loop;
  -- Aynı günde çakışan aralık olmasın
  if exists (
    select 1 from jsonb_array_elements(p_slots) with ordinality a(v, i), jsonb_array_elements(p_slots) with ordinality b(v, j)
     where a.i < b.j and (a.v ->> 'weekday') = (b.v ->> 'weekday')
       and (a.v ->> 'start')::time < (b.v ->> 'end')::time and (b.v ->> 'start')::time < (a.v ->> 'end')::time
  ) then raise exception 'Aynı günde çakışan saat aralıkları var'; end if;

  delete from teacher_availability where teacher_id = v_uid;
  insert into teacher_availability (teacher_id, weekday, start_time, end_time)
  select v_uid, (x ->> 'weekday')::smallint, (x ->> 'start')::time, (x ->> 'end')::time from jsonb_array_elements(p_slots) x;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

create or replace function admin_activate_teacher(p_app uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_app teacher_applications;
begin
  if not is_admin() then raise exception 'Yetki yok'; end if;
  select * into v_app from teacher_applications where id = p_app for update;
  if v_app.id is null or v_app.stage <> 'golge' then raise exception 'Yalnız gölge dönemdeki öğretmen aktif yapılır'; end if;
  update teachers set status = 'aktif', activated_at = coalesce(activated_at, now()) where profile_id = v_app.profile_id;
  update teacher_applications set stage = 'aktif', updated_at = now() where id = p_app;
  insert into audit_log(actor_id, action, entity, entity_id) values (auth.uid(), 'teacher_activate', 'teacher_applications', p_app);
end $$;

revoke all on function teacher_save_availability(jsonb) from public, anon;
revoke all on function admin_activate_teacher(uuid) from public, anon;
grant execute on function teacher_save_availability(jsonb) to authenticated;
grant execute on function admin_activate_teacher(uuid) to authenticated;
