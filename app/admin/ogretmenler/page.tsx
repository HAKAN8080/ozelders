import type { Metadata } from "next";
import Link from "next/link";

import { AdminShell } from "@/app/admin/admin-shell";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { branchName, STAGE_LABEL, type Stage } from "@/lib/teacher";

export const instant = false;
export const metadata: Metadata = { title: "Öğretmen başvuruları — Yönetim", robots: { index: false, follow: false } };

const dateFmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "Europe/Istanbul" });

/** Yönetici işi bekleyen aşamalar önce. */
const FILTERS: { key: string; label: string; match: (a: Row) => boolean }[] = [
  { key: "is", label: "İş bekleyen", match: (a) => !a.rejected_at && !!needsAdmin(a) },
  { key: "surec", label: "Süreçte", match: (a) => !a.rejected_at && !["golge", "aktif"].includes(a.stage) },
  { key: "onay", label: "Onaylı", match: (a) => ["golge", "aktif"].includes(a.stage) },
  { key: "red", label: "Sonuçlanan", match: (a) => !!a.rejected_at },
  { key: "hepsi", label: "Tümü", match: () => true },
];

type Row = {
  id: string;
  stage: string;
  subjects: string[];
  grades_min: number;
  grades_max: number;
  submitted_at: string | null;
  rejected_at: string | null;
  branch_test_score: number | null;
  demo_score: number | null;
  demo_availability: string | null;
  demo_scheduled_at: string | null;
  criminal_record_consent_at: string | null;
  contract_signed_at: string | null;
  profiles: { full_name: string | null } | null;
};

function needsAdmin(a: Row): string | null {
  if (a.stage === "demo" && a.demo_availability && !a.demo_scheduled_at) return "Demo planla";
  if (a.stage === "demo" && a.demo_scheduled_at) return "Demoyu puanla";
  if (a.stage === "belge" && a.criminal_record_consent_at) return "Belgeleri doğrula";
  if (a.stage === "oryantasyon" && a.contract_signed_at) return "Onayla";
  if (a.stage === "golge") return "İlk dersleri izle";
  return null;
}

export default async function TeacherApplications(props: PageProps<"/admin/ogretmenler">) {
  await requireAdmin("/admin/ogretmenler");
  const sp = await props.searchParams;
  const filter = FILTERS.find((f) => f.key === sp.f) ?? FILTERS[0];

  const supabase = await createClient();
  const { data } = await supabase
    .from("teacher_applications")
    .select(
      "id, stage, subjects, grades_min, grades_max, submitted_at, rejected_at, branch_test_score, demo_score, demo_availability, demo_scheduled_at, criminal_record_consent_at, contract_signed_at, profiles!teacher_applications_profile_id_fkey(full_name)",
    )
    .not("submitted_at", "is", null)
    .order("updated_at", { ascending: false })
    .limit(500);
  const rows = (data ?? []) as unknown as Row[];
  const list = rows.filter(filter.match);

  return (
    <AdminShell title="Öğretmen başvuruları">
      <nav aria-label="Filtre" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const n = rows.filter(f.match).length;
          const on = f.key === filter.key;
          return (
            <Link
              key={f.key}
              href={`/admin/ogretmenler?f=${f.key}`}
              className={`rounded-full px-4 py-2 text-[15px] font-semibold ${on ? "bg-[#111111] text-white" : "border border-border bg-background hover:bg-primary-soft"}`}
            >
              {f.label} <span className="tabular-nums opacity-70">{n}</span>
            </Link>
          );
        })}
      </nav>

      {list.length === 0 ? (
        <p className="m-0 rounded-[10px] border border-border bg-background p-6 text-muted">Bu filtrede başvuru yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-border bg-background">
          <table className="w-full min-w-[820px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-5 py-3 font-semibold">Başvuran</th>
                <th className="px-5 py-3 font-semibold">Aşama</th>
                <th className="px-5 py-3 font-semibold">Test</th>
                <th className="px-5 py-3 font-semibold">Demo</th>
                <th className="px-5 py-3 font-semibold">Başvuru</th>
                <th className="px-5 py-3 font-semibold">Sıradaki iş</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => {
                const todo = a.rejected_at ? null : needsAdmin(a);
                return (
                  <tr key={a.id} className="border-b border-[#eef2ef] last:border-0">
                    <td className="px-5 py-4">
                      <Link href={`/admin/ogretmenler/${a.id}`} className="font-semibold text-foreground hover:text-primary">
                        {a.profiles?.full_name ?? "—"}
                      </Link>
                      <div className="text-sm text-muted">
                        {a.subjects.map(branchName).join(", ")} · {a.grades_min}.–{a.grades_max}. sınıf
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {a.rejected_at ? (
                        <span className="rounded bg-[#fdecea] px-2 py-1 text-[13px] font-semibold text-destructive">Sonuçlandı</span>
                      ) : (
                        <span className="rounded bg-primary-soft px-2 py-1 text-[13px] font-semibold text-primary">{STAGE_LABEL[a.stage as Stage] ?? a.stage}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 tabular-nums">{a.branch_test_score !== null ? `%${Math.round(Number(a.branch_test_score))}` : "—"}</td>
                    <td className="px-5 py-4 tabular-nums">{a.demo_score !== null ? Math.round(Number(a.demo_score)) : "—"}</td>
                    <td className="px-5 py-4 tabular-nums">{a.submitted_at ? dateFmt.format(new Date(a.submitted_at)) : "—"}</td>
                    <td className="px-5 py-4">
                      {todo ? (
                        <Link href={`/admin/ogretmenler/${a.id}`} className="font-semibold text-primary hover:underline">
                          {todo} →
                        </Link>
                      ) : (
                        <span className="text-muted">{a.rejected_at ? "—" : "Başvuranda"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
