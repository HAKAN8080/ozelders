/**
 * 9. sınıf Coğrafya — 4.1.3 Demografik Dönüşüm Süreci ve Nüfus Piramitleri
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.154-157.
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
        "id": "nufus-piramidi",
        "sol": "Nüfus piramidi",
        "sag": "Bir yerin nüfusunun yaş gruplarına ve cinsiyete göre dağılımını gösterir"
      },
      {
        "id": "0-14-yas",
        "sol": "0-14 yaş",
        "sag": "Çocuk nüfus"
      },
      {
        "id": "15-64-yas",
        "sol": "15-64 yaş",
        "sag": "Aktif nüfus veya çalışma çağındaki nüfus"
      },
      {
        "id": "65-yas-ve-ustu",
        "sol": "65 yaş ve üstü",
        "sag": "Yaşlı nüfus"
      },
      {
        "id": "genis-piramit-tabani",
        "sol": "Geniş piramit tabanı",
        "sag": "Gelişmekte olan ülkelerde genç nüfus oranının fazla olduğunu gösterir"
      },
      {
        "id": "dar-piramit-tabani",
        "sol": "Dar piramit tabanı",
        "sag": "Nüfus artış hızının az olduğu ülkelerde görülür"
      },
      {
        "id": "dogal-nufus-artisi",
        "sol": "Doğal nüfus artışı",
        "sag": "Belirli bir dönemde doğum ve ölüm oranları arasındaki farka bağlı nüfus değişimi"
      },
      {
        "id": "demografik-donusum-modeli",
        "sol": "Demografik dönüşüm modeli",
        "sag": "Ekonomik ve sosyal gelişmelere göre doğal nüfus artış hızının değişimini açıklar"
      }
    ]
  },
  {
    "id": "asamalar",
    "baslik": "Dönüşüm aşamaları",
    "alt": "Özelliği doğru aşamaya yerleştir",
    "yonerge": "Her özelliği demografik dönüşüm modelinin ilgili aşamasına sürükle.",
    "turSecenekleri": [
      8,
      10
    ],
    "tur": "kategori",
    "kategoriler": [
      "1. Aşama",
      "2. Aşama",
      "3. Aşama",
      "4. Aşama",
      "5. Aşama"
    ],
    "ogeler": [
      {
        "id": "1-asama--sanayi-oncesi-toplumlarda-gorulur",
        "ad": "Sanayi öncesi toplumlarda görülür",
        "kategori": "1. Aşama"
      },
      {
        "id": "1-asama--ortalama-omur-kisa-bebek-olum-orani-yuksektir",
        "ad": "Ortalama ömür kısa, bebek ölüm oranı yüksektir",
        "kategori": "1. Aşama"
      },
      {
        "id": "2-asama--sanayilesmenin-ilk-donemlerini-yasayan-toplumlarda-gorulur",
        "ad": "Sanayileşmenin ilk dönemlerini yaşayan toplumlarda görülür",
        "kategori": "2. Aşama"
      },
      {
        "id": "2-asama--dogum-orani-yuksekken-olum-oranlari-dusmeye-baslamistir",
        "ad": "Doğum oranı yüksekken ölüm oranları düşmeye başlamıştır",
        "kategori": "2. Aşama"
      },
      {
        "id": "3-asama--olum-oranlari-dusukken-dogum-oranlari-dusmeye-baslar",
        "ad": "Ölüm oranları düşükken doğum oranları düşmeye başlar",
        "kategori": "3. Aşama"
      },
      {
        "id": "3-asama--kentlesme-egitim-ve-kadinlarin-calisma-hayatina-girmesi-dogumlari-azaltir",
        "ad": "Kentleşme, eğitim ve kadınların çalışma hayatına girmesi doğumları azaltır",
        "kategori": "3. Aşama"
      },
      {
        "id": "4-asama--sanayi-sonrasi-toplumlarda-gorulur",
        "ad": "Sanayi sonrası toplumlarda görülür",
        "kategori": "4. Aşama"
      },
      {
        "id": "4-asama--dogum-oranlarinin-hizla-azalmasiyla-nufus-artis-hizi-cok-dusuktur",
        "ad": "Doğum oranlarının hızla azalmasıyla nüfus artış hızı çok düşüktür",
        "kategori": "4. Aşama"
      },
      {
        "id": "5-asama--nufusta-azalma-gorulur",
        "ad": "Nüfusta azalma görülür",
        "kategori": "5. Aşama"
      },
      {
        "id": "5-asama--yasli-nufus-fazla-oldugu-icin-olum-oranlari-biraz-daha-yuksektir",
        "ad": "Yaşlı nüfus fazla olduğu için ölüm oranları biraz daha yüksektir",
        "kategori": "5. Aşama"
      }
    ]
  },
  {
    "id": "dogum-orani",
    "baslik": "Doğum oranı",
    "alt": "Ülkeleri doğum oranına göre sırala",
    "yonerge": "Ülkeleri doğum oranına (‰) göre düşükten yükseğe sırala.",
    "turSecenekleri": [
      4,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Japonya",
        "anahtar": 6.9,
        "etiket": "‰6,9"
      },
      {
        "id": "s1",
        "ad": "Kanada",
        "anahtar": 10.0,
        "etiket": "‰10,0"
      },
      {
        "id": "s2",
        "ad": "Meksika",
        "anahtar": 14.3,
        "etiket": "‰14,3"
      },
      {
        "id": "s3",
        "ad": "Etiyopya",
        "anahtar": 29.6,
        "etiket": "‰29,6"
      }
    ],
    "uclar": [
      "En düşük",
      "En yüksek"
    ]
  },
  {
    "id": "ortalama-omur",
    "baslik": "Ortalama ömür",
    "alt": "Ülkeleri ortalama ömre göre sırala",
    "yonerge": "Ülkeleri ortalama ömre göre kısadan uzuna sırala.",
    "turSecenekleri": [
      4,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Etiyopya",
        "anahtar": 67,
        "etiket": "67"
      },
      {
        "id": "s1",
        "ad": "Meksika",
        "anahtar": 74,
        "etiket": "74"
      },
      {
        "id": "s2",
        "ad": "Kanada",
        "anahtar": 84,
        "etiket": "84"
      },
      {
        "id": "s3",
        "ad": "Japonya",
        "anahtar": 85,
        "etiket": "85"
      }
    ],
    "uclar": [
      "En kısa",
      "En uzun"
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
        "soru": "Kitaba göre gelişmiş ülkelerin nüfus yapısıyla ilgili hangisi doğrudur?",
        "secenekler": [
          "Yaşlı nüfusun toplam nüfus içindeki oranı fazladır",
          "Piramit tabanı geniştir",
          "Genç nüfusun oranı fazladır",
          "Ortalama yaşam süresi kısadır"
        ],
        "dogru": 0,
        "cozum": "Gelişmiş ülkelerde ortalama yaşam süresi uzun, yaşlı nüfus oranı fazladır (s.154)."
      },
      {
        "soru": "Demografik dönüşüm modeli hangi ülkelerin nüfuslanma sürecini yansıtır?",
        "secenekler": [
          "İngiltere, Fransa ve Almanya",
          "ABD, Kanada ve Avustralya",
          "Japonya, Çin ve Hindistan",
          "İtalya, İspanya ve Portekiz"
        ],
        "dogru": 0,
        "cozum": "Model, aşamaların gözlendiği İngiltere, Fransa ve Almanya'nın sürecini yansıtır (s.155)."
      },
      {
        "soru": "Demografik dönüşüm modelinde hangisinin nüfus üzerindeki etkisi göz ardı edilir?",
        "secenekler": [
          "Göç",
          "Doğum oranı",
          "Ölüm oranı",
          "Doğal nüfus artışı"
        ],
        "dogru": 0,
        "cozum": "Modelde göçün etkisi göz ardı edilerek doğal nüfus artışına odaklanılır (s.155)."
      },
      {
        "soru": "Günümüzde demografik dönüşüm modelinin 1. aşamasında olan ülkelerle ilgili hangisi doğrudur?",
        "secenekler": [
          "Bu aşamada olan ülke yoktur",
          "Gelişmekte olan ülkelerin çoğu bu aşamadadır",
          "Sanayi sonrası toplumlar bu aşamadadır",
          "Avrupa ülkeleri bu aşamadadır"
        ],
        "dogru": 0,
        "cozum": "Günümüzde 1. aşamada olan ülke yoktur (s.155)."
      },
      {
        "soru": "Gelişmekte olan ülkelerde demografik dönüşüm modelinin hangi aşamalarının özellikleri görülür?",
        "secenekler": [
          "2 veya 3. aşama",
          "1 veya 2. aşama",
          "4 veya 5. aşama",
          "Yalnızca 5. aşama"
        ],
        "dogru": 0,
        "cozum": "Gelişmekte olan ülkelerde 2 veya 3. aşamanın özellikleri görülmektedir (s.155)."
      },
      {
        "soru": "Demografik dönüşüm modelinin hangi aşamasında nüfusta azalma görülür?",
        "secenekler": [
          "5. aşama",
          "2. aşama",
          "3. aşama",
          "1. aşama"
        ],
        "dogru": 0,
        "cozum": "5. aşamada doğum oranı çok düşük, genç nüfus oranı düşüktür ve nüfus azalır (s.155)."
      },
      {
        "soru": "2. aşamada nüfus artış hızının yüksek olmasında hangisi etkilidir?",
        "secenekler": [
          "Sağlık hizmetlerinin gelişmesi ve bebek ölümlerinin düşmesi",
          "Kadınların çalışma hayatına girmesi",
          "Doğum oranlarının hızla azalması",
          "Yaşlı nüfus oranının artması"
        ],
        "dogru": 0,
        "cozum": "Beslenme koşulları, sağlık hizmetleri ve bebek ölümlerindeki düşüş etkilidir (s.155)."
      },
      {
        "soru": "Kitaptaki tabloya göre doğurganlık hızı en yüksek ülke hangisidir?",
        "secenekler": [
          "Etiyopya",
          "Meksika",
          "Japonya",
          "Kanada"
        ],
        "dogru": 0,
        "cozum": "Etiyopya'nın doğurganlık hızı 3,84'tür (s.156)."
      },
      {
        "soru": "Kitaptaki tabloya göre nüfus artış hızı eksi (-0,43) olan ülke hangisidir?",
        "secenekler": [
          "Japonya",
          "Kanada",
          "Meksika",
          "Etiyopya"
        ],
        "dogru": 0,
        "cozum": "Japonya'nın nüfus artış hızı -0,43'tür (s.156)."
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
        "metin": "Bir yerin nüfusunun yaş gruplarına ve cinsiyete göre dağılımını gösterebilmek için {nüfus piramitleri} oluşturulur.",
        "kaynak": "s.154"
      },
      {
        "metin": "15-64 yaş, aktif nüfus veya {çalışma çağındaki} nüfustur.",
        "kaynak": "s.154"
      },
      {
        "metin": "Gelişmekte olan ülkelerde piramit {tabanı} geniştir.",
        "kaynak": "s.154"
      },
      {
        "metin": "Demografik dönüşüm modeli {beş} gelişim aşamasından oluşur.",
        "kaynak": "s.155"
      },
      {
        "metin": "1. aşamada doğum ve ölüm oranları {yüksek}, nüfus artış hızı çok düşüktür.",
        "kaynak": "s.155"
      },
      {
        "metin": "2. aşama, {sanayileşmenin} ilk dönemlerini yaşayan toplumlarda görülür.",
        "kaynak": "s.155"
      },
      {
        "metin": "4. aşama, {sanayi sonrası} toplumlarda görülür.",
        "kaynak": "s.155"
      },
      {
        "metin": "Gelişmekte olan ülkelerde {2 veya 3}. aşamanın özellikleri görülmektedir.",
        "kaynak": "s.155"
      }
    ]
  },
  {
    "id": "bulmaca",
    "baslik": "Çengel bulmaca",
    "alt": "Tanımlardan kavramları bul",
    "yonerge": "İpuçlarına göre kelimeleri bulmacaya yerleştir.",
    "turSecenekleri": [
      6,
      9
    ],
    "tur": "bulmaca",
    "kelimeler": [
      {
        "cevap": "Piramit",
        "ipucu": "Nüfusun yaş ve cinsiyete göre dağılımını gösteren grafik"
      },
      {
        "cevap": "Yaşlı",
        "ipucu": "65 yaş ve üstü nüfus"
      },
      {
        "cevap": "Aktif",
        "ipucu": "15-64 yaş arası nüfus (... nüfus)"
      },
      {
        "cevap": "Çocuk",
        "ipucu": "0-14 yaş arası nüfus"
      },
      {
        "cevap": "Taban",
        "ipucu": "Gelişmekte olan ülkelerde piramidin geniş olan kısmı"
      },
      {
        "cevap": "Kentleşme",
        "ipucu": "3. aşamada doğum oranının azalmasında etkili olan süreç"
      },
      {
        "cevap": "Göç",
        "ipucu": "Demografik dönüşüm modelinde etkisi göz ardı edilen nüfus hareketi"
      },
      {
        "cevap": "İngiltere",
        "ipucu": "Modelin nüfuslanma sürecini yansıttığı ülkelerden biri"
      },
      {
        "cevap": "Etiyopya",
        "ipucu": "Tabloda doğum oranı en yüksek ülke"
      },
      {
        "cevap": "Japonya",
        "ipucu": "Tabloda ortalama ömrü en uzun ülke"
      }
    ]
  }
];
