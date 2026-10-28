"use client";

import { KategoriOyunu } from "@/components/oyun/kategori-oyunu";
import { DUNYA_ULKELERI_LISTE } from "@/lib/games/dunya-ulkeler-liste";

const KITALAR = ["Avrupa", "Asya", "Afrika", "Kuzey Amerika", "Güney Amerika", "Okyanusya"];

// Birden çok kıtaya yayılan ya da kaynaklara göre kıtası değişen ülkeler bu oyunda sorulmaz
const HARIC = new Set(["RUS", "TUR", "KAZ", "AZE", "GEO", "ARM", "EGY", "IDN", "TLS", "PAN"]);

const OGELER = DUNYA_ULKELERI_LISTE.filter((u) => !HARIC.has(u.id) && !u.ekKitalar).map((u) => ({
  id: u.id,
  ad: u.ad,
  kategori: u.kita,
}));

export function UlkelerVeKitalarOyunu() {
  return (
    <KategoriOyunu
      kategoriler={KITALAR}
      ogeler={OGELER}
      yonerge="Her ülkeyi bulunduğu kıtanın kutusuna yerleştir. Birden çok kıtaya yayılan ülkeler (Türkiye, Rusya gibi) bu oyunda sorulmaz."
      turSecenekleri={[12, 24, 36]}
    />
  );
}
