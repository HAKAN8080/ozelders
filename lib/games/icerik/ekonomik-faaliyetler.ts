/**
 * 9. sınıf Coğrafya — 5.1 Ekonomik Faaliyetleri Etkileyen Coğrafi Faktörler
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.173-181.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "kavramlar",
    "baslik": "Kavramlar",
    "alt": "Kavramı tanımıyla eşleştir",
    "yonerge": "Soldaki her kavramı kitaptaki tanımıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "ekonomik-faaliyet",
        "sol": "Ekonomik faaliyet",
        "sag": "İnsanların hayatlarını devam ettirmek, gelir elde etmek ve refah seviyelerini yükseltmek için yaptıkları çalışmalar"
      },
      {
        "id": "uretim",
        "sol": "Üretim",
        "sag": "Mal ve hizmetlerin bir dizi işlemden geçirilerek kullanıma hazır hâle getirilmesi"
      },
      {
        "id": "dagitim",
        "sol": "Dağıtım",
        "sag": "Üretilen mal ve hizmetlerin bir yerden başka bir yere aktarılması"
      },
      {
        "id": "tuketim",
        "sol": "Tüketim",
        "sag": "Üretilen mal ve hizmetlerin tüketiciler tarafından kullanılması"
      },
      {
        "id": "cografi-konum",
        "sol": "Coğrafi konum",
        "sag": "Bir yerin coğrafi özelliklerinin ana kaynağı"
      },
      {
        "id": "topografik-ozellikler",
        "sol": "Topoğrafik özellikler",
        "sag": "Yükselti, eğim, bakı vb. özellikler"
      },
      {
        "id": "gece-isiklari",
        "sol": "Gece ışıkları",
        "sag": "Dünya'nın gece uydu görüntüleri; ekonomik büyümeyi ölçmeye yardımcı olur"
      },
      {
        "id": "sermaye",
        "sol": "Sermaye",
        "sag": "Tesislerin kuruluşu, devamlılığı ve gelişmesinde etkin rol oynayan beşerî faktör"
      },
      {
        "id": "teknosab",
        "sol": "TEKNOSAB",
        "sag": "Türkiye'nin teknoloji odaklı planlanmış yeni nesil organize sanayi bölgesi"
      }
    ]
  },
  {
    "id": "faktor-turleri",
    "baslik": "Doğal mı, beşerî mi?",
    "alt": "Faktörleri türüne göre ayır",
    "yonerge": "Her faktörü kitaptaki sınıflandırmaya göre doğal ya da beşerî faktörler grubuna yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Doğal faktörler",
      "Beşerî faktörler"
    ],
    "ogeler": [
      {
        "id": "dogal-faktorler--cografi-konum",
        "ad": "Coğrafi konum",
        "kategori": "Doğal faktörler"
      },
      {
        "id": "dogal-faktorler--iklim",
        "ad": "İklim",
        "kategori": "Doğal faktörler"
      },
      {
        "id": "dogal-faktorler--topografik-ozellikler",
        "ad": "Topoğrafik özellikler",
        "kategori": "Doğal faktörler"
      },
      {
        "id": "dogal-faktorler--su-kaynaklari",
        "ad": "Su kaynakları",
        "kategori": "Doğal faktörler"
      },
      {
        "id": "dogal-faktorler--toprak",
        "ad": "Toprak",
        "kategori": "Doğal faktörler"
      },
      {
        "id": "dogal-faktorler--bitki-ortusu",
        "ad": "Bitki örtüsü",
        "kategori": "Doğal faktörler"
      },
      {
        "id": "beseri-faktorler--nufus",
        "ad": "Nüfus",
        "kategori": "Beşerî faktörler"
      },
      {
        "id": "beseri-faktorler--is-gucu",
        "ad": "İş gücü",
        "kategori": "Beşerî faktörler"
      },
      {
        "id": "beseri-faktorler--sermaye",
        "ad": "Sermaye",
        "kategori": "Beşerî faktörler"
      },
      {
        "id": "beseri-faktorler--teknoloji",
        "ad": "Teknoloji",
        "kategori": "Beşerî faktörler"
      },
      {
        "id": "beseri-faktorler--devletin-ekonomi-politikalari",
        "ad": "Devletin ekonomi politikaları",
        "kategori": "Beşerî faktörler"
      },
      {
        "id": "beseri-faktorler--ulasim",
        "ad": "Ulaşım",
        "kategori": "Beşerî faktörler"
      }
    ]
  },
  {
    "id": "dogal-ornekler",
    "baslik": "Doğal faktör örnekleri",
    "alt": "Örneği ilgili doğal faktörle eşle",
    "yonerge": "Kitaptaki örnekleri hangi doğal faktörün etkisiyle ilgiliyse o gruba yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "İklim",
      "Topoğrafya",
      "Su kaynakları",
      "Toprak",
      "Bitki örtüsü"
    ],
    "ogeler": [
      {
        "id": "iklim--sicak-ve-yagisli-alanlarda-ananas-yetistirilmesi",
        "ad": "Sıcak ve yağışlı alanlarda ananas yetiştirilmesi",
        "kategori": "İklim"
      },
      {
        "id": "iklim--gunes-ve-ruzgar-santrallerinin-verimliligi",
        "ad": "Güneş ve rüzgâr santrallerinin verimliliği",
        "kategori": "İklim"
      },
      {
        "id": "topografya--kara-ve-demir-yolu-guzergahlarinin-belirlenmesi",
        "ad": "Kara ve demir yolu güzergâhlarının belirlenmesi",
        "kategori": "Topoğrafya"
      },
      {
        "id": "topografya--liman-ve-havalimani-yerlerinin-belirlenmesi",
        "ad": "Liman ve havalimanı yerlerinin belirlenmesi",
        "kategori": "Topoğrafya"
      },
      {
        "id": "topografya--peribacasi-ve-travertenlerin-turizme-imkan-saglamasi",
        "ad": "Peribacası ve travertenlerin turizme imkân sağlaması",
        "kategori": "Topoğrafya"
      },
      {
        "id": "su-kaynaklari--balikcilik-faaliyetleri",
        "ad": "Balıkçılık faaliyetleri",
        "kategori": "Su kaynakları"
      },
      {
        "id": "su-kaynaklari--hidroelektrik-enerji-uretimi",
        "ad": "Hidroelektrik enerji üretimi",
        "kategori": "Su kaynakları"
      },
      {
        "id": "su-kaynaklari--tarimsal-sulama",
        "ad": "Tarımsal sulama",
        "kategori": "Su kaynakları"
      },
      {
        "id": "toprak--porselen-kiremit-ve-tugla-uretimi",
        "ad": "Porselen, kiremit ve tuğla üretimi",
        "kategori": "Toprak"
      },
      {
        "id": "toprak--seramik-yapimi",
        "ad": "Seramik yapımı",
        "kategori": "Toprak"
      },
      {
        "id": "bitki-ortusu--kagit-uretimi",
        "ad": "Kâğıt üretimi",
        "kategori": "Bitki örtüsü"
      },
      {
        "id": "bitki-ortusu--kereste-ve-mobilya-uretimi",
        "ad": "Kereste ve mobilya üretimi",
        "kategori": "Bitki örtüsü"
      },
      {
        "id": "bitki-ortusu--hayvancilik-faaliyetleri",
        "ad": "Hayvancılık faaliyetleri",
        "kategori": "Bitki örtüsü"
      }
    ]
  },
  {
    "id": "beseri-ornekler",
    "baslik": "Beşerî faktör örnekleri",
    "alt": "Örneği ilgili beşerî faktörle eşle",
    "yonerge": "Kitaptaki örnekleri hangi beşerî faktörle ilgiliyse o gruba yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "İş gücü",
      "Sermaye",
      "Teknoloji",
      "Devlet politikaları",
      "Ulaşım"
    ],
    "ogeler": [
      {
        "id": "is-gucu--gelismis-ulkelerin-uretimin-bir-kismini-banglades-pakistan-gibi-ulkelerde-yapmasi",
        "ad": "Gelişmiş ülkelerin üretimin bir kısmını Bangladeş, Pakistan gibi ülkelerde yapması",
        "kategori": "İş gücü"
      },
      {
        "id": "is-gucu--teknolojinin-yogun-kullanildigi-ulkelerde-vasifli-eleman-ihtiyacinin-artmasi",
        "ad": "Teknolojinin yoğun kullanıldığı ülkelerde vasıflı eleman ihtiyacının artması",
        "kategori": "İş gücü"
      },
      {
        "id": "sermaye--sanayi-tesisinin-kurulusu-ve-isletilmesi-icin-yuksek-miktarda-kaynak-gerekmesi",
        "ad": "Sanayi tesisinin kuruluşu ve işletilmesi için yüksek miktarda kaynak gerekmesi",
        "kategori": "Sermaye"
      },
      {
        "id": "sermaye--yeterli-sermayeye-sahip-ulkelerde-ekonomik-faaliyetlerin-yogunlasmasi",
        "ad": "Yeterli sermayeye sahip ülkelerde ekonomik faaliyetlerin yoğunlaşması",
        "kategori": "Sermaye"
      },
      {
        "id": "teknoloji--japonya-nin-ham-maddesi-yetersizken-sanayide-gelismesi",
        "ad": "Japonya'nın ham maddesi yetersizken sanayide gelişmesi",
        "kategori": "Teknoloji"
      },
      {
        "id": "teknoloji--dort-sanayi-devriminin-gerceklesmesi",
        "ad": "Dört sanayi devriminin gerçekleşmesi",
        "kategori": "Teknoloji"
      },
      {
        "id": "devlet-politikalari--bazi-ulkelerde-ekonominin-onemli-olcude-devlet-kontrolunde-olmasi",
        "ad": "Bazı ülkelerde ekonominin önemli ölçüde devlet kontrolünde olması",
        "kategori": "Devlet politikaları"
      },
      {
        "id": "devlet-politikalari--bazi-ulkelerde-devletin-ekonomiye-mudahalesinin-sinirli-olmasi",
        "ad": "Bazı ülkelerde devletin ekonomiye müdahalesinin sınırlı olması",
        "kategori": "Devlet politikaları"
      },
      {
        "id": "ulasim--ham-maddenin-fabrikalara-islenmis-maddelerin-pazarlara-gonderilmesi",
        "ad": "Ham maddenin fabrikalara, işlenmiş maddelerin pazarlara gönderilmesi",
        "kategori": "Ulaşım"
      },
      {
        "id": "ulasim--turizm-faaliyetlerinin-kuresel-olcekte-gelismesi",
        "ad": "Turizm faaliyetlerinin küresel ölçekte gelişmesi",
        "kategori": "Ulaşım"
      }
    ]
  },
  {
    "id": "sanayi-devrimleri",
    "baslik": "Sanayi devrimleri",
    "alt": "Dört sanayi devrimini sırala",
    "yonerge": "Sanayi devrimlerini en eskiden en yeniye doğru sırala.",
    "turSecenekleri": [
      4,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Buhar gücüyle çalışan mekanik üretim",
        "anahtar": 1,
        "etiket": "1700'lerin sonu"
      },
      {
        "id": "s1",
        "ad": "Elektrikle çalışan seri üretim",
        "anahtar": 2,
        "etiket": "1870'ler"
      },
      {
        "id": "s2",
        "ad": "Elektronik tabanlı otomatik üretim",
        "anahtar": 3,
        "etiket": "1960'lar"
      },
      {
        "id": "s3",
        "ad": "Birbirine bağlı dijital teknolojilerle üretim",
        "anahtar": 4,
        "etiket": "2000'ler"
      }
    ],
    "uclar": [
      "En eski",
      "En yeni"
    ]
  },
  {
    "id": "sorular",
    "baslik": "Çoktan seçmeli",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Her sorunun doğru cevabını seç.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Ekonomik faaliyetler hangi süreçleri kapsar?",
        "secenekler": [
          "Üretim, dağıtım ve tüketim",
          "Yatırım, tasarruf ve vergi",
          "İthalat, ihracat ve gümrük",
          "Kaynak, sermaye ve iş gücü"
        ],
        "dogru": 0,
        "cozum": "Ekonomik faaliyetler; üretim, dağıtım ve tüketim süreçlerini kapsar (s.174)."
      },
      {
        "soru": "Kitaba göre bir yerin coğrafi özelliklerinin ana kaynağı nedir?",
        "secenekler": [
          "Coğrafi konum",
          "Bitki örtüsü",
          "Toprak yapısı",
          "Nüfus miktarı"
        ],
        "dogru": 0,
        "cozum": "Bir yerin coğrafi özelliklerinin ana kaynağı, o yerin sahip olduğu coğrafi konumdur (s.174)."
      },
      {
        "soru": "İklimin dolaylı etkiye sahip olduğu konu hangisidir?",
        "secenekler": [
          "Bazı sanayi kollarının icra edileceği yerlerin seçimi",
          "Tarım ürünlerinin çeşitlenmesi",
          "Turizm faaliyetlerinin çeşitlenmesi",
          "Ananas yetiştirilen alanların belirlenmesi"
        ],
        "dogru": 0,
        "cozum": "İklim; tarım ürünleri ve turizmin çeşitlenmesinde doğrudan, bazı sanayi kollarının yer seçiminde dolaylı etkilidir (s.174)."
      },
      {
        "soru": "Demir-çelik sanayisine ait tesisler genellikle hangi alanların yakınında kurulur?",
        "secenekler": [
          "Taş kömürünün çıkarıldığı alanlar",
          "Orman alanları",
          "Turizm merkezleri",
          "Tarım alanları"
        ],
        "dogru": 0,
        "cozum": "Enerji kaynaklarına yakınlığın önemine örnek olarak demir-çelik tesisleri taş kömürü çıkarılan alanların yakınında kurulur (s.175)."
      },
      {
        "soru": "Sanayi üretiminde yeterli ham maddeye sahip olmamasına rağmen yüksek teknoloji sayesinde sanayisi gelişen ülke hangisidir?",
        "secenekler": [
          "Japonya",
          "Pakistan",
          "Bangladeş",
          "Hindistan"
        ],
        "dogru": 0,
        "cozum": "Japonya, kullandığı yüksek teknoloji sayesinde sanayi faaliyetlerinin geliştiği önemli bir ülke hâline gelmiştir (s.178)."
      },
      {
        "soru": "Kitapta iş gücü maliyetlerinin düşük olduğu ülkelere örnek olarak hangisi verilmiştir?",
        "secenekler": [
          "Bangladeş",
          "Japonya",
          "ABD",
          "Almanya"
        ],
        "dogru": 0,
        "cozum": "Japonya, ABD, Almanya gibi ülkeler üretimin bir kısmını Pakistan, Hindistan, Bangladeş gibi iş gücü maliyeti düşük ülkelerde yapar (s.177)."
      },
      {
        "soru": "Gelişmekte olan ülkelere yabancı sermaye girişi neye bağlı olarak gerçekleşebilir?",
        "secenekler": [
          "Ekonomik, hukuki ve siyasal istikrara",
          "Nüfus artış hızının yüksekliğine",
          "Yağış miktarının fazlalığına",
          "Devlet kontrolünün artmasına"
        ],
        "dogru": 0,
        "cozum": "Yabancı sermaye girişi; ekonomik, hukuki ve siyasal istikrar sağlandığı ölçüde gerçekleşebilir (s.177)."
      },
      {
        "soru": "Çok uluslu şirketlerin üretimi birden fazla ülkede yürütmesinin sonucu hangisidir?",
        "secenekler": [
          "Maliyetlerin düşmesi",
          "Ülkeler arası ticaretin azalması",
          "Sermaye hareketliliğinin durması",
          "Maliyetlerin artması"
        ],
        "dogru": 0,
        "cozum": "Bu sayede maliyetler düşer, sermaye hareketliliği yaşanır ve ülkeler arası ticaret canlanır (s.177)."
      },
      {
        "soru": "Gece ışıklarına göre büyüyen ekonomilerde zamanla ne olur?",
        "secenekler": [
          "Daha fazla alan aydınlanır",
          "Daha fazla alan karanlıkta kalır",
          "Işık yoğunluğu değişmez",
          "Yalnız kıyı alanları kararır"
        ],
        "dogru": 0,
        "cozum": "Büyüyen ekonomilerde zamanla daha fazla alan aydınlanır; gelişmemiş bölgelerde daha fazla arazi karanlıkta kalır (s.173)."
      },
      {
        "soru": "Ulaşım sektörü açısından büyük ve işlek limanlara sahip ülkeler aynı zamanda nasıl yerlerdir?",
        "secenekler": [
          "Büyük sanayi veya ticaret tesislerinin bulunduğu yerler",
          "Tarım alanlarının en sınırlı olduğu yerler",
          "Nüfusu en az olan yerler",
          "Turizmin hiç gelişmediği yerler"
        ],
        "dogru": 0,
        "cozum": "Büyük ve işlek limanlara sahip ülkeler, büyük sanayi veya ticaret tesislerinin de bulunduğu yerlerdir (s.178)."
      },
      {
        "soru": "Hangisi kitapta topoğrafik özelliklere örnek olarak verilmiştir?",
        "secenekler": [
          "Yükselti, eğim, bakı",
          "Sıcaklık, yağış, rüzgâr",
          "Nüfus, sermaye, iş gücü",
          "Toprak, bitki örtüsü, su"
        ],
        "dogru": 0,
        "cozum": "Bir bölgenin topoğrafik özellikleri yükselti, eğim, bakı vb.dir (s.175)."
      },
      {
        "soru": "TEKNOSAB hangi ilçenin sınırları içinde yer almaktadır?",
        "secenekler": [
          "Karacabey",
          "Gemlik",
          "Bandırma",
          "Mudanya"
        ],
        "dogru": 0,
        "cozum": "TEKNOSAB, Bursa il merkezinin yaklaşık 30 km batısında Karacabey ilçesi sınırları içindedir (s.180)."
      }
    ]
  },
  {
    "id": "bosluk",
    "baslik": "Boşluk doldur",
    "alt": "Kitaptaki cümleleri tamamla",
    "yonerge": "Boşluğa gelecek kavramı bul.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "bosluk",
    "cumleler": [
      {
        "metin": "Ekonomik faaliyet; kaynak girdisi, {üretim süreci} ve ürün çıktısı (mal veya hizmet) ile karakterize edilir.",
        "kaynak": "s.174"
      },
      {
        "metin": "Büyük ticaret yollarının kavşak noktası veya doğal kaynaklara yakın stratejik konumlarda bulunan {Türkiye} gibi ülkeler, uluslararası ticarette önemli bir avantaja sahiptir.",
        "kaynak": "s.174"
      },
      {
        "metin": "Ulaşım sistemlerinin geliştiği {kıyı} bölgelerinde genellikle sanayi faaliyetlerinin de geliştiği görülmektedir.",
        "kaynak": "s.175"
      },
      {
        "metin": "Bir yerdeki su kaynakları, balıkçılık faaliyetlerinin ve {hidroelektrik} enerji üretiminin olmazsa olmazıdır.",
        "kaynak": "s.175"
      },
      {
        "metin": "Tarım faaliyetlerinin temelinde {toprak} vardır.",
        "kaynak": "s.175"
      },
      {
        "metin": "Bir yerin sahip olduğu {bitki örtüsü}, o alanda yürütülen hayvancılık faaliyetleri üzerinde etkilidir.",
        "kaynak": "s.175"
      },
      {
        "metin": "Bir ülkenin ekonomik büyüme hızı ile {nüfus artış hızı} dengeli olmalıdır.",
        "kaynak": "s.177"
      },
      {
        "metin": "Teknolojinin gelişmesi {dört} sanayi devriminin gerçekleşmesini sağlamıştır.",
        "kaynak": "s.178"
      },
      {
        "metin": "Turizm faaliyetlerinin küresel ölçekte gelişmesinde {ulaşım} sistemlerindeki gelişmelerin payı büyüktür.",
        "kaynak": "s.178"
      }
    ]
  },
  {
    "id": "bulmaca",
    "baslik": "Çengel bulmaca",
    "alt": "Tanımlardan kavramları bul",
    "yonerge": "İpuçlarından yola çıkarak kelimeleri bulmacaya yerleştir.",
    "turSecenekleri": [
      6,
      9
    ],
    "tur": "bulmaca",
    "kelimeler": [
      {
        "cevap": "Üretim",
        "ipucu": "Mal ve hizmetlerin işlemden geçirilip kullanıma hazır hâle getirilmesi"
      },
      {
        "cevap": "Dağıtım",
        "ipucu": "Üretilen mal ve hizmetlerin bir yerden başka yere aktarılması"
      },
      {
        "cevap": "Tüketim",
        "ipucu": "Mal ve hizmetlerin tüketiciler tarafından kullanılması"
      },
      {
        "cevap": "Sermaye",
        "ipucu": "Tesislerin kuruluşu, devamlılığı ve gelişmesinde etkin rol oynar"
      },
      {
        "cevap": "Teknoloji",
        "ipucu": "Gelişmesi dört sanayi devrimini sağlamıştır"
      },
      {
        "cevap": "Toprak",
        "ipucu": "Porselen, kiremit ve tuğla üretiminde ham madde"
      },
      {
        "cevap": "İklim",
        "ipucu": "Ananas ile buğdayın yetiştiği yerleri belirleyen doğal faktör"
      },
      {
        "cevap": "Japonya",
        "ipucu": "Ham maddesi yetersizken yüksek teknolojiyle sanayisi gelişen ülke"
      },
      {
        "cevap": "Ulaşım",
        "ipucu": "Ham maddenin fabrikaya, ürünün pazara gitmesini sağlar"
      },
      {
        "cevap": "Bakı",
        "ipucu": "Yükselti ve eğimle birlikte sayılan topoğrafik özellik"
      },
      {
        "cevap": "Peribacası",
        "ipucu": "Turizmi geliştiren ilgi çekici bir yeryüzü şekli"
      },
      {
        "cevap": "Karacabey",
        "ipucu": "TEKNOSAB'ın sınırları içinde yer aldığı ilçe"
      },
      {
        "cevap": "Konteyner",
        "ipucu": "Harita 5.1'de dünyanın başlıca limanları bu yük birimine göre gösterilir"
      }
    ]
  }
];
