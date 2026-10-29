import type { Metadata } from "next";

import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { UlkelerVeKitalarOyunu } from "@/app/oyunlar/ulkeler-ve-kitalar/oyun";

export const metadata: Metadata = {
  title: "Ülkeler ve Kıtaları Oyunu — Özel Ders · Thorius",
  description: "Ülkeleri kıtalarına yerleştir. Sürükle-bırak coğrafya oyunu, ücretsiz.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="ulkeler-ve-kitalar" arkaPlan="dunya" baslik="Ülkeler ve Kıtaları" aciklama="Hangi ülke hangi kıtada? Kartları doğru kıtaya yerleştir.">
      <UlkelerVeKitalarOyunu />
    </OyunSayfasi>
  );
}
