import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { InviteButtons, LeaveButton } from "@/app/panel/mini-grup/buttons";
import { MiniGrupForm } from "@/app/panel/mini-grup/form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { dateTR, MG, scheduleText } from "@/lib/mini-grup";
import { prefSummary, type Pref } from "@/lib/requests";
import { createClient } from "@/lib/supabase/server";
import { branchName } from "@/lib/teacher";

export const instant = false;
export const metadata: Metadata = { title: "Mini grup — Özel Ders · Thorius", robots: { index: false, follow: false } };

const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

type Group = { id: string; schedule: unknown; starts_on: string; status: string; invite_deadline: string; teachers: { display_name: string } | null };

export default async function MiniGrupPage(props: PageProps<"/panel/mini-grup">) {
  const sp = await props.searchParams;
  const session = await getSessionProfile();
  if (!session.userId) redirect("/giris?next=/panel/mini-grup");
  if (session.profile?.role !== "veli") redirect("/panel");

  const supabase = await createClient();
  const [{ data: kids }, { data: waits }, { data: members }] = await Promise.all([
    supabase.from("students").select("id, first_name, grade").order("created_at"),
    supabase.from("group_waitlist").select("id, subject, grade, preferred, status, group_id, created_at, students(first_name)").neq("status", "iptal").order("created_at", { ascending: false }),
    supabase
      .from("mini_group_members")
      .select("id, waitlist_id, status, price, lesson_count, mini_groups(id, schedule, starts_on, status, invite_deadline, teachers(display_name))")
      .in("status", ["davet", "onayladi"]),
  ]);
  const memberOf = new Map((members ?? []).map((m) => [m.waitlist_id, m]));

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[860px] flex-col gap-8 px-4 pt-12 pb-20 sm:px-6">
          <div className="flex flex-col gap-2">
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Mini grup</p>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-[44px]">3–4 kişilik grupla, yarı fiyatına.</h1>
            <p className="m-0 max-w-[40em] text-[17px] leading-relaxed text-[#3d4743]">
              Aynı sınıf ve dersteki {MG.minSize}–{MG.maxSize} öğrenci, seçilmiş bir öğretmenle haftada 2 ders ({MG.minutes} dk) çalışır. Aylık{" "}
              <strong>{tl.format(MG.monthly)}</strong> ({MG.lessonsPerMonth} ders, ders başı {tl.format(MG.pricePerLesson)}). Bekleme listesine yaz; uygun
              arkadaşlar ve öğretmen bulununca grubu biz kurar, sana davet göndeririz.
            </p>
          </div>

          {sp.kayit ? (
            <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px] text-primary" role="status">
              Bekleme listesine yazıldın. Grup kurulunca e-postayla davet göndereceğiz; davete 48 saat içinde yanıt vermen yeterli.
            </p>
          ) : null}

          {waits && waits.length ? (
            <section className="flex flex-col gap-4">
              <h2 className="m-0 text-xl font-semibold">Başvuruların</h2>
              {waits.map((w) => {
                const m = memberOf.get(w.id);
                const g = (m?.mini_groups ?? null) as unknown as Group | null;
                const name = (w.students as unknown as { first_name: string } | null)?.first_name ?? "";
                return (
                  <article key={w.id} className="flex flex-col gap-3 rounded-[10px] border border-border bg-background p-5 sm:p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="m-0 text-lg font-semibold">
                        {name} · {w.grade}. sınıf · {branchName(w.subject)}
                      </h3>
                      <span className="rounded-full bg-primary-soft px-3 py-1 text-[13px] font-semibold text-primary">
                        {w.status === "bekliyor" ? "Grup bekleniyor" : w.status === "davet" ? (m?.status === "onayladi" ? "Katıldın · grup tamamlanıyor" : "Davet var") : "Grupta"}
                      </span>
                    </div>
                    {w.status === "bekliyor" ? (
                      <>
                        <p className="m-0 text-[15px] text-muted">Saat tercihi: {prefSummary(w.preferred as unknown as Pref[])}</p>
                        <LeaveButton id={w.id} />
                      </>
                    ) : g ? (
                      <>
                        <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 text-[15px]">
                          <div>
                            <dt className="text-muted">Öğretmen</dt>
                            <dd className="m-0 font-semibold">{g.teachers?.display_name ?? "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted">Ders saatleri</dt>
                            <dd className="m-0 font-semibold">{scheduleText(g.schedule)}</dd>
                          </div>
                          <div>
                            <dt className="text-muted">Başlangıç</dt>
                            <dd className="m-0 font-semibold">{dateTR(g.starts_on)}</dd>
                          </div>
                          <div>
                            <dt className="text-muted">Aylık</dt>
                            <dd className="m-0 font-semibold">
                              {tl.format(Number(m?.price))} · {m?.lesson_count} ders
                            </dd>
                          </div>
                        </dl>
                        {m?.status === "davet" ? (
                          <>
                            <p className="m-0 text-[15px] text-muted">Davet {dateTR(g.invite_deadline)} tarihine kadar geçerli.</p>
                            <InviteButtons memberId={m.id} />
                          </>
                        ) : (
                          <p className="m-0 text-[15px] text-muted">
                            {g.status === "aktif"
                              ? "Grup tamamlandı. Ödeme adımı için sana e-posta göndereceğiz; ödemen ders ders güvenli hesapta bekler."
                              : `Katılımını aldık. Grup en az ${MG.minSize} kişi olunca başlar.`}
                          </p>
                        )}
                      </>
                    ) : null}
                  </article>
                );
              })}
            </section>
          ) : null}

          <section className="rounded-[10px] border border-border bg-background p-6 sm:p-8">
            <h2 className="m-0 mb-5 text-xl font-semibold">Bekleme listesine yaz</h2>
            {kids && kids.length ? (
              <MiniGrupForm kids={kids} />
            ) : (
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[17px]">Önce çocuğunu ekle: yalnızca adı ve sınıfı yeterli.</p>
                <Link href="/panel" className="self-start rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground">
                  Çocuğumu ekle
                </Link>
              </div>
            )}
          </section>
          <p className="m-0 text-[15px] text-muted">
            Birebir ders mi istersin? <Link href="/panel/ogretmen-bul" className="font-semibold text-primary hover:underline">Öğretmen bul →</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
