"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { sendMail } from "@/lib/email";
import { dateTR, MG, scheduleText, type GroupSlot } from "@/lib/mini-grup";
import { emailOf } from "@/lib/notify";
import { createClient } from "@/lib/supabase/server";
import { branchName } from "@/lib/teacher";

export type AdminResult = { ok: true; message: string } | { ok: false; error: string };
export type TeacherOption = { teacher_id: string; display_name: string; status: string; busy: boolean };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PAGE = "/admin/mini-gruplar";

function validSlots(s: GroupSlot[]) {
  return s.length === 2 && s.every((x) => x.weekday >= 1 && x.weekday <= 7 && /^\d{2}:(00|30)$/.test(x.start));
}

export async function teacherOptions(subject: string, grade: number, schedule: GroupSlot[]): Promise<TeacherOption[]> {
  await requireAdmin(PAGE);
  if (!/^[a-z]{2,20}$/.test(subject) || !validSlots(schedule)) return [];
  const supabase = await createClient();
  const { data } = await supabase.rpc("admin_group_teacher_options", { p_subject: subject, p_grade: grade, p_schedule: schedule });
  return (data ?? []) as TeacherOption[];
}

export async function createGroup(input: {
  subject: string;
  grade: number;
  teacherId: string;
  schedule: GroupSlot[];
  startsOn: string;
  waitlistIds: string[];
}): Promise<AdminResult> {
  await requireAdmin(PAGE);
  if (!UUID.test(input.teacherId) || !validSlots(input.schedule) || !/^\d{4}-\d{2}-\d{2}$/.test(input.startsOn) || !input.waitlistIds.every((x) => UUID.test(x))) {
    return { ok: false, error: "Eksik ya da geçersiz bilgi." };
  }
  const supabase = await createClient();
  const { data: id, error } = await supabase.rpc("admin_create_group", {
    p: {
      subject: input.subject,
      grade: input.grade,
      teacher_id: input.teacherId,
      schedule: input.schedule,
      starts_on: input.startsOn,
      waitlist_ids: input.waitlistIds,
    },
  });
  if (error || !id) return { ok: false, error: error?.message ?? "Grup kurulamadı." };

  const { data: members } = await supabase.from("mini_group_members").select("parent_id, student_name").eq("group_id", id);
  const { data: t } = await supabase.from("teachers").select("display_name").eq("profile_id", input.teacherId).maybeSingle();
  after(async () => {
    for (const m of members ?? []) {
      try {
        const to = await emailOf(m.parent_id);
        if (!to) continue;
        await sendMail({
          to,
          subject: `Mini grup daveti · ${branchName(input.subject)}, ${input.grade}. sınıf`,
          title: `${m.student_name} için mini grup hazır.`,
          body: [
            `${branchName(input.subject)} · ${input.grade}. sınıf · ${MG.minSize}–${MG.maxSize} öğrenci · öğretmen: ${t?.display_name ?? ""}.`,
            `Ders saatleri: ${scheduleText(input.schedule)} (${MG.minutes} dk). Başlangıç: ${dateTR(input.startsOn)}.`,
            `Aylık ${MG.monthly.toLocaleString("tr-TR")} TL (${MG.lessonsPerMonth} ders). Davet 48 saat geçerli; katılmak ya da uymadığını söylemek için panelini aç.`,
          ],
          cta: { label: "Daveti yanıtla", href: "/panel/mini-grup" },
        });
      } catch {
        /* bildirim işlemi bozmaz */
      }
    }
  });
  revalidatePath(PAGE);
  return { ok: true, message: "Grup kuruldu; velilere davet gönderildi (48 saat)." };
}

export async function cancelGroup(groupId: string): Promise<AdminResult> {
  await requireAdmin(PAGE);
  if (!UUID.test(groupId)) return { ok: false, error: "Geçersiz grup." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_cancel_group", { p_group: groupId });
  if (error) return { ok: false, error: error.message };
  revalidatePath(PAGE);
  return { ok: true, message: "Grup iptal edildi; öğrenciler bekleme listesine döndü." };
}
