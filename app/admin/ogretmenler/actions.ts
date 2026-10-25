"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { requireAdmin } from "@/lib/admin";
import type { Database, Json } from "@/lib/database.types";
import { sendMail, teacherMail, type Mail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { DEMO_PASS, DEMO_RUBRIC, demoScore } from "@/lib/teacher";

export type AdminResult = { ok: true; message: string } | { ok: false; error: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function ctx(appId: string) {
  const session = await requireAdmin(`/admin/ogretmenler/${appId}`);
  if (!UUID.test(appId)) throw new Error("Geçersiz başvuru");
  const supabase = await createClient();
  const { data: app } = await supabase
    .from("teacher_applications")
    .select("id, profile_id, stage, rejected_at, id_verified_at, diploma_verified_at, criminal_record_verified_at")
    .eq("id", appId)
    .maybeSingle();
  if (!app) throw new Error("Başvuru bulunamadı");
  return { supabase, app, adminId: session.userId! };
}

/** Başvurana e-posta (yanıttan sonra gönderilir; hata işlemi bozmaz). */
async function notify(supabase: Awaited<ReturnType<typeof createClient>>, profileId: string, make: (to: string) => Mail) {
  const { data } = await supabase.from("profiles").select("email").eq("id", profileId).maybeSingle();
  const to = data?.email;
  if (to) after(() => sendMail(make(to)));
}

const whenFmt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Istanbul" });

function done(appId: string, message: string): AdminResult {
  revalidatePath(`/admin/ogretmenler/${appId}`);
  revalidatePath("/admin/ogretmenler");
  return { ok: true, message };
}

async function log(supabase: Awaited<ReturnType<typeof createClient>>, actor: string, action: string, id: string, detail?: Json) {
  await supabase.from("audit_log").insert({ actor_id: actor, action, entity: "teacher_applications", entity_id: id, detail: detail ?? null });
}

export async function scheduleDemo(appId: string, at: string, url: string): Promise<AdminResult> {
  const { supabase, app, adminId } = await ctx(appId);
  if (app.stage !== "demo") return { ok: false, error: "Başvuru demo aşamasında değil." };
  const when = new Date(at);
  if (Number.isNaN(when.getTime())) return { ok: false, error: "Tarih ve saati seç." };
  if (url && !/^https:\/\/\S+$/.test(url)) return { ok: false, error: "Görüşme bağlantısı https:// ile başlamalı." };
  const { error } = await supabase
    .from("teacher_applications")
    .update({ demo_scheduled_at: when.toISOString(), demo_meeting_url: url || null, demo_evaluator_id: adminId, updated_at: new Date().toISOString() })
    .eq("id", appId);
  if (error) return { ok: false, error: error.message };
  await notify(supabase, app.profile_id, (to) => teacherMail.demoScheduled(to, whenFmt.format(when), url || null));
  return done(appId, "Demo ders planlandı; başvurana e-posta gönderildi.");
}

export async function scoreDemo(appId: string, rubric: Record<string, number>, idVerified: boolean, note: string): Promise<AdminResult> {
  const { supabase, app, adminId } = await ctx(appId);
  if (app.stage !== "demo") return { ok: false, error: "Başvuru demo aşamasında değil." };
  const clean: Record<string, number> = {};
  for (const c of DEMO_RUBRIC) {
    const v = Number(rubric[c.code]);
    if (!Number.isInteger(v) || v < 1 || v > 5) return { ok: false, error: `"${c.label}" için 1–5 arası puan ver.` };
    clean[c.code] = v;
  }
  const score = demoScore(clean);
  const pass = score >= DEMO_PASS;
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("teacher_applications")
    .update({
      demo_rubric: { ...clean, not: note.slice(0, 600) },
      demo_score: score,
      demo_evaluator_id: adminId,
      id_verified_at: idVerified ? (app.id_verified_at ?? now) : app.id_verified_at,
      verified_by: idVerified ? adminId : undefined,
      stage: pass ? "belge" : "demo",
      rejected_at: pass ? null : now,
      rejection_reason: pass ? null : `Demo ders puanı ${score} (baraj ${DEMO_PASS})`,
      updated_at: now,
    })
    .eq("id", appId);
  if (error) return { ok: false, error: error.message };
  await log(supabase, adminId, pass ? "teacher_demo_pass" : "teacher_demo_fail", appId, { score });
  await notify(supabase, app.profile_id, (to) =>
    pass ? teacherMail.demoPassed(to) : teacherMail.rejected(to, "Demo ders değerlendirmesinde baraj puanına ulaşılamadı."),
  );
  return done(appId, pass ? `Demo puanı ${score}: belge aşamasına geçti.` : `Demo puanı ${score}: baraj altında, başvuru sonuçlandırıldı.`);
}

export async function verifyDocuments(
  appId: string,
  v: { id: boolean; diploma: boolean; criminal: boolean; criminalDate: string },
): Promise<AdminResult> {
  const { supabase, app, adminId } = await ctx(appId);
  if (app.stage !== "belge") return { ok: false, error: "Başvuru belge aşamasında değil." };
  const now = new Date().toISOString();
  const patch: Database["public"]["Tables"]["teacher_applications"]["Update"] = { verified_by: adminId, updated_at: now };
  if (v.id && !app.id_verified_at) patch.id_verified_at = now;
  if (v.diploma && !app.diploma_verified_at) patch.diploma_verified_at = now;
  if (v.criminal && !app.criminal_record_verified_at) {
    const d = new Date(v.criminalDate);
    if (Number.isNaN(d.getTime())) return { ok: false, error: "Adli sicil belgesinin tarihini gir (yenileme 12 ay sonra)." };
    if (Date.now() - d.getTime() > 31 * 86400000) return { ok: false, error: "Adli sicil kaydı son 30 gün içinde alınmış olmalı." };
    patch.criminal_record_verified_at = now;
    d.setFullYear(d.getFullYear() + 1);
    patch.criminal_record_renew_due = d.toISOString().slice(0, 10);
  }
  const all =
    (v.id || app.id_verified_at) && (v.diploma || app.diploma_verified_at) && (v.criminal || app.criminal_record_verified_at);
  if (all) {
    // KVKK: barkodlar yalnız doğrulanana kadar tutulur
    patch.diploma_barcode = null;
    patch.criminal_record_barcode = null;
    patch.stage = "oryantasyon";
  }
  const { error } = await supabase.from("teacher_applications").update(patch).eq("id", appId);
  if (error) return { ok: false, error: error.message };
  await log(supabase, adminId, "teacher_documents", appId, { id: v.id, diploma: v.diploma, criminal: v.criminal });
  if (all) await notify(supabase, app.profile_id, (to) => teacherMail.docsVerified(to));
  return done(appId, all ? "Belgeler doğrulandı, barkodlar silindi. Sözleşme aşamasına geçti." : "Kaydedildi.");
}

export async function approveTeacher(appId: string, displayName: string): Promise<AdminResult> {
  const { supabase, app } = await ctx(appId);
  const name = displayName.trim().replace(/\s+/g, " ");
  if (name.length < 3 || name.length > 40) return { ok: false, error: "Vitrin adı 3–40 karakter olmalı (ör. Ayşe Ö.)." };
  const { error } = await supabase.rpc("admin_approve_teacher", { p_app: appId, p_display_name: name });
  if (error) return { ok: false, error: error.message };
  await notify(supabase, app.profile_id, (to) => teacherMail.approved(to));
  return done(appId, "Onaylandı: öğretmen gölge dönemde, başlangıç bandında (%30).");
}

export async function activateTeacher(appId: string): Promise<AdminResult> {
  const { supabase, app } = await ctx(appId);
  if (app.stage !== "golge") return { ok: false, error: "Yalnız gölge dönemdeki öğretmen aktif yapılır." };
  // teachers.status kolonu doğrudan yazılamaz; yetkili fonksiyonla
  const { error } = await supabase.rpc("admin_activate_teacher", { p_app: appId });
  if (error) return { ok: false, error: error.message };
  return done(appId, "Öğretmen aktif.");
}

export async function rejectApplication(appId: string, reason: string): Promise<AdminResult> {
  const { supabase, app, adminId } = await ctx(appId);
  if (app.rejected_at) return { ok: false, error: "Başvuru zaten sonuçlandı." };
  if (app.stage === "golge" || app.stage === "aktif") return { ok: false, error: "Onaylı öğretmen buradan reddedilmez." };
  const r = reason.trim().slice(0, 300);
  if (r.length < 5) return { ok: false, error: "Başvurana gösterilecek kısa bir gerekçe yaz." };
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("teacher_applications")
    .update({ rejected_at: now, rejection_reason: r, diploma_barcode: null, criminal_record_barcode: null, updated_at: now })
    .eq("id", appId);
  if (error) return { ok: false, error: error.message };
  await log(supabase, adminId, "teacher_reject", appId, { reason: r });
  await notify(supabase, app.profile_id, (to) => teacherMail.rejected(to, r));
  return done(appId, "Başvuru sonuçlandırıldı.");
}
