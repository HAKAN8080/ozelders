import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/ekonomik-faaliyetler";

export const metadata: Metadata = {
  title: "Ekonomik Faaliyetleri Etkileyen Coğrafi Faktörler Oyunları — ÖzelDersBul",
  description: "9. sınıf Coğrafya, 5. ünite. Ekonomik faaliyetleri etkileyen doğal faktörler (konum, iklim, topoğrafya, su, toprak, bitki örtüsü) ve beşerî faktörler (nüfus, iş gücü, sermaye, teknoloji, devlet, ulaşım). Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="ekonomik-faaliyetler" arkaPlan="harita" baslik="Ekonomik Faaliyetleri Etkileyen Coğrafi Faktörler" aciklama="9. sınıf Coğrafya, 5. ünite. Ekonomik faaliyetleri etkileyen doğal faktörler (konum, iklim, topoğrafya, su, toprak, bitki örtüsü) ve beşerî faktörler (nüfus, iş gücü, sermaye, teknoloji, devlet, ulaşım).">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
