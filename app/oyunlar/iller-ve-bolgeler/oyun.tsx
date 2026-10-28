"use client";

import { KategoriOyunu } from "@/components/oyun/kategori-oyunu";
import { TURKIYE_ILLERI_LISTE } from "@/lib/games/tr-iller-liste";

const BOLGELER = ["Marmara", "Ege", "Akdeniz", "İç Anadolu", "Karadeniz", "Doğu Anadolu", "Güneydoğu Anadolu"];
const OGELER = TURKIYE_ILLERI_LISTE.map((il) => ({ id: il.plaka, ad: il.ad, kategori: il.bolge }));

export function IllerVeBolgelerOyunu() {
  return (
    <KategoriOyunu
      kategoriler={BOLGELER}
      ogeler={OGELER}
      kategoriYaz={(b) => `${b} Bölgesi`}
      yonerge="Her ili bulunduğu coğrafi bölgenin kutusuna yerleştir. Her turda iller karışık gelir, her bölgeden eşit sayıda il seçilir."
      turSecenekleri={[14, 21, 35]}
    />
  );
}
