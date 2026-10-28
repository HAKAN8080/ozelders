/**
 * 9. sınıf Coğrafya — 2.1.1 Mekânın Sembolik Dili: Harita (harita, elemanlar, projeksiyon, ölçek)
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.35–44. Tüm bilgiler kitaptan.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";
import { HARITA_EK } from "@/lib/games/icerik/ek-bosluk-bulmaca";
import { ciftler, kategoriOgeleri } from "@/lib/games/icerik/yardimci";

export const SEKMELER: KonuSekmesi[] = [
  {
    id: "kavramlar",
    baslik: "Kavramlar",
    alt: "Kavramı tanımıyla eşleştir",
    tur: "eslestirme",
    solBaslik: "Kavram",
    sagBaslik: "Tanım",
    yonerge: "Harita ve ölçekle ilgili kavramları kitaptaki tanımlarıyla eşleştir.",
    turSecenekleri: [5, 7],
    ciftler: ciftler([
      [
        "Harita",
        "Dünya'nın veya bir gök cisminin tamamına ya da bir bölümüne ait coğrafi unsurların bir oran dâhilinde küçültülerek kuş bakışı düzlem üzerine çizilmesi",
      ],
      ["Kroki", "Ölçek kullanılmadan yapılan kabataslak çizim"],
      ["Mekân", "Doğal ve beşerî unsurların birleşimi; “Nasıl bir yer?”, “Bu yer nerede?” sorularına cevap verir"],
      ["Ölçek", "Coğrafi unsur, olay ve yükseltilerin haritaya aktarılması sırasında kullanılan küçültme oranı"],
      ["Kesir ölçek", "Pay ve paydadan oluşan kesirli sayıyla gösterilen ölçek"],
      ["Çizgi ölçek", "Grafik olarak gösterilen ölçek"],
      [
        "Projeksiyon yöntemleri",
        "Coğrafi koordinatları haritaya aktarmak ve haritalardaki bozulmaları en aza indirmek için kullanılan yöntemler",
      ],
    ]),
  },
  {
    id: "elemanlar",
    baslik: "Harita elemanları",
    alt: "Elemanı göreviyle eşleştir",
    tur: "eslestirme",
    solBaslik: "Eleman",
    sagBaslik: "Görevi",
    yonerge: "Haritanın sembolik dilini çözmek için elemanlarını bilmek gerekir. Her elemanı göreviyle eşleştir.",
    turSecenekleri: [5],
    ciftler: ciftler([
      ["Başlık", "Haritanın konusunu ve gösterdiği yeri belirtir"],
      ["Ölçek", "Haritada kullanılan küçültme oranıdır; mesafe ve alanların gerçek değeri bulunur"],
      ["Coğrafi koordinatlar", "Harita üzerine paralel ve meridyenler çizilerek belirtilir"],
      ["Yön oku", "Haritadaki coğrafi yönleri gösteren işarettir"],
      ["Lejant", "Haritada kullanılan renk ve sembollerin anlamlarını gösteren listedir"],
    ]),
  },
  {
    id: "turler",
    baslik: "Genel mi, tematik mi?",
    alt: "Haritaları kullanım amacına göre ayır",
    tur: "kategori",
    yonerge: "Haritalar kullanım amacına göre genel ve tematik haritalar olarak ikiye ayrılır. Her haritayı doğru gruba yerleştir.",
    turSecenekleri: [12],
    kategoriler: ["Genel haritalar", "Tematik haritalar"],
    ogeler: kategoriOgeleri({
      "Genel haritalar": ["Fiziki harita", "Siyasi harita", "Topoğrafya haritası"],
      "Tematik haritalar": [
        "Jeoloji haritası",
        "Jeomorfoloji haritası",
        "İklim haritası",
        "Toprak haritası",
        "Bitki örtüsü haritası",
        "Nüfus haritası",
        "Ulaşım haritası",
        "Turizm haritası",
        "Ekonomi haritası",
      ],
    }),
  },
  {
    id: "projeksiyon",
    baslik: "Projeksiyonlar",
    alt: "Özelliği projeksiyon türüne yerleştir",
    tur: "kategori",
    yonerge: "Projeksiyonlar, projeksiyon yüzeyine göre üçe ayrılır. Her özelliği ait olduğu projeksiyon türüne yerleştir.",
    turSecenekleri: [9],
    kategoriler: ["Silindirik projeksiyon", "Konik projeksiyon", "Düzlem projeksiyon"],
    ogeler: kategoriOgeleri({
      "Silindirik projeksiyon": [
        "Yüzey yerküreyi silindir biçiminde sarar",
        "Ekvator çevresinde bozulma azdır",
        "Kutuplara doğru şekil ve alan bozulmaları artar",
      ],
      "Konik projeksiyon": [
        "Yüzey yerküreyi koni biçiminde sarar",
        "Orta kuşakta bozulma azdır",
        "Orta enlemlerden Ekvator'a ve kutuplara doğru bozulma artar",
      ],
      "Düzlem projeksiyon": [
        "Yüzey genellikle kutup noktasına düz olarak yerleştirilir",
        "Kutup noktalarından Ekvator'a doğru bozulma artar",
        "Daha çok kutup çevresinin gösterildiği haritalarda kullanılır",
      ],
    }),
  },
  {
    id: "olcek-buyukluk",
    baslik: "Büyük mü, küçük mü?",
    alt: "Büyük ve küçük ölçekli haritaları ayır",
    tur: "kategori",
    yonerge: "Büyük ve küçük ölçekli haritaların özelliklerini doğru gruba yerleştir. Kitaptaki iki Kıbrıs haritasını da birbirine göre karşılaştır.",
    turSecenekleri: [9],
    kategoriler: ["Büyük ölçekli harita", "Küçük ölçekli harita"],
    ogeler: kategoriOgeleri({
      "Büyük ölçekli harita": [
        "Küçültme oranı azdır",
        "Dar alan gösterir",
        "Ayrıntı fazladır",
        "İzohips aralığı daha küçüktür",
        "Kitaptaki KKTC Mülki İdare haritası (1/2.000.000)",
      ],
      "Küçük ölçekli harita": ["Küçültme oranı fazladır", "Geniş alan gösterir", "Ayrıntı azdır", "Kitaptaki Kıbrıs ve çevresi siyasi haritası (1/20.000.000)"],
    }),
  },
  {
    id: "hesap",
    baslik: "Ölçek hesapları",
    alt: "Gerçek uzunluk, harita uzunluğu, kesir ölçek",
    tur: "soru",
    yonerge:
      "Kesir ölçekte pay her zaman 1, birim her zaman cm'dir. Gerçek uzunluk = haritadaki uzunluk × payda. Her turda sorular yeniden üretilir.",
    turSecenekleri: [10, 20],
    uretecler: ["olcek-gercek", "olcek-harita", "olcek-kesir"],
  },
  ...HARITA_EK,
];
