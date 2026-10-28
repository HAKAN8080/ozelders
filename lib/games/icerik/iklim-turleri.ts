/**
 * 9. sınıf Coğrafya — 3.1.3 İklim Türleri
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.118-120.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "iklim-gruplari",
    "baslik": "İklim grupları",
    "alt": "İklim türünü ait olduğu gruba yerleştir",
    "yonerge": "Her iklim türünü kitaptaki Şema 3.3'e göre sıcak, ılıman ya da soğuk iklimler grubuna yerleştir.",
    "turSecenekleri": [
      8,
      11
    ],
    "tur": "kategori",
    "kategoriler": [
      "Sıcak İklimler",
      "Ilıman İklimler",
      "Soğuk İklimler"
    ],
    "ogeler": [
      {
        "id": "sicak-iklimler--ekvatoral-iklim",
        "ad": "Ekvatoral iklim",
        "kategori": "Sıcak İklimler"
      },
      {
        "id": "sicak-iklimler--savan-iklimi",
        "ad": "Savan iklimi",
        "kategori": "Sıcak İklimler"
      },
      {
        "id": "sicak-iklimler--col-iklimi",
        "ad": "Çöl iklimi",
        "kategori": "Sıcak İklimler"
      },
      {
        "id": "sicak-iklimler--muson-iklimi",
        "ad": "Muson iklimi",
        "kategori": "Sıcak İklimler"
      },
      {
        "id": "iliman-iklimler--akdeniz-iklimi",
        "ad": "Akdeniz iklimi",
        "kategori": "Ilıman İklimler"
      },
      {
        "id": "iliman-iklimler--okyanusal-iklim",
        "ad": "Okyanusal iklim",
        "kategori": "Ilıman İklimler"
      },
      {
        "id": "iliman-iklimler--iliman-karasal-step-iklim",
        "ad": "Ilıman karasal (step) iklim",
        "kategori": "Ilıman İklimler"
      },
      {
        "id": "iliman-iklimler--sert-karasal-iklim",
        "ad": "Sert karasal iklim",
        "kategori": "Ilıman İklimler"
      },
      {
        "id": "soguk-iklimler--tundra-kutup-alti-iklimi",
        "ad": "Tundra (kutup altı) iklimi",
        "kategori": "Soğuk İklimler"
      },
      {
        "id": "soguk-iklimler--kutup-iklimi",
        "ad": "Kutup iklimi",
        "kategori": "Soğuk İklimler"
      },
      {
        "id": "soguk-iklimler--yuksek-dag-iklimi",
        "ad": "Yüksek dağ iklimi",
        "kategori": "Soğuk İklimler"
      }
    ]
  },
  {
    "id": "grup-ozellikleri",
    "baslik": "Grupların özellikleri",
    "alt": "Özelliği doğru iklim grubuna yerleştir",
    "yonerge": "Kitapta verilen özelliği hangi iklim grubunun taşıdığını bul.",
    "turSecenekleri": [
      8,
      10
    ],
    "tur": "kategori",
    "kategoriler": [
      "Sıcak İklimler",
      "Ilıman İklimler",
      "Soğuk İklimler"
    ],
    "ogeler": [
      {
        "id": "sicak-iklimler--tropikal-kusakta-gorulur",
        "ad": "Tropikal kuşakta görülür",
        "kategori": "Sıcak İklimler"
      },
      {
        "id": "sicak-iklimler--ortalama-sicakliklar-yil-boyunca-cok-degismez",
        "ad": "Ortalama sıcaklıklar yıl boyunca çok değişmez",
        "kategori": "Sıcak İklimler"
      },
      {
        "id": "sicak-iklimler--mevsimler-kurak-ve-yagisli-donemler-seklinde-belirginlesir",
        "ad": "Mevsimler kurak ve yağışlı dönemler şeklinde belirginleşir",
        "kategori": "Sıcak İklimler"
      },
      {
        "id": "sicak-iklimler--dorde-ayrilir-ekvatoral-col-savan-muson",
        "ad": "Dörde ayrılır: ekvatoral, çöl, savan, muson",
        "kategori": "Sıcak İklimler"
      },
      {
        "id": "iliman-iklimler--dort-mevsim-belirgin-olarak-yasanir",
        "ad": "Dört mevsim belirgin olarak yaşanır",
        "kategori": "Ilıman İklimler"
      },
      {
        "id": "iliman-iklimler--orta-kusakta-30-60-enlemleri-gorulur",
        "ad": "Orta kuşakta (30°-60° enlemleri) görülür",
        "kategori": "Ilıman İklimler"
      },
      {
        "id": "iliman-iklimler--dorde-ayrilir-akdeniz-okyanusal-step-sert-karasal",
        "ad": "Dörde ayrılır: Akdeniz, okyanusal, step, sert karasal",
        "kategori": "Ilıman İklimler"
      },
      {
        "id": "soguk-iklimler--kutuplara-yakin-alanlarda-gorulur",
        "ad": "Kutuplara yakın alanlarda görülür",
        "kategori": "Soğuk İklimler"
      },
      {
        "id": "soguk-iklimler--cok-yuksek-kesimlerde-gorulur",
        "ad": "Çok yüksek kesimlerde görülür",
        "kategori": "Soğuk İklimler"
      },
      {
        "id": "soguk-iklimler--sicakliklar-yil-boyunca-dusuktur",
        "ad": "Sıcaklıklar yıl boyunca düşüktür",
        "kategori": "Soğuk İklimler"
      },
      {
        "id": "soguk-iklimler--uce-ayrilir-tundra-kutup-yuksek-dag",
        "ad": "Üçe ayrılır: tundra, kutup, yüksek dağ",
        "kategori": "Soğuk İklimler"
      }
    ]
  },
  {
    "id": "kavramlar",
    "baslik": "Kavramlar",
    "alt": "Kavramı açıklamasıyla eşleştir",
    "yonerge": "Soldaki kavramı kitaptaki açıklamasıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Açıklama",
    "ciftler": [
      {
        "id": "makroklima",
        "sol": "Makroklima",
        "sag": "İklim değişkenlerinin uzun süreli ortalamalarının benzer olduğu iklim bölgesi"
      },
      {
        "id": "mikroklima",
        "sol": "Mikroklima",
        "sag": "Bulunduğu bölgenin ortalama koşullarından sapma gösteren küçük bir alandaki özel iklim koşulları"
      },
      {
        "id": "sicak-iklimler",
        "sol": "Sıcak iklimler",
        "sag": "Tropikal kuşakta görülen, sıcaklıkları yıl boyunca çok değişmeyen iklimler"
      },
      {
        "id": "iliman-iklimler",
        "sol": "Ilıman iklimler",
        "sag": "Orta kuşakta görülen, dört mevsimin belirgin yaşandığı iklimler"
      },
      {
        "id": "soguk-iklimler",
        "sol": "Soğuk iklimler",
        "sag": "Kutuplara yakın ve çok yüksek kesimlerde görülen, sıcaklıkları yıl boyunca düşük iklimler"
      },
      {
        "id": "tundra-iklimi",
        "sol": "Tundra iklimi",
        "sag": "Kutup altı iklimi olarak da adlandırılan soğuk iklim türü"
      },
      {
        "id": "iliman-karasal-iklim",
        "sol": "Ilıman karasal iklim",
        "sag": "Step iklimi olarak da adlandırılan ılıman iklim türü"
      },
      {
        "id": "gecis-bolgesi",
        "sol": "Geçiş bölgesi",
        "sag": "Türkiye'de iklimler arasında dereceli geçişin görüldüğü, kesin sınır çizilemeyen alan"
      }
    ]
  },
  {
    "id": "girne-grafigi",
    "baslik": "Grafik okuma",
    "alt": "Girne (KKTC) sıcaklık ve yağış grafiği",
    "yonerge": "Kitaptaki Girne sıcaklık ve yağış grafiğinin bilgilerini değerleriyle eşleştir.",
    "turSecenekleri": [
      5,
      7
    ],
    "tur": "eslestirme",
    "solBaslik": "Grafikteki bilgi",
    "sagBaslik": "Değer",
    "ciftler": [
      {
        "id": "yil-icindeki-sicaklik-araligi",
        "sol": "Yıl içindeki sıcaklık aralığı",
        "sag": "Yaklaşık 10 ile 27 °C"
      },
      {
        "id": "nisan-ayi-ortalama-sicakligi",
        "sol": "Nisan ayı ortalama sıcaklığı",
        "sag": "17,5 °C"
      },
      {
        "id": "mayis-ayi-toplam-yagis-miktari",
        "sol": "Mayıs ayı toplam yağış miktarı",
        "sag": "30 mm"
      },
      {
        "id": "yagisin-fazla-oldugu-mevsim",
        "sol": "Yağışın fazla olduğu mevsim",
        "sag": "Kış"
      },
      {
        "id": "yagisin-az-oldugu-mevsim",
        "sol": "Yağışın az olduğu mevsim",
        "sag": "Yaz"
      },
      {
        "id": "yagisin-yil-icindeki-dagilimi",
        "sol": "Yağışın yıl içindeki dağılımı",
        "sag": "Düzensiz"
      },
      {
        "id": "girne-nin-yukseltisi",
        "sol": "Girne'nin yükseltisi",
        "sag": "21 m"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Sorular",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Her soruda kitaba göre doğru olan şıkkı seç.",
    "turSecenekleri": [
      5,
      9
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Yeryüzündeki iklim türleri özellikle hangi değişkene bağlı olarak sıcak, ılıman ve soğuk iklimler şeklinde üçe ayrılır?",
        "secenekler": [
          "Sıcaklık",
          "Basınç",
          "Rüzgâr",
          "Nem"
        ],
        "dogru": 0,
        "cozum": "Özellikle sıcaklıklara bağlı olarak iklim türleri sıcak, ılıman ve soğuk iklimler şeklinde üçe ayrılır (s.118)."
      },
      {
        "soru": "Aşağıdakilerden hangisi sıcak iklimlerden biri değildir?",
        "secenekler": [
          "Okyanusal iklim",
          "Savan iklimi",
          "Muson iklimi",
          "Ekvatoral iklim"
        ],
        "dogru": 0,
        "cozum": "Okyanusal iklim ılıman iklimler grubundadır (s.118)."
      },
      {
        "soru": "Ilıman iklimler hangi enlemler arasındaki orta kuşakta görülür?",
        "secenekler": [
          "30°-60°",
          "0°-30°",
          "60°-90°",
          "10°-40°"
        ],
        "dogru": 0,
        "cozum": "Dört mevsimin belirgin yaşandığı orta kuşak 30°-60° enlemleridir (s.118)."
      },
      {
        "soru": "Yüksek dağ iklimi hangi iklim grubunda yer alır?",
        "secenekler": [
          "Soğuk iklimler",
          "Sıcak iklimler",
          "Ilıman iklimler",
          "Muson iklimleri"
        ],
        "dogru": 0,
        "cozum": "Soğuk iklimler tundra, kutup ve yüksek dağ iklimi olmak üzere üçe ayrılır (s.118)."
      },
      {
        "soru": "Sıcak iklimlerde mevsimler genel olarak nasıl belirginleşir?",
        "secenekler": [
          "Kurak ve yağışlı dönemler şeklinde",
          "Dört belirgin mevsim şeklinde",
          "Uzun ve soğuk kışlar şeklinde",
          "Yıl boyu düşük sıcaklıklar şeklinde"
        ],
        "dogru": 0,
        "cozum": "Tropikal kuşaktaki sıcak iklimlerde mevsimler kurak ve yağışlı dönemler şeklinde belirginleşir (s.118)."
      },
      {
        "soru": "Türkiye mutlak konumu itibarıyla hangi iklim kuşağı içinde yer alır?",
        "secenekler": [
          "Akdeniz iklim kuşağı",
          "Okyanusal iklim kuşağı",
          "Muson iklim kuşağı",
          "Tundra iklim kuşağı"
        ],
        "dogru": 0,
        "cozum": "Türkiye mutlak konumu itibarıyla Akdeniz iklim kuşağı içinde yer alır (s.119)."
      },
      {
        "soru": "Aşağıdakilerden hangisi Türkiye'de etkili olan üç büyük iklim türünden biri değildir?",
        "secenekler": [
          "Okyanusal iklim",
          "Akdeniz iklimi",
          "Karadeniz iklimi",
          "Karasal iklim"
        ],
        "dogru": 0,
        "cozum": "Akdeniz ve Karadeniz iklimleri ile karasal iklim Türkiye'de etkili olan üç büyük iklim türüdür (s.119)."
      },
      {
        "soru": "Kitapta Akdeniz iklimi özellikleriyle birlikte karasal iklim özelliklerinin de görüldüğü yerlere örnek olarak hangisi verilmiştir?",
        "secenekler": [
          "Uşak, Afyon ve Kütahya",
          "Rize, Trabzon ve Artvin",
          "Antalya, Mersin ve Adana",
          "Erzurum, Kars ve Ardahan"
        ],
        "dogru": 0,
        "cozum": "Anadolu'nun batısında Uşak, Afyon ve Kütahya'da yer yer Akdeniz iklimi özellikleri hissedilirken karasal iklim özellikleri de görülür (s.119)."
      },
      {
        "soru": "Türkiye'de iklimler sınıflandırılırken kesin sınırlar çizilememesinin nedeni nedir?",
        "secenekler": [
          "İklimler arası geçişin dereceli gerçekleşmesi",
          "Türkiye'nin tropikal kuşakta bulunması",
          "Ülkede tek bir iklim türünün görülmesi",
          "Yükseltinin her yerde aynı olması"
        ],
        "dogru": 0,
        "cozum": "Türkiye'de iklimler arası geçiş dereceli gerçekleştiği için kesin sınır çizmek mümkün değildir (s.119)."
      }
    ]
  },
  {
    "id": "bosluk",
    "baslik": "Boşluk doldur",
    "alt": "Kitaptaki cümleleri tamamla",
    "yonerge": "Boşluğa gelecek kavramı ya da sayıyı yaz.",
    "turSecenekleri": [
      5,
      7
    ],
    "tur": "bosluk",
    "cumleler": [
      {
        "metin": "İklim değişkenlerinin uzun süreli ortalamalarının benzer olduğu alanlar, aynı iklim bölgesi ({makroklima}) olarak kabul edilir.",
        "kaynak": "s.118"
      },
      {
        "metin": "Küçük bir alandaki özel iklim koşullarına {mikroklima} adı verilir.",
        "kaynak": "s.118"
      },
      {
        "metin": "Tropikal kuşakta görülen {sıcak} iklimlerde ortalama sıcaklıklar yıl boyunca çok değişmez.",
        "kaynak": "s.118"
      },
      {
        "metin": "Dört mevsimin belirgin olarak yaşandığı orta kuşak {30°-60°} enlemleri arasındadır.",
        "kaynak": "s.118"
      },
      {
        "metin": "Kutuplara yakın alanlarda ve çok yüksek kesimlerde görülen soğuk iklimlerde sıcaklıklar yıl boyunca {düşüktür}.",
        "kaynak": "s.118"
      },
      {
        "metin": "Türkiye'de iklimler arası geçiş, {dereceli} gerçekleşmektedir.",
        "kaynak": "s.119"
      },
      {
        "metin": "Akdeniz ve Karadeniz iklimleri ile {karasal} iklim, Türkiye'de etkili olan üç büyük iklim türüdür.",
        "kaynak": "s.119"
      },
      {
        "metin": "Bir yere ait sıcaklık ve {yağış} değerlerini gösteren grafikler sayesinde o yerin iklim özellikleri yorumlanabilir.",
        "kaynak": "s.119"
      }
    ]
  },
  {
    "id": "bulmaca",
    "baslik": "Çengel bulmaca",
    "alt": "Tanımlardan kavramları bul",
    "yonerge": "İpuçlarından kavramları bulup bulmacaya yerleştir.",
    "turSecenekleri": [
      6,
      9
    ],
    "tur": "bulmaca",
    "kelimeler": [
      {
        "cevap": "MAKROKLİMA",
        "ipucu": "Uzun süreli ortalamaları benzer olan aynı iklim bölgesi"
      },
      {
        "cevap": "MİKROKLİMA",
        "ipucu": "Küçük bir alandaki özel iklim koşulları"
      },
      {
        "cevap": "TUNDRA",
        "ipucu": "Kutup altı iklimi olarak da bilinen soğuk iklim"
      },
      {
        "cevap": "SAVAN",
        "ipucu": "Ekvatoral, çöl ve muson ile birlikte sıcak iklimlerden biri"
      },
      {
        "cevap": "MUSON",
        "ipucu": "Dört sıcak iklim türünden biri"
      },
      {
        "cevap": "EKVATORAL",
        "ipucu": "Şema 3.3'te sıcak iklimlerin ilki"
      },
      {
        "cevap": "OKYANUSAL",
        "ipucu": "Akdeniz iklimiyle aynı grupta yer alan ılıman iklim"
      },
      {
        "cevap": "STEP",
        "ipucu": "Ilıman karasal iklimin diğer adı"
      },
      {
        "cevap": "KUTUP",
        "ipucu": "Tundra ve yüksek dağ ile birlikte soğuk iklimlerden biri"
      },
      {
        "cevap": "AKDENİZ",
        "ipucu": "Türkiye mutlak konumu itibarıyla bu iklim kuşağındadır"
      },
      {
        "cevap": "KARADENİZ",
        "ipucu": "Türkiye'de etkili üç büyük iklimden biri"
      },
      {
        "cevap": "GİRNE",
        "ipucu": "Kitapta grafik okuma örneği verilen KKTC merkezi"
      }
    ]
  }
];
