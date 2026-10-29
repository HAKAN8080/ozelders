import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/butuncul-afet-yonetimi";

export const metadata: Metadata = {
  title: "Bütüncül Afet Yönetimi Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 6. ünite. Bütüncül afet yönetiminin aşamaları, savunmasız gruplar, uluslararası iş birliği ve mekânsal bilgi teknolojileri. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="butuncul-afet-yonetimi" arkaPlan="kureler" baslik="Bütüncül Afet Yönetimi" aciklama="9. sınıf Coğrafya, 6. ünite. Bütüncül afet yönetiminin aşamaları, savunmasız gruplar, uluslararası iş birliği ve mekânsal bilgi teknolojileri.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
