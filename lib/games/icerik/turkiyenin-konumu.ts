/**
 * 9. sınıf Coğrafya — 2.1.2 Türkiye'nin Coğrafi Konumu
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.59–65. Bilgiler kitaptan;
 * çoktan seçmeli sorulardaki yanlış şıklar soruyu kurmak için eklendi.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";
import type { Soru } from "@/components/oyun/soru-oyunu";
import { ciftler, kategoriOgeleri } from "@/lib/games/icerik/yardimci";

function s(soru: string, dogru: string, yanlislar: string[], cozum: string): Soru {
  return { soru, secenekler: [dogru, ...yanlislar], dogru: 0, cozum };
}

const SORULAR: Soru[] = [
  s("Türkiye hangi paraleller arasında yer alır?", "36°–42° kuzey", ["26°–45° kuzey", "36°–42° güney", "42°–48° kuzey"], "Türkiye kuzey yarım kürede 36°–42° kuzey paralelleri arasındadır (s.59)."),
  s("Türkiye hangi meridyenler arasında yer alır?", "26°–45° doğu", ["36°–42° doğu", "26°–45° batı", "15°–30° doğu"], "Türkiye doğu yarım kürede 26°–45° doğu meridyenleri arasındadır (s.59)."),
  s("Türkiye'nin doğusu ile batısı arasında yaklaşık kaç dakikalık yerel saat farkı vardır?", "76 dakika", ["60 dakika", "45 dakika", "120 dakika"], "Türkiye'nin doğusu ile batısı arasında yaklaşık 76 dakikalık yerel saat farkı vardır (s.59)."),
  s("Türkiye'de dört mevsimin belirgin yaşanmasının nedeni nedir?", "Orta enlemlerde yer alması", ["Üç tarafının denizlerle çevrili olması", "Doğu yarım kürede yer alması", "Asya ile Avrupa'yı bağlaması"], "Orta enlemlerde yer aldığı için Türkiye'de dört mevsim belirgin yaşanır (s.59)."),
  s("Türkiye'nin gerçek yüz ölçümü kaç km²'dir?", "780.043 km²", ["680.043 km²", "880.043 km²", "980.000 km²"], "Türkiye'nin gerçek yüz ölçümü 780.043 km²'dir (s.62)."),
  s("Kıbrıs Adası Akdeniz'in kaçıncı büyük adasıdır?", "Üçüncü", ["Birinci", "İkinci", "Dördüncü"], "Kıbrıs, 9.251 km² ile Sicilya ve Sardunya'dan sonra Akdeniz'in üçüncü, Doğu Akdeniz'in en büyük adasıdır (s.64)."),
  s("Süveyş Kanalı hangi yıl açılmıştır?", "1869", ["1856", "1923", "1914"], "Süveyş Kanalı, Kızıldeniz ile Akdeniz'i bağlamak için 1869'da açıldı (s.64)."),
  s("Ege Denizi geçmişte hangi adla anılırdı?", "Adalar Denizi", ["Ak Deniz", "İç Deniz", "Kara Deniz"], "Ege Denizi geçmişte “Adalar Denizi” adıyla anılırdı (s.60)."),
  s("“Denizlere hâkim olan cihana hâkim olur.” sözü kime aittir?", "Barbaros Hayrettin Paşa", ["Piri Reis", "Kâtip Çelebi", "Turgut Reis"], "Bu söz Barbaros Hayrettin Paşa'ya aittir (s.62)."),
  s("Türk boğazları hangi iki denizi birbirine bağlar?", "Karadeniz ve Akdeniz", ["Ege ve Akdeniz", "Karadeniz ve Hazar Denizi", "Marmara ve Kızıldeniz"], "Türk boğazları (İstanbul ve Çanakkale) Karadeniz'i Akdeniz'e bağlar (s.60)."),
];

export const SEKMELER: KonuSekmesi[] = [
  {
    id: "konum",
    baslik: "Mutlak mı, göreceli mi?",
    alt: "Konum özelliklerini ayır",
    tur: "kategori",
    yonerge:
      "Mutlak konum bir yerin Ekvator'a ve başlangıç meridyenine göre konumudur. Göreceli konum bir yerin diğer yerlerle ilişkisidir. Her ifadeyi doğru konum türüne yerleştir.",
    turSecenekleri: [8, 13],
    kategoriler: ["Mutlak konum", "Göreceli konum"],
    ogeler: kategoriOgeleri({
      "Mutlak konum": [
        "Türkiye 36°–42° kuzey paralelleri arasındadır",
        "Türkiye 26°–45° doğu meridyenleri arasındadır",
        "Türkiye orta enlemlerde yer alır",
        "Doğu ile batı arasında 76 dakika yerel saat farkı vardır",
        "Bir yerin nerede olduğunu kesin olarak tanımlar",
        "Navigasyon ve haritalarda kullanılır",
      ],
      "Göreceli konum": [
        "Türkiye Asya ile Avrupa'yı birbirine bağlar",
        "Türkiye bir enerji koridorudur",
        "Türkiye kıtalar arası ticaret yollarının kesişimindedir",
        "Türkiye birçok medeniyete ev sahipliği yapmıştır",
        "İnsanların algısına dayandığından daha özneldir",
        "Zamanla değişebilir",
        "Nehir, dağ, şehir gibi özelliklere yakınlığı belirler",
      ],
    }),
  },
  {
    id: "kara-komsulari",
    baslik: "Kara komşuları",
    alt: "Komşuları yönüne yerleştir",
    tur: "kategori",
    yonerge: "Türkiye'nin kara sınırı komşularını bulundukları yöne göre yerleştir.",
    turSecenekleri: [8],
    kategoriler: ["Doğuda", "Güneyde", "Batıda"],
    ogeler: kategoriOgeleri({
      Doğuda: ["Ermenistan", "Gürcistan", "Azerbaycan (Nahçıvan)", "İran"],
      Güneyde: ["Irak", "Suriye"],
      Batıda: ["Yunanistan", "Bulgaristan"],
    }),
  },
  {
    id: "deniz-komsulari",
    baslik: "Deniz komşuları",
    alt: "Komşuları denize göre yerleştir",
    tur: "kategori",
    yonerge: "Türkiye'nin deniz sınırı komşularını, komşu oldukları denize göre yerleştir.",
    turSecenekleri: [13],
    kategoriler: ["Karadeniz", "Ege Denizi", "Akdeniz"],
    ogeler: kategoriOgeleri({
      Karadeniz: ["Bulgaristan", "Romanya", "Ukrayna", "Rusya Federasyonu", "Gürcistan"],
      "Ege Denizi": ["Yunanistan"],
      Akdeniz: ["KKTC", "Libya", "Mısır", "Filistin", "İsrail", "Lübnan", "Suriye"],
    }),
  },
  {
    id: "vatan",
    baslik: "Mavi Vatan, Gök Vatan",
    alt: "İfadeleri doğru kavrama yerleştir",
    tur: "kategori",
    yonerge: "Mavi Vatan ve Gök Vatan kavramlarıyla ilgili ifadeleri doğru kavrama yerleştir.",
    turSecenekleri: [9],
    kategoriler: ["Mavi Vatan", "Gök Vatan"],
    ogeler: kategoriOgeleri({
      "Mavi Vatan": [
        "Türkiye'nin deniz yetki alanlarını ifade eder",
        "Misakımillî sınırları içinde vatanın denizlerdeki parçasıdır",
        "Petrol ve doğal gaz gibi enerji kaynaklarını kullanmayı kapsar",
        "Karadeniz bu kavramın önemli bir parçasıdır",
        "Sınır aşan akarsu ve göller de hak ve egemenlik konusudur",
      ],
      "Gök Vatan": [
        "Kara ve deniz yetki alanları üzerindeki hava sahasıdır",
        "Uçuş bilgi bölgesi (FIR) sorumluluğuna karşılık gelir",
        "Dayanağı 1944 Şikago Sivil Havacılık Konvansiyonu'dur",
        "Havadaki savunma ve taarruz sahasını kapsar",
      ],
    }),
  },
  {
    id: "savunma",
    baslik: "Savunma teknolojileri",
    alt: "Ürünü türüyle eşleştir",
    tur: "eslestirme",
    solBaslik: "Ürün",
    sagBaslik: "Türü",
    yonerge: "Türkiye'nin ürettiği başlıca hava savunma teknolojilerini türleriyle eşleştir.",
    turSecenekleri: [5, 8],
    ciftler: ciftler([
      ["Anka", "Orta irtifada uçabilen ve uzun süre havada kalabilen İHA"],
      ["Karayel", "Yüksek performanslı taktik İHA"],
      ["Göktürk-2 ve İMECE", "Gözlem uyduları"],
      ["TAI Hürkuş", "Eğitim ve hafif saldırı uçağı"],
      ["Gökbey", "İlk özgün helikopter"],
      ["T-129 Atak", "Taarruz helikopteri"],
      ["Gökdeniz ve Hisar", "Hava savunma sistemi"],
      ["ÇAFRAD", "Radar sistemleri"],
    ]),
  },
  {
    id: "sorular",
    baslik: "Konum soruları",
    alt: "Kitaptaki bilgilerle çoktan seçmeli",
    tur: "soru",
    yonerge: "Türkiye'nin mutlak ve göreceli konumuyla ilgili sorular.",
    turSecenekleri: [5, 10],
    sorular: SORULAR,
  },
];
