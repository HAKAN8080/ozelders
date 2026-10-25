"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteDraftExam, saveExam, setExamStatus, type ActionResult } from "@/app/admin/sinavlar/actions";
import { PdfImageImport } from "@/app/admin/sinavlar/[id]/pdf-image-import";
import { BulkImageButton, ImageCell, useQuestionImages } from "@/app/admin/sinavlar/[id]/question-images";
import { QuestionTable, type EditableSection } from "@/app/admin/sinavlar/question-table";
import type { QuestionImage } from "@/lib/exam-images";

type Status = "taslak" | "yayinda" | "arsiv";
type ExamMeta = {
  id: string;
  slug: string;
  status: Status;
  title: string;
  subtitle: string;
  grade: number;
  booklet_url: string;
  booklet_label: string;
  duration_min: number;
};

const field =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const statusLabel: Record<Status, string> = { taslak: "Taslak", yayinda: "Yayında", arsiv: "Arşiv" };

export function ExamEditor({
  exam,
  sections: initial,
  attemptCount,
  images,
}: {
  exam: ExamMeta;
  sections: EditableSection[];
  attemptCount: number;
  images: Record<string, QuestionImage>;
}) {
  const router = useRouter();
  const [meta, setMeta] = useState(exam);
  const [sections, setSections] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const imgs = useQuestionImages(exam.id, images);
  const totalQ = sections.reduce((n, s) => n + s.questions.length, 0);
  const missing = sections.reduce((n, s) => n + s.questions.filter((q) => !q.correct).length, 0);

  function upd<K extends keyof ExamMeta>(k: K, v: ExamMeta[K]) {
    setMeta({ ...meta, [k]: v });
    setDirty(true);
  }

  function run(fn: () => Promise<ActionResult>, after?: () => void) {
    setMsg(null);
    startTransition(async () => {
      const res = await fn();
      if (!res) return; // yönlendirme
      setMsg(res.ok ? { ok: true, text: res.message ?? "Tamam." } : { ok: false, text: res.error });
      if (res.ok) {
        after?.();
        router.refresh();
      }
    });
  }

  const save = () =>
    run(
      () =>
        saveExam(
          exam.id,
          {
            title: meta.title,
            subtitle: meta.subtitle,
            grade: meta.grade,
            booklet_url: meta.booklet_url,
            booklet_label: meta.booklet_label,
            duration_min: meta.duration_min,
          },
          sections.flatMap((s) => s.questions.map((q) => ({ section: s.code, no: q.no, correct: q.correct, topic: q.topic }))),
        ),
      () => setDirty(false),
    );

  const changeStatus = (status: Status) => {
    if (dirty) {
      setMsg({ ok: false, text: "Önce değişiklikleri kaydet." });
      return;
    }
    run(() => setExamStatus(exam.id, status), () => setMeta((m) => ({ ...m, status })));
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-border bg-background p-5">
        <div className="flex flex-wrap items-center gap-3 text-[15px]">
          <span className={`rounded px-2 py-1 text-[13px] font-semibold ${meta.status === "yayinda" ? "bg-primary text-primary-foreground" : "border border-[#c9d3cd] bg-[#f1f3f2]"}`}>
            {statusLabel[meta.status]}
          </span>
          <span className="text-muted">/deneme/{exam.slug}</span>
          <span className="text-muted">· {attemptCount} çözüm</span>
          {meta.status === "yayinda" ? (
            <Link href={`/deneme/${exam.slug}`} target="_blank" className="font-semibold text-primary hover:underline">
              Sitede gör ↗
            </Link>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {meta.status !== "yayinda" ? (
            <button type="button" disabled={pending} onClick={() => changeStatus("yayinda")} className="rounded-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
              Yayınla
            </button>
          ) : (
            <button type="button" disabled={pending} onClick={() => changeStatus("taslak")} className="rounded-md border border-border px-4 py-2.5 font-semibold hover:bg-primary-soft disabled:opacity-50">
              Yayından kaldır
            </button>
          )}
          {meta.status !== "arsiv" ? (
            <button type="button" disabled={pending} onClick={() => changeStatus("arsiv")} className="rounded-md border border-border px-4 py-2.5 font-semibold hover:bg-primary-soft disabled:opacity-50">
              Arşive al
            </button>
          ) : null}
          {meta.status === "taslak" && attemptCount === 0 ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (confirm("Bu taslak sınav kalıcı olarak silinsin mi?")) run(() => deleteDraftExam(exam.id));
              }}
              className="rounded-md border border-destructive px-4 py-2.5 font-semibold text-destructive hover:bg-[#fdeeee] disabled:opacity-50"
            >
              Sil
            </button>
          ) : null}
        </div>
      </section>

      {attemptCount > 0 ? (
        <p className="m-0 rounded-md bg-[#fff6e5] p-4 text-[15px] text-[#7a4b00]" role="note">
          Bu sınavı {attemptCount} kişi çözdü. Cevap anahtarını değiştirirsen yalnızca <strong>yeni</strong> çözümler yeni anahtarla puanlanır;
          eski sonuçlar olduğu gibi kalır. Konu adı değişiklikleri sorunsuzdur.
        </p>
      ) : null}

      <section className="flex flex-col gap-2 rounded-[10px] border border-border bg-background p-5 text-[15px] leading-relaxed">
        <h2 className="m-0 text-lg font-semibold">Öğrenci soruları nereden görecek?</h2>
        <p className="m-0 text-[#3d4743]">
          <strong>Resmi kitapçık:</strong> aşağıya kitapçığın resmi bağlantısını gir; öğrenci kitapçığı cevap kâğıdının yanında açar, dosya bizde durmaz.
          <br />
          <strong>Kendi denememiz:</strong> PDF&apos;ini aşağıdan yükle, sorular otomatik kesilsin; ya da tablodaki &ldquo;Resim&rdquo; sütunundan
          soruları tek tek ekle / değiştir.
        </p>
        <p className="m-0 font-semibold">
          Soru resmi: {imgs.count} / {totalQ}
          {meta.booklet_url ? " · kitapçık bağlantısı var" : ""}
        </p>
        {imgs.error ? (
          <p className="m-0 text-destructive" role="alert">
            {imgs.error}
          </p>
        ) : null}
      </section>

      <PdfImageImport sections={sections} imgs={imgs} />

      <section className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 rounded-[10px] border border-border bg-background p-6">
        <h2 className="col-span-full m-0 text-xl font-semibold">Sınav bilgileri</h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Sınav adı</span>
          <input className={field} value={meta.title} onChange={(e) => upd("title", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Alt başlık</span>
          <input className={field} value={meta.subtitle} onChange={(e) => upd("subtitle", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Sınıf</span>
          <select className={field} value={meta.grade} onChange={(e) => upd("grade", Number(e.target.value))}>
            {[5, 6, 7, 8].map((g) => (
              <option key={g} value={g}>
                {g}. sınıf
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Süre (dakika)</span>
          <input className={field} type="number" min={5} max={300} value={meta.duration_min} onChange={(e) => upd("duration_min", Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Kitapçık bağlantısı (resmi kaynak)</span>
          <input className={field} value={meta.booklet_url} onChange={(e) => upd("booklet_url", e.target.value)} placeholder="https://…" inputMode="url" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Kitapçık notu</span>
          <input className={field} value={meta.booklet_label} onChange={(e) => upd("booklet_label", e.target.value)} />
        </label>
      </section>

      {sections.map((s, i) => (
        <QuestionTable
          key={s.code}
          section={s}
          fixedCount
          extraHeader="Resim"
          renderExtra={(q) => <ImageCell section={s.code} no={q.no} imgs={imgs} />}
          headerActions={<BulkImageButton section={s} imgs={imgs} />}
          onChange={(next) => {
            setSections(sections.map((x, j) => (j === i ? next : x)));
            setDirty(true);
          }}
        />
      ))}

      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center justify-end gap-4 border-t border-border bg-[#f7f8f7]/95 px-1 py-4 backdrop-blur">
        {msg ? (
          <span className={`text-[15px] ${msg.ok ? "text-primary" : "text-destructive"}`} role={msg.ok ? "status" : "alert"}>
            {msg.text}
          </span>
        ) : dirty ? (
          <span className="text-[15px] text-muted">Kaydedilmemiş değişiklikler var</span>
        ) : null}
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty || missing > 0}
          className="rounded-md bg-[#111111] px-6 py-3.5 font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}
