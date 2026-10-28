/**
 * 9. sınıf Coğrafya — 3.1.2 İklim Sistemi: Sıcaklık
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.94-105.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "kavramlar",
    "baslik": "Kavramlar",
    "alt": "Kavramı tanımıyla eşleştir",
    "yonerge": "Her kavramı kitaptaki tanımıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "iklim-degiskenleri",
        "sol": "İklim değişkenleri",
        "sag": "Bir yerin hava olaylarını oluşturan sıcaklık, nem, yağış, hava basıncı, rüzgâr gibi faktörler"
      },
      {
        "id": "albedo",
        "sol": "Albedo",
        "sag": "Yeryüzünün Güneş'ten gelen ışınımı atmosfere doğru ortalama yansıtma yüzdesi"
      },
      {
        "id": "geoit",
        "sol": "Geoit",
        "sag": "Dünya'nın küreye yakın, kutuplardan basık, Ekvator'dan şişkin şekli"
      },
      {
        "id": "eksen",
        "sol": "Eksen",
        "sag": "Kutup noktalarını birleştirdiği ve Dünya'nın içinden geçtiği varsayılan çizgi"
      },
      {
        "id": "ekliptik-duzlem",
        "sol": "Ekliptik düzlem",
        "sag": "Dünya'nın yörüngesi ile Güneş arasındaki düzlem"
      },
      {
        "id": "ekinoks",
        "sol": "Ekinoks",
        "sag": "Dünya'nın her yerinde gece ve gündüz süresinin eşit olması"
      },
      {
        "id": "baki",
        "sol": "Bakı",
        "sag": "Yer şekillerinin Güneş'e karşı konumu"
      },
      {
        "id": "ozgul-isi",
        "sol": "Özgül ısı",
        "sag": "Cisimlerin bir gramının sıcaklığının 1 °C artması için gereken enerji miktarı"
      },
      {
        "id": "kentsel-isi-adasi",
        "sol": "Kentsel ısı adası",
        "sag": "Büyük kentlerin çevresine göre daha sıcak olması durumu"
      },
      {
        "id": "izoterm",
        "sol": "İzoterm",
        "sag": "Sıcaklıkları aynı olan noktaların birleştirilmesiyle elde edilen eğri"
      }
    ]
  },
  {
    "id": "tarihler",
    "baslik": "Astronomik mevsimler",
    "alt": "Olayı doğru tarihe yerleştir",
    "yonerge": "Her durumu kitapta hangi tarih için verildiyse o gruba koy.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "21 Haziran",
      "23 Eylül",
      "21 Aralık",
      "21 Mart"
    ],
    "ogeler": [
      {
        "id": "21-haziran--gunes-isinlari-ogle-vakti-yengec-donencesi-ne-dik-gelir",
        "ad": "Güneş ışınları öğle vakti Yengeç Dönencesi'ne dik gelir",
        "kategori": "21 Haziran"
      },
      {
        "id": "21-haziran--kuzey-yarim-kurede-yaz-mevsimi-baslar",
        "ad": "Kuzey yarım kürede yaz mevsimi başlar",
        "kategori": "21 Haziran"
      },
      {
        "id": "21-haziran--kuzey-yarim-kurede-en-uzun-gunduz-yasanir",
        "ad": "Kuzey yarım kürede en uzun gündüz yaşanır",
        "kategori": "21 Haziran"
      },
      {
        "id": "23-eylul--kuzey-yarim-kurede-sonbahar-mevsimi-baslar",
        "ad": "Kuzey yarım kürede sonbahar mevsimi başlar",
        "kategori": "23 Eylül"
      },
      {
        "id": "23-eylul--guney-yarim-kurede-ilkbahar-mevsimi-baslar",
        "ad": "Güney yarım kürede ilkbahar mevsimi başlar",
        "kategori": "23 Eylül"
      },
      {
        "id": "21-aralik--gunes-isinlari-ogle-vakti-oglak-donencesi-ne-dik-gelir",
        "ad": "Güneş ışınları öğle vakti Oğlak Dönencesi'ne dik gelir",
        "kategori": "21 Aralık"
      },
      {
        "id": "21-aralik--kuzey-yarim-kurede-kis-mevsimi-baslar",
        "ad": "Kuzey yarım kürede kış mevsimi başlar",
        "kategori": "21 Aralık"
      },
      {
        "id": "21-aralik--kuzey-yarim-kurede-en-uzun-gece-yasanir",
        "ad": "Kuzey yarım kürede en uzun gece yaşanır",
        "kategori": "21 Aralık"
      },
      {
        "id": "21-mart--kuzey-yarim-kurede-ilkbahar-mevsimi-baslar",
        "ad": "Kuzey yarım kürede ilkbahar mevsimi başlar",
        "kategori": "21 Mart"
      },
      {
        "id": "21-mart--guney-yarim-kurede-sonbahar-mevsimi-baslar",
        "ad": "Güney yarım kürede sonbahar mevsimi başlar",
        "kategori": "21 Mart"
      }
    ]
  },
  {
    "id": "kusaklar",
    "baslik": "Kuşaklar",
    "alt": "Kuşağı tanımıyla eşleştir",
    "yonerge": "Matematik iklim kuşaklarını ve sıcaklık kuşaklarını tanımlarıyla eşleştir.",
    "turSecenekleri": [
      4,
      6
    ],
    "tur": "eslestirme",
    "solBaslik": "Kuşak",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "tropikal-kusak",
        "sol": "Tropikal kuşak",
        "sag": "Dönenceler arasındaki alan"
      },
      {
        "id": "orta-kusak",
        "sol": "Orta kuşak",
        "sag": "Dönencelerle kutup daireleri arasındaki alan"
      },
      {
        "id": "kutup-kusagi",
        "sol": "Kutup kuşağı",
        "sag": "Kutup daireleri ile kutup noktaları arasındaki alan"
      },
      {
        "id": "sicak-kusak",
        "sol": "Sıcak kuşak",
        "sag": "Ortalama sıcaklığın 20 °C'un üstünde olduğu kuşak"
      },
      {
        "id": "iliman-kusak",
        "sol": "Ilıman kuşak",
        "sag": "Ortalama sıcaklığın 0-20 °C arasında olduğu, dört mevsimin yaşandığı kuşak"
      },
      {
        "id": "soguk-kusak",
        "sol": "Soğuk kuşak",
        "sag": "Ortalama sıcaklığın 0 °C'un altında olduğu kuşak"
      }
    ]
  },
  {
    "id": "kackar-profili",
    "baslik": "Kıyıdan Kaçkar'a",
    "alt": "Doğu Karadeniz'de bitki örtüsü kuşaklarını sırala",
    "yonerge": "Doğu Karadeniz'de kıyıdan iç kesimlere doğru yükselti arttıkça görülen kuşakları sırala.",
    "turSecenekleri": [
      5,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Geniş yapraklı ağaçlardan oluşan orman",
        "anahtar": 1,
        "etiket": "Kıyı"
      },
      {
        "id": "s1",
        "ad": "Karma orman",
        "anahtar": 2,
        "etiket": "2. kuşak"
      },
      {
        "id": "s2",
        "ad": "İğne yapraklı ağaçlardan oluşan orman",
        "anahtar": 3,
        "etiket": "3. kuşak"
      },
      {
        "id": "s3",
        "ad": "Çayır bitki örtüsü",
        "anahtar": 4,
        "etiket": "4. kuşak"
      },
      {
        "id": "s4",
        "ad": "Buzullar",
        "anahtar": 5,
        "etiket": "Kaçkar Dağları'nın yüksek kesimleri"
      }
    ],
    "uclar": [
      "Kıyı (alçak)",
      "Yüksek kesim"
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
        "soru": "Dünya'nın Ekvator'daki dönüş hızı saatte kaç kilometredir?",
        "secenekler": [
          "1.670 km",
          "670 km",
          "1.070 km",
          "2.670 km"
        ],
        "dogru": 0,
        "cozum": "Dünya ekseni etrafında saatte 1.670 km hızla (Ekvator'daki dönüş hızı) döner (s.95)."
      },
      {
        "soru": "Sabah, öğle ve akşam saatlerindeki sıcaklık değerlerinin değişmesindeki etken hangisidir?",
        "secenekler": [
          "Dünya'nın günlük hareketi",
          "Dünya'nın yıllık hareketi",
          "Yörüngenin elips şeklinde olması",
          "Okyanus akıntıları"
        ],
        "dogru": 0,
        "cozum": "Gün içindeki sıcaklık farklarının etkeni Dünya'nın dönme (günlük) hareketidir (s.95)."
      },
      {
        "soru": "Dünya ile Güneş arasındaki uzaklığın yıl içinde değişmesi için kitapta ne söylenir?",
        "secenekler": [
          "Sıcaklık üzerinde belirgin bir etkisi yoktur",
          "Mevsimlerin oluşmasının temel nedenidir",
          "Gün içindeki sıcaklık farklarını oluşturur",
          "Sıcaklığın Ekvator'dan kutuplara azalmasını sağlar"
        ],
        "dogru": 0,
        "cozum": "Uzaklığın değişmesi dolanma hızını ve mevsim sürelerini etkiler ancak sıcaklık üzerinde belirgin bir etkisi yoktur (s.95)."
      },
      {
        "soru": "Dünya'nın eksen eğikliği kaç derecedir?",
        "secenekler": [
          "23° 27'",
          "66° 33'",
          "45°",
          "30° 30'"
        ],
        "dogru": 0,
        "cozum": "Dünya'nın ekseni 23° 27'lık eğikliğe sahiptir; bu ve dolanma hareketi mevsimleri oluşturur (s.96)."
      },
      {
        "soru": "Türkiye'de bakı etkisi dağların hangi yamaçlarında görülür?",
        "secenekler": [
          "Güney yamaçlarında",
          "Kuzey yamaçlarında",
          "Doğu yamaçlarında",
          "Batı yamaçlarında"
        ],
        "dogru": 0,
        "cozum": "Kuzey yarım kürenin orta kuşağında yer alan Türkiye'de dağların güney yamaçlarında bakı etkisi görülür (s.97)."
      },
      {
        "soru": "Aynı enlem üzerindeki iki yerden yükseltisi fazla olanın sıcaklığı için ne söylenebilir?",
        "secenekler": [
          "Daha düşüktür",
          "Daha yüksektir",
          "Eşittir",
          "Yalnızca gece daha yüksektir"
        ],
        "dogru": 0,
        "cozum": "Aynı enlem üzerindeki iki yerden yükseltisi fazla olanın sıcaklık değeri daha düşüktür (s.97)."
      },
      {
        "soru": "Coriolis etkisiyle rüzgârlar ve okyanus akıntıları kuzey yarım kürede hangi yöne sapar?",
        "secenekler": [
          "Sağa",
          "Sola",
          "Sapmaz",
          "Ekvator'a doğru dik iner"
        ],
        "dogru": 0,
        "cozum": "Coriolis etkisi rüzgârlar ve akıntıların kuzey yarım kürede sağa, güney yarım kürede sola sapmasına neden olur (s.98)."
      },
      {
        "soru": "Kaynağını Ekvator'a yakın yerlerden alan okyanus akıntıları nasıl akıntılardır?",
        "secenekler": [
          "Sıcak",
          "Soğuk",
          "Tuzsuz",
          "Mevsimlik"
        ],
        "dogru": 0,
        "cozum": "Kaynağını Ekvator'a yakın yerlerden alan akıntılar sıcak, kutuplara yakın yerlerden alanlar soğuktur (s.98)."
      },
      {
        "soru": "Nemin az olduğu çöller ve yüksek yerler için hangisi doğrudur?",
        "secenekler": [
          "Günlük ve mevsimlik sıcaklık farkları fazladır",
          "Sıcaklık farkları çok azdır",
          "Gece hızla ısınır",
          "Yıl boyunca sıcaklık sabittir"
        ],
        "dogru": 0,
        "cozum": "Nemin az olduğu bölgeler gündüz çok ısınır, gece hızla soğur; günlük ve mevsimlik sıcaklık farkları fazladır (s.99)."
      },
      {
        "soru": "Kentsel ısı adasının en önemli nedeni nedir?",
        "secenekler": [
          "Şehirlerin beton ve asfaltla kaplı olması",
          "Şehirlerin deniz kıyısında kurulması",
          "Şehirlerde bitki örtüsünün gür olması",
          "Şehirlerin yüksek enlemlerde bulunması"
        ],
        "dogru": 0,
        "cozum": "Kentsel ısı adasının en önemli nedeni şehirlerin beton ve asfaltla kaplı olmasıdır (s.99)."
      },
      {
        "soru": "Kuzey yarım kürede yıllık sıcaklık ortalamalarının güney yarım küreden fazla olmasının nedeni nedir?",
        "secenekler": [
          "Kuzey yarım kürede karaların daha fazla yer kaplaması",
          "Kuzey yarım kürenin Güneş'e daha yakın olması",
          "Kuzey yarım kürede okyanusların daha geniş olması",
          "Kuzey yarım kürede yükseltinin daha az olması"
        ],
        "dogru": 0,
        "cozum": "Karalar daha fazla yer kapladığı için kuzey yarım kürede yıllık sıcaklık ortalamaları güney yarım küreden fazladır (s.101)."
      },
      {
        "soru": "Türkiye'de en fazla güneşlenme süresine (yıllık 3.250 saat) sahip iller hangileridir?",
        "secenekler": [
          "Şanlıurfa ve Mardin",
          "Trabzon ve Rize",
          "Artvin ve Rize",
          "Konya ve Karaman"
        ],
        "dogru": 0,
        "cozum": "Yıllık 3.250 saat ile Şanlıurfa ve Mardin en fazla; 1.750 saat ile Trabzon, Rize ve Artvin en az güneşlenme süresine sahiptir (s.104)."
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
        "metin": "Güneş ışınlarının {dik} açıyla geldiği yerlerde sıcaklıklar daha yüksektir.",
        "kaynak": "s.94"
      },
      {
        "metin": "Dünya, ekseni etrafındaki dönüşünü batıdan doğuya doğru {24 saatte} tamamlar.",
        "kaynak": "s.95"
      },
      {
        "metin": "Troposferde {yükselti} arttıkça sıcaklık azalır.",
        "kaynak": "s.97"
      },
      {
        "metin": "Özgül ısısı daha yüksek olan denizler, karalara göre daha {yavaş} ısınıp daha yavaş soğur.",
        "kaynak": "s.99"
      },
      {
        "metin": "Bitki örtüsü, Güneş ışınlarının bir kısmını emerek gündüzleri yerin fazla {ısınmasını} önler.",
        "kaynak": "s.99"
      },
      {
        "metin": "İzoterm haritalarında yükselti faktörünün etkisini ortadan kaldırmak için sıcaklık değerleri {deniz seviyesine} indirgenir.",
        "kaynak": "s.101"
      },
      {
        "metin": "En yüksek sıcaklık değerleri, kuzey yarım kürede dönence üzerindeki {çöllerde} görülür.",
        "kaynak": "s.101"
      },
      {
        "metin": "Türkiye'de sıcaklıkların güneyden kuzeye doğru azalmasında enlem, batıdan doğuya doğru azalmasında da {yükselti} etkilidir.",
        "kaynak": "s.104"
      },
      {
        "metin": "Yıl içinde güneşlenme süresinin en az olduğu iller {1.750} saat ile Trabzon, Rize ve Artvin'dir.",
        "kaynak": "s.104"
      }
    ]
  },
  {
    "id": "bulmaca",
    "baslik": "Çengel bulmaca",
    "alt": "Tanımlardan kavramları bul",
    "yonerge": "İpuçlarından kavramları bul ve bulmacaya yerleştir.",
    "turSecenekleri": [
      6,
      9
    ],
    "tur": "bulmaca",
    "kelimeler": [
      {
        "cevap": "Geoit",
        "ipucu": "Kutuplardan basık, Ekvator'dan şişkin Dünya şekli"
      },
      {
        "cevap": "Eksen",
        "ipucu": "Kutup noktalarını birleştirdiği varsayılan çizgi"
      },
      {
        "cevap": "Albedo",
        "ipucu": "Yüzeyin Güneş ışınımını ortalama yansıtma yüzdesi"
      },
      {
        "cevap": "Bakı",
        "ipucu": "Yer şekillerinin Güneş'e karşı konumu"
      },
      {
        "cevap": "Ekinoks",
        "ipucu": "Gece ve gündüz süresinin her yerde eşit olması"
      },
      {
        "cevap": "Ekliptik",
        "ipucu": "Yörünge düzleminin diğer adı"
      },
      {
        "cevap": "Yörünge",
        "ipucu": "Dünya'nın Güneş etrafında dolandığı elips şeklindeki yol"
      },
      {
        "cevap": "Coriolis",
        "ipucu": "Dönme nedeniyle rüzgâr ve akıntıların sapmasına verilen ad"
      },
      {
        "cevap": "İzoterm",
        "ipucu": "Eş sıcaklık eğrisi"
      },
      {
        "cevap": "Yükselti",
        "ipucu": "Troposferde arttıkça sıcaklığın azaldığı etken"
      }
    ]
  }
];
