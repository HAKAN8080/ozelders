/**
 * 9. sınıf Coğrafya — 4.1.1 Nüfusun Tarihsel Değişimi ve Geleceği
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.141-145.
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
        "id": "nufus-dinamigi",
        "sol": "Nüfus dinamiği",
        "sag": "Nüfus özelliklerinin zaman içindeki değişimi, mekândaki dağılışı ve nüfus hareketleri"
      },
      {
        "id": "nufus-artis-hizi",
        "sol": "Nüfus artış hızı",
        "sag": "Bir önceki döneme göre nüfustaki artış veya azalış oranı"
      },
      {
        "id": "nufus-projeksiyonu",
        "sol": "Nüfus projeksiyonu",
        "sag": "Nüfus miktarı ve nüfusun yapısal özelliklerine göre yapılan tahminler"
      },
      {
        "id": "catalhoyuk",
        "sol": "Çatalhöyük",
        "sag": "Konya'nın Çumra ilçesinde yaklaşık 9.400 yıl önce kurulan, bilinen en eski yerleşmelerden biri"
      },
      {
        "id": "neolitik-donem",
        "sol": "Neolitik Dönem",
        "sag": "İnsanların tarımsal faaliyetlere başlayarak yerleşik hayata geçtiği süreç"
      },
      {
        "id": "tarim-devrimi",
        "sol": "Tarım Devrimi",
        "sag": "Gıdaya erişim zorluğunun etkisini azaltan, ilk şehirlerin ortaya çıktığı gelişme"
      },
      {
        "id": "sanayi-devrimi",
        "sol": "Sanayi Devrimi",
        "sag": "Bilimsel gelişmelerle birlikte üçüncü nüfus sıçramasına yol açan gelişme"
      },
      {
        "id": "unfpa",
        "sol": "UNFPA",
        "sag": "2100 yılında dünya nüfusunun 9-13 milyar arasında olacağını tahmin eden kuruluş"
      }
    ]
  },
  {
    "id": "sicramalar",
    "baslik": "Sıçrama dönemleri",
    "alt": "Özelliği doğru sıçrama dönemine yerleştir",
    "yonerge": "Her bilgiyi ait olduğu nüfus sıçrama dönemine sürükle.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Birinci Sıçrama",
      "İkinci Sıçrama",
      "Üçüncü Sıçrama"
    ],
    "ogeler": [
      {
        "id": "birinci-sicrama--yaklasik-1-milyon-yil-once-basladi",
        "ad": "Yaklaşık 1 milyon yıl önce başladı",
        "kategori": "Birinci Sıçrama"
      },
      {
        "id": "birinci-sicrama--cesitli-aletlerin-icat-edilmesi",
        "ad": "Çeşitli aletlerin icat edilmesi",
        "kategori": "Birinci Sıçrama"
      },
      {
        "id": "birinci-sicrama--yetersiz-beslenmenin-azalmasi",
        "ad": "Yetersiz beslenmenin azalması",
        "kategori": "Birinci Sıçrama"
      },
      {
        "id": "birinci-sicrama--vahsi-hayvanlarla-mucadelede-ilerleme",
        "ad": "Vahşi hayvanlarla mücadelede ilerleme",
        "kategori": "Birinci Sıçrama"
      },
      {
        "id": "ikinci-sicrama--yaklasik-10-bin-yil-once-yasandi",
        "ad": "Yaklaşık 10 bin yıl önce yaşandı",
        "kategori": "İkinci Sıçrama"
      },
      {
        "id": "ikinci-sicrama--tarimsal-faaliyetlere-baslanmasi",
        "ad": "Tarımsal faaliyetlere başlanması",
        "kategori": "İkinci Sıçrama"
      },
      {
        "id": "ikinci-sicrama--dunyanin-ilk-sehirlerinin-ortaya-cikmasi",
        "ad": "Dünyanın ilk şehirlerinin ortaya çıkması",
        "kategori": "İkinci Sıçrama"
      },
      {
        "id": "ikinci-sicrama--dunya-nufusunun-150-300-milyon-civarinda-olmasi",
        "ad": "Dünya nüfusunun 150-300 milyon civarında olması",
        "kategori": "İkinci Sıçrama"
      },
      {
        "id": "ucuncu-sicrama--sanayi-devrimi-nin-etkisi",
        "ad": "Sanayi Devrimi'nin etkisi",
        "kategori": "Üçüncü Sıçrama"
      },
      {
        "id": "ucuncu-sicrama--tip-alaninda-onemli-ilerlemeler",
        "ad": "Tıp alanında önemli ilerlemeler",
        "kategori": "Üçüncü Sıçrama"
      },
      {
        "id": "ucuncu-sicrama--olum-oranlarinin-dusmesi",
        "ad": "Ölüm oranlarının düşmesi",
        "kategori": "Üçüncü Sıçrama"
      },
      {
        "id": "ucuncu-sicrama--dunya-nufusunun-1927-de-2-milyara-ulasmasi",
        "ad": "Dünya nüfusunun 1927'de 2 milyara ulaşması",
        "kategori": "Üçüncü Sıçrama"
      }
    ]
  },
  {
    "id": "milyarlar",
    "baslik": "Milyarlık eşikler",
    "alt": "Dünya nüfusunun milyarlık eşiklere ulaştığı yıllar",
    "yonerge": "Dünya nüfusunun ulaştığı eşikleri yıllara göre eskiden yeniye sırala.",
    "turSecenekleri": [
      5,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "1 milyar",
        "anahtar": 1804,
        "etiket": "1804"
      },
      {
        "id": "s1",
        "ad": "2 milyar",
        "anahtar": 1927,
        "etiket": "1927"
      },
      {
        "id": "s2",
        "ad": "3 milyar",
        "anahtar": 1960,
        "etiket": "1960"
      },
      {
        "id": "s3",
        "ad": "4 milyar",
        "anahtar": 1974,
        "etiket": "1974"
      },
      {
        "id": "s4",
        "ad": "5 milyar",
        "anahtar": 1987,
        "etiket": "1987"
      },
      {
        "id": "s5",
        "ad": "6 milyar",
        "anahtar": 1998,
        "etiket": "1998"
      },
      {
        "id": "s6",
        "ad": "7 milyar",
        "anahtar": 2010,
        "etiket": "2010"
      },
      {
        "id": "s7",
        "ad": "8 milyar",
        "anahtar": 2022,
        "etiket": "2022"
      },
      {
        "id": "s8",
        "ad": "9 milyar (tahminî)",
        "anahtar": 2037,
        "etiket": "2037"
      },
      {
        "id": "s9",
        "ad": "10 milyar (tahminî)",
        "anahtar": 2058,
        "etiket": "2058"
      }
    ],
    "uclar": [
      "En erken",
      "En geç"
    ]
  },
  {
    "id": "tarihsel-surec",
    "baslik": "Tarihsel süreç",
    "alt": "Nüfus tarihindeki gelişmeleri sırala",
    "yonerge": "Gelişmeleri eskiden yeniye doğru sırala.",
    "turSecenekleri": [
      5,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Alet yapımıyla birinci sıçramanın başlaması",
        "anahtar": -1000000,
        "etiket": "Yaklaşık 1 milyon yıl önce"
      },
      {
        "id": "s1",
        "ad": "Tarım Devrimi ile ikinci sıçrama",
        "anahtar": -10000,
        "etiket": "Yaklaşık 10 bin yıl önce"
      },
      {
        "id": "s2",
        "ad": "Çatalhöyük'ün kurulması",
        "anahtar": -9400,
        "etiket": "Yaklaşık 9.400 yıl önce"
      },
      {
        "id": "s3",
        "ad": "Dünya nüfusunun 2 milyara ulaşması",
        "anahtar": 1927,
        "etiket": "1927"
      },
      {
        "id": "s4",
        "ad": "Hızlı nüfuslanmanın başlaması",
        "anahtar": 1950,
        "etiket": "1950 sonrası"
      },
      {
        "id": "s5",
        "ad": "UNFPA'nın 9-13 milyar tahmin ettiği yıl",
        "anahtar": 2100,
        "etiket": "2100"
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
    "yonerge": "Her soru için doğru seçeneği işaretle.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Çatalhöyük hangi ilde ve ilçede yer alır?",
        "secenekler": [
          "Konya, Çumra",
          "Şanlıurfa, Haliliye",
          "Çorum, Alaca",
          "Kayseri, Kocasinan"
        ],
        "dogru": 0,
        "cozum": "Çatalhöyük, Konya'nın Çumra ilçesinde Neolitik Dönem'de kurulmuştur (s.141)."
      },
      {
        "soru": "Bulgulara göre Çatalhöyük'ün en kalabalık olduğu dönemde burada yaklaşık kaç kişi yaşamıştır?",
        "secenekler": [
          "8.000",
          "800",
          "80.000",
          "20.000"
        ],
        "dogru": 0,
        "cozum": "Kentin en kalabalık döneminde yaklaşık 8.000 kişinin yaşadığı tespit edilmiştir (s.141)."
      },
      {
        "soru": "Çatalhöyük nüfusunun önemli ölçüde azalmasına ne yol açmıştır?",
        "secenekler": [
          "Kaynakların yetersiz kalması ve kuraklığın artmasıyla yaşanan göç",
          "Tarımsal faaliyetlere başlanması",
          "Ortalama ömrün uzaması",
          "Teknolojik ilerlemeler"
        ],
        "dogru": 0,
        "cozum": "Kaynakların yetersizliği ve artan kuraklık göçe neden olmuş, nüfus azalmıştır (s.141)."
      },
      {
        "soru": "İkinci sıçrama döneminde dünya nüfusunun ne kadar olduğu tahmin edilmektedir?",
        "secenekler": [
          "150-300 milyon",
          "1-2 milyar",
          "10-20 milyon",
          "500-700 milyon"
        ],
        "dogru": 0,
        "cozum": "Neolitik Dönem'de dünya nüfusunun 150-300 milyon civarında olduğu tahmin edilmektedir (s.141)."
      },
      {
        "soru": "Üçüncü sıçrama döneminde dünya nüfusunun hızla artmasının nedeni nedir?",
        "secenekler": [
          "Ölüm oranlarının düşmesi ve doğum oranlarının aynı kalması",
          "Doğum oranlarının artması, ölüm oranlarının aynı kalması",
          "Tarımsal faaliyetlere başlanması",
          "Aletlerin icat edilmesi"
        ],
        "dogru": 0,
        "cozum": "Ölüm oranları düşüp doğum oranları aynı kalınca nüfus 1800'lerin başında 1 milyara ulaşmıştır (s.142)."
      },
      {
        "soru": "1950 sonrasında dünya nüfusuna her 1 milyar insanın eklenme süresi bazı dönemlerde kaç yıla kadar düşmüştür?",
        "secenekler": [
          "11 yıl",
          "5 yıl",
          "25 yıl",
          "50 yıl"
        ],
        "dogru": 0,
        "cozum": "1950 sonrasında 1 milyarlık artış süresi bazı dönemlerde 11 yıla kadar düşmüştür (s.142)."
      },
      {
        "soru": "1950 sonrasındaki hızlı nüfuslanma daha çok hangi ülkelerde yaşanmıştır?",
        "secenekler": [
          "Gelişmekte olan ülkelerde",
          "Gelişmiş ülkelerde",
          "Sanayi sonrası toplumlarda",
          "Nüfusu azalan ülkelerde"
        ],
        "dogru": 0,
        "cozum": "Hızlı nüfuslanma daha çok gelişmekte olan ülkelerde yaşanmıştır (s.142)."
      },
      {
        "soru": "Gelişmekte olan ülkeler ölüm oranlarını nasıl hızla düşürmüştür?",
        "secenekler": [
          "Gelişmiş ülkelerin sağlık ve teknoloji olanaklarını kullanarak",
          "Doğum oranlarını düşürerek",
          "Göç alarak",
          "Tarımsal üretimi azaltarak"
        ],
        "dogru": 0,
        "cozum": "Gelişmekte olan ülkeler, gelişmiş ülkelerin sağlık ve teknoloji olanaklarından yararlanmıştır (s.142)."
      },
      {
        "soru": "UNFPA'ya göre 2100 yılında dünya nüfusu kaç milyar arasında olacaktır?",
        "secenekler": [
          "9-13 milyar",
          "6-8 milyar",
          "15-20 milyar",
          "20-25 milyar"
        ],
        "dogru": 0,
        "cozum": "UNFPA, 2100'de dünya nüfusunun 9-13 milyar arasında olacağını tahmin etmektedir (s.142)."
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
        "metin": "İnsanlık tarihinde nüfus artışında {üç} büyük sıçrama dönemi yaşanmıştır.",
        "kaynak": "s.141"
      },
      {
        "metin": "Birinci sıçrama dönemi yaklaşık {1 milyon} yıl önce insanların çeşitli aletleri icat etmesiyle başlamıştır.",
        "kaynak": "s.141"
      },
      {
        "metin": "Çatalhöyük, Konya'nın Çumra ilçesinde {Neolitik} Dönem'de kurulmuştur.",
        "kaynak": "s.141"
      },
      {
        "metin": "Çatalhöyük'teki nüfus artışı üzerinde farklı bölgelerden gelen {göçün} etkisi olmuştur.",
        "kaynak": "s.141"
      },
      {
        "metin": "Dünya nüfusu 1800'lerin başında 1 milyara, {1927}'de 2 milyara ulaşmıştır.",
        "kaynak": "s.142"
      },
      {
        "metin": "Dünyadaki hızlı nüfuslanma {1950} sonrasında başlamıştır.",
        "kaynak": "s.142"
      },
      {
        "metin": "Ortalama insan ömrünün uzaması {nüfus artışını} da beraberinde getirmiştir.",
        "kaynak": "s.142"
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
        "cevap": "Çatalhöyük",
        "ipucu": "Konya'daki, bilinen en eski yerleşmelerden biri"
      },
      {
        "cevap": "Çumra",
        "ipucu": "Çatalhöyük'ün bulunduğu ilçe"
      },
      {
        "cevap": "Neolitik",
        "ipucu": "Tarıma başlanıp yerleşik hayata geçilen dönem"
      },
      {
        "cevap": "Projeksiyon",
        "ipucu": "Nüfusun geleceğine yönelik tahminlere verilen ad"
      },
      {
        "cevap": "Kuraklık",
        "ipucu": "Çatalhöyük'te kaynak yetersizliğiyle birlikte göçe yol açan durum"
      },
      {
        "cevap": "Tarım",
        "ipucu": "İkinci sıçramayı sağlayan devrim"
      },
      {
        "cevap": "Sanayi",
        "ipucu": "Üçüncü sıçramada etkili olan devrim"
      },
      {
        "cevap": "Alet",
        "ipucu": "Birinci sıçramada insanların icat ettiği araçlar"
      },
      {
        "cevap": "Tıp",
        "ipucu": "Üçüncü sıçramada önemli ilerlemelerin kaydedildiği alan"
      },
      {
        "cevap": "Şehir",
        "ipucu": "Tarım Devrimi sayesinde ilk kez ortaya çıkan yerleşmeler"
      }
    ]
  }
];
