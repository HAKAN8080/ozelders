/**
 * 9. sınıf Coğrafya — 4.1.2 Nüfusun Dağılışı ve Hareketleri
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.146-153.
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
      6,
      10
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "nufus-yogunlugu",
        "sol": "Nüfus yoğunluğu",
        "sag": "Bir bölgenin ne kadar kalabalık veya seyrek olduğunu ifade eder"
      },
      {
        "id": "goc",
        "sol": "Göç",
        "sag": "İnsanların doğal, ekonomik, sosyal, siyasal ve kültürel nedenlerle başka bir yere hareket etmesi"
      },
      {
        "id": "mubadele-gocu",
        "sol": "Mübadele göçü",
        "sag": "Ülkeler arasındaki anlaşmalar doğrultusunda zorunlu olarak yapılan göç"
      },
      {
        "id": "gecici-goc",
        "sol": "Geçici göç",
        "sag": "Belli bir süreyle sınırlı, kalıcı yerleşilmeyen göç; mevsimlik göç de denir"
      },
      {
        "id": "beyin-gocu",
        "sol": "Beyin göçü",
        "sag": "İyi eğitimli, nitelikli insanların daha iyi çalışma ve hayat şartları için başka ülkelere göçü"
      },
      {
        "id": "ic-goc",
        "sol": "İç göç",
        "sag": "Sınır ölçütüne göre ülke içinde yaşanan göç"
      },
      {
        "id": "dis-goc",
        "sol": "Dış göç",
        "sag": "Sınır ölçütüne göre ülke dışına yapılan göç"
      },
      {
        "id": "itici-faktorler",
        "sol": "İtici faktörler",
        "sag": "İnsanların ikamet ettiği yeri terk etmesine neden olan koşullar"
      },
      {
        "id": "cekici-faktorler",
        "sol": "Çekici faktörler",
        "sag": "Göç sonucunda gelinen yerdeki cezbedici koşullar"
      },
      {
        "id": "engeller",
        "sol": "Engeller",
        "sag": "Göçü etkileyen mesafe, ulaşım olanakları, politikalar, hukuki durumlar gibi etkenler"
      }
    ]
  },
  {
    "id": "dagilis-faktorleri",
    "baslik": "Dağılış faktörleri",
    "alt": "Doğal mı, beşerî ve ekonomik mi?",
    "yonerge": "Nüfusun dağılışını etkileyen faktörleri doğru gruba yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Doğal Faktörler",
      "Beşerî ve Ekonomik Faktörler"
    ],
    "ogeler": [
      {
        "id": "dogal-faktorler--iklim",
        "ad": "İklim",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--yer-sekilleri",
        "ad": "Yer şekilleri",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--yukselti-ve-egim",
        "ad": "Yükselti ve eğim",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--akarsu-gol-ve-yeralti-sulari",
        "ad": "Akarsu, göl ve yeraltı suları",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--toprak-ozellikleri",
        "ad": "Toprak özellikleri",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--bitki-ortusu",
        "ad": "Bitki örtüsü",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--okyanus-ve-deniz-kiyilari",
        "ad": "Okyanus ve deniz kıyıları",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--doga-kokenli-afetler",
        "ad": "Doğa kökenli afetler",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--tarim",
        "ad": "Tarım",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--sanayi",
        "ad": "Sanayi",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--ulasim",
        "ad": "Ulaşım",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--turizm",
        "ad": "Turizm",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--tarihi-ve-dini-nedenler",
        "ad": "Tarihî ve dinî nedenler",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--madencilik",
        "ad": "Madencilik",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--siyasi-nedenler-ve-nufus-politikalari",
        "ad": "Siyasi nedenler ve nüfus politikaları",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--gocler",
        "ad": "Göçler",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      },
      {
        "id": "beseri-ve-ekonomik-faktorler--beseri-afetler",
        "ad": "Beşerî afetler",
        "kategori": "Beşerî ve Ekonomik Faktörler"
      }
    ]
  },
  {
    "id": "iklim-gocleri",
    "baslik": "İklim kaynaklı göçler",
    "alt": "Yeri, göçe yol açan nedenle eşle",
    "yonerge": "Haberlerdeki yerleri göçe neden olan olaya göre grupla.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Permafrostun çözülmesi",
      "Deniz seviyesinin yükselmesi",
      "Kuraklık"
    ],
    "ogeler": [
      {
        "id": "permafrostun-cozulmesi--kanada-nin-kuzeyi",
        "ad": "Kanada'nın kuzeyi",
        "kategori": "Permafrostun çözülmesi"
      },
      {
        "id": "permafrostun-cozulmesi--alaska",
        "ad": "Alaska",
        "kategori": "Permafrostun çözülmesi"
      },
      {
        "id": "permafrostun-cozulmesi--sibirya",
        "ad": "Sibirya",
        "kategori": "Permafrostun çözülmesi"
      },
      {
        "id": "deniz-seviyesinin-yukselmesi--vietnam",
        "ad": "Vietnam",
        "kategori": "Deniz seviyesinin yükselmesi"
      },
      {
        "id": "deniz-seviyesinin-yukselmesi--tayland",
        "ad": "Tayland",
        "kategori": "Deniz seviyesinin yükselmesi"
      },
      {
        "id": "deniz-seviyesinin-yukselmesi--endonezya",
        "ad": "Endonezya",
        "kategori": "Deniz seviyesinin yükselmesi"
      },
      {
        "id": "deniz-seviyesinin-yukselmesi--tuvalu",
        "ad": "Tuvalu",
        "kategori": "Deniz seviyesinin yükselmesi"
      },
      {
        "id": "deniz-seviyesinin-yukselmesi--kiribati",
        "ad": "Kiribati",
        "kategori": "Deniz seviyesinin yükselmesi"
      },
      {
        "id": "deniz-seviyesinin-yukselmesi--marshall-adalari",
        "ad": "Marshall Adaları",
        "kategori": "Deniz seviyesinin yükselmesi"
      },
      {
        "id": "kuraklik--etiyopya",
        "ad": "Etiyopya",
        "kategori": "Kuraklık"
      },
      {
        "id": "kuraklik--eritre",
        "ad": "Eritre",
        "kategori": "Kuraklık"
      },
      {
        "id": "kuraklik--somali",
        "ad": "Somali",
        "kategori": "Kuraklık"
      },
      {
        "id": "kuraklik--cibuti",
        "ad": "Cibuti",
        "kategori": "Kuraklık"
      },
      {
        "id": "kuraklik--sudan",
        "ad": "Sudan",
        "kategori": "Kuraklık"
      },
      {
        "id": "kuraklik--kenya",
        "ad": "Kenya",
        "kategori": "Kuraklık"
      },
      {
        "id": "kuraklik--uganda",
        "ad": "Uganda",
        "kategori": "Kuraklık"
      }
    ]
  },
  {
    "id": "venezuela",
    "baslik": "Venezuela göçü",
    "alt": "Venezuela'dan göç alan ülkeler",
    "yonerge": "Ülkeleri Venezuela'dan aldıkları göç miktarına göre azdan çoğa sırala.",
    "turSecenekleri": [
      5,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Kolombiya",
        "anahtar": 2477588,
        "etiket": "2.477.588"
      },
      {
        "id": "s1",
        "ad": "Peru",
        "anahtar": 1518102,
        "etiket": "1.518.102"
      },
      {
        "id": "s2",
        "ad": "Ekvador",
        "anahtar": 512214,
        "etiket": "512.214"
      },
      {
        "id": "s3",
        "ad": "ABD",
        "anahtar": 480116,
        "etiket": "480.116"
      },
      {
        "id": "s4",
        "ad": "Brezilya",
        "anahtar": 449530,
        "etiket": "449.530"
      },
      {
        "id": "s5",
        "ad": "Şili",
        "anahtar": 444223,
        "etiket": "444.223"
      },
      {
        "id": "s6",
        "ad": "Arjantin",
        "anahtar": 220595,
        "etiket": "220.595"
      },
      {
        "id": "s7",
        "ad": "Meksika",
        "anahtar": 177987,
        "etiket": "177.987"
      },
      {
        "id": "s8",
        "ad": "İspanya",
        "anahtar": 169549,
        "etiket": "169.549"
      },
      {
        "id": "s9",
        "ad": "Panama",
        "anahtar": 147424,
        "etiket": "147.424"
      }
    ],
    "uclar": [
      "En az göç",
      "En çok göç"
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
        "soru": "Kutup bölgelerinde sürekli yerleşim bulunmamasının nedeni nedir?",
        "secenekler": [
          "İklim koşullarının yaşamaya elverişli olmaması",
          "Ulaşımın gelişmiş olması",
          "Toprakların çok verimli olması",
          "Sanayinin yoğun olması"
        ],
        "dogru": 0,
        "cozum": "Yıl boyunca buzlarla kaplı ve soğuk kutup bölgelerinde iklim yaşamaya elverişli değildir (s.146)."
      },
      {
        "soru": "Türklerin göç ettiği ana yurt neresidir?",
        "secenekler": [
          "Türkistan",
          "Anadolu",
          "Mezopotamya",
          "Balkanlar"
        ],
        "dogru": 0,
        "cozum": "Türkler ana yurdu olan Türkistan'dan çeşitli nedenlerle göç etmiştir (s.149)."
      },
      {
        "soru": "Türklerin Türkistan'dan yaptığı göçler hangi tarihler arasında yaşanmıştır?",
        "secenekler": [
          "MÖ 1500'ler - MS 800'ler",
          "MÖ 3000'ler - MÖ 1000'ler",
          "MS 1000'ler - MS 1500'ler",
          "MÖ 500'ler - MS 100'ler"
        ],
        "dogru": 0,
        "cozum": "Göçler MÖ 1500'lerde başlayıp MS 800'lere kadar devam etmiştir (s.149)."
      },
      {
        "soru": "Aşağıdakilerden hangisi Türkistan'dan yapılan Türk göçlerinin nedenlerinden biridir?",
        "secenekler": [
          "Kuraklık nedeniyle otlakların azalması",
          "Sanayi Devrimi'yle oluşan iş gücü ihtiyacı",
          "Deniz seviyesinin yükselmesi",
          "Lozan Barış Antlaşması"
        ],
        "dogru": 0,
        "cozum": "İklim değişikliğiyle artan kuraklık otlakları azaltmıştır (s.149)."
      },
      {
        "soru": "Lozan Barış Antlaşması'yla hangi iki ülke arasında nüfus mübadelesi protokolü imzalanmıştır?",
        "secenekler": [
          "Türkiye ve Yunanistan",
          "Romanya ve Bulgaristan",
          "Türkiye ve İran",
          "Yunanistan ve İtalya"
        ],
        "dogru": 0,
        "cozum": "Yunanistan'daki Türkler ile Türkiye'deki Rumlar yer değiştirmiştir (s.149)."
      },
      {
        "soru": "2018-2024 yılları arasında Venezuela'dan yaklaşık kaç kişi sınır dışına göç etmiştir?",
        "secenekler": [
          "5,7 milyon",
          "570 bin",
          "1,5 milyon",
          "15 milyon"
        ],
        "dogru": 0,
        "cozum": "Nüfusun yaklaşık beşte biri (5,7 milyon) göç etmiştir (s.150)."
      },
      {
        "soru": "Venezuela'dan en çok göç alan ülke hangisidir?",
        "secenekler": [
          "Kolombiya",
          "Peru",
          "ABD",
          "İspanya"
        ],
        "dogru": 0,
        "cozum": "Kolombiya 2.477.588 kişiyle ilk sıradadır (s.150)."
      },
      {
        "soru": "Çinliler 54 Afrika ülkesinden kaçına vizesiz girebilmektedir?",
        "secenekler": [
          "27",
          "10",
          "40",
          "54"
        ],
        "dogru": 0,
        "cozum": "Çinlilerin 54 Afrika ülkesinden 27'sine vizesiz girmesi sağlanmıştır (s.151)."
      },
      {
        "soru": "Afrika'daki Çinlilerin sayısının ne kadar olduğu tahmin edilmektedir?",
        "secenekler": [
          "1-2 milyon",
          "100-200 bin",
          "5-10 milyon",
          "20-30 milyon"
        ],
        "dogru": 0,
        "cozum": "Afrika'daki Çinlilerin sayısının 1-2 milyon arasında olduğu tahmin edilmektedir (s.151)."
      },
      {
        "soru": "Beyin göçüne örnek verilen Aziz Sancar, 2015'te hangi alanda Nobel Ödülü almıştır?",
        "secenekler": [
          "Kimya",
          "Tıp",
          "Fizik",
          "Barış"
        ],
        "dogru": 0,
        "cozum": "Aziz Sancar, 7 Ekim 2015'te Nobel Kimya Ödülü'nü almıştır (s.152)."
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
        "metin": "Yıl boyunca buzlarla kaplı ve soğuk olan {kutup} bölgelerinde sürekli yerleşim mevcut değildir.",
        "kaynak": "s.146"
      },
      {
        "metin": "Ulaşım ve {sanayinin} geliştiği kentlerde de nüfus yoğunluğu fazladır.",
        "kaynak": "s.146"
      },
      {
        "metin": "Türkler, MÖ 1500'lerde başlayıp MS {800}'lere kadar devam eden göçlerle farklı bölgelere yayılmıştır.",
        "kaynak": "s.149"
      },
      {
        "metin": "Lozan Barış Antlaşması'yla Türkiye ve {Yunanistan} arasında nüfus mübadelesi protokolü imzalanmıştır.",
        "kaynak": "s.149"
      },
      {
        "metin": "Venezuela'da yaşanan sosyoekonomik zorluklar, nüfusun yaklaşık {beşte birinin} sınır dışına göç etmesine neden oldu.",
        "kaynak": "s.150"
      },
      {
        "metin": "Geçici göç, {mevsimlik göç} olarak da adlandırılır.",
        "kaynak": "s.151"
      },
      {
        "metin": "Aziz Sancar, 7 Ekim 2015'te Nobel {Kimya} Ödülü'nü almıştır.",
        "kaynak": "s.152"
      },
      {
        "metin": "{Permafrost} olarak adlandırılan sürekli donmuş kaya ve topraktan oluşan tabakalarda iklim değişimi nedeniyle çözülmeler meydana geldi.",
        "kaynak": "s.153"
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
        "cevap": "Göç",
        "ipucu": "İnsanların bulunduğu yerden başka bir yere hareket etmesi"
      },
      {
        "cevap": "Mübadele",
        "ipucu": "Ülkeler arası anlaşmayla yapılan zorunlu göç türü"
      },
      {
        "cevap": "Lozan",
        "ipucu": "Türkiye-Yunanistan nüfus mübadelesinin dayandığı antlaşma"
      },
      {
        "cevap": "Türkistan",
        "ipucu": "Türklerin ana yurdu"
      },
      {
        "cevap": "Mevsimlik",
        "ipucu": "Geçici göçün diğer adı (... göç)"
      },
      {
        "cevap": "Permafrost",
        "ipucu": "Sürekli donmuş kaya ve topraktan oluşan tabaka"
      },
      {
        "cevap": "Kolombiya",
        "ipucu": "Venezuela'dan en çok göç alan ülke"
      },
      {
        "cevap": "Venezuela",
        "ipucu": "2018-2024'te nüfusunun beşte biri göç eden ülke"
      },
      {
        "cevap": "Sancar",
        "ipucu": "Beyin göçü örneği olarak anlatılan Nobel ödüllü bilim insanı"
      },
      {
        "cevap": "Kutup",
        "ipucu": "İklimi elverişsiz olduğu için sürekli yerleşim olmayan bölgeler"
      },
      {
        "cevap": "Tuvalu",
        "ipucu": "Deniz seviyesinin yükselmesinden etkilenen Pasifik ada ülkesi"
      }
    ]
  }
];
