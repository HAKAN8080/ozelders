"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { submitExam } from "@/app/deneme/[slug]/actions";
import { examImageUrl, imageKey } from "@/lib/exam-images";
import type { PublicExam } from "@/lib/exams";

const LETTERS = ["A", "B", "C", "D"] as const;
type Answers = Record<string, Record<string, string>>;
type Saved = { answers: Answers; startedAt: number | null };

const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.08em]";

function storageKey(slug: string) {
  return `odb:deneme:${slug}`;
}

function load(slug: string): Saved {
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (raw) {
      const parsed = JSON.parse(raw) as Saved;
      if (parsed && typeof parsed === "object" && parsed.answers) return parsed;
    }
  } catch {
    // Tarayıcı depolaması kapalı olabilir; sınav yine çalışır, sadece kaydedilmez.
  }
  return { answers: {}, startedAt: null };
}

function save(slug: string, value: Saved) {
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(value));
  } catch {
    // yok say
  }
}

function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function ExamRunner({ exam }: { exam: PublicExam }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number>(exam.grade);
  const [confirming, setConfirming] = useState(false);
  const [split, setSplit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Kayıtlı cevapları ve başlangıç zamanını geri yükle. localStorage sunucuda olmadığı için
  // ilk çizimden sonra okunmalı; aksi halde sunucu/istemci HTML'i uyuşmaz.
  useEffect(() => {
    const saved = load(exam.slug);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dış depodan tek seferlik geri yükleme
    setAnswers(saved.answers);
    setStartedAt(saved.startedAt);
    setNow(Date.now());
    setLoaded(true);
  }, [exam.slug]);

  useEffect(() => {
    if (loaded) save(exam.slug, { answers, startedAt });
  }, [answers, startedAt, exam.slug, loaded]);

  useEffect(() => {
    if (!startedAt) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [startedAt]);

  const totalSeconds = exam.duration_min * 60;
  const remaining = startedAt ? totalSeconds - (now - startedAt) / 1000 : totalSeconds;
  const timeUp = startedAt !== null && remaining <= 0;
  const locked = !startedAt || timeUp || pending;

  const totalQ = useMemo(() => exam.sections.reduce((n, s) => n + s.question_count, 0), [exam.sections]);
  const answeredBySection = useMemo(
    () => Object.fromEntries(exam.sections.map((s) => [s.code, Object.keys(answers[s.code] ?? {}).length])),
    [answers, exam.sections],
  );
  const answered = Object.values(answeredBySection).reduce((a, b) => a + b, 0);
  const empty = totalQ - answered;

  function pick(section: string, no: number, letter: string) {
    if (locked) return;
    setAnswers((prev) => {
      const sec = { ...(prev[section] ?? {}) };
      if (sec[String(no)] === letter) delete sec[String(no)];
      else sec[String(no)] = letter;
      return { ...prev, [section]: sec };
    });
  }

  function start() {
    const t = Date.now();
    setStartedAt(t);
    setNow(t);
  }

  function finish() {
    setError(null);
    startTransition(async () => {
      const res = await submitExam(exam.id, answers, name.trim(), grade);
      if (!res.ok) {
        setError(res.error);
        setConfirming(false);
        return;
      }
      try {
        window.localStorage.removeItem(storageKey(exam.slug));
      } catch {
        // yok say
      }
      router.push(`/deneme/${exam.slug}/sonuc/${res.id}?t=${res.token}`);
    });
  }

  const hasImages = Object.keys(exam.images).length > 0;
  const canSplit = !hasImages && !!exam.booklet_url;
  const showSplit = split && canSplit;

  const startButton =
    !startedAt && loaded ? (
      <button type="button" onClick={start} className="rounded-md bg-[#111111] px-5 py-4 text-[17px] font-semibold text-white hover:bg-black">
        Süreyi başlat ({exam.duration_min} dakika)
      </button>
    ) : null;

  const timeUpNote = timeUp ? (
    <p className="m-0 rounded-md bg-primary-soft p-3 text-[15px] font-medium text-primary" role="status">
      Süre doldu. Cevapların kilitlendi; sınavı bitirip sonucunu görebilirsin.
    </p>
  ) : null;

  const finishArea = (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      <div className="flex flex-wrap gap-4">
        <label className="flex min-w-0 flex-[1_1_200px] flex-col gap-1.5">
          <span className="text-[15px] font-medium">Adın (isteğe bağlı)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoComplete="given-name"
            placeholder="Sadece adın, soyadın gerekmez"
            className="h-12 rounded-lg border border-border bg-background px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <label className="flex flex-[0_1_150px] flex-col gap-1.5">
          <span className="text-[15px] font-medium">Sınıfın</span>
          <select
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
            className="h-12 rounded-lg border border-border bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {[5, 6, 7, 8].map((g) => (
              <option key={g} value={g}>
                {g}. sınıf
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="m-0 text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 text-[15px] text-muted">
          Boş: <strong className="text-foreground tabular-nums">{empty}</strong> soru
        </p>
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[15px] font-medium">{empty > 0 ? `${empty} soru boş. Yine de bitirilsin mi?` : "Sınav bitirilsin mi?"}</span>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="rounded-md border border-border px-4 py-3 text-base font-semibold hover:bg-primary-soft"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={finish}
              disabled={pending}
              className="rounded-md bg-[#111111] px-5 py-3 text-base font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              {pending ? "Hesaplanıyor…" : "Evet, bitir"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!startedAt || pending}
            className="rounded-md bg-[#111111] px-7 py-4 text-[17px] font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sınavı bitir ve sonucu gör
          </button>
        )}
      </div>
    </div>
  );

  // Klasik optik form (kitapçık ayrı açıkken)
  const opticForm = (columns: boolean) => (
    <div className={columns ? "grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8" : "flex flex-col gap-8"}>
      {exam.sections.map((sec) => (
        <fieldset key={sec.code} className="m-0 flex flex-col gap-1.5 border-0 p-0" disabled={locked}>
          <legend className="mb-1.5 flex w-full items-baseline justify-between border-b-2 border-[#111111] pb-2.5">
            <span className="text-lg font-semibold uppercase tracking-[0.04em]">{sec.name}</span>
            <span className="ml-3 text-sm text-muted tabular-nums">
              {answeredBySection[sec.code] ?? 0} / {sec.question_count}
            </span>
          </legend>
          {Array.from({ length: sec.question_count }, (_, i) => i + 1).map((no) => (
            <div key={no} className="flex items-center gap-2.5 border-b border-[#eef2ef] py-0.5">
              <span className="w-8 text-right text-[15px] font-semibold text-[#3d4743] tabular-nums">{no}.</span>
              <Bubbles sectionName={sec.name} no={no} chosen={answers[sec.code]?.[String(no)]} locked={locked} onPick={(L) => pick(sec.code, no, L)} />
            </div>
          ))}
        </fieldset>
      ))}
    </div>
  );

  const header = (
    <header className="tahta text-[#f2f5f1]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-1">
          <Link href="/deneme" className="text-sm text-[#cfe3d6] no-underline hover:text-white">
            ← Denemeler
          </Link>
          <h1 className="m-0 font-serif text-2xl font-bold sm:text-[28px]">{exam.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-6" aria-live="polite">
          {canSplit ? (
            <button
              type="button"
              onClick={() => setSplit(!split)}
              className="hidden rounded-md border border-[#cfe3d6]/60 px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-white/10 lg:block"
            >
              {showSplit ? "Kitapçığı kapat" : "Kitapçığı yanda aç"}
            </button>
          ) : null}
          <div className="flex flex-col items-end">
            <span className={`${eyebrow} text-[#cfe3d6]`}>Kalan süre</span>
            <span className={`text-[32px] font-semibold tabular-nums ${timeUp ? "text-white underline" : ""}`}>{formatClock(remaining)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`${eyebrow} text-[#cfe3d6]`}>İşaretlenen</span>
            <span className="text-[32px] font-semibold tabular-nums">
              {answered} / {totalQ}
            </span>
          </div>
        </div>
      </div>
    </header>
  );

  // 1) Resmi kitapçık yan yana: solda kitapçık (kendi adresinden), sağda cevap kâğıdı
  if (showSplit && exam.booklet_url) {
    return (
      <div className="defter flex min-h-full flex-1 flex-col text-foreground">
        {header}
        <main className="grid flex-1 grid-cols-[minmax(0,1fr)_440px] gap-6 px-6 pt-6 pb-10">
          <div className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col gap-2">
            <iframe src={exam.booklet_url} title="Sınav kitapçığı" className="w-full flex-1 rounded-[10px] border border-border bg-white" />
            <p className="m-0 text-sm text-muted">
              Kitapçık burada görünmüyorsa{" "}
              <a href={exam.booklet_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">
                yeni sekmede aç
              </a>
              .
            </p>
          </div>
          <section aria-label="Optik form" className="flex flex-col gap-6 rounded-[10px] border border-border bg-background p-6">
            {startButton}
            {timeUpNote}
            {opticForm(false)}
            {finishArea}
          </section>
        </main>
      </div>
    );
  }

  // 2) Kendi denememiz: sorular resim olarak, her sorunun altında şıklar
  if (hasImages) {
    return (
      <div className="defter flex min-h-full flex-1 flex-col text-foreground">
        {header}
        <main className="mx-auto flex w-full max-w-[1200px] flex-wrap items-start gap-8 px-4 pt-10 pb-16 sm:px-6">
          <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-5 lg:sticky lg:top-4">
            <div className="flex flex-col gap-3.5 rounded-[10px] border border-border bg-background p-6">
              <h2 className="m-0 text-xl font-semibold">Nasıl çözülür?</h2>
              <ul className="m-0 flex flex-col gap-2 pl-5 text-[15px] leading-relaxed text-[#3d4743]">
                <li>Süreyi başlatınca sorular açılır.</li>
                <li>Her sorunun altındaki şıkka tıkla. Tekrar tıklarsan silinir.</li>
                <li>Boş bırakmak serbest. 3 yanlış 1 doğruyu götürür.</li>
              </ul>
              {startButton}
              {timeUpNote}
            </div>
            {startedAt ? (
              <nav aria-label="Sorulara git" className="flex flex-col gap-3 rounded-[10px] border border-border bg-background p-5">
                {exam.sections.map((sec) => (
                  <div key={sec.code} className="flex flex-col gap-2">
                    <span className="text-sm font-semibold">{sec.name}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: sec.question_count }, (_, i) => i + 1).map((no) => {
                        const done = !!answers[sec.code]?.[String(no)];
                        return (
                          <a
                            key={no}
                            href={`#soru-${sec.code}-${no}`}
                            className={`flex size-8 items-center justify-center rounded text-[13px] font-semibold no-underline tabular-nums ${
                              done ? "bg-primary text-primary-foreground" : "border border-border text-[#3d4743] hover:bg-primary-soft"
                            }`}
                          >
                            {no}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            ) : null}
          </aside>

          <section aria-label="Sorular" className="flex min-w-0 flex-[999_1_640px] flex-col gap-8">
            {!startedAt ? (
              <p className="m-0 rounded-[10px] border border-border bg-background p-6 text-base text-[#3d4743]">
                {totalQ} soru, {exam.duration_min} dakika. Hazır olduğunda süreyi başlat.
              </p>
            ) : (
              exam.sections.map((sec) => (
                <fieldset key={sec.code} className="m-0 flex flex-col gap-5 border-0 p-0" disabled={locked}>
                  <legend className="mb-1 flex w-full items-baseline justify-between border-b-2 border-[#111111] pb-2.5">
                    <span className="text-lg font-semibold uppercase tracking-[0.04em]">{sec.name}</span>
                    <span className="ml-3 text-sm text-muted tabular-nums">
                      {answeredBySection[sec.code] ?? 0} / {sec.question_count}
                    </span>
                  </legend>
                  {Array.from({ length: sec.question_count }, (_, i) => i + 1).map((no) => {
                    const img = exam.images[imageKey(sec.code, no)];
                    return (
                      <article
                        key={no}
                        id={`soru-${sec.code}-${no}`}
                        className="flex scroll-mt-4 flex-col gap-4 rounded-[10px] border border-border bg-background p-4 sm:p-6"
                      >
                        <h3 className="m-0 text-lg font-semibold">{no}. soru</h3>
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element -- depodaki hazır WebP; boyut bilgisi var
                          <img
                            src={examImageUrl(img.path)}
                            alt={`${sec.name} ${no}. soru`}
                            width={img.width ?? undefined}
                            height={img.height ?? undefined}
                            loading={no <= 2 ? "eager" : "lazy"}
                            className="h-auto w-full max-w-[760px] select-none"
                          />
                        ) : (
                          <p className="m-0 text-muted">Bu sorunun resmi yok.</p>
                        )}
                        <Bubbles sectionName={sec.name} no={no} chosen={answers[sec.code]?.[String(no)]} locked={locked} onPick={(L) => pick(sec.code, no, L)} />
                      </article>
                    );
                  })}
                </fieldset>
              ))
            )}
            <div className="rounded-[10px] border border-border bg-background p-5 sm:p-7">{finishArea}</div>
          </section>
        </main>
      </div>
    );
  }

  // 3) Varsayılan: kitapçık yeni sekmede, optik form burada
  return (
    <div className="defter flex min-h-full flex-1 flex-col text-foreground">
      {header}
      <main className="mx-auto flex w-full max-w-[1200px] flex-wrap items-start gap-8 px-4 pt-10 pb-16 sm:px-6">
        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-7">
            <h2 className="m-0 text-xl font-semibold">1. Kitapçığı aç</h2>
            <p className="m-0 text-base leading-relaxed text-[#3d4743]">
              Soruları kitapçıktan oku, cevapları bu sayfadaki optik forma işaretle.
              <span className="hidden lg:inline"> Bilgisayardaysan kitapçığı bu sayfada, cevap kâğıdının yanında da açabilirsin.</span>
            </p>
            {exam.booklet_url ? (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setSplit(true)}
                  className="hidden items-center justify-center gap-2.5 rounded-md bg-primary px-5 py-4 text-[17px] font-semibold text-primary-foreground hover:bg-primary-hover lg:flex"
                >
                  <BookIcon />
                  Kitapçığı yanda aç
                </button>
                <a
                  href={exam.booklet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-md bg-primary px-5 py-4 text-[17px] font-semibold text-primary-foreground no-underline hover:bg-primary-hover lg:border lg:border-primary lg:bg-background lg:text-primary lg:hover:bg-primary-soft"
                >
                  <BookIcon />
                  Kitapçığı yeni sekmede aç
                </a>
              </div>
            ) : null}
            {exam.booklet_label ? <p className="m-0 text-sm text-muted">{exam.booklet_label}</p> : null}
          </div>

          <div className="flex flex-col gap-3.5 rounded-[10px] border border-border bg-background p-7">
            <h2 className="m-0 text-xl font-semibold">2. Süreyi başlat, işaretle</h2>
            <ul className="m-0 flex flex-col gap-2.5 pl-5 text-[15px] leading-relaxed text-[#3d4743]">
              <li>Bir şıkka tıkla, işaretlensin. Aynı şıkka tekrar tıklarsan silinir.</li>
              <li>Boş bırakmak serbest. 3 yanlış 1 doğruyu götürür.</li>
              <li>Cevapların bu cihazda saklanır; sayfa kapansa da kaybolmaz.</li>
            </ul>
            {startButton ? <div className="mt-2 flex flex-col">{startButton}</div> : null}
            {timeUpNote}
          </div>

          <p className="mx-1 my-0 -rotate-1 font-hand text-2xl text-primary">acele etme, süre senin ↓</p>
        </aside>

        <section aria-label="Optik form" className="flex min-w-0 flex-[999_1_640px] flex-col gap-6 rounded-[10px] border border-border bg-background p-5 sm:p-7">
          {!startedAt && loaded ? (
            <p className="m-0 rounded-md bg-primary-soft p-3 text-[15px] text-primary">İşaretlemeye başlamak için önce süreyi başlat.</p>
          ) : null}
          {opticForm(true)}
          {finishArea}
        </section>
      </main>
    </div>
  );
}

function Bubbles({
  sectionName,
  no,
  chosen,
  locked,
  onPick,
}: {
  sectionName: string;
  no: number;
  chosen: string | undefined;
  locked: boolean;
  onPick: (letter: string) => void;
}) {
  return (
    <div className="flex gap-2.5">
      {LETTERS.map((L) => {
        const on = chosen === L;
        return (
          <button
            key={L}
            type="button"
            aria-label={`${sectionName} ${no}. soru, ${L} şıkkı`}
            aria-pressed={on}
            onClick={() => onPick(L)}
            className={`size-11 rounded-full border-[1.5px] text-[15px] font-semibold transition-colors disabled:cursor-not-allowed ${
              on ? "border-primary bg-primary text-primary-foreground" : "border-[#9db0a5] bg-background text-[#3d4743] enabled:hover:bg-primary-soft"
            } ${locked && !on ? "opacity-60" : ""}`}
          >
            {L}
          </button>
        );
      })}
    </div>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" />
      <path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
    </svg>
  );
}
