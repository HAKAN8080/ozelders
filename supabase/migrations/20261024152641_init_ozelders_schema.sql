-- =====================================================================
-- ÖZEL DERS PLATFORMU — VERİ MODELİ (Supabase / PostgreSQL)
-- Dosya: ozelders_schema_SON.sql
-- Kapsam: kullanıcılar, öğretmen alımı, paketler, ödeme, rezervasyon,
--         iptal/iade, ders raporu, tanı sınavı, öğretmen hakedişi, RLS
-- Not: Supabase'de auth.users hazır gelir; profiles onu genişletir.
-- =====================================================================

create extension if not exists btree_gist with schema extensions;   -- Supabase: eklentiler extensions şemasında
-- gen_random_uuid() PostgreSQL 13+ ile yerleşik, ek eklenti gerekmez

-- ---------------------------------------------------------------------
-- 1. ENUM TİPLERİ
-- ---------------------------------------------------------------------
create type user_role       as enum ('veli','ogretmen','admin');
create type teacher_status  as enum ('basvuru','test','demo','belge','oryantasyon','golge','aktif','askida','ayrildi');
create type teacher_tier    as enum ('K1','K2','K3','K4');
create type teacher_segment as enum ('atanamayan','emekli','ozel_okul','ucretli_ogretmen','universite_ogrencisi','diger');
create type lesson_status   as enum ('planlandi','tamamlandi','veli_iptal','veli_gec_iptal','ogretmen_iptal','gelmedi','degisiklik_iptal');
-- degisiklik_iptal: öğretmen değişikliğinde iptal edilen ileri tarihli ders (haktan düşmez, ücret doğmaz)
create type product_kind    as enum ('ana','ek_ay');
create type payment_status  as enum ('beklemede','basarili','basarisiz','iade');
create type package_status  as enum ('aktif','tamamlandi','suresi_doldu','iade_edildi');
create type payout_line_type as enum ('ders','gec_iptal_50','bonus_yenileme','bonus_net_artis','bonus_referans','mentor_degerlendirme','duzeltme');
create type assessment_type as enum ('tani','ara','donem_sonu');

-- ---------------------------------------------------------------------
-- 2. KULLANICILAR
-- ---------------------------------------------------------------------
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'veli',
  full_name   text not null,
  phone       text,                      -- öğretmenler veli telefonunu GÖREMEZ (RLS)
  email       text,
  kvkk_aydinlatma_at timestamptz,        -- aydınlatma metni onay zamanı
  pazarlama_izni     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Öğrenci (reşit değil): sadece ders için gereken minimum veri
