-- Tanışmadan sonra paket seçimi. Ödeme PayTR pazaryeri entegrasyonuyla bağlanacak; o zamana kadar sipariş "odeme_bekliyor".

create table package_orders (
  id           uuid primary key default gen_random_uuid(),
  request_id   uuid not null references lesson_requests(id) on delete cascade,
  parent_id    uuid not null references profiles(id) on delete cascade,
  student_id   uuid not null references students(id) on delete cascade,
  student_name text not null,                    -- yalnız ad (öğretmen paneli için)
  grade        smallint not null,
  teacher_id   uuid not null references teachers(profile_id),
  product_code text not null references package_products(code),
  price        numeric(10,2) not null,          -- seçim anındaki fiyat
  lesson_count smallint not null,
  status       text not null default 'odeme_bekliyor' check (status in ('odeme_bekliyor', 'odendi', 'iptal')),
  created_at   timestamptz not null default now()
);
create index on package_orders (parent_id);
create index on package_orders (teacher_id);
create unique index package_orders_one_open on package_orders (request_id) where status = 'odeme_bekliyor';

alter table package_orders enable row level security;
create policy admin_all on package_orders for all using (is_admin()) with check (is_admin());
create policy order_parent_read on package_orders for select using (parent_id = auth.uid());
create policy order_teacher_read on package_orders for select using (teacher_id = auth.uid());
revoke insert, update on package_orders from authenticated, anon;

-- Veli: tanışması yapılmış (saati geçmiş, kabul edilmiş) talep için ana paket seçer
create or replace function create_package_order(p_request uuid, p_product text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_r lesson_requests; v_p package_products; v_id uuid; v_s students;
begin
  select * into v_r from lesson_requests where id = p_request for update;
  if v_r.id is null or v_r.parent_id <> auth.uid() then raise exception 'Talep bulunamadı'; end if;
  if v_r.status <> 'eslesti' or v_r.teacher_id is null then raise exception 'Önce bir öğretmenle tanışma dersi yapmalısın'; end if;
  if not exists (select 1 from intro_offers o where o.request_id = p_request and o.teacher_id = v_r.teacher_id
                  and o.status = 'kabul' and o.starts_at <= now()) then
    raise exception 'Paket, tanışma dersinden sonra seçilebilir';
  end if;
  select * into v_p from package_products where code = p_product and is_active and kind = 'ana';
  if v_p.code is null then raise exception 'Paket bulunamadı'; end if;
  select * into v_s from students where id = v_r.student_id;
  update package_orders set status = 'iptal' where request_id = p_request and status = 'odeme_bekliyor';
  insert into package_orders (request_id, parent_id, student_id, student_name, grade, teacher_id, product_code, price, lesson_count)
  values (p_request, auth.uid(), v_r.student_id, v_s.first_name, v_s.grade, v_r.teacher_id, v_p.code, v_p.price, v_p.lesson_count)
  returning id into v_id;
  return v_id;
end $$;

-- Veli: tanışmadan sonra devam etmek istemezse talebi yeniden açar (başka öğretmen seçebilir)
create or replace function reopen_lesson_request(p_request uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update lesson_requests r set status = 'acik', teacher_id = null
   where r.id = p_request and r.parent_id = auth.uid() and r.status = 'eslesti'
     and exists (select 1 from intro_offers o where o.request_id = r.id and o.status = 'kabul' and o.starts_at <= now());
  if not found then raise exception 'Talep yeniden açılamadı'; end if;
  update package_orders set status = 'iptal' where request_id = p_request and status = 'odeme_bekliyor';
end $$;

revoke all on function create_package_order(uuid, text) from public, anon;
revoke all on function reopen_lesson_request(uuid) from public, anon;
grant execute on function create_package_order(uuid, text) to authenticated;
grant execute on function reopen_lesson_request(uuid) to authenticated;
