import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/harita-ve-olcek";

export const metadata: Metadata = {
  title: "Harita ve Ölçek Oyunları — ÖzelDersBul",
  description: "9. sınıf coğrafya: harita, kroki, harita elemanları, projeksiyon türleri, büyük ve küçük ölçek, ölçek hesapları. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi arkaPlan="pusula" baslik="Harita ve Ölçek" aciklama="9. sınıf Coğrafya, 2. ünite. Harita kavramları, harita elemanları, projeksiyonlar ve ölçek hesapları.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
