import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/tehlike-risk-ve-afet";

export const metadata: Metadata = {
  title: "Tehlike, Risk ve Afet Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 6. ünite. Tehlike, risk, maruziyet ve afet kavramları ile aralarındaki ilişki. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="tehlike-risk-ve-afet" arkaPlan="kureler" baslik="Tehlike, Risk ve Afet" aciklama="9. sınıf Coğrafya, 6. ünite. Tehlike, risk, maruziyet ve afet kavramları ile aralarındaki ilişki.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
