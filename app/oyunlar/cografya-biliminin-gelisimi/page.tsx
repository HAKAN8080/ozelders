import type { Metadata } from "next";

import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { SEKMELER } from "@/lib/games/icerik/cografya-biliminin-gelisimi";

export const metadata: Metadata = {
  title: "Coğrafya Biliminin Gelişimi Oyunları — ÖzelDersBul",
  description: "9. sınıf coğrafya: çağlar, zaman şeridi ve bilim insanları eşleştirme oyunları.",
  // TASLAK: öğretmen onayından sonra kaldırılacak
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <OyunSayfasi
      baslik="Coğrafya Biliminin Gelişimi"
      aciklama="9. sınıf Coğrafya, 1. ünite. Bilim insanlarını çağlarına yerleştir, zaman şeridinde sırala, katkılarıyla eşleştir."
    >
      <div className="rounded-md border border-[#e8a317] bg-[#fdf6e6] px-4 py-3 text-[15px] text-[#5a4210]">
        <strong>Taslak.</strong> Bu sayfa öğretmen onayı bekliyor; oyunlar listesinde görünmüyor.
      </div>
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
