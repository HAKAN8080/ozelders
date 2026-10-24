/**
 * Soru metninden 8. sınıf ünite tahmini (anahtar kelime kuralları).
 * Yalnızca ÖNERİDİR: admin kontrol ekranında her satırı onaylar ya da düzeltir.
 * İlk eşleşen kural kazanır; sıralama, daha özgül kuralların önce gelmesi için bilinçlidir.
 */

type Rule = { topic: string; re: RegExp };

export const TOPICS: Record<string, string[]> = {
  matematik: [
    "Çarpanlar ve katlar",
    "Üslü ifadeler",
    "Kareköklü ifadeler",
    "Veri analizi",
    "Olasılık",
    "Cebirsel ifadeler ve özdeşlikler",
    "Doğrusal denklemler",
    "Eşitsizlikler",
    "Üçgenler",
    "Dönüşüm geometrisi",
    "Geometrik cisimler",
  ],
  fen: [
    "Mevsimler ve iklim",
    "DNA ve genetik kod",
    "Basınç",
    "Madde ve endüstri",
    "Basit makineler",
    "Enerji dönüşümleri ve çevre bilimi",
    "Elektrik yükleri ve elektrik enerjisi",
  ],
};

const RULES: Record<string, Rule[]> = {
  matematik: [
    { topic: "Olasılık", re: /olasılı|rastgele|olası durum/ },
    { topic: "Doğrusal denklemler", re: /denklem|sürat|karşılaş|eğim|koordinat|doğrusal ilişki/ },
    { topic: "Veri analizi", re: /daire grafiği|sütun grafiği|çizgi grafiği|histogram|dağılım|tablo/ },
    { topic: "Dönüşüm geometrisi", re: /yansıma|öteleme|döndür|simetri|görüntüsü/ },
    { topic: "Kareköklü ifadeler", re: /karekök|tam kare|√/ },
    { topic: "Üslü ifadeler", re: /üslü|bilimsel gösterim|10\s?[-–]\s?\d|\d\s?[–-]\s?\d+\s?ml|kuvvet/ },
    { topic: "Çarpanlar ve katlar", re: /ebob|ekok|asal|çarpan|bölen|eşit sayıda|paket|tam tur/ },
    { topic: "Cebirsel ifadeler ve özdeşlikler", re: /cebirsel|özdeşli|\(\d*[xy]\s?[+-]|[xy]\s?[+-]\s?\d|\d[xy]\b|[xy]2/ },
    { topic: "Geometrik cisimler", re: /silindir|prizma|piramit|koni|küp şekl|ayrıt/ },
    { topic: "Eşitsizlikler", re: /eşitsizli|en az|en fazla|en çok|aralığ/ },
    { topic: "Üçgenler", re: /üçgen|pisagor|hipotenüs|eşkenar|ikizkenar|dik kenar/ },
  ],
  fen: [
    { topic: "Mevsimler ve iklim", re: /mevsim|iklim|dönence|ekvator|yarım küre|güneş ışın|hava olay|yerküre/ },
    { topic: "DNA ve genetik kod", re: /dna|nükleotid|gen\b|genetik|kalıtım|çaprazla|mutasyon|adaptasyon|modifikasyon|biyoteknoloji/ },
    { topic: "Basınç", re: /basınç|batma|zemin.*yüzey/ },
    { topic: "Basit makineler", re: /makara|kaldıraç|eğik düzlem|çıkrık|dişli|palanga|kuvvet kazanc|halka/ },
    { topic: "Elektrik yükleri ve elektrik enerjisi", re: /elektrik|yüklü|topraklama|iletken|yalıtkan|elektroskop/ },
    { topic: "Enerji dönüşümleri ve çevre bilimi", re: /besin|fotosentez|solunum|karbon|azot|ekosistem|geri dönüşüm|sürdürülebilir|madde döngü/ },
    { topic: "Madde ve endüstri", re: /periyodik|element|asit|baz|ph|tepkime|çözelti|ısı|sıcaklık|hal değiş|erime|kaynama/ },
  ],
};

export function guessTopic(section: string, text: string | undefined): string | null {
  if (!text) return null;
  const t = text.toLocaleLowerCase("tr");
  for (const r of RULES[section] ?? []) {
    if (r.re.test(t)) return r.topic;
  }
  return null;
}
