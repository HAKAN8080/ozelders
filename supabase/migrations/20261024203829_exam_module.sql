-- =====================================================================
-- SINAV MODÜLÜ: ücretsiz denemeler, optik form, sunucuda puanlama, sıralama
-- Cevap anahtarı hiçbir istemciye açık değildir; puanlama sadece
-- submit_exam_attempt() içinde yapılır.
-- =====================================================================

create type exam_status as enum ('taslak','yayinda','arsiv');

create table exams (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  title         text not null,
  subtitle      text,
  grade         smallint not null default 8,
  booklet_url   text,                       -- kitapçık dışarıdan açılır, biz barındırmayız
  booklet_label text,                       -- ör. "A kitapçığı · 33 sayfa"
  duration_min  smallint not null check (duration_min between 5 and 300),
  status        exam_status not null default 'taslak',
  published_at  timestamptz,
  created_at    timestamptz not null default now()
);

create table exam_sections (
  exam_id     uuid not null references exams(id) on delete cascade,
  code        text not null check (code ~ '^[a-z]{2,20}$'),   -- 'matematik', 'fen'
  name        text not null,
  position    smallint not null,
  primary key (exam_id, code)
);

create table exam_questions (
  exam_id     uuid not null,
  section     text not null,
  no          smallint not null check (no between 1 and 100),
  correct     char(1) not null check (correct in ('A','B','C','D','E')),
  topic       text,                                    -- konu / ünite (raporda gruplanır)
  kazanim     text,                                    -- MEB kazanım kodu (opsiyonel)
  primary key (exam_id, section, no),
  foreign key (exam_id, section) references exam_sections(exam_id, code) on delete cascade
);

create table exam_attempts (
  id           uuid primary key default gen_random_uuid(),
  exam_id      uuid not null references exams(id) on delete cascade,
  user_id      uuid references profiles(id) on delete set null,   -- giriş yapmışsa
  student_id   uuid references students(id) on delete set null,
  access_token uuid not null default gen_random_uuid(),           -- anonim sonuç erişimi
  display_name text check (char_length(display_name) <= 40),      -- sadece ad
  grade        smallint check (grade between 1 and 12),
  answers      jsonb not null,                                    -- {"matematik":{"1":"B",...},...}
  results      jsonb not null,                                    -- bölüm bazında d/y/b/net
  total_net    numeric(6,2) not null,
  created_at   timestamptz not null default now()
);
create index on exam_attempts (exam_id, total_net desc);
create index on exam_attempts (user_id);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table exams          enable row level security;
alter table exam_sections  enable row level security;
alter table exam_questions enable row level security;
alter table exam_attempts  enable row level security;

create policy admin_all on exams          for all using (is_admin()) with check (is_admin());
create policy admin_all on exam_sections  for all using (is_admin()) with check (is_admin());
create policy admin_all on exam_questions for all using (is_admin()) with check (is_admin());
create policy admin_all on exam_attempts  for all using (is_admin()) with check (is_admin());

-- Yayındaki sınavlar ve bölümleri herkese açık. Sorular (cevap anahtarı) KAPALI.
create policy exams_public on exams for select using (status = 'yayinda');
create policy sections_public on exam_sections for select
  using (exists (select 1 from exams e where e.id = exam_id and e.status = 'yayinda'));

