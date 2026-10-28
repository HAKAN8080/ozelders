"use client";

import { HaritaOyunu } from "@/components/oyun/harita-oyunu";
import { DUNYA_ULKELERI } from "@/lib/games/dunya-ulkeler";

export function UlkelerOyunu() {
  return (
    <HaritaOyunu
      veri={DUNYA_ULKELERI}
      tumEtiketi="Tüm Dünya"
      grupSorusu="Hangi kıta?"
      grupYaz={(g) => g}
      alanAdi="ülkeyi"
      turSecenekleri={[10, 20, 0]}
      etiketBoyutu={7.5}
    />
  );
}
