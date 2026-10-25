import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/app/admin/admin-shell";
import { StagePanel } from "@/app/admin/ogretmenler/[id]/stage-panel";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { branchName, DEMO_RUBRIC, segmentLabel, STAGE_LABEL, type Stage } from "@/lib/teacher";

export const instant = false;
export const metadata: Metadata = { title: "Öğretmen başvurusu — Yönetim", robots: { index: false, follow: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const dt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" });
const fmt = (v: string | null) => (v ? dt.format(new Date(v)) : "—");

export default async function ApplicationDetail(props: PageProps<"/admin/ogretmenler/[id]">) {
  const { id } = await props.params;
  await requireAdmin(`/admin/ogretmenler/${id}`);
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data: a } = await supabase
    .from("teacher_applications")
    .select("*, profiles!teacher_applications_profile_id_fkey(full_name, email, phone)")
    .eq("id", id)
    .maybeSingle();
  if (!a) notFound();
  const p = a.profiles as unknown as { full_name: string | null; email: string | null; phone: string | null } | null;

  let attempt: { id: string; slug: string; title: string } | null = null;
  if (a.branch_test_attempt_id) {
    const { data } = await supabase.from("exam_attempts").select("id, exams(slug, title)").eq("id", a.branch_test_attempt_id).maybeSingle();
    const ex = data?.exams as unknown as { slug: string; title: string } | null;
    if (data && ex) attempt = { id: data.id, slug: ex.slug, title: ex.title };
  }

  const rubric = (a.demo_rubric ?? null) as Record<string, number | string> | null;
  const name = p?.full_name ?? "";
  const parts = name.trim().split(/\s+/);
  const displayDefault = parts.length > 1 ? `${parts.slice(0, -1).join(" ")} ${parts.at(-1)!.charAt(0).toLocaleUpperCase("tr")}.` : name;

  return (
    <AdminShell
      title={name || "Başvuru"}
      actions={
        <Link href="/admin/ogretmenler" className="font-semibold text-primary hover:underline">
          ← Tüm başvurular
        </Link>
      }
    >
      <div className="flex flex-wrap items-center gap-3 text-[15px]">
        {a.rejected_at ? (
          <span className="rounded bg-[#fdecea] px-2 py-1 font-semibold text-destructive">Sonuçlandı: {a.rejection_reason}</span>
        ) : (
          <span className="rounded bg-primary-soft px-2 py-1 font-semibold text-primary">{STAGE_LABEL[a.stage as Stage]}</span>
        )}
        <span className="text-muted">Başvuru {fmt(a.submitted_at)} · son değişiklik {fmt(a.updated_at)}</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        <section className="flex flex-col gap-3 rounded-[10px] border border-border bg-background p-6">
          <h2 className="m-0 text-lg font-semibold">Başvuran</h2>
          <Dl
            rows={[
              ["E-posta", p?.email ?? "—"],
              ["Telefon", p?.phone ?? "—"],
              ["Durum", segmentLabel(a.segment)],
              ["Branşlar", a.subjects.map(branchName).join(", ")],
              ["Sınıf", `${a.grades_min}.–${a.grades_max}. sınıf`],
              ["Deneyim", a.experience_years !== null ? `${a.experience_years} yıl` : "—"],
              ["Eğitim", [a.university, a.department, a.graduation_year].filter(Boolean).join(" · ") || "—"],
              ["Memur değil beyanı", fmt(a.not_civil_servant_declared_at)],
            ]}
          />
          {a.bio ? <p className="m-0 rounded-md bg-[#f6f8f7] p-4 text-[15px] leading-relaxed whitespace-pre-line">{a.bio}</p> : null}
          {a.intro_video_url ? (
            <a href={a.intro_video_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
              Tanıtım videosu →
            </a>
          ) : null}
        </section>

        <section className="flex flex-col gap-3 rounded-[10px] border border-border bg-background p-6">
          <h2 className="m-0 text-lg font-semibold">Değerlendirme</h2>
          <Dl
            rows={[
              ["Branş testi", a.branch_test_score !== null ? `%${Number(a.branch_test_score)} · ${fmt(a.branch_test_at)}` : "—"],
              ["Demo uygunluğu", a.demo_availability ?? "—"],
              ["Demo saati", fmt(a.demo_scheduled_at)],
              ["Demo puanı", a.demo_score !== null ? String(Number(a.demo_score)) : "—"],
              ["Kimlik", fmt(a.id_verified_at)],
              ["Mezun belgesi", fmt(a.diploma_verified_at)],
              ["Adli sicil", a.criminal_record_verified_at ? `${fmt(a.criminal_record_verified_at)} · yenileme ${a.criminal_record_renew_due ?? "—"}` : "—"],
              ["Sözleşme", a.contract_signed_at ? `${fmt(a.contract_signed_at)} · ${a.contract_version ?? ""}` : "—"],
              ["Vergi durumu", a.tax_status ?? "—"],
            ]}
          />
          {Array.isArray(a.branch_tests) && a.branch_tests.length ? (
            <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[15px]">
              {(a.branch_tests as unknown as { exam_id: string; subject: string; grades_min: number; grades_max: number; score: number; passed: boolean }[]).map((b) => (
                <li key={b.exam_id}>
                  {branchName(b.subject)} {b.grades_min}.–{b.grades_max}. sınıf: <strong>%{Number(b.score)}</strong>{" "}
                  <span className={b.passed ? "text-primary" : "text-destructive"}>{b.passed ? "geçti" : "baraj altı"}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {attempt ? (
            <Link href={`/deneme/${attempt.slug}/sonuc/${attempt.id}`} className="font-semibold text-primary hover:underline">
              Branş testi cevapları ({attempt.title}) →
            </Link>
          ) : null}
          {rubric ? (
            <ul className="m-0 flex list-none flex-col gap-1 rounded-md bg-[#f6f8f7] p-4 text-[15px]">
              {DEMO_RUBRIC.map((c) => (
                <li key={c.code}>
                  {c.label}: <strong>{String(rubric[c.code] ?? "—")}</strong>/5
                </li>
              ))}
              {rubric.not ? <li className="mt-1 text-muted">Not: {String(rubric.not)}</li> : null}
            </ul>
          ) : null}
        </section>
      </div>

      {a.rejected_at ? null : (
        <StagePanel
          app={{
            id: a.id,
            stage: a.stage,
            demo_availability: a.demo_availability,
            demo_scheduled_at: a.demo_scheduled_at,
            demo_meeting_url: a.demo_meeting_url,
            diploma_barcode: a.diploma_barcode,
            criminal_record_barcode: a.criminal_record_barcode,
            criminal_record_consent_at: a.criminal_record_consent_at,
            id_verified: !!a.id_verified_at,
            diploma_verified: !!a.diploma_verified_at,
            criminal_verified: !!a.criminal_record_verified_at,
            contract_signed: !!a.contract_signed_at,
          }}
          displayDefault={displayDefault}
        />
      )}
    </AdminShell>
  );
}

function Dl({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="m-0 grid grid-cols-[minmax(120px,auto)_1fr] gap-x-4 gap-y-2 text-[15px]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted">{k}</dt>
          <dd className="m-0">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
