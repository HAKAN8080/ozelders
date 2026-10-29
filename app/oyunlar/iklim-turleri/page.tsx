import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/iklim-turleri";

export const metadata: Metadata = {
  title: "İklim Türleri Oyunları — Özel Ders · Thorius",
  description: "9. sınıf Coğrafya, 3. ünite. Dünya'daki sıcak, ılıman ve soğuk iklim türleri, Türkiye'nin iklimleri ve sıcaklık-yağış grafiklerinin okunması. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="iklim-turleri" arkaPlan="kureler" baslik="İklim Türleri" aciklama="9. sınıf Coğrafya, 3. ünite. Dünya'daki sıcak, ılıman ve soğuk iklim türleri, Türkiye'nin iklimleri ve sıcaklık-yağış grafiklerinin okunması.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
