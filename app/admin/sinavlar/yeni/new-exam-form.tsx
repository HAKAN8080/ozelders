"use client";

import { useState, useTransition } from "react";

import { createExam } from "@/app/admin/sinavlar/actions";
import { QuestionTable, type EditableSection } from "@/app/admin/sinavlar/question-table";
import { parseExamPages } from "@/lib/exam-pdf";
import { setPendingPdf } from "@/lib/pending-pdf";
import { guessTopic } from "@/lib/topic-guess";

const field =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const SECTION_PRESETS = [
  { code: "matematik", name: "Matematik" },
  { code: "fen", name: "Fen Bilimleri" },
  { code: "turkce", name: "Türkçe" },
  { code: "inkilap", name: "T.C. İnkılap Tarihi ve Atatürkçülük" },
  { code: "din", name: "Din Kültürü ve Ahlak Bilgisi" },
  { code: "ingilizce", name: "İngilizce" },
];

function slugify(s: string) {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Kapaktan sınav adı tahmini: "2026" + "SAYISAL BÖLÜM" → "2026 LGS Sayısal Bölüm" */
function guessTitle(firstPage: string): string {
  const u = firstPage.toLocaleUpperCase("tr");
  const year = u.match(/\b(20\d{2})\b/)?.[1];
  const part = u.includes("SAYISAL") ? "Sayısal Bölüm" : u.includes("SÖZEL") ? "Sözel Bölüm" : "";
  return [year, "LGS", part].filter(Boolean).join(" ").trim();
}

/** Kendi PDF'imizde dersi metinden tahmin et (yalnızca varsayılan seçim için). */
function guessSubject(text: string): string {
  const u = text.toLocaleUpperCase("tr");
  if (/FEN BİLİMLERİ|FEN BILIMLERI/.test(u)) return "fen";
  if (/TÜRK DİLİ|TÜRKÇE|EDEBİYAT/.test(u)) return "turkce";
  if (/İNKILAP/.test(u)) return "inkilap";
  if (/DİN KÜLTÜRÜ/.test(u)) return "din";
  if (/İNGİLİZCE|ENGLISH/.test(u)) return "ingilizce";
  return "matematik";
}

export function NewExamForm() {
  const [sections, setSections] = useState<EditableSection[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [reading, setReading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  /** Cevap anahtarı olmayan kendi PDF'imiz: oluşturulunca soru resimleri bundan kesilir */
  const [ownFile, setOwnFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [grade, setGrade] = useState(8);
  const [duration, setDuration] = useState(80);
  const [bookletUrl, setBookletUrl] = useState("");
  const [bookletLabel, setBookletLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setReading(true);
    setFileName(file.name);
    try {
      // PDF yalnızca bu tarayıcıda okunur; sunucuya yüklenmez.
      const { getDocumentProxy, extractText } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
      const { totalPages, text } = await extractText(pdf, { mergePages: false });
      const pages = text as string[];
      const parsed = parseExamPages(pages);
      setOwnFile(null);
      if (!parsed.sections.length) {
        // Resmi kitapçık değil: kendi denememiz. Soru numaralarını say, bölümü aç.
        const { detectQuestionCounts } = await import("@/lib/pdf-crop");
        const { sizes } = await detectQuestionCounts(file);
        if (!sizes.length) {
          setSections([]);
          setWarnings([
            "PDF'te soru numarası (1., 2., 3. …) bulunamadı; taranmış bir görüntü olabilir. Aşağıdan bölümü elle ekle, sınavı oluştur, sonra düzenleme ekranında “Her sayfa bir soru” ile resimleri ekle.",
          ]);
          return;
        }
        const guess = guessSubject(pages.join(" "));
        const order = [guess, ...SECTION_PRESETS.map((p) => p.code).filter((c) => c !== guess)];
        setSections(
          sizes.map((n, i) => {
            const preset = SECTION_PRESETS.find((p) => p.code === order[i]) ?? SECTION_PRESETS[i];
            return { code: preset.code, name: preset.name, questions: Array.from({ length: n }, (_, k) => ({ no: k + 1, correct: "", topic: "" })) };
          }),
        );
        setOwnFile(file);
        setWarnings([
          `Kendi denemen olarak algılandı: ${sizes.join(" + ")} soru bulundu (cevap anahtarı yok). Bölüm adını kontrol et, cevapları gir ya da yapıştır. Sınavı oluşturunca bu PDF sitemize yüklenecek ve öğrenci cevap kâğıdının yanında açacak.`,
        ]);
        return;
      }
      setWarnings(parsed.warnings);
      setSections(
        parsed.sections.map((s) => ({
          code: s.code,
          name: s.name,
          questions: s.answers.map((a, i) => ({
            no: i + 1,
            correct: a,
            topic: guessTopic(s.code, s.snippets[i + 1]) ?? "",
            snippet: s.snippets[i + 1],
          })),
        })),
      );
      const t = guessTitle(pages[0] ?? "");
      if (t && !title) {
        setTitle(t);
        if (!slugTouched) setSlug(slugify(t));
      }
      const totalQ = parsed.sections.reduce((n, s) => n + s.answers.length, 0);
      if (!subtitle && parsed.sections.length) {
        setSubtitle(parsed.sections.map((s) => `${s.name} ${s.answers.length}`).join(" + ") + " soru");
      }
      if (!bookletLabel) setBookletLabel(`${totalPages} sayfa`);
      if (totalQ === 40) setDuration(80);
    } catch {
      setError("PDF okunamadı. Dosya bozuk ya da şifreli olabilir.");
    } finally {
      setReading(false);
    }
  }

  function addSection(code: string) {
    const preset = SECTION_PRESETS.find((p) => p.code === code);
    if (!preset || sections.some((s) => s.code === code)) return;
    setSections([...sections, { code, name: preset.name, questions: Array.from({ length: 20 }, (_, i) => ({ no: i + 1, correct: "", topic: "" })) }]);
  }

  function submit() {
    setError(null);
    setPendingPdf(ownFile);
    startTransition(async () => {
      const res = await createExam({
        slug,
        title,
        subtitle,
        grade,
        booklet_url: bookletUrl.trim(),
        booklet_label: bookletLabel,
        duration_min: duration,
        sections: sections.map((s) => ({
          code: s.code,
          name: s.name,
          questions: s.questions.map((q) => ({ no: q.no, correct: q.correct, topic: q.topic })),
        })),
      });
      if (res && !res.ok) {
        setPendingPdf(null);
        setError(res.error);
      }
    });
  }

  const totalMissing = sections.reduce((n, s) => n + s.questions.filter((q) => !q.correct).length, 0);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-6">
        <h2 className="m-0 text-xl font-semibold">1. Kitapçık PDF’ini seç</h2>
        <p className="m-0 max-w-[48em] text-[15px] leading-relaxed text-[#3d4743]">
          PDF bu tarayıcıda okunur, <strong>sunucuya yüklenmez ve saklanmaz</strong>. Cevap anahtarı sayfasından cevaplar,
          sorulardan konu önerileri çıkarılır. Öğrenciler kitapçığı aşağıda gireceğin resmi bağlantıdan açar.
        </p>
        <label className="flex w-fit cursor-pointer items-center gap-3 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
          <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          {reading ? "Okunuyor…" : fileName ? "Başka PDF seç" : "PDF seç"}
        </label>
        {fileName ? <p className="m-0 text-sm text-muted">{fileName}</p> : null}
        {warnings.map((w) => (
          <p key={w} className="m-0 rounded-md bg-[#fff6e5] p-3 text-[15px] text-[#7a4b00]" role="status">
            {w}
          </p>
        ))}
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4 text-[15px]">
          <span className="text-muted">Kendi denememiz ya da eksik bölüm için elle ekle (cevapları yapıştır, soru sayısı ona göre ayarlanır):</span>
          {SECTION_PRESETS.filter((p) => !sections.some((s) => s.code === p.code)).map((p) => (
            <button key={p.code} type="button" onClick={() => addSection(p.code)} className="rounded-md border border-border px-3 py-1.5 hover:bg-primary-soft">
              + {p.name}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 rounded-[10px] border border-border bg-background p-6">
        <h2 className="col-span-full m-0 text-xl font-semibold">2. Sınav bilgileri</h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Sınav adı</span>
          <input
            className={field}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="2026 LGS Sözel Bölüm"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Kısa ad (adres)</span>
          <input
            className={field}
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setSlugTouched(true);
            }}
          />
          <span className="text-sm text-muted">/deneme/{slug || "…"}</span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Alt başlık</span>
          <input className={field} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Sınıf</span>
          <select className={field} value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
            {[5, 6, 7, 8].map((g) => (
              <option key={g} value={g}>
                {g}. sınıf
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Süre (dakika)</span>
          <input className={field} type="number" min={5} max={300} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Kitapçık bağlantısı (resmi kaynak)</span>
          <input className={field} value={bookletUrl} onChange={(e) => setBookletUrl(e.target.value)} placeholder="https://…" inputMode="url" />
          <span className="text-sm text-muted">Yalnızca resmi kitapçık için. Kendi denememizse boş bırak; PDF sitemize yüklenir.</span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Kitapçık notu</span>
          <input className={field} value={bookletLabel} onChange={(e) => setBookletLabel(e.target.value)} placeholder="A kitapçığı · 33 sayfa" />
        </label>
      </section>

      {sections.length ? (
        <>
          <h2 className="m-0 text-xl font-semibold">3. Cevapları ve konuları kontrol et</h2>
          {sections.map((s, i) => (
            <QuestionTable
              key={i}
              headerActions={
                ownFile ? (
                  <select
                    aria-label="Bölüm (ders)"
                    value={s.code}
                    onChange={(e) => {
                      const preset = SECTION_PRESETS.find((p) => p.code === e.target.value)!;
                      setSections(sections.map((x, j) => (j === i ? { ...x, code: preset.code, name: preset.name } : x)));
                    }}
                    className="h-10 rounded-md border border-border bg-background px-2 text-sm font-semibold"
                  >
                    {SECTION_PRESETS.filter((p) => p.code === s.code || !sections.some((x) => x.code === p.code)).map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                ) : null
              }
              section={s}
              onChange={(next) => setSections(sections.map((x, j) => (j === i ? next : x)))}
            />
          ))}
        </>
      ) : null}

      {error ? (
        <p className="m-0 text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-4">
        {totalMissing ? <span className="text-[15px] text-destructive">{totalMissing} sorunun cevabı eksik</span> : null}
        <button
          type="button"
          onClick={submit}
          disabled={pending || !sections.length || totalMissing > 0 || !title || !slug}
          className="rounded-md bg-[#111111] px-6 py-3.5 font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Oluşturuluyor…" : "Taslak olarak oluştur"}
        </button>
      </div>
    </div>
  );
}
