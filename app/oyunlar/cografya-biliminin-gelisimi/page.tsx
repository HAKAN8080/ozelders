import type { Metadata } from "next";

import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { SEKMELER } from "@/lib/games/icerik/cografya-biliminin-gelisimi";

export const metadata: Metadata = {
  title: "Coğrafya Biliminin Gelişimi Oyunları — ÖzelDersBul",
  description: "9. sınıf coğrafya: çağlar, zaman şeridi ve bilim insanları eşleştirme oyunları.",
};

export default function Page() {
  return (
    <OyunSayfasi
      arkaPlan="tarih"
      baslik="Coğrafya Biliminin Gelişimi"
      aciklama="9. sınıf Coğrafya, 1. ünite. Bilim insanlarını çağlarına yerleştir, zaman şeridinde sırala, katkılarıyla eşleştir."
    >
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
