import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/turkiyenin-konumu";

export const metadata: Metadata = {
  title: "Türkiye'nin Coğrafi Konumu Oyunları — ÖzelDersBul",
  description: "9. sınıf coğrafya: Türkiye'nin mutlak ve göreceli konumu, kara ve deniz komşuları, Mavi Vatan, Gök Vatan. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="turkiyenin-cografi-konumu" arkaPlan="harita" baslik="Türkiye'nin Coğrafi Konumu" aciklama="9. sınıf Coğrafya, 2. ünite. Mutlak ve göreceli konum, komşular, Mavi Vatan ve Gök Vatan.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
