"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

/*
 * Tüm yönetim işlemleri admin oturumuyla yapılır; service role kullanılmaz.
 * Veritabanı da ayrıca yalnızca admin'e izin verir (RLS + admin_create_exam içindeki kontrol).
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LETTER = /^[A-E]$/;

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export type NewExamPayload = {
  slug: string;
  title: string;
  subtitle: string;
  grade: number;
  booklet_url: string;
  booklet_label: string;
  duration_min: number;
  sections: { code: string; name: string; questions: { no: number; correct: string; topic: string }[] }[];
};

function validateMeta(p: Pick<NewExamPayload, "slug" | "title" | "grade" | "booklet_url" | "duration_min">): string | null {
  if (!/^[a-z0-9-]{3,80}$/.test(p.slug)) return "Kısa ad yalnızca küçük harf, rakam ve tire içermeli (ör. 2025-lgs-sayisal).";
  if (!p.title || p.title.trim().length < 3 || p.title.length > 120) return "Sınav adı 3–120 karakter olmalı.";
  if (!Number.isInteger(p.grade) || p.grade < 1 || p.grade > 12) return "Sınıf 1–12 arasında olmalı.";
  if (!Number.isInteger(p.duration_min) || p.duration_min < 5 || p.duration_min > 300) return "Süre 5–300 dakika olmalı.";
  if (p.booklet_url && !/^https:\/\/\S+$/.test(p.booklet_url)) return "Kitapçık bağlantısı https:// ile başlamalı.";
  return null;
}

export async function createExam(payload: NewExamPayload): Promise<ActionResult> {
  await requireAdmin("/admin/sinavlar/yeni");

  const metaError = validateMeta(payload);
  if (metaError) return { ok: false, error: metaError };
  if (!Array.isArray(payload.sections) || payload.sections.length < 1 || payload.sections.length > 8) {
    return { ok: false, error: "En az bir bölüm olmalı." };
  }
  for (const s of payload.sections) {
    if (!/^[a-z0-9]{2,20}$/.test(s.code) || !s.name?.trim()) return { ok: false, error: "Bölüm adı/kodu geçersiz." };
    if (s.questions.length < 1 || s.questions.length > 100) return { ok: false, error: `${s.name}: soru sayısı 1–100 olmalı.` };
    const missing = s.questions.filter((q) => !LETTER.test(q.correct)).map((q) => q.no);
    if (missing.length) return { ok: false, error: `${s.name}: ${missing.join(", ")}. soruların cevabı eksik.` };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_create_exam", {
    p: {
      ...payload,
      sections: payload.sections.map((s) => ({
        code: s.code,
        name: s.name.trim(),
        questions: s.questions.map((q) => ({ no: q.no, correct: q.correct, topic: (q.topic ?? "").slice(0, 80) })),
      })),
    },
  });
  if (error || !data) {
    const dup = error?.message?.includes("exams_slug_key");
    return { ok: false, error: dup ? "Bu kısa ad zaten kullanılıyor." : `Sınav oluşturulamadı: ${error?.message ?? "bilinmeyen hata"}` };
  }
  redirect(`/admin/sinavlar/${data as string}?yeni=1`);
}

export async function saveExam(
  examId: string,
  meta: { title: string; subtitle: string; grade: number; booklet_url: string; booklet_label: string; duration_min: number },
  questions: { section: string; no: number; correct: string; topic: string }[],
): Promise<ActionResult> {
  await requireAdmin(`/admin/sinavlar/${examId}`);
  if (!UUID.test(examId)) return { ok: false, error: "Geçersiz sınav." };
  const metaError = validateMeta({ ...meta, slug: "gecici-ad" });
  if (metaError) return { ok: false, error: metaError };
  const bad = questions.filter((q) => !LETTER.test(q.correct));
  if (bad.length) return { ok: false, error: `Cevabı eksik sorular: ${bad.map((q) => `${q.section} ${q.no}`).join(", ")}` };

  const supabase = await createClient();
  const { error: e1 } = await supabase
    .from("exams")
    .update({
      title: meta.title.trim(),
      subtitle: meta.subtitle.trim() || null,
      grade: meta.grade,
      booklet_url: meta.booklet_url.trim() || null,
      booklet_label: meta.booklet_label.trim() || null,
      duration_min: meta.duration_min,
    })
    .eq("id", examId);
  if (e1) return { ok: false, error: `Bilgiler kaydedilemedi: ${e1.message}` };

  const { error: e2 } = await supabase.from("exam_questions").upsert(
    questions.map((q) => ({
      exam_id: examId,
      section: q.section,
      no: q.no,
      correct: q.correct,
      topic: q.topic.trim().slice(0, 80) || null,
    })),
    { onConflict: "exam_id,section,no" },
  );
  if (e2) return { ok: false, error: `Sorular kaydedilemedi: ${e2.message}` };

  updateTag("exams");
  return { ok: true, message: "Kaydedildi." };
}

export async function setExamStatus(examId: string, status: "taslak" | "yayinda" | "arsiv"): Promise<ActionResult> {
  await requireAdmin(`/admin/sinavlar/${examId}`);
  if (!UUID.test(examId)) return { ok: false, error: "Geçersiz sınav." };
  const supabase = await createClient();

  if (status === "yayinda") {
    const { data: secs } = await supabase.from("exam_sections").select("name, question_count").eq("exam_id", examId);
    if (!secs?.length || secs.some((s) => s.question_count < 1)) {
      return { ok: false, error: "Yayınlamadan önce her bölümde en az bir soru olmalı." };
    }
    const { data: exam } = await supabase.from("exams").select("booklet_url, booklet_path, published_at").eq("id", examId).single();
    if (!exam?.booklet_url && !exam?.booklet_path) {
      // Kitapçık bağlantısı yoksa her sorunun resmi olmalı (kendi hazırladığımız deneme).
      const total = secs.reduce((n, s) => n + s.question_count, 0);
      const { count } = await supabase
        .from("exam_question_images")
        .select("no", { count: "exact", head: true })
        .eq("exam_id", examId);
      if ((count ?? 0) < total) {
        return {
          ok: false,
          error: `Yayınlamak için kitapçık PDF'ini yükle, resmi kitapçık bağlantısı gir ya da tüm sorulara resim ekle (${count ?? 0}/${total} resim var).`,
        };
      }
    }
    if (!exam) return { ok: false, error: "Sınav bulunamadı." };
    const { error } = await supabase
      .from("exams")
      .update({ status, published_at: exam.published_at ?? new Date().toISOString() })
      .eq("id", examId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("exams").update({ status }).eq("id", examId);
    if (error) return { ok: false, error: error.message };
  }

  updateTag("exams");
  return { ok: true, message: status === "yayinda" ? "Sınav yayında." : status === "arsiv" ? "Arşive alındı." : "Taslağa çekildi." };
}

export async function deleteDraftExam(examId: string): Promise<ActionResult> {
  await requireAdmin(`/admin/sinavlar/${examId}`);
  if (!UUID.test(examId)) return { ok: false, error: "Geçersiz sınav." };
  const supabase = await createClient();
  const { count } = await supabase.from("exam_attempts").select("id", { count: "exact", head: true }).eq("exam_id", examId);
  if ((count ?? 0) > 0) return { ok: false, error: "Çözülmüş sınav silinemez; arşive al." };
  const { data: imgs } = await supabase.from("exam_question_images").select("path").eq("exam_id", examId);
  const { data: bk } = await supabase.from("exams").select("booklet_path").eq("id", examId).maybeSingle();
  const { data: deleted, error } = await supabase.from("exams").delete().eq("id", examId).eq("status", "taslak").select("id");
  if (error) return { ok: false, error: error.message };
  if (!deleted?.length) return { ok: false, error: "Yalnızca taslak sınav silinebilir." };
  if (imgs?.length) await supabase.storage.from("exam-images").remove(imgs.map((i) => i.path));
  if (bk?.booklet_path) await supabase.storage.from("exam-booklets").remove([bk.booklet_path]);
  redirect("/admin/sinavlar");
}

const SECTION = /^[a-z]{2,20}$/;

/** Tarayıcı resmi depoya yükledikten sonra soru ile eşleştirir; eski resmi siler. */
export async function setQuestionImage(
  examId: string,
  section: string,
  no: number,
  image: { path: string; width: number; height: number },
): Promise<ActionResult> {
  await requireAdmin(`/admin/sinavlar/${examId}`);
  if (!UUID.test(examId) || !SECTION.test(section) || !Number.isInteger(no)) return { ok: false, error: "Geçersiz soru." };
  if (!image.path.startsWith(`${examId}/`) || !/^[0-9a-f-]+\/[a-z0-9-]+\.webp$/.test(image.path)) {
    return { ok: false, error: "Geçersiz dosya yolu." };
  }
  const supabase = await createClient();
  const { data: old } = await supabase
    .from("exam_question_images")
    .select("path")
    .eq("exam_id", examId)
    .eq("section", section)
    .eq("no", no)
    .maybeSingle();
  const { error } = await supabase.from("exam_question_images").upsert(
    {
      exam_id: examId,
      section,
      no,
      path: image.path,
      width: Math.round(image.width) || null,
      height: Math.round(image.height) || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "exam_id,section,no" },
  );
  if (error) return { ok: false, error: `Resim kaydedilemedi: ${error.message}` };
  if (old?.path && old.path !== image.path) {
    await supabase.storage.from("exam-images").remove([old.path]);
  }
  updateTag("exams");
  return { ok: true };
}

