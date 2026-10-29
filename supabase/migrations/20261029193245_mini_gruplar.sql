-- Mini grup (3–4 öğrenci, aynı sınıf ve ders, haftada 2 ders, 60 dk).
-- Veli bekleme listesine yazılır; yönetim uyan öğrencileri ve öğretmeni seçip grubu kurar;
-- velilere davet gider (48 saat); 3 onay gelince grup "aktif" olur. Ödeme PayTR entegrasyonuyla bağlanacak.
-- Yazmalar yalnız fonksiyonlarla.

create table group_waitlist (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references profiles(id) on delete cascade,
  student_id  uuid not null references students(id) on delete cascade,
  subject     text not null check (subject ~ '^[a-z]{2,20}$'),
  grade       smallint not null check (grade between 1 and 12),
  preferred   jsonb not null default '[]',   -- [{weekday:1..7, from:"HH:MM", to:"HH:MM"}]; boş = fark etmez
  note        text check (char_length(note) <= 500),
  status      text not null default 'bekliyor' check (status in ('bekliyor', 'davet', 'grupta', 'iptal')),
  group_id    uuid,
  created_at  timestamptz not null default now()
);
create index on group_waitlist (parent_id);
create index on group_waitlist (subject, grade) where status = 'bekliyor';
create unique index group_waitlist_one_open on group_waitlist (student_id, subject) where status in ('bekliyor', 'davet', 'grupta');

create table mini_groups (
  id               uuid primary key default gen_random_uuid(),
  subject          text not null check (subject ~ '^[a-z]{2,20}$'),
  grade            smallint not null check (grade between 1 and 12),
  teacher_id       uuid not null references teachers(profile_id),
  schedule         jsonb not null,           -- [{weekday:1..7, start:"HH:MM"}] (2 ders/hafta, 60 dk)
  starts_on        date not null,
  price_per_lesson numeric(10,2) not null default 475,
  lessons_per_month smallint not null default 8,
  teacher_share    numeric(4,3) not null default 0.700,
  min_size         smallint not null default 3,
  max_size         smallint not null default 4,
  status           text not null default 'davet' check (status in ('davet', 'aktif', 'iptal')),
  invite_deadline  timestamptz not null,
  created_at       timestamptz not null default now()
);
create index on mini_groups (teacher_id);
alter table group_waitlist add constraint group_waitlist_group_fk foreign key (group_id) references mini_groups(id) on delete set null;

create table mini_group_members (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references mini_groups(id) on delete cascade,
  waitlist_id  uuid not null references group_waitlist(id) on delete cascade,
  parent_id    uuid not null references profiles(id) on delete cascade,
  student_id   uuid not null references students(id) on delete cascade,
  student_name text not null,               -- yalnız ad (öğretmen için)
  price        numeric(10,2) not null,      -- aylık paket fiyatı (davet anında)
  lesson_count smallint not null,
  status       text not null default 'davet' check (status in ('davet', 'onayladi', 'reddetti', 'suresi_doldu', 'iptal')),
  responded_at timestamptz,
  created_at   timestamptz not null default now(),
  unique (group_id, student_id)
);
create index on mini_group_members (parent_id);

alter table group_waitlist enable row level security;
alter table mini_groups enable row level security;
alter table mini_group_members enable row level security;
create policy admin_all on group_waitlist for all using (is_admin()) with check (is_admin());
create policy admin_all on mini_groups for all using (is_admin()) with check (is_admin());
create policy admin_all on mini_group_members for all using (is_admin()) with check (is_admin());
create policy wait_parent_read on group_waitlist for select using (parent_id = auth.uid());
create policy member_parent_read on mini_group_members for select using (parent_id = auth.uid());
-- Politikalar birbirine bakınca döngü olmasın diye yardımcılar RLS'siz çalışır
create or replace function is_group_teacher(p_group uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from mini_groups g where g.id = p_group and g.teacher_id = auth.uid())
$$;
create or replace function is_group_parent(p_group uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from mini_group_members m where m.group_id = p_group and m.parent_id = auth.uid())
$$;
create policy member_teacher_read on mini_group_members for select using (is_group_teacher(group_id));
create policy group_teacher_read on mini_groups for select using (teacher_id = auth.uid());
create policy group_parent_read on mini_groups for select using (is_group_parent(id));
revoke insert, update, delete on group_waitlist from authenticated, anon;
revoke insert, update, delete on mini_groups from authenticated, anon;
revoke insert, update, delete on mini_group_members from authenticated, anon;

-- Süresi geçen davetleri kapatır; öğrenci bekleme listesine döner (tembel: fonksiyonlar çağırır)
create or replace function expire_group_invites() returns void
language plpgsql security definer set search_path = public as $$
begin
  with x as (
    update mini_group_members m set status = 'suresi_doldu', responded_at = now()
      from mini_groups g
     where g.id = m.group_id and m.status = 'davet' and g.invite_deadline < now()
    returning m.waitlist_id
  )
  update group_waitlist w set status = 'bekliyor', group_id = null from x where w.id = x.waitlist_id;
