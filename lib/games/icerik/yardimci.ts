import type { KategoriOgesi } from "@/components/oyun/kategori-oyunu";
import type { EslestirmeCifti } from "@/components/oyun/eslestirme-oyunu";

export const slug = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/[^a-z0-9çğıöşüâîû]+/g, "-")
    .replace(/^-|-$/g, "");

/** { "Kategori": ["öğe", ...] } → kategori oyunu öğeleri */
export function kategoriOgeleri(gruplar: Record<string, string[]>): KategoriOgesi[] {
  return Object.entries(gruplar).flatMap(([kategori, ogeler]) =>
    ogeler.map((ad) => ({ id: `${slug(kategori)}--${slug(ad)}`, ad, kategori })),
  );
}

/** [["sol", "sağ"], ...] → eşleştirme çiftleri */
export function ciftler(liste: [string, string][]): EslestirmeCifti[] {
  return liste.map(([sol, sag]) => ({ id: slug(sol), sol, sag }));
}
