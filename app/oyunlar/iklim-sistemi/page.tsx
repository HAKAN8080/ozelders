import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/iklim-sistemi";

export const metadata: Metadata = {
  title: "İklim Sistemi: Bileşenler Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 3. ünite. İklim sisteminin beş bileşeni, değişkenleri ve atmosferin katmanları. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="iklim-sistemi" arkaPlan="kureler" baslik="İklim Sistemi: Bileşenler" aciklama="9. sınıf Coğrafya, 3. ünite. İklim sisteminin beş bileşeni, değişkenleri ve atmosferin katmanları.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
