import type { Metadata } from "next";

import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { IllerOyunu } from "@/app/oyunlar/turkiye-illeri/iller-oyunu";

export const metadata: Metadata = {
  title: "Türkiye'nin İlleri Harita Oyunu — ÖzelDersBul",
  description: "81 ili haritada bul: ad ya da plaka koduyla, tüm Türkiye ya da bölge bölge. Ücretsiz coğrafya oyunu.",
};

export default function TurkiyeIlleriPage() {
  return (
    <OyunSayfasi konu="turkiye-illeri"
      arkaPlan="harita"
      baslik="Türkiye'nin İlleri"
      aciklama="81 ili haritada bul. İlk denemede 10, ikincide 5, üçüncüde 2 puan. Takılırsan ipucu ilin bölgesini gösterir."
    >
      <IllerOyunu />
    </OyunSayfasi>
  );
}
