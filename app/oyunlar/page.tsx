import type { Metadata } from "next";
import Link from "next/link";

import { ArkaPlan } from "@/components/oyun/arka-planlar";
import { GununSorusuKarti } from "@/components/oyun/gunun-sorusu";
import { SinifSeridi } from "@/components/oyun/sinif-seridi";
import { gununSorusuHavuzu } from "@/lib/games/gunun-sorusu";
import { GRUPLAR } from "@/lib/games/konular";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Ücretsiz Eğitim Oyunları — ÖzelDersBul",
  description: "Harita, eşleştirme ve kategori oyunlarıyla konuları oynayarak pekiştir. Ücretsiz, kayıt gerekmez.",
};

export default function OyunlarPage() {
  return (
    <>
      <SiteHeader />
      <main className="defter relative isolate flex flex-1 flex-col">
        <ArkaPlan tur="pusula" />
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4">
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Ücretsiz oyunlar</p>
            <h1 className="m-0 max-w-[18em] font-serif text-4xl leading-[1.1] font-bold sm:text-5xl">
              Oynayarak tekrar et.
            </h1>
            <p className="m-0 max-w-[36em] text-[19px] leading-relaxed text-[#3d4743]">
              Kısa, etkileşimli oyunlarla konuları pekiştir. Kayıt olmadan başlayabilirsin.
            </p>
          </div>
          <SinifSeridi />
          <GununSorusuKarti havuz={gununSorusuHavuzu()} />
          {GRUPLAR.map((g) => (
            <section key={g.baslik} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2">
                <h2 className="m-0 font-serif text-2xl font-bold">{g.baslik}</h2>
                {g.alt && <span className="text-[15px] text-muted">{g.alt}</span>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {g.oyunlar.map((o) => (
                  <Link
                    key={o.href}
                    href={o.href}
                    className="group flex flex-col gap-3 rounded-[10px] border border-border bg-background/85 p-6 text-foreground no-underline backdrop-blur-[2px] transition-colors hover:border-primary"
                  >
                    <span className="text-sm font-semibold text-primary">{o.etiket}</span>
                    <span className="font-serif text-2xl font-bold">{o.baslik}</span>
                    <span className="text-[15px] leading-relaxed text-muted">{o.aciklama}</span>
                    <span className="mt-auto pt-2 font-semibold text-primary group-hover:underline">Oyna →</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-border bg-background/85 p-6 backdrop-blur-[2px]">
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-1">
              <h2 className="m-0 font-serif text-2xl font-bold">Öğretmen misin?</h2>
              <p className="m-0 text-[15px] leading-relaxed text-muted">
                Ücretsiz sınıf oluştur, bağlantıyı öğrencilerine gönder. Öğrenciler giriş yapmadan oynar; kim hangi konuda zorlanıyor, sen görürsün.
              </p>
            </div>
            <Link href="/siniflarim" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground no-underline hover:bg-primary-hover">
              Sınıf oluştur
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
