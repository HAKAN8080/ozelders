"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { getSessionProfile } from "@/lib/auth";
import { adminRecipients, sendMail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { branchName, TEACHER_BRANCHES } from "@/lib/teacher";

export type MgState = { ok: false; error: string } | null;
export type MgResult = { ok: true; message: string } | { ok: false; error: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PAGE = "/panel/mini-grup";

async function veli() {
  const s = await getSessionProfile();
  if (!s.userId) redirect(`/giris?next=${PAGE}`);
  return s;
}

function dbError(message: string | undefined, fallback: string): string {
  return message && /[ğüşıöçĞÜŞİÖÇ]/.test(message) && message.length < 120 ? message : fallback;
}

export async function joinWaitlist(_prev: MgState, fd: FormData): Promise<MgState> {
  await veli();
  const student = String(fd.get("student_id") ?? "");
  const subject = String(fd.get("subject") ?? "");
  if (!UUID.test(student)) return { ok: false, error: "Çocuğunu seç." };
  if (!TEACHER_BRANCHES.some((b) => b.code === subject)) return { ok: false, error: "Dersi seç." };
  const preferred: { weekday: number; from: string; to: string }[] = [];
  for (const v of fd.getAll("pref").map(String)) {
    const m = v.match(/^([1-7])\|(\d{2}:\d{2})\|(\d{2}:\d{2})$/);
    if (m) preferred.push({ weekday: Number(m[1]), from: m[2], to: m[3] });
  }
  const supabase = await createClient();
  const { error } = await supabase.rpc("join_group_waitlist", {
    p: { student_id: student, subject, preferred, note: String(fd.get("note") ?? "").slice(0, 500) },
  });
  if (error) return { ok: false, error: dbError(error.message, "Kaydedilemedi. Yeniden dene.") };
  after(() =>
    sendMail({
      to: adminRecipients(),
      subject: `[Yönetim] Mini grup bekleme listesi: ${branchName(subject)}`,
      title: "Bir öğrenci mini grup bekleme listesine yazıldı",
      body: [`Ders: ${branchName(subject)} · saat tercihi sayısı: ${preferred.length}.`, "Aynı ders ve sınıfta 3 kişi olunca grup kurulabilir."],
      cta: { label: "Mini grupları aç", href: "/admin/mini-gruplar" },
    }),
  );
  revalidatePath(PAGE);
  redirect(`${PAGE}?kayit=1`);
}

export async function leaveWaitlist(id: string): Promise<MgResult> {
  await veli();
  if (!UUID.test(id)) return { ok: false, error: "Geçersiz kayıt." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("leave_group_waitlist", { p_id: id });
  if (error) return { ok: false, error: dbError(error.message, "Çıkarılamadı.") };
  revalidatePath(PAGE);
  return { ok: true, message: "Bekleme listesinden çıktın." };
}

export async function respondInvite(memberId: string, accept: boolean): Promise<MgResult> {
  await veli();
  if (!UUID.test(memberId)) return { ok: false, error: "Geçersiz davet." };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("respond_group_invite", { p_member: memberId, p_accept: accept });
  if (error) return { ok: false, error: dbError(error.message, "Yanıt kaydedilemedi.") };
  after(() =>
    sendMail({
      to: adminRecipients(),
      subject: `[Yönetim] Mini grup daveti ${accept ? "kabul" : "ret"}${data === "aktif" ? " · grup tamamlandı" : ""}`,
      title: accept ? "Bir veli mini grup davetini kabul etti" : "Bir veli mini grup davetini reddetti",
      body: [data === "aktif" ? "Grup en az sayıya ulaştı ve aktif oldu." : "Grup henüz tamamlanmadı."],
      cta: { label: "Mini grupları aç", href: "/admin/mini-gruplar" },
    }),
  );
  revalidatePath(PAGE);
  return {
    ok: true,
    message: !accept
      ? "Daveti reddettin; çocuğun bekleme listesinde kalmaya devam ediyor."
      : data === "aktif"
        ? "Grup tamamlandı! Ödeme adımı için sana e-posta göndereceğiz."
        : "Katılımını aldık. Grup en az 3 kişi olunca başlar; sana haber vereceğiz.",
  };
}
