import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { sinifSil } from "@/app/siniflarim/actions";
import { BaglantiKopyala, SinifFormu } from "@/app/siniflarim/formlar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { konuBasligi } from "@/lib/games/konular";
import { createClient } from "@/lib/supabase/server";

export const instant = false;
export const metadata: Metadata = { title: "Sınıflarım — ÖzelDersBul", robots: { index: false, follow: false } };

const tarih = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function SiniflarimPage(props: PageProps<"/siniflarim">) {
  const session = await getSessionProfile();
  if (!session.userId) redirect(`/giris?next=${encodeURIComponent("/siniflarim")}`);
  const sp = await props.searchParams;

  const supabase = await createClient();
  const { data: siniflar, error } = await supabase.from("siniflar").select("id, ad, kod, created_at").order("created_at", { ascending: false });
  const secili = (typeof sp.sinif === "string" && UUID.test(sp.sinif) ? siniflar?.find((s) => s.id === sp.sinif) : siniflar?.[0]) ?? null;

  let tablo: { ogrenciler: string[]; konular: string[]; en: Map<string, number>; son: Map<string, string>; sayi: number } | null = null;
  if (secili) {
    const { data } = await supabase
      .from("sinif_sonuclari")
      .select("ogrenci, konu, oran, created_at")
      .eq("sinif_id", secili.id)
      .order("created_at", { ascending: false })
      .limit(5000);
    const rows = data ?? [];
    const en = new Map<string, number>();
    const son = new Map<string, string>();
    for (const r of rows) {
      const k = `${r.ogrenci}|${r.konu}`;
      en.set(k, Math.max(en.get(k) ?? 0, r.oran));
      if (!son.has(r.ogrenci)) son.set(r.ogrenci, r.created_at);
    }
    tablo = {
      ogrenciler: [...new Set(rows.map((r) => r.ogrenci))].sort((a, b) => a.localeCompare(b, "tr")),
      konular: [...new Set(rows.map((r) => r.konu))],
      en,
      son,
      sayi: rows.length,
    };
  }

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-4 pt-12 pb-20 sm:px-6">
          <div className="flex flex-col gap-2">
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Öğretmenler için sınıf modu</p>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-[44px]">Sınıflarım</h1>
            <p className="m-0 max-w-[44em] text-[17px] leading-relaxed text-[#3d4743]">
              Sınıf oluştur, bağlantıyı öğrencilerine gönder. Öğrenciler giriş yapmadan adlarıyla katılır; bitirdikleri her oyunun sonucu burada
              görünür. Ücretsiz.
            </p>
          </div>

          {error ? (
            <p className="m-0 rounded-md border border-border bg-background px-4 py-4">Sınıf modu çok yakında açılıyor.</p>
          ) : (
            <>
              <section className="rounded-[10px] border border-border bg-background p-5 sm:p-6">
                <SinifFormu />
              </section>

              {siniflar && siniflar.length > 0 ? (
                <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                  <nav className="flex flex-col gap-2">
                    {siniflar.map((s) => (
                      <Link
                        key={s.id}
                        href={`/siniflarim?sinif=${s.id}`}
                        className={`flex flex-col rounded-md border-2 px-4 py-3 text-foreground no-underline ${secili?.id === s.id ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/50"}`}
                      >
                        <span className="font-semibold">{s.ad}</span>
                        <span className="font-mono text-sm tracking-widest text-muted">{s.kod}</span>
                      </Link>
                    ))}
                  </nav>

                  {secili && tablo && (
                    <section className="flex min-w-0 flex-col gap-5 rounded-[10px] border border-border bg-background p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <h2 className="m-0 font-serif text-2xl font-bold">{secili.ad}</h2>
                          <p className="m-0 text-[15px] text-muted">
                            Sınıf kodu <strong className="font-mono text-lg tracking-widest text-foreground">{secili.kod}</strong> · Öğrenciler
                            ozeldersbul sitesinde <strong>/sinif/{secili.kod}</strong> adresinden katılır.
                          </p>
                        </div>
                        <BaglantiKopyala kod={secili.kod} ad={secili.ad} />
                      </div>

                      {tablo.ogrenciler.length === 0 ? (
                        <p className="m-0 rounded-md bg-primary-soft px-4 py-3">
                          Henüz sonuç yok. Bağlantıyı öğrencilerine gönder; bitirdikleri oyunlar burada görünecek.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-[14px]">
                            <thead>
                              <tr className="bg-primary-soft text-left">
                                <th className="sticky left-0 bg-primary-soft px-3 py-2">Öğrenci</th>
                                {tablo.konular.map((k) => (
                                  <th key={k} className="min-w-28 px-3 py-2 font-semibold">
                                    {konuBasligi(k)}
                                  </th>
                                ))}
                                <th className="px-3 py-2">Son oynama</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tablo.ogrenciler.map((o) => (
                                <tr key={o} className="border-t border-border">
                                  <td className="sticky left-0 bg-background px-3 py-2 font-semibold">{o}</td>
                                  {tablo!.konular.map((k) => {
                                    const v = tablo!.en.get(`${o}|${k}`);
                                    return (
                                      <td key={k} className="px-3 py-2">
                                        {v === undefined ? (
                                          <span className="text-muted">–</span>
                                        ) : (
                                          <span className={`rounded px-2 py-0.5 font-semibold ${v >= 85 ? "bg-primary text-primary-foreground" : v >= 70 ? "bg-primary-soft text-primary" : "bg-[#fbefd6] text-[#5a4210]"}`}>
                                            %{v}
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                                  <td className="px-3 py-2 text-muted">{tarih.format(new Date(tablo!.son.get(o)!))}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p className="m-0 mt-2 text-sm text-muted">
                            Her hücrede öğrencinin o konudaki en iyi sonucu var. Toplam {tablo.sayi} oyun sonucu.
                          </p>
                        </div>
                      )}

                      <form action={sinifSil} className="border-t border-border pt-4">
                        <input type="hidden" name="id" value={secili.id} />
                        <button type="submit" className="text-sm font-semibold text-[#c0392b] hover:underline">
                          Bu sınıfı ve sonuçlarını sil
                        </button>
                      </form>
                    </section>
                  )}
                </div>
              ) : (
                <p className="m-0 text-muted">Henüz sınıfın yok. Yukarıdan ilk sınıfını oluştur.</p>
              )}
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
