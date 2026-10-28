import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/bolge-ve-bolge-sinirlari";

export const metadata: Metadata = {
  title: "Bölge ve Bölge Sınırı Oyunları — ÖzelDersBul",
  description: "9. sınıf Coğrafya, 7. ünite. Bölge belirleme kriterleri, şekilsel ve işlevsel bölgeler, kriterlere göre bölge sınırları ve Avrupa Birliği örneğiyle bölge sınırlarındaki değişim. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="bolge-ve-bolge-sinirlari" arkaPlan="pusula" baslik="Bölge ve Bölge Sınırı" aciklama="9. sınıf Coğrafya, 7. ünite. Bölge belirleme kriterleri, şekilsel ve işlevsel bölgeler, kriterlere göre bölge sınırları ve Avrupa Birliği örneğiyle bölge sınırlarındaki değişim.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
