"use client";

import { HaritaOyunu } from "@/components/oyun/harita-oyunu";
import { TURKIYE_ILLERI } from "@/lib/games/tr-iller";

export function IllerOyunu() {
  return (
    <HaritaOyunu
      veri={TURKIYE_ILLERI}
      tumEtiketi="Tüm Türkiye"
      grupSorusu="Hangi bölge?"
      grupYaz={(g) => `${g} Bölgesi`}
      alanAdi="ili"
      kodModu={{
        baslik: "Plakadan bul",
        aciklama: "Plaka kodu verilen ili bul.",
        soru: (kod) => `${kod} plakalı il`,
      }}
      kesfetEtiketi={(a) => a.kod ?? ""}
      turSecenekleri={[10, 20, 0]}
    />
  );
}
