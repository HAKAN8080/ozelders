import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/cografyanin-konusu-ve-bolumleri";

export const metadata: Metadata = {
  title: "Coğrafyanın Konusu ve Bölümleri Oyunları — ÖzelDersBul",
  description:
    "9. sınıf coğrafya: küreler, fiziki ve beşerî coğrafyanın alt dalları, kavramlar. Kategorilendirme ve eşleştirme oyunları, ücretsiz.",
};

export default function Page() {
  return (
    <OyunSayfasi
      baslik="Coğrafyanın Konusu ve Bölümleri"
      aciklama="9. sınıf Coğrafya, 1. ünite. Küreleri, coğrafyanın alt dallarını ve temel kavramları oynayarak tekrar et."
    >
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
