"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { getSessionProfile } from "@/lib/auth";
import { adminRecipients, formatWhen, introMail, orderMail, sendMail } from "@/lib/email";
import { emailOf } from "@/lib/notify";
import { GOALS, type Pref } from "@/lib/requests";
import { createClient } from "@/lib/supabase/server";
import { branchName, TEACHER_BRANCHES } from "@/lib/teacher";

export type ReqState = { ok: false; error: string } | null;
export type ActResult = { ok: true; message: string } | { ok: false; error: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function veli() {
  const s = await getSessionProfile();
  if (!s.userId) redirect("/giris?next=/panel");
  return s;
}

function dbError(message: string | undefined, fallback: string): string {
  return message && /[ğüşıöçĞÜŞİÖÇ]/.test(message) && message.length < 120 ? message : fallback;
}

export async function createRequest(_prev: ReqState, fd: FormData): Promise<ReqState> {
  await veli();
  const student = String(fd.get("student_id") ?? "");
  const subject = String(fd.get("subject") ?? "");
  const goal = String(fd.get("goal") ?? "");
  if (!UUID.test(student)) return { ok: false, error: "Çocuğunu seç." };
  if (!TEACHER_BRANCHES.some((b) => b.code === subject)) return { ok: false, error: "Dersi seç." };
  if (!GOALS.some((g) => g.code === goal)) return { ok: false, error: "Hedefi seç." };
  const preferred: Pref[] = [];
  for (const v of fd.getAll("pref").map(String)) {
    const m = v.match(/^([1-7])\|(\d{2}:\d{2})\|(\d{2}:\d{2})$/);
    if (m) preferred.push({ weekday: Number(m[1]), from: m[2], to: m[3] });
  }
  const attempt = String(fd.get("attempt_id") ?? "");
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_lesson_request", {
    p: {
      student_id: student,
      subject,
      goal,
      preferred,
      note: String(fd.get("note") ?? "").slice(0, 500),
      attempt_id: UUID.test(attempt) ? attempt : "",
    },
  });
  if (error || !data) return { ok: false, error: dbError(error?.message, "Talep kaydedilemedi. Yeniden dene.") };
  const { data: opts } = await supabase.rpc("request_teacher_options", { p_request: data });
  if (!opts?.length) {
    // Uygun öğretmen yok: yönetime haber ver (öğretmen bulmak ya da işe almak için)
    after(() =>
      sendMail({
        to: adminRecipients(),
        subject: `[Yönetim] Öğretmen bulunamayan talep: ${branchName(subject)}`,
        title: "Bir talep için uygun öğretmen yok",
        body: [`Ders: ${branchName(subject)} · hedef: ${goal} · saat tercihi sayısı: ${preferred.length}.`, "Bu branş ve sınıf için öğretmen alımı ya da mevcut öğretmenlerin takvimi gözden geçirilmeli."],
      }),
    );
  }
  redirect(`/panel/talep/${data}`);
}

export async function loadSlots(requestId: string, teacherId: string): Promise<string[]> {
  await veli();
  if (!UUID.test(requestId) || !UUID.test(teacherId)) return [];
  const supabase = await createClient();
  const { data } = await supabase.rpc("teacher_intro_slots", { p_request: requestId, p_teacher: teacherId });
  return (data ?? []) as unknown as string[];
}

export async function requestIntro(requestId: string, teacherId: string, at: string): Promise<ActResult> {
  await veli();
  if (!UUID.test(requestId) || !UUID.test(teacherId) || Number.isNaN(Date.parse(at))) return { ok: false, error: "Geçersiz seçim." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("request_intro", { p_request: requestId, p_teacher: teacherId, p_at: at });
  if (error) return { ok: false, error: dbError(error.message, "İstek gönderilemedi. Yeniden dene.") };

  const { data: r } = await supabase.from("lesson_requests").select("subject, students(first_name, grade)").eq("id", requestId).maybeSingle();
  const st = r?.students as unknown as { first_name: string; grade: number } | null;
  after(async () => {
    const to = await emailOf(teacherId);
    if (to && st) await sendMail(introMail.toTeacher(to, st.first_name, st.grade, branchName(r!.subject), formatWhen(at)));
  });
  revalidatePath(`/panel/talep/${requestId}`);
  return { ok: true, message: "Tanışma isteğin gönderildi. Öğretmen en geç 24 saat içinde yanıt verecek; sana e-postayla bildireceğiz." };
}

export async function cancelIntro(offerId: string, requestId: string): Promise<ActResult> {
  await veli();
  if (!UUID.test(offerId)) return { ok: false, error: "Geçersiz istek." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_intro", { p_offer: offerId });
  if (error) return { ok: false, error: dbError(error.message, "İptal edilemedi.") };
  revalidatePath(`/panel/talep/${requestId}`);
  return { ok: true, message: "İstek iptal edildi; başka bir öğretmen seçebilirsin." };
}

export async function choosePackage(requestId: string, productCode: string): Promise<ActResult> {
  const s = await veli();
  if (!UUID.test(requestId) || !/^[A-Z0-9_]{2,20}$/.test(productCode)) return { ok: false, error: "Geçersiz seçim." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_package_order", { p_request: requestId, p_product: productCode });
  if (error) return { ok: false, error: dbError(error.message, "Paket seçimi kaydedilemedi. Yeniden dene.") };
  const { data: o } = await supabase
    .from("package_orders")
    .select("student_name, grade, price, lesson_count, product_code, teachers(display_name)")
    .eq("request_id", requestId)
    .eq("status", "odeme_bekliyor")
    .maybeSingle();
  const teacher = (o?.teachers as unknown as { display_name: string } | null)?.display_name ?? "";
  const email = s.email;
  after(async () => {
    if (!o) return;
    const line = `${o.student_name} (${o.grade}. sınıf) · ${teacher} · ${o.product_code} · ${o.lesson_count} ders · ${Number(o.price).toLocaleString("tr-TR")} TL`;
    await sendMail({ to: adminRecipients(), subject: `[Yönetim] Paket seçildi: ${o.product_code}`, title: "Bir veli paket seçti", body: [line, "Ödeme adımı PayTR pazaryeri entegrasyonu açılınca bağlanacak."] });
    if (email) await sendMail(orderMail(email, teacher, o.product_code, o.lesson_count, Number(o.price), requestId));
  });
  revalidatePath(`/panel/talep/${requestId}`);
  return { ok: true, message: "Paket seçimin kaydedildi. Ödeme adımı için sana e-posta göndereceğiz." };
}

export async function reopenRequest(requestId: string): Promise<ActResult> {
  await veli();
  if (!UUID.test(requestId)) return { ok: false, error: "Geçersiz talep." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("reopen_lesson_request", { p_request: requestId });
  if (error) return { ok: false, error: dbError(error.message, "Talep yeniden açılamadı.") };
  revalidatePath(`/panel/talep/${requestId}`);
  return { ok: true, message: "Tamam; listeden başka bir öğretmenle tanışabilirsin." };
}
