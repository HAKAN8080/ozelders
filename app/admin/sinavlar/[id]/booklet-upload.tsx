"use client";

import { useEffect, useState } from "react";

import { setExamBooklet } from "@/app/admin/sinavlar/actions";
import { bookletPublicUrl, EXAM_BOOKLET_BUCKET } from "@/lib/exam-images";
import { takePendingPdf } from "@/lib/pending-pdf";
import { createClient } from "@/lib/supabase/client";

const MAX_MB = 30;

/**
 * Kendi denememizin kitapçık PDF'i: tarayıcı doğrudan depoya yükler (sunucu limitine takılmaz),
 * öğrenci cevap kâğıdının yanında açar. Resmi kitapçıklar buraya yüklenmez; onlara bağlantı verilir.
 */
export function BookletUpload({
  examId,
  initialPath,
  onChange,
}: {
  examId: string;
  initialPath: string | null;
  onChange?: (path: string | null) => void;
}) {
  const [path, setPath] = useState(initialPath);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function upload(file: File) {
    setMsg(null);
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return setMsg({ ok: false, text: "Yalnızca PDF yüklenebilir." });
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return setMsg({ ok: false, text: `PDF en fazla ${MAX_MB} MB olabilir (bu dosya ${(file.size / 1048576).toFixed(1)} MB).` });
    }
    setBusy(`Yükleniyor… (${(file.size / 1048576).toFixed(1)} MB)`);
    const supabase = createClient();
    const newPath = `${examId}/kitapcik-${crypto.randomUUID().slice(0, 8)}.pdf`;
    const { error } = await supabase.storage
      .from(EXAM_BOOKLET_BUCKET)
      .upload(newPath, file, { contentType: "application/pdf", cacheControl: "31536000", upsert: false });
    if (error) {
      setBusy(null);
      return setMsg({ ok: false, text: `Yüklenemedi: ${error.message}` });
    }
    const res = await setExamBooklet(examId, newPath);
    setBusy(null);
    if (!res.ok) {
      await supabase.storage.from(EXAM_BOOKLET_BUCKET).remove([newPath]);
      return setMsg({ ok: false, text: res.error });
    }
    setPath(newPath);
    onChange?.(newPath);
    setMsg({ ok: true, text: res.message ?? "Yüklendi." });
  }

  async function remove() {
    if (!confirm("Kitapçık PDF'i kaldırılsın mı?")) return;
    setBusy("Kaldırılıyor…");
    const res = await setExamBooklet(examId, null);
    setBusy(null);
    if (!res.ok) return setMsg({ ok: false, text: res.error });
    setPath(null);
    onChange?.(null);
    setMsg({ ok: true, text: res.message ?? "Kaldırıldı." });
  }

  // "Yeni sınav" ekranında seçilen PDF varsa hemen yükle
  useEffect(() => {
    const f = takePendingPdf();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- önceki ekrandan gelen dosyayı tek seferlik yükle
    if (f) void upload(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca ilk açılışta
  }, []);

  return (
    <section className="flex flex-col gap-3 rounded-[10px] border border-border bg-background p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-xl font-semibold">Kitapçık PDF&apos;i (kendi denememiz)</h2>
        <p className="m-0 max-w-[52em] text-[15px] leading-relaxed text-[#3d4743]">
          PDF sitemize yüklenir; öğrenci bilgisayarda cevap kâğıdının yanında, telefonda yeni sekmede açar. Resmi kitapçıkları buraya
          yükleme; onlar için aşağıdaki &ldquo;Kitapçık bağlantısı&rdquo; alanına resmi adresi gir.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className={`flex cursor-pointer items-center rounded-md px-4 py-2.5 font-semibold ${path ? "border border-border hover:bg-primary-soft" : "bg-primary text-primary-foreground hover:bg-primary-hover"}`}>
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            aria-label="Kitapçık PDF'i yükle"
            disabled={!!busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void upload(f);
            }}
          />
          {path ? "PDF'i değiştir" : "PDF yükle"}
        </label>
        {path ? (
          <>
            <a href={bookletPublicUrl(path)} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
              Yüklü PDF&apos;i aç ↗
            </a>
            <button type="button" onClick={() => void remove()} disabled={!!busy} className="text-[15px] text-destructive hover:underline">
              Kaldır
            </button>
          </>
        ) : (
          <span className="text-[15px] text-muted">Henüz PDF yok.</span>
        )}
      </div>
      {busy ? (
        <p className="m-0 text-[15px] text-muted" role="status">
          {busy}
        </p>
      ) : null}
      {msg ? (
        <p className={`m-0 text-[15px] ${msg.ok ? "text-primary" : "text-destructive"}`} role={msg.ok ? "status" : "alert"}>
          {msg.text}
        </p>
      ) : null}
    </section>
  );
}
