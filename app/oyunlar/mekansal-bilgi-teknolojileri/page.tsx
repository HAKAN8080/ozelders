import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/mbt-bilesenleri";

export const metadata: Metadata = {
  title: "Mekânsal Bilgi Teknolojileri Oyunları — Özel Ders · Thorius",
  description: "9. sınıf coğrafya: CBS bileşenleri, GPS bileşenleri, CBS avantajları ve etik kuralları. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="mekansal-bilgi-teknolojileri" arkaPlan="dunya" baslik="Mekânsal Bilgi Teknolojileri" aciklama="9. sınıf Coğrafya, 2. ünite. CBS, GPS ve uzaktan algılamanın bileşenleri ve kavramları.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
