-- Puan tahmini: yıllık katsayılar, puan → sıra/yüzdelik dağılımı, hedef okul/bölüm taban puanları.
-- Hepsi herkese açık (okuma), yalnız admin yazar. Her yıl sonuçlar açıklanınca güncellenir.

-- Doğrusal model: puan = base + Σ coefs[ders] × net[ders]   (LGS: MSP; YKS: ham puan)
create table score_models (
  family     text not null check (family in ('lgs', 'tyt', 'say', 'ea', 'soz', 'dil')),
  year       smallint not null check (year between 2018 and 2100),
  base       numeric(10, 5) not null,
  coefs      jsonb not null,                -- {"matematik": 4.63, ...}
  question_counts jsonb not null,           -- resmi soru sayıları {"matematik": 20, ...}
  means      jsonb,                         -- Türkiye net ortalamaları (eksik dersi doldurmak için)
  min_score  numeric(6, 2) not null default 100,
  max_score  numeric(6, 2) not null default 500,
  source     text,
  notes      text,
  updated_at timestamptz not null default now(),
  primary key (family, year)
);

-- Puan dağılımı: score'a eşit ya da yüksek alan aday sayısı (YKS, sıra) veya yüzdelik dilim (LGS)
create table score_distribution (
  family     text not null,
  year       smallint not null,
  basis      text not null check (basis in ('ham', 'yerlestirme', 'msp')),
  score      numeric(6, 2) not null,
  value      numeric(12, 4) not null,       -- YKS: kümülatif aday sayısı; LGS: yüzdelik dilim (%)
  value_kind text not null check (value_kind in ('sira', 'yuzdelik')),
  primary key (family, year, basis, score)
);

-- Hedef okul / bölüm
create table score_targets (
  id         uuid primary key default gen_random_uuid(),
  level      text not null check (level in ('lise', 'universite')),
  family     text not null,                 -- lise: lgs; üniversite: say/ea/soz/dil
  year       smallint not null,
  city       text,
  district   text,
  institution text not null,
  program    text,                          -- lise türü ya da bölüm adı
  base_score numeric(9, 5) not null,
  rank_value numeric(12, 4),                -- lise: yüzdelik dilim; üniversite: başarı sırası
  source     text,
  unique (level, year, institution, program)
);
create index on score_targets (level, family, year);

alter table score_models enable row level security;
alter table score_distribution enable row level security;
alter table score_targets enable row level security;

create policy public_read on score_models for select using (true);
create policy public_read on score_distribution for select using (true);
create policy public_read on score_targets for select using (true);
create policy admin_all on score_models for all using (is_admin()) with check (is_admin());
create policy admin_all on score_distribution for all using (is_admin()) with check (is_admin());
create policy admin_all on score_targets for all using (is_admin()) with check (is_admin());

grant select on score_models, score_distribution, score_targets to anon, authenticated;
grant insert, update, delete on score_models, score_distribution, score_targets to authenticated;
