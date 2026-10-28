/**
 * 9. sınıf Coğrafya — 3.1.1 Hava Olayları
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.77-88.
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
        "id": "hava-olaylari",
        "sol": "Hava olayları",
        "sag": "Belirli bir yer ve zamanda gerçekleşen sıcaklık, rüzgâr, nem, sis, yağış gibi hava koşulları"
      },
      {
        "id": "meteoroloji",
        "sol": "Meteoroloji",
        "sag": "Hava olaylarını, bunları oluşturan dinamik süreçleri ve atmosfer-yeryüzü etkileşimini inceleyen bilim"
      },
      {
        "id": "klimatoloji",
        "sol": "Klimatoloji",
        "sag": "Yerkürenin iklim sistemini oluşturan bileşen ve değişkenleri inceleyen fiziki coğrafya alt bilim dalı"
      },
      {
        "id": "iklim",
        "sol": "İklim",
        "sag": "Bir bölgedeki hava olaylarının uzun süreli ortalamalarının ve uç değerlerinin genel durumu"
      },
      {
        "id": "hava-basinci",
        "sol": "Hava basıncı",
        "sag": "Atmosferi oluşturan gazların birim yüzeye uyguladığı kuvvet"
      },
      {
        "id": "ruzgar",
        "sol": "Rüzgâr",
        "sag": "Basınç farkından kaynaklanan, yeryüzüne paralel yatay hava hareketi"
      },
      {
        "id": "su-dongusu",
        "sol": "Su döngüsü",
        "sag": "Suyun atmosfer, litosfer, hidrosfer ve biyosfer arasında sürekli yer değiştirmesi"
      },
      {
        "id": "nem",
        "sol": "Nem",
        "sag": "Atmosfere karışan su buharı"
      },
      {
        "id": "doyma-ciy-noktasi",
        "sol": "Doyma (çiy) noktası",
        "sag": "Bir hava kütlesinin neme doyması için soğuması gereken sıcaklık değeri"
      },
      {
        "id": "hava-tahmini",
        "sol": "Hava tahmini",
        "sag": "Elde edilen verilerin yorumlanmasıyla belirli bir zaman dilimindeki hava koşullarına dair öngörü"
      }
    ]
  },
  {
    "id": "olcum-araclari",
    "baslik": "Ölçüm araçları",
    "alt": "Aracı ölçtüğü hava olayıyla eşleştir",
    "yonerge": "Her ölçüm aracını ölçtüğü şeyle ve birimiyle eşleştir.",
    "turSecenekleri": [
      4,
      5
    ],
    "tur": "eslestirme",
    "solBaslik": "Araç",
    "sagBaslik": "Ne ölçer?",
    "ciftler": [
      {
        "id": "termometre",
        "sol": "Termometre",
        "sag": "Hava sıcaklığı; derece celsius (°C)"
      },
      {
        "id": "barometre",
        "sol": "Barometre",
        "sag": "Hava basıncı; milibar (mb) veya hektopaskal (hPa)"
      },
      {
        "id": "anemometre-yelolcer",
        "sol": "Anemometre (yelölçer)",
        "sag": "Rüzgâr hızı; m/sn veya km/sa"
      },
      {
        "id": "higrometre-nemolcer",
        "sol": "Higrometre (nemölçer)",
        "sag": "Nem"
      },
      {
        "id": "pluviyometre-yagisolcer",
        "sol": "Plüviyometre (yağışölçer)",
        "sag": "Yağış miktarı; milimetre"
      }
    ]
  },
  {
    "id": "ruzgar-etkisi",
    "baslik": "Rüzgâr hızı ve etkisi",
    "alt": "Rüzgârın insanlara etkisini hıza göre sırala",
    "yonerge": "Rüzgârın açık alandaki insanlara etkilerini en yavaş rüzgârdan en hızlıya doğru sırala.",
    "turSecenekleri": [
      5,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Saçlar dağılır",
        "anahtar": 4,
        "etiket": "4 m/sn"
      },
      {
        "id": "s1",
        "ad": "Giysiler uçuşmaya başlar, toprak parçacıkları hareket eder",
        "anahtar": 5,
        "etiket": "5 m/sn"
      },
      {
        "id": "s2",
        "ad": "Toz ve kâğıt parçacıkları havalanır",
        "anahtar": 7,
        "etiket": "6-8 m/sn"
      },
      {
        "id": "s3",
        "ad": "Rüzgârın kuvveti vücut üzerinde hissedilir",
        "anahtar": 9.5,
        "etiket": "8-11 m/sn"
      },
      {
        "id": "s4",
        "ad": "Şemsiye kullanmak güç hâle gelir",
        "anahtar": 12.5,
        "etiket": "11-14 m/sn"
      },
      {
        "id": "s5",
        "ad": "Rüzgâra karşı yürümek güçleşir",
        "anahtar": 15.5,
        "etiket": "14-17 m/sn"
      },
      {
        "id": "s6",
        "ad": "Rüzgâra karşı yürümek mümkün olmaz",
        "anahtar": 19,
        "etiket": "17-21 m/sn"
      }
    ],
    "uclar": [
      "En yavaş rüzgâr",
      "En hızlı rüzgâr"
    ]
  },
  {
    "id": "asiri-hava",
    "baslik": "Aşırı hava olayları",
    "alt": "Özelliği doğru aşırı hava olayına yerleştir",
    "yonerge": "Her özelliği kitapta hangi aşırı hava olayı için verildiyse o gruba koy.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Sıcak hava dalgası",
      "Soğuk hava dalgası",
      "Fırtına",
      "Şiddetli yağış",
      "Kuraklık"
    ],
    "ogeler": [
      {
        "id": "sicak-hava-dalgasi--sicakliklarin-ortalama-maksimumdan-3-5-derece-fazla-olmasi",
        "ad": "Sıcaklıkların ortalama maksimumdan 3-5 derece fazla olması",
        "kategori": "Sıcak hava dalgası"
      },
      {
        "id": "sicak-hava-dalgasi--art-arda-5-gun-veya-daha-fazla-surmesi",
        "ad": "Art arda 5 gün veya daha fazla sürmesi",
        "kategori": "Sıcak hava dalgası"
      },
      {
        "id": "sicak-hava-dalgasi--temmuz-2022-de-avrupa-da-yasanmasi",
        "ad": "Temmuz 2022'de Avrupa'da yaşanması",
        "kategori": "Sıcak hava dalgası"
      },
      {
        "id": "soguk-hava-dalgasi--belirli-bir-bolgeyi-etkileyen-ani-ve-onemli-sicaklik-dususu",
        "ad": "Belirli bir bölgeyi etkileyen ani ve önemli sıcaklık düşüşü",
        "kategori": "Soğuk hava dalgası"
      },
      {
        "id": "soguk-hava-dalgasi--normal-mevsim-kosullarinin-cok-altinda-sicakliklarin-birkac-gun-veya-hafta-surmesi",
        "ad": "Normal mevsim koşullarının çok altında sıcaklıkların birkaç gün veya hafta sürmesi",
        "kategori": "Soğuk hava dalgası"
      },
      {
        "id": "firtina--ruzgar-hizinin-saatte-62-117-km-arasinda-olmasi",
        "ad": "Rüzgâr hızının saatte 62-117 km arasında olması",
        "kategori": "Fırtına"
      },
      {
        "id": "firtina--turlerinden-biri-olan-buz-firtinasinin-elektrik-hatlarinda-buz-birikmesine-yol-acmasi",
        "ad": "Türlerinden biri olan buz fırtınasının elektrik hatlarında buz birikmesine yol açması",
        "kategori": "Fırtına"
      },
      {
        "id": "siddetli-yagis--genellikle-24-saat-icinde-50-mm-yi-asan-yagis",
        "ad": "Genellikle 24 saat içinde 50 mm'yi aşan yağış",
        "kategori": "Şiddetli yağış"
      },
      {
        "id": "siddetli-yagis--kisa-surede-normalin-cok-uzerinde-yagis-dusmesi",
        "ad": "Kısa sürede normalin çok üzerinde yağış düşmesi",
        "kategori": "Şiddetli yağış"
      },
      {
        "id": "siddetli-yagis--libya-nin-derne-sehrindeki-sel-afeti",
        "ad": "Libya'nın Derne şehrindeki sel afeti",
        "kategori": "Şiddetli yağış"
      },
      {
        "id": "kuraklik--yagislarin-uzun-sure-normalin-cok-altinda-kalmasi",
        "ad": "Yağışların uzun süre normalin çok altında kalması",
        "kategori": "Kuraklık"
      },
      {
        "id": "kuraklik--tarimsal-ve-hidrolojik-turlerinin-olmasi",
        "ad": "Tarımsal ve hidrolojik türlerinin olması",
        "kategori": "Kuraklık"
      },
      {
        "id": "kuraklik--somali-de-hayvan-populasyonlarini-olumsuz-etkilemesi",
        "ad": "Somali'de hayvan popülasyonlarını olumsuz etkilemesi",
        "kategori": "Kuraklık"
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
        "soru": "Atmosferin yaklaşık %78'ini oluşturan gaz hangisidir?",
        "secenekler": [
          "Azot",
          "Oksijen",
          "Argon",
          "Karbondioksit"
        ],
        "dogru": 0,
        "cozum": "Atmosfer bileşiminde azot %78, oksijen %21 oranındadır (s.78)."
      },
      {
        "soru": "Doğru ölçüm için termometre yerden kaç metre yükseklikte ahşap bir kutuya yerleştirilir?",
        "secenekler": [
          "1,5-2 m",
          "0,5-1 m",
          "3-4 m",
          "5-6 m"
        ],
        "dogru": 0,
        "cozum": "Termometre, Güneş ışınlarına doğrudan maruz kalmayan, hava girişine açık, yerden 1,5-2 m yüksekte ahşap bir kutuya yerleştirilir (s.78)."
      },
      {
        "soru": "Standart hava basıncı (1013 mb) hangi enlemde, deniz seviyesinde ve 15 °C sıcaklıkta kabul edilmiştir?",
        "secenekler": [
          "45° enleminde",
          "0° enleminde",
          "30° enleminde",
          "60° enleminde"
        ],
        "dogru": 0,
        "cozum": "Standart hava basıncı 45° enleminde, deniz seviyesinde ve 15 °C sıcaklıkta 1013 mb olarak kabul edilmiştir (s.79)."
      },
      {
        "soru": "Hava kütlesi hangi yönde hareket eder?",
        "secenekler": [
          "Yüksek basınç merkezlerinden alçak basınç merkezlerine",
          "Alçak basınç merkezlerinden yüksek basınç merkezlerine",
          "Yalnızca yerden yukarıya doğru",
          "Her zaman kuzeyden güneye"
        ],
        "dogru": 0,
        "cozum": "Hava kütlesi yüksek basınç merkezlerinden alçak basınç merkezlerine doğru hareket eder (s.79)."
      },
      {
        "soru": "Yüksek nem oranları “hissedilen sıcaklığı” neden artırır?",
        "secenekler": [
          "Vücudun terleme yoluyla soğumasını zorlaştırdığı için",
          "Güneş ışınlarını tamamen engellediği için",
          "Hava basıncını yükselttiği için",
          "Rüzgâr hızını artırdığı için"
        ],
        "dogru": 0,
        "cozum": "Yüksek nem, vücudun terleme yoluyla soğumasını zorlaştırdığı için hissedilen sıcaklığı artırır (s.80)."
      },
      {
        "soru": "Bulutluluk ölçümünde asetat kâğıdındaki 8 kareden 3-4'ü bulutluysa bulut durumu nedir?",
        "secenekler": [
          "Parçalı bulutlu",
          "Az bulutlu",
          "Çok bulutlu",
          "Kapalı"
        ],
        "dogru": 0,
        "cozum": "0: bulut yok, 1-2: az bulutlu, 3-4: parçalı bulutlu, 5-7: çok bulutlu, 8: kapalı (s.81)."
      },
      {
        "soru": "Kitaba göre sis hangi durumda meydana gelebilir?",
        "secenekler": [
          "Sıcak ve nemli havanın soğuk zeminle temas etmesiyle",
          "Kuru havanın hızla ısınmasıyla",
          "Yüksek basınçlı havanın yükselmesiyle",
          "Rüzgâr hızının saatte 62 km'yi geçmesiyle"
        ],
        "dogru": 0,
        "cozum": "Soğuk ve sıcak hava kütlelerinin karşılaşması veya sıcak ve nemli havanın soğuk zeminle temas etmesi sonucunda sis oluşabilir (s.81)."
      },
      {
        "soru": "Göl, nehir ve yer altı su seviyelerinde belirgin düşüşlerle tanımlanan kuraklık türü hangisidir?",
        "secenekler": [
          "Hidrolojik kuraklık",
          "Tarımsal kuraklık",
          "Sıcak hava dalgası",
          "Soğuk hava dalgası"
        ],
        "dogru": 0,
        "cozum": "Hidrolojik kuraklık göl, nehir ve yer altı su seviyelerindeki belirgin düşüşlerdir; tarımsal kuraklık ise toprak neminin bitkilerin ihtiyacını karşılayamamasıdır (s.83)."
      },
      {
        "soru": "Fransız İhtilali'nden bir yıl önce, 13 Temmuz 1788'de Fransa'nın büyük kısmını etkileyen hava olayı hangisidir?",
        "secenekler": [
          "Dolu fırtınası",
          "Kasırga",
          "Sel",
          "Kum fırtınası"
        ],
        "dogru": 0,
        "cozum": "13 Temmuz 1788'de daha önce hiç yaşanmamış bir dolu fırtınası tahıl tarlalarını ve meyveleri mahvetti (s.85)."
      },
      {
        "soru": "Meteoroloji Genel Müdürlüğü hangi bakanlığa bağlıdır?",
        "secenekler": [
          "Çevre, Şehircilik ve İklim Değişikliği Bakanlığı",
          "Tarım ve Orman Bakanlığı",
          "Ulaştırma ve Altyapı Bakanlığı",
          "Enerji ve Tabii Kaynaklar Bakanlığı"
        ],
        "dogru": 0,
        "cozum": "MGM, T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığına bağlıdır (s.86)."
      },
      {
        "soru": "MGM'nin denizcilik sayfasının adı nedir?",
        "secenekler": [
          "Piri Reis",
          "Hezarfen",
          "Barbaros",
          "Kâtip Çelebi"
        ],
        "dogru": 0,
        "cozum": "Hezarfen havacılık, Piri Reis denizcilik sayfasıdır (s.86)."
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
        "metin": "Sıcaklık “°C” olarak gösterilir ve derece {celsius} olarak ifade edilir.",
        "kaynak": "s.78"
      },
      {
        "metin": "Basınç, {barometreyle} ölçülür ve birimi milibar (mb) veya hektopaskal (hPa) olarak ifade edilir.",
        "kaynak": "s.79"
      },
      {
        "metin": "Hava kütlesinin birim zamanda katettiği mesafe {rüzgâr hızı} olarak adlandırılır.",
        "kaynak": "s.79"
      },
      {
        "metin": "Hava kütlesi doyma noktasına ulaştığında su buharı sıvıya ({yoğuşma}) ya da doğrudan buza (kırağılaşma) dönüşür.",
        "kaynak": "s.80"
      },
      {
        "metin": "Fırtınada rüzgâr hızları saatte {62-117} km arasında değişmektedir.",
        "kaynak": "s.82"
      },
      {
        "metin": "Hava durumu, herhangi bir yer ve zamandaki atmosfer koşullarının {kısa süreli} durumudur.",
        "kaynak": "s.86"
      },
      {
        "metin": "Atmosferik olayların gelişimi çoğu zaman yerel ölçekte olmadığından hava tahmini yapılırken {uluslararası} meteoroloji istasyonlarından elde edilen veriler kullanılır.",
        "kaynak": "s.86"
      },
      {
        "metin": "Halk meteorolojisi, hava olaylarını halkın coğrafi ve kültürel bilgisi doğrultusunda ele alan {yerel} hava durumu tahminleridir.",
        "kaynak": "s.88"
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
        "cevap": "Meteoroloji",
        "ipucu": "Hava olaylarını ve onları oluşturan dinamik süreçleri inceleyen bilim"
      },
      {
        "cevap": "Meteorolog",
        "ipucu": "Hava bilimci; hava olaylarını ölçer, izler, modeller ve tahmin eder"
      },
      {
        "cevap": "Klimatolog",
        "ipucu": "İklim bilimci; iklim türlerinin dağılışını ve iklimin etkilerini açıklar"
      },
      {
        "cevap": "Atmosfer",
        "ipucu": "Tüm hava olaylarının gerçekleştiği gaz karışımı ortam"
      },
      {
        "cevap": "Termometre",
        "ipucu": "Hava sıcaklığını ölçen araç"
      },
      {
        "cevap": "Barometre",
        "ipucu": "Hava basıncını ölçen araç"
      },
      {
        "cevap": "Anemometre",
        "ipucu": "Yelölçer; rüzgâr hızını ölçer"
      },
      {
        "cevap": "Higrometre",
        "ipucu": "Nemölçer"
      },
      {
        "cevap": "Plüviyometre",
        "ipucu": "Yağış miktarını milimetre cinsinden ölçen araç"
      },
      {
        "cevap": "Nem",
        "ipucu": "Atmosfere karışan su buharı"
      },
      {
        "cevap": "Sis",
        "ipucu": "Görüş mesafesini azaltıp Boğazlarda deniz ulaşımını aksatan hava olayı"
      },
      {
        "cevap": "Kuraklık",
        "ipucu": "Yağışların uzun süre normalin çok altında kalması"
      }
    ]
  }
];
