/**
 * 9. sınıf Coğrafya — 6.1.1 Tehlike, Risk ve Afet
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.190-193.
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
        "id": "tehlike",
        "sol": "Tehlike",
        "sag": "Belli zaman ve yerde ortaya çıkıp insan hayatını, mal varlığını ve doğal çevreyi olumsuz etkileme potansiyeli"
      },
      {
        "id": "risk",
        "sol": "Risk",
        "sag": "Bir olayın meydana gelme ihtimali ve can, mal, ekonomik ve çevresel değer kaybı olasılığı"
      },
      {
        "id": "afet",
        "sol": "Afet",
        "sag": "Olağan hayat düzenini bozan, uyum kapasitesini aşarak dış yardım gerektiren olay"
      },
      {
        "id": "ekstrem-doga-olayi",
        "sol": "Ekstrem doğa olayı",
        "sag": "Doğanın akışındaki bir olayın aşırı veya sıra dışı şekilde meydana gelmesi"
      },
      {
        "id": "guvenlik-acigi",
        "sol": "Güvenlik açığı",
        "sag": "Tehlikelere karşı önlem alınmadığında oluşan ve risk doğuran durum"
      },
      {
        "id": "doga-kaynakli-tehlike",
        "sol": "Doğa kaynaklı tehlike",
        "sag": "Deprem, sel, taşkın, volkanik patlama, tsunami, çığ, fırtına, tayfun"
      },
      {
        "id": "insan-kaynakli-olay",
        "sol": "İnsan kaynaklı olay",
        "sag": "Yangın, patlama, kaza, salgın hastalık, savaş"
      }
    ]
  },
  {
    "id": "tehlike-risk-afet",
    "baslik": "Tehlike mi, risk mi, afet mi?",
    "alt": "Örnekleri doğru kavrama yerleştir",
    "yonerge": "Kitaptaki sel ve deprem örneklerindeki durumları tehlike, riski oluşturan/artıran durum ve afet olarak ayır.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Tehlike",
      "Riski oluşturan veya artıran durum",
      "Afet"
    ],
    "ogeler": [
      {
        "id": "tehlike--asiri-yagislarin-etkisiyle-tasan-akarsu",
        "ad": "Aşırı yağışların etkisiyle taşan akarsu",
        "kategori": "Tehlike"
      },
      {
        "id": "tehlike--aktif-fay-hatlarinin-gectigi-bolgeler",
        "ad": "Aktif fay hatlarının geçtiği bölgeler",
        "kategori": "Tehlike"
      },
      {
        "id": "tehlike--yildirim-dusmesi-veya-asiri-sicaklara-bagli-orman-yanginlari",
        "ad": "Yıldırım düşmesi veya aşırı sıcaklara bağlı orman yangınları",
        "kategori": "Tehlike"
      },
      {
        "id": "riski-olusturan-veya-artiran-durum--vadi-tabaninin-yerlesime-acilmasi",
        "ad": "Vadi tabanının yerleşime açılması",
        "kategori": "Riski oluşturan veya artıran durum"
      },
      {
        "id": "riski-olusturan-veya-artiran-durum--akarsu-yataginin-daraltilmasi",
        "ad": "Akarsu yatağının daraltılması",
        "kategori": "Riski oluşturan veya artıran durum"
      },
      {
        "id": "riski-olusturan-veya-artiran-durum--yapilarin-sele-direncli-olmamasi",
        "ad": "Yapıların sele dirençli olmaması",
        "kategori": "Riski oluşturan veya artıran durum"
      },
      {
        "id": "riski-olusturan-veya-artiran-durum--tahliye-planinin-yapilmamasi",
        "ad": "Tahliye planının yapılmaması",
        "kategori": "Riski oluşturan veya artıran durum"
      },
      {
        "id": "riski-olusturan-veya-artiran-durum--depreme-direncli-olmayan-yerlesim-alanlarinin-kurulmasi",
        "ad": "Depreme dirençli olmayan yerleşim alanlarının kurulması",
        "kategori": "Riski oluşturan veya artıran durum"
      },
      {
        "id": "afet--sel-nedeniyle-yerlesim-alaninda-can-ve-mal-kayiplarinin-yasanmasi",
        "ad": "Sel nedeniyle yerleşim alanında can ve mal kayıplarının yaşanması",
        "kategori": "Afet"
      },
      {
        "id": "afet--depremde-saglam-olmayan-yapilarin-zarar-gormesiyle-can-ve-mal-kaybi",
        "ad": "Depremde sağlam olmayan yapıların zarar görmesiyle can ve mal kaybı",
        "kategori": "Afet"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Tehlike, risk ve afet",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Doğru seçeneği işaretle.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Bir olayın afet kabul edilebilmesi için ne gerekir?",
        "secenekler": [
          "İnsanlar, diğer canlılar ve çevre üzerinde etkiler meydana getirmesi",
          "Mutlaka deprem kaynaklı olması",
          "Yalnızca gelişmiş ülkelerde yaşanması",
          "Birden fazla ülkeyi etkilemesi"
        ],
        "dogru": 0,
        "cozum": "Bir olayın afet sayılması için insanlar, diğer canlılar ve çevre üzerinde etkiler oluşturması gerekir (s.190)."
      },
      {
        "soru": "Türkiye nüfusunun yaklaşık ne kadarı deprem riskinin yüksek olduğu alanlarda yaşamaktadır?",
        "secenekler": [
          "%75",
          "%25",
          "%50",
          "%90"
        ],
        "dogru": 0,
        "cozum": "Türkiye nüfusunun yaklaşık %75'i deprem riskinin yüksek olduğu alanlarda yaşar (s.190)."
      },
      {
        "soru": "Bugüne kadar ölçülebilen en büyük yer sarsıntısı hangisidir?",
        "secenekler": [
          "1960 Şili depremi (9,5)",
          "1999 Gölcük depremi (7,4)",
          "1939 Erzincan depremi (7,9)",
          "2023 Pazarcık depremi (7,7)"
        ],
        "dogru": 0,
        "cozum": "1960'ta Şili'de meydana gelen 9,5 büyüklüğündeki deprem, ölçülebilen en büyük yer sarsıntısıdır (s.191)."
      },
      {
        "soru": "Ekstrem doğa olaylarının beşerî unsurlar üzerindeki etkileri neye göre farklılık gösterir?",
        "secenekler": [
          "Bölgenin gelişmişlik seviyesi ve nüfus yoğunluğuna",
          "Yalnızca olayın gerçekleştiği mevsime",
          "Yalnızca bölgenin denize uzaklığına",
          "Olayın gece mi gündüz mü olduğuna"
        ],
        "dogru": 0,
        "cozum": "Etkiler, bölge veya ülkenin gelişmişlik seviyesi ve nüfus yoğunluğuna göre farklılık gösterir (s.191)."
      },
      {
        "soru": "Kitaba göre riski belirleyen ana unsurlar nelerdir?",
        "secenekler": [
          "İnsan ve faaliyetleri ile doğa ve insan kaynaklı tehlikeler",
          "Yalnızca iklim koşulları",
          "Yalnızca yer şekilleri",
          "Yalnızca ülkenin ekonomik büyüklüğü"
        ],
        "dogru": 0,
        "cozum": "Riski belirleyen ana unsurlar, insan ve faaliyetleri ile doğa ve insan kaynaklı tehlikelerdir (s.191)."
      },
      {
        "soru": "Afeti diğer olaylardan ayıran özelliklerden biri hangisidir?",
        "secenekler": [
          "İnsanların uyum sağlama kapasitesini aşarak dış yardım gerektirmesi",
          "Mutlaka uzun süre devam etmesi",
          "Yalnızca kırsal alanlarda görülmesi",
          "Önceden kesin olarak tahmin edilebilmesi"
        ],
        "dogru": 0,
        "cozum": "Afet, uyum sağlama kapasitesini aşarak dış yardıma gereksinim duyulan olaydır (s.191)."
      },
      {
        "soru": "Kitaptaki sel örneğinde riski artıran eksikliklerden biri hangisidir?",
        "secenekler": [
          "Akarsu yatağının daraltılması",
          "Tahliye planının yapılması",
          "Yapıların sele dirençli inşa edilmesi",
          "Vadi tabanının yerleşime kapatılması"
        ],
        "dogru": 0,
        "cozum": "Akarsu yatağının daraltılması, yapıların sele dirençli olmaması ve tahliye planı yapılmaması riski artırır (s.191)."
      },
      {
        "soru": "Kitaba göre doğa ve insan kaynaklı tehlikeler önlem alınmazsa neye neden olarak risk oluşturur?",
        "secenekler": [
          "Güvenlik açığına",
          "Ekstrem doğa olayına",
          "Bilgi kirliliğine",
          "Nüfus artışına"
        ],
        "dogru": 0,
        "cozum": "Tehlikeler önlem alınmazsa güvenlik açığına neden olarak risk oluşturur (s.191, Görsel 6.4)."
      },
      {
        "soru": "17 Ağustos 1999 depremi hangi fay sisteminde meydana gelmiştir?",
        "secenekler": [
          "Kuzey Anadolu Fay Sistemi",
          "Doğu Anadolu Fay Sistemi",
          "Batı Anadolu Fay Sistemi",
          "Ölü Deniz Fay Sistemi"
        ],
        "dogru": 0,
        "cozum": "Gölcük merkezli 7,4 büyüklüğündeki deprem, Kuzey Anadolu Fay Sistemi'nde meydana gelmiştir (s.192)."
      },
      {
        "soru": "1999 depreminde can ve mal kaybını artıran durum hangisidir?",
        "secenekler": [
          "Sanayi, şehirleşme ve nüfus yoğunluğunun fazla olduğu bir bölgede yaşanması",
          "Seyrek nüfuslu bir bölgede yaşanması",
          "Binaların kurallara uygun inşa edilmesi",
          "Yerleşmelerin zemin durumuna göre kurulması"
        ],
        "dogru": 0,
        "cozum": "Depremin sanayi merkezlerinin bulunduğu, şehirleşme ve nüfus yoğunluğunun fazla olduğu bölgede yaşanması kaybı artırmıştır (s.192)."
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
        "metin": "Türkiye'de aktif fay hatlarının geçtiği bölgeler {deprem} tehlikesi olan yerlerdir.",
        "kaynak": "s.190"
      },
      {
        "metin": "Bu bölgelerde depreme {dirençli} olmayan yerleşim alanlarının kurulması afet riskini artırmaktadır.",
        "kaynak": "s.190"
      },
      {
        "metin": "Afetler; tehlike, {maruziyet} ve risk kavramlarıyla doğrudan ilişkilidir.",
        "kaynak": "s.190"
      },
      {
        "metin": "Doğanın akışı içinde gerçekleşen bir olayın aşırı veya sıra dışı şekilde meydana gelmesi {ekstrem doğa olayı} olarak adlandırılmaktadır.",
        "kaynak": "s.191"
      },
      {
        "metin": "1960 yılında Şili'de meydana gelen {9,5} büyüklüğündeki deprem, bugüne kadar ölçülebilen en büyük yer sarsıntısıdır.",
        "kaynak": "s.191"
      },
      {
        "metin": "Bir alandaki risk, tehlike ve insanların bu tehlikeye {maruz kalmasıyla} doğrudan ilişkilidir.",
        "kaynak": "s.191"
      },
      {
        "metin": "Türkiye'de 17 Ağustos 1999 tarihinde {Gölcük} (Kocaeli) merkezli 7,4 büyüklüğünde bir deprem meydana gelmiştir.",
        "kaynak": "s.192"
      },
      {
        "metin": "Yıkıcı depremlerin kurallara uygun inşa edilen binalarda {asgari} düzeyde hasar oluşturduğu görülmüştür.",
        "kaynak": "s.192"
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
        "cevap": "Tehlike",
        "ipucu": "Afetlerin kaynağını oluşturan, olumsuz etkileme potansiyeli taşıyan durum"
      },
      {
        "cevap": "Risk",
        "ipucu": "Bir olayın meydana gelme ihtimali ve kayıp olasılığı"
      },
      {
        "cevap": "Afet",
        "ipucu": "Uyum kapasitesini aşarak dış yardım gerektiren olay"
      },
      {
        "cevap": "Maruziyet",
        "ipucu": "Tehlike ve risk ile birlikte afetlerle doğrudan ilişkili kavram"
      },
      {
        "cevap": "Ekstrem",
        "ipucu": "Aşırı veya sıra dışı doğa olayını niteleyen sözcük"
      },
      {
        "cevap": "Şili",
        "ipucu": "1960'ta 9,5 büyüklüğünde depremin yaşandığı ülke"
      },
      {
        "cevap": "Gölcük",
        "ipucu": "17 Ağustos 1999 depreminin merkezi"
      },
      {
        "cevap": "Sel",
        "ipucu": "Aşırı yağışla taşan akarsuyun oluşturduğu tehlike"
      },
      {
        "cevap": "Tahliye",
        "ipucu": "Yapılmaması riski artıran plan türü"
      },
      {
        "cevap": "Deprem",
        "ipucu": "Aktif fay hatlarının geçtiği bölgelerdeki tehlike"
      },
      {
        "cevap": "Java",
        "ipucu": "Dere kenarındaki yerleşimlerin risk altında gösterildiği Endonezya adası"
      },
      {
        "cevap": "AFAD",
        "ipucu": "Türkiye deprem tehlike haritasını (Harita 6.1) hazırlayan kurum"
      }
    ]
  }
];
