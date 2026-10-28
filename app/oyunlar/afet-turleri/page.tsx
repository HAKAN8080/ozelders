import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/afet-turleri";

export const metadata: Metadata = {
  title: "Afet Türleri Oyunları — ÖzelDersBul",
  description: "9. sınıf Coğrafya, 6. ünite. Afetlerin oluşum nedenine göre sınıflandırılması, dünyada ve Türkiye'de afetler. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="afet-turleri" arkaPlan="kureler" baslik="Afet Türleri" aciklama="9. sınıf Coğrafya, 6. ünite. Afetlerin oluşum nedenine göre sınıflandırılması, dünyada ve Türkiye'de afetler.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
