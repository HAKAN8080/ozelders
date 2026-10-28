import type { Metadata } from "next";

import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { UlkelerOyunu } from "@/app/oyunlar/dunya-ulkeleri/ulkeler-oyunu";

export const metadata: Metadata = {
  title: "Dünya'da Ülkeler Harita Oyunu — ÖzelDersBul",
  description: "195 ülkeyi dünya haritasında bul. Kıta kıta oyna, harita seçtiğin kıtaya yakınlaşır. Ücretsiz coğrafya oyunu.",
};

export default function DunyaUlkeleriPage() {
  return (
    <OyunSayfasi
      baslik="Dünya'da Ülkeler"
      aciklama="Ülkeleri dünya haritasında bul. Kıta seçersen harita o kıtaya yakınlaşır; çok küçük ülkeler yuvarlak işaretle gösterilir."
    >
      <UlkelerOyunu />
    </OyunSayfasi>
  );
}
