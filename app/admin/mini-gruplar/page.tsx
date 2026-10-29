import type { Metadata } from "next";

import { AdminShell } from "@/app/admin/admin-shell";
import { CancelGroupButton, Pool, type PoolEntry } from "@/app/admin/mini-gruplar/pool";
import { requireAdmin } from "@/lib/admin";
import { dateTR, MG, scheduleText } from "@/lib/mini-grup";
import { createClient } from "@/lib/supabase/server";
import { branchName } from "@/lib/teacher";

export const instant = false;
export const metadata: Metadata = { title: "Mini gruplar — Yönetim", robots: { index: false, follow: false } };

const memberLabel: Record<string, string> = { davet: "davet bekliyor", onayladi: "katıldı", reddetti: "reddetti", suresi_doldu: "süresi doldu", iptal: "iptal" };

export default async function AdminMiniGruplar() {
  await requireAdmin("/admin/mini-gruplar");
  const supabase = await createClient();
  const [{ data: waits }, { data: groups }] = await Promise.all([
    supabase.from("group_waitlist").select("id, subject, grade, preferred, note, created_at, students(first_name)").eq("status", "bekliyor").order("created_at"),
    supabase
      .from("mini_groups")
      .select("id, subject, grade, schedule, starts_on, status, invite_deadline, teachers(display_name), mini_group_members(id, student_name, status)")
      .neq("status", "iptal")
      .order("created_at", { ascending: false }),
  ]);

  const pools = new Map<string, { subject: string; grade: number; entries: PoolEntry[] }>();
  for (const w of waits ?? []) {
    const k = `${w.subject}|${w.grade}`;
    const p = pools.get(k) ?? { subject: w.subject, grade: w.grade, entries: [] };
    p.entries.push({ id: w.id, name: (w.students as unknown as { first_name: string } | null)?.first_name ?? "?", preferred: w.preferred, created_at: w.created_at, note: w.note });
    pools.set(k, p);
  }
  const sorted = [...pools.values()].sort((a, b) => b.entries.length - a.entries.length);

  return (
    <AdminShell title="Mini gruplar">
      <p className="m-0 max-w-[60em] text-[15px] text-muted">
        Aynı ders ve sınıfta en az {MG.minSize} bekleyen olunca grup kurulabilir. İki ders saati seç, iki saate de uyan öğrencileri (✓) işaretle, uygun
        öğretmeni bul ve grubu kur. Velilere 48 saat geçerli davet gider; {MG.minSize} kişi katılınca grup aktif olur.
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-xl font-semibold">Bekleme listesi</h2>
        {sorted.length ? (
          sorted.map((p) => <Pool key={`${p.subject}|${p.grade}`} subject={p.subject} subjectName={branchName(p.subject)} grade={p.grade} entries={p.entries} />)
        ) : (
          <p className="m-0 text-[15px] text-muted">Bekleyen öğrenci yok.</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-xl font-semibold">Kurulan gruplar</h2>
        {groups && groups.length ? (
          groups.map((g) => {
            const members = (g.mini_group_members ?? []) as { id: string; student_name: string; status: string }[];
            const ok = members.filter((m) => m.status === "onayladi").length;
            return (
              <article key={g.id} className="flex flex-col gap-3 rounded-[10px] border border-border bg-background p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="m-0 text-lg font-semibold">
                    {branchName(g.subject)} · {g.grade}. sınıf · {(g.teachers as unknown as { display_name: string } | null)?.display_name}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${g.status === "aktif" ? "bg-primary text-primary-foreground" : "bg-[#fff6e5] text-[#7a4b00]"}`}>
                    {g.status === "aktif" ? "Aktif · ödeme bekliyor" : `Davet aşamasında · ${ok}/${MG.minSize} katıldı`}
                  </span>
                </div>
                <p className="m-0 text-[15px] text-muted">
                  {scheduleText(g.schedule)} · başlangıç {dateTR(g.starts_on)}
                  {g.status === "davet" ? ` · davet son: ${dateTR(g.invite_deadline)}` : ""}
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {members.map((m) => (
                    <li key={m.id} className="rounded-md border border-border px-3 py-1.5 text-[15px]">
                      {m.student_name} · <span className="text-muted">{memberLabel[m.status] ?? m.status}</span>
                    </li>
                  ))}
                </ul>
                <CancelGroupButton id={g.id} />
              </article>
            );
          })
        ) : (
          <p className="m-0 text-[15px] text-muted">Henüz grup yok.</p>
        )}
      </section>
    </AdminShell>
  );
}