create table students (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references profiles(id) on delete cascade,
  first_name  text not null,             -- soyad, TCKN, okul adı TUTULMAZ
  grade       smallint not null check (grade between 1 and 12),
  lgs_year    smallint,                  -- hedef LGS yılı
  lgs_analitik_ref text,                 -- LGS Analitik'teki öğrenci kimliği (entegrasyon)
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. ÖĞRETMEN ALIMI VE PROFİLİ
-- ---------------------------------------------------------------------
-- Başvuru hunisi: ucuz filtreler önde, pahalılar arkada
create table teacher_applications (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null unique references profiles(id) on delete cascade,
  segment         teacher_segment not null,
  branch          text not null default 'matematik',
  grades_min      smallint not null default 5,
  grades_max      smallint not null default 8,
  experience_years smallint,
  -- Statü beyanı (657 s.K. md.28) — beyanın kendisi ve zamanı saklanır
  not_civil_servant_declared    boolean not null,
  not_civil_servant_declared_at timestamptz not null default now(),
  -- Huni adımları
  branch_test_score   numeric(5,2),      -- eşik: 85
  branch_test_at      timestamptz,
  intro_video_url     text,
  demo_score          numeric(5,2),      -- rubrik toplamı
  demo_rubric         jsonb,             -- {konu_hakimiyeti, anlatim, etkilesim, teknik, ...}
  demo_transcript_ai  jsonb,             -- AI değerlendirme çıktısı
  demo_evaluator_id   uuid references profiles(id),
  -- Belgeler: KOPYA SAKLANMAZ, sadece doğrulama kaydı (KVKK özel nitelikli veri)
  id_verified_at              timestamptz,
  diploma_verified_at         timestamptz,
  criminal_record_verified_at timestamptz,   -- e-Devlet barkod doğrulaması
  criminal_record_consent_at  timestamptz,   -- açık rıza
  criminal_record_renew_due   date,          -- 12 ayda bir yenileme
  verified_by                 uuid references profiles(id),
  contract_signed_at          timestamptz,
  contract_version            text,
  orientation_done_at         timestamptz,
  rejection_reason            text,
  created_at                  timestamptz not null default now()
);

create table teachers (
  profile_id     uuid primary key references profiles(id) on delete cascade,
  display_name   text not null,          -- vitrinde görünen ad (ör. "Ayşe Ö.")
  bio            text,
  intro_video_url text,
  status         teacher_status not null default 'basvuru',
  tier           teacher_tier   not null default 'K1',
  grades_min     smallint not null default 5,
  grades_max     smallint not null default 8,
  late_cancel_count_30d smallint not null default 0,
  activated_at   timestamptz,
  created_at     timestamptz not null default now()
);

-- Ödeme bilgisi ayrı tabloda, sadece admin + öğretmenin kendisi
create table teacher_payout_info (
  profile_id  uuid primary key references teachers(profile_id) on delete cascade,
  iban        text,                      -- uygulama katmanında şifrele
  -- Ödeme yapısı muhasebeci/YMM kararıyla kesinleşir:
  --   smm      : öğretmen serbest meslek mükellefi, makbuz keser
  --   bordro   : kısmi süreli iş sözleşmesi, SGK'lı
  --   stopajli : şirket stopaj keserek öder (uygunluğu muhasebeci onaylamalı)
  payment_model text check (payment_model in ('smm','bordro','stopajli')),
  tax_id_encrypted text,                 -- beyanname için gerekirse; şifreli, sadece admin
  updated_at  timestamptz not null default now()
);

-- Kademe ücretleri versiyonlu: geçmiş hakedişler eski ücretle kalır
create table tier_rates (
  id          serial primary key,
  tier        teacher_tier not null,
  lesson_fee  numeric(10,2) not null,
  valid_from  date not null,
  unique (tier, valid_from)
);

create table teacher_availability (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references teachers(profile_id) on delete cascade,
  weekday     smallint not null check (weekday between 1 and 7),  -- 1=Pzt
  start_time  time not null,
  end_time    time not null check (end_time > start_time),
  constraint no_late_night check (end_time <= time '21:00')       -- çocuk güvenliği kuralı
);

-- ---------------------------------------------------------------------
-- 4. ÜRÜNLER, ÖDEME, PAKET
-- ---------------------------------------------------------------------
-- Taksit YOK: her paket tek çekim.
create table package_products (
  code            text primary key,      -- BASLANGIC, STANDART, YOGUN, SEZON, EK_AY_4, EK_AY_8
  name            text not null,
  kind            product_kind not null default 'ana',  -- ek_ay: sadece mevcut paketi olan öğrenciye
  lesson_count    smallint not null,
  validity_days   smallint not null,
  price           numeric(10,2) not null,
  is_active       boolean not null default true
);

-- İade hesabında kullanılan liste ders fiyatı (Başlangıç paketi ders başı)
create table pricing_settings (
  id                   boolean primary key default true check (id),  -- tek satır
  refund_list_lesson_price numeric(10,2) not null,
  first_lesson_guarantee   boolean not null default true,
  late_cancel_hours        smallint not null default 24,
  teacher_notice_hours     smallint not null default 48,
  recording_retention_days smallint not null default 90,   -- KVKK: ders kayıtları 90 gün sonra silinir
  ek_ay_window_days        smallint not null default 30     -- paket bittikten sonra Ek Ay alınabilecek süre
);

create table payments (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid not null references profiles(id),
  student_id    uuid not null references students(id),
  product_code  text not null references package_products(code),
  amount        numeric(10,2) not null,
  provider      text not null check (provider in ('iyzico','paytr')),
  provider_ref  text not null,           -- idempotency anahtarı
  renews_package_id uuid,                -- Ek Ay alımında devam edilen paket (FK aşağıda)
  status        payment_status not null default 'beklemede',
  raw_payload   jsonb,
  created_at    timestamptz not null default now(),
  unique (provider, provider_ref)
);

create table student_packages (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references students(id),
  payment_id      uuid not null unique references payments(id),  -- 1 ödeme = 1 paket
  product_code    text not null references package_products(code),
  teacher_id      uuid references teachers(profile_id),           -- atanmış öğretmen
  lesson_quota    smallint not null,
  paid_amount     numeric(10,2) not null,
  starts_on       date not null default current_date,
  ends_on         date not null,
  status          package_status not null default 'aktif',
  renewed_from_id uuid references student_packages(id),          -- yenileme / Ek Ay takibi (KPI)
  created_at      timestamptz not null default now()
);
alter table payments add constraint fk_renews foreign key (renews_package_id) references student_packages(id);

-- ---------------------------------------------------------------------
-- 5. DERSLER (rezervasyon) — çift rezervasyon VERİTABANINDA engellenir
-- ---------------------------------------------------------------------
create table lessons (
  id                 uuid primary key default gen_random_uuid(),
  student_package_id uuid not null references student_packages(id),
  student_id         uuid not null references students(id),
  teacher_id         uuid not null references teachers(profile_id),
  starts_at          timestamptz not null,
  ends_at            timestamptz not null,
  status             lesson_status not null default 'planlandi',
  meeting_url        text,
  recording_path     text,               -- private bucket, signed URL ile açılır
  recording_deleted_at timestamptz,      -- 90 gün sonra expired_recordings() + mark_recordings_deleted() ile
  cancelled_by       uuid references profiles(id),
  cancelled_at       timestamptz,
  teacher_late_cancel boolean not null default false,
  is_makeup          boolean not null default false,   -- öğretmen iptali telafisi
  created_at         timestamptz not null default now(),
  check (ends_at > starts_at),
  check (extract(hour from (starts_at at time zone 'Europe/Istanbul')) < 21)
);

alter table lessons add constraint no_teacher_overlap
  exclude using gist (teacher_id with =, tstzrange(starts_at, ends_at) with &&)
  where (status in ('planlandi','tamamlandi'));

alter table lessons add constraint no_student_overlap
  exclude using gist (student_id with =, tstzrange(starts_at, ends_at) with &&)
  where (status in ('planlandi','tamamlandi'));

create index on lessons (teacher_id, starts_at);
create index on lessons (student_package_id);

create table lesson_reports (
  lesson_id     uuid primary key references lessons(id) on delete cascade,
  teacher_notes text[] not null,         -- öğretmenin 3 maddesi
  ai_summary    text,                    -- veliye giden AI özeti
  homework      text,
  covered_kazanim text[],                -- MEB kazanım kodları
  visible_to_parent boolean not null default false,  -- öğretmen/AI onayı sonrası
  created_at    timestamptz not null default now()
);

create table lesson_ratings (
  lesson_id   uuid primary key references lessons(id) on delete cascade,
  parent_id   uuid not null references profiles(id),
  score       smallint not null check (score between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 6. TANI / ARA SINAV (LGS Analitik entegrasyonu)
-- ---------------------------------------------------------------------
create table assessments (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references students(id) on delete cascade,
  type          assessment_type not null,
  taken_at      timestamptz not null default now(),
  net_score     numeric(5,2),
  kazanim_scores jsonb,                  -- {"M.8.1.1.1": 0.62, ...}
  source_ref    text                     -- LGS Analitik sınav kimliği
);

-- Ücretsiz tanı sınavından gelen potansiyel veliler (hesap açmadan)
create table leads (
  id            uuid primary key default gen_random_uuid(),
  parent_name   text not null,
  phone         text,
  email         text,
  student_grade smallint,
  kvkk_aydinlatma_at timestamptz not null,
  pazarlama_izni boolean not null default false,
  source        text,                    -- tani_sinavi, referans, reklam...
  converted_profile_id uuid references profiles(id),
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 7. İADE VE ÖĞRETMEN HAKEDİŞİ
-- ---------------------------------------------------------------------
create table refunds (
  id                 uuid primary key default gen_random_uuid(),
  student_package_id uuid not null references student_packages(id),
  amount             numeric(10,2) not null,
  calc_detail        jsonb not null,     -- hesap dökümü (şeffaflık)
  reason             text,
  approved_by        uuid references profiles(id),
  created_at         timestamptz not null default now()
);

-- e-Arşiv fatura: entegratör (PayTR / Paraşüt / Logo) muhasebeci kararıyla seçilecek.
-- Şema şimdiden hazır, entegrasyon sonra bağlanır.
create table invoices (
  id            uuid primary key default gen_random_uuid(),
  payment_id    uuid not null unique references payments(id),
  provider      text,                    -- paytr, parasut, logo...
  invoice_no    text,
  status        text not null default 'bekliyor' check (status in ('bekliyor','kesildi','hata','iptal')),
  pdf_path      text,                    -- private bucket
  error_detail  text,
  issued_at     timestamptz,
  created_at    timestamptz not null default now()
);

create table payout_lines (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references teachers(profile_id),
  type        payout_line_type not null,
  lesson_id   uuid references lessons(id),
  ref_id      uuid,                      -- bonus için paket/sınav kimliği
  amount      numeric(10,2) not null,
  period      date not null,             -- hakediş dönemi (ayın 1'i veya 16'sı)
  payout_id   uuid,                      -- ödendiğinde doldurulur
  created_at  timestamptz not null default now(),
  unique (lesson_id, type),              -- aynı ders iki kez ödenmez
  unique (ref_id, type)                  -- aynı bonus iki kez ödenmez
);

create table payouts (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references teachers(profile_id),
  period      date not null,
  total       numeric(10,2) not null,
  paid_at     timestamptz,
  unique (teacher_id, period)
);
alter table payout_lines add constraint fk_payout foreign key (payout_id) references payouts(id);

create table audit_log (
  id         bigserial primary key,
  actor_id   uuid,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  detail     jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 8. YARDIMCI FONKSİYONLAR (RLS'de kullanılır)
-- ---------------------------------------------------------------------
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function is_parent_of(p_student uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from students where id = p_student and parent_id = auth.uid());
$$;

create or replace function teaches_student(p_student uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from student_packages
                 where student_id = p_student and teacher_id = auth.uid());
$$;

-- Paketteki kullanılmış ders sayısı (geç iptal ve gelmeme de düşer)
create or replace function package_used(p_package uuid) returns int
language sql stable set search_path = public as $$
  select count(*)::int from lessons
  where student_package_id = p_package
    and status in ('planlandi','tamamlandi','veli_gec_iptal','gelmedi');
$$;

-- ---------------------------------------------------------------------
-- 9. İŞ KURALI FONKSİYONLARI
-- ---------------------------------------------------------------------

-- 9.1 Ödeme webhook'u: idempotent. Aynı provider_ref ikinci kez gelirse paket tekrar açılmaz.
create or replace function apply_payment(p_provider text, p_ref text, p_payload jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_pay payments; v_prod package_products; v_pkg uuid; v_prev student_packages; v_start date;
begin
  select * into v_pay from payments where provider = p_provider and provider_ref = p_ref for update;
  if not found then raise exception 'Ödeme bulunamadı'; end if;

  select id into v_pkg from student_packages where payment_id = v_pay.id;
  if v_pkg is not null then return v_pkg; end if;           -- zaten işlenmiş (idempotent)

  select * into v_prod from package_products where code = v_pay.product_code;
  if v_pay.amount <> v_prod.price then                      -- tutar manipülasyonuna karşı
    raise exception 'Ödeme tutarı ürün fiyatıyla uyuşmuyor';
  end if;

  update payments set status = 'basarili', raw_payload = p_payload where id = v_pay.id;

  if v_prod.kind = 'ek_ay' then
    -- Ek Ay: aynı öğretmenle devam, önceki pakete bağlanır.
    -- Başlangıç = önceki paketin bitişi (hâlâ aktifse) veya bugün; eski paketin kalan hakları kendi süresinde geçerli.
    select * into v_prev from student_packages where id = v_pay.renews_package_id;
    v_start := greatest(current_date, v_prev.ends_on);
    insert into student_packages (student_id, payment_id, product_code, teacher_id, lesson_quota,
                                  paid_amount, starts_on, ends_on, renewed_from_id)
    values (v_pay.student_id, v_pay.id, v_prod.code, v_prev.teacher_id, v_prod.lesson_count,
            v_pay.amount, v_start, v_start + v_prod.validity_days, v_prev.id)
    returning id into v_pkg;
  else
    insert into student_packages (student_id, payment_id, product_code, lesson_quota, paid_amount, ends_on)
    values (v_pay.student_id, v_pay.id, v_prod.code, v_prod.lesson_count, v_pay.amount,
            current_date + v_prod.validity_days)
    returning id into v_pkg;
  end if;

  insert into invoices (payment_id) values (v_pay.id) on conflict do nothing;   -- fatura kuyruğu
  insert into audit_log(actor_id, action, entity, entity_id) values (null,'payment_applied','student_packages',v_pkg);
  return v_pkg;
end $$;

-- Ek Ay ödemesi oluşturulurken doğrulama: aynı öğrencinin, öğretmeni atanmış ve süre penceresindeki paketi olmalı
create or replace function trg_validate_payment() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_kind product_kind; v_prev student_packages; v_set pricing_settings;
begin
  select kind into v_kind from package_products where code = new.product_code;
  if v_kind = 'ek_ay' then
    if new.renews_package_id is null then raise exception 'Ek Ay için devam edilecek paket gerekli'; end if;
    select * into v_prev from student_packages where id = new.renews_package_id;
    select * into v_set from pricing_settings limit 1;
    if v_prev.student_id <> new.student_id then raise exception 'Paket bu öğrenciye ait değil'; end if;
    if v_prev.teacher_id is null then raise exception 'Önceki pakette öğretmen yok'; end if;
    if v_prev.ends_on + v_set.ek_ay_window_days < current_date then
      raise exception 'Ek Ay süresi geçti, yeni ana paket alınmalı';
    end if;
  elsif new.renews_package_id is not null then
    raise exception 'renews_package_id sadece Ek Ay için kullanılır';
  end if;
  return new;
end $$;

create trigger validate_payment before insert on payments
for each row execute function trg_validate_payment();

-- 9.1b Öğretmen değişikliği (sadece admin / service role)
-- İleri tarihli planlı dersler 'degisiklik_iptal' olur: haktan düşmez, ücret doğmaz.
create or replace function change_teacher(p_package uuid, p_new_teacher uuid, p_reason text)
returns int language plpgsql security definer set search_path = public as $$
declare v_pkg student_packages; v_count int;
begin
  if not is_admin() and coalesce(auth.uid()::text, '') <> '' then raise exception 'Yetki yok'; end if;
  select * into v_pkg from student_packages where id = p_package for update;
  if not found then raise exception 'Paket yok'; end if;
  if not exists (select 1 from teachers where profile_id = p_new_teacher and status = 'aktif') then
    raise exception 'Yeni öğretmen aktif değil';
  end if;

  update lessons set status = 'degisiklik_iptal', cancelled_by = auth.uid(), cancelled_at = now()
   where student_package_id = p_package and status = 'planlandi' and starts_at > now();
  get diagnostics v_count = row_count;

  update student_packages set teacher_id = p_new_teacher where id = p_package;
  insert into audit_log(actor_id, action, entity, entity_id, detail)
  values (auth.uid(), 'teacher_change', 'student_packages', p_package,
          jsonb_build_object('old', v_pkg.teacher_id, 'new', p_new_teacher,
                             'cancelled_lessons', v_count, 'reason', p_reason));
  return v_count;   -- yeniden planlanacak ders sayısı (veliye bildirim)
end $$;

-- 9.1c KVKK: 90 günü geçen ders kayıtları. Günlük zamanlanmış görev (pg_cron veya Edge Function)
-- expired_recordings() ile yolları alır, Storage'dan siler, sonra mark_recordings_deleted() ile işaretler.
create or replace function expired_recordings() returns table (lesson_id uuid, recording_path text)
language sql stable security definer set search_path = public as $$
  select l.id, l.recording_path from lessons l, pricing_settings s
  where l.recording_path is not null and l.recording_deleted_at is null
    and l.starts_at < now() - make_interval(days => s.recording_retention_days);
$$;

create or replace function mark_recordings_deleted(p_ids uuid[]) returns int
language plpgsql security definer set search_path = public as $$
declare v int;
begin
  update lessons set recording_path = null, recording_deleted_at = now() where id = any(p_ids);
  get diagnostics v = row_count; return v;
end $$;

-- 9.2 Ders rezervasyonu: kota, geçerlilik ve yetki kontrolü tek işlemde
create or replace function book_lesson(p_package uuid, p_starts timestamptz, p_minutes int default 50)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_pkg student_packages; v_id uuid;
begin
  select * into v_pkg from student_packages where id = p_package for update;   -- yarış durumuna karşı kilit
  if not found then raise exception 'Paket yok'; end if;
  if not (is_parent_of(v_pkg.student_id) or is_admin()) then raise exception 'Yetki yok'; end if;
  if v_pkg.status <> 'aktif' then raise exception 'Paket aktif değil'; end if;
  if v_pkg.teacher_id is null then raise exception 'Öğretmen atanmamış'; end if;
  if (p_starts at time zone 'Europe/Istanbul')::date > v_pkg.ends_on then raise exception 'Paket süresi dışında'; end if;
  if p_starts < now() + interval '2 hours' then raise exception 'En az 2 saat önceden rezervasyon'; end if;
  if package_used(p_package) >= v_pkg.lesson_quota then raise exception 'Ders hakkı kalmadı'; end if;

  insert into lessons (student_package_id, student_id, teacher_id, starts_at, ends_at)
  values (p_package, v_pkg.student_id, v_pkg.teacher_id, p_starts, p_starts + make_interval(mins => p_minutes))
  returning id into v_id;   -- çakışma varsa exclusion constraint hata verir
  return v_id;
end $$;

-- 9.3 İptal: kim, ne zaman iptal ettiğine göre statü otomatik belirlenir
create or replace function cancel_lesson(p_lesson uuid)
returns lesson_status language plpgsql security definer set search_path = public as $$
declare v_l lessons; v_set pricing_settings; v_new lesson_status; v_hours numeric;
begin
  select * into v_l from lessons where id = p_lesson for update;
  if not found then raise exception 'Ders yok'; end if;
  if v_l.status <> 'planlandi' then raise exception 'Ders iptal edilemez durumda'; end if;
  select * into v_set from pricing_settings limit 1;
  v_hours := extract(epoch from (v_l.starts_at - now())) / 3600;

  if is_parent_of(v_l.student_id) then
    v_new := case when v_hours >= v_set.late_cancel_hours then 'veli_iptal' else 'veli_gec_iptal' end;
  elsif v_l.teacher_id = auth.uid() then
    v_new := 'ogretmen_iptal';
    if v_hours < v_set.teacher_notice_hours then
      update lessons set teacher_late_cancel = true where id = p_lesson;
      update teachers set late_cancel_count_30d = late_cancel_count_30d + 1 where profile_id = v_l.teacher_id;
    end if;
  elsif is_admin() then
    v_new := 'veli_iptal';      -- admin iptali veliyi cezalandırmaz
  else
    raise exception 'Yetki yok';
  end if;

  update lessons set status = v_new, cancelled_by = auth.uid(), cancelled_at = now() where id = p_lesson;
  insert into audit_log(actor_id, action, entity, entity_id, detail)
  values (auth.uid(), 'lesson_cancel', 'lessons', p_lesson, jsonb_build_object('status', v_new, 'hours_before', v_hours));
  return v_new;
end $$;

-- 9.4 İade hesabı: kalan dersler iade, kullanılanlar liste fiyatından düşülür
create or replace function calc_refund(p_package uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_pkg student_packages; v_set pricing_settings; v_used int; v_done int; v_amount numeric;
        v_guarantee boolean;
begin
  select * into v_pkg from student_packages where id = p_package;
  if not found then raise exception 'Paket yok'; end if;
  if not (is_parent_of(v_pkg.student_id) or is_admin()) then raise exception 'Yetki yok'; end if;
  select * into v_set from pricing_settings limit 1;
  v_used := package_used(p_package);
  select count(*) into v_done from lessons
   where student_package_id = p_package and status in ('tamamlandi','veli_gec_iptal','gelmedi');

  -- İlk ders güvencesi: sadece öğrencinin İLK paketinde ve en fazla 1 ders tüketildiyse
  v_guarantee := v_set.first_lesson_guarantee and v_done <= 1
    and not exists (select 1 from student_packages o
                    where o.student_id = v_pkg.student_id and o.created_at < v_pkg.created_at);

  if v_guarantee then
    v_amount := v_pkg.paid_amount;
  else
    v_amount := greatest(0, v_pkg.paid_amount - v_done * v_set.refund_list_lesson_price);
  end if;

  return jsonb_build_object(
    'paid', v_pkg.paid_amount, 'consumed_lessons', v_done,
    'list_price', v_set.refund_list_lesson_price,
    'first_lesson_guarantee_applied', v_guarantee,
    'refund', v_amount, 'open_bookings_to_cancel', v_used - v_done);
end $$;

-- 9.5 Hakediş: ders tamamlanınca veya geç iptalde otomatik satır oluşur
-- Ücret, DERSİN TARİHİNDE geçerli olan kademe tarifesinden alınır
create or replace function current_fee(p_teacher uuid, p_on timestamptz default now()) returns numeric
language plpgsql stable security definer set search_path = public as $$
declare v_fee numeric;
begin
  select r.lesson_fee into v_fee from tier_rates r join teachers t on t.tier = r.tier
  where t.profile_id = p_teacher
    and r.valid_from <= (p_on at time zone 'Europe/Istanbul')::date
  order by r.valid_from desc limit 1;
  if v_fee is null then
    raise exception 'Bu tarih için kademe ücreti tanımlı değil (tier_rates kontrol edin)';
  end if;
  return v_fee;
end $$;

-- Hakediş dönemi İstanbul saatine göre: 1-15 → ayın 1'i, 16-31 → ayın 16'sı
create or replace function payout_period(p_ts timestamptz) returns date
language sql immutable set search_path = public as $$
  select case when extract(day from (p_ts at time zone 'Europe/Istanbul')) <= 15
              then date_trunc('month', p_ts at time zone 'Europe/Istanbul')::date
              else (date_trunc('month', p_ts at time zone 'Europe/Istanbul') + interval '15 days')::date end;
$$;

create or replace function trg_lesson_payout() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = old.status then return new; end if;
  if new.status in ('tamamlandi','gelmedi') then
    insert into payout_lines (teacher_id, type, lesson_id, amount, period)
    values (new.teacher_id, 'ders', new.id, current_fee(new.teacher_id, new.starts_at), payout_period(new.starts_at))
    on conflict do nothing;
  elsif new.status = 'veli_gec_iptal' then
    insert into payout_lines (teacher_id, type, lesson_id, amount, period)
    values (new.teacher_id, 'gec_iptal_50', new.id, round(current_fee(new.teacher_id, new.starts_at) * 0.5, 2), payout_period(new.starts_at))
    on conflict do nothing;
  end if;
  return new;
end $$;

create trigger lesson_payout after update of status on lessons
for each row execute function trg_lesson_payout();

-- ---------------------------------------------------------------------
-- 10. KPI GÖRÜNÜMÜ (kademe terfisi için)
-- ---------------------------------------------------------------------
create or replace view teacher_kpis with (security_invoker = true) as
select t.profile_id as teacher_id, t.tier,
  count(l.*) filter (where l.status = 'tamamlandi')                     as completed_lessons,
  round(avg(r.score)::numeric, 2)                                       as avg_rating,
  (select round(100.0 * count(*) filter (where exists (
            select 1 from student_packages n where n.renewed_from_id = p.id))
          / nullif(count(*),0), 1)
     from student_packages p
    where p.teacher_id = t.profile_id and p.status in ('tamamlandi','suresi_doldu')) as renewal_rate_pct,
  t.late_cancel_count_30d
from teachers t
left join lessons l on l.teacher_id = t.profile_id
left join lesson_ratings r on r.lesson_id = l.id
group by t.profile_id, t.tier, t.late_cancel_count_30d;

-- ---------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY — HER TABLODA AÇIK
-- ---------------------------------------------------------------------
alter table profiles             enable row level security;
alter table students             enable row level security;
alter table teacher_applications enable row level security;
alter table teachers             enable row level security;
alter table teacher_payout_info  enable row level security;
alter table tier_rates           enable row level security;
alter table teacher_availability enable row level security;
alter table package_products     enable row level security;
alter table pricing_settings     enable row level security;
alter table payments             enable row level security;
alter table student_packages     enable row level security;
alter table lessons              enable row level security;
alter table lesson_reports       enable row level security;
alter table lesson_ratings       enable row level security;
alter table assessments          enable row level security;
alter table leads                enable row level security;
alter table refunds              enable row level security;
alter table invoices             enable row level security;
alter table payout_lines         enable row level security;
alter table payouts              enable row level security;
alter table audit_log            enable row level security;

-- Admin her şeyi görür/yönetir
do $$ declare t text; begin
  foreach t in array array['profiles','students','teacher_applications','teachers','teacher_payout_info',
    'tier_rates','teacher_availability','package_products','pricing_settings','payments','student_packages',
    'lessons','lesson_reports','lesson_ratings','assessments','leads','refunds','invoices','payout_lines','payouts','audit_log']
  loop
    execute format('create policy admin_all on %I for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- profiles: herkes sadece kendini görür. Öğretmen veli iletişim bilgisini GÖREMEZ (ayartma önlemi)
create policy self_read   on profiles for select using (id = auth.uid());
create policy self_insert on profiles for insert with check (id = auth.uid() and role = 'veli');  -- kayıt sadece veli olarak
create policy self_update on profiles for update using (id = auth.uid()) with check (id = auth.uid());
-- Rol yükseltme engeli: kullanıcı 'role' kolonunu hiç güncelleyemez (kolon bazlı yetki)
revoke update on profiles from authenticated;
grant update (full_name, phone, email, kvkk_aydinlatma_at, pazarlama_izni) on profiles to authenticated;

-- students: veli kendi çocuğunu yönetir, öğretmen sadece atandığı öğrenciyi okur
create policy parent_crud   on students for all    using (parent_id = auth.uid()) with check (parent_id = auth.uid());
create policy teacher_read  on students for select using (teaches_student(id));

-- teacher_applications: başvuran kendi başvurusunu okur ve ilk adımı doldurur; değerlendirme alanları admin'de
create policy app_self_read   on teacher_applications for select using (profile_id = auth.uid());
create policy app_self_insert on teacher_applications for insert with check (profile_id = auth.uid());

-- teachers: aktif öğretmen vitrini giriş yapmış herkese açık; öğretmen kendi profilini günceller
create policy public_active on teachers for select using (status = 'aktif' or profile_id = auth.uid());
create policy self_update   on teachers for update using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
-- Öğretmen status/tier alanlarını DEĞİŞTİREMEZ: kolon bazlı yetki.
-- Admin işlemleri (statü, kademe) sunucu tarafında service role ile yapılır.
revoke update on teachers from authenticated;
grant update (bio, intro_video_url, display_name) on teachers to authenticated;

create policy payout_info_self on teacher_payout_info for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy rates_read    on tier_rates       for select using (auth.uid() is not null);
create policy products_read on package_products for select using (is_active);
create policy settings_read on pricing_settings for select using (true);

create policy avail_read on teacher_availability for select using (auth.uid() is not null);
create policy avail_self on teacher_availability for all using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- payments: sadece veli kendi ödemesini görür; yazma sadece sunucu (service role) + apply_payment
create policy pay_parent_read on payments for select using (parent_id = auth.uid());

-- student_packages: veli ve atanmış öğretmen okur; yazma sadece fonksiyonlarla
create policy pkg_parent_read  on student_packages for select using (is_parent_of(student_id));
create policy pkg_teacher_read on student_packages for select using (teacher_id = auth.uid());

-- lessons: okuma veli + öğretmen; oluşturma book_lesson, iptal cancel_lesson ile.
create policy les_parent_read  on lessons for select using (is_parent_of(student_id));
create policy les_teacher_read on lessons for select using (teacher_id = auth.uid());
-- Öğretmen dersi 'tamamlandi' / 'gelmedi' işaretleyebilir (sadece kendi dersi, başlangıç saatinden sonra)
create policy les_teacher_complete on lessons for update
  using (teacher_id = auth.uid() and status = 'planlandi' and starts_at <= now())
  with check (teacher_id = auth.uid() and status in ('tamamlandi','gelmedi'));
-- Öğretmen sadece 'status' kolonunu güncelleyebilir (saat, paket, öğrenci değiştirilemez)
revoke update on lessons from authenticated;
grant update (status) on lessons to authenticated;

-- lesson_reports: öğretmen yazar; veli yalnızca onaylanmış raporu görür
create policy rep_teacher on lesson_reports for all
  using (exists (select 1 from lessons l where l.id = lesson_id and l.teacher_id = auth.uid()))
  with check (exists (select 1 from lessons l where l.id = lesson_id and l.teacher_id = auth.uid()));
create policy rep_parent_read on lesson_reports for select
  using (visible_to_parent and exists (select 1 from lessons l where l.id = lesson_id and is_parent_of(l.student_id)));

-- lesson_ratings: veli kendi tamamlanmış dersini puanlar; öğretmen kendi puanlarını görür
create policy rate_parent on lesson_ratings for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid() and exists (
    select 1 from lessons l where l.id = lesson_id and l.status = 'tamamlandi' and is_parent_of(l.student_id)));
create policy rate_teacher_read on lesson_ratings for select
  using (exists (select 1 from lessons l where l.id = lesson_id and l.teacher_id = auth.uid()));

-- assessments: veli ve öğretmen okur; yazma LGS Analitik entegrasyonu (service role)
create policy asm_parent_read  on assessments for select using (is_parent_of(student_id));
create policy asm_teacher_read on assessments for select using (teaches_student(student_id));

-- leads: anonim erişim YOK; form sunucu route'u üzerinden service role ile yazar

-- refunds: veli kendi iadesini görür
create policy ref_parent_read on refunds for select
  using (exists (select 1 from student_packages p where p.id = student_package_id and is_parent_of(p.student_id)));

-- invoices: veli kendi faturasını görür; yazma sadece fatura entegrasyonu (service role)
create policy inv_parent_read on invoices for select
  using (exists (select 1 from payments p where p.id = payment_id and p.parent_id = auth.uid()));

-- hakediş: öğretmen sadece kendininkini görür
create policy pl_self on payout_lines for select using (teacher_id = auth.uid());
create policy po_self on payouts      for select using (teacher_id = auth.uid());

-- RPC yetkileri
revoke all on function apply_payment(text, text, jsonb) from public, anon, authenticated;  -- sadece service role
grant execute on function book_lesson(uuid, timestamptz, int) to authenticated;
grant execute on function cancel_lesson(uuid)                 to authenticated;
grant execute on function calc_refund(uuid)                   to authenticated;
-- Öğretmen değişikliği: admin (authenticated + is_admin) veya service role; anonim kapalı
revoke all on function change_teacher(uuid, uuid, text) from public, anon;
grant execute on function change_teacher(uuid, uuid, text) to authenticated, service_role;
-- Kayıt silme fonksiyonları sadece zamanlanmış görev (service role)
revoke all on function expired_recordings()            from public, anon, authenticated;
revoke all on function mark_recordings_deleted(uuid[]) from public, anon, authenticated;
grant execute on function expired_recordings(), mark_recordings_deleted(uuid[]) to service_role;

-- ---------------------------------------------------------------------
-- 12. BAŞLANGIÇ VERİSİ
-- ---------------------------------------------------------------------
insert into package_products (code, name, kind, lesson_count, validity_days, price) values
  ('BASLANGIC','Başlangıç', 'ana',    4, 35,  4400),
  ('STANDART', 'Standart',  'ana',    8, 42,  7600),
  ('YOGUN',    'Yoğun',     'ana',   12, 56, 10800),
  ('SEZON',    'LGS Sezon', 'ana',   32,126, 27200),
  -- Ek Ay: mevcut öğrenciye sadakat fiyatı, aynı öğretmenle 30 gün
  ('EK_AY_4',  'Ek Ay (haftada 1)', 'ek_ay', 4, 30, 4000),
  ('EK_AY_8',  'Ek Ay (haftada 2)', 'ek_ay', 8, 30, 7200);

insert into pricing_settings (refund_list_lesson_price) values (1100);

insert into tier_rates (tier, lesson_fee, valid_from) values
  ('K1', 450, '2026-01-01'), ('K2', 550, '2026-01-01'),
  ('K3', 650, '2026-01-01'), ('K4', 750, '2026-01-01');
-- Zam yapıldığında eski satır SİLİNMEZ, yeni valid_from ile yeni satır eklenir.
