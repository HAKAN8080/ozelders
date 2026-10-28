/**
 * Boşluk doldurma ve çengel bulmaca içerikleri.
 * Cümleler ve tanımlar MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM) metninden; sayfalar "kaynak"ta.
 * Bulmaca ipuçları kitaptaki tanımlardan kısaltıldı. "Kim ne yaptı?" katkıları öğretmen onaylıdır.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";

type Sekme = KonuSekmesi;

const bosluk = (id: string, cumleler: [string, string][], yonerge: string, turSecenekleri = [5, 8]): Sekme => ({
  id,
  baslik: "Boşluk doldur",
  alt: "Kitaptaki cümleleri tamamla",
  tur: "bosluk",
  yonerge,
  turSecenekleri,
  cumleler: cumleler.map(([metin, kaynak]) => ({ metin, kaynak })),
});

const bulmaca = (id: string, kelimeler: [string, string][], yonerge: string, turSecenekleri = [6, 9]): Sekme => ({
  id,
  baslik: "Çengel bulmaca",
  alt: "Tanımlardan kavramları bul",
  tur: "bulmaca",
  yonerge,
  turSecenekleri,
  kelimeler: kelimeler.map(([cevap, ipucu]) => ({ cevap, ipucu })),
});

/* ---------- 1.1.1 Coğrafyanın Konusu ve Bölümleri (s.16–19) ---------- */
export const KONUSU_EK: Sekme[] = [
  bosluk(
    "bosluk",
    [
      ["İnsanın etkisi olmadan, insan ve insani unsurların dışında kalan yere {doğal ortam} adı verilir.", "s.16"],
      ["Doğal ortamı oluşturan unsurlarda meydana gelen değişimlere {doğa olayı} denir.", "s.16"],
      ["İnsanın sosyal, kültürel ve ekonomik faaliyetleri sonucunda doğal ortam üzerine inşa ettiği yaşam alanına {beşerî ortam} adı verilir.", "s.16"],
      ["Doğal ortam ile beşerî ortamın birlikteliğinden oluşan en geniş yaşam alanına {coğrafi ortam} denir.", "s.16"],
      ["Coğrafya, {fiziki coğrafya} ve {beşerî coğrafya} olmak üzere iki bölüme ayrılır.", "s.18"],
      ["Klimatoloji; atmosfer, hava olayları ve iklim tiplerini inceler ve {meteoroloji} ile etkileşim içindedir.", "s.18"],
      ["Ekonomik coğrafya; sanayi, ticaret, tarım gibi ekonomik faaliyetleri inceler ve {iktisat} ile etkileşim içindedir.", "s.19"],
      ["Coğrafya bilimi haritalama, {uzaktan algılama}, niceleme (istatistik) yöntemleri ve Coğrafi Bilgi Sistemleri gibi teknikler kullanır.", "s.18"],
    ],
    "Ders kitabının 16–19. sayfalarındaki cümlelerde boş bırakılan kavramları tamamla.",
  ),
  bulmaca(
    "bulmaca",
    [
      ["Litosfer", "Kayaçlar, yer şekilleri ve topraklardan oluşan taş küre"],
      ["Atmosfer", "Dünya'yı çepeçevre saran gazlardan oluşan hava küre"],
      ["Hidrosfer", "Denizler, göller, akarsular ve yer altı sularından oluşan su küre"],
      ["Kriyosfer", "Donmuş topraklar, buzullar ve sürekli karla kaplı alanlardan oluşan buz küre"],
      ["Biyosfer", "Canlıların hayati faaliyetlerini sürdürdüğü yaşam küre"],
      ["Jeomorfoloji", "Yer şekilleri bilimi"],
      ["Klimatoloji", "İklim bilimi"],
      ["Hidrografya", "Sular coğrafyası"],
      ["Biyocoğrafya", "Canlılar coğrafyası"],
      ["Meteoroloji", "Klimatolojinin etkileşim içinde olduğu bilim"],
      ["İktisat", "Ekonomik coğrafyanın etkileşim içinde olduğu bilim"],
      ["Pedoloji", "Toprak coğrafyasının mineralojiyle birlikte etkileşim içinde olduğu bilim"],
    ],
    "Küreler ve coğrafyanın alt dallarıyla ilgili tanımlardan kavramları bul.",
  ),
];

