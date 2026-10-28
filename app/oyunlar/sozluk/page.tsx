import type { Metadata } from "next";

import { KonuOyunlari } from "@/components/oyun/konu-oyunlari";
import { OyunSayfasi } from "@/components/oyun/oyun-sayfasi";
import { SEKMELER } from "@/lib/games/icerik/sozluk";

export const metadata: Metadata = {
  title: "Sözlük Oyunları — ÖzelDersBul",
  description: "9. sınıf Coğrafya, kitap sonu sözlüğü. Kitap boyunca geçen kavramların sözlükteki tanımları. Ücretsiz oyunlar.",
};

export default function Page() {
  return (
    <OyunSayfasi konu="sozluk" arkaPlan="tarih" baslik="Sözlük" aciklama="9. sınıf Coğrafya, kitap sonu sözlüğü. Kitap boyunca geçen kavramların sözlükteki tanımları.">
      <KonuOyunlari sekmeler={SEKMELER} />
    </OyunSayfasi>
  );
}
