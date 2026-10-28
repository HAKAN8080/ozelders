/** Oyun sayfalarının listesi: /oyunlar sayfası ve ilerleme ekranları kullanır. */

export type Oyun = { href: string; baslik: string; aciklama: string; etiket: string };

/** Oyunlar ders ve üniteye göre gruplu. Yeni konu eklenince buraya bir satır eklenir. */
export const GRUPLAR: { baslik: string; alt?: string; oyunlar: Oyun[] }[] = [
  {
    baslik: "9. Sınıf Coğrafya · 1. Ünite",
    alt: "Coğrafyanın Doğası",
    oyunlar: [
      {
        href: "/oyunlar/cografyanin-konusu-ve-bolumleri",
        baslik: "Coğrafyanın Konusu ve Bölümleri",
        aciklama: "Küreler, fiziki ve beşerî coğrafyanın alt dalları, temel kavramlar.",
        etiket: "7 oyun",
      },
      {
        href: "/oyunlar/cografya-biliminin-gelisimi",
        baslik: "Coğrafya Biliminin Gelişimi",
        aciklama: "Bilim insanlarını çağına yerleştir, zaman şeridinde sırala, katkılarıyla eşleştir.",
        etiket: "5 oyun",
      },
    ],
  },
  {
    baslik: "9. Sınıf Coğrafya · 2. Ünite",
    alt: "Mekânsal Bilgi Teknolojileri",
    oyunlar: [
      {
        href: "/oyunlar/harita-ve-olcek",
        baslik: "Harita ve Ölçek",
        aciklama: "Harita kavramları, elemanlar, projeksiyonlar, büyük ve küçük ölçek, ölçek hesapları.",
        etiket: "8 oyun",
      },
      {
        href: "/oyunlar/koordinatlar-ve-saat-dilimleri",
        baslik: "Koordinatlar ve Saat Dilimleri",
        aciklama: "Haritada koordinat bul, Irma kasırgasının rotasını çiz, saat dilimi hesapları.",
        etiket: "6 oyun",
      },
      {
        href: "/oyunlar/haritalama-teknikleri-ve-yer-sekilleri",
        baslik: "Haritalama Teknikleri ve Yer Şekilleri",
        aciklama: "Koroplet, korokromatik, akış, kartogram; topoğrafya haritasında izohips okuma; yer şekilleri.",
        etiket: "10 oyun",
      },
      {
        href: "/oyunlar/turkiyenin-cografi-konumu",
        baslik: "Türkiye'nin Coğrafi Konumu",
        aciklama: "Mutlak ve göreceli konum, kara ve deniz komşuları, Mavi Vatan ve Gök Vatan.",
        etiket: "7 oyun",
      },
      {
        href: "/oyunlar/mekansal-bilgi-teknolojileri",
        baslik: "Mekânsal Bilgi Teknolojileri",
        aciklama: "CBS ve GPS bileşenleri, CBS'nin avantajları ve etik kuralları.",
        etiket: "5 oyun",
      },
    ],
  },
  {
    baslik: "Harita oyunları",
    alt: "Her sınıf için",
    oyunlar: [
      {
        href: "/oyunlar/turkiye-illeri",
        baslik: "Türkiye'nin İlleri",
        aciklama: "81 ili ad ya da plaka koduyla haritada bul. Bölge bölge de oynanır.",
        etiket: "Harita",
      },
      {
        href: "/oyunlar/dunya-ulkeleri",
        baslik: "Dünya'da Ülkeler",
        aciklama: "196 ülkeyi dünya haritasında bul. Kıta seçince harita yakınlaşır.",
        etiket: "Harita",
      },
      {
        href: "/oyunlar/iller-ve-bolgeler",
        baslik: "İller ve Bölgeleri",
        aciklama: "İlleri coğrafi bölgelerine yerleştir.",
        etiket: "Sürükle-bırak",
      },
      {
        href: "/oyunlar/ulkeler-ve-kitalar",
        baslik: "Ülkeler ve Kıtaları",
        aciklama: "Ülkeleri bulundukları kıtaya yerleştir.",
        etiket: "Sürükle-bırak",
      },
    ],
  },
];

/** "/oyunlar/harita-ve-olcek" ya da "harita-ve-olcek" → başlık */
export function konuBasligi(konu: string): string {
  const slug = konu.replace(/^\/oyunlar\//, "");
  for (const g of GRUPLAR) for (const o of g.oyunlar) if (o.href === `/oyunlar/${slug}`) return o.baslik;
  return slug;
}