/* ---------- 1.1.3 Coğrafya Biliminin Gelişimi (s.24–27) ---------- */
export const GELISIMI_EK: Sekme[] = [
  bosluk(
    "bosluk",
    [
      ["Coğrafya kavramı, Eski Yunanca {geo} (yer) ve {graphein} (tasvir etmek) kelimelerinin birleştirilmesiyle oluşmuştur.", "s.24"],
      ["Coğrafya kavramı ilk defa {Eratosthenes} tarafından Eski Çağ'da kullanılmıştır.", "s.24"],
      ["Eski Çağ'da Eratosthenes, Amasyalı {Strabon} ve İskenderiyeli {Batlamyus} dönemin en önemli coğrafyacıları olmuştur.", "s.24"],
      ["Orta Çağ'da {İpek Yolu} ve Baharat Yolu ticareti coğrafya biliminin gelişmesinde rol oynamıştır.", "s.24"],
      ["Orta Çağ'da İbni Battuta ve {Mesudi} gibi seyyahlar coğrafya bilimine katkı veren eserler yazmıştır.", "s.24"],
      ["Yeni Çağ'da Kristof Kolomb, Magellan ve {Piri Reis} gibi denizciler coğrafyanın gelişmesinde öncü olmuştur.", "s.24"],
      ["Evliya Çelebi, {Seyahatname} adlı eseriyle coğrafyaya katkı vermiştir.", "s.24"],
      ["Yakın Çağ'da Fransız İhtilali ve {Sanayi Devrimi}'nin etkileriyle başlayan aydınlanma çağı coğrafyanın gelişmesinde etkili olmuştur.", "s.24"],
      ["Cumhuriyet Dönemi'nde Besim Darkot, Faik Sabri Duran, Reşat İzbırak ve {Sırrı Erinç} gibi bilim insanları coğrafyaya katkıda bulunmuştur.", "s.25"],
    ],
    "Ders kitabının 24–25. sayfalarındaki cümlelerde boş bırakılan kişi, eser ve gelişmeleri tamamla.",
  ),
  bulmaca(
    "bulmaca",
    [
      ["Eratosthenes", "Coğrafya kavramını ilk kez kullanan bilim insanı"],
      ["Strabon", "Eski Çağ'ın Amasyalı coğrafyacısı"],
      ["Batlamyus", "Eski Çağ'ın İskenderiyeli coğrafyacısı"],
      ["Biruni", "Dünya'nın yarıçapını ölçen Orta Çağ bilgini"],
      ["İdrisi", "Sicilya Kralı II. Roger için dünya haritası çizen Orta Çağ bilgini (Muhammed …)"],
      ["Seyahatname", "Evliya Çelebi'nin coğrafyaya katkı veren eseri"],
      ["Cihannüma", "Kâtip Çelebi'nin eseri"],
      ["Ortelius", "İlk modern atlas kabul edilen Theatrum Orbis Terrarum'u hazırlayan bilim insanı"],
      ["Humboldt", "Kosmos adlı eseriyle modern fiziki coğrafyanın kurucularından"],
      ["Ritter", "Erdkunde adlı eseri yazan Alman coğrafyacı (Carl …)"],
      ["Ratzel", "Antropocoğrafya kavramını geliştiren Alman coğrafyacı (Friedrich …)"],
      ["Darkot", "Cumhuriyet Dönemi coğrafyacısı (Besim …)"],
    ],
    "Coğrafya biliminin gelişimine katkı veren bilim insanlarını ve eserleri bul.",
  ),
];

/* ---------- 2.1.1 Harita ve Ölçek (s.35–44) ---------- */
export const HARITA_EK: Sekme[] = [
  bosluk(
    "bosluk",
    [
      ["Ölçek kullanılmadan yapılan kabataslak çizimler {kroki} olarak adlandırılır.", "s.35"],
      ["Haritalar, {kuş bakışı} görünümle diğer bir ifadeyle dik açıyla gökyüzünden bakılıyormuş gibi çizilir.", "s.35"],
      ["Haritada kullanılan renk ve sembollerin anlamlarını gösteren listeye harita işaretleri ya da {lejant} denir.", "s.36"],
      ["Kesir ölçekte pay her zaman {1}, birim her zaman {cm} olarak kabul edilir.", "s.42"],
      ["1/100.000 ölçekli bir haritada 1 cm, gerçekte {1 km}'ye karşılık gelir.", "s.42"],
      ["{Silindirik} projeksiyonda Ekvator çevresinde bozulma azdır; kutuplara doğru şekil ve alan bozulmaları artar.", "s.41"],
      ["{Düzlem} projeksiyon daha çok kutup çevresinin gösterildiği haritalarda kullanılır.", "s.41"],
      ["Harita dijital cihazlarla çoğaltılıp ebadı değiştiğinde bu değişim ölçeğe yansıdığı için {çizgi ölçek} daha çok tercih edilir.", "s.42"],
      ["Küçültme oranı az olan, ayrıntının fazla olduğu haritalar {büyük} ölçekli haritalardır.", "s.43"],
    ],
    "Ders kitabının 35–43. sayfalarındaki cümlelerde boş bırakılan kavramları tamamla.",
  ),
  bulmaca(
    "bulmaca",
    [
      ["Kroki", "Ölçek kullanılmadan yapılan kabataslak çizim"],
      ["Ölçek", "Haritaya aktarmada kullanılan küçültme oranı"],
      ["Lejant", "Haritadaki renk ve sembollerin anlamlarını gösteren liste"],
      ["Başlık", "Haritanın konusunu ve gösterdiği yeri belirten eleman"],
      ["Silindirik", "Ekvator çevresinde bozulmanın az olduğu projeksiyon"],
      ["Konik", "Orta kuşakta bozulmanın az olduğu projeksiyon"],
      ["Düzlem", "Kutup çevresinin gösterildiği haritalarda kullanılan projeksiyon"],
      ["Tematik", "Jeoloji, iklim, nüfus gibi haritaların kullanım amacına göre grubu"],
      ["Topoğrafya", "Eş yükselti eğrileri yöntemiyle çizilen harita türü"],
    ],
    "Harita, harita elemanları, projeksiyon ve ölçekle ilgili tanımlardan kavramları bul.",
  ),
];