export async function removeQuestionImage(examId: string, section: string, no: number): Promise<ActionResult> {
  await requireAdmin(`/admin/sinavlar/${examId}`);
  if (!UUID.test(examId) || !SECTION.test(section) || !Number.isInteger(no)) return { ok: false, error: "Geçersiz soru." };
  const supabase = await createClient();
  const { data: old } = await supabase
    .from("exam_question_images")
    .delete()
    .eq("exam_id", examId)
    .eq("section", section)
    .eq("no", no)
    .select("path");
  if (old?.length) await supabase.storage.from("exam-images").remove(old.map((o) => o.path));
  updateTag("exams");
  return { ok: true };
}

/**
 * Kendi denememizin kitapçık PDF'ini sınava bağlar (dosyayı tarayıcı doğrudan depoya yükler).
 * path null ise kaldırır. Eski dosya depodan silinir.
 */
export async function setExamBooklet(examId: string, path: string | null): Promise<ActionResult> {
  await requireAdmin(`/admin/sinavlar/${examId}`);
  if (!UUID.test(examId)) return { ok: false, error: "Geçersiz sınav." };
  if (path !== null && (!path.startsWith(`${examId}/`) || !/^[0-9a-f-]+\/kitapcik-[a-z0-9-]+\.pdf$/.test(path))) {
    return { ok: false, error: "Geçersiz dosya yolu." };
  }
  const supabase = await createClient();
  const { data: old } = await supabase.from("exams").select("booklet_path, status").eq("id", examId).maybeSingle();
  if (!old) return { ok: false, error: "Sınav bulunamadı." };
  if (path === null && old.status === "yayinda") {
    const [{ data: ex }, { count }, { data: secs }] = await Promise.all([
      supabase.from("exams").select("booklet_url").eq("id", examId).single(),
      supabase.from("exam_question_images").select("no", { count: "exact", head: true }).eq("exam_id", examId),
      supabase.from("exam_sections").select("question_count").eq("exam_id", examId),
    ]);
    const total = (secs ?? []).reduce((n, s) => n + s.question_count, 0);
    if (!ex?.booklet_url && (count ?? 0) < total) {
      return { ok: false, error: "Yayındaki sınavın tek kitapçığı bu. Kaldırmadan önce sınavı yayından kaldır." };
    }
  }
  const { error } = await supabase.from("exams").update({ booklet_path: path }).eq("id", examId);
  if (error) return { ok: false, error: `Kitapçık kaydedilemedi: ${error.message}` };
  if (old.booklet_path && old.booklet_path !== path) {
    await supabase.storage.from("exam-booklets").remove([old.booklet_path]);
  }
  updateTag("exams");
  return { ok: true, message: path ? "Kitapçık PDF'i yüklendi." : "Kitapçık PDF'i kaldırıldı." };
}
