/**
 * 9. sınıf Coğrafya — Sözlük Sözlük
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.228-229.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "afet-cevre",
    "baslik": "Afet ve yeryüzü",
    "alt": "Kavramı tanımıyla eşleştir",
    "yonerge": "Afet ve yeryüzüyle ilgili kavramları sözlükteki tanımlarıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "afet-bolgesi",
        "sol": "Afet bölgesi",
        "sag": "Afetin etkilediği, hasar ve yıkıma sebep olduğu belirlenip sınırları tespit edilen bölge"
      },
      {
        "id": "deprem-siddeti",
        "sol": "Deprem şiddeti",
        "sag": "Depremin etkilerinin gözleme dayalı olarak derecelendirilmesi"
      },
      {
        "id": "depremin-buyuklugu",
        "sol": "Depremin büyüklüğü",
        "sag": "Depremin ortaya çıkardığı toplam enerjiyi karakterize eden, aletsel ölçümle bulunan değer"
      },
      {
        "id": "erken-uyari-sistemi",
        "sol": "Erken uyarı sistemi",
        "sag": "Tehlikeyi algılayıp değerlendirerek halka zamanında bilgi vermek için kurulan sistem"
      },
      {
        "id": "maruziyet",
        "sol": "Maruziyet",
        "sag": "Afet bölgelerindeki insan, yapı ve sistemlerin potansiyel kayıp tehdidi altında bulunması"
      },
      {
        "id": "rehabilitasyon",
        "sol": "Rehabilitasyon",
        "sag": "Hasar gören hizmet, altyapı ve binaların kısa sürede onarılarak çalışır hâle getirilmesi"
      },
      {
        "id": "tehlike-analizi",
        "sol": "Tehlike analizi",
        "sag": "Tehlikenin kaynağı, büyüklüğü, sıklığı, süresi ve olası etkileri hakkında bilgi toplama çalışması"
      },
      {
        "id": "cevre",
        "sol": "Çevre",
        "sag": "Canlıların ilişkilerini sürdürdükleri ve etkileşim içinde bulundukları biyolojik ve fiziksel ortam"
      },
      {
        "id": "levha",
        "sol": "Levha",
        "sag": "Yerkabuğunu oluşturan parçalardan her biri"
      }
    ]
  },
  {
    "id": "ekonomi-nufus",
    "baslik": "Ekonomi ve nüfus",
    "alt": "Kavramı tanımıyla eşleştir",
    "yonerge": "Ekonomi ve nüfusla ilgili kavramları sözlükteki tanımlarıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "ham-madde",
        "sol": "Ham madde",
        "sag": "Herhangi bir malın üretiminde kullanılan işlenmemiş madde"
      },
      {
        "id": "imalat",
        "sol": "İmalat",
        "sag": "Ham madde işlenerek yapılan her türlü mal"
      },
      {
        "id": "is-gucu",
        "sol": "İş gücü",
        "sag": "Etkin nüfus içinde yer alan çalışanlarla işsizlerin toplamı"
      },
      {
        "id": "sermaye",
        "sol": "Sermaye",
        "sag": "Bir işin kurulması ve yürütülmesi için gereken anapara"
      },
      {
        "id": "uretim",
        "sol": "Üretim",
        "sag": "Mal veya hizmet meydana getirme eylemi"
      },
      {
        "id": "tuketim",
        "sol": "Tüketim",
        "sag": "Üretimle elde edilen mal ve hizmetlerin kullanılması"
      },
      {
        "id": "dagitim",
        "sol": "Dağıtım",
        "sag": "Ürünün üreticiden alınıp tüketiciye ulaştırılması faaliyeti"
      },
      {
        "id": "lojistik",
        "sol": "Lojistik",
        "sag": "Ürün, hizmet ve bilgi akışının çıkıştan varışa etkili ve verimli taşınmasının planlanması"
      },
      {
        "id": "gelir-duzeyi",
        "sol": "Gelir düzeyi",
        "sag": "Kişinin sahip olduğu maddi durum"
      },
      {
        "id": "ortanca-yas",
        "sol": "Ortanca yaş",
        "sag": "Yaşlar küçükten büyüğe sıralandığında ortada kalan bireyin yaşı"
      }
    ]
  },
  {
    "id": "tarih-bilim",
    "baslik": "Tarih ve bilim",
    "alt": "Kavramı tanımıyla eşleştir",
    "yonerge": "Tarih, bilim ve doğayla ilgili kavramları sözlükteki tanımlarıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "arkeoloji",
        "sol": "Arkeoloji",
        "sag": "Eski uygarlıklara ait eserleri bilimsel olarak araştıran bilim dalı"
      },
      {
        "id": "astronomi",
        "sol": "Astronomi",
        "sag": "Gök bilimi"
      },
      {
        "id": "hoyuk",
        "sol": "Höyük",
        "sag": "Yıkılıp terk edilen yerleşmelerde kalıntıların üst üste yığılmasıyla oluşan tepecik"
      },
      {
        "id": "mezolitik",
        "sol": "Mezolitik",
        "sag": "Orta Taş Çağı; MÖ 22 bin-10 bin arası dönem"
      },
      {
        "id": "neolitik",
        "sol": "Neolitik",
        "sag": "Tarım faaliyetlerinin başladığı tarih öncesi çağ"
      },
      {
        "id": "seyyah",
        "sol": "Seyyah",
        "sag": "Gezen, seyahat eden kimse"
      },
      {
        "id": "seyahatname",
        "sol": "Seyahatnâme",
        "sag": "Gezginlerin gezip gördükleri yerleri yazdığı kitap"
      },
      {
        "id": "maki",
        "sol": "Maki",
        "sag": "Akdeniz dolaylarında yaygın, bodur ağaç ve çalılardan oluşan bitki örtüsü"
      },
      {
        "id": "absorbe",
        "sol": "Absorbe",
        "sag": "Işınların bir maddeden geçerken zayıflaması, soğurulması; soğurma"
      },
      {
        "id": "sublimlesmek",
        "sol": "Süblimleşmek",
        "sag": "Katı durumdan sıvıya geçmeden doğrudan gaza dönüşmek"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Sorular",
    "alt": "Sözlükteki tanımlarla çoktan seçmeli",
    "yonerge": "Doğru seçeneği işaretle.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Hektopaskal (hPa) kaç milibara eşit hava basıncı ölçü birimidir?",
        "secenekler": [
          "1 milibar",
          "10 milibar",
          "100 milibar",
          "1000 milibar"
        ],
        "dogru": 0,
        "cozum": "Hektopaskal, 1 milibara eşit hava basıncı ölçü birimidir (s.228)."
      },
      {
        "soru": "Rüzgârın yıl içerisinde belirli bir yönden esme sıklığına ne ad verilir?",
        "secenekler": [
          "Rüzgâr frekansı",
          "Rüzgâr gülü",
          "Hava basıncı",
          "Rüzgâr şiddeti"
        ],
        "dogru": 0,
        "cozum": "Rüzgâr frekansı, rüzgârın belirli bir yönden esme sıklığıdır (s.229)."
      },
      {
        "soru": "Rüzgârın adını ve yönünü gösteren levhaya ne ad verilir?",
        "secenekler": [
          "Rüzgâr gülü",
          "Rüzgâr frekansı",
          "Hektopaskal",
          "Erken uyarı sistemi"
        ],
        "dogru": 0,
        "cozum": "Rüzgâr gülü, rüzgârın adını ve yönünü gösteren levhadır (s.229)."
      },
      {
        "soru": "Sözlüğe göre \"topografik faktörler\" neyi ifade eder?",
        "secenekler": [
          "Arazi şekillerini",
          "İklim elemanlarını",
          "Toprak türlerini",
          "Bitki topluluklarını"
        ],
        "dogru": 0,
        "cozum": "Topografik faktörler: arazi şekilleri (s.229)."
      },
      {
        "soru": "Sözlüğe göre \"aya\" ne demektir?",
        "secenekler": [
          "Avuç içi",
          "Ayak tabanı",
          "El sırtı",
          "Parmak ucu"
        ],
        "dogru": 0,
        "cozum": "Aya: avuç içi (s.228)."
      },
      {
        "soru": "\"Unsur\" kelimesinin sözlükteki karşılığı hangisidir?",
        "secenekler": [
          "Öge",
          "Sınır",
          "Ölçüt",
          "Bölüm"
        ],
        "dogru": 0,
        "cozum": "Unsur: öge (s.229)."
      },
      {
        "soru": "\"Küresel salgın\" anlamına gelen kavram hangisidir?",
        "secenekler": [
          "Pandemi",
          "Maruziyet",
          "Rehabilitasyon",
          "Öngörü"
        ],
        "dogru": 0,
        "cozum": "Pandemi: küresel salgın (s.229)."
      },
      {
        "soru": "Metan gazının sözlükte geçen diğer adı nedir?",
        "secenekler": [
          "Bataklık gazı",
          "Karbondioksit",
          "Ozon",
          "Su buharı"
        ],
        "dogru": 0,
        "cozum": "Metan; renksiz bir gazdır, bataklık gazı (CH4) olarak da bilinir (s.229)."
      },
      {
        "soru": "Eşyaları taşımak için uluslararası standartlara göre yapılmış büyük kasa taşımalık hangisidir?",
        "secenekler": [
          "Konteyner",
          "Lojistik",
          "Güzergâh",
          "Dağıtım"
        ],
        "dogru": 0,
        "cozum": "Konteyner, tahtadan veya metalden yapılmış büyük kasa taşımalıktır (s.229)."
      },
      {
        "soru": "Herhangi bir toprak parçasını ayıran çizgiye ne ad verilir?",
        "secenekler": [
          "Sınır",
          "Levha",
          "Güzergâh",
          "Altyapı"
        ],
        "dogru": 0,
        "cozum": "Sınır: herhangi bir toprak parçasını ayıran çizgi (s.229)."
      },
      {
        "soru": "Yol, kanalizasyon, su, elektrik gibi tesisatın tümüne ne ad verilir?",
        "secenekler": [
          "Altyapı",
          "İmalat",
          "Sermaye",
          "Lojistik"
        ],
        "dogru": 0,
        "cozum": "Altyapı, bir yerleşim yeri veya yapı için gerekli tesisatın tümüdür (s.228)."
      },
      {
        "soru": "Uzaktan kumanda ile kontrol edilebilen, görüntü kaydı yapabilen insansız hava aracına ne ad verilir?",
        "secenekler": [
          "Drone",
          "Konteyner",
          "Rüzgâr gülü",
          "Erken uyarı sistemi"
        ],
        "dogru": 0,
        "cozum": "Drone, insansız hava araçlarıdır (s.228)."
      }
    ]
  },
  {
    "id": "bosluk",
    "baslik": "Boşluk doldur",
    "alt": "Sözlükteki tanımları tamamla",
    "yonerge": "Boşluğa gelecek kavramı yaz.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "bosluk",
    "cumleler": [
      {
        "metin": "{Neolitik}, tarım faaliyetlerinin başladığı tarih öncesi çağdır.",
        "kaynak": "s.229"
      },
      {
        "metin": "Mezolitik, Orta {Taş Çağı} olarak da bilinen, MÖ 22 bin-10 bin arasındaki dönemdir.",
        "kaynak": "s.229"
      },
      {
        "metin": "Maki, {Akdeniz} dolaylarında yaygın olan, bodur ağaç ve çalılardan oluşan bitki örtüsüdür.",
        "kaynak": "s.229"
      },
      {
        "metin": "Hektopaskal, 1 {milibara} eşit hava basıncı ölçü birimidir.",
        "kaynak": "s.228"
      },
      {
        "metin": "Levha, {yerkabuğunu} oluşturan parçalardan her biridir.",
        "kaynak": "s.229"
      },
      {
        "metin": "Astronomi, {gök bilimi} demektir.",
        "kaynak": "s.228"
      },
      {
        "metin": "Ortanca yaş, bireylerin yaşları küçükten büyüğe sıralandığında {ortada} kalan bireyin yaşıdır.",
        "kaynak": "s.229"
      }
    ]
  },
  {
    "id": "bulmaca",
    "baslik": "Çengel bulmaca",
    "alt": "Tanımlardan kavramları bul",
    "yonerge": "Sözlükteki tanımlara göre kavramları bulmacaya yerleştir.",
    "turSecenekleri": [
      6,
      9
    ],
    "tur": "bulmaca",
    "kelimeler": [
      {
        "cevap": "ALTYAPI",
        "ipucu": "Yol, kanalizasyon, su, elektrik vb. tesisatın tümü"
      },
      {
        "cevap": "ARKEOLOJİ",
        "ipucu": "Eski uygarlıklara ait eserleri araştıran bilim dalı"
      },
      {
        "cevap": "ASTRONOMİ",
        "ipucu": "Gök bilimi"
      },
      {
        "cevap": "HÖYÜK",
        "ipucu": "Kalıntıların üst üste yığılmasıyla oluşan tepecik"
      },
      {
        "cevap": "MAKİ",
        "ipucu": "Akdeniz dolaylarında bodur ağaç ve çalılardan oluşan bitki örtüsü"
      },
      {
        "cevap": "METAN",
        "ipucu": "Bataklık gazı (CH4)"
      },
      {
        "cevap": "NEOLİTİK",
        "ipucu": "Tarım faaliyetlerinin başladığı tarih öncesi çağ"
      },
      {
        "cevap": "PANDEMİ",
        "ipucu": "Küresel salgın"
      },
      {
        "cevap": "SERMAYE",
        "ipucu": "Bir işin kurulması için gereken anapara"
      },
      {
        "cevap": "KONTEYNER",
        "ipucu": "Uluslararası standartlarda büyük kasa taşımalık"
      },
      {
        "cevap": "LEVHA",
        "ipucu": "Yerkabuğunu oluşturan parçalardan her biri"
      },
      {
        "cevap": "SEYYAH",
        "ipucu": "Gezen, seyahat eden kimse"
      },
      {
        "cevap": "TÜKETİM",
        "ipucu": "Üretimle elde edilen mal ve hizmetlerin kullanılması"
      },
      {
        "cevap": "IŞIN",
        "ipucu": "Bir ışık kaynağından etrafa yayılan ışık demeti"
      }
    ]
  }
];
