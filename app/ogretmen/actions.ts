"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { getSessionProfile } from "@/lib/auth";
import { formatWhen, introMail, sendMail } from "@/lib/email";
import { emailOf } from "@/lib/notify";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type PanelResult = { ok: true; message: string } | { ok: false; error: string };
export type Slot = { weekday: number; start: string; end: string };

const PAGE = "/ogretmen";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function user() {
  const s = await getSessionProfile();
  if (!s.userId) redirect(`/giris?next=${PAGE}`);
  return s.userId;
}

function dbError(message: string | undefined, fallback: string): string {
  return message && /[ğüşıöçĞÜŞİÖÇ]/.test(message) && message.length < 120 ? message : fallback;
}

export async function saveAvailability(slots: Slot[]): Promise<PanelResult> {
  await user();
  const clean = (Array.isArray(slots) ? slots : [])
    .filter((s) => Number.isInteger(s.weekday) && /^\d{2}:\d{2}$/.test(s.start) && /^\d{2}:\d{2}$/.test(s.end))
    .map((s) => ({ weekday: s.weekday, start: s.start, end: s.end }));
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("teacher_save_availability", { p_slots: clean });
  if (error) return { ok: false, error: dbError(error.message, "Takvim kaydedilemedi. Yeniden dene.") };
  revalidatePath(PAGE);
  return { ok: true, message: `Kaydedildi: haftada ${data} zaman aralığı.` };
}

export async function updateProfile(bio: string, video: string): Promise<PanelResult> {
  const uid = await user();
  const b = bio.trim().slice(0, 1200);
  const v = video.trim();
  if (b.length < 40) return { ok: false, error: "Tanıtım metni en az 40 karakter olmalı." };
  if (v && !/^https:\/\/\S{6,300}$/.test(v)) return { ok: false, error: "Video bağlantısı https:// ile başlamalı." };
  const supabase = await createClient();
  const { error } = await supabase.from("teachers").update({ bio: b, intro_video_url: v || null }).eq("profile_id", uid);
  if (error) return { ok: false, error: "Profil kaydedilemedi. Yeniden dene." };
  revalidatePath(PAGE);
  return { ok: true, message: "Profilin güncellendi." };
}

export async function markLesson(lessonId: string, status: "tamamlandi" | "gelmedi"): Promise<PanelResult> {
  const uid = await user();
  if (!UUID.test(lessonId) || !["tamamlandi", "gelmedi"].includes(status)) return { ok: false, error: "Geçersiz ders." };
  const supabase = await createClient();
  // Kural veritabanında: yalnız kendi, başlamış ve planlı dersi
  const { data, error } = await supabase.from("lessons").update({ status }).eq("id", lessonId).eq("teacher_id", uid).select("id");
  if (error || !data?.length) return { ok: false, error: "Ders güncellenemedi; ders saati gelmemiş ya da daha önce işaretlenmiş olabilir." };
  revalidatePath(PAGE);
  return { ok: true, message: status === "tamamlandi" ? "Ders yapıldı olarak işaretlendi. Ders raporunu 24 saat içinde gir." : "Öğrencinin gelmediği kaydedildi." };
}

export async function respondIntro(offerId: string, accept: boolean, meetingUrl: string, note: string): Promise<PanelResult> {
  await user();
  if (!UUID.test(offerId)) return { ok: false, error: "Geçersiz istek." };
  const url = meetingUrl.trim();
  if (accept && url && !/^https:\/\/\S{6,300}$/.test(url)) return { ok: false, error: "Görüşme bağlantısı https:// ile başlamalı." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("teacher_respond_intro", {
    p_offer: offerId,
    p_accept: accept,
    p_meeting_url: accept && url ? url : undefined,
    p_note: !accept && note.trim() ? note.trim().slice(0, 300) : undefined,
  });
  if (error) return { ok: false, error: dbError(error.message, "Yanıt kaydedilemedi. Yeniden dene.") };

  // Veliye bildirim (adres yalnız sunucuda, hizmet anahtarıyla)
  after(async () => {
    try {
      const admin = createAdminClient();
      const { data: o } = await admin
        .from("intro_offers")
        .select("starts_at, meeting_url, request_id, teachers(display_name), lesson_requests(parent_id)")
        .eq("id", offerId)
        .maybeSingle();
      const parent = (o?.lesson_requests as unknown as { parent_id: string } | null)?.parent_id;
      const teacher = (o?.teachers as unknown as { display_name: string } | null)?.display_name ?? "Öğretmen";
      const to = parent ? await emailOf(parent) : null;
      if (!o || !to) return;
      await sendMail(accept ? introMail.accepted(to, teacher, formatWhen(o.starts_at), o.meeting_url, o.request_id) : introMail.declined(to, teacher, o.request_id));
    } catch {
      /* bildirim işlemi bozmaz */
    }
  });
  revalidatePath(PAGE);
  return { ok: true, message: accept ? "Tanışma dersi onaylandı; veliye bildirildi." : "İstek reddedildi. Bu karneni etkilemez." };
}
