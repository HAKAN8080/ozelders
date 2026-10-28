import type { Metadata } from "next";
import Link from "next/link";

import { KatilFormu } from "@/app/sinif/[kod]/katil";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const instant = false;
export const metadata: Metadata = { title: "Sınıfa katıl — ÖzelDersBul", robots: { index: false, follow: false } };

export default async function SinifKatilPage(props: PageProps<"/sinif/[kod]">) {
  const { kod: ham } = await props.params;
  const kod = ham.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  let ad: string | null = null;
  if (kod.length === 6) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("sinif_bilgisi", { p_kod: kod });
    ad = data ?? null;
  }

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6 px-4 pt-14 pb-24 sm:px-6">
          {ad ? (
            <>
              <div className="flex flex-col gap-2">
                <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Sınıfa katıl · {kod}</p>
                <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold">{ad}</h1>
                <p className="m-0 text-[17px] leading-relaxed text-[#3d4743]">
                  Öğretmenin seni bu sınıfa davet etti. Adını yaz ve oyunlara başla; bitirdiğin oyunların sonucu öğretmenine gider. Giriş
                  yapman gerekmez.
                </p>
              </div>
              <section className="rounded-[10px] border border-border bg-background p-6">
                <KatilFormu kod={kod} ad={ad} />
              </section>
            </>
          ) : (
            <div className="flex flex-col items-start gap-4 rounded-[10px] border border-border bg-background p-6">
              <h1 className="m-0 font-serif text-3xl font-bold">Bu kodla bir sınıf bulamadık.</h1>
              <p className="m-0 text-[17px] text-[#3d4743]">Kodu öğretmeninden tekrar kontrol et. Kod 6 harf ve rakamdan oluşur.</p>
              <Link href="/oyunlar" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground no-underline">
                Yine de oyunlara git
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
