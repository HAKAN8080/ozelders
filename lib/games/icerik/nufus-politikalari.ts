/**
 * 9. sınıf Coğrafya — 4.1.4 Nüfus Politikaları
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.158-165.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "kavramlar",
    "baslik": "Kavramlar",
    "alt": "Kavramı tanımıyla eşleştir",
    "yonerge": "Her kavramı kitaptaki açıklamasıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "nufus-politikasi",
        "sol": "Nüfus politikası",
        "sag": "Ülkelerin nüfusun yapısı, dağılışı, nitelik ve niceliğine yönelik karar ve uygulamaları"
      },
      {
        "id": "demografik-firsat-penceresi",
        "sol": "Demografik fırsat penceresi",
        "sag": "Çalışma çağındaki nüfus oranının bağımlı nüfus oranından yüksek olduğu dönem"
      },
      {
        "id": "bagimli-nufus",
        "sol": "Bağımlı nüfus",
        "sag": "Çocuk ve yaşlı nüfus"
      },
      {
        "id": "favela",
        "sol": "Favela",
        "sag": "Brezilya'da hızlı nüfus artışı ve kırdan kente göçle oluşan gecekondu yerleşmeleri"
      },
      {
        "id": "tuik",
        "sol": "TÜİK",
        "sag": "Resmî istatistik verileri toplayıp yayımlayan, Hazine ve Maliye Bakanlığıyla ilişkili kurum"
      },
      {
        "id": "cografi-istatistik-portali",
        "sol": "Coğrafi İstatistik Portali",
        "sag": "İstatistik verilerin mekânsal dağılışını gösteren haritalar sunar"
      },
      {
        "id": "istatistik-veri-portali",
        "sol": "İstatistik Veri Portali",
        "sag": "Farklı yıllara ait istatistiklerin raporlarını sunar"
      },
      {
        "id": "nufus-istatistikleri-portali",
        "sol": "Nüfus İstatistikleri Portali",
        "sag": "İstatistikleri harita, tablo ve grafik seçenekleriyle sunar"
      }
    ]
  },
  {
    "id": "politika-ulkeler",
    "baslik": "Politika ve ülkeler",
    "alt": "Ülkeyi uyguladığı politikaya yerleştir",
    "yonerge": "Kitapta verilen örnek ülkeleri nüfus politikası türüne göre grupla.",
    "turSecenekleri": [
      8,
      9
    ],
    "tur": "kategori",
    "kategoriler": [
      "Nüfus artış hızını azaltma",
      "Nüfus artış hızını artırma",
      "Ülke içindeki dağılışı düzenleme",
      "Göç alma politikası"
    ],
    "ogeler": [
      {
        "id": "nufus-artis-hizini-azaltma--afganistan",
        "ad": "Afganistan",
        "kategori": "Nüfus artış hızını azaltma"
      },
      {
        "id": "nufus-artis-hizini-azaltma--pakistan",
        "ad": "Pakistan",
        "kategori": "Nüfus artış hızını azaltma"
      },
      {
        "id": "nufus-artis-hizini-artirma--japonya",
        "ad": "Japonya",
        "kategori": "Nüfus artış hızını artırma"
      },
      {
        "id": "nufus-artis-hizini-artirma--isvec",
        "ad": "İsveç",
        "kategori": "Nüfus artış hızını artırma"
      },
      {
        "id": "ulke-icindeki-dagilisi-duzenleme--endonezya",
        "ad": "Endonezya",
        "kategori": "Ülke içindeki dağılışı düzenleme"
      },
      {
        "id": "ulke-icindeki-dagilisi-duzenleme--norvec",
        "ad": "Norveç",
        "kategori": "Ülke içindeki dağılışı düzenleme"
      },
      {
        "id": "ulke-icindeki-dagilisi-duzenleme--cin",
        "ad": "Çin",
        "kategori": "Ülke içindeki dağılışı düzenleme"
      },
      {
        "id": "goc-alma-politikasi--katar",
        "ad": "Katar",
        "kategori": "Göç alma politikası"
      },
      {
        "id": "goc-alma-politikasi--abd",
        "ad": "ABD",
        "kategori": "Göç alma politikası"
      }
    ]
  },
  {
    "id": "politika-amaclar",
    "baslik": "Politikaların amaçları",
    "alt": "Amacı doğru politikaya yerleştir",
    "yonerge": "Her amacı ait olduğu nüfus politikası türüne sürükle.",
    "turSecenekleri": [
      8,
      9
    ],
    "tur": "kategori",
    "kategoriler": [
      "Nüfus artış hızını azaltma",
      "Nüfus artış hızını artırma",
      "Ülke içindeki dağılışı düzenleme",
      "Demografik yapıyı iyileştirme"
    ],
    "ogeler": [
      {
        "id": "nufus-artis-hizini-azaltma--dogal-kaynaklarin-asiri-tuketimini-onlemek",
        "ad": "Doğal kaynakların aşırı tüketimini önlemek",
        "kategori": "Nüfus artış hızını azaltma"
      },
      {
        "id": "nufus-artis-hizini-azaltma--konut-acigi-ve-issizligin-onune-gecmek",
        "ad": "Konut açığı ve işsizliğin önüne geçmek",
        "kategori": "Nüfus artış hızını azaltma"
      },
      {
        "id": "nufus-artis-hizini-azaltma--carpik-kentlesmeyi-onlemek",
        "ad": "Çarpık kentleşmeyi önlemek",
        "kategori": "Nüfus artış hızını azaltma"
      },
      {
        "id": "nufus-artis-hizini-artirma--yasli-nufus-artisindan-dogan-is-gucu-acigini-gidermek",
        "ad": "Yaşlı nüfus artışından doğan iş gücü açığını gidermek",
        "kategori": "Nüfus artış hızını artırma"
      },
      {
        "id": "nufus-artis-hizini-artirma--nufusun-azalmasinin-neden-oldugu-sorunlari-en-aza-indirmek",
        "ad": "Nüfusun azalmasının neden olduğu sorunları en aza indirmek",
        "kategori": "Nüfus artış hızını artırma"
      },
      {
        "id": "ulke-icindeki-dagilisi-duzenleme--nufusu-buyuk-kentlerden-kucuk-kasaba-ve-koylere-dagitmak",
        "ad": "Nüfusu büyük kentlerden küçük kasaba ve köylere dağıtmak",
        "kategori": "Ülke içindeki dağılışı düzenleme"
      },
      {
        "id": "ulke-icindeki-dagilisi-duzenleme--nufus-yogunlugundaki-bolgesel-esitsizlikleri-gidermek",
        "ad": "Nüfus yoğunluğundaki bölgesel eşitsizlikleri gidermek",
        "kategori": "Ülke içindeki dağılışı düzenleme"
      },
      {
        "id": "demografik-yapiyi-iyilestirme--okuma-yazma-oranini-ve-egitim-seviyesini-yukseltmek",
        "ad": "Okuma yazma oranını ve eğitim seviyesini yükseltmek",
        "kategori": "Demografik yapıyı iyileştirme"
      },
      {
        "id": "demografik-yapiyi-iyilestirme--sanayi-ve-hizmet-sektorunde-calisanlarin-sayisini-artirmak",
        "ad": "Sanayi ve hizmet sektöründe çalışanların sayısını artırmak",
        "kategori": "Demografik yapıyı iyileştirme"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Sorular",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Her soru için doğru seçeneği işaretle.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Kitaba göre nüfus politikalarında temel hedef nedir?",
        "secenekler": [
          "Nüfusun artış hızının düzenlenmesi",
          "Yalnızca göçün durdurulması",
          "Kentleşmenin engellenmesi",
          "Doğal kaynakların artırılması"
        ],
        "dogru": 0,
        "cozum": "Nüfus politikalarında temel hedef, nüfusun artış hızının düzenlenmesidir (s.158)."
      },
      {
        "soru": "Gelişmiş ülkelerde doğum oranlarının azalmasının nedeni olarak kitapta hangisi verilmiştir?",
        "secenekler": [
          "Eğitim seviyesi, kentleşme oranı ve kadınların iş hayatına katılımının yüksek olması",
          "Sağlık hizmetlerinin yetersiz olması",
          "Bebek ölüm oranının yüksek olması",
          "Kırsal nüfusun fazla olması"
        ],
        "dogru": 0,
        "cozum": "Bu etkenler gelişmiş ülkelerde doğum oranlarının azalmasına neden olur (s.160)."
      },
      {
        "soru": "Nüfus artış hızı yüksek ülkelerde planlama yapılmazsa kitaba göre ne olur?",
        "secenekler": [
          "Kişi başına düşen millî gelir azalır",
          "Kalkınma hızı artar",
          "Yaşlı nüfus oranı artar",
          "İş gücü açığı oluşur"
        ],
        "dogru": 0,
        "cozum": "Aksi takdirde demografik yatırımlar yetersiz kalır, kişi başına millî gelir azalır (s.160)."
      },
      {
        "soru": "Hızlı nüfus artışı yaşayan ülkeler doğum oranlarını düşürmeyi başardığında hangi politikayı uygular?",
        "secenekler": [
          "Nüfusun nicelik ve niteliğini geliştirme",
          "Nüfus artış hızını artırma",
          "Göç verme",
          "Doğum oranlarını yeniden artırma"
        ],
        "dogru": 0,
        "cozum": "Bu ülkeler demografik yapıyı iyileştirmeye yönelik politika uygular (s.161)."
      },
      {
        "soru": "Hangi ülkeler nüfus politikalarına göç almaya yönelik uygulamaları dâhil eder?",
        "secenekler": [
          "Çalışma çağındaki nüfus oranı yetersiz, iş gücü ihtiyacı fazla olan ülkeler",
          "Nüfus artış hızı çok yüksek olan ülkeler",
          "Genç nüfus oranı fazla olan ülkeler",
          "İşsizlik oranı yüksek olan ülkeler"
        ],
        "dogru": 0,
        "cozum": "Almanya, Katar, ABD, Kanada ve Avustralya bu politikaya örnektir (s.161)."
      },
      {
        "soru": "Türkiye'de nüfus artış hızı hangi yıldan günümüze sürekli değişmiştir?",
        "secenekler": [
          "1935",
          "1923",
          "1950",
          "1980"
        ],
        "dogru": 0,
        "cozum": "Türkiye'de nüfus artış hızı 1935 yılından günümüze sürekli değişmiştir (s.163)."
      },
      {
        "soru": "Atatürk'ün 1 Mart 1922 tarihli sözünde genel sağlık konusunda izlenen gayelerden biri hangisidir?",
        "secenekler": [
          "Nüfusun çoğaltılması",
          "Nüfus artış hızının azaltılması",
          "Dış göçün teşvik edilmesi",
          "Kentleşmenin durdurulması"
        ],
        "dogru": 0,
        "cozum": "Atatürk, milletin sıhhatinin korunması ve nüfusun çoğaltılmasını hedef olarak belirtmiştir (s.163)."
      },
      {
        "soru": "TÜİK 2025 verilerine göre Türkiye'nin ortanca yaşı kaçtır?",
        "secenekler": [
          "34,9",
          "24,9",
          "29,5",
          "40,2"
        ],
        "dogru": 0,
        "cozum": "Türkiye'nin ortanca yaşı 34,9'dur (s.164)."
      },
      {
        "soru": "TÜİK 2025 verilerine göre Türkiye'nin toplam doğurganlık hızı kaçtır?",
        "secenekler": [
          "1,62",
          "1,26",
          "2,10",
          "2,62"
        ],
        "dogru": 0,
        "cozum": "Türkiye'nin toplam doğurganlık hızı 1,62'dir (s.164)."
      },
      {
        "soru": "TÜİK hangi bakanlıkla ilişkili bir araştırma kurumudur?",
        "secenekler": [
          "Hazine ve Maliye Bakanlığı",
          "İçişleri Bakanlığı",
          "Millî Eğitim Bakanlığı",
          "Sağlık Bakanlığı"
        ],
        "dogru": 0,
        "cozum": "TÜİK, T.C. Hazine ve Maliye Bakanlığıyla ilişkilidir (s.165)."
      }
    ]
  },
  {
    "id": "bosluk",
    "baslik": "Boşluk doldur",
    "alt": "Kitaptaki cümleleri tamamla",
    "yonerge": "Cümlelerdeki boşluğa gelecek kavramı ya da sayıyı yaz.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "bosluk",
    "cumleler": [
      {
        "metin": "Ülkelerin nüfusun yapısı, dağılışı, nitelik ve niceliğine yönelik aldığı karar ve uygulamalara {nüfus politikası} denir.",
        "kaynak": "s.158"
      },
      {
        "metin": "Nüfus politikalarında temel hedef, nüfusun {artış hızının} düzenlenmesidir.",
        "kaynak": "s.158"
      },
      {
        "metin": "Yaşlı nüfus oranının artması, {iş gücü} açığına neden olarak ülke ekonomisini olumsuz etkiler.",
        "kaynak": "s.160"
      },
      {
        "metin": "Almanya, Katar, ABD, Kanada ve Avustralya {göç alma} politikası uygulayan ülkelere örnektir.",
        "kaynak": "s.161"
      },
      {
        "metin": "Hızlı nüfus artışı ve kırdan kente göç sonucunda Brezilya'da {Favela} olarak adlandırılan gecekondu yerleşmeleri ortaya çıkmıştır.",
        "kaynak": "s.161"
      },
      {
        "metin": "Türkiye'de nüfus artış hızı, {1935} yılından günümüze sürekli değişmiş ve nüfus politikalarının belirlenmesinde etkili olmuştur.",
        "kaynak": "s.163"
      },
      {
        "metin": "TÜİK, T.C. {Hazine ve Maliye} Bakanlığıyla ilişkili bir araştırma kurumudur.",
        "kaynak": "s.165"
      }
    ]
  }
];
