import type { Metadata } from "next";
import Link from "next/link";

import { AdminShell } from "@/app/admin/admin-shell";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { branchName } from "@/lib/teacher";

export const instant = false;
export const metadata: Metadata = { title: "Genel bakış — Yönetim", robots: { index: false, follow: false } };

const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });
const dFmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });

type Level = { subject: string; grades_min: number; grades_max: number };
const band = (g: number) => (g <= 4 ? "3–4" : g <= 8 ? "5–8" : "9–12");

export default async function AdminHome() {
  await requireAdmin("/admin");
  const supabase = await createClient();
  const now = new Date();
  const week = new Date(now.getTime() - 7 * 86400000).toISOString();
  const month = new Date(now.getTime() - 30 * 86400000).toISOString();

  const [apps, teachers, requests, offers, orders, attempts7, attemptsUser7, veli, veli7] = await Promise.all([
    supabase.from("teacher_applications").select("stage, rejected_at, submitted_at, demo_availability, demo_scheduled_at, criminal_record_consent_at, contract_signed_at"),
    supabase.from("teachers").select("profile_id, status, branch_levels"),
    supabase.from("lesson_requests").select("id, subject, status, created_at, students(first_name, grade)").eq("status", "acik").order("created_at", { ascending: false }).limit(60),
    supabase.from("intro_offers").select("status, starts_at, expires_at").gte("created_at", month),
    supabase
      .from("package_orders")
      .select("id, student_name, grade, product_code, lesson_count, price, created_at, teachers(display_name), profiles!package_orders_parent_id_fkey(full_name)")
      .eq("status", "odeme_bekliyor")
      .order("created_at", { ascending: false }),
    supabase.from("exam_attempts").select("id", { count: "exact", head: true }).gte("created_at", week),
    supabase.from("exam_attempts").select("id", { count: "exact", head: true }).gte("created_at", week).not("user_id", "is", null),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "veli"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "veli").gte("created_at", week),
  ]);

  // Öğretmen hunisi ve yönetimi bekleyen işler
  const live = (apps.data ?? []).filter((a) => a.submitted_at && !a.rejected_at);
  const todo = {
    demoPlan: live.filter((a) => a.stage === "demo" && a.demo_availability && !a.demo_scheduled_at).length,
    demoScore: live.filter((a) => a.stage === "demo" && a.demo_scheduled_at).length,
    docs: live.filter((a) => a.stage === "belge" && a.criminal_record_consent_at).length,
    approve: live.filter((a) => a.stage === "oryantasyon" && a.contract_signed_at).length,
    shadow: live.filter((a) => a.stage === "golge").length,
  };
  const funnel = ["test", "demo", "belge", "oryantasyon"].map((s) => ({ s, n: live.filter((a) => a.stage === s).length }));
  const tRows = teachers.data ?? [];
  const activeTeachers = tRows.filter((t) => t.status === "aktif" || t.status === "golge");

  // Talep / arz: açık talepler ve uygun öğretmen sayısı
  const reqs = (requests.data ?? []) as unknown as { id: string; subject: string; created_at: string; students: { first_name: string; grade: number } | null }[];
  const matchCounts = await Promise.all(
    reqs.map(async (r) => {
      const { data } = await supabase.rpc("request_teacher_options", { p_request: r.id });
      return (data ?? []).length;
    }),
  );
  const unmatched = reqs.filter((_, i) => matchCounts[i] === 0);

  const supply = new Map<string, { teachers: number; open: number; unmatched: number }>();
  const key = (subject: string, b: string) => `${subject}|${b}`;
  for (const t of activeTeachers) {
    for (const l of (Array.isArray(t.branch_levels) ? t.branch_levels : []) as unknown as Level[]) {
      for (const b of ["3–4", "5–8", "9–12"]) {
        const [lo, hi] = b === "3–4" ? [3, 4] : b === "5–8" ? [5, 8] : [9, 12];
        if (l.grades_min <= hi && l.grades_max >= lo) {
          const k = key(l.subject, b);
          const v = supply.get(k) ?? { teachers: 0, open: 0, unmatched: 0 };
          v.teachers++;
          supply.set(k, v);
        }
      }
    }
  }
  reqs.forEach((r, i) => {
    const k = key(r.subject, band(r.students?.grade ?? 8));
    const v = supply.get(k) ?? { teachers: 0, open: 0, unmatched: 0 };
    v.open++;
    if (matchCounts[i] === 0) v.unmatched++;
    supply.set(k, v);
  });
  const supplyRows = [...supply.entries()]
    .map(([k, v]) => ({ subject: k.split("|")[0], band: k.split("|")[1], ...v }))
    .sort((a, b) => b.unmatched - a.unmatched || b.open - a.open || a.teachers - b.teachers);

  const off = offers.data ?? [];
  const offerStats = {
    waiting: off.filter((o) => o.status === "bekliyor" && Date.parse(o.expires_at) > now.getTime()).length,
    upcoming: off.filter((o) => o.status === "kabul" && Date.parse(o.starts_at) > now.getTime()).length,
    accepted: off.filter((o) => o.status === "kabul").length,
    lost: off.filter((o) => o.status === "ret" || o.status === "suresi_doldu" || (o.status === "bekliyor" && Date.parse(o.expires_at) <= now.getTime())).length,
  };
  const ord = (orders.data ?? []) as unknown as {
    id: string;
    student_name: string;
    grade: number;
    product_code: string;
    lesson_count: number;
    price: number;
    created_at: string;
    teachers: { display_name: string } | null;
    profiles: { full_name: string | null } | null;
  }[];
  const pipeline = ord.reduce((n, o) => n + Number(o.price), 0);
  const todoTotal = todo.demoPlan + todo.demoScore + todo.docs + todo.approve;

  return (
    <AdminShell title="Genel bakış">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <Tile label="Öğretmen (aktif + gölge)" value={activeTeachers.length} sub={`${tRows.filter((t) => t.status === "golge").length} gölge dönemde`} dark />
        <Tile label="Bekleyen yönetim işi" value={todoTotal} sub="başvurularda" href="/admin/ogretmenler" />
        <Tile label="Açık veli talebi" value={reqs.length} sub={`${unmatched.length} talep için uygun öğretmen yok`} warn={unmatched.length > 0} />
        <Tile label="Ödeme bekleyen paket" value={ord.length} sub={tl.format(pipeline)} />
        <Tile label="Deneme çözümü (7 gün)" value={attempts7.count ?? 0} sub={`${attemptsUser7.count ?? 0} hesaplı`} />
        <Tile label="Veli hesabı" value={veli.count ?? 0} sub={`son 7 günde +${veli7.count ?? 0}`} />
      </div>

      <section className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold">Öğretmen hunisi</h2>
          <Link href="/admin/ogretmenler" className="font-semibold text-primary hover:underline">
            Başvurular →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 text-[15px]">
          {funnel.map((f) => (
            <span key={f.s} className="rounded-full bg-[#f6f8f7] px-4 py-2">
              {{ test: "Branş testi", demo: "Demo", belge: "Belge", oryantasyon: "Sözleşme" }[f.s]}: <strong className="tabular-nums">{f.n}</strong>
            </span>
          ))}
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-1 p-0 text-[15px]">
          <Todo n={todo.demoPlan} label="demo planlanacak" />
          <Todo n={todo.demoScore} label="demo puanlanacak" />
          <Todo n={todo.docs} label="belge doğrulanacak" />
          <Todo n={todo.approve} label="onay bekliyor" />
          <Todo n={todo.shadow} label="gölge dönemde (ilk dersler izlenecek)" />
        </ul>
      </section>

      <section className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-6">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-xl font-semibold">Talep ve öğretmen arzı</h2>
          <p className="m-0 text-[15px] text-muted">Branş ve kademeye göre. Kırmızı satırlar: veli bekliyor, uygun öğretmen yok — alım önceliği.</p>
        </div>
        {supplyRows.length === 0 ? (
          <p className="m-0 text-muted">Henüz öğretmen ya da açık talep yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-semibold">Branş</th>
                  <th className="py-2 pr-4 font-semibold">Kademe</th>
                  <th className="py-2 pr-4 font-semibold">Öğretmen</th>
                  <th className="py-2 pr-4 font-semibold">Açık talep</th>
                  <th className="py-2 font-semibold">Öğretmensiz talep</th>
                </tr>
              </thead>
              <tbody>
                {supplyRows.map((r) => (
                  <tr key={`${r.subject}${r.band}`} className={`border-b border-[#eef2ef] ${r.unmatched ? "bg-[#fdecea]" : ""}`}>
                    <td className="py-2 pr-4 font-medium">{branchName(r.subject)}</td>
                    <td className="py-2 pr-4">{r.band}. sınıf</td>
                    <td className="py-2 pr-4 tabular-nums">{r.teachers}</td>
                    <td className="py-2 pr-4 tabular-nums">{r.open}</td>
                    <td className={`py-2 tabular-nums ${r.unmatched ? "font-semibold text-destructive" : ""}`}>{r.unmatched}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="m-0 text-[15px]">
          Tanışma (son 30 gün): <strong>{offerStats.waiting}</strong> öğretmen yanıtı bekliyor · <strong>{offerStats.upcoming}</strong> yaklaşan ·{" "}
          <strong>{offerStats.accepted}</strong> kabul · <strong>{offerStats.lost}</strong> ret ya da süresi doldu
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-6">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-xl font-semibold">Ödeme bekleyen paketler</h2>
          <p className="m-0 text-[15px] text-muted">Tanışmadan sonra seçilen paketler. Ödeme, PayTR pazaryeri entegrasyonuyla bağlanacak.</p>
        </div>
        {ord.length === 0 ? (
          <p className="m-0 text-muted">Bekleyen paket yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-semibold">Veli</th>
                  <th className="py-2 pr-4 font-semibold">Öğrenci</th>
                  <th className="py-2 pr-4 font-semibold">Öğretmen</th>
                  <th className="py-2 pr-4 font-semibold">Paket</th>
                  <th className="py-2 pr-4 font-semibold">Tutar</th>
                  <th className="py-2 font-semibold">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {ord.map((o) => (
                  <tr key={o.id} className="border-b border-[#eef2ef]">
                    <td className="py-2 pr-4">{o.profiles?.full_name ?? "—"}</td>
                    <td className="py-2 pr-4">
                      {o.student_name} · {o.grade}. sınıf
                    </td>
                    <td className="py-2 pr-4">{o.teachers?.display_name ?? "—"}</td>
                    <td className="py-2 pr-4">
                      {o.product_code} · {o.lesson_count} ders
                    </td>
                    <td className="py-2 pr-4 tabular-nums">{tl.format(Number(o.price))}</td>
                    <td className="py-2 tabular-nums">{dFmt.format(new Date(o.created_at))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {unmatched.length ? (
        <section className="flex flex-col gap-3 rounded-[10px] border border-[#f1c9c4] bg-background p-6">
          <h2 className="m-0 text-xl font-semibold">Öğretmen bulunamayan talepler</h2>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px]">
            {unmatched.map((r) => (
              <li key={r.id}>
                {r.students?.first_name} · {r.students?.grade}. sınıf · {branchName(r.subject)} · {dFmt.format(new Date(r.created_at))}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </AdminShell>
  );
}

function Tile({ label, value, sub, dark, warn, href }: { label: string; value: number; sub: string; dark?: boolean; warn?: boolean; href?: string }) {
  const body = (
    <div className={`flex h-full flex-col gap-1 rounded-[10px] p-5 ${dark ? "tahta text-[#f2f5f1]" : warn ? "border border-[#f1c9c4] bg-[#fdecea]" : "border border-border bg-background"}`}>
      <span className={`text-sm font-semibold uppercase tracking-[0.06em] ${dark ? "text-[#cfe3d6]" : "text-muted"}`}>{label}</span>
      <span className="font-serif text-[38px] leading-none font-bold tabular-nums">{value}</span>
      <span className={`text-[14px] ${dark ? "text-[#dce9e0]" : warn ? "text-destructive" : "text-[#3d4743]"}`}>{sub}</span>
    </div>
  );
  return href ? (
    <Link href={href} className="no-underline text-inherit">
      {body}
    </Link>
  ) : (
    body
  );
}

function Todo({ n, label }: { n: number; label: string }) {
  return (
    <li className={n ? "font-semibold text-foreground" : "text-muted"}>
      <span className="tabular-nums">{n}</span> {label}
    </li>
  );
}
