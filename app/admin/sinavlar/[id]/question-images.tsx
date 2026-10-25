"use client";

import { useState } from "react";

import { removeQuestionImage, setQuestionImage } from "@/app/admin/sinavlar/actions";
import type { EditableSection } from "@/app/admin/sinavlar/question-table";
import { compressImage, EXAM_IMAGE_BUCKET, examImageUrl, imageKey, naturalSort, type QuestionImage } from "@/lib/exam-images";
import { createClient } from "@/lib/supabase/client";

const ACCEPT = "image/png,image/jpeg,image/webp";

/** Soru resimlerinin durumu: tarayıcıda küçültür, depoya yükler, soruyla eşleştirir. */
export function useQuestionImages(examId: string, initial: Record<string, QuestionImage>) {
  const [images, setImages] = useState(initial);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  async function upload(section: string, no: number, file: File): Promise<boolean> {
    const key = imageKey(section, no);
    setBusy((b) => ({ ...b, [key]: true }));
    try {
      const { blob, width, height } = await compressImage(file);
      const path = `${examId}/${section}-${no}-${crypto.randomUUID().slice(0, 8)}.webp`;
      const supabase = createClient();
      const { error: upErr } = await supabase.storage
        .from(EXAM_IMAGE_BUCKET)
        .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
      if (upErr) throw new Error(upErr.message);
      const res = await setQuestionImage(examId, section, no, { path, width, height });
      if (!res.ok) {
        await supabase.storage.from(EXAM_IMAGE_BUCKET).remove([path]);
        throw new Error(res.error);
      }
      setImages((m) => ({ ...m, [key]: { path, width, height } }));
      return true;
    } catch (e) {
      setError(`${section} ${no}. soru: ${e instanceof Error ? e.message : "resim yüklenemedi"}`);
      return false;
    } finally {
      setBusy((b) => ({ ...b, [key]: false }));
    }
  }

  async function remove(section: string, no: number) {
    const key = imageKey(section, no);
    setBusy((b) => ({ ...b, [key]: true }));
    const res = await removeQuestionImage(examId, section, no);
    setBusy((b) => ({ ...b, [key]: false }));
    if (!res.ok) return setError(res.error);
    setImages((m) => {
      const next = { ...m };
      delete next[key];
      return next;
    });
  }

  /** Seçilen dosyalar ada göre sıralanır (soru1, soru2 … soru10) ve 1. sorudan itibaren dağıtılır. */
  async function bulk(section: EditableSection, files: File[]) {
    setError(null);
    const sorted = naturalSort(files).slice(0, section.questions.length);
    // Aynı anda 3 yükleme: hızlı ama tarayıcıyı boğmaz
    const queue = sorted.map((f, i) => ({ f, no: section.questions[i].no }));
    await Promise.all(
      Array.from({ length: 3 }, async () => {
        for (let item = queue.shift(); item; item = queue.shift()) await upload(section.code, item.no, item.f);
      }),
    );
    if (files.length !== section.questions.length) {
      setError(
        `${section.name}: ${files.length} resim seçildi, bölümde ${section.questions.length} soru var. ` +
          `Resimler ada göre sıralanıp 1. sorudan başlayarak yerleştirildi; kontrol et.`,
      );
    }
  }

  const count = Object.keys(images).length;
  return { images, busy, error, setError, upload, remove, bulk, count };
}

type Imgs = ReturnType<typeof useQuestionImages>;

export function BulkImageButton({ section, imgs }: { section: EditableSection; imgs: Imgs }) {
  const anyBusy = section.questions.some((q) => imgs.busy[imageKey(section.code, q.no)]);
  return (
    <label className="flex h-10 cursor-pointer items-center rounded-md border border-border px-3 text-sm font-semibold hover:bg-primary-soft">
      <input
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        aria-label={`${section.name} için toplu soru resmi yükle`}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) void imgs.bulk(section, files);
        }}
      />
      {anyBusy ? "Yükleniyor…" : "Toplu resim yükle"}
    </label>
  );
}

export function ImageCell({ section, no, imgs }: { section: string; no: number; imgs: Imgs }) {
  const key = imageKey(section, no);
  const img = imgs.images[key];
  const busy = imgs.busy[key];

  const picker = (label: string) => (
    <label className="cursor-pointer text-sm font-semibold text-primary hover:underline">
      <input
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-label={`${no}. soru resmi`}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void imgs.upload(section, no, f);
        }}
      />
      {label}
    </label>
  );

  if (busy) return <span className="text-sm text-muted">Yükleniyor…</span>;
  if (!img) return picker("+ Resim ekle");
  return (
    <div className="flex items-center gap-3">
      <a href={examImageUrl(img.path)} target="_blank" rel="noreferrer" title="Büyük aç">
        {/* eslint-disable-next-line @next/next/no-img-element -- yönetim önizlemesi, optimizasyon gereksiz */}
        <img src={examImageUrl(img.path)} alt={`${no}. soru`} className="h-14 w-20 rounded border border-border object-cover object-top" />
      </a>
      <div className="flex flex-col gap-0.5">
        {picker("Değiştir")}
        <button type="button" onClick={() => void imgs.remove(section, no)} className="text-left text-sm text-destructive hover:underline">
          Kaldır
        </button>
      </div>
    </div>
  );
}
