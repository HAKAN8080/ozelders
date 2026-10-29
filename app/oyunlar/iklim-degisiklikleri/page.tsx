import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/iklim-degisiklikleri";

export const metadata: Metadata = {
  title: "İklim Sisteminde Yaşanan Değişiklikler Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 3. ünite. Küresel iklim değişikliğinin doğal ve beşerî nedenleri, gözlenen etkileri ve geleceğe yönelik öngörüler. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="iklim-degisiklikleri" arkaPlan="kureler" baslik="İklim Sisteminde Yaşanan Değişiklikler" aciklama="9. sınıf Coğrafya, 3. ünite. Küresel iklim değişikliğinin doğal ve beşerî nedenleri, gözlenen etkileri ve geleceğe yönelik öngörüler.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
