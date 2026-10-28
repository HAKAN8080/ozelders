import type { Metadata } from "next";
import Link from "next/link";

import { ArkaPlan } from "@/components/oyun/arka-planlar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Ücretsiz Eğitim Oyunları — ÖzelDersBul",
  description: "Harita, eşleştirme ve kategori oyunlarıyla konuları oynayarak pekiştir. Ücretsiz, kayıt gerekmez.",
};

type Oyun = { href: string; baslik: string; aciklama: string; etiket: string };

/** Oyunlar ders ve üniteye göre gruplu. Yeni konu eklenince buraya bir satır eklenir. */
const GRUPLAR: { baslik: string; alt?: string; oyunlar: Oyun[] }[] = [
  {
    baslik: "9. Sınıf Coğrafya · 1. Ünite",
    alt: "Coğrafyanın Doğası",
    oyunlar: [
      {
        href: "/oyunlar/cografyanin-konusu-ve-bolumleri",
        baslik: "Coğrafyanın Konusu ve Bölümleri",
        aciklama: "Küreler, fiziki ve beşerî coğrafyanın alt dalları, temel kavramlar.",
        etiket: "7 oyun",
      },
      {
        href: "/oyunlar/cografya-biliminin-gelisimi",
        baslik: "Coğrafya Biliminin Gelişimi",
        aciklama: "Bilim insanlarını çağına yerleştir, zaman şeridinde sırala, katkılarıyla eşleştir.",
        etiket: "5 oyun",
      },
    ],
  },
  {
    baslik: "9. Sınıf Coğrafya · 2. Ünite",
    alt: "Mekânsal Bilgi Teknolojileri",
    oyunlar: [
      {
        href: "/oyunlar/harita-ve-olcek",
        baslik: "Harita ve Ölçek",
        aciklama: "Harita kavramları, elemanlar, projeksiyonlar, büyük ve küçük ölçek, ölçek hesapları.",
        etiket: "8 oyun",
      },
      {
        href: "/oyunlar/koordinatlar-ve-saat-dilimleri",
        baslik: "Koordinatlar ve Saat Dilimleri",
        aciklama: "Haritada koordinat bul, Irma kasırgasının rotasını çiz, saat dilimi hesapları.",
        etiket: "6 oyun",
      },
      {
        href: "/oyunlar/haritalama-teknikleri-ve-yer-sekilleri",
        baslik: "Haritalama Teknikleri ve Yer Şekilleri",
        aciklama: "Koroplet, korokromatik, akış, kartogram; topoğrafya haritasında izohips okuma; yer şekilleri.",
        etiket: "10 oyun",
      },
      {
        href: "/oyunlar/turkiyenin-cografi-konumu",
        baslik: "Türkiye'nin Coğrafi Konumu",
        aciklama: "Mutlak ve göreceli konum, kara ve deniz komşuları, Mavi Vatan ve Gök Vatan.",
        etiket: "7 oyun",
      },
      {
        href: "/oyunlar/mekansal-bilgi-teknolojileri",
        baslik: "Mekânsal Bilgi Teknolojileri",
        aciklama: "CBS ve GPS bileşenleri, CBS'nin avantajları ve etik kuralları.",
        etiket: "5 oyun",
      },
    ],
  },
  {
    baslik: "Harita oyunları",
    alt: "Her sınıf için",
    oyunlar: [
      {
        href: "/oyunlar/turkiye-illeri",
        baslik: "Türkiye'nin İlleri",
        aciklama: "81 ili ad ya da plaka koduyla haritada bul. Bölge bölge de oynanır.",
        etiket: "Harita",
      },
      {
        href: "/oyunlar/dunya-ulkeleri",
        baslik: "Dünya'da Ülkeler",
        aciklama: "196 ülkeyi dünya haritasında bul. Kıta seçince harita yakınlaşır.",
        etiket: "Harita",
      },
      {
        href: "/oyunlar/iller-ve-bolgeler",
        baslik: "İller ve Bölgeleri",
        aciklama: "İlleri coğrafi bölgelerine yerleştir.",
        etiket: "Sürükle-bırak",
      },
      {
        href: "/oyunlar/ulkeler-ve-kitalar",
        baslik: "Ülkeler ve Kıtaları",
        aciklama: "Ülkeleri bulundukları kıtaya yerleştir.",
        etiket: "Sürükle-bırak",
      },
    ],
  },
];

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
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
