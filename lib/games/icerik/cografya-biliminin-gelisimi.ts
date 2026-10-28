/**
 * 9. sınıf Coğrafya — 1.1.3 Coğrafya Biliminin Gelişimi
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.24–27.
 *
 * kaynak alanı:
 *   "kitap"       → bilgi ders kitabında birebir geçiyor (sayfa belirtilir)
 *   "kitap-disi"  → kitap öğrenciden araştırmasını istiyor; genel kabul gören bilgi,
 *                   (Hakan Uğur onayladı, 28.10.2026)
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";
import { GELISIMI_EK } from "@/lib/games/icerik/ek-bosluk-bulmaca";

export type Kaynak = { tur: "kitap"; sayfa: number } | { tur: "kitap-disi" };

export const CAGLAR = ["Eski Çağ", "Orta Çağ", "Yeni Çağ", "Yakın Çağ", "Cumhuriyet Dönemi"] as const;
export type Cag = (typeof CAGLAR)[number];

export type Bilgin = {
  id: string;
  ad: string;
  cag: Cag;
  /** Kitaptaki tarih şeridinde (s.26-27) verilen yıllar. */
  yillar?: string;
  /** Sıralama için doğum yılı (MÖ negatif). Yalnız kitapta yılı verilenlerde var. */
  dogum?: number;
  /** Kim ne yaptı? oyunundaki katkı/eser. */
  katki?: string;
  katkiKaynak?: Kaynak;
};

export const BILGINLER: Bilgin[] = [
  // Eski Çağ — s.24
  {
    id: "eratosthenes",
    ad: "Eratosthenes",
    cag: "Eski Çağ",
    yillar: "MÖ 276 – MÖ 194",
    dogum: -276,
    katki: "“Coğrafya” kavramını ilk kez kullandı",
    katkiKaynak: { tur: "kitap", sayfa: 24 },
  },
  {
    id: "strabon",
    ad: "Amasyalı Strabon",
    cag: "Eski Çağ",
    yillar: "MÖ 64 – MS 24",
    dogum: -64,
    katki: "17 ciltlik Geographika adlı eseri yazdı",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "batlamyus",
    ad: "İskenderiyeli Batlamyus",
    cag: "Eski Çağ",
    yillar: "100 – 170",
    dogum: 100,
    katki: "Coğrafya Kılavuzu'nda yerleri enlem ve boylamla gösterdi",
    katkiKaynak: { tur: "kitap-disi" },
  },
  { id: "tales", ad: "Tales", cag: "Eski Çağ" },
  { id: "heredot", ad: "Heredot", cag: "Eski Çağ" },
  { id: "aristoteles", ad: "Aristoteles", cag: "Eski Çağ" },

  // Orta Çağ — s.24
  {
    id: "harizmi",
    ad: "Harizmi",
    cag: "Orta Çağ",
    katki: "Suretü'l-Arz (Yeryüzünün Şekli) adlı eseri yazdı",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "biruni",
    ad: "Biruni",
    cag: "Orta Çağ",
    yillar: "973 – 1048",
    dogum: 973,
    katki: "Dünya'nın yarıçapını ölçtü",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "ibni-haldun",
    ad: "İbni Haldun",
    cag: "Orta Çağ",
    katki: "Mukaddime'de iklimin insan ve toplum üzerindeki etkisini işledi",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "idrisi",
    ad: "Muhammed İdrisi",
    cag: "Orta Çağ",
    yillar: "1100 – 1166",
    dogum: 1100,
    katki: "Sicilya Kralı II. Roger için dünya haritası çizdi",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "ibni-battuta",
    ad: "İbni Battuta",
    cag: "Orta Çağ",
    yillar: "1304 – 1369",
    dogum: 1304,
    katki: "Gezdiği ülkeleri seyahatnamesinde anlattı",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "mesudi",
    ad: "Mesudi",
    cag: "Orta Çağ",
    katki: "Mürucü'z-Zeheb adlı eseri yazdı",
    katkiKaynak: { tur: "kitap-disi" },
  },

  // Yeni Çağ — s.24
  { id: "kolomb", ad: "Kristof Kolomb", cag: "Yeni Çağ", katki: "1492'de Amerika kıtasına ulaştı", katkiKaynak: { tur: "kitap-disi" } },
  {
    id: "magellan",
    ad: "Magellan",
    cag: "Yeni Çağ",
    katki: "Dünya'nın çevresini dolaşan ilk seferi başlattı",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "piri-reis",
    ad: "Piri Reis",
    cag: "Yeni Çağ",
    yillar: "1470 – 1554",
    dogum: 1470,
    katki: "Kitab-ı Bahriye'yi yazdı, Amerika kıyılarını da gösteren dünya haritasını çizdi",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "ortelius",
    ad: "Ortelius",
    cag: "Yeni Çağ",
    yillar: "1527 – 1598",
    dogum: 1527,
    katki: "İlk modern atlas kabul edilen Theatrum Orbis Terrarum'u hazırladı",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "katip-celebi",
    ad: "Kâtip Çelebi",
    cag: "Yeni Çağ",
    yillar: "1609 – 1657",
    dogum: 1609,
    katki: "Cihannüma adlı eseri yazdı",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "evliya-celebi",
    ad: "Evliya Çelebi",
    cag: "Yeni Çağ",
    katki: "Seyahatname adlı eseriyle coğrafyaya katkı verdi",
    katkiKaynak: { tur: "kitap", sayfa: 24 },
  },

  // Yakın Çağ — s.24-25 ve tarih şeridi s.27
  {
    id: "humboldt",
    ad: "A. von Humboldt",
    cag: "Yakın Çağ",
    yillar: "1769 – 1859",
    dogum: 1769,
    katki: "Kosmos adlı eseriyle modern fiziki coğrafyanın kurucularından oldu",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "ritter",
    ad: "Carl Ritter",
    cag: "Yakın Çağ",
    yillar: "1779 – 1859",
    dogum: 1779,
    katki: "İnsan ile yeryüzü ilişkisini inceleyen Erdkunde adlı eseri yazdı",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "ratzel",
    ad: "Friedrich Ratzel",
    cag: "Yakın Çağ",
    katki: "Antropocoğrafya (beşerî coğrafya) kavramını geliştirdi",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "blache",
    ad: "P. Vidal de la Blache",
    cag: "Yakın Çağ",
    yillar: "1845 – 1918",
    dogum: 1845,
    katki: "Olasılıkçılık (posibilizm) yaklaşımını geliştirdi",
    katkiKaynak: { tur: "kitap-disi" },
  },
  {
    id: "sauer",
    ad: "C. O. Sauer",
    cag: "Yakın Çağ",
    yillar: "1889 – 1975",
    dogum: 1889,
    katki: "Kültürel peyzaj kavramını geliştirdi",
    katkiKaynak: { tur: "kitap-disi" },
  },

  // Cumhuriyet Dönemi — s.25
  { id: "darkot", ad: "Besim Darkot", cag: "Cumhuriyet Dönemi" },
  { id: "duran", ad: "Faik Sabri Duran", cag: "Cumhuriyet Dönemi" },
  { id: "izbirak", ad: "Reşat İzbırak", cag: "Cumhuriyet Dönemi" },
  { id: "erinc", ad: "Sırrı Erinç", cag: "Cumhuriyet Dönemi" },
];

