/**
 * 9. sınıf Coğrafya — 3.1.4 İklim Sisteminde Yaşanan Değişiklikler
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.121-131.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "nedenler",
    "baslik": "Değişikliğin nedenleri",
    "alt": "Doğal faktör mü, insan faaliyeti mi?",
    "yonerge": "Her etkeni kitaba göre doğal faktörler ya da insan faaliyetleri grubuna yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Doğal Faktörler",
      "İnsan Faaliyetleri"
    ],
    "ogeler": [
      {
        "id": "dogal-faktorler--isinimsal-etkenler",
        "ad": "Işınımsal etkenler",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--atmosferdeki-sera-gazlarindaki-degisim",
        "ad": "Atmosferdeki sera gazlarındaki değişim",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--tektonik-hareketler",
        "ad": "Tektonik hareketler",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--eksen-egikligindeki-degisim-yalpalama",
        "ad": "Eksen eğikliğindeki değişim (yalpalama)",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--hindistan-levhasinin-kuzeye-kaymasi",
        "ad": "Hindistan levhasının kuzeye kayması",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "dogal-faktorler--atlas-ile-buyuk-okyanus-arasindaki-su-yolunun-kapanmasi",
        "ad": "Atlas ile Büyük Okyanus arasındaki su yolunun kapanması",
        "kategori": "Doğal Faktörler"
      },
      {
        "id": "insan-faaliyetleri--sanayi-faaliyetleri",
        "ad": "Sanayi faaliyetleri",
        "kategori": "İnsan Faaliyetleri"
      },
      {
        "id": "insan-faaliyetleri--bitki-ortusunun-tahrip-edilmesi",
        "ad": "Bitki örtüsünün tahrip edilmesi",
        "kategori": "İnsan Faaliyetleri"
      },
      {
        "id": "insan-faaliyetleri--ulasim-faaliyetleri",
        "ad": "Ulaşım faaliyetleri",
        "kategori": "İnsan Faaliyetleri"
      },
      {
        "id": "insan-faaliyetleri--sanayi-devrimi-sonrasi-artan-fosil-yakit-kullanimi",
        "ad": "Sanayi Devrimi sonrası artan fosil yakıt kullanımı",
        "kategori": "İnsan Faaliyetleri"
      },
      {
        "id": "insan-faaliyetleri--kentlesme",
        "ad": "Kentleşme",
        "kategori": "İnsan Faaliyetleri"
      }
    ]
  },
  {
    "id": "kavramlar",
    "baslik": "Kavramlar",
    "alt": "Kavramı tanımıyla eşleştir",
    "yonerge": "Soldaki kavramı kitaptaki tanımıyla eşleştir.",
    "turSecenekleri": [
      5,
      9
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Tanım",
    "ciftler": [
      {
        "id": "kuresel-iklim-degisikligi",
        "sol": "Küresel iklim değişikliği",
        "sag": "İklim özelliklerinde küresel çapta meydana gelen değişimler"
      },
      {
        "id": "sera-gazi",
        "sol": "Sera gazı",
        "sag": "Atmosferde ısıyı tutan su buharı, karbondioksit, metan gibi gazlar"
      },
      {
        "id": "sera-etkisi",
        "sol": "Sera etkisi",
        "sag": "Isının sera gazlarının etkisiyle atmosferde tutulması"
      },
      {
        "id": "aerosol",
        "sol": "Aerosol",
        "sag": "Atmosferdeki katı veya sıvı partikül"
      },
      {
        "id": "tektonizma",
        "sol": "Tektonizma",
        "sag": "Yer kabuğunu oluşturan levhaların hareketleri"
      },
      {
        "id": "antroposen",
        "sol": "Antroposen",
        "sag": "Artan insan faaliyetlerinin yaşandığı İnsan Çağı"
      },
      {
        "id": "permafrost",
        "sol": "Permafrost",
        "sag": "Devamlı donmuş topraklar"
      },
      {
        "id": "relikt-bitkiler",
        "sol": "Relikt bitkiler",
        "sag": "Geçmiş dönemlere ait kalıntı bitkiler"
      },
      {
        "id": "ipcc",
        "sol": "IPCC",
        "sag": "Hükûmetler Arası İklim Değişikliği Paneli"
      }
    ]
  },
  {
    "id": "sayilar",
    "baslik": "Sayılarla iklim değişikliği",
    "alt": "Bilgiyi kitaptaki değerle eşleştir",
    "yonerge": "Her bilgiyi kitapta verilen sayısal değerle eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Bilgi",
    "sagBaslik": "Değer",
    "ciftler": [
      {
        "id": "dunya-nin-ortalama-sicakligi",
        "sol": "Dünya'nın ortalama sıcaklığı",
        "sag": "15 °C"
      },
      {
        "id": "sera-etkisi-olmasaydi-dunya-nin-ortalama-sicakligi",
        "sol": "Sera etkisi olmasaydı Dünya'nın ortalama sıcaklığı",
        "sag": "-18 °C"
      },
      {
        "id": "xx-yuzyilda-dunya-genelindeki-sicaklik-artisi",
        "sol": "XX. yüzyılda dünya genelindeki sıcaklık artışı",
        "sag": "0,74 °C"
      },
      {
        "id": "sera-gazlari-2000-duzeyinde-tutulsa-bile-on-yillik-sicaklik-artisi",
        "sol": "Sera gazları 2000 düzeyinde tutulsa bile on yıllık sıcaklık artışı",
        "sag": "0,1 °C"
      },
      {
        "id": "turkiye-icin-2071-2080-ortalamasinda-beklenen-artis",
        "sol": "Türkiye için 2071-2080 ortalamasında beklenen artış",
        "sag": "Yaklaşık 4-5 °C"
      },
      {
        "id": "son-2-5-milyon-yilda-10-bin-yil-oncesine-kadar-yasanan-buzul-cagi-sayisi",
        "sol": "Son 2,5 milyon yılda (10 bin yıl öncesine kadar) yaşanan buzul çağı sayısı",
        "sag": "21"
      },
      {
        "id": "1-c-sicaklik-artisinin-atmosferdeki-nemi-artirma-orani",
        "sol": "1 °C sıcaklık artışının atmosferdeki nemi artırma oranı",
        "sag": "Yaklaşık %7"
      },
      {
        "id": "2150-yilina-kadar-deniz-seviyesinin-yukselebilecegi-miktar",
        "sol": "2150 yılına kadar deniz seviyesinin yükselebileceği miktar",
        "sag": "5 m"
      },
      {
        "id": "2080-de-afrika-da-kurak-ve-yari-kurak-bolgelerin-genisleme-orani",
        "sol": "2080'de Afrika'da kurak ve yarı kurak bölgelerin genişleme oranı",
        "sag": "%5-%8"
      },
      {
        "id": "2005-2050-arasinda-yaklasilacak-iklim-multecisi-sayisi",
        "sol": "2005-2050 arasında yaklaşılacak iklim mültecisi sayısı",
        "sag": "100 milyon"
      }
    ]
  },
  {
    "id": "emisyon-kaynaklari",
    "baslik": "Sera gazı kaynakları",
    "alt": "2019 insan kaynaklı emisyon payları",
    "yonerge": "2019 yılındaki insan kaynaklı sera gazı emisyonlarının kaynaklarını payı en büyük olandan en küçüğe sırala.",
    "turSecenekleri": [
      5,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Enerji tedarik sektörü",
        "anahtar": 33,
        "etiket": "%33"
      },
      {
        "id": "s1",
        "ad": "Sanayi",
        "anahtar": 24,
        "etiket": "%24"
      },
      {
        "id": "s2",
        "ad": "Tarım, ormancılık ve diğer arazi kullanımı",
        "anahtar": 22,
        "etiket": "%22"
      },
      {
        "id": "s3",
        "ad": "Ulaşım",
        "anahtar": 15,
        "etiket": "%15"
      },
      {
        "id": "s4",
        "ad": "Konutlar",
        "anahtar": 6,
        "etiket": "%6"
      }
    ],
    "uclar": [
      "En büyük pay",
      "En küçük pay"
    ]
  },
  {
    "id": "gozlenen-ongorulen",
    "baslik": "Gerçekleşmiş mi, öngörülen mi?",
    "alt": "Etkinin bugüne kadar gerçekleşmiş mi yoksa gelecek için mi beklendiğini ayır",
    "yonerge": "Her etkiyi kitaba göre bugüne kadar gerçekleşmiş etkiler ya da geleceğe yönelik öngörüler grubuna yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Gerçekleşmiş etkiler",
      "Geleceğe yönelik öngörüler"
    ],
    "ogeler": [
      {
        "id": "gerceklesmis-etkiler--kuzey-yarim-kurede-gol-ve-akarsularin-donma-suresinin-kisalmasi",
        "ad": "Kuzey yarım kürede göl ve akarsuların donma süresinin kısalması",
        "kategori": "Gerçekleşmiş etkiler"
      },
      {
        "id": "gerceklesmis-etkiler--ilkbaharda-kar-ortusuyle-kapli-surenin-kisalmasi",
        "ad": "İlkbaharda kar örtüsüyle kaplı sürenin kısalması",
        "kategori": "Gerçekleşmiş etkiler"
      },
      {
        "id": "gerceklesmis-etkiler--kuzey-okyanusu-nda-deniz-buzulu-alaninin-son-30-yilda-azalmasi",
        "ad": "Kuzey Okyanusu'nda deniz buzulu alanının son 30 yılda azalması",
        "kategori": "Gerçekleşmiş etkiler"
      },
      {
        "id": "gerceklesmis-etkiler--bitkilerin-yaprak-cikarma-ve-cicek-acma-tarihlerinin-degismesi",
        "ad": "Bitkilerin yaprak çıkarma ve çiçek açma tarihlerinin değişmesi",
        "kategori": "Gerçekleşmiş etkiler"
      },
      {
        "id": "gerceklesmis-etkiler--cenova-da-at-kestanesi-agaclarinin-daha-erken-tomurcuklanmasi",
        "ad": "Cenova'da at kestanesi ağaçlarının daha erken tomurcuklanması",
        "kategori": "Gerçekleşmiş etkiler"
      },
      {
        "id": "gerceklesmis-etkiler--son-buzul-caginda-hazar-denizi-ile-karadeniz-in-birlesmesi",
        "ad": "Son buzul çağında Hazar Denizi ile Karadeniz'in birleşmesi",
        "kategori": "Gerçekleşmiş etkiler"
      },
      {
        "id": "gelecege-yonelik-ongoruler--ege-ve-akdeniz-kiyilarinda-yagisin-azalmasi",
        "ad": "Ege ve Akdeniz kıyılarında yağışın azalması",
        "kategori": "Geleceğe yönelik öngörüler"
      },
      {
        "id": "gelecege-yonelik-ongoruler--karadeniz-kiyilarinda-yagisin-artmasi",
        "ad": "Karadeniz kıyılarında yağışın artması",
        "kategori": "Geleceğe yönelik öngörüler"
      },
      {
        "id": "gelecege-yonelik-ongoruler--maldivler-gibi-alcak-adalarin-buyuk-oranda-deniz-altinda-kalmasi",
        "ad": "Maldivler gibi alçak adaların büyük oranda deniz altında kalması",
        "kategori": "Geleceğe yönelik öngörüler"
      },
      {
        "id": "gelecege-yonelik-ongoruler--hastalik-tasiyan-bocek-ve-kemirgenlerin-daha-genis-alana-dagilmasi",
        "ad": "Hastalık taşıyan böcek ve kemirgenlerin daha geniş alana dağılması",
        "kategori": "Geleceğe yönelik öngörüler"
      },
      {
        "id": "gelecege-yonelik-ongoruler--orta-asya-nin-kuzeyi-ile-kuzey-amerika-nin-en-cok-isinan-bolgeler-olmasi",
        "ad": "Orta Asya'nın kuzeyi ile Kuzey Amerika'nın en çok ısınan bölgeler olması",
        "kategori": "Geleceğe yönelik öngörüler"
      },
      {
        "id": "gelecege-yonelik-ongoruler--afrika-da-kurak-ve-yari-kurak-bolgelerin-genislemesi",
        "ad": "Afrika'da kurak ve yarı kurak bölgelerin genişlemesi",
        "kategori": "Geleceğe yönelik öngörüler"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Sorular",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Her soruda kitaba göre doğru olan şıkkı seç.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "İklim sisteminin en önemli girdisi nedir?",
        "secenekler": [
          "Güneş'ten alınan enerji",
          "Volkanik faaliyetler",
          "Okyanus akıntıları",
          "Atmosferdeki azot"
        ],
        "dogru": 0,
        "cozum": "İklim sisteminin en önemli girdisi Güneş'ten alınan enerjidir (s.121)."
      },
      {
        "soru": "Bugün yaklaşık 23° 27' olan eksen eğikliği ortalama 42 bin yıllık süreçte hangi değerler arasında değişmektedir?",
        "secenekler": [
          "22,1° ile 24,5°",
          "20° ile 25°",
          "23° ile 23,5°",
          "21,5° ile 26,5°"
        ],
        "dogru": 0,
        "cozum": "Eksen eğikliğinin 42 bin yıllık süreçte 22,1° ile 24,5° arasında değiştiği (yalpalama) tespit edilmiştir (s.121)."
      },
      {
        "soru": "Atmosferdeki karbondioksit seviyesi ile küresel sıcaklıklar arasındaki yakın ilişki özellikle hangi örnekler üzerindeki çalışmalarla kanıtlanmıştır?",
        "secenekler": [
          "Buzullardaki hava kabarcıkları",
          "Deniz suyu örnekleri",
          "Volkanik kayaçlar",
          "Mağara duvarları"
        ],
        "dogru": 0,
        "cozum": "Buzullardaki hava kabarcıklarından alınan örnekler üzerinde yapılan çalışmalarla bu ilişki kanıtlanmıştır (s.122)."
      },
      {
        "soru": "Yaklaşık 200 milyon yıl önce Güney Kutbu'na yakın olup kuzeye kayarak Asya ile birleşen ve üzerindeki buzullar eriyen levha hangisidir?",
        "secenekler": [
          "Hindistan levhası",
          "Afrika levhası",
          "Avustralya levhası",
          "Güney Amerika levhası"
        ],
        "dogru": 0,
        "cozum": "Hindistan levhası tektonik hareketlerle kuzeye kaymış, sıcak kuşağa yaklaşınca buzulları erimiştir (s.122)."
      },
      {
        "soru": "İnsanın iklim üzerindeki lokal etkileri hangi gelişmeden sonra artan fosil yakıt kullanımıyla küresel boyuta taşınmıştır?",
        "secenekler": [
          "Sanayi Devrimi",
          "Coğrafi Keşifler",
          "Tarım Devrimi",
          "Son buzul çağı"
        ],
        "dogru": 0,
        "cozum": "Sanayi Devrimi sonrası artan fosil yakıt kullanımı etkileri küresel boyuta taşımıştır (s.124)."
      },
      {
        "soru": "Kitaba göre insan, bugün yerküredeki karaların yaklaşık ne kadarını tarım alanı hâline getirmiştir?",
        "secenekler": [
          "Üçte birini",
          "Yarısını",
          "Beşte birini",
          "Dörtte üçünü"
        ],
        "dogru": 0,
        "cozum": "İnsan, karaların yaklaşık üçte birini tarım alanı hâline getirmiştir; orman alanlarının beşte biri ise yok edilmiştir (s.124)."
      },
      {
        "soru": "Son buzul çağı maksimum seviyesini ne zaman yaşamıştır?",
        "secenekler": [
          "21 bin yıl önce",
          "10 bin yıl önce",
          "2,5 milyon yıl önce",
          "42 bin yıl önce"
        ],
        "dogru": 0,
        "cozum": "Son buzul çağı 21 bin yıl önce maksimum seviyesini yaşayıp yaklaşık 10 bin yıl önce sona ermiştir (s.125)."
      },
      {
        "soru": "Son buzul çağında deniz seviyeleri düşerken iç kesimlerdeki göllerin seviyesinin yükselmesinin nedeni nedir?",
        "secenekler": [
          "Buharlaşmanın azalması",
          "Yağışın tamamen kesilmesi",
          "Deniz seviyesinin yükselmesi",
          "Buzulların hızla erimesi"
        ],
        "dogru": 0,
        "cozum": "İç kesimlerde buharlaşmanın azalmasıyla göllerin seviyesi yükselmiş, Hazar Denizi ile Karadeniz birleşmiştir (s.125)."
      },
      {
        "soru": "Okyanuslarda su sıcaklığının yükselmesi suyun yoğunluğunu ve hacmini nasıl etkilemiştir?",
        "secenekler": [
          "Yoğunluk azalmış, hacim artmıştır",
          "Yoğunluk artmış, hacim azalmıştır",
          "İkisi de artmıştır",
          "İkisi de azalmıştır"
        ],
        "dogru": 0,
        "cozum": "Su sıcaklığının yükselmesi yoğunluğun azalmasına ve hacmin artmasına neden olmuş, bu termal genleşme deniz seviyesini etkilemektedir (s.128)."
      },
      {
        "soru": "Kitaba göre 2100 yılına kadar küresel deniz seviyesinin ne kadar yükselebileceği hesaplanmaktadır?",
        "secenekler": [
          "28 cm ile 2 m arasında",
          "5 m ile 10 m arasında",
          "1 cm ile 10 cm arasında",
          "Hiç değişmeyecek"
        ],
        "dogru": 0,
        "cozum": "Küresel deniz seviyesinin 2100'e kadar 28 cm ile 2 m arasında, 2150'ye kadar 5 m yükselebileceği hesaplanmaktadır (s.127)."
      },
      {
        "soru": "Küresel iklim değişikliği ile mücadele çalışmaları hangi yıllarda başlamıştır?",
        "secenekler": [
          "1990'lı yıllarda",
          "1950'li yıllarda",
          "1970'li yıllarda",
          "2010'lu yıllarda"
        ],
        "dogru": 0,
        "cozum": "Küresel ısınma ve iklim değişikliğiyle mücadele çalışmaları 1990'lı yıllarda başlamıştır (s.127)."
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
        "metin": "Su buharının atmosferde yoğunlaşmasıyla hidrosfer ve {kriyosfer} oluşmuştur.",
        "kaynak": "s.121"
      },
      {
        "metin": "İklim değişikliklerinin nedenleri doğal faktörler ve {insan faaliyetleri} olmak üzere ikiye ayrılır.",
        "kaynak": "s.121"
      },
      {
        "metin": "Eksen eğikliğindeki değişimin Güneş'ten alınan enerjide yaklaşık {%1}'lik bir değişime neden olduğu hesaplanmaktadır.",
        "kaynak": "s.121"
      },
      {
        "metin": "Isının sera gazlarının etkisiyle atmosferde tutulmasına {sera etkisi} adı verilir.",
        "kaynak": "s.122"
      },
      {
        "metin": "Sanayi Devrimi öncesine göre yerküredeki orman alanlarının {beşte biri} yok edilmiştir.",
        "kaynak": "s.124"
      },
      {
        "metin": "Küresel sıcaklık artışının etkilerinin en belirgin hissedildiği iklim sistemi bileşenlerinden biri de {kriyosferdir}.",
        "kaynak": "s.126"
      },
      {
        "metin": "Özellikle hidroklimatik kökenli kasırga, sel ve taşkın, kuraklık, sıcak hava dalgası gibi {ekstrem} doğa olaylarının sayısında artışlar olmuştur.",
        "kaynak": "s.126"
      },
      {
        "metin": "2080 yılına kadar Türkiye'nin Ege ve Akdeniz kıyılarında yağış miktarının azalacağı buna karşın {Karadeniz} kıyılarında artacağı belirtilmektedir.",
        "kaynak": "s.127"
      }
    ]
  },
  {
    "id": "bulmaca",
    "baslik": "Çengel bulmaca",
    "alt": "Tanımlardan kavramları bul",
    "yonerge": "İpuçlarından kavramları bulup bulmacaya yerleştir.",
    "turSecenekleri": [
      6,
      9
    ],
    "tur": "bulmaca",
    "kelimeler": [
      {
        "cevap": "ANTROPOSEN",
        "ipucu": "İnsan Çağı olarak adlandırılan dönem"
      },
      {
        "cevap": "PERMAFROST",
        "ipucu": "Devamlı donmuş topraklar"
      },
      {
        "cevap": "TEKTONİZMA",
        "ipucu": "Yer kabuğunu oluşturan levhaların hareketleri"
      },
      {
        "cevap": "AEROSOL",
        "ipucu": "Atmosferdeki katı veya sıvı partikül"
      },
      {
        "cevap": "METAN",
        "ipucu": "Formülü CH4 olan sera gazı"
      },
      {
        "cevap": "YALPALAMA",
        "ipucu": "Eksen eğikliğinin 22,1° ile 24,5° arasında değişmesi"
      },
      {
        "cevap": "KRİYOSFER",
        "ipucu": "Kar örtüsü, deniz buzları, permafrost ve buzulları kapsayan bileşen"
      },
      {
        "cevap": "HİNDİSTAN",
        "ipucu": "Kuzeye kayarak Asya ile birleşen, buzulları eriyen levha"
      },
      {
        "cevap": "MALDİVLER",
        "ipucu": "Deniz altında kalacağı öngörülen alçak adalar"
      },
      {
        "cevap": "CENOVA",
        "ipucu": "At kestanesi ağaçlarının tomurcuklanmasının incelendiği İtalya kenti"
      },
      {
        "cevap": "HAZAR",
        "ipucu": "Son buzul çağında Karadeniz ile birleşen deniz"
      },
      {
        "cevap": "RELİKT",
        "ipucu": "Geçmiş dönemlere ait kalıntı bitkiler için kullanılan sıfat"
      }
    ]
  }
];