/* ---------- 2.1.1 Koordinatlar ve saat (s.37–40) ---------- */
export const KOORDINAT_EK: Sekme[] = [
  bosluk(
    "bosluk",
    [
      ["Dünya üzerindeki bir noktanın Ekvator'a uzaklığının yerin merkeziyle yaptığı açı değerine {enlem} denir.", "s.37"],
      ["Dünya üzerindeki bir noktanın başlangıç meridyenine uzaklığının yerin merkeziyle yaptığı açı değerine {boylam} denir.", "s.37"],
      ["Bir yerin coğrafi koordinatlarını uydular aracılığıyla belirlemeye yarayan Küresel Konumlandırma Sistemi'ne {GPS} denir.", "s.37"],
      ["Güneş'in en yüksek noktaya ulaştığı öğle vaktine göre ayarlanan saate {yerel saat} adı verilir.", "s.39"],
      ["Dünya, on beşer derecelik aralıklarla {24} saat dilimine ayrılmıştır.", "s.39"],
      ["Türkiye ortak saat olarak 45° doğu meridyenini esas aldığından {+3}. saat dilimindedir.", "s.39"],
      ["Başlangıç meridyeninin tam karşısında yer alan {180°} meridyeni tarih değiştirme çizgisi olarak adlandırılır.", "s.39"],
      ["Tarih değiştirme çizgisinin batısında tarih bir gün {ileri}, doğusunda bir gün geridir.", "s.39"],
    ],
    "Ders kitabının 37–39. sayfalarındaki cümlelerde boş bırakılan kavramları tamamla.",
  ),
];

/* ---------- 2.1.1 Haritalama teknikleri ve yer şekilleri (s.45–55) ---------- */
export const HARITALAMA_EK: Sekme[] = [
  bosluk(
    "bosluk",
    [
      ["Yükseltileri aynı olan noktaların birleştirilmesiyle oluşturulan iç içe geçmiş kapalı eğrilere eş yükselti eğrisi veya {izohips} denir.", "s.53"],
      ["Eş yükselti eğrileri yöntemiyle çizilen haritalara {topoğrafya} haritası adı verilir.", "s.53"],
      ["0 metre eğrisi deniz kıyısından geçer ve {kıyı çizgisi} olarak adlandırılır.", "s.53"],
      ["İzohipslerin birbirine yakın olduğu yerlerde eğim {fazla}, uzak olduğu yerlerde eğim azdır.", "s.53"],
      ["Akarsuların getirdiği alüvyonların deniz kıyısında birikmesiyle oluşan, denize doğru çıkıntı yapan ovalara {delta} denir.", "s.54"],
      ["Dalga aşındırması sonucu oluşan dik kıyılara {falez} denir.", "s.54"],
      ["İki tepe arasında kalan ve çevresine göre yükseltisi daha az olan yere {boyun} denir.", "s.54"],
      ["Akış haritaları bir coğrafi unsurun hareket {miktarını} ve yönünü gösterir.", "s.50"],
      ["Kartogram haritalarda kıta, ülke veya il alanı bir istatistiksel verinin {değerine} göre boyutlandırılır.", "s.52"],
    ],
    "Ders kitabının 50–54. sayfalarındaki cümlelerde boş bırakılan kavramları tamamla.",
  ),
  bulmaca(
    "bulmaca",
    [
      ["Koroplet", "Sınırların sayısal değerlere göre renklendirildiği harita"],
      ["Korokromatik", "Yayılış alanlarının farklı renk ve desenlerle gösterildiği harita"],
      ["Kartogram", "Alanların bir verinin değerine göre boyutlandırıldığı harita"],
      ["Noktalama", "Dağılışın nokta sembolleriyle gösterildiği harita"],
      ["İzohips", "Eş yükselti eğrisi"],
      ["İzobat", "Eş derinlik eğrisi"],
      ["İzoterm", "Eş sıcaklık eğrisi"],
      ["İzobar", "Eş basınç eğrisi"],
      ["Profil", "İki nokta arasında yer şekillerinin yandan görünüşünü gösteren grafik"],
      ["Delta", "Alüvyonların kıyıda birikmesiyle oluşan, denize çıkıntı yapan ova"],
      ["Falez", "Dalga aşındırmasıyla oluşan dik kıyı"],
      ["Vadi", "Akarsu ya da buzul aşındırmasıyla oluşan eğimli oluk"],
      ["Boyun", "İki tepe arasında yükseltisi daha az olan yer"],
      ["Şelale", "Suların yüksekten döküldüğü eğim kırığı"],
    ],
    "Haritalama teknikleri, eş değer eğrileri ve yer şekilleriyle ilgili tanımlardan kavramları bul.",
  ),
];

