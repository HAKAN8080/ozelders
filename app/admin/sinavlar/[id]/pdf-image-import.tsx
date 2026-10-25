"use client";

import { useEffect, useState } from "react";

import type { Imgs } from "@/app/admin/sinavlar/[id]/question-images";
import type { EditableSection } from "@/app/admin/sinavlar/question-table";
import { imageKey } from "@/lib/exam-images";
import type { Crop, CropMode } from "@/lib/pdf-crop";

/**
 * Kendi deneme PDF'imizden soru resimlerini keser, önizletir, onaylanınca yükler.
 * PDF sunucuya gitmez; yalnızca kesilen soru resimleri yüklenir.
 */
export function PdfImageImport({ sections, imgs }: { sections: EditableSection[]; imgs: Imgs }) {
  const [mode, setMode] = useState<CropMode>("auto");
  const [file, setFile] = useState<File | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [skip, setSkip] = useState<Set<string>>(new Set());
  const [warnings, setWarnings] = useState<string[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  // Önizleme adreslerini bellekte bırakma
  useEffect(() => () => crops.forEach((c) => URL.revokeObjectURL(c.url)), [crops]);

  async function run(f: File, m: CropMode) {
    setDone(null);
    setWarnings([]);
    setCrops([]);
    setSkip(new Set());
    setProgress(0);
    try {
      const { cropExamPdf } = await import("@/lib/pdf-crop");
      const res = await cropExamPdf(f, { mode: m, sectionSizes: sections.map((s) => s.questions.length) }, (d, t) =>
        setProgress(Math.round((d / t) * 100)),
      );
      setCrops(res.crops);
      setWarnings(res.warnings);
    } catch {
      setWarnings(["PDF okunamadı. Dosya bozuk ya da şifreli olabilir."]);
    } finally {
      setProgress(null);
    }
  }

  const keyOf = (c: Crop) => imageKey(sections[c.section].code, c.no);
  const selected = crops.filter((c) => !skip.has(keyOf(c)));
  const replacing = selected.filter((c) => imgs.images[keyOf(c)]).length;

  async function uploadAll() {
    setUploading(true);
    const ok = await imgs.uploadMany(
      selected.map((c) => ({ section: sections[c.section].code, no: c.no, blob: c.blob, width: c.width, height: c.height })),
    );
    setUploading(false);
    setDone(`${ok} soru resmi yüklendi.`);
    setCrops([]);
    setFile(null);
  }

  return (
    <section className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-xl font-semibold">PDF&apos;ten soru resimleri</h2>
        <p className="m-0 max-w-[52em] text-[15px] leading-relaxed text-[#3d4743]">
          Kendi hazırladığın deneme PDF&apos;ini seç; sorular numaralarına göre tek tek kesilir, önizlemede kontrol edip yüklersin. PDF&apos;in
          kendisi sunucuya gitmez, yalnızca soru resimleri yüklenir. Resmi kitapçıklar için bunu kullanma, onlara bağlantı ver.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center rounded-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover">
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            aria-label="Deneme PDF'i seç"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) {
                setFile(f);
                void run(f, mode);
              }
            }}
          />
          {file ? "Başka PDF seç" : "PDF seç"}
        </label>
        <fieldset className="m-0 flex flex-wrap items-center gap-4 border-0 p-0 text-[15px]">
          <legend className="sr-only">Kesme yöntemi</legend>
          {(
            [
              ["auto", "Soru numaralarına göre kes"],
              ["page", "Her sayfa bir soru"],
            ] as const
          ).map(([v, label]) => (
            <label key={v} className="flex items-center gap-2">
              <input
                type="radio"
                name="crop-mode"
                checked={mode === v}
                onChange={() => {
                  setMode(v);
                  if (file) void run(file, v);
                }}
              />
              {label}
            </label>
          ))}
        </fieldset>
      </div>

      {progress !== null ? (
        <p className="m-0 text-[15px] text-muted" role="status">
          PDF işleniyor… %{progress}
        </p>
      ) : null}
      {warnings.map((w) => (
        <p key={w} className="m-0 rounded-md bg-[#fff6e5] p-3 text-[15px] text-[#7a4b00]" role="status">
          {w}
        </p>
      ))}
      {done ? (
        <p className="m-0 rounded-md bg-primary-soft p-3 text-[15px] text-primary" role="status">
          {done}
        </p>
      ) : null}

      {crops.length ? (
        <>
          {sections.map((sec, si) => {
            const list = crops.filter((c) => c.section === si);
            if (!list.length) return null;
            return (
              <div key={sec.code} className="flex flex-col gap-3">
                <h3 className="m-0 text-base font-semibold">
                  {sec.name} · {list.length} / {sec.questions.length} soru
                </h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                  {list.map((c) => {
                    const k = keyOf(c);
                    const off = skip.has(k);
                    return (
                      <figure key={k} className={`m-0 flex flex-col gap-2 rounded-md border p-2 ${off ? "border-dashed border-border opacity-50" : "border-border"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- yerel önizleme (blob:) */}
                        <img src={c.url} alt={`${sec.name} ${c.no}. soru önizleme`} className="max-h-72 w-full object-contain object-top" />
                        <figcaption className="flex items-center justify-between gap-2 text-sm">
                          <span>
                            <strong>{c.no}. soru</strong> <span className="text-muted">· s.{c.page}</span>
                            {imgs.images[k] ? <span className="text-[#7a4b00]"> · eskisinin yerine</span> : null}
                          </span>
                          <label className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={!off}
                              onChange={() =>
                                setSkip((s) => {
                                  const n = new Set(s);
                                  if (n.has(k)) n.delete(k);
                                  else n.add(k);
                                  return n;
                                })
                              }
                            />
                            Yükle
                          </label>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="flex flex-wrap items-center justify-end gap-4 border-t border-border pt-4">
            {replacing ? <span className="text-[15px] text-[#7a4b00]">{replacing} soruda mevcut resim değişecek</span> : null}
            <button
              type="button"
              onClick={() => {
                setCrops([]);
                setFile(null);
              }}
              disabled={uploading}
              className="rounded-md border border-border px-4 py-2.5 font-semibold hover:bg-primary-soft"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => void uploadAll()}
              disabled={uploading || !selected.length}
              className="rounded-md bg-[#111111] px-5 py-2.5 font-semibold text-white hover:bg-black disabled:opacity-50"
            >
              {uploading ? "Yükleniyor…" : `${selected.length} resmi yükle`}
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
