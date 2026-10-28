-- ---------------------------------------------------------------------
-- OYUN İLERLEMESİ VE SINIF MODU
-- 1) oyun_sonuclari : giriş yapmış kullanıcının oyun sonuçları (yalnız kendisi görür)
-- 2) siniflar       : öğretmenin oluşturduğu sınıf; öğrenciler kodla katılır
-- 3) sinif_sonuclari: öğrencilerin (giriş yapmadan, adla) sınıf altında sonuçları;
--                     yalnız sınıfın sahibi görür, ekleme yalnız RPC ile
-- Yalnız yeni tablo ve fonksiyon ekler; mevcut tablolara dokunmaz.
-- ---------------------------------------------------------------------

create table oyun_sonuclari (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  konu       text not null check (char_length(konu) between 1 and 80),
  oyun       text not null check (char_length(oyun) between 1 and 60),
  oran       smallint not null check (oran between 0 and 100),
  created_at timestamptz not null default now()
);
create index oyun_sonuclari_user_idx on oyun_sonuclari (user_id, created_at desc);

alter table oyun_sonuclari enable row level security;
create policy admin_all   on oyun_sonuclari for all using (is_admin()) with check (is_admin());
create policy self_select on oyun_sonuclari for select using (user_id = auth.uid());
create policy self_insert on oyun_sonuclari for insert with check (user_id = auth.uid());
create policy self_delete on oyun_sonuclari for delete using (user_id = auth.uid());

create table siniflar (
  id         uuid primary key default gen_random_uuid(),
  sahip_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  ad         text not null check (char_length(btrim(ad)) between 1 and 60),
  kod        text not null unique check (kod ~ '^[A-Z0-9]{6}$'),
  created_at timestamptz not null default now()
);
create index siniflar_sahip_idx on siniflar (sahip_id);

create table sinif_sonuclari (
  id         bigint generated always as identity primary key,
  sinif_id   uuid not null references siniflar(id) on delete cascade,
  ogrenci    text not null check (char_length(btrim(ogrenci)) between 1 and 40),
  konu       text not null check (char_length(konu) between 1 and 80),
  oyun       text not null check (char_length(oyun) between 1 and 60),
  oran       smallint not null check (oran between 0 and 100),
  created_at timestamptz not null default now()
);
create index sinif_sonuclari_sinif_idx on sinif_sonuclari (sinif_id, created_at desc);

alter table siniflar        enable row level security;
alter table sinif_sonuclari enable row level security;
create policy admin_all on siniflar        for all using (is_admin()) with check (is_admin());
create policy admin_all on sinif_sonuclari for all using (is_admin()) with check (is_admin());
create policy sahip_select on siniflar for select using (sahip_id = auth.uid());
create policy sahip_update on siniflar for update using (sahip_id = auth.uid()) with check (sahip_id = auth.uid());
create policy sahip_delete on siniflar for delete using (sahip_id = auth.uid());
create policy sahip_select on sinif_sonuclari for select
  using (exists (select 1 from siniflar s where s.id = sinif_id and s.sahip_id = auth.uid()));
create policy sahip_delete on sinif_sonuclari for delete
  using (exists (select 1 from siniflar s where s.id = sinif_id and s.sahip_id = auth.uid()));

-- Sınıf oluştur: benzersiz 6 haneli kod üretir (karışan harfler yok: 0/O, 1/I)
create or replace function sinif_olustur(p_ad text)
returns siniflar language plpgsql security definer set search_path = public as $$
declare
  v_kod text; v_satir siniflar; v_harfler constant text := 'ABCDEFGHJKLMNPRSTUVYZ23456789';
  v_sayi int;
begin
  if auth.uid() is null then raise exception 'giris_gerekli'; end if;
  if char_length(btrim(coalesce(p_ad, ''))) not between 1 and 60 then raise exception 'gecersiz_ad'; end if;
  select count(*) into v_sayi from siniflar where sahip_id = auth.uid();
  if v_sayi >= 30 then raise exception 'sinif_siniri'; end if;
  loop
    v_kod := '';
    for i in 1..6 loop
      v_kod := v_kod || substr(v_harfler, 1 + floor(random() * length(v_harfler))::int, 1);
    end loop;
    exit when not exists (select 1 from siniflar where kod = v_kod);
  end loop;
  insert into siniflar (sahip_id, ad, kod) values (auth.uid(), btrim(p_ad), v_kod) returning * into v_satir;
  return v_satir;
end $$;

-- Katılma sayfası için: koda karşılık sınıfın yalnız adını döndürür
create or replace function sinif_bilgisi(p_kod text)
returns text language sql stable security definer set search_path = public as $$
  select ad from siniflar where kod = upper(btrim(p_kod));
$$;

-- Öğrenci sonucu: giriş gerekmez; kod doğruysa kaydeder. Aynı öğrenci için dakikada en çok 20 kayıt.
create or replace function sinif_sonucu_kaydet(p_kod text, p_ogrenci text, p_konu text, p_oyun text, p_oran int)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_sinif uuid; v_son int;
begin
  select id into v_sinif from siniflar where kod = upper(btrim(p_kod));
  if v_sinif is null then return false; end if;
  if char_length(btrim(coalesce(p_ogrenci, ''))) not between 1 and 40 then return false; end if;
  if p_oran is null or p_oran not between 0 and 100 then return false; end if;
  select count(*) into v_son from sinif_sonuclari
   where sinif_id = v_sinif and ogrenci = btrim(p_ogrenci) and created_at > now() - interval '1 minute';
  if v_son >= 20 then return false; end if;
  insert into sinif_sonuclari (sinif_id, ogrenci, konu, oyun, oran)
  values (v_sinif, btrim(p_ogrenci), left(p_konu, 80), left(p_oyun, 60), p_oran);
  return true;
end $$;

revoke all on function sinif_olustur(text) from public, anon;
revoke all on function sinif_bilgisi(text) from public;
revoke all on function sinif_sonucu_kaydet(text, text, text, text, int) from public;
grant execute on function sinif_olustur(text) to authenticated;
grant execute on function sinif_bilgisi(text) to anon, authenticated;
grant execute on function sinif_sonucu_kaydet(text, text, text, text, int) to anon, authenticated;
