"use client";

/** Öğrencinin katıldığı sınıf: tarayıcıda tutulur (giriş gerekmez). */
export type SinifKaydi = { kod: string; ad: string; ogrenci: string };

const ANAHTAR = "ozd-sinif";

export function sinifOku(): SinifKaydi | null {
  try {
    const v = window.localStorage.getItem(ANAHTAR);
    if (!v) return null;
    const x = JSON.parse(v) as SinifKaydi;
    return x && typeof x.kod === "string" && typeof x.ogrenci === "string" ? x : null;
  } catch {
    return null;
  }
}

export function sinifYaz(k: SinifKaydi | null) {
  try {
    if (k) window.localStorage.setItem(ANAHTAR, JSON.stringify(k));
    else window.localStorage.removeItem(ANAHTAR);
    window.dispatchEvent(new Event("ozd-sinif"));
  } catch {
    /* depolama kapalı olabilir */
  }
}
