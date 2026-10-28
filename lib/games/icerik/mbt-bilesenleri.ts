/**
 * 9. sınıf Coğrafya — 2.1.3 Mekânsal Bilgi Teknolojilerinin Bileşenleri (CBS, uzaktan algılama, GPS)
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.66–70. Tüm bilgiler kitaptan.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";
import { MBT_EK } from "@/lib/games/icerik/ek-bosluk-bulmaca";
import { ciftler, kategoriOgeleri } from "@/lib/games/icerik/yardimci";

export const SEKMELER: KonuSekmesi[] = [
  {
    id: "bilesenler",
    baslik: "Bileşenler",
    alt: "CBS ve GPS bileşenlerini görevleriyle eşleştir",
    tur: "eslestirme",
    solBaslik: "Bileşen",
    sagBaslik: "Görevi",
    yonerge: "CBS'nin beş bileşenini ve GPS'in üç bileşenini görevleriyle eşleştir.",
    turSecenekleri: [5, 8],
    ciftler: ciftler([
      ["Kullanıcı (CBS)", "Diğer bileşenleri organize eder ve sistemi yönetir"],
      ["Veri (CBS)", "Doğru ve güncel olmalıdır; uydu görüntüleri, hava fotoğrafları, anketler gibi kaynaklardan gelir"],
      ["Donanım (CBS)", "Akıllı telefon, tablet, bilgisayar ve bağlı araçlar (tarayıcı, yazıcı vb.)"],
      ["Yazılım (CBS)", "Verileri işlemek, harita üretmek, sorgulama ve analiz yapmak için gerekli programlar"],
      ["Yöntem (CBS)", "Verileri bilgiye dönüştürmede kullanılan, kullanıcının belirlediği tercihler"],
      ["Uydu Ağı (GPS)", "Coğrafi konum ve yerel saat verisi içeren radyo sinyalleri iletir"],
      ["Yer Kontrol Ağı (GPS)", "Uyduların konum ve hareketini takip edip yönlendiren izleme istasyonları"],
      ["GPS Alıcıları", "Saat, akıllı telefon, araç içi navigasyon gibi koordinatı uydularla belirlenen cihazlar"],
    ]),
  },
  {
    id: "avantaj-etik",
    baslik: "Avantaj mı, etik kural mı?",
    alt: "CBS ifadelerini ayır",
    tur: "kategori",
    yonerge: "CBS'nin avantajlarını ve CBS kullanırken uyulması gereken etik kuralları birbirinden ayır.",
    turSecenekleri: [8, 13],
    kategoriler: ["CBS'nin avantajı", "CBS etik kuralı"],
    ogeler: kategoriOgeleri({
      "CBS'nin avantajı": [
        "Veri toplama ve bilgi yönetimi kolay ve hızlıdır",
        "Mekânsal ve mekânsal olmayan bilgiler bir arada kullanılabilir",
        "Uzunluk, alan, eğim ölçümleri kolay ve doğru yapılır",
        "Mekândaki değişimler zaman aralıklarıyla yansıtılabilir",
        "Güncelleme kolaydır",
        "Dijital ürünler kolay paylaşılır",
        "Her türlü mekânsal planlama yapılabilir",
      ],
      "CBS etik kuralı": [
        "Verilerin güvenilirliği korunmalıdır",
        "Kaynak açıkça belirtilmelidir",
        "İzinsiz kullanımdan kaçınılmalıdır",
        "Kişisel verilerin gizliliğine özen gösterilmelidir",
        "Toplumsal güvenliği olumsuz etkileyecek paylaşımdan kaçınılmalıdır",
        "Veriler doğru, tarafsız ve amacına uygun kullanılmalıdır",
      ],
    }),
  },
  {
    id: "kavramlar",
    baslik: "Kavramlar",
    alt: "Kavramı tanımıyla eşleştir",
    tur: "eslestirme",
    solBaslik: "Kavram",
    sagBaslik: "Tanım",
    yonerge: "Mekânsal bilgi teknolojileriyle ilgili kavramları tanımlarıyla eşleştir.",
    turSecenekleri: [4],
    ciftler: ciftler([
      ["CBS", "Mekânsal bilgilerin harita, tablo veya grafiklerle görüntülenmesini sağlayan bilgisayar tabanlı bilgi yönetimi"],
      ["Mekânsal veri", "Haritası oluşturulabilen, konumsal özelliğe sahip her türlü coğrafi veri"],
      ["GPS", "Bir yerin coğrafi koordinatlarını uydular aracılığıyla belirleyen Küresel Konumlandırma Sistemi"],
      ["Uzaktan algılama", "Dünya'dan yansıyan elektromanyetik dalgaları algılayan uydularla görüntü elde edip haritalama"],
    ]),
  },
  ...MBT_EK,
];
