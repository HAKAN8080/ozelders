import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/hava-olaylari";

export const metadata: Metadata = {
  title: "Hava Olayları Oyunları — ÖzelDersBul",
  description: "9. sınıf Coğrafya, 3. ünite. Hava olayları, ölçüm araçları, aşırı hava olayları, hava tahmini ve halk meteorolojisi. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="hava-olaylari" arkaPlan="kureler" baslik="Hava Olayları" aciklama="9. sınıf Coğrafya, 3. ünite. Hava olayları, ölçüm araçları, aşırı hava olayları, hava tahmini ve halk meteorolojisi.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
