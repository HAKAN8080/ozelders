import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/iklim-sistemi-sicaklik";

export const metadata: Metadata = {
  title: "İklim Sistemi: Sıcaklık Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 3. ünite. Sıcaklığın dağılışını etkileyen faktörler, mevsimler, iklim ve sıcaklık kuşakları, Dünya'da ve Türkiye'de sıcaklık. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="iklim-sistemi-sicaklik" arkaPlan="kureler" baslik="İklim Sistemi: Sıcaklık" aciklama="9. sınıf Coğrafya, 3. ünite. Sıcaklığın dağılışını etkileyen faktörler, mevsimler, iklim ve sıcaklık kuşakları, Dünya'da ve Türkiye'de sıcaklık.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