-- Denemeler: kullanıcı yalnızca kendi denemelerini görür
create policy attempts_self on exam_attempts for select using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Puanlama: cevaplar gelir, sunucu anahtarla karşılaştırır
-- ---------------------------------------------------------------------
create or replace function submit_exam_attempt(
  p_exam uuid, p_answers jsonb, p_name text default null, p_grade smallint default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_exam exams; v_sec record; v_q record; v_ans text;
  v_d int; v_y int; v_b int; v_net numeric; v_total numeric := 0;
  v_results jsonb := '[]'::jsonb; v_clean jsonb := '{}'::jsonb; v_sec_clean jsonb;
  v_id uuid; v_token uuid; v_name text;
begin
  select * into v_exam from exams where id = p_exam and status = 'yayinda';
  if not found then raise exception 'Sınav bulunamadı ya da yayında değil'; end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then raise exception 'Geçersiz cevap formatı'; end if;
  if pg_column_size(p_answers) > 20000 then raise exception 'Cevap verisi çok büyük'; end if;

  for v_sec in select * from exam_sections where exam_id = p_exam order by position loop
    v_d := 0; v_y := 0; v_b := 0; v_sec_clean := '{}'::jsonb;
    for v_q in select * from exam_questions where exam_id = p_exam and section = v_sec.code order by no loop
      v_ans := upper(coalesce(p_answers -> v_sec.code ->> v_q.no::text, ''));
      if v_ans not in ('A','B','C','D','E') then
        v_b := v_b + 1;
      else
        v_sec_clean := v_sec_clean || jsonb_build_object(v_q.no::text, v_ans);
        if v_ans = v_q.correct then v_d := v_d + 1; else v_y := v_y + 1; end if;
      end if;
    end loop;
    v_net := round(v_d - v_y / 3.0, 2);       -- LGS: 3 yanlış 1 doğruyu götürür
    v_total := v_total + v_net;
    v_results := v_results || jsonb_build_object(
      'code', v_sec.code, 'name', v_sec.name, 'dogru', v_d, 'yanlis', v_y, 'bos', v_b, 'net', v_net);
    v_clean := v_clean || jsonb_build_object(v_sec.code, v_sec_clean);
  end loop;

  v_name := nullif(btrim(regexp_replace(coalesce(p_name, ''), '[^A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû ]', '', 'g')), '');
  insert into exam_attempts (exam_id, user_id, display_name, grade, answers, results, total_net)
  values (p_exam, auth.uid(), left(v_name, 40),
          case when p_grade between 1 and 12 then p_grade end, v_clean, v_results, v_total)
  returning id, access_token into v_id, v_token;

  return jsonb_build_object('id', v_id, 'token', v_token);
end $$;

-- ---------------------------------------------------------------------
-- Sonuç: token ya da sahiplik ile okunur. Konu raporu yalnızca girişli kullanıcıya.
-- ---------------------------------------------------------------------
create or replace function get_exam_result(p_attempt uuid, p_token uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_a exam_attempts; v_e exams; v_rank int; v_count int; v_detail jsonb := null; v_topics jsonb := null;
begin
  select * into v_a from exam_attempts where id = p_attempt;
  if not found then return null; end if;
  if not (v_a.access_token = p_token or (auth.uid() is not null and v_a.user_id = auth.uid()) or is_admin()) then
    return null;
  end if;
  select * into v_e from exams where id = v_a.exam_id;

  select count(*) + 1 into v_rank from exam_attempts where exam_id = v_a.exam_id and total_net > v_a.total_net;
  select count(*) into v_count from exam_attempts where exam_id = v_a.exam_id;

  -- Soru bazında sonuç ve konu raporu: sadece giriş yapmış kullanıcı (veli hesabı)
  if auth.uid() is not null then
    select jsonb_agg(jsonb_build_object(
             'section', q.section, 'no', q.no, 'correct', q.correct, 'topic', q.topic,
             'answer', v_a.answers -> q.section ->> q.no::text)
           order by s.position, q.no)
      into v_detail
      from exam_questions q join exam_sections s on s.exam_id = q.exam_id and s.code = q.section
     where q.exam_id = v_a.exam_id;

    select jsonb_agg(t order by t->>'section_pos', t->>'topic') into v_topics from (
      select jsonb_build_object(
               'section', q.section, 'section_pos', min(s.position)::text,
               'topic', coalesce(q.topic, 'Diğer'),
               'questions', string_agg(q.no::text, ', ' order by q.no),
               'total', count(*),
               'correct', count(*) filter (where (v_a.answers -> q.section ->> q.no::text) = q.correct)) as t
        from exam_questions q join exam_sections s on s.exam_id = q.exam_id and s.code = q.section
       where q.exam_id = v_a.exam_id
       group by q.section, coalesce(q.topic, 'Diğer')
    ) x;
  end if;

  return jsonb_build_object(
    'exam', jsonb_build_object('slug', v_e.slug, 'title', v_e.title, 'subtitle', v_e.subtitle),
    'name', v_a.display_name, 'created_at', v_a.created_at,
    'results', v_a.results, 'total_net', v_a.total_net,
    'rank', v_rank, 'participants', v_count,
    'is_owner', (auth.uid() is not null and v_a.user_id = auth.uid()),
    'claimable', (auth.uid() is not null and v_a.user_id is null and v_a.access_token = p_token),
    'detail', v_detail, 'topics', v_topics);
end $$;

-- Anonim çözülen denemeyi, sonra giriş yapan kullanıcı kendi hesabına bağlar
create or replace function claim_exam_attempt(p_attempt uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_rows int;
begin
  if auth.uid() is null then return false; end if;
  update exam_attempts set user_id = auth.uid()
   where id = p_attempt and access_token = p_token and user_id is null;
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end $$;

revoke all on function submit_exam_attempt(uuid, jsonb, text, smallint) from public;
revoke all on function get_exam_result(uuid, uuid) from public;
revoke all on function claim_exam_attempt(uuid, uuid) from public, anon;
grant execute on function submit_exam_attempt(uuid, jsonb, text, smallint) to anon, authenticated;
grant execute on function get_exam_result(uuid, uuid)                       to anon, authenticated;
grant execute on function claim_exam_attempt(uuid, uuid)                    to authenticated;

-- ---------------------------------------------------------------------
-- İLK SINAV: 2026 LGS Sayısal Bölüm (A kitapçığı)
-- Cevap anahtarı kitapçığın son sayfasından. Konular ünite düzeyinde
-- yaklaşık eşleştirmedir; admin ekranından düzeltilebilir.
-- ---------------------------------------------------------------------
with e as (
  insert into exams (slug, title, subtitle, grade, booklet_url, booklet_label, duration_min, status, published_at)
  values ('2026-lgs-sayisal', '2026 LGS Sayısal Bölüm', 'Matematik 20 + Fen Bilimleri 20 soru', 8,
          'https://meb.ai/2026lgssayisala', 'A kitapçığı · 33 sayfa', 80, 'yayinda', now())
  returning id
), s as (
  insert into exam_sections (exam_id, code, name, position)
  select id, v.code, v.name, v.pos from e, (values ('matematik','Matematik',1), ('fen','Fen Bilimleri',2)) v(code,name,pos)
  returning exam_id
)
insert into exam_questions (exam_id, section, no, correct, topic)
select (select id from e), q.section, q.no, q.correct, q.topic
from (values
  ('matematik', 1,'B','Kareköklü ifadeler'),
  ('matematik', 2,'B','Dönüşüm geometrisi'),
  ('matematik', 3,'D','Doğrusal denklemler'),
  ('matematik', 4,'C','Cebirsel ifadeler ve özdeşlikler'),
  ('matematik', 5,'B','Olasılık'),
  ('matematik', 6,'C','Kareköklü ifadeler'),
  ('matematik', 7,'A','Eşitsizlikler'),
  ('matematik', 8,'D','Cebirsel ifadeler ve özdeşlikler'),
  ('matematik', 9,'D','Üslü ifadeler'),
  ('matematik',10,'A','Üçgenler'),
  ('matematik',11,'B','Çarpanlar ve katlar'),
  ('matematik',12,'D','Çarpanlar ve katlar'),
  ('matematik',13,'A','Üslü ifadeler'),
  ('matematik',14,'C','Üçgenler'),
  ('matematik',15,'A','Üslü ifadeler'),
  ('matematik',16,'C','Dönüşüm geometrisi'),
  ('matematik',17,'D','Doğrusal denklemler'),
  ('matematik',18,'B','Üçgenler'),
  ('matematik',19,'B','Veri analizi'),
  ('matematik',20,'C','Geometrik cisimler'),
  ('fen', 1,'C','DNA ve genetik kod'),
  ('fen', 2,'A','DNA ve genetik kod'),
  ('fen', 3,'D','DNA ve genetik kod'),
  ('fen', 4,'B','Enerji dönüşümleri ve çevre bilimi'),
  ('fen', 5,'A','Enerji dönüşümleri ve çevre bilimi'),
  ('fen', 6,'C','Enerji dönüşümleri ve çevre bilimi'),
  ('fen', 7,'B','Enerji dönüşümleri ve çevre bilimi'),
  ('fen', 8,'D','Mevsimler ve iklim'),
  ('fen', 9,'B','Basınç'),
  ('fen',10,'C','Basınç'),
  ('fen',11,'B','Basit makineler'),
  ('fen',12,'A','Basit makineler'),
  ('fen',13,'D','Elektrik yükleri ve elektrik enerjisi'),
  ('fen',14,'C','Elektrik yükleri ve elektrik enerjisi'),
  ('fen',15,'A','Elektrik yükleri ve elektrik enerjisi'),
  ('fen',16,'D','Madde ve endüstri'),
  ('fen',17,'B','Madde ve endüstri'),
  ('fen',18,'C','Madde ve endüstri'),
  ('fen',19,'A','Madde ve endüstri'),
  ('fen',20,'B','Madde ve endüstri')
) q(section, no, correct, topic);
