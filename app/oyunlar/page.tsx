import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Ücretsiz Eğitim Oyunları — ÖzelDersBul",
  description: "Harita, eşleştirme ve kategori oyunlarıyla konuları oynayarak pekiştir. Ücretsiz, kayıt gerekmez.",
};

const oyunlar = [
  {
    href: "/oyunlar/turkiye-illeri",
    ders: "Coğrafya",
    baslik: "Türkiye'nin İlleri",
    aciklama: "81 ili ad ya da plaka koduyla haritada bul. Bölge bölge de oynanır.",
    etiket: "Harita oyunu",
  },
  {
    href: "/oyunlar/dunya-ulkeleri",
    ders: "Coğrafya",
    baslik: "Dünya'da Ülkeler",
    aciklama: "195 ülkeyi dünya haritasında bul. Kıta seçince harita yakınlaşır.",
    etiket: "Harita oyunu",
  },
  {
    href: "/oyunlar/iller-ve-bolgeler",
    ders: "Coğrafya",
    baslik: "İller ve Bölgeleri",
    aciklama: "İlleri coğrafi bölgelerine yerleştir.",
    etiket: "Sürükle-bırak",
  },
  {
    href: "/oyunlar/ulkeler-ve-kitalar",
    ders: "Coğrafya",
    baslik: "Ülkeler ve Kıtaları",
    aciklama: "Ülkeleri bulundukları kıtaya yerleştir.",
    etiket: "Sürükle-bırak",
  },
];

export default function OyunlarPage() {
  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4">
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Ücretsiz oyunlar</p>
            <h1 className="m-0 max-w-[18em] font-serif text-4xl leading-[1.1] font-bold sm:text-5xl">
              Oynayarak tekrar et.
            </h1>
            <p className="m-0 max-w-[36em] text-[19px] leading-relaxed text-[#3d4743]">
              Kısa, etkileşimli oyunlarla konuları pekiştir. Kayıt olmadan başlayabilirsin.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {oyunlar.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="group flex flex-col gap-3 rounded-[10px] border border-border bg-background p-6 text-foreground no-underline transition-colors hover:border-primary"
              >
                <span className="text-sm font-semibold text-primary">
                  {o.ders} · {o.etiket}
                </span>
                <span className="font-serif text-2xl font-bold">{o.baslik}</span>
                <span className="text-[15px] leading-relaxed text-muted">{o.aciklama}</span>
                <span className="mt-auto pt-2 font-semibold text-primary group-hover:underline">Oyna →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
