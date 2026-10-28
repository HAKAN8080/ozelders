import Link from "next/link";
import type { ReactNode } from "react";

import { ArkaPlan, type ArkaPlanTuru } from "@/components/oyun/arka-planlar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Tüm oyun sayfalarının ortak kabuğu: başlık, kısa açıklama, oyun. */
export function OyunSayfasi({
  baslik,
  aciklama,
  arkaPlan,
  children,
}: {
  baslik: string;
  aciklama: string;
  /** Konuya özel soluk arka plan çizimi. */
  arkaPlan?: ArkaPlanTuru;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="defter relative isolate flex flex-1 flex-col">
        {arkaPlan && <ArkaPlan tur={arkaPlan} />}
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-3">
            <Link href="/oyunlar" className="text-sm font-semibold text-primary no-underline hover:underline">
              ← Tüm oyunlar
            </Link>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-5xl">{baslik}</h1>
            <p className="m-0 max-w-[38em] text-[19px] leading-relaxed text-[#3d4743]">{aciklama}</p>
          </div>
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
