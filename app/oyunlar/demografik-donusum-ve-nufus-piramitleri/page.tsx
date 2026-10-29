import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/demografik-donusum-ve-nufus-piramitleri";

export const metadata: Metadata = {
  title: "Demografik Dönüşüm Süreci ve Nüfus Piramitleri Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 4. ünite. Nüfus piramitlerinin okunması ve demografik dönüşüm modelinin beş aşaması. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="demografik-donusum-ve-nufus-piramitleri" arkaPlan="dunya" baslik="Demografik Dönüşüm Süreci ve Nüfus Piramitleri" aciklama="9. sınıf Coğrafya, 4. ünite. Nüfus piramitlerinin okunması ve demografik dönüşüm modelinin beş aşaması.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
