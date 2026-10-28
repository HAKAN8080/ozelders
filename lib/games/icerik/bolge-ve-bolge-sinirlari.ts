/**
 * 9. sınıf Coğrafya — 7.1.1-7.1.3 Bölge ve Bölge Sınırı
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.217-224.
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
        "id": "bolge",
        "sol": "Bölge",
        "sag": "Yeryüzünün doğal ve beşerî unsurlar bakımından kendi içinde benzerlik gösteren parçaları"
      },
      {
        "id": "bolge-belirleme-kriterleri",
        "sol": "Bölge belirleme kriterleri",
        "sag": "Bölge türlerini oluşturmada kullanılan ölçüt ve amaçlar"
      },
      {
        "id": "sekilsel-bolge",
        "sol": "Şekilsel bölge",
        "sag": "Doğal ve beşerî özellikleriyle diğer alanlardan ayrılan, belirli bir merkezi olmayan bölge"
      },
      {
        "id": "islevsel-fonksiyonel-bolge",
        "sol": "İşlevsel (fonksiyonel) bölge",
        "sag": "Ekonomik ve kültürel yönden yerel, ulusal ve küresel çapta diğer bölgelerle etkileşim gösteren bölge"
      },
      {
        "id": "dogal-sekilsel-bolge",
        "sol": "Doğal şekilsel bölge",
        "sag": "Doğal unsurların dağılışı esas alınarak oluşturulan yer şekilleri, iklim, toprak, bitki gibi bölgeler"
      },
      {
        "id": "beseri-sekilsel-bolge",
        "sol": "Beşerî şekilsel bölge",
        "sag": "Ham madde, üretim, nüfus, yerleşme, kültür gibi beşerî ve ekonomik unsurların esas alındığı bölge"
      },
      {
        "id": "metropoliten-alan",
        "sol": "Metropoliten alan",
        "sag": "Belirli bir şehirsel yönetimin yetkisi altındaki tüm araziyi içeren işlevsel bölge"
      },
      {
        "id": "odak-noktasi",
        "sol": "Odak noktası",
        "sag": "İşlevsel bölgenin merkezî kavşağı; bir şehir, havaalanı veya alışveriş merkezi olabilir"
      },
      {
        "id": "bolge-siniri",
        "sol": "Bölge sınırı",
        "sag": "Bölge belirlemede esas alınan kriterlere göre belirlenen sınır"
      }
    ]
  },
  {
    "id": "bolge-turleri",
    "baslik": "Bölge türleri",
    "alt": "Örnek bölgeyi türüne yerleştir",
    "yonerge": "Kitapta verilen örnek bölgeleri ait oldukları bölge türüne yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Doğal şekilsel bölge",
      "Beşerî şekilsel bölge",
      "İşlevsel bölge"
    ],
    "ogeler": [
      {
        "id": "dogal-sekilsel-bolge--orta-toroslar-daglik-bolgesi",
        "ad": "Orta Toroslar dağlık bölgesi",
        "kategori": "Doğal şekilsel bölge"
      },
      {
        "id": "dogal-sekilsel-bolge--akdeniz-iklim-bolgesi",
        "ad": "Akdeniz iklim bölgesi",
        "kategori": "Doğal şekilsel bölge"
      },
      {
        "id": "dogal-sekilsel-bolge--kizilirmak-nehri-havzasi",
        "ad": "Kızılırmak Nehri Havzası",
        "kategori": "Doğal şekilsel bölge"
      },
      {
        "id": "dogal-sekilsel-bolge--cernezyom-toprak-tipi-bolgesi",
        "ad": "Çernezyom toprak tipi bölgesi",
        "kategori": "Doğal şekilsel bölge"
      },
      {
        "id": "dogal-sekilsel-bolge--bozkir-bitki-ortusu-bolgesi",
        "ad": "Bozkır bitki örtüsü bölgesi",
        "kategori": "Doğal şekilsel bölge"
      },
      {
        "id": "beseri-sekilsel-bolge--turkiye-nin-seyrek-nufuslu-bolgeleri",
        "ad": "Türkiye'nin seyrek nüfuslu bölgeleri",
        "kategori": "Beşerî şekilsel bölge"
      },
      {
        "id": "beseri-sekilsel-bolge--turkiye-nin-daginik-kirsal-yerlesme-bolgeleri",
        "ad": "Türkiye'nin dağınık kırsal yerleşme bölgeleri",
        "kategori": "Beşerî şekilsel bölge"
      },
      {
        "id": "beseri-sekilsel-bolge--turk-kultur-bolgesi",
        "ad": "Türk kültür bölgesi",
        "kategori": "Beşerî şekilsel bölge"
      },
      {
        "id": "beseri-sekilsel-bolge--turkiye-nin-pamuk-uretim-bolgeleri",
        "ad": "Türkiye'nin pamuk üretim bölgeleri",
        "kategori": "Beşerî şekilsel bölge"
      },
      {
        "id": "islevsel-bolge--metropoliten-alan",
        "ad": "Metropoliten alan",
        "kategori": "İşlevsel bölge"
      },
      {
        "id": "islevsel-bolge--gunluk-bir-gazetenin-tiraj-alani",
        "ad": "Günlük bir gazetenin tiraj alanı",
        "kategori": "İşlevsel bölge"
      },
      {
        "id": "islevsel-bolge--rotterdam-limani-nin-tasimacilik-bolgesi",
        "ad": "Rotterdam Limanı'nın taşımacılık bölgesi",
        "kategori": "İşlevsel bölge"
      }
    ]
  },
  {
    "id": "kriterler",
    "baslik": "Bölge belirleme kriterleri",
    "alt": "Kriteri doğal ya da beşerî unsur olarak ayır",
    "yonerge": "Bölge belirlemede kullanılan kriterleri doğal (fiziki) ve beşerî unsurlar olarak grupla.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Doğal (fiziki) unsur",
      "Beşerî unsur"
    ],
    "ogeler": [
      {
        "id": "dogal-fiziki-unsur--yer-sekilleri",
        "ad": "Yer şekilleri",
        "kategori": "Doğal (fiziki) unsur"
      },
      {
        "id": "dogal-fiziki-unsur--iklim",
        "ad": "İklim",
        "kategori": "Doğal (fiziki) unsur"
      },
      {
        "id": "dogal-fiziki-unsur--bitki-ortusu",
        "ad": "Bitki örtüsü",
        "kategori": "Doğal (fiziki) unsur"
      },
      {
        "id": "dogal-fiziki-unsur--su-hidrografik",
        "ad": "Su (hidrografik)",
        "kategori": "Doğal (fiziki) unsur"
      },
      {
        "id": "dogal-fiziki-unsur--toprak",
        "ad": "Toprak",
        "kategori": "Doğal (fiziki) unsur"
      },
      {
        "id": "dogal-fiziki-unsur--afet",
        "ad": "Afet",
        "kategori": "Doğal (fiziki) unsur"
      },
      {
        "id": "beseri-unsur--nufus",
        "ad": "Nüfus",
        "kategori": "Beşerî unsur"
      },
      {
        "id": "beseri-unsur--yerlesme",
        "ad": "Yerleşme",
        "kategori": "Beşerî unsur"
      },
      {
        "id": "beseri-unsur--sanayi",
        "ad": "Sanayi",
        "kategori": "Beşerî unsur"
      },
      {
        "id": "beseri-unsur--tarim",
        "ad": "Tarım",
        "kategori": "Beşerî unsur"
      },
      {
        "id": "beseri-unsur--turizm",
        "ad": "Turizm",
        "kategori": "Beşerî unsur"
      },
      {
        "id": "beseri-unsur--ham-madde",
        "ad": "Ham madde",
        "kategori": "Beşerî unsur"
      },
      {
        "id": "beseri-unsur--kultur",
        "ad": "Kültür",
        "kategori": "Beşerî unsur"
      },
      {
        "id": "beseri-unsur--askeri-is-birligi",
        "ad": "Askerî iş birliği",
        "kategori": "Beşerî unsur"
      }
    ]
  },
  {
    "id": "ab-uyelik",
    "baslik": "Avrupa Birliği sınırları",
    "alt": "Ülkeyi AB'ye katıldığı döneme yerleştir",
    "yonerge": "Ülkeleri Avrupa Birliği'ne (ve öncesindeki topluluklara) katıldıkları döneme ya da aday ülkeler grubuna yerleştir.",
    "turSecenekleri": [
      10,
      15
    ],
    "tur": "kategori",
    "kategoriler": [
      "Kurucu (1951)",
      "1973-1986 arası katılan",
      "1995'te katılan",
      "2004-2013 arası katılan",
      "Aday ülke"
    ],
    "ogeler": [
      {
        "id": "kurucu-1951--belcika",
        "ad": "Belçika",
        "kategori": "Kurucu (1951)"
      },
      {
        "id": "kurucu-1951--almanya",
        "ad": "Almanya",
        "kategori": "Kurucu (1951)"
      },
      {
        "id": "kurucu-1951--luksemburg",
        "ad": "Lüksemburg",
        "kategori": "Kurucu (1951)"
      },
      {
        "id": "kurucu-1951--fransa",
        "ad": "Fransa",
        "kategori": "Kurucu (1951)"
      },
      {
        "id": "kurucu-1951--italya",
        "ad": "İtalya",
        "kategori": "Kurucu (1951)"
      },
      {
        "id": "kurucu-1951--hollanda",
        "ad": "Hollanda",
        "kategori": "Kurucu (1951)"
      },
      {
        "id": "1973-1986-arasi-katilan--danimarka",
        "ad": "Danimarka",
        "kategori": "1973-1986 arası katılan"
      },
      {
        "id": "1973-1986-arasi-katilan--irlanda",
        "ad": "İrlanda",
        "kategori": "1973-1986 arası katılan"
      },
      {
        "id": "1973-1986-arasi-katilan--yunanistan",
        "ad": "Yunanistan",
        "kategori": "1973-1986 arası katılan"
      },
      {
        "id": "1973-1986-arasi-katilan--ispanya",
        "ad": "İspanya",
        "kategori": "1973-1986 arası katılan"
      },
      {
        "id": "1973-1986-arasi-katilan--portekiz",
        "ad": "Portekiz",
        "kategori": "1973-1986 arası katılan"
      },
      {
        "id": "1995-te-katilan--avusturya",
        "ad": "Avusturya",
        "kategori": "1995'te katılan"
      },
      {
        "id": "1995-te-katilan--finlandiya",
        "ad": "Finlandiya",
        "kategori": "1995'te katılan"
      },
      {
        "id": "1995-te-katilan--isvec",
        "ad": "İsveç",
        "kategori": "1995'te katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--cekya",
        "ad": "Çekya",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--estonya",
        "ad": "Estonya",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--letonya",
        "ad": "Letonya",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--litvanya",
        "ad": "Litvanya",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--macaristan",
        "ad": "Macaristan",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--malta",
        "ad": "Malta",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--polonya",
        "ad": "Polonya",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--slovakya",
        "ad": "Slovakya",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--slovenya",
        "ad": "Slovenya",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--bulgaristan",
        "ad": "Bulgaristan",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--romanya",
        "ad": "Romanya",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "2004-2013-arasi-katilan--hirvatistan",
        "ad": "Hırvatistan",
        "kategori": "2004-2013 arası katılan"
      },
      {
        "id": "aday-ulke--turkiye",
        "ad": "Türkiye",
        "kategori": "Aday ülke"
      },
      {
        "id": "aday-ulke--kuzey-makedonya",
        "ad": "Kuzey Makedonya",
        "kategori": "Aday ülke"
      },
      {
        "id": "aday-ulke--karadag",
        "ad": "Karadağ",
        "kategori": "Aday ülke"
      },
      {
        "id": "aday-ulke--sirbistan",
        "ad": "Sırbistan",
        "kategori": "Aday ülke"
      },
      {
        "id": "aday-ulke--arnavutluk",
        "ad": "Arnavutluk",
        "kategori": "Aday ülke"
      },
      {
        "id": "aday-ulke--ukrayna",
        "ad": "Ukrayna",
        "kategori": "Aday ülke"
      },
      {
        "id": "aday-ulke--moldova",
        "ad": "Moldova",
        "kategori": "Aday ülke"
      },
      {
        "id": "aday-ulke--gurcistan",
        "ad": "Gürcistan",
        "kategori": "Aday ülke"
      },
      {
        "id": "aday-ulke--bosna-hersek",
        "ad": "Bosna Hersek",
        "kategori": "Aday ülke"
      }
    ]
  },
  {
    "id": "ab-tarihce",
    "baslik": "AB'nin tarihçesi",
    "alt": "Olayları kronolojik sıraya diz",
    "yonerge": "Avrupa Birliği sınırlarının değişimine ilişkin olayları en eskiden en yeniye sırala.",
    "turSecenekleri": [
      6,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Avrupa Kömür ve Çelik Topluluğu (AKÇT) kuruldu",
        "anahtar": 1951,
        "etiket": "1951"
      },
      {
        "id": "s1",
        "ad": "Roma Anlaşması ile Avrupa Ekonomik Topluluğu (AET) kuruldu",
        "anahtar": 1957,
        "etiket": "1957"
      },
      {
        "id": "s2",
        "ad": "Topluluk, Avrupa Toplulukları adıyla anılmaya başladı",
        "anahtar": 1965,
        "etiket": "1965"
      },
      {
        "id": "s3",
        "ad": "Birleşik Krallık, Danimarka ve İrlanda katıldı",
        "anahtar": 1973,
        "etiket": "1973"
      },
      {
        "id": "s4",
        "ad": "Yunanistan katıldı",
        "anahtar": 1981,
        "etiket": "1981"
      },
      {
        "id": "s5",
        "ad": "İspanya ve Portekiz katıldı, üye sayısı 12 oldu",
        "anahtar": 1986,
        "etiket": "1986"
      },
      {
        "id": "s6",
        "ad": "Maastricht Anlaşması yürürlüğe girdi",
        "anahtar": 1993,
        "etiket": "1993"
      },
      {
        "id": "s7",
        "ad": "Avrupa Birliği yapısı oluştu; Avusturya, Finlandiya ve İsveç katıldı",
        "anahtar": 1995,
        "etiket": "1995"
      },
      {
        "id": "s8",
        "ad": "Polonya, Macaristan, Malta gibi 10 ülke üye oldu",
        "anahtar": 2004,
        "etiket": "2004"
      },
      {
        "id": "s9",
        "ad": "Bulgaristan ve Romanya üye oldu",
        "anahtar": 2007,
        "etiket": "2007"
      },
      {
        "id": "s10",
        "ad": "Hırvatistan üye oldu",
        "anahtar": 2013,
        "etiket": "2013"
      },
      {
        "id": "s11",
        "ad": "Birleşik Krallık Avrupa Birliği'nden ayrıldı",
        "anahtar": 2020,
        "etiket": "2020"
      }
    ],
    "uclar": [
      "En eski",
      "En yeni"
    ]
  },
  {
    "id": "sorular",
    "baslik": "Sorular",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Doğru seçeneği işaretle.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Aşağıdakilerden hangisi bölge belirleme kriterlerinden fiziki unsurlara örnektir?",
        "secenekler": [
          "Bitki örtüsü",
          "Turizm",
          "Sanayi",
          "Yerleşme"
        ],
        "dogru": 0,
        "cozum": "Fiziki unsurlar yer şekilleri, iklim, bitki örtüsü vb.dir; nüfus, yerleşme, sanayi, tarım, turizm beşerî unsurlardır (s.217)."
      },
      {
        "soru": "Belirli bir merkezi olmayan ve içindeki her yerin belirlenen kritere göre aynı özelliğe sahip olduğu bölge türü hangisidir?",
        "secenekler": [
          "Şekilsel bölge",
          "İşlevsel bölge",
          "Fonksiyonel bölge",
          "Metropoliten alan"
        ],
        "dogru": 0,
        "cozum": "Şekilsel bölgelerin belirli bir merkezi yoktur; bölge içindeki her yer aynı özelliğe sahiptir (s.219)."
      },
      {
        "soru": "Aşağıdakilerden hangisi kitapta beşerî şekilsel bölge örneği olarak verilmiştir?",
        "secenekler": [
          "Türkiye'nin pamuk üretim bölgeleri",
          "Kızılırmak Nehri Havzası",
          "Akdeniz iklim bölgesi",
          "Orta Toroslar dağlık bölgesi"
        ],
        "dogru": 0,
        "cozum": "Pamuk üretim bölgeleri beşerî şekilsel; diğerleri doğal şekilsel bölge örnekleridir (s.219)."
      },
      {
        "soru": "İşlevsel bölgelerde etkileşimin yoğunluğu nasıl değişir?",
        "secenekler": [
          "Odak noktasından uzaklaştıkça azalır",
          "Odak noktasından uzaklaştıkça artar",
          "Bölgenin her yerinde aynıdır",
          "Yalnızca bölge sınırında yoğunlaşır"
        ],
        "dogru": 0,
        "cozum": "Etkileşimin yoğunluğu odak noktasından uzaklaştıkça azalır (s.219)."
      },
      {
        "soru": "Kitapta büyük bir taşımacılık bölgesine sahip işlevsel bölge örneği olarak hangi liman verilmiştir?",
        "secenekler": [
          "Rotterdam Limanı",
          "Hamburg Limanı",
          "Mersin Limanı",
          "Marsilya Limanı"
        ],
        "dogru": 0,
        "cozum": "Rotterdam Limanı'ndan uzaklaştıkça limanın etki alanı zayıflar (s.219)."
      },
      {
        "soru": "Günlük bir gazetenin tiraj alanı hangi özelliğe örnek olarak verilmiştir?",
        "secenekler": [
          "Tüm işlevsel bölgelerin sabit ve kesin sınırları olmaması",
          "Şekilsel bölgelerin merkezinin olmaması",
          "Doğal şekilsel bölge sınırlarının uzun sürede değişmesi",
          "Bölge içindeki her yerin aynı özelliğe sahip olması"
        ],
        "dogru": 0,
        "cozum": "Gazetenin satış alanı rakiplerle çakışabilir, gün içinde bile değişebilir (s.219)."
      },
      {
        "soru": "Muson iklim bölgesinin sınırı, step iklim bölgesinin sınırına göre neden daha az alan kaplar?",
        "secenekler": [
          "Muson ikliminin etkili olduğu alan daha az olduğu için",
          "Muson iklimi bir beşerî kriter olduğu için",
          "Muson iklim bölgesi işlevsel bir bölge olduğu için",
          "Step iklimi yalnızca Türkiye'de görüldüğü için"
        ],
        "dogru": 0,
        "cozum": "Belirlenen kriterin özelliği bölgenin dağılış alanını etkiler (s.220)."
      },
      {
        "soru": "Aşağıdaki bölgelerden hangisinin sınırını belirlemek kitaba göre daha zordur?",
        "secenekler": [
          "Doğal bitki örtüsüne göre oluşturulan bölge",
          "Deniz turizmi alanlarına göre oluşturulan bölge",
          "Bir şehrin metropoliten alanı",
          "Belediye yetki alanı"
        ],
        "dogru": 0,
        "cozum": "Geçiş alanları bulunduğundan doğal bitki örtüsüne göre bölge sınırını belirlemek daha zordur (s.220)."
      },
      {
        "soru": "Sınırları daha uzun bir zaman diliminde değişen bölgeler hangileridir?",
        "secenekler": [
          "Doğal şekilsel bölgeler",
          "Beşerî şekilsel bölgeler",
          "İşlevsel bölgeler",
          "Seyrek nüfuslu bölgeler"
        ],
        "dogru": 0,
        "cozum": "Beşerî şekilsel ve işlevsel bölgelerin sınırları daha kısa sürede değişebilir (s.223)."
      },
      {
        "soru": "Seyrek nüfuslu bölge sınırı içindeki bir yer nüfusun toplanma alanı hâline gelirse ne olur?",
        "secenekler": [
          "Yoğun nüfuslu bölge sınırı içinde yer almaya başlar",
          "Doğal şekilsel bölgeye dönüşür",
          "Bölge sınırları hiç değişmez",
          "İşlevsel bölgenin dışında kalır"
        ],
        "dogru": 0,
        "cozum": "Kriterin özelliğindeki değişim bölge sınırını da değiştirir (s.223)."
      },
      {
        "soru": "Parasal birlik ve Avrupa vatandaşlığı oluşturulmasına hangi anlaşmayla karar verilmiştir?",
        "secenekler": [
          "Maastricht Anlaşması",
          "Roma Anlaşması",
          "Paris Anlaşması",
          "Lizbon Anlaşması"
        ],
        "dogru": 0,
        "cozum": "1 Kasım 1993'te yürürlüğe giren Maastricht Anlaşması ile karar verilmiştir (s.224)."
      },
      {
        "soru": "2020 yılında Avrupa Birliği'nden ayrılan ülke hangisidir?",
        "secenekler": [
          "Birleşik Krallık",
          "Danimarka",
          "İrlanda",
          "Yunanistan"
        ],
        "dogru": 0,
        "cozum": "2020'de Birleşik Krallık ayrılmış, üye sayısı 27 olmuştur (s.224)."
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
      8
    ],
    "tur": "bosluk",
    "cumleler": [
      {
        "metin": "Bölge oluşturmada kullanılan ölçüt ve amaçlara {bölge belirleme kriterleri} adı verilir.",
        "kaynak": "s.217"
      },
      {
        "metin": "Yeryüzünün doğal ve beşerî unsurlar bakımından kendi içinde benzerlik gösteren parçalarına {bölge} adı verilir.",
        "kaynak": "s.219"
      },
      {
        "metin": "Şekilsel bölgelerin belirli bir {merkezi} yoktur.",
        "kaynak": "s.219"
      },
      {
        "metin": "İşlevsel bölge, bir {çekirdek} (merkez) ve bunu çevreleyen bir alana sahiptir.",
        "kaynak": "s.219"
      },
      {
        "metin": "Etkileşimin yoğunluğu {odak noktasından} uzaklaştıkça azalır.",
        "kaynak": "s.219"
      },
      {
        "metin": "Bölge sınırı, bölge belirlemede esas alınan {kriterlere} göre belirlenir.",
        "kaynak": "s.220"
      },
      {
        "metin": "Doğal unsurlara göre belirlenen doğal şekilsel bölgelerin sınırları daha {uzun} bir zaman diliminde değişmektedir.",
        "kaynak": "s.223"
      },
      {
        "metin": "1986'da İspanya ve Portekiz'in katılımlarıyla Avrupa Topluluğunun üye sayısı {12}'ye ulaşmıştır.",
        "kaynak": "s.223"
      },
      {
        "metin": "Avrupa Birliği'ne üye ülke sayısı hâlihazırda {27}'dir.",
        "kaynak": "s.224"
      }
    ]
  },
  {
    "id": "bulmaca",
    "baslik": "Çengel bulmaca",
    "alt": "Tanımlardan kavramları bul",
    "yonerge": "İpuçlarına göre kavramları bulmacaya yerleştir.",
    "turSecenekleri": [
      6,
      9
    ],
    "tur": "bulmaca",
    "kelimeler": [
      {
        "cevap": "BÖLGE",
        "ipucu": "Yeryüzünün kendi içinde benzerlik gösteren parçası"
      },
      {
        "cevap": "ŞEKİLSEL",
        "ipucu": "Belirli bir merkezi olmayan bölge türü"
      },
      {
        "cevap": "İŞLEVSEL",
        "ipucu": "Çekirdek ve onu çevreleyen alandan oluşan bölge türü"
      },
      {
        "cevap": "FONKSİYONEL",
        "ipucu": "İşlevsel bölgenin diğer adı"
      },
      {
        "cevap": "ÇEKİRDEK",
        "ipucu": "İşlevsel bölgenin merkezine verilen ad"
      },
      {
        "cevap": "TİRAJ",
        "ipucu": "Sınırı gün içinde bile değişebilen gazete ... alanı"
      },
      {
        "cevap": "ROTTERDAM",
        "ipucu": "Büyük taşımacılık bölgesine sahip Avrupa limanı"
      },
      {
        "cevap": "METROPOLİTEN",
        "ipucu": "Şehirsel yönetimin yetkisindeki tüm araziyi içeren ... alan"
      },
      {
        "cevap": "MUSON",
        "ipucu": "Step iklim bölgesinden daha az alan kaplayan iklim bölgesi"
      },
      {
        "cevap": "KRİTER",
        "ipucu": "Bölge sınırını belirleyen ölçüt"
      },
      {
        "cevap": "ROMA",
        "ipucu": "1957'de AET'yi kuran anlaşma"
      },
      {
        "cevap": "MAASTRİCHT",
        "ipucu": "1 Kasım 1993'te yürürlüğe giren AB anlaşması"
      },
      {
        "cevap": "HIRVATİSTAN",
        "ipucu": "2013'te AB'ye üye olan ülke"
      }
    ]
  }
];
