/**
 * 9. sınıf Coğrafya — 1.1.1 Coğrafya Biliminin Konusu ve Bölümleri
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.16–19. Tüm bilgiler kitaptan.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";
import { KONUSU_EK } from "@/lib/games/icerik/ek-bosluk-bulmaca";

const KURELER = ["Taş küre", "Hava küre", "Su küre", "Buz küre", "Yaşam küre"];

const KURE_OGELERI: [string, string][] = [
  ["Kayaçlar", "Taş küre"],
  ["Yer şekilleri", "Taş küre"],
  ["Topraklar", "Taş küre"],
  ["Litosfer", "Taş küre"],
  ["Dünya'yı saran gazlar", "Hava küre"],
  ["Atmosfer", "Hava küre"],
  ["Denizler", "Su küre"],
  ["Göller", "Su küre"],
  ["Akarsular", "Su küre"],
  ["Yer altı suları", "Su küre"],
  ["Hidrosfer", "Su küre"],
  ["Donmuş topraklar", "Buz küre"],
  ["Buzullar", "Buz küre"],
  ["Sürekli karla kaplı alanlar", "Buz küre"],
  ["Kriyosfer", "Buz küre"],
  ["Canlıların hayati faaliyetlerini sürdürdüğü alanlar", "Yaşam küre"],
  ["Biyosfer", "Yaşam küre"],
];

type AltDal = { ad: string; bolum: "Fiziki coğrafya" | "Beşerî coğrafya"; diger?: string; inceler: string; bilimler: string };

const ALT_DALLAR: AltDal[] = [
  {
    ad: "Jeomorfoloji",
    diger: "Yer Şekilleri Bilimi",
    bolum: "Fiziki coğrafya",
    inceler: "Litosfer unsurlarını, yer şekillerini ve bunların oluşum süreçleri ile dağılışını inceler",
    bilimler: "Jeoloji, litoloji, petrografi, jeofizik, kimya",
  },
  {
    ad: "Klimatoloji",
    diger: "İklim Bilimi",
    bolum: "Fiziki coğrafya",
    inceler: "Atmosferi, hava olaylarını, iklim sistemlerini, iklim tiplerini ve bunların dağılışını inceler",
    bilimler: "Meteoroloji",
  },
  {
    ad: "Hidrografya",
    diger: "Sular Coğrafyası",
    bolum: "Fiziki coğrafya",
    inceler: "Denizler, göller, akarsular gibi su ortamlarını ve bu ortamlardaki olayları (akıntı, dalga vb.) inceler",
    bilimler: "Hidroloji, hidrojeoloji, oseonografya, limnoloji, potamoloji",
  },
  {
    ad: "Biyocoğrafya",
    diger: "Canlılar Coğrafyası",
    bolum: "Fiziki coğrafya",
    inceler: "Bitki ve hayvan topluluklarının genel özelliklerini, etkileşimlerini ve dağılışlarını inceler",
    bilimler: "Biyoloji, botanik, zooloji",
  },
  {
    ad: "Toprak Coğrafyası",
    bolum: "Fiziki coğrafya",
    inceler: "Toprakların oluşum süreçlerini, özelliklerini ve dağılışını inceler",
    bilimler: "Pedoloji, mineraloji",
  },
  {
    ad: "Nüfus Coğrafyası",
    bolum: "Beşerî coğrafya",
    inceler: "Nüfusun özelliklerini, dağılışını, değişimini, hareketlerini ve nüfus politikalarını inceler",
    bilimler: "Demografi, istatistik",
  },
  {
    ad: "Yerleşme Coğrafyası",
    bolum: "Beşerî coğrafya",
    inceler: "Yerleşmelerin gelişimini, tiplerini, dağılışını, yerleşmeyi etkileyen faktörleri ve mesken tiplerini inceler",
    bilimler: "Arkeoloji, tarih",
  },
  {
    ad: "Siyasi Coğrafya",
    bolum: "Beşerî coğrafya",
    inceler: "Siyasi faaliyet ve olayların mekâna bağlı olarak gösterdikleri değişiklik ve farklılıkları inceler",
    bilimler: "Uluslararası ilişkiler, tarih, siyaset",
  },
  {
    ad: "Sosyal Coğrafya",
    bolum: "Beşerî coğrafya",
    inceler: "Sosyal ilişkileri, sosyal kimlikleri ve sosyal eşitsizlikleri mekânsal bir perspektiften inceler",
    bilimler: "Antropoloji, sosyoloji, demografi, ekonomi",
  },
  {
    ad: "Kültürel Coğrafya",
    bolum: "Beşerî coğrafya",
    inceler: "Dil, din, giyim, yemek, müzik, mimari gibi kültürel özellikleri coğrafyayla ilişkilendirerek inceler",
    bilimler: "Sosyoloji, filoloji, ilahiyat, antropoloji",
  },
  {
    ad: "Ekonomik Coğrafya",
    bolum: "Beşerî coğrafya",
    inceler: "Sanayi, ticaret, tarım, hayvancılık, turizm gibi ekonomik faaliyetleri ve coğrafi olaylarla etkileşimini inceler",
    bilimler: "İktisat",
  },
];

const KAVRAMLAR: [string, string][] = [
  ["Doğal ortam", "İnsanın etkisi olmadan, insan ve insani unsurların dışında kalan yer"],
  ["Doğa olayı", "Doğal ortamı oluşturan unsurlarda meydana gelen değişimler"],
  ["Beşerî ortam", "İnsanın sosyal, kültürel ve ekonomik faaliyetleri sonucunda doğal ortam üzerine inşa ettiği yaşam alanı"],
  ["Coğrafi ortam", "Doğal ortam ile beşerî ortamın birlikteliğinden oluşan en geniş yaşam alanı"],
  ["Litosfer", "Kayaçlar, yer şekilleri ve topraklardan oluşan taş küre"],
  ["Atmosfer", "Dünya'yı çepeçevre saran gazlardan oluşan hava küre"],
  ["Hidrosfer", "Denizler, göller, akarsular, yer altı suları gibi su kaynaklarından oluşan su küre"],
  ["Kriyosfer", "Donmuş topraklar, buzullar ve sürekli karla kaplı alanlardan oluşan buz küre"],
  ["Biyosfer", "Canlıların hayati faaliyetlerini sürdürdüğü alanlardan oluşan yaşam küre"],
];

const slug = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/[^a-z0-9çğıöşüâî]+/g, "-")
    .replace(/^-|-$/g, "");

export const SEKMELER: KonuSekmesi[] = [
  {
    id: "kureler",
    baslik: "Küreler",
    alt: "Doğal ortamın unsurlarını küresine yerleştir",
    tur: "kategori",
    kategoriler: KURELER,
    ogeler: KURE_OGELERI.map(([ad, k]) => ({ id: slug(ad), ad, kategori: k })),
    yonerge:
      "Doğal ortam beş temel ortamdan oluşur: taş küre, hava küre, su küre, buz küre ve yaşam küre. Her kartı ait olduğu kürenin kutusuna yerleştir.",
    turSecenekleri: [10, 17],
  },
  {
    id: "bolumler",
    baslik: "Fiziki mi, beşerî mi?",
    alt: "Alt dalları bölümüne yerleştir",
    tur: "kategori",
    kategoriler: ["Fiziki coğrafya", "Beşerî coğrafya"],
    ogeler: [
      ...ALT_DALLAR.map((d) => ({ id: slug(d.ad), ad: d.ad, kategori: d.bolum })),
      ...ALT_DALLAR.filter((d) => d.diger).map((d) => ({ id: slug(d.diger!), ad: d.diger!, kategori: d.bolum })),
    ],
    yonerge:
      "Coğrafya fiziki ve beşerî coğrafya olmak üzere iki bölüme ayrılır. Her alt dalı ait olduğu bölüme yerleştir. Bazı alt dalların Türkçe adları da kart olarak geliyor.",
    turSecenekleri: [10, 15],
  },
  {
    id: "inceler",
    baslik: "Ne inceler?",
    alt: "Alt dalı inceleme alanıyla eşleştir",
    tur: "eslestirme",
    ciftler: ALT_DALLAR.map((d) => ({ id: slug(d.ad), sol: d.ad, sag: d.inceler })),
    solBaslik: "Alt dal",
    sagBaslik: "İnceleme alanı",
    yonerge: "Coğrafyanın alt dallarını inceledikleri konularla eşleştir.",
    turSecenekleri: [5, 8, 11],
  },
  {
    id: "bilimler",
    baslik: "Hangi bilimlerle?",
    alt: "Alt dalı etkileşimde olduğu bilimlerle eşleştir",
    tur: "eslestirme",
    ciftler: ALT_DALLAR.map((d) => ({ id: slug(d.ad), sol: d.ad, sag: d.bilimler })),
    solBaslik: "Alt dal",
    sagBaslik: "Etkileşim içinde olduğu bilimler",
    yonerge: "Coğrafyanın her alt dalı başka bilimlerle etkileşim içindedir. Alt dalları bu bilimlerle eşleştir.",
    turSecenekleri: [5, 8, 11],
  },
  {
    id: "kavramlar",
    baslik: "Kavramlar",
    alt: "Kavramı tanımıyla eşleştir",
    tur: "eslestirme",
    ciftler: KAVRAMLAR.map(([k, t]) => ({ id: slug(k), sol: k, sag: t })),
    solBaslik: "Kavram",
    sagBaslik: "Tanım",
    yonerge: "Ortam ve küre kavramlarını kitaptaki tanımlarıyla eşleştir.",
    turSecenekleri: [5, 9],
  },
  ...KONUSU_EK,
];
