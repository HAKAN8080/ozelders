import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { GRUPLAR, konuBasligi } from "@/lib/games/konular";
import { createClient } from "@/lib/supabase/server";

export const instant = false;
export const metadata: Metadata = { title: "Oyun ilerlemem — ÖzelDersBul", robots: { index: false, follow: false } };

const tarih = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "Europe/Istanbul" });

type Satir = { konu: string; oyun: string; oran: number; created_at: string };

export default async function IlerlemePage() {
  const session = await getSessionProfile();
  if (!session.userId) redirect(`/giris?next=${encodeURIComponent("/panel/ilerleme")}`);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("oyun_sonuclari")
    .select("konu, oyun, oran, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  const satirlar = (data ?? []) as Satir[];

  // Konu bazında: en iyi, son, deneme sayısı
  const konular = new Map<string, { en: number; son: number; sayi: number; tarih: string; oyunlar: Map<string, number> }>();
  for (const r of satirlar) {
    const k = konular.get(r.konu) ?? { en: 0, son: r.oran, sayi: 0, tarih: r.created_at, oyunlar: new Map() };
    k.en = Math.max(k.en, r.oran);
    k.sayi++;
    k.oyunlar.set(r.oyun, Math.max(k.oyunlar.get(r.oyun) ?? 0, r.oran));
    konular.set(r.konu, k);
  }
  const liste = [...konular.entries()].sort((a, b) => a[1].en - b[1].en);
  const zayif = liste.filter(([, k]) => k.en < 70);
  const oynanmamis = GRUPLAR.flatMap((g) => g.oyunlar).filter((o) => !konular.has(o.href.replace("/oyunlar/", "")));

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 pt-12 pb-20 sm:px-6">
          <div className="flex flex-col gap-2">
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Oyun ilerlemem</p>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-[44px]">Hangi konu oturdu, hangisi eksik?</h1>
            <p className="m-0 max-w-[40em] text-[17px] leading-relaxed text-[#3d4743]">
              Oynadığın her oyunun sonucu buraya yazılır. %70&apos;in altında kalan konular eksik sayılır.
            </p>
          </div>

          {error ? (
            <p className="m-0 rounded-md border border-border bg-background px-4 py-4">İlerleme kaydı çok yakında açılıyor. Oyunlara devam edebilirsin.</p>
          ) : satirlar.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-[10px] border border-border bg-background p-6">
              <p className="m-0 text-[17px]">Henüz kayıtlı oyun sonucun yok. Bir oyun bitirdiğinde burada görünecek.</p>
              <Link href="/oyunlar" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground no-underline">
                Oyunlara git
              </Link>
            </div>
          ) : (
            <>
              {zayif.length > 0 && (
                <section className="tahta flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[10px] px-6 py-6 text-primary-foreground">
                  <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-1.5">
                    <h2 className="m-0 font-serif text-[24px] font-bold">{zayif.length} konuda eksik var.</h2>
                    <p className="m-0 text-[15px] text-[#dce9e0]">
                      {zayif.map(([k]) => konuBasligi(k)).join(", ")}. Bu konularda bir öğretmenle birebir çalışabilirsin; önce ücretsiz 20 dakikalık
                      tanışma dersi.
                    </p>
                  </div>
                  <Link href="/panel/ogretmen-bul?ders=cografya" className="rounded-md bg-white px-5 py-3 font-semibold text-primary no-underline">
                    Coğrafya öğretmeni bul
                  </Link>
                </section>
              )}
              <section className="overflow-x-auto rounded-[10px] border border-border bg-background">
                <table className="w-full border-collapse text-[15px]">
                  <thead>
                    <tr className="bg-primary-soft text-left">
                      <th className="px-4 py-3">Konu</th>
                      <th className="px-4 py-3">En iyi</th>
                      <th className="px-4 py-3">Son</th>
                      <th className="px-4 py-3">Oynama</th>
                      <th className="px-4 py-3">Son oynama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liste.map(([konu, k]) => (
                      <tr key={konu} className="border-t border-border">
                        <td className="px-4 py-3">
                          <Link href={`/oyunlar/${konu}`} className="font-semibold text-foreground">
                            {konuBasligi(konu)}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded px-2 py-0.5 font-semibold ${k.en >= 85 ? "bg-primary text-primary-foreground" : k.en >= 70 ? "bg-primary-soft text-primary" : "bg-[#fbefd6] text-[#5a4210]"}`}>
                            %{k.en}
                          </span>
                        </td>
                        <td className="px-4 py-3">%{k.son}</td>
                        <td className="px-4 py-3">{k.sayi}</td>
                        <td className="px-4 py-3">{tarih.format(new Date(k.tarih))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              {oynanmamis.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h2 className="m-0 font-serif text-xl font-bold">Henüz oynamadıkların</h2>
                  <div className="flex flex-wrap gap-2">
                    {oynanmamis.map((o) => (
                      <Link key={o.href} href={o.href} className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[15px] text-foreground no-underline hover:border-primary">
                        {o.baslik}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
