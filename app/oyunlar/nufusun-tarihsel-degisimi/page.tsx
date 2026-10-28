import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/nufusun-tarihsel-degisimi";

export const metadata: Metadata = {
  title: "Nüfusun Tarihsel Değişimi ve Geleceği Oyunları — ÖzelDersBul",
  description: "9. sınıf Coğrafya, 4. ünite. Dünya nüfusunun üç büyük sıçrama dönemi, 1950 sonrası hızlı nüfuslanma ve nüfusun geleceğine dair tahminler. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="nufusun-tarihsel-degisimi" arkaPlan="dunya" baslik="Nüfusun Tarihsel Değişimi ve Geleceği" aciklama="9. sınıf Coğrafya, 4. ünite. Dünya nüfusunun üç büyük sıçrama dönemi, 1950 sonrası hızlı nüfuslanma ve nüfusun geleceğine dair tahminler.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
