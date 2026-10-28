/**
 * 9. sınıf Coğrafya — 3.1.2 İklim Sistemi: Basınç, Rüzgâr ve Yağış
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.106-117.
 * scripts/icerik_jsondan.py ile üretildi; bilgiler kitaptan, çoktan seçmeli yanlış şıklar soruyu kurmak için yazıldı.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

export const SEKMELER: KonuSekmesi[] = [
  {
    "id": "basinc-merkezleri",
    "baslik": "Alçak mı, yüksek mi?",
    "alt": "Özelliği doğru basınç merkezine yerleştir",
    "yonerge": "Her özelliği alçak basınç ya da yüksek basınç merkezi grubuna koy.",
    "turSecenekleri": [
      8,
      10
    ],
    "tur": "kategori",
    "kategoriler": [
      "Alçak basınç merkezi",
      "Yüksek basınç merkezi"
    ],
    "ogeler": [
      {
        "id": "alcak-basinc-merkezi--siklon-olarak-adlandirilir",
        "ad": "Siklon olarak adlandırılır",
        "kategori": "Alçak basınç merkezi"
      },
      {
        "id": "alcak-basinc-merkezi--basinc-1013-mb-in-altindadir",
        "ad": "Basınç 1013 mb'ın altındadır",
        "kategori": "Alçak basınç merkezi"
      },
      {
        "id": "alcak-basinc-merkezi--yatay-hava-hareketi-cevreden-merkeze-dogrudur",
        "ad": "Yatay hava hareketi çevreden merkeze doğrudur",
        "kategori": "Alçak basınç merkezi"
      },
      {
        "id": "alcak-basinc-merkezi--dikey-hava-hareketi-yukselicidir",
        "ad": "Dikey hava hareketi yükselicidir",
        "kategori": "Alçak basınç merkezi"
      },
      {
        "id": "alcak-basinc-merkezi--genellikle-bulutlu-ve-yagisli-hava-gorulur",
        "ad": "Genellikle bulutlu ve yağışlı hava görülür",
        "kategori": "Alçak basınç merkezi"
      },
      {
        "id": "yuksek-basinc-merkezi--antisiklon-olarak-adlandirilir",
        "ad": "Antisiklon olarak adlandırılır",
        "kategori": "Yüksek basınç merkezi"
      },
      {
        "id": "yuksek-basinc-merkezi--basinc-1013-mb-in-ustundedir",
        "ad": "Basınç 1013 mb'ın üstündedir",
        "kategori": "Yüksek basınç merkezi"
      },
      {
        "id": "yuksek-basinc-merkezi--yatay-hava-hareketi-merkezden-cevreye-dogrudur",
        "ad": "Yatay hava hareketi merkezden çevreye doğrudur",
        "kategori": "Yüksek basınç merkezi"
      },
      {
        "id": "yuksek-basinc-merkezi--dikey-hava-hareketi-alcalicidir",
        "ad": "Dikey hava hareketi alçalıcıdır",
        "kategori": "Yüksek basınç merkezi"
      },
      {
        "id": "yuksek-basinc-merkezi--genellikle-gunesli-acik-bulutsuz-hava-gorulur",
        "ad": "Genellikle güneşli (açık, bulutsuz) hava görülür",
        "kategori": "Yüksek basınç merkezi"
      }
    ]
  },
  {
    "id": "ruzgarlar",
    "baslik": "Rüzgârlar",
    "alt": "Rüzgârı özelliğiyle eşleştir",
    "yonerge": "Her rüzgârı kitaptaki özelliğiyle eşleştir.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "eslestirme",
    "solBaslik": "Rüzgâr",
    "sagBaslik": "Özellik",
    "ciftler": [
      {
        "id": "alize-ruzgarlari",
        "sol": "Alize rüzgârları",
        "sag": "30° enlemlerindeki DYB'den Ekvator'daki TAB'ye eser; kıtaların doğu kıyılarına bol yağış bırakır"
      },
      {
        "id": "ters-alizeler",
        "sol": "Ters alizeler",
        "sag": "Ekvator'da yükselip yaklaşık 3.000 m yüksekte 30° enlemlerine doğru eser"
      },
      {
        "id": "bati-ruzgarlari",
        "sol": "Batı rüzgârları",
        "sag": "30° DYB'den 60° DAB'ye eser; kıtaların batı kıyılarına bol yağış getirir"
      },
      {
        "id": "kutup-ruzgarlari",
        "sol": "Kutup rüzgârları",
        "sag": "Kutuplardaki TYB'den 60° enlemlerindeki DAB'ye esen soğuk rüzgârlar"
      },
      {
        "id": "yaz-musonu",
        "sol": "Yaz musonu",
        "sag": "Denizden karaya esip karalara bol yağış bırakan mevsimlik rüzgâr"
      },
      {
        "id": "kis-musonu",
        "sol": "Kış musonu",
        "sag": "Karadan denizlere esen soğuk ve kuru mevsimlik rüzgâr"
      },
      {
        "id": "deniz-meltemi",
        "sol": "Deniz meltemi",
        "sag": "Gündüz denizden karaya doğru esen rüzgâr"
      },
      {
        "id": "kara-meltemi",
        "sol": "Kara meltemi",
        "sag": "Gece karadan denize doğru esen rüzgâr"
      },
      {
        "id": "dag-meltemi",
        "sol": "Dağ meltemi",
        "sag": "Gece dağlardan vadilere doğru hareket eden rüzgâr"
      },
      {
        "id": "vadi-meltemi",
        "sol": "Vadi meltemi",
        "sag": "Gündüz vadiden dağlık alanlara doğru esen rüzgâr"
      }
    ]
  },
  {
    "id": "turkiye",
    "baslik": "Türkiye'nin iklimini etkileyenler",
    "alt": "Basınç merkezi ve rüzgârları etkisiyle eşleştir",
    "yonerge": "Türkiye'nin iklimini etkileyen basınç merkezlerini ve rüzgârları kitaptaki etkileriyle eşleştir.",
    "turSecenekleri": [
      5,
      7
    ],
    "tur": "eslestirme",
    "solBaslik": "Basınç merkezi / rüzgâr",
    "sagBaslik": "Türkiye'ye etkisi",
    "ciftler": [
      {
        "id": "izlanda-dinamik-alcak-basinci",
        "sol": "İzlanda dinamik alçak basıncı",
        "sag": "Kışın batı ve kuzeybatıdan gelen hava kütleleriyle yağış getirir"
      },
      {
        "id": "sibirya-termik-yuksek-basinci",
        "sol": "Sibirya termik yüksek basıncı",
        "sag": "Kışın soğuk ve yağışsız günlere neden olur"
      },
      {
        "id": "asor-dinamik-yuksek-basinci",
        "sol": "Asor dinamik yüksek basıncı",
        "sag": "Yaz aylarının sıcak ve kurak geçmesinde etkilidir"
      },
      {
        "id": "basra-termik-alcak-basinci",
        "sol": "Basra termik alçak basıncı",
        "sag": "Yazın genişlediğinde sıcak, yağışsız ve bunaltıcı günler yaşanır"
      },
      {
        "id": "lodos",
        "sol": "Lodos",
        "sag": "Güneybatıdan sıcak ve ılık eser, ardından yağmur getirir; kışın karların erimesini kolaylaştırır"
      },
      {
        "id": "kesisleme",
        "sol": "Keşişleme",
        "sag": "Güneyden sıcak, kuru ve tozlu eser; en çok Güneydoğu Anadolu'da etkilidir"
      },
      {
        "id": "fon",
        "sol": "Fön",
        "sag": "Dağ yamacından alçalırken ısınan sıcak ve kurutucu rüzgâr"
      }
    ]
  },
  {
    "id": "yagis-turleri",
    "baslik": "Yağış türleri",
    "alt": "Özelliği doğru yağış türüne yerleştir",
    "yonerge": "Her özelliği kitapta hangi yağış türü için verildiyse o gruba koy.",
    "turSecenekleri": [
      8,
      9
    ],
    "tur": "kategori",
    "kategoriler": [
      "Yükselim (konveksiyonel) yağışları",
      "Yamaç (orografik) yağışları",
      "Cephe (frontal) yağışları"
    ],
    "ogeler": [
      {
        "id": "yukselim-konveksiyonel-yagislari--isinan-havanin-hafifleyip-yukselerek-hizla-sogumasiyla-olusur",
        "ad": "Isınan havanın hafifleyip yükselerek hızla soğumasıyla oluşur",
        "kategori": "Yükselim (konveksiyonel) yağışları"
      },
      {
        "id": "yukselim-konveksiyonel-yagislari--saganak-seklinde-duser",
        "ad": "Sağanak şeklinde düşer",
        "kategori": "Yükselim (konveksiyonel) yağışları"
      },
      {
        "id": "yukselim-konveksiyonel-yagislari--ekvatoral-bolgede-yil-boyunca-etkilidir",
        "ad": "Ekvatoral bölgede yıl boyunca etkilidir",
        "kategori": "Yükselim (konveksiyonel) yağışları"
      },
      {
        "id": "yamac-orografik-yagislari--nemli-hava-kutlesinin-dag-yamaci-boyunca-yukselerek-sogumasiyla-olusur",
        "ad": "Nemli hava kütlesinin dağ yamacı boyunca yükselerek soğumasıyla oluşur",
        "kategori": "Yamaç (orografik) yağışları"
      },
      {
        "id": "yamac-orografik-yagislari--kuzey-anadolu-ve-toros-daglarinin-denize-bakan-yamaclarinda-gorulur",
        "ad": "Kuzey Anadolu ve Toros Dağlarının denize bakan yamaçlarında görülür",
        "kategori": "Yamaç (orografik) yağışları"
      },
      {
        "id": "yamac-orografik-yagislari--himalayalarin-guney-yamaclarinda-yaz-musonu-doneminde-bol-yagis-olusturur",
        "ad": "Himalayaların güney yamaçlarında yaz musonu döneminde bol yağış oluşturur",
        "kategori": "Yamaç (orografik) yağışları"
      },
      {
        "id": "cephe-frontal-yagislari--sicaklik-ve-nem-bakimindan-farkli-hava-kutlelerinin-karsilastigi-alanlarda-gorulur",
        "ad": "Sıcaklık ve nem bakımından farklı hava kütlelerinin karşılaştığı alanlarda görülür",
        "kategori": "Cephe (frontal) yağışları"
      },
      {
        "id": "cephe-frontal-yagislari--hafif-olan-sicak-hava-kutlesi-soguk-hava-kutlesi-uzerinde-yukselir",
        "ad": "Hafif olan sıcak hava kütlesi soğuk hava kütlesi üzerinde yükselir",
        "kategori": "Cephe (frontal) yağışları"
      },
      {
        "id": "cephe-frontal-yagislari--orta-kusakta-etkilidir",
        "ad": "Orta kuşakta etkilidir",
        "kategori": "Cephe (frontal) yağışları"
      }
    ]
  },
  {
    "id": "sorular",
    "baslik": "Sorular",
    "alt": "Kitaptaki bilgilerle çoktan seçmeli",
    "yonerge": "Doğru cevabı seç.",
    "turSecenekleri": [
      5,
      10
    ],
    "tur": "soru",
    "sorular": [
      {
        "soru": "Dünya'nın geoit şekli nedeniyle Ekvator'dan kutuplara doğru hava basıncı nasıl değişir?",
        "secenekler": [
          "Artar",
          "Azalır",
          "Değişmez",
          "Önce artar sonra azalır"
        ],
        "dogru": 0,
        "cozum": "Yer çekimi Ekvator'dan kutuplara doğru artar; buna bağlı olarak hava basıncı da artar (s.106)."
      },
      {
        "soru": "Isınma veya soğuma etkisiyle oluşan basınç merkezlerine ne ad verilir?",
        "secenekler": [
          "Termik basınç merkezi",
          "Dinamik basınç merkezi",
          "Standart basınç merkezi",
          "Cephe merkezi"
        ],
        "dogru": 0,
        "cozum": "Isınma veya soğuma etkisiyle oluşan basınç merkezlerine termik basınç merkezi denir (s.106)."
      },
      {
        "soru": "30° enlemlerinde oluşan yüksek basınç alanları hangi kökenlidir?",
        "secenekler": [
          "Dinamik",
          "Termik",
          "Volkanik",
          "Orografik"
        ],
        "dogru": 0,
        "cozum": "Dönme hareketiyle hava kütlelerinin 30° enlemlerinde yığılarak alçalması dinamik yüksek basınç oluşturur (s.107)."
      },
      {
        "soru": "Rüzgâr hangi tür arazide daha hızlı eser?",
        "secenekler": [
          "Yer şekillerinin düz olduğu yerlerde",
          "Dağlık ve engebeli arazilerde",
          "Orman örtüsünün yoğun olduğu yerlerde",
          "Kentsel alanlarda"
        ],
        "dogru": 0,
        "cozum": "Rüzgârlar düz yerlerde daha hızlı, dağlık-engebeli arazide, kentlerde ve ormanlarda sürtünme nedeniyle daha yavaş eser (s.110)."
      },
      {
        "soru": "Hâkim rüzgâr yönü nedir?",
        "secenekler": [
          "Rüzgârın yıl içinde en sık estiği yön",
          "Rüzgârın en hızlı estiği yön",
          "Rüzgârın yalnızca kışın estiği yön",
          "Basınç merkezinin bulunduğu yön"
        ],
        "dogru": 0,
        "cozum": "Rüzgârın yıl içinde en sık estiği yöne hâkim rüzgâr yönü denir (s.110)."
      },
      {
        "soru": "Kıtaların batı kıyılarına bol yağış getiren sürekli rüzgârlar hangileridir?",
        "secenekler": [
          "Batı rüzgârları",
          "Alize rüzgârları",
          "Kutup rüzgârları",
          "Ters alizeler"
        ],
        "dogru": 0,
        "cozum": "Orta kuşakta batıdan doğuya esen batı rüzgârları kıtaların batı kıyılarına bol yağış getirir (s.111)."
      },
      {
        "soru": "Asya'nın doğusunda tropikal rüzgârlara ne ad verilir?",
        "secenekler": [
          "Tayfun",
          "Hurricane",
          "Tornado",
          "Willy willy"
        ],
        "dogru": 0,
        "cozum": "Tropikal rüzgârlara Asya'nın doğusunda tayfun, Meksika Körfezi'nde hurricane, ABD'de tornado, Avustralya'da willy willy denir (s.112)."
      },
      {
        "soru": "Meltem rüzgârları hangi hareketin sonucunda ortaya çıkan sıcaklık ve basınç farklarıyla oluşur?",
        "secenekler": [
          "Dünya'nın dönme (günlük) hareketi",
          "Dünya'nın dolanma (yıllık) hareketi",
          "Levha hareketleri",
          "Okyanus akıntıları"
        ],
        "dogru": 0,
        "cozum": "Meltem rüzgârları Dünya'nın dönme hareketi sonucunda ortaya çıkan sıcaklık ve basınç farklarıyla oluşur (s.113)."
      },
      {
        "soru": "Türkiye'de fön rüzgârları nerede etkili olur?",
        "secenekler": [
          "Doğu Karadeniz Dağları ve Toros Dağlarının denize bakan yamaçlarında",
          "İç Anadolu'nun ova tabanlarında",
          "Trakya'nın kuzey kıyılarında",
          "Güneydoğu Anadolu'nun platolarında"
        ],
        "dogru": 0,
        "cozum": "Fön rüzgârları Türkiye'de Doğu Karadeniz Dağları ile Toros Dağlarının denize bakan yamaçlarında kış ve ilkbaharda etkili olur (s.114)."
      },
      {
        "soru": "Poyraz, yıldız ve karayel gibi kuzeyden esen rüzgârların etkisi nedir?",
        "secenekler": [
          "Sıcaklığı azaltır, zaman zaman yağmur ve kar yağışına neden olur",
          "Sıcaklığı artırarak karları eritir",
          "Tozlu ve kurutucu etki yapar",
          "Yazın bunaltıcı sıcaklar getirir"
        ],
        "dogru": 0,
        "cozum": "Kuzeyden esen poyraz, yıldız, karayel sıcaklığı azaltır ve zaman zaman yağmur ve kar yağışına neden olur (s.114)."
      },
      {
        "soru": "Türkiye'de en az yağış alan yer neresidir?",
        "secenekler": [
          "Iğdır ile Tuz Gölü çevresi",
          "Rize",
          "Kıyı Ege'deki dağlık alanlar",
          "Güneydoğu Torosların yüksek kesimleri"
        ],
        "dogru": 0,
        "cozum": "Türkiye'de en az yağış alan yer Iğdır ile Tuz Gölü çevresi, en fazla yağış alan yer Rize'dir (s.116)."
      }
    ]
  },
  {
    "id": "bosluk",
    "baslik": "Boşluk doldur",
    "alt": "Kitaptaki cümleleri tamamla",
    "yonerge": "Boşluğa gelecek kavramı yaz.",
    "turSecenekleri": [
      5,
      8
    ],
    "tur": "bosluk",
    "cumleler": [
      {
        "metin": "Aynı basınç değerine sahip noktaların birleştirilmesiyle oluşturulan eğrilere {izobar} (eş basınç) adı verilir.",
        "kaynak": "s.106"
      },
      {
        "metin": "Atmosferdeki gazların yoğunluğu yerden yükseldikçe azalır; bu nedenle yükselti arttıkça basınç {azalır}.",
        "kaynak": "s.106"
      },
      {
        "metin": "Basınç merkezleri arasındaki basınç farkı ne kadar fazlaysa rüzgâr o kadar {hızlı} eser.",
        "kaynak": "s.110"
      },
      {
        "metin": "Dünya'nın kendi ekseni etrafındaki dönüşü nedeniyle rüzgârlar kuzey yarım kürede sağa, güney yarım kürede {sola} sapar.",
        "kaynak": "s.110"
      },
      {
        "metin": "Tropikal rüzgârlar, sıcak kuşakta {okyanuslar} üzerinde oluşur.",
        "kaynak": "s.112"
      },
      {
        "metin": "Muson rüzgârları olarak adlandırılan {mevsimlik} rüzgârlar, karalar ile okyanuslar arasındaki sıcaklık ve basınç farkı nedeniyle oluşur.",
        "kaynak": "s.112"
      },
      {
        "metin": "Atmosferde sıcaklık ve nem özellikleri benzerlik gösteren geniş hava parçalarına {hava kütlesi} adı verilir.",
        "kaynak": "s.115"
      },
      {
        "metin": "Nemli hava kütlelerinin {soğuması} neticesinde yoğuşma meydana gelir.",
        "kaynak": "s.115"
      }
    ]
  },
  {
    "id": "bulmaca",
    "baslik": "Çengel bulmaca",
    "alt": "Tanımlardan kavramları bul",
    "yonerge": "İpuçlarından kavramları bul ve bulmacaya yerleştir.",
    "turSecenekleri": [
      6,
      9
    ],
    "tur": "bulmaca",
    "kelimeler": [
      {
        "cevap": "İzobar",
        "ipucu": "Eş basınç eğrisi"
      },
      {
        "cevap": "Siklon",
        "ipucu": "Alçak basınç merkezinin diğer adı"
      },
      {
        "cevap": "Antisiklon",
        "ipucu": "Yüksek basınç merkezinin diğer adı"
      },
      {
        "cevap": "Alize",
        "ipucu": "30° enlemlerinden Ekvator'a doğru esen sürekli rüzgâr"
      },
      {
        "cevap": "Muson",
        "ipucu": "Mevsimsel olarak yön değiştiren rüzgârların adı"
      },
      {
        "cevap": "Meltem",
        "ipucu": "Esme yönü gün içinde değişen yerel rüzgâr"
      },
      {
        "cevap": "Fön",
        "ipucu": "Dağ yamacından alçalırken ısınan sıcak ve kurutucu rüzgâr"
      },
      {
        "cevap": "Lodos",
        "ipucu": "Güneybatıdan sıcak ve ılık esip ardından yağmur getiren rüzgâr"
      },
      {
        "cevap": "Keşişleme",
        "ipucu": "Güneyden esen sıcak, kuru ve tozlu rüzgâr"
      },
      {
        "cevap": "Poyraz",
        "ipucu": "Kuzeyden esip sıcaklığı azaltan yerel rüzgârlardan biri"
      },
      {
        "cevap": "Tayfun",
        "ipucu": "Asya'nın doğusunda tropikal rüzgârlara verilen ad"
      },
      {
        "cevap": "Tornado",
        "ipucu": "ABD'de tropikal rüzgârlara verilen ad"
      },
      {
        "cevap": "Cephe",
        "ipucu": "Farklı özellikteki hava kütlelerinin karşılaşma alanı"
      }
    ]
  }
];
