import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { IllerOyunu } from "@/app/oyunlar/turkiye-illeri/iller-oyunu";

export const metadata: Metadata = {
  title: "Türkiye'nin İlleri Harita Oyunu — ÖzelDersBul",
  description: "81 ili haritada bul: ad ya da plaka koduyla, tüm Türkiye ya da bölge bölge. Ücretsiz coğrafya oyunu.",
};

export default function TurkiyeIlleriPage() {
  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-3">
            <Link href="/oyunlar" className="text-sm font-semibold text-primary no-underline hover:underline">
              ← Tüm oyunlar
            </Link>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-5xl">Türkiye&apos;nin İlleri</h1>
            <p className="m-0 max-w-[38em] text-[19px] leading-relaxed text-[#3d4743]">
              81 ili haritada bul. İlk denemede 10, ikincide 5, üçüncüde 2 puan. Takılırsan ipucu ilin bölgesini
              gösterir.
            </p>
          </div>
          <IllerOyunu />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
