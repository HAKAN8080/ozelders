/**
 * 9. sınıf Coğrafya — 6.1.2 Afet Türleri
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.194-201.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "afet-turu-tanimlari",
    "baslik": "Afet türleri",
    "alt": "Afet türünü tanımıyla eşleştir",
    "yonerge": "Her afet türünü kitaptaki açıklamasıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Afet türü",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "jeolojik-afetler",
        "sol": "Jeolojik afetler",
        "sag": "Kaynağını yer kabuğu veya yerin derinliklerinden alan doğa olaylarından oluşur"
      },
      {
        "id": "klimatik-hidrolojik-afetler",
        "sol": "Klimatik-hidrolojik afetler",
        "sag": "Atmosfer olaylarına bağlı oluşan doğa kaynaklı afetler"
      },
      {
        "id": "biyolojik-afetler",
        "sol": "Biyolojik afetler",
        "sag": "Hastalık yapıcı, zehirleyici canlı organizmalar veya ürettikleri biyolojik maddelerden oluşur"
      },
      {
        "id": "sosyal-afetler",
        "sol": "Sosyal afetler",
        "sag": "Yiyecek, içecek, barınma gibi ihtiyaçların karşılanmasına yönelik faaliyetlerden oluşur"
      },
      {
        "id": "teknolojik-afetler",
        "sol": "Teknolojik afetler",
        "sag": "Beşerî faaliyetler ve teknolojik gelişmelerin amaç dışı kullanımından kaynaklanır"
      }
    ]
  },
  {
    "id": "olusum-nedeni",
    "baslik": "Oluşum nedenine göre afetler",
    "alt": "Afetleri türlerine ayır",
    "yonerge": "Kitaptaki örneklere göre her afeti doğru türe yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Jeolojik",
      "Klimatik-hidrolojik",
      "Biyolojik",
      "Sosyal",
      "Teknolojik"
    ],
    "ogeler": [
      {
        "id": "jeolojik--deprem",
        "ad": "Deprem",
        "kategori": "Jeolojik"
      },
      {
        "id": "jeolojik--volkanik-faaliyetler",
        "ad": "Volkanik faaliyetler",
        "kategori": "Jeolojik"
      },
      {
        "id": "klimatik-hidrolojik--kuraklik",
        "ad": "Kuraklık",
        "kategori": "Klimatik-hidrolojik"
      },
      {
        "id": "klimatik-hidrolojik--sel",
        "ad": "Sel",
        "kategori": "Klimatik-hidrolojik"
      },
      {
        "id": "biyolojik--erozyon",
        "ad": "Erozyon",
        "kategori": "Biyolojik"
      },
      {
        "id": "biyolojik--salginlar",
        "ad": "Salgınlar",
        "kategori": "Biyolojik"
      },
      {
        "id": "sosyal--savaslar",
        "ad": "Savaşlar",
        "kategori": "Sosyal"
      },
      {
        "id": "sosyal--teror-saldirilari",
        "ad": "Terör saldırıları",
        "kategori": "Sosyal"
      },
      {
        "id": "sosyal--gocler",
        "ad": "Göçler",
        "kategori": "Sosyal"
      },
      {
        "id": "teknolojik--maden-kazalari",
        "ad": "Maden kazaları",
        "kategori": "Teknolojik"
      },
      {
        "id": "teknolojik--nukleer-santral-kazalari",
        "ad": "Nükleer santral kazaları",
        "kategori": "Teknolojik"
      },
      {
        "id": "teknolojik--ulasim-kazalari",
        "ad": "Ulaşım kazaları",
        "kategori": "Teknolojik"
      }
    ]
  },
  {
    "id": "dunya-2023",
    "baslik": "Dünyada 2023 afetleri",
    "alt": "Harita 6.2'deki afetleri grupla",
    "yonerge": "2023'te dünyada yaşanan afetleri haritadaki türlerine göre ayır.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Deprem",
      "Fırtına, kasırga, sel",
      "Orman yangını",
      "Teknoloji kökenli kaza"
    ],
    "ogeler": [
      {
        "id": "deprem--kahramanmaras-depremleri-turkiye",
        "ad": "Kahramanmaraş depremleri (Türkiye)",
        "kategori": "Deprem"
      },
      {
        "id": "deprem--fas-depremi",
        "ad": "Fas depremi",
        "kategori": "Deprem"
      },
      {
        "id": "firtina-kasirga-sel--daniel-firtinasi-ve-sel-afeti-libya",
        "ad": "Daniel Fırtınası ve sel afeti (Libya)",
        "kategori": "Fırtına, kasırga, sel"
      },
      {
        "id": "firtina-kasirga-sel--freddy-kasirgasi-ve-sel-afeti-malawi",
        "ad": "Freddy Kasırgası ve sel afeti (Malawi)",
        "kategori": "Fırtına, kasırga, sel"
      },
      {
        "id": "firtina-kasirga-sel--assam-eyaleti-sel-afeti-hindistan",
        "ad": "Assam Eyaleti sel afeti (Hindistan)",
        "kategori": "Fırtına, kasırga, sel"
      },
      {
        "id": "firtina-kasirga-sel--gabrielle-kasirgasi-ve-auckland-sel-afeti-yeni-zelanda",
        "ad": "Gabrielle Kasırgası ve Auckland sel afeti (Yeni Zelanda)",
        "kategori": "Fırtına, kasırga, sel"
      },
      {
        "id": "orman-yangini--kanada-orman-yanginlari",
        "ad": "Kanada orman yangınları",
        "kategori": "Orman yangını"
      },
      {
        "id": "orman-yangini--mati-bolgesi-orman-yangini-yunanistan",
        "ad": "Mati Bölgesi orman yangını (Yunanistan)",
        "kategori": "Orman yangını"
      },
      {
        "id": "orman-yangini--buyuk-ada-ve-maui-adasi-yangini-hawaii-abd",
        "ad": "Büyük Ada ve Maui Adası yangını (Hawaii-ABD)",
        "kategori": "Orman yangını"
      },
      {
        "id": "teknoloji-kokenli-kaza--komur-madeni-kazasi-cin",
        "ad": "Kömür madeni kazası (Çin)",
        "kategori": "Teknoloji kökenli kaza"
      },
      {
        "id": "teknoloji-kokenli-kaza--larisa-tren-kazasi-yunanistan",
        "ad": "Larisa tren kazası (Yunanistan)",
        "kategori": "Teknoloji kökenli kaza"
      }
    ]
  },
  {
    "id": "turkiyede-afetler",
    "baslik": "Türkiye'de afetler",
    "alt": "Olayı bilgisiyle eşleştir",
    "yonerge": "Her olayı veya kavramı kitaptaki bilgisiyle eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Olay / kavram",
    "sagBaslik": "Kitaptaki bilgi",
    "ciftler": [
      {
        "id": "kahramanmaras-depremleri",
        "sol": "Kahramanmaraş depremleri",
        "sag": "6 Şubat 2023; Pazarcık merkezli 7,7 ve Elbistan merkezli 7,6"
      },
      {
        "id": "1939-erzincan-depremi",
        "sol": "1939 Erzincan depremi",
        "sag": "Büyüklüğü Mw 7,9"
      },
      {
        "id": "akdeniz-himalaya-deprem-kusagi",
        "sol": "Akdeniz-Himalaya Deprem Kuşağı",
        "sag": "Türkiye'nin hemen her bölgesinde çok sayıda fay hattı oluşmasının nedeni"
      },
      {
        "id": "giresun-dereli-taskini",
        "sol": "Giresun Dereli taşkını",
        "sag": "22 Ağustos 2020; dere yatağı daraltılarak yerleşime açılmıştı"
      },
      {
        "id": "sel-ve-taskinlar",
        "sol": "Sel ve taşkınlar",
        "sag": "Türkiye'de en sık görülen ve en çok zarara yol açan afetlerin başında gelir"
      },
      {
        "id": "covid-19",
        "sol": "COVID-19",
        "sag": "Aralık 2019'da Çin'de ortaya çıkıp pandemiye dönüştü"
      },
      {
        "id": "cicek-cuzzam-verem",
        "sol": "Çiçek, cüzzam, verem",
        "sag": "Türkiye'de geçmişte görülen salgın hastalıklar"
      },
      {
        "id": "erozyon",
        "sol": "Erozyon",
        "sag": "Toprakları baraj göllerine taşıyarak barajların ömrünü kısaltır"
      },
      {
        "id": "inform",
        "sol": "INFORM",
        "sag": "Risk Yönetimi Endeksi"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Afet türleri",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Doğru seçeneği işaretle.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Afetler sınıflandırılırken başta hangi ölçüt dikkate alınır?",
        "secenekler": [
          "Oluşum nedeni",
          "Yaşandığı ülkenin gelişmişlik düzeyi",
          "Yaşandığı mevsim",
          "Can kaybı sayısı"
        ],
        "dogru": 0,
        "cozum": "Sınıflandırma, oluşum nedeni başta olmak üzere oluşum hızı ve etki alanına göre yapılır (s.194)."
      },
      {
        "soru": "Kitaba göre afetlerin son yıllarda daha fazla yaşanmasının nedenlerinden biri hangisidir?",
        "secenekler": [
          "Küresel iklim değişikliği",
          "Nüfus hareketlerinin durması",
          "Doğal kaynak kullanımının azalması",
          "Ulaşım sistemlerinin gerilemesi"
        ],
        "dogru": 0,
        "cozum": "Afetler; küresel iklim değişikliği, doğal kaynakların aşırı kullanımı, nüfus hareketleri gibi nedenlerle daha fazla yaşanmaktadır (s.195)."
      },
      {
        "soru": "Kahramanmaraş merkezli depremlerde Türkiye ve Suriye'de yaklaşık kaç kişi hayatını kaybetmiştir?",
        "secenekler": [
          "Yaklaşık 58 bin",
          "Yaklaşık 3 bin",
          "Yaklaşık 17 bin",
          "Yaklaşık 25 milyon"
        ],
        "dogru": 0,
        "cozum": "Türkiye ve Suriye'de yaklaşık 58 bin kişi hayatını kaybetmiştir (s.194)."
      },
      {
        "soru": "Kitaptaki sınıflandırmaya göre erozyon hangi afet türüne örnektir?",
        "secenekler": [
          "Biyolojik afet",
          "Jeolojik afet",
          "Teknolojik afet",
          "Sosyal afet"
        ],
        "dogru": 0,
        "cozum": "Kitapta erozyon ve salgınlar biyolojik afetlere örnek verilmiştir (s.196)."
      },
      {
        "soru": "Savaşlar, terör saldırıları ve göçler hangi afet türüne örnektir?",
        "secenekler": [
          "Sosyal afet",
          "Teknolojik afet",
          "Klimatik-hidrolojik afet",
          "Jeolojik afet"
        ],
        "dogru": 0,
        "cozum": "Sosyal afetlere savaşlar, terör saldırıları ve göçler örnek gösterilebilir (s.196)."
      },
      {
        "soru": "Çin'de 12 madencinin hayatını kaybettiği kömür madeni kazası hangi afet türüne örnektir?",
        "secenekler": [
          "Teknoloji kökenli afet",
          "Jeolojik afet",
          "Biyolojik afet",
          "Klimatik-hidrolojik afet"
        ],
        "dogru": 0,
        "cozum": "Bu kaza, teknoloji kökenli afet türüne örnek verilmiştir (s.195)."
      },
      {
        "soru": "6 Şubat 2023'teki ilk deprem hangisidir?",
        "secenekler": [
          "Saat 04.17'de 7,7 büyüklüğünde Pazarcık merkezli",
          "Saat 13.24'te 7,6 büyüklüğünde Elbistan merkezli",
          "Saat 04.17'de 7,4 büyüklüğünde Gölcük merkezli",
          "Saat 13.24'te 7,9 büyüklüğünde Erzincan merkezli"
        ],
        "dogru": 0,
        "cozum": "İlk deprem 04.17'de 7,7 büyüklüğünde Pazarcık merkezli, ikincisi 13.24'te 7,6 büyüklüğünde Elbistan merkezlidir (s.198)."
      },
      {
        "soru": "Türkiye'de çok sayıda fay hattı oluşmasının nedeni nedir?",
        "secenekler": [
          "Akdeniz-Himalaya Deprem Kuşağı'nda yer alması",
          "Büyük Okyanus Ateş Çemberi'nde yer alması",
          "Ekvator kuşağında bulunması",
          "Kıyılarının uzun olması"
        ],
        "dogru": 0,
        "cozum": "Türkiye, Akdeniz-Himalaya Deprem Kuşağı'nda yer aldığından çok sayıda fay hattı oluşmuştur (s.198)."
      },
      {
        "soru": "Giresun Dereli taşkınında asıl belirleyici faktör nedir?",
        "secenekler": [
          "Dere yatağının daraltılarak yerleşime açılması",
          "Bölgede orman yangını çıkması",
          "Deprem sonrası heyelan oluşması",
          "Barajın yıkılması"
        ],
        "dogru": 0,
        "cozum": "Taşkında asıl belirleyici faktör, dere yatağının daraltılarak yerleşime açılmasıdır (s.199)."
      },
      {
        "soru": "Sel ve taşkınlar Türkiye'de daha çok nerelerde görülür?",
        "secenekler": [
          "Akarsu yataklarına yakın yerleşmelerde",
          "Yalnızca yüksek dağ zirvelerinde",
          "Yalnızca kurak iç bölgelerde",
          "Akarsulardan uzak yaylalarda"
        ],
        "dogru": 0,
        "cozum": "Bu olaylar akarsu yataklarına yakın yerleşmelerde daha sık meydana gelir (s.199)."
      },
      {
        "soru": "COVID-19'un hızlı yayılmasında etkili olan etkenlerden biri hangisidir?",
        "secenekler": [
          "Gelişen ulaşım sistemleri",
          "Kırsal nüfusun artması",
          "Şehirlerdeki nüfusun azalması",
          "Uluslararası yolculukların durması"
        ],
        "dogru": 0,
        "cozum": "Nüfusun yaklaşık yarısının şehirlerde yaşaması ve gelişen ulaşım sistemleri salgının hızlı yayılmasında etkili olmuştur (s.200)."
      },
      {
        "soru": "Şiddetlenen erozyon nedeniyle Türkiye topraklarının bir bölümü hangi riskle karşı karşıyadır?",
        "secenekler": [
          "Çölleşme",
          "Tsunami",
          "Volkanik patlama",
          "Çığ"
        ],
        "dogru": 0,
        "cozum": "Şiddetlenen erozyon nedeniyle ülke topraklarının bir bölümü çölleşme riskiyle karşı karşıyadır (s.200)."
      }
    ]
  },
  {
    "id": "bosluk",
    "baslik": "Boşluk doldur",
    "alt": "Kitaptaki cümleleri tamamla",
    "yonerge": "Cümledeki boşluğa gelecek kavramı bul.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "bosluk",
    "cumleler": [
      {
        "metin": "Afetler, oluşum nedenlerine göre doğa kaynaklı ve {insan kaynaklı} olabilmektedir.",
        "kaynak": "s.196"
      },
      {
        "metin": "Doğa kaynaklı afetlerin önemli bir bölümü atmosfer olaylarına bağlı oluşur ve bunlar {klimatik-hidrolojik} afetler olarak adlandırılır.",
        "kaynak": "s.196"
      },
      {
        "metin": "İnsan kaynaklı afetler, sosyal afet ve {teknolojik afet} olarak isimlendirilir.",
        "kaynak": "s.196"
      },
      {
        "metin": "Yunanistan'ın Larisa kentinde meydana gelen {tren kazası} teknoloji kökenli afet türüne örnek verilebilir.",
        "kaynak": "s.195"
      },
      {
        "metin": "Rusya ile Ukrayna arasında {24 Şubat 2022}'de başlayan savaş, barış çabalarına rağmen sonlandırılamamıştır.",
        "kaynak": "s.195"
      },
      {
        "metin": "Türkiye, {Akdeniz-Himalaya} Deprem Kuşağı'nda yer aldığından ülkenin hemen her bölgesinde çok sayıda fay hattı oluşmuştur.",
        "kaynak": "s.198"
      },
      {
        "metin": "Aralık 2019'da {Çin}'de ortaya çıkan COVID-19, kısa sürede pandemiye dönüşmüştür.",
        "kaynak": "s.200"
      },
      {
        "metin": "Erozyona maruz kalan toprakların bir kısmı baraj göllerine taşındığı için barajların {kullanım ömürleri} kısalmaktadır.",
        "kaynak": "s.200"
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
        "cevap": "Jeolojik",
        "ipucu": "Kaynağını yer kabuğundan alan afet türü"
      },
      {
        "cevap": "Biyolojik",
        "ipucu": "Erozyon ve salgınların dahil edildiği afet türü"
      },
      {
        "cevap": "Sosyal",
        "ipucu": "Savaş, terör ve göçlerin dahil edildiği afet türü"
      },
      {
        "cevap": "Teknolojik",
        "ipucu": "Maden ve ulaşım kazalarının dahil edildiği afet türü"
      },
      {
        "cevap": "Kuraklık",
        "ipucu": "Sel ile birlikte klimatik-hidrolojik afet örneği"
      },
      {
        "cevap": "Erozyon",
        "ipucu": "Barajların kullanım ömrünü kısaltan afet"
      },
      {
        "cevap": "Çölleşme",
        "ipucu": "Şiddetli erozyonun yol açtığı risk"
      },
      {
        "cevap": "Pazarcık",
        "ipucu": "6 Şubat 2023'teki ilk depremin merkezi"
      },
      {
        "cevap": "Elbistan",
        "ipucu": "6 Şubat 2023'teki ikinci depremin merkezi"
      },
      {
        "cevap": "Larisa",
        "ipucu": "Tren kazasının yaşandığı Yunanistan kenti"
      },
      {
        "cevap": "Dereli",
        "ipucu": "2020'de taşkın yaşanan Giresun ilçesi"
      },
      {
        "cevap": "Pandemi",
        "ipucu": "COVID-19'un dönüştüğü küresel salgın"
      },
      {
        "cevap": "Fas",
        "ipucu": "Eylül 2023'te depremde yaklaşık 3 bin kişinin öldüğü ülke"
      }
    ]
  }
];
