import type { Metadata } from "next";

import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { IllerVeBolgelerOyunu } from "@/app/oyunlar/iller-ve-bolgeler/oyun";

export const metadata: Metadata = {
  title: "İller ve Bölgeleri Oyunu — ÖzelDersBul",
  description: "İlleri coğrafi bölgelerine yerleştir. Sürükle-bırak coğrafya oyunu, ücretsiz.",
};

export default function Page() {
  return (
    <OyunSayfasi baslik="İller ve Bölgeleri" aciklama="Hangi il hangi bölgede? Kartları doğru bölgeye yerleştir.">
      <IllerVeBolgelerOyunu />
    </OyunSayfasi>
  );
}
