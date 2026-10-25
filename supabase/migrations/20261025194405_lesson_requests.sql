-- Veli ders talebi → uygun öğretmen listesi (en iyi 3'ü "sistem önerisi") → ücretsiz 20 dk tanışma dersi isteği
-- → öğretmen 24 saat içinde kabul/ret. Yazmalar yalnız fonksiyonlarla.

create table lesson_requests (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references profiles(id) on delete cascade,
  student_id  uuid not null references students(id) on delete cascade,
  subject     text not null check (subject ~ '^[a-z]{2,20}$'),
  goal        text not null check (goal in ('okul', 'lgs', 'yks')),
  preferred   jsonb not null default '[]',   -- [{weekday:1..7, from:"HH:MM", to:"HH:MM"}]
  note        text check (char_length(note) <= 500),
  attempt_id  uuid references exam_attempts(id) on delete set null,
  status      text not null default 'acik' check (status in ('acik', 'eslesti', 'iptal')),
  teacher_id  uuid references teachers(profile_id),
  created_at  timestamptz not null default now()
);
create index on lesson_requests (parent_id);

create table intro_offers (
  id           uuid primary key default gen_random_uuid(),
  request_id   uuid not null references lesson_requests(id) on delete cascade,
  teacher_id   uuid not null references teachers(profile_id) on delete cascade,
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  status       text not null default 'bekliyor' check (status in ('bekliyor', 'kabul', 'ret', 'suresi_doldu', 'iptal')),
  expires_at   timestamptz not null,
  meeting_url  text check (meeting_url ~ '^https://'),
  reject_note  text check (char_length(reject_note) <= 300),
  responded_at timestamptz,
  created_at   timestamptz not null default now()
);
create index on intro_offers (teacher_id, status);
create index on intro_offers (request_id);

alter table lesson_requests enable row level security;
alter table intro_offers enable row level security;
create policy admin_all on lesson_requests for all using (is_admin()) with check (is_admin());
create policy admin_all on intro_offers for all using (is_admin()) with check (is_admin());
create policy req_parent_read on lesson_requests for select using (parent_id = auth.uid());
create policy offer_parent_read on intro_offers for select
  using (exists (select 1 from lesson_requests r where r.id = request_id and r.parent_id = auth.uid()));
create policy offer_teacher_read on intro_offers for select using (teacher_id = auth.uid());
revoke insert, update on lesson_requests from authenticated, anon;
revoke insert, update on intro_offers from authenticated, anon;

-- Süresi geçen istekleri kapatır (tembel: ilgili fonksiyonlar çağırır)
create or replace function expire_intro_offers() returns void language sql security definer set search_path = public as $$
  update intro_offers set status = 'suresi_doldu' where status = 'bekliyor' and expires_at < now();
$$;

-- Haftalık müsaitlik ile velinin tercih ettiği aralıkların kesişimi (dakika)
create or replace function availability_overlap(p_teacher uuid, p_pref jsonb) returns int
language sql stable security definer set search_path = public as $$
  select case when jsonb_array_length(coalesce(p_pref, '[]')) = 0
    then coalesce((select sum(extract(epoch from (end_time - start_time)) / 60)::int from teacher_availability where teacher_id = p_teacher), 0)
    else coalesce((
      select sum(greatest(0, extract(epoch from (least(a.end_time, (p ->> 'to')::time) - greatest(a.start_time, (p ->> 'from')::time))) / 60))::int
        from teacher_availability a, jsonb_array_elements(p_pref) p
       where a.teacher_id = p_teacher and a.weekday = (p ->> 'weekday')::int), 0)
  end
$$;

create or replace function create_lesson_request(p jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_student uuid := (p ->> 'student_id')::uuid; v_attempt uuid := nullif(p ->> 'attempt_id', '')::uuid; x jsonb;
begin
  if auth.uid() is null or not is_parent_of(v_student) then raise exception 'Öğrenci bulunamadı'; end if;
  if jsonb_typeof(p -> 'preferred') <> 'array' or jsonb_array_length(p -> 'preferred') > 21 then raise exception 'Geçersiz saat tercihi'; end if;
  for x in select * from jsonb_array_elements(p -> 'preferred') loop
    if (x ->> 'weekday')::int not between 1 and 7 or (x ->> 'from')::time >= (x ->> 'to')::time
       or (x ->> 'from')::time < time '08:00' or (x ->> 'to')::time > time '21:00' then
      raise exception 'Geçersiz saat tercihi';
    end if;
  end loop;
  if v_attempt is not null and not exists (select 1 from exam_attempts where id = v_attempt and user_id = auth.uid()) then
    v_attempt := null;
  end if;
  -- Aynı çocuk ve ders için açık talep varsa onu güncelle
  select id into v_id from lesson_requests where student_id = v_student and subject = p ->> 'subject' and status = 'acik';
  if v_id is null then
    insert into lesson_requests (parent_id, student_id, subject, goal, preferred, note, attempt_id)
    values (auth.uid(), v_student, p ->> 'subject', p ->> 'goal', p -> 'preferred', nullif(btrim(p ->> 'note'), ''), v_attempt)
    returning id into v_id;
  else
    update lesson_requests set goal = p ->> 'goal', preferred = p -> 'preferred', note = nullif(btrim(p ->> 'note'), ''),
      attempt_id = coalesce(v_attempt, attempt_id) where id = v_id;
  end if;
  return v_id;
end $$;

-- Ders + sınıf + saat uyumuna göre tüm uygun öğretmenler; en yüksek puanlı 3'ü önerilir
create or replace function request_teacher_options(p_request uuid)
returns table (teacher_id uuid, display_name text, bio text, intro_video_url text, experience_years smallint,
               department text, is_new boolean, overlap_minutes int, score numeric, recommended boolean)
language plpgsql stable security definer set search_path = public as $$
declare v_r lesson_requests; v_grade smallint;
begin
  select * into v_r from lesson_requests where id = p_request;
  if v_r.id is null or not (v_r.parent_id = auth.uid() or is_admin()) then raise exception 'Talep bulunamadı'; end if;
  select grade into v_grade from students where id = v_r.student_id;
  return query
  with c as (
    select t.profile_id, t.display_name, t.bio, t.intro_video_url, a.experience_years, a.department, t.status = 'golge' as is_new,
           availability_overlap(t.profile_id, v_r.preferred) as ov,
           (select count(*) from lessons l where l.teacher_id = t.profile_id and l.status = 'planlandi'
              and l.starts_at between now() and now() + interval '14 days') as load,
           t.commission_band
      from teachers t
      left join teacher_applications a on a.profile_id = t.profile_id
     where t.status in ('aktif', 'golge')
       and exists (select 1 from jsonb_array_elements(t.branch_levels) b
                    where b ->> 'subject' = v_r.subject and v_grade between (b ->> 'grades_min')::int and (b ->> 'grades_max')::int)
  ), s as (
    select c.*, round(
        least(c.ov, 600) / 600.0 * 40
      + case c.commission_band when 'usta' then 30 when 'altin' then 22 when 'gumus' then 14 else 6 end
      + case when c.is_new then 0 else 10 end
      + case when char_length(coalesce(c.bio, '')) >= 80 then 5 else 0 end
      + case when c.intro_video_url is not null then 5 else 0 end
      - least(c.load * 0.5, 10), 1) as sc
      from c where c.ov >= 60
  )
  select s.profile_id, s.display_name, s.bio, s.intro_video_url, s.experience_years, s.department, s.is_new, s.ov, s.sc,
         -- Az adayda yıldız anlamsızlaşmasın: 1 aday → yok, 2–3 → 1, 4–6 → 2, 7+ → 3
         count(*) over () >= 2 and row_number() over (order by s.sc desc, s.ov desc) <= least(3, ceil(count(*) over () / 3.0))
    from s order by s.sc desc, s.ov desc;
end $$;

-- Tanışma dersi için seçilebilir başlangıçlar: önümüzdeki 7 gün, 30 dakikada bir, 20 dakikalık
create or replace function teacher_intro_slots(p_request uuid, p_teacher uuid)
returns setof timestamptz language plpgsql stable security definer set search_path = public as $$
declare v_r lesson_requests;
begin
  select * into v_r from lesson_requests where id = p_request;
  if v_r.id is null or not (v_r.parent_id = auth.uid() or is_admin()) then raise exception 'Talep bulunamadı'; end if;
  return query
  select ts from (
    select (d::date + a.start_time + (k * interval '30 minutes')) at time zone 'Europe/Istanbul' as ts, a.end_time, d::date as day, a.start_time, k
      from generate_series(current_date, current_date + 7, interval '1 day') d
      join teacher_availability a on a.teacher_id = p_teacher and a.weekday = extract(isodow from d)::int
      cross join generate_series(0, 26) k
  ) x
  where (x.day + x.start_time + x.k * interval '30 minutes') + interval '20 minutes' <= x.day + x.end_time
    and x.ts >= now() + interval '12 hours'
    and x.ts <= now() + interval '7 days'
    and (jsonb_array_length(v_r.preferred) = 0 or exists (
          select 1 from jsonb_array_elements(v_r.preferred) p
           where (p ->> 'weekday')::int = extract(isodow from x.day)::int
             and (x.ts at time zone 'Europe/Istanbul')::time >= (p ->> 'from')::time
             and (x.ts at time zone 'Europe/Istanbul')::time + interval '20 minutes' <= (p ->> 'to')::time))
    and not exists (select 1 from lessons l where l.teacher_id = p_teacher and l.status in ('planlandi', 'tamamlandi')
                     and tstzrange(l.starts_at, l.ends_at) && tstzrange(x.ts, x.ts + interval '20 minutes'))
    and not exists (select 1 from intro_offers o where o.teacher_id = p_teacher
                     and (o.status = 'kabul' or (o.status = 'bekliyor' and o.expires_at > now()))
                     and tstzrange(o.starts_at, o.ends_at) && tstzrange(x.ts, x.ts + interval '20 minutes'))
  order by ts
  limit 60;
end $$;

create or replace function request_intro(p_request uuid, p_teacher uuid, p_at timestamptz) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_r lesson_requests; v_id uuid;
begin
  perform expire_intro_offers();
  select * into v_r from lesson_requests where id = p_request for update;
  if v_r.id is null or v_r.parent_id <> auth.uid() then raise exception 'Talep bulunamadı'; end if;
  if v_r.status <> 'acik' then raise exception 'Bu talep için öğretmen zaten belirlendi'; end if;
  if exists (select 1 from intro_offers where request_id = p_request and status = 'bekliyor') then
    raise exception 'Bekleyen bir tanışma isteğin var; yanıtı bekle ya da iptal et';
  end if;
  if not exists (select 1 from request_teacher_options(p_request) o where o.teacher_id = p_teacher) then
    raise exception 'Bu öğretmen talebinle eşleşmiyor';
  end if;
  if not exists (select 1 from teacher_intro_slots(p_request, p_teacher) s where s = p_at) then
    raise exception 'Seçtiğin saat artık uygun değil; başka bir saat seç';
  end if;
  insert into intro_offers (request_id, teacher_id, starts_at, ends_at, expires_at)
  values (p_request, p_teacher, p_at, p_at + interval '20 minutes', least(now() + interval '24 hours', p_at - interval '2 hours'))
  returning id into v_id;
  return v_id;
end $$;

create or replace function cancel_intro(p_offer uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update intro_offers o set status = 'iptal', responded_at = now()
   where o.id = p_offer and o.status in ('bekliyor', 'kabul') and o.starts_at > now()
     and exists (select 1 from lesson_requests r where r.id = o.request_id and r.parent_id = auth.uid());
  if not found then raise exception 'İstek iptal edilemedi'; end if;
  update lesson_requests r set status = 'acik', teacher_id = null
    from intro_offers o where o.id = p_offer and r.id = o.request_id and r.status = 'eslesti';
end $$;

-- Öğretmenin gördüğü istekler: çocuğun adı, sınıfı, hedefi ve (varsa) deneme sonucu
create or replace function teacher_intro_offers()
returns table (offer_id uuid, status text, starts_at timestamptz, expires_at timestamptz, meeting_url text,
               student_name text, grade smallint, subject text, goal text, note text, preferred jsonb,
               exam_title text, exam_results jsonb)
language plpgsql security definer set search_path = public as $$
begin
  perform expire_intro_offers();
  return query
  select o.id, o.status, o.starts_at, o.expires_at, o.meeting_url, s.first_name, s.grade, r.subject, r.goal, r.note, r.preferred,
         e.title, x.results
    from intro_offers o
    join lesson_requests r on r.id = o.request_id
    join students s on s.id = r.student_id
    left join exam_attempts x on x.id = r.attempt_id
    left join exams e on e.id = x.exam_id
   where o.teacher_id = auth.uid() and (o.status = 'bekliyor' or (o.status = 'kabul' and o.ends_at > now() - interval '1 day'))
   order by o.status desc, o.starts_at;
end $$;

create or replace function teacher_respond_intro(p_offer uuid, p_accept boolean, p_meeting_url text default null, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_o intro_offers;
begin
  perform expire_intro_offers();
  select * into v_o from intro_offers where id = p_offer and teacher_id = auth.uid() for update;
  if v_o.id is null then raise exception 'İstek bulunamadı'; end if;
  if v_o.status <> 'bekliyor' then raise exception 'Bu isteğin süresi doldu ya da yanıtlandı'; end if;
  if p_accept then
    if p_meeting_url is not null and p_meeting_url !~ '^https://\S+$' then raise exception 'Görüşme bağlantısı https:// ile başlamalı'; end if;
    update intro_offers set status = 'kabul', responded_at = now(), meeting_url = nullif(btrim(p_meeting_url), '') where id = p_offer;
    update lesson_requests set status = 'eslesti', teacher_id = v_o.teacher_id where id = v_o.request_id;
  else
    update intro_offers set status = 'ret', responded_at = now(), reject_note = left(nullif(btrim(p_note), ''), 300) where id = p_offer;
  end if;
end $$;

revoke all on function expire_intro_offers() from public, anon, authenticated;
revoke all on function availability_overlap(uuid, jsonb) from public, anon, authenticated;
revoke all on function create_lesson_request(jsonb) from public, anon;
revoke all on function request_teacher_options(uuid) from public, anon;
revoke all on function teacher_intro_slots(uuid, uuid) from public, anon;
revoke all on function request_intro(uuid, uuid, timestamptz) from public, anon;
revoke all on function cancel_intro(uuid) from public, anon;
revoke all on function teacher_intro_offers() from public, anon;
revoke all on function teacher_respond_intro(uuid, boolean, text, text) from public, anon;
grant execute on function create_lesson_request(jsonb) to authenticated;
grant execute on function request_teacher_options(uuid) to authenticated;
grant execute on function teacher_intro_slots(uuid, uuid) to authenticated;
grant execute on function request_intro(uuid, uuid, timestamptz) to authenticated;
grant execute on function cancel_intro(uuid) to authenticated;
grant execute on function teacher_intro_offers() to authenticated;
grant execute on function teacher_respond_intro(uuid, boolean, text, text) to authenticated;
