import type { Metadata } from "next";
import Link from "next/link";

import { AdminShell } from "@/app/admin/admin-shell";
import { requireAdmin } from "@/lib/admin";
import { gradeLabel, kindInfo } from "@/lib/exam-kinds";
import { formatNet } from "@/lib/exams";
import { createClient } from "@/lib/supabase/server";

export const instant = false;
export const metadata: Metadata = { title: "Sınavlar — Yönetim", robots: { index: false, follow: false } };

const statusLabel = { taslak: "Taslak", yayinda: "Yayında", arsiv: "Arşiv" } as const;
const statusClass = {
  taslak: "border border-[#c9d3cd] bg-[#f1f3f2] text-[#3d4743]",
  yayinda: "bg-primary text-primary-foreground",
  arsiv: "bg-[#e4e6e5] text-[#5f6b66]",
} as const;

export default async function AdminExamsPage() {
  await requireAdmin("/admin/sinavlar");
  const supabase = await createClient();

  const { data: exams } = await supabase
    .from("exams")
    .select("id, slug, title, status, grade, kind, duration_min, created_at, exam_sections(question_count)")
    .order("created_at", { ascending: false });
  const { data: attempts } = await supabase.from("exam_attempts").select("exam_id, total_net");

  const stats = new Map<string, { n: number; sum: number }>();
  for (const a of attempts ?? []) {
    const s = stats.get(a.exam_id) ?? { n: 0, sum: 0 };
    s.n += 1;
    s.sum += Number(a.total_net);
    stats.set(a.exam_id, s);
  }

  return (
    <AdminShell
      title="Sınavlar"
      actions={
        <Link href="/admin/sinavlar/yeni" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
          + Yeni sınav (PDF’ten)
        </Link>
      }
    >
      {!exams?.length ? (
        <p className="m-0 text-muted">Henüz sınav yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-border bg-background">
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-border text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
                <th className="px-5 py-3 font-semibold">Sınav</th>
                <th className="px-5 py-3 font-semibold">Durum</th>
                <th className="px-5 py-3 font-semibold">Soru</th>
                <th className="px-5 py-3 font-semibold">Çözen</th>
                <th className="px-5 py-3 font-semibold">Ort. net</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {exams.map((e) => {
                const s = stats.get(e.id);
                const q = (e.exam_sections ?? []).reduce((n, x) => n + x.question_count, 0);
                return (
                  <tr key={e.id} className="border-b border-[#eef2ef] last:border-0">
                    <td className="px-5 py-4">
                      <div className="font-semibold">{e.title}</div>
                      <div className="text-sm text-muted">
                        {kindInfo(e.kind).short} · {gradeLabel(e.grade)} · {e.duration_min} dk · /deneme/{e.slug}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2 py-1 text-[13px] font-semibold ${statusClass[e.status]}`}>{statusLabel[e.status]}</span>
                    </td>
                    <td className="px-5 py-4 tabular-nums">{q}</td>
                    <td className="px-5 py-4 tabular-nums">{s?.n ?? 0}</td>
                    <td className="px-5 py-4 tabular-nums">{s ? formatNet(s.sum / s.n) : "—"}</td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/sinavlar/${e.id}`} className="font-semibold text-primary hover:underline">
                        Düzenle →
                      </Link>
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
