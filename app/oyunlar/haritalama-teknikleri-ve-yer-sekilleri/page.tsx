import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/haritalama-ve-yer-sekilleri";

export const metadata: Metadata = {
  title: "Haritalama Teknikleri ve Yer Şekilleri Oyunları — ÖzelDersBul",
  description: "9. sınıf coğrafya: korokromatik, koroplet, izoplet, noktalama, akış, kartogram haritalar; izohips; yer şekilleri. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="haritalama-teknikleri-ve-yer-sekilleri" arkaPlan="harita" baslik="Haritalama Teknikleri ve Yer Şekilleri" aciklama="9. sınıf Coğrafya, 2. ünite. Haritalama teknikleri, izohipsler ve topoğrafya haritalarındaki yer şekilleri.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
