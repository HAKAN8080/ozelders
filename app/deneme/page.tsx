import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Ücretsiz Denemeler — ÖzelDersBul",
  description: "Ücretsiz LGS deneme sınavları, net hesabı ve kazanım raporu.",
};

// Sınav modülü (optik form + sonuç raporu) bir sonraki adımda bu sayfaya gelecek.
export default function DenemePage() {
  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-20 sm:px-6">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Ücretsiz denemeler</p>
          <h1 className="m-0 max-w-[18em] font-serif text-4xl leading-[1.1] font-bold sm:text-5xl">
            İlk deneme çok yakında burada.
          </h1>
          <p className="m-0 max-w-[34em] text-[19px] leading-relaxed text-[#3d4743]">
            2026 LGS Sayısal Bölüm’ü dijital optik formla çözüp netini ve kazanım raporunu görebileceksin.
            Yayına girdiğinde haber almak için şimdiden kayıt olabilirsin.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/kayit"
              className="rounded-md bg-primary px-6 py-4 text-[17px] font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Kayıt ol, haber verelim
            </Link>
            <Link
              href="/"
              className="rounded-md border border-[#b9c7bf] bg-background px-5 py-4 text-[17px] font-semibold text-foreground hover:bg-primary-soft"
            >
              Ana sayfa
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
