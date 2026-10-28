import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/koordinatlar-ve-saat";

export const metadata: Metadata = {
  title: "Koordinatlar ve Saat Dilimleri Oyunları — ÖzelDersBul",
  description: "9. sınıf coğrafya: enlem, boylam, yerel saat, ulusal saat, saat dilimi hesapları, tarih değiştirme çizgisi. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi arkaPlan="dunya" baslik="Koordinatlar ve Saat Dilimleri" aciklama="9. sınıf Coğrafya, 2. ünite. Enlem, boylam, yerel ve ulusal saat, saat dilimleri, tarih değiştirme çizgisi.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
