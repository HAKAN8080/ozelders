import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOut } from "@/app/panel/actions";
import { CocukFormu } from "@/app/panel/cocuk-formu";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { branchName } from "@/lib/teacher";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Veli paneli — Özel Ders",
};

export const instant = false;

const dt = new Intl.DateTimeFormat("tr-TR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });

export default async function PanelPage() {
  const session = await getSessionProfile();
  if (!session.userId) {
    redirect("/giris");
  }
  if (!session.profile) {
    redirect("/kayit");
  }
  if (session.profile.role === "admin") {
    redirect("/admin");
  }
  if (session.profile.role !== "veli") {
    redirect("/ogretmen");
  }

  const supabase = await createClient();
  const [{ data: children }, { data: requests }] = await Promise.all([
    supabase.from("students").select("id, first_name, grade").order("created_at", { ascending: true }),
    supabase
      .from("lesson_requests")
      .select("id, student_id, subject, status, created_at, intro_offers(status, starts_at, expires_at)")
      .neq("status", "iptal")
      .order("created_at", { ascending: false }),
  ]);
  const now = new Date().getTime();
  const reqState = (r: { status: string; intro_offers: { status: string; starts_at: string; expires_at: string }[] | null }) => {
    const o = (r.intro_offers ?? []).find((x) => (x.status === "bekliyor" && Date.parse(x.expires_at) > now) || (x.status === "kabul" && Date.parse(x.starts_at) + 20 * 60000 > now));
    if (o?.status === "kabul") return `Tanışma: ${dt.format(new Date(o.starts_at))}`;
    if (o) return "Öğretmen onayı bekleniyor";
    return r.status === "eslesti" ? "Tanışma yapıldı · paketini seç" : "Öğretmen seç";
  };

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[860px] flex-col gap-8 px-4 pt-12 pb-20 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Veli paneli</p>
              <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold">Çocuklarım</h1>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Çıkış
              </Button>
            </form>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/panel/mini-grup" className="rounded-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground no-underline hover:bg-primary-hover">
              Mini grup (3–4 kişi)
            </Link>
            <Link href="/panel/ilerleme" className="rounded-md border border-border bg-background px-4 py-2.5 font-semibold text-foreground no-underline hover:border-primary">
              Oyun ilerlemem
            </Link>
            <Link href="/oyunlar" className="rounded-md border border-border bg-background px-4 py-2.5 font-semibold text-foreground no-underline hover:border-primary">
              Ücretsiz oyunlar
            </Link>
            <Link href="/siniflarim" className="rounded-md border border-border bg-background px-4 py-2.5 font-semibold text-foreground no-underline hover:border-primary">
              Sınıflarım (öğretmenler için)
            </Link>
          </div>
          {children && children.length > 0 ? (
            <ul className="m-0 flex list-none flex-col gap-4 p-0">
              {children.map((child) => {
                const reqs = (requests ?? []).filter((r) => r.student_id === child.id);
                return (
                  <li key={child.id} className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="m-0 text-xl font-semibold">{child.first_name}</p>
                        <p className="m-0 text-muted">{child.grade}. sınıf</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link href="/deneme" className="rounded-md border border-border px-4 py-2.5 font-semibold hover:bg-primary-soft">
                          Ücretsiz deneme
                        </Link>
                        <Link href={`/panel/ogretmen-bul?cocuk=${child.id}`} className="rounded-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover">
                          Öğretmen bul
                        </Link>
                      </div>
                    </div>
                    {reqs.length ? (
                      <ul className="m-0 flex list-none flex-col gap-2 border-t border-border p-0 pt-3">
                        {reqs.map((r) => (
                          <li key={r.id}>
                            <Link href={`/panel/talep/${r.id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-md px-2 py-2 hover:bg-primary-soft">
                              <span className="font-medium">{branchName(r.subject)}</span>
                              <span className="text-[15px] font-semibold text-primary">
                                {reqState(r as never)} →
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="m-0 text-lg text-muted">Henüz çocuk eklemediniz. Yalnızca ad ve sınıf yeterli.</p>
          )}
          <section className="rounded-[10px] border border-border bg-background p-5 sm:p-6">
            <CocukFormu />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