end $$;

-- Veli: bekleme listesine yazılır (aynı çocuk + ders için açık kayıt varsa günceller)
create or replace function join_group_waitlist(p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_student uuid := (p ->> 'student_id')::uuid; v_grade smallint; x jsonb;
begin
  if auth.uid() is null or not is_parent_of(v_student) then raise exception 'Öğrenci bulunamadı'; end if;
  if coalesce(p ->> 'subject', '') !~ '^[a-z]{2,20}$' then raise exception 'Dersi seç'; end if;
  if jsonb_typeof(p -> 'preferred') <> 'array' or jsonb_array_length(p -> 'preferred') > 21 then raise exception 'Geçersiz saat tercihi'; end if;
  for x in select * from jsonb_array_elements(p -> 'preferred') loop
    if (x ->> 'weekday')::int not between 1 and 7 or (x ->> 'from')::time >= (x ->> 'to')::time
       or (x ->> 'from')::time < time '08:00' or (x ->> 'to')::time > time '21:00' then
      raise exception 'Geçersiz saat tercihi';
    end if;
  end loop;
  select grade into v_grade from students where id = v_student;
  select id into v_id from group_waitlist where student_id = v_student and subject = p ->> 'subject' and status in ('bekliyor', 'davet', 'grupta');
  if v_id is null then
    insert into group_waitlist (parent_id, student_id, subject, grade, preferred, note)
    values (auth.uid(), v_student, p ->> 'subject', v_grade, p -> 'preferred', nullif(btrim(p ->> 'note'), ''))
    returning id into v_id;
  else
    update group_waitlist set preferred = p -> 'preferred', note = nullif(btrim(p ->> 'note'), ''), grade = v_grade
     where id = v_id and status = 'bekliyor';
    if not found then raise exception 'Bu ders için zaten bir grup davetin ya da grubun var'; end if;
  end if;
  return v_id;
end $$;

-- Veli: bekleme listesinden çıkar
create or replace function leave_group_waitlist(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update group_waitlist set status = 'iptal' where id = p_id and parent_id = auth.uid() and status = 'bekliyor';
  if not found then raise exception 'Kayıt bulunamadı'; end if;
end $$;

-- Yönetim: verilen saatlerin (2 ders/hafta) tamamında müsait, branş ve sınıfı uyan öğretmenler
create or replace function admin_group_teacher_options(p_subject text, p_grade int, p_schedule jsonb)
returns table (teacher_id uuid, display_name text, status text, busy boolean)
language plpgsql stable security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'Yetki yok'; end if;
  return query
  select t.profile_id, t.display_name, t.status::text,
         exists (select 1 from mini_groups g, jsonb_array_elements(g.schedule) gs, jsonb_array_elements(p_schedule) s
                  where g.teacher_id = t.profile_id and g.status <> 'iptal'
                    and (gs ->> 'weekday') = (s ->> 'weekday') and (gs ->> 'start') = (s ->> 'start'))
    from teachers t
   where t.status in ('aktif', 'golge')
     and exists (select 1 from jsonb_array_elements(t.branch_levels) b
                  where b ->> 'subject' = p_subject and p_grade between (b ->> 'grades_min')::int and (b ->> 'grades_max')::int)
     and not exists (
       select 1 from jsonb_array_elements(p_schedule) s
        where not exists (select 1 from teacher_availability a
                           where a.teacher_id = t.profile_id and a.weekday = (s ->> 'weekday')::int
                             and a.start_time <= (s ->> 'start')::time and a.end_time >= (s ->> 'start')::time + interval '60 minutes'))
   order by t.display_name;
end $$;

-- Yönetim: grubu kurar ve seçilen bekleyenlere davet açar (48 saat)
create or replace function admin_create_group(p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_subject text := p ->> 'subject'; v_grade int := (p ->> 'grade')::int; v_teacher uuid := (p ->> 'teacher_id')::uuid;
        v_ids uuid[]; v_n int; s jsonb; w record;
begin
  if not is_admin() then raise exception 'Yetki yok'; end if;
  perform expire_group_invites();
  select array_agg(x::uuid) into v_ids from jsonb_array_elements_text(p -> 'waitlist_ids') x;
  v_n := coalesce(array_length(v_ids, 1), 0);
  if v_n < 3 or v_n > 4 then raise exception 'Grupta 3 ya da 4 öğrenci olmalı'; end if;
  if jsonb_typeof(p -> 'schedule') <> 'array' or jsonb_array_length(p -> 'schedule') <> 2 then raise exception 'Haftada iki ders saati seç'; end if;
  for s in select * from jsonb_array_elements(p -> 'schedule') loop
    if (s ->> 'weekday')::int not between 1 and 7 or (s ->> 'start')::time < time '08:00' or (s ->> 'start')::time > time '20:00'
       or extract(minute from (s ->> 'start')::time) not in (0, 30) then
      raise exception 'Geçersiz ders saati';
    end if;
  end loop;
  if ((p -> 'schedule' -> 0 ->> 'weekday') = (p -> 'schedule' -> 1 ->> 'weekday')) then raise exception 'İki ders farklı günlerde olmalı'; end if;
  if (p ->> 'starts_on')::date < current_date + 2 then raise exception 'Başlangıç en erken 2 gün sonra olabilir'; end if;
  if not exists (select 1 from admin_group_teacher_options(v_subject, v_grade, p -> 'schedule') o where o.teacher_id = v_teacher and not o.busy) then
    raise exception 'Öğretmen bu ders, sınıf ve saatlere uygun değil';
  end if;
  if (select count(*) from group_waitlist where id = any(v_ids) and status = 'bekliyor' and subject = v_subject and grade = v_grade) <> v_n then
    raise exception 'Seçilen öğrencilerin hepsi bu ders ve sınıfta beklemede olmalı';
  end if;

  insert into mini_groups (subject, grade, teacher_id, schedule, starts_on, invite_deadline)
  values (v_subject, v_grade, v_teacher, p -> 'schedule', (p ->> 'starts_on')::date, now() + interval '48 hours')
  returning id into v_id;

  for w in select gw.*, st.first_name from group_waitlist gw join students st on st.id = gw.student_id where gw.id = any(v_ids) loop
    insert into mini_group_members (group_id, waitlist_id, parent_id, student_id, student_name, price, lesson_count)
    select v_id, w.id, w.parent_id, w.student_id, w.first_name, g.price_per_lesson * g.lessons_per_month, g.lessons_per_month
      from mini_groups g where g.id = v_id;
  end loop;
  update group_waitlist set status = 'davet', group_id = v_id where id = any(v_ids);
  return v_id;
end $$;

-- Veli: daveti kabul ya da ret eder. Kabul eden sayısı en az değere ulaşınca grup aktif olur.
create or replace function respond_group_invite(p_member uuid, p_accept boolean) returns text
language plpgsql security definer set search_path = public as $$
declare v_m mini_group_members; v_g mini_groups; v_ok int;
begin
  perform expire_group_invites();
  select * into v_m from mini_group_members where id = p_member for update;
  if v_m.id is null or v_m.parent_id <> auth.uid() then raise exception 'Davet bulunamadı'; end if;
  select * into v_g from mini_groups where id = v_m.group_id for update;
  if v_m.status <> 'davet' or v_g.status = 'iptal' then raise exception 'Davetin süresi dolmuş ya da yanıtlanmış'; end if;
  if p_accept then
    update mini_group_members set status = 'onayladi', responded_at = now() where id = p_member;
    update group_waitlist set status = 'grupta' where id = v_m.waitlist_id;
    select count(*) into v_ok from mini_group_members where group_id = v_g.id and status = 'onayladi';
    if v_ok >= v_g.min_size and v_g.status = 'davet' then
      update mini_groups set status = 'aktif' where id = v_g.id;
      return 'aktif';
    end if;
    return 'onayladi';
  else
    update mini_group_members set status = 'reddetti', responded_at = now() where id = p_member;
    update group_waitlist set status = 'bekliyor', group_id = null where id = v_m.waitlist_id;
    return 'reddetti';
  end if;
end $$;

-- Yönetim: grubu iptal eder; onaylamamış ya da onaylamış herkes bekleme listesine döner
create or replace function admin_cancel_group(p_group uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'Yetki yok'; end if;
  update mini_groups set status = 'iptal' where id = p_group and status <> 'iptal';
  if not found then raise exception 'Grup bulunamadı'; end if;
  update group_waitlist w set status = 'bekliyor', group_id = null
    from mini_group_members m where m.group_id = p_group and m.waitlist_id = w.id and m.status in ('davet', 'onayladi');
  update mini_group_members set status = 'iptal' where group_id = p_group and status in ('davet', 'onayladi');
end $$;

revoke all on function expire_group_invites() from public, anon, authenticated;
revoke all on function is_group_teacher(uuid) from public, anon;
revoke all on function is_group_parent(uuid) from public, anon;
grant execute on function is_group_teacher(uuid) to authenticated;
grant execute on function is_group_parent(uuid) to authenticated;
revoke all on function join_group_waitlist(jsonb) from public, anon;
revoke all on function leave_group_waitlist(uuid) from public, anon;
revoke all on function admin_group_teacher_options(text, int, jsonb) from public, anon;
revoke all on function admin_create_group(jsonb) from public, anon;
revoke all on function respond_group_invite(uuid, boolean) from public, anon;
revoke all on function admin_cancel_group(uuid) from public, anon;
grant execute on function join_group_waitlist(jsonb) to authenticated;
grant execute on function leave_group_waitlist(uuid) to authenticated;
grant execute on function admin_group_teacher_options(text, int, jsonb) to authenticated;
grant execute on function admin_create_group(jsonb) to authenticated;
grant execute on function respond_group_invite(uuid, boolean) to authenticated;
grant execute on function admin_cancel_group(uuid) to authenticated;
