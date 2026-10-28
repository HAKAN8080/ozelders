/**
 * 9. sınıf Coğrafya — 6.1.3 Bütüncül Afet Yönetimi
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.202-209.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "asamalar",
    "baslik": "Aşamaların sırası",
    "alt": "Bütüncül afet yönetimi aşamalarını sırala",
    "yonerge": "Bütüncül afet yönetiminin aşamalarını kitaptaki sırasıyla diz.",
    "turSecenekleri": [
      5,
      0
    ],
    "tur": "siralama",
    "ogeler": [
      {
        "id": "s0",
        "ad": "Risk ve zarar azaltma",
        "anahtar": 1,
        "etiket": "1. Risk yönetimi"
      },
      {
        "id": "s1",
        "ad": "Hazırlıklı olma",
        "anahtar": 2,
        "etiket": "2. Risk yönetimi"
      },
      {
        "id": "s2",
        "ad": "Müdahale",
        "anahtar": 3,
        "etiket": "3. Kriz yönetimi"
      },
      {
        "id": "s3",
        "ad": "İyileştirme",
        "anahtar": 4,
        "etiket": "4. Kriz yönetimi"
      }
    ],
    "uclar": [
      "İlk aşama",
      "Son aşama"
    ]
  },
  {
    "id": "asama-faaliyetleri",
    "baslik": "Hangi aşamada yapılır?",
    "alt": "Faaliyetleri aşamalara ayır",
    "yonerge": "Her faaliyeti kitapta yer aldığı bütüncül afet yönetimi aşamasına yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Risk ve zarar azaltma",
      "Hazırlıklı olma",
      "Müdahale",
      "İyileştirme"
    ],
    "ogeler": [
      {
        "id": "risk-ve-zarar-azaltma--tehlike-haritalarinin-hazirlanmasi",
        "ad": "Tehlike haritalarının hazırlanması",
        "kategori": "Risk ve zarar azaltma"
      },
      {
        "id": "risk-ve-zarar-azaltma--afet-icin-uygulanacak-yasal-duzenlemelerin-olusturulmasi",
        "ad": "Afet için uygulanacak yasal düzenlemelerin oluşturulması",
        "kategori": "Risk ve zarar azaltma"
      },
      {
        "id": "risk-ve-zarar-azaltma--yapilanma-ve-afet-yonetmeliklerinin-yeniden-duzenlenmesi",
        "ad": "Yapılanma ve afet yönetmeliklerinin yeniden düzenlenmesi",
        "kategori": "Risk ve zarar azaltma"
      },
      {
        "id": "hazirlikli-olma--tahliye-surecinin-sekillendirilmesi",
        "ad": "Tahliye sürecinin şekillendirilmesi",
        "kategori": "Hazırlıklı olma"
      },
      {
        "id": "hazirlikli-olma--toplanma-merkezinin-belirlenmesi",
        "ad": "Toplanma merkezinin belirlenmesi",
        "kategori": "Hazırlıklı olma"
      },
      {
        "id": "hazirlikli-olma--acil-eylem-planinin-hazirlanmasi",
        "ad": "Acil eylem planının hazırlanması",
        "kategori": "Hazırlıklı olma"
      },
      {
        "id": "hazirlikli-olma--erken-uyari-sistemlerinin-kurulmasi",
        "ad": "Erken uyarı sistemlerinin kurulması",
        "kategori": "Hazırlıklı olma"
      },
      {
        "id": "mudahale--arama-kurtarma-faaliyetleri",
        "ad": "Arama kurtarma faaliyetleri",
        "kategori": "Müdahale"
      },
      {
        "id": "mudahale--gida-barinma-ilac-guvenlik-ihtiyaclarinin-karsilanmasi",
        "ad": "Gıda, barınma, ilaç, güvenlik ihtiyaçlarının karşılanması",
        "kategori": "Müdahale"
      },
      {
        "id": "mudahale--hasar-tespiti-ve-enkazlarin-kaldirilmasi",
        "ad": "Hasar tespiti ve enkazların kaldırılması",
        "kategori": "Müdahale"
      },
      {
        "id": "iyilestirme--haberlesme-ulasim-ve-elektrigin-normale-dondurulmesi",
        "ad": "Haberleşme, ulaşım ve elektriğin normale döndürülmesi",
        "kategori": "İyileştirme"
      },
      {
        "id": "iyilestirme--kalici-konut-calismalari",
        "ad": "Kalıcı konut çalışmaları",
        "kategori": "İyileştirme"
      },
      {
        "id": "iyilestirme--ekonomik-ve-sosyal-hayatin-normale-donmesi",
        "ad": "Ekonomik ve sosyal hayatın normale dönmesi",
        "kategori": "İyileştirme"
      }
    ]
  },
  {
    "id": "risk-kriz",
    "baslik": "Risk yönetimi mi, kriz yönetimi mi?",
    "alt": "İki ana bölüme ayır",
    "yonerge": "Aşama ve özellikleri risk yönetimi ya da kriz yönetimi altına yerleştir.",
    "turSecenekleri": [
      8,
      12
    ],
    "tur": "kategori",
    "kategoriler": [
      "Risk yönetimi",
      "Kriz yönetimi"
    ],
    "ogeler": [
      {
        "id": "risk-yonetimi--risk-ve-zarar-azaltma",
        "ad": "Risk ve zarar azaltma",
        "kategori": "Risk yönetimi"
      },
      {
        "id": "risk-yonetimi--hazirlikli-olma",
        "ad": "Hazırlıklı olma",
        "kategori": "Risk yönetimi"
      },
      {
        "id": "risk-yonetimi--afet-oncesinde-yurutulen-calismalar",
        "ad": "Afet öncesinde yürütülen çalışmalar",
        "kategori": "Risk yönetimi"
      },
      {
        "id": "risk-yonetimi--olasi-bir-afetten-etkilenmenin-onune-gecme-amaci",
        "ad": "Olası bir afetten etkilenmenin önüne geçme amacı",
        "kategori": "Risk yönetimi"
      },
      {
        "id": "kriz-yonetimi--mudahale",
        "ad": "Müdahale",
        "kategori": "Kriz yönetimi"
      },
      {
        "id": "kriz-yonetimi--iyilestirme",
        "ad": "İyileştirme",
        "kategori": "Kriz yönetimi"
      },
      {
        "id": "kriz-yonetimi--afet-esnasi-ve-sonrasinda-yurutulen-faaliyetler",
        "ad": "Afet esnası ve sonrasında yürütülen faaliyetler",
        "kategori": "Kriz yönetimi"
      },
      {
        "id": "kriz-yonetimi--yeniden-yapilanma-en-uzun-suren-evre",
        "ad": "Yeniden yapılanma (en uzun süren evre)",
        "kategori": "Kriz yönetimi"
      }
    ]
  },
  {
    "id": "kavramlar",
    "baslik": "Kavramlar",
    "alt": "Kavramı açıklamasıyla eşleştir",
    "yonerge": "Her kavramı kitaptaki açıklamasıyla eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Kavram",
    "sagBaslik": "Açıklama",
    "ciftler": [
      {
        "id": "butuncul-afet-yonetimi",
        "sol": "Bütüncül afet yönetimi",
        "sag": "Tüm tehlikelerin dikkate alındığı, toplumdaki kaynaklarla yürütülen afet yönetim süreci"
      },
      {
        "id": "risk-yonetimi",
        "sol": "Risk yönetimi",
        "sag": "Afet öncesi risk azaltma ve hazırlıkla afetten etkilenmenin önüne geçme"
      },
      {
        "id": "kriz-yonetimi",
        "sol": "Kriz yönetimi",
        "sag": "Afet esnası ve sonrası faaliyetlerin mevcut kaynaklarla en hızlı ve etkili yürütülmesi"
      },
      {
        "id": "savunmasiz-gruplar",
        "sol": "Savunmasız gruplar",
        "sag": "Yaşlılar, kadınlar, çocuklar, özel gereksinimi olan bireyler"
      },
      {
        "id": "bm-cocuk-haklari-sozlesmesi",
        "sol": "BM Çocuk Hakları Sözleşmesi",
        "sag": "Çocukların korunmasına yönelik en kapsamlı uluslararası belge"
      },
      {
        "id": "hak-temelli-yaklasim",
        "sol": "Hak temelli yaklaşım",
        "sag": "Dayanağı uluslararası hukuk olan, adaletsizlik ve eşitsizliği ortadan kaldıran yaklaşım"
      },
      {
        "id": "cbs-ve-uzaktan-algilama",
        "sol": "CBS ve uzaktan algılama",
        "sag": "Afet verilerine hızlı ulaşmada ve yeni bilgi üretmede kullanılan teknolojiler"
      },
      {
        "id": "afad",
        "sol": "AFAD",
        "sag": "İçişleri Bakanlığına bağlı, afet çalışmalarında kurumlar arası koordinasyonu sağlayan başkanlık"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Bütüncül afet yönetimi",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Doğru seçeneği işaretle.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Erken uyarı sistemlerinin kurulması ve güncellenmesi hangi aşamada yapılır?",
        "secenekler": [
          "Hazırlıklı olma",
          "Müdahale",
          "İyileştirme",
          "Kriz yönetimi"
        ],
        "dogru": 0,
        "cozum": "Erken uyarı sistemlerinin kurulması, kontrolü, işletilmesi ve güncellenmesi hazırlıklı olma aşamasındadır (s.202)."
      },
      {
        "soru": "Tehlike haritalarının hazırlanması hangi aşamaya aittir?",
        "secenekler": [
          "Risk ve zarar azaltma",
          "Müdahale",
          "İyileştirme",
          "Rehabilitasyon"
        ],
        "dogru": 0,
        "cozum": "Risk ve zarar azaltma; tehlike haritaları, yasal düzenlemeler ve yönetmeliklerin yeniden düzenlenmesini kapsar (s.202)."
      },
      {
        "soru": "Hasar tespiti ve enkazların kaldırılması hangi aşamada yer alır?",
        "secenekler": [
          "Müdahale",
          "Risk ve zarar azaltma",
          "Hazırlıklı olma",
          "Risk yönetimi"
        ],
        "dogru": 0,
        "cozum": "Müdahale aşaması hasar tespiti ve enkaz kaldırmayı da kapsar (s.202)."
      },
      {
        "soru": "Kriz yönetiminin en uzun süren evresi hangisidir?",
        "secenekler": [
          "Yeniden yapılanma",
          "Arama kurtarma",
          "Hasar tespiti",
          "Tahliye"
        ],
        "dogru": 0,
        "cozum": "Sosyal ve ekonomik hayatın normale dönmesiyle yeniden yapılanma, kriz yönetiminin en uzun süren evresidir (s.202)."
      },
      {
        "soru": "Kitaba göre bütüncül afet yönetiminin aşamaları için hangisi doğrudur?",
        "secenekler": [
          "Her zaman birbirini takip etmek zorunda olmayıp genellikle iç içedir",
          "Kesinlikle birbirinden bağımsızdır",
          "Yalnızca afet sonrasında uygulanır",
          "Her aşama yalnızca bir kez yapılır"
        ],
        "dogru": 0,
        "cozum": "Aşamalar her zaman birbirini takip etmek zorunda değildir, genellikle iç içedir (s.202)."
      },
      {
        "soru": "Müdahale ve iyileştirme tecrübelerinden sonra hangi evrelere dönülmelidir?",
        "secenekler": [
          "Risk ve zarar azaltma ile hazırlıklı olma",
          "Yalnızca müdahale",
          "Yalnızca yeniden yapılanma",
          "Arama kurtarma ve enkaz kaldırma"
        ],
        "dogru": 0,
        "cozum": "Elde edilen tecrübeyle başa dönülerek afet öncesi risk ve zarar azaltma ile hazırlıklı olma evrelerine geçilmelidir (s.203)."
      },
      {
        "soru": "Afet bölgesinde arama kurtarma bilgisi paylaşılırken nelere dikkat edilmelidir?",
        "secenekler": [
          "Mahremiyet, özel hayatın gizliliği ve kişilerin açık rızası",
          "Paylaşımın olabildiğince çok kişiye ulaşması",
          "Bilginin doğrulanmadan hızla yayılması",
          "Yalnızca görsellerin paylaşılması"
        ],
        "dogru": 0,
        "cozum": "Mahremiyet, özel hayatın gizliliği ve açık rızaya dikkat edilmemesi afetzedeleri olumsuz etkileyebilir (s.203)."
      },
      {
        "soru": "Afet esnası ve sonrasında en fazla etkilenen, en fazla psikososyal travmaya maruz kalan grup hangisidir?",
        "secenekler": [
          "Çocuklar",
          "Gençler",
          "Sağlık çalışanları",
          "Gönüllüler"
        ],
        "dogru": 0,
        "cozum": "Çocuklar afetten en fazla etkilenen, en fazla can kaybı ve psikososyal travmaya maruz kalan bireylerdir (s.203)."
      },
      {
        "soru": "Uluslararası afet desteğinde bütüncül afet yönetimine uygun olarak neye öncelik verilir?",
        "secenekler": [
          "Sosyal yardım ve hizmetlere",
          "Askerî desteğe",
          "Ticari anlaşmalara",
          "Turizm faaliyetlerine"
        ],
        "dogru": 0,
        "cozum": "Bu destek kapsamında sosyal yardım ve hizmetlere öncelik verilmektedir (s.205)."
      },
      {
        "soru": "Uzaktan algılama ile aşağıdakilerden hangisi tespit edilebilir?",
        "secenekler": [
          "Bir kasırganın etkilediği bölgeler ve ilerleme yönü",
          "Bir bölgedeki halkın afet bilinci düzeyi",
          "Afetzedelerin psikolojik durumu",
          "Yardım kampanyalarına katılan kişi sayısı"
        ],
        "dogru": 0,
        "cozum": "Uydu ve hava fotoğraflarıyla kasırganın etkilediği bölgeler ve ilerleme yönü tespit edilebilir (s.206)."
      },
      {
        "soru": "AFAD hangi bakanlığa bağlıdır?",
        "secenekler": [
          "İçişleri Bakanlığı",
          "Millî Eğitim Bakanlığı",
          "Sağlık Bakanlığı",
          "Dışişleri Bakanlığı"
        ],
        "dogru": 0,
        "cozum": "Afet ve Acil Durum Yönetimi Başkanlığı, T.C. İçişleri Bakanlığına bağlıdır (s.207)."
      },
      {
        "soru": "AFAD ve STK'lerin organize ettiği İyilik Treni hangi ülkeye gönderilmiştir?",
        "secenekler": [
          "Afganistan",
          "Libya",
          "Malawi",
          "Japonya"
        ],
        "dogru": 0,
        "cozum": "750 ton insani yardım malzemesi taşıyan İyilik Treni Afganistan'a gönderilmiştir (s.205)."
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
        "metin": "Bütüncül afet yönetiminin her aşamasında planlama, {risk azaltma} gibi çalışmalar vardır.",
        "kaynak": "s.202"
      },
      {
        "metin": "Sosyal ve ekonomik hayatın normale dönmesiyle yeniden yapılanma faaliyeti, {kriz yönetiminin} en uzun süren evresidir.",
        "kaynak": "s.202"
      },
      {
        "metin": "Afet ve acil durumlarda can ve mal kaybı, bilgi paylaşımının hızlı ve {güvenilir} şekilde yapılmasıyla en aza indirilebilir.",
        "kaynak": "s.203"
      },
      {
        "metin": "Çocukların temel ihtiyaçlarının karşılanmasına yönelik {pozitif ayrımcılık} yapılması etik bir sorumluluktur.",
        "kaynak": "s.203"
      },
      {
        "metin": "Afette çocuk haklarının korunması için {çocuk dostu} alanlar oluşturulması gibi önlemler alınmaktadır.",
        "kaynak": "s.203"
      },
      {
        "metin": "Türkiye'den Afganistan'a 750 ton insani yardım malzemesi taşıyan {İyilik Treni} gönderildi.",
        "kaynak": "s.205"
      },
      {
        "metin": "Türkiye'deki orman yangınlarıyla mücadele kapsamında {6} ülkeden hava desteği sağlandı.",
        "kaynak": "s.205"
      },
      {
        "metin": "Uzaktan algılama verileri doğrultusunda afetlere karşı {erken uyarı} sistemleri hazırlanabilmektedir.",
        "kaynak": "s.206"
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
        "cevap": "Müdahale",
        "ipucu": "Arama kurtarma ve zaruri ihtiyaçların karşılandığı aşama"
      },
      {
        "cevap": "İyileştirme",
        "ipucu": "Hayatın normale dönmesi için çalışmaların yapıldığı aşama"
      },
      {
        "cevap": "Kriz",
        "ipucu": "Müdahale ve iyileştirmeyi kapsayan yönetim"
      },
      {
        "cevap": "Tahliye",
        "ipucu": "Hazırlık aşamasında şekillendirilen süreç"
      },
      {
        "cevap": "Toplanma",
        "ipucu": "Hazırlık aşamasında belirlenen merkez türü"
      },
      {
        "cevap": "Enkaz",
        "ipucu": "Müdahale aşamasında kaldırılan yıkıntı"
      },
      {
        "cevap": "Çocuklar",
        "ipucu": "Afetten en fazla etkilenen savunmasız grup"
      },
      {
        "cevap": "Mahremiyet",
        "ipucu": "Afet bölgesinde bilgi paylaşırken dikkat edilmesi gereken konu"
      },
      {
        "cevap": "AFAD",
        "ipucu": "Afet ve Acil Durum Yönetimi Başkanlığının kısaltması"
      },
      {
        "cevap": "CBS",
        "ipucu": "Afet verilerini bir arada sunan bilgi sistemi teknolojisi"
      },
      {
        "cevap": "Afganistan",
        "ipucu": "İyilik Treni'nin gönderildiği ülke"
      },
      {
        "cevap": "Koordinasyon",
        "ipucu": "AFAD'ın afet çalışmalarını yürüten kurumlar arasında sağladığı görev"
      }
    ]
  }
];
