/** Harita oyunlarında tıklanan her alan (il, ülke). */
export type HaritaAlan = {
  id: string;
  ad: string;
  /** Bölge ya da kıta. Filtre ve ipucu bunu kullanır. */
  grup: string;
  /** İkincil soru kodu (ör. plaka). */
  kod?: string;
  d: string;
  /** Etiket noktası. */
  cx: number;
  cy: number;
  /** Sınır kutusu: [x0, y0, x1, y1]. Bölge seçilince harita buna yakınlaşır. */
  bbox: [number, number, number, number];
  /** Birden çok gruba giren alanlar (ör. Rusya: Avrupa ve Asya). */
  ekGruplar?: string[];
  /** false ise çizilir ama soru olarak sorulmaz ve tıklanmaz. */
  oynanir?: boolean;
};

export type HaritaVerisi = {
  genislik: number;
  yukseklik: number;
  gruplar: string[];
  /** Grup seçilince gösterilecek kutu. Yoksa üyelerin kutularının birleşimi kullanılır. */
  grupKutulari?: Record<string, [number, number, number, number]>;
  alanlar: HaritaAlan[];
};