/* ---------- 2.1.2 Türkiye'nin Coğrafi Konumu (s.59–64) ---------- */
export const KONUM_EK: Sekme[] = [
  bosluk(
    "bosluk",
    [
      ["Dünya üzerindeki herhangi bir yerin Ekvator'a ve başlangıç meridyenine göre konumu {mutlak konum} olarak adlandırılır.", "s.59"],
      ["Bir yerin diğer yerlerle olan ilişkisini tanımlayan konuma {göreceli konum} denir.", "s.59"],
      ["Türkiye kuzey yarım kürede {36°–42°} kuzey paralelleri arasında yer alır.", "s.59"],
      ["Türkiye orta enlemlerde yer aldığı için {dört mevsim} belirgin şekilde yaşanır.", "s.59"],
      ["Türk boğazları {Karadeniz}'i Akdeniz'e bağlar.", "s.60"],
      ["Türkiye'nin gerçek yüz ölçümü {780.043} km²'dir.", "s.62"],
      ["Türkiye'nin uluslararası hukuka uygun olarak egemenliğini ilan ettiği deniz yetki alanlarına {Mavi Vatan} denir.", "s.62"],
      ["Kara sınırları ve deniz yetki alanlarının üzerindeki hava sahası {Gök Vatan} olarak adlandırılır.", "s.63"],
      ["Ege Denizi geçmişte {Adalar Denizi} adıyla anılırdı.", "s.60"],
    ],
    "Ders kitabının 59–63. sayfalarındaki cümlelerde boş bırakılan kavramları tamamla.",
  ),
];

/* ---------- 2.1.3 Mekânsal Bilgi Teknolojileri (s.66–70) ---------- */
export const MBT_EK: Sekme[] = [
  bosluk(
    "bosluk",
    [
      ["CBS'nin bileşenleri kullanıcı, veri, donanım, {yazılım} ve {yöntem}dir.", "s.66"],
      ["GPS'in bileşenleri uydu ağı, {yer kontrol ağı} ve GPS alıcılarıdır.", "s.69"],
      ["Haritası oluşturulabilen, konumsal özelliğe sahip her türlü coğrafi veriye {mekânsal veri} denir.", "s.67"],
      ["Mekânsal veriler haritada nokta, çizgi veya {alan} olarak gösterilir.", "s.67"],
      ["GPS ile enlem, boylam, {yükselti} ve yerel saat bilgilerine ulaşılır.", "s.70"],
      ["Uydular Dünya'dan yansıyan {elektromanyetik} dalgaları algılar.", "s.68"],
    ],
    "Ders kitabının 66–70. sayfalarındaki cümlelerde boş bırakılan kavramları tamamla.",
    [4, 6],
  ),
  bulmaca(
    "bulmaca",
    [
      ["Kullanıcı", "Diğer bileşenleri organize edip sistemi yöneten CBS bileşeni"],
      ["Veri", "Doğru ve güncel olması gereken CBS bileşeni"],
      ["Donanım", "Bilgisayar, tablet, tarayıcı gibi CBS bileşeni"],
      ["Yazılım", "Verileri işleyip harita üreten programlar"],
      ["Yöntem", "Verileri bilgiye dönüştürmede kullanılan, kullanıcının belirlediği CBS bileşeni"],
      ["Navigasyon", "GPS'in kullanıldığı işlerden: yol bulma"],
      ["Uydu", "Görüntü ve konum sinyali veren yörüngedeki araç"],
    ],
    "CBS ve GPS ile ilgili tanımlardan kavramları bul.",
    [5, 7],
  ),
];
