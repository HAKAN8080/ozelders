import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/nufus-politikalari";

export const metadata: Metadata = {
  title: "Nüfus Politikaları Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 4. ünite. Nüfus politikası kavramı, ülkelerin uyguladığı farklı nüfus politikaları ve Türkiye'nin nüfus politikaları. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="nufus-politikalari" arkaPlan="dunya" baslik="Nüfus Politikaları" aciklama="9. sınıf Coğrafya, 4. ünite. Nüfus politikası kavramı, ülkelerin uyguladığı farklı nüfus politikaları ve Türkiye'nin nüfus politikaları.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
