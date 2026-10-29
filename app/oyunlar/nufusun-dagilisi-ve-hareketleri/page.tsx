import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/nufusun-dagilisi-ve-hareketleri";

export const metadata: Metadata = {
  title: "Nüfusun Dağılışı ve Hareketleri Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 4. ünite. Nüfusun dağılışını etkileyen doğal ve beşerî faktörler, göç türleri ve tarihten günümüze göç örnekleri. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="nufusun-dagilisi-ve-hareketleri" arkaPlan="dunya" baslik="Nüfusun Dağılışı ve Hareketleri" aciklama="9. sınıf Coğrafya, 4. ünite. Nüfusun dağılışını etkileyen doğal ve beşerî faktörler, göç türleri ve tarihten günümüze göç örnekleri.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
