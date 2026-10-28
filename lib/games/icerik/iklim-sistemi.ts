/**
 * 9. sınıf Coğrafya — 3.1.2 İklim Sistemi: Bileşenler
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.89-93.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "bilesen-degisken",
    "baslik": "Bileşen mi, değişken mi?",
    "alt": "İklim sisteminin unsurlarını ayır",
    "yonerge": "Şema 3.1'e göre her unsuru iklim sisteminin bileşeni ya da değişkeni olarak grupla.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "İklim sisteminin bileşenleri",
      "İklim sisteminin değişkenleri"
    ],
    "ogeler": [
      {
        "id": "iklim-sisteminin-bilesenleri--litosfer",
        "ad": "Litosfer",
        "kategori": "İklim sisteminin bileşenleri"
      },
      {
        "id": "iklim-sisteminin-bilesenleri--kriyosfer",
        "ad": "Kriyosfer",
        "kategori": "İklim sisteminin bileşenleri"
      },
      {
        "id": "iklim-sisteminin-bilesenleri--hidrosfer",
        "ad": "Hidrosfer",
        "kategori": "İklim sisteminin bileşenleri"
      },
      {
        "id": "iklim-sisteminin-bilesenleri--atmosfer",
        "ad": "Atmosfer",
        "kategori": "İklim sisteminin bileşenleri"
      },
      {
        "id": "iklim-sisteminin-bilesenleri--biyosfer",
        "ad": "Biyosfer",
        "kategori": "İklim sisteminin bileşenleri"
      },
      {
        "id": "iklim-sisteminin-degiskenleri--sicaklik",
        "ad": "Sıcaklık",
        "kategori": "İklim sisteminin değişkenleri"
      },
      {
        "id": "iklim-sisteminin-degiskenleri--hava-basinci",
        "ad": "Hava basıncı",
        "kategori": "İklim sisteminin değişkenleri"
      },
      {
        "id": "iklim-sisteminin-degiskenleri--ruzgarlar",
        "ad": "Rüzgârlar",
        "kategori": "İklim sisteminin değişkenleri"
      },
      {
        "id": "iklim-sisteminin-degiskenleri--nemlilik-ve-yagis",
        "ad": "Nemlilik ve yağış",
        "kategori": "İklim sisteminin değişkenleri"
      }
    ]
  },
  {
    "id": "kureler",
    "baslik": "Küreler",
    "alt": "Bileşeni Türkçe adıyla eşleştir",
    "yonerge": "İklim sisteminin her bileşenini kitaptaki karşılığıyla eşleştir.",
    "turSecenekleri": [
      4,
      5
    ],
    "tur": "eslestirme",
    "solBaslik": "Bileşen",
    "sagBaslik": "Ne demek?",
    "ciftler": [
      {
        "id": "litosfer",
        "sol": "Litosfer",
        "sag": "Taş küre"
      },
      {
        "id": "kriyosfer",
        "sol": "Kriyosfer",
        "sag": "Buzul küre; kar ve buz örtüsü"
      },
      {
        "id": "hidrosfer",
        "sol": "Hidrosfer",
        "sag": "Su küre; okyanus, deniz, göl, akarsu"
      },
      {
        "id": "atmosfer",
        "sol": "Atmosfer",
        "sag": "Hava küre"
      },
      {
        "id": "biyosfer",
        "sol": "Biyosfer",
        "sag": "Canlı küre; canlılar"
      }
    ]
  },
  {
    "id": "bilesen-etkileri",
    "baslik": "Hangi bileşen?",
    "alt": "Özelliği doğru bileşene yerleştir",
    "yonerge": "Her özelliği kitapta hangi bileşen için anlatıldıysa o gruba koy.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Hidrosfer",
      "Litosfer",
      "Kriyosfer",
      "Biyosfer",
      "Atmosfer"
    ],
    "ogeler": [
      {
        "id": "hidrosfer--gunes-ten-aldigi-enerjiyi-diger-bilesenlere-gore-daha-fazla-depolar",
        "ad": "Güneş'ten aldığı enerjiyi diğer bileşenlere göre daha fazla depolar",
        "kategori": "Hidrosfer"
      },
      {
        "id": "hidrosfer--okyanus-akintilariyla-ekvator-ve-kutuplar-arasinda-enerji-tasir",
        "ad": "Okyanus akıntılarıyla Ekvator ve kutuplar arasında enerji taşır",
        "kategori": "Hidrosfer"
      },
      {
        "id": "litosfer--etkisi-diger-bilesenlere-gore-cok-daha-uzun-zamanda-gerceklesir",
        "ad": "Etkisi diğer bileşenlere göre çok daha uzun zamanda gerçekleşir",
        "kategori": "Litosfer"
      },
      {
        "id": "litosfer--levha-hareketleriyle-milyonlarca-yilda-yeni-siradaglar-olusur",
        "ad": "Levha hareketleriyle milyonlarca yılda yeni sıradağlar oluşur",
        "kategori": "Litosfer"
      },
      {
        "id": "litosfer--siddetli-volkanik-patlamalarla-atmosferin-bilesimini-kisa-sureli-degistirebilir",
        "ad": "Şiddetli volkanik patlamalarla atmosferin bileşimini kısa süreli değiştirebilir",
        "kategori": "Litosfer"
      },
      {
        "id": "kriyosfer--kar-ve-buz-yuzeyleri-yuksek-albedoya-sahiptir",
        "ad": "Kar ve buz yüzeyleri yüksek albedoya sahiptir",
        "kategori": "Kriyosfer"
      },
      {
        "id": "kriyosfer--permafrost-cozundukce-atmosfere-sera-gazlari-salinir",
        "ad": "Permafrost çözündükçe atmosfere sera gazları salınır",
        "kategori": "Kriyosfer"
      },
      {
        "id": "kriyosfer--erimesi-deniz-seviyesinin-yukselmesine-neden-olur",
        "ad": "Erimesi deniz seviyesinin yükselmesine neden olur",
        "kategori": "Kriyosfer"
      },
      {
        "id": "biyosfer--bitkiler-onemli-miktarda-karbondioksit-depolar",
        "ad": "Bitkiler önemli miktarda karbondioksit depolar",
        "kategori": "Biyosfer"
      },
      {
        "id": "biyosfer--fitoplanktonlar-atmosferdeki-karbondioksit-oranini-etkiler",
        "ad": "Fitoplanktonlar atmosferdeki karbondioksit oranını etkiler",
        "kategori": "Biyosfer"
      },
      {
        "id": "biyosfer--bitki-ortusunun-yuksekligi-ve-yogunlugu-ruzgar-hizini-ve-yonunu-etkiler",
        "ad": "Bitki örtüsünün yüksekliği ve yoğunluğu rüzgâr hızını ve yönünü etkiler",
        "kategori": "Biyosfer"
      },
      {
        "id": "atmosfer--bes-bilesen-icinde-en-dinamik-ve-degisken-olanidir",
        "ad": "Beş bileşen içinde en dinamik ve değişken olanıdır",
        "kategori": "Atmosfer"
      },
      {
        "id": "atmosfer--en-onemli-islevi-dunya-nin-enerji-dengesini-duzenlemektir",
        "ad": "En önemli işlevi Dünya'nın enerji dengesini düzenlemektir",
        "kategori": "Atmosfer"
      }
    ]
  },
  {
    "id": "katman-sirasi",
    "baslik": "Atmosferin katmanları",
    "alt": "Katmanları yerden uzaya doğru sırala",
    "yonerge": "Atmosferin katmanlarını yeryüzüne en yakın olandan en dıştakine doğru sırala.",
    "turSecenekleri": [
      5,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Troposfer",
        "anahtar": 1,
        "etiket": "1. katman"
      },
      {
        "id": "s1",
        "ad": "Stratosfer",
        "anahtar": 2,
        "etiket": "2. katman"
      },
      {
        "id": "s2",
        "ad": "Mezosfer",
        "anahtar": 3,
        "etiket": "3. katman"
      },
      {
        "id": "s3",
        "ad": "Termosfer",
        "anahtar": 4,
        "etiket": "4. katman"
      },
      {
        "id": "s4",
        "ad": "Ekzosfer",
        "anahtar": 5,
        "etiket": "5. katman (en dış)"
      }
    ],
    "uclar": [
      "Yeryüzüne en yakın",
      "En dış katman"
    ]
  },
  {
    "id": "katman-ozellikleri",
    "baslik": "Katman özellikleri",
    "alt": "Katmanı özelliğiyle eşleştir",
    "yonerge": "Her atmosfer katmanını kitaptaki özelliğiyle eşleştir.",
    "turSecenekleri": [
      4,
      5
    ],
    "tur": "eslestirme",
    "solBaslik": "Katman",
    "sagBaslik": "Özellik",
    "ciftler": [
      {
        "id": "troposfer",
        "sol": "Troposfer",
        "sag": "Gazların yaklaşık %80'ini barındırır; rüzgâr, bulut, sis, yağmur gibi hava olayları burada oluşur"
      },
      {
        "id": "stratosfer",
        "sol": "Stratosfer",
        "sag": "Dikey hava hareketi görülmez; jet uçakları burada yol alır, ozon tabakası buradadır"
      },
      {
        "id": "mezosfer",
        "sol": "Mezosfer",
        "sag": "Yukarı çıkıldıkça sıcaklık azalır; gök taşlarının çoğu burada parçalanıp toz hâline gelir"
      },
      {
        "id": "termosfer",
        "sol": "Termosfer",
        "sag": "İyonlaşmaya bağlı iletişim sağlanır; kutup ışıkları burada oluşur"
      },
      {
        "id": "ekzosfer",
        "sol": "Ekzosfer",
        "sag": "En dış katman; yer çekimi azaldığından bazı gaz molekülleri uzaya kaçar"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Sorular",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Doğru cevabı seç.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Hidrosferi iklim sisteminin diğer bileşenlerinden ayıran en önemli özellik nedir?",
        "secenekler": [
          "Güneş'ten aldığı enerjiyi daha fazla depolayabilmesi",
          "Güneş ışınımının büyük kısmını uzaya yansıtması",
          "Etkisinin milyonlarca yılda ortaya çıkması",
          "En dinamik ve değişken bileşen olması"
        ],
        "dogru": 0,
        "cozum": "Hidrosferin en önemli özelliği Güneş'ten aldığı enerjiyi diğer bileşenlere göre daha fazla depolayabilmesidir (s.90)."
      },
      {
        "soru": "İklim sistemi üzerindeki etkisi diğer bileşenlere göre çok daha uzun zamanda gerçekleşen bileşen hangisidir?",
        "secenekler": [
          "Litosfer",
          "Atmosfer",
          "Biyosfer",
          "Hidrosfer"
        ],
        "dogru": 0,
        "cozum": "Litosferin etkisi levha hareketleriyle milyonlarca yılda ortaya çıkar (s.90)."
      },
      {
        "soru": "Kriyosferin bir unsuru olan ve organik karbon içeren donmuş topraklara ne ad verilir?",
        "secenekler": [
          "Permafrost",
          "Albedo",
          "Fitoplankton",
          "Ozonosfer"
        ],
        "dogru": 0,
        "cozum": "Permafrost (donmuş topraklar) organik karbon içerir; çözündükçe karbondioksit ve metan salınır (s.91)."
      },
      {
        "soru": "İklimin beş bileşeni içinde en dinamik ve değişken olanı hangisidir?",
        "secenekler": [
          "Atmosfer",
          "Litosfer",
          "Kriyosfer",
          "Hidrosfer"
        ],
        "dogru": 0,
        "cozum": "İklimin beş bileşeni içinde en dinamik ve değişken olan atmosferdir (s.91)."
      },
      {
        "soru": "Sera gazlarının (özellikle karbondioksit ve su buharı) iklim sistemindeki rolü nedir?",
        "secenekler": [
          "Kızılötesi ısı enerjisinin uzaya kaçışını engeller",
          "Morötesi ışınları süzer",
          "Güneş ışınımının tamamını uzaya yansıtır",
          "Okyanus akıntılarını başlatır"
        ],
        "dogru": 0,
        "cozum": "Sera gazları kızılötesi ısı enerjisinin uzaya kaçışını engeller (s.91)."
      },
      {
        "soru": "Canlılar için zararlı morötesi ışınları süzen ozon tabakası hangi katmandadır?",
        "secenekler": [
          "Stratosfer",
          "Troposfer",
          "Mezosfer",
          "Termosfer"
        ],
        "dogru": 0,
        "cozum": "Ozon tabakası (ozonosfer) stratosferde yer alır (s.92)."
      },
      {
        "soru": "Stratosferde yükselti arttıkça sıcaklık nasıl değişir?",
        "secenekler": [
          "Artar",
          "Azalır",
          "Değişmez",
          "Önce azalır sonra sabit kalır"
        ],
        "dogru": 0,
        "cozum": "Stratosferde yükselti arttıkça sıcaklık artar (s.92)."
      },
      {
        "soru": "Troposferde yukarı doğru çıkıldıkça sıcaklığın düşmesinin nedeni nedir?",
        "secenekler": [
          "Troposferin yeryüzünden ışıma ile ısınması",
          "Ozon tabakasının troposferde bulunması",
          "Troposferde yer çekiminin olmaması",
          "Gök taşlarının troposferde parçalanması"
        ],
        "dogru": 0,
        "cozum": "Yeryüzünden ışıma ile ısınan troposferde yukarı çıkıldıkça sıcaklık düşer (s.92)."
      },
      {
        "soru": "Atmosferin üst sınırı neden kesin olarak bilinemez?",
        "secenekler": [
          "Ekzosferin üst kısımlarında yer çekimi azaldığından bazı gaz molekülleri uzaya kaçar",
          "Termosferde kutup ışıkları oluştuğu için",
          "Mezosferde sıcaklık sürekli arttığı için",
          "Stratosferde dikey hava hareketi olmadığı için"
        ],
        "dogru": 0,
        "cozum": "Ekzosferin en üst kısımlarında yer çekimi azaldığından bazı gaz molekülleri uzaya kaçar; bu yüzden üst sınır kesin bilinemez (s.92)."
      }
    ]
  },
  {
    "id": "bosluk",
    "baslik": "Boşluk doldur",
    "alt": "Kitaptaki cümleleri tamamla",
    "yonerge": "Boşluğa gelecek kavramı yaz.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "bosluk",
    "cumleler": [
      {
        "metin": "İklim, atmosferin yanında hidrosfer, kriyosfer, litosfer ve {biyosfer} arasındaki karşılıklı ilişkilerle belirlenen bir sistemdir.",
        "kaynak": "s.89"
      },
      {
        "metin": "Okyanusların, depoladığı enerjiyi atmosfere {yavaş yavaş} vermesi sıcaklığın hızla yükselmesi veya düşmesini engellemektedir.",
        "kaynak": "s.90"
      },
      {
        "metin": "Okyanuslardan buharlaşan sular atmosfere su buharı olarak geçer; su buharının yoğuşmasıyla {yağış} meydana gelir.",
        "kaynak": "s.90"
      },
      {
        "metin": "Levha hareketleri sonucunda milyonlarca yılda okyanus havzalarının şekli ve derinliği değişmekte ve yeni {sıradağlar} oluşmaktadır.",
        "kaynak": "s.90"
      },
      {
        "metin": "Kar ve buz yüzeyleri, yüksek bir {albedoya} sahiptir.",
        "kaynak": "s.91"
      },
      {
        "metin": "Buzulların erimesi, {deniz seviyesinin} yükselmesine neden olarak iklim sistemini etkiler.",
        "kaynak": "s.91"
      },
      {
        "metin": "Bulutlar, yeryüzündeki ısıyı yalıtkan bir {battaniye} gibi hapseder.",
        "kaynak": "s.91"
      },
      {
        "metin": "Su buharının tamamına yakını {troposfer} katmanında bulunur.",
        "kaynak": "s.92"
      }
    ]
  }
];
