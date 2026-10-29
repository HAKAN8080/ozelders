/**
 * Oyun kartlarının görselleri. Tamamı ücretsiz Unsplash lisanslı (Unsplash+ değil);
 * fotoğrafçılar /oyunlar sayfasının altında anılır. Anahtar: oyun sayfasının slug'ı.
 */
export type Gorsel = {
  url: string;
  alt: string;
  by: string;
  byUrl: string;
  page: string;
};

export const GORSELLER: Record<string, Gorsel> = {
  "dunya-ulkeleri": {
    url: "https://images.unsplash.com/photo-1650526087824-163941841b52",
    alt: "Üzerinde renkli raptiyeler olan dünya haritası",
    by: "Leandro Barreto",
    byUrl: "https://unsplash.com/@lpbarreto",
    page: "https://unsplash.com/photos/a-map-of-the-world-with-pins-on-it-nomAp6_KVXU",
  },
};

export function gorselSrc(url: string, w = 640): string {
  return `${url}?fm=jpg&q=70&w=${w}&auto=format&fit=crop`;
}
