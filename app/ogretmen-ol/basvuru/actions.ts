"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";

import { getSessionProfile } from "@/lib/auth";
import { adminMail, sendMail, teacherMail } from "@/lib/email";
import { LEGAL_VERSION } from "@/lib/company";
import { createClient } from "@/lib/supabase/server";
import { SEGMENTS, TEACHER_BRANCHES } from "@/lib/teacher";

export type StepState = { ok: false; error: string } | null;

const PAGE = "/ogretmen-ol/basvuru";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function requireUser() {
  const session = await getSessionProfile();
  if (!session.userId) redirect(`/giris?next=${encodeURIComponent(PAGE)}`);
  return session;
}

/** Veritabanı hata metni Türkçe ve kullanıcıya yönelik (raise exception); diğerleri genel mesaj. */
function rpcError(message: string | undefined): string {
  if (message && /[ğüşıöçĞÜŞİÖÇ]/.test(message) && message.length < 120) return message;
  return "Kaydedilemedi. Bilgileri kontrol edip yeniden dene.";
}

function text(fd: FormData, k: string, max: number): string {
  return String(fd.get(k) ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

function int(fd: FormData, k: string, min: number, max: number): number | null {
  const n = Number(fd.get(k));
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}

export async function submitApplication(_prev: StepState, fd: FormData): Promise<StepState> {
  const session = await requireUser();
  const codes = new Set(TEACHER_BRANCHES.map((b) => b.code));
  const subjects = [...new Set(fd.getAll("subjects").map(String))].filter((s) => codes.has(s));
  if (subjects.length < 1 || subjects.length > 4) return { ok: false, error: "En az 1, en fazla 4 branş seç." };
  const segment = String(fd.get("segment") ?? "");
  if (!SEGMENTS.some((s) => s.code === segment)) return { ok: false, error: "Durumunu seç." };
  const gMin = int(fd, "grades_min", 3, 12);
  const gMax = int(fd, "grades_max", 3, 12);
  if (gMin === null || gMax === null || gMax < gMin) return { ok: false, error: "Sınıf aralığını kontrol et (en küçük ≤ en büyük)." };
  if (fd.get("not_civil_servant") !== "on") {
    return { ok: false, error: "Kadrolu devlet memuru olmadığını onaylaman gerekiyor." };
  }
  const bio = String(fd.get("bio") ?? "").trim().slice(0, 1200);
  if (bio.length < 40) return { ok: false, error: "Kendini en az birkaç cümleyle anlat (en az 40 karakter)." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("teacher_application_save", {
    p: {
      subjects,
      segment,
      grades_min: gMin,
      grades_max: gMax,
      experience_years: int(fd, "experience_years", 0, 60) ?? "",
      university: text(fd, "university", 120),
      department: text(fd, "department", 120),
      graduation_year: int(fd, "graduation_year", 1960, 2035) ?? "",
      bio,
      not_civil_servant: true,
      submit: true,
    },
  });
  if (error) return { ok: false, error: rpcError(error.message) };
  const appId = String(data ?? "");
  const email = session.email;
  const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", session.userId!).maybeSingle();
  const first = (prof?.full_name ?? "").split(" ")[0] ?? "";
  after(async () => {
    if (email) await sendMail(teacherMail.received(email, first));
    await sendMail(adminMail("Yeni öğretmen başvurusu", `${prof?.full_name ?? "Bir başvuran"}: ${subjects.join(", ")} · ${gMin}.–${gMax}. sınıf`, appId));
  });
  redirect(`${PAGE}?gonderildi=1`);
}

/** Branş testi sonucunu başvuruya işler (yalnız ilk deneme sayılır; kontrol veritabanında). */
export async function recordBranchTest(fd: FormData): Promise<void> {
  const session = await requireUser();
  const attempt = String(fd.get("attempt") ?? "");
  if (!UUID.test(attempt)) redirect(PAGE);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("teacher_application_branch_test", { p_attempt: attempt });
  if (!error && session.email) {
    const res = data as { passed?: boolean } | null;
    const { data: app } = await supabase.from("teacher_applications").select("stage, rejected_at, rejection_reason, branch_tests").eq("profile_id", session.userId!).maybeSingle();
    const passedCount = Array.isArray(app?.branch_tests) ? app.branch_tests.filter((b) => (b as { passed?: boolean })?.passed).length : 0;
    const email = session.email;
    // İlk geçilen test demo adımını açar; tüm testler baraj altıysa başvuru sonuçlanır
    if (res?.passed && passedCount === 1) after(() => sendMail(teacherMail.testPassed(email)));
    else if (app?.rejected_at) after(() => sendMail(teacherMail.rejected(email, app.rejection_reason ?? "Branş testi %85 barajının altında kaldı.")));
  }
  redirect(error ? `${PAGE}?hata=${encodeURIComponent(rpcError(error.message))}` : PAGE);
}

export async function saveDemo(_prev: StepState, fd: FormData): Promise<StepState> {
  const session = await requireUser();
  const availability = String(fd.get("demo_availability") ?? "").trim().slice(0, 400);
  const video = text(fd, "intro_video_url", 300);
  if (availability.length < 5) return { ok: false, error: "Demo ders için uygun olduğun gün ve saatleri yaz." };
  if (video && !/^https:\/\/\S+$/.test(video)) return { ok: false, error: "Video bağlantısı https:// ile başlamalı." };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("teacher_application_save", {
    p: { demo_availability: availability, intro_video_url: video },
  });
  if (error) return { ok: false, error: rpcError(error.message) };
  const appId = String(data ?? "");
  after(() => sendMail(adminMail("Demo ders planlanacak", `Uygun saatler: ${availability} (${session.email ?? ""})`, appId)));
  redirect(PAGE);
}

export async function saveDocuments(_prev: StepState, fd: FormData): Promise<StepState> {
  await requireUser();
  const barcode = /^[A-Za-z0-9-]{6,40}$/;
  const diploma = text(fd, "diploma_barcode", 40).replace(/\s/g, "");
  const criminal = text(fd, "criminal_record_barcode", 40).replace(/\s/g, "");
  if (!barcode.test(diploma)) return { ok: false, error: "Diploma (mezun belgesi) barkod numarasını kontrol et." };
  if (!barcode.test(criminal)) return { ok: false, error: "Adli sicil kaydı barkod numarasını kontrol et." };
  if (fd.get("criminal_record_consent") !== "on") {
    return { ok: false, error: "Adli sicil kaydının doğrulanması için açık rıza vermen gerekiyor." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("teacher_application_save", {
    p: { diploma_barcode: diploma, criminal_record_barcode: criminal, criminal_record_consent: true },
  });
  if (error) return { ok: false, error: rpcError(error.message) };
  const appId = String(data ?? "");
  after(() => sendMail(adminMail("Belgeler doğrulanacak", "Başvuran mezun belgesi ve adli sicil barkodlarını girdi.", appId)));
  redirect(PAGE);
}

export async function signAgreement(_prev: StepState, fd: FormData): Promise<StepState> {
  await requireUser();
  const tax = String(fd.get("tax_status") ?? "");
  if (!["bireysel", "serbest_meslek", "sirket"].includes(tax)) return { ok: false, error: "Vergi durumunu seç." };
  for (const k of ["independent_contractor", "submerchant_consent", "contract"]) {
    if (fd.get(k) !== "on") return { ok: false, error: "Devam etmek için üç onayın hepsi gerekli." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("teacher_application_save", {
    p: { independent_contractor: true, submerchant_consent: true, contract: true, tax_status: tax, contract_version: LEGAL_VERSION },
  });
  if (error) return { ok: false, error: rpcError(error.message) };
  const appId = String(data ?? "");
  after(() => sendMail(adminMail("Öğretmen onayı bekliyor", "Sözleşme ve beyanlar onaylandı; vitrin adını kontrol edip onayla.", appId)));
  redirect(PAGE);
}
