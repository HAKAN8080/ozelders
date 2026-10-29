import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/iklim-sistemi-basinc-ruzgar-yagis";

export const metadata: Metadata = {
  title: "İklim Sistemi: Basınç, Rüzgâr ve Yağış Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 3. ünite. Basınç merkezleri, rüzgâr çeşitleri, nemlilik ve yağış türleri, Türkiye'de basınç, rüzgâr ve yağış. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="iklim-sistemi-basinc-ruzgar-yagis" arkaPlan="kureler" baslik="İklim Sistemi: Basınç, Rüzgâr ve Yağış" aciklama="9. sınıf Coğrafya, 3. ünite. Basınç merkezleri, rüzgâr çeşitleri, nemlilik ve yağış türleri, Türkiye'de basınç, rüzgâr ve yağış.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