/** Çağlarda coğrafyanın gelişmesinde rol oynayan etkenler ve ele alınan konular — tamamı kitaptan (s.24). */
export const GELISMELER: { id: string; ad: string; cag: Cag }[] = [
  { id: "g1", ad: "Yazının icadı", cag: "Eski Çağ" },
  { id: "g2", ad: "Kentlerin kurulmasıyla ilk medeniyetlerin ortaya çıkması", cag: "Eski Çağ" },
  { id: "g3", ad: "Dünya'nın şekli ve boyutlarının ele alınması", cag: "Eski Çağ" },
  { id: "g4", ad: "Koordinat sisteminin ve yönlerin ele alınması", cag: "Eski Çağ" },
  { id: "g5", ad: "İpek Yolu ve Baharat Yolu ticareti", cag: "Orta Çağ" },
  { id: "g6", ad: "Büyük göç hareketleri", cag: "Orta Çağ" },
  { id: "g7", ad: "Namaz vakitleri, oruç süresi ve hac yollarının belirlenmesi ihtiyacı", cag: "Orta Çağ" },
  { id: "g8", ad: "Rönesans ve reform hareketleri", cag: "Yeni Çağ" },
  { id: "g9", ad: "Sömürgecilik hareketleri", cag: "Yeni Çağ" },
  { id: "g10", ad: "Fransız İhtilali ve Sanayi Devrimi", cag: "Yakın Çağ" },
  { id: "g11", ad: "Bilimsel amaçlı keşif gezileri", cag: "Yakın Çağ" },
  { id: "g12", ad: "Coğrafyanın yöntemlerinin oluşturulması", cag: "Yakın Çağ" },
];

export const SEKMELER: KonuSekmesi[] = [
  {
    id: "cag",
    baslik: "Hangi çağ?",
    alt: "Kişi ve gelişmeleri çağına yerleştir",
    tur: "kategori",
    kategoriler: [...CAGLAR],
    ogeler: [
      ...BILGINLER.map((b) => ({ id: b.id, ad: b.ad, kategori: b.cag })),
      ...GELISMELER.map((g) => ({ id: g.id, ad: g.ad, kategori: g.cag })),
    ],
    yonerge:
      "Coğrafya biliminin gelişimine katkı veren bilim insanlarını ve coğrafyanın gelişmesinde rol oynayan etkenleri ait oldukları çağa yerleştir.",
    turSecenekleri: [10, 15, 25],
  },
  {
    id: "sira",
    baslik: "Zaman şeridi",
    alt: "Bilim insanlarını kronolojik sıraya diz",
    tur: "siralama",
    ogeler: BILGINLER.filter((b) => b.dogum !== undefined && b.yillar).map((b) => ({
      id: b.id,
      ad: b.ad,
      anahtar: b.dogum as number,
      etiket: b.yillar as string,
    })),
    yonerge: "Ders kitabındaki tarih şeridinde yer alan bilim insanlarını yaşadıkları döneme göre en eskiden en yeniye sırala.",
    uclar: ["En eski", "En yeni"],
    turSecenekleri: [5, 8, 0],
  },
  {
    id: "eslestir",
    baslik: "Kim ne yaptı?",
    alt: "Bilim insanını katkısıyla eşleştir",
    tur: "eslestirme",
    ciftler: BILGINLER.filter((b) => b.katki).map((b) => ({ id: b.id, sol: b.ad, sag: b.katki as string })),
    solBaslik: "Bilim insanı",
    sagBaslik: "Katkısı",
    yonerge: "Coğrafya biliminin gelişimine katkı veren bilim insanlarını yaptıkları çalışmalarla eşleştir.",
    turSecenekleri: [5, 8, 100],
  },
  ...GELISIMI_EK,
];
