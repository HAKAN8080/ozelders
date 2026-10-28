/**
 * 9. sınıf Coğrafya — 2.1.1 Coğrafi koordinatlar, yerel/ulusal saat, saat dilimleri
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.34 (Irma kasırgası tablosu), s.37–40. Bilgiler kitaptan;
 * çoktan seçmeli sorulardaki yanlış şıklar soruyu kurmak için eklendi.
 */

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";
import type { Soru } from "@/components/oyun/soru-oyunu";
import { ciftler } from "@/lib/games/icerik/yardimci";

function s(soru: string, dogru: string, yanlislar: string[], cozum: string): Soru {
  return { soru, secenekler: [dogru, ...yanlislar], dogru: 0, cozum };
}

const SAAT_SORULARI: Soru[] = [
  s("Dünya kaç saat dilimine ayrılmıştır?", "24", ["12", "15", "36"], "Dünya, on beşer derecelik aralıklarla 24 saat dilimine ayrılmıştır (s.39)."),
  s("Uluslararası saat dilimleri kaç derecelik aralıklarla ayrılmıştır?", "15°", ["1°", "10°", "30°"], "Saat dilimleri on beşer derecelik aralıklarla ayrılmıştır (s.39)."),
  s("Türkiye ulusal (ortak) saat olarak hangi meridyenin yerel saatini kullanır?", "45° doğu", ["30° doğu", "26° doğu", "36° doğu"], "Türkiye ortak saat olarak 45° doğu meridyenini esas aldığından +3. saat dilimindedir (s.39)."),
  s("Türkiye hangi saat dilimindedir?", "+3", ["+2", "+1", "−3"], "45° doğu meridyeni esas alındığı için Türkiye +3. saat dilimindedir (s.39)."),
  s("Tarih değiştirme çizgisi hangi meridyendir?", "180° meridyeni", ["0° meridyeni", "90° doğu meridyeni", "45° doğu meridyeni"], "Başlangıç meridyeninin (0°) tam karşısındaki 180° meridyeni tarih değiştirme çizgisidir (s.39)."),
  s("Tarih değiştirme çizgisinin batısında (doğu yarım kürede) tarih nasıldır?", "Bir gün ileridir", ["Bir gün geridir", "Aynıdır", "İki gün ileridir"], "Çizginin batısında (doğu yarım küre) tarih bir gün ileri, doğusunda (batı yarım küre) bir gün geridir (s.39)."),
  s("Doğu yarım küredeki saat dilimleri nasıl numaralandırılır?", "+1, +2, +3 …", ["−1, −2, −3 …", "A, B, C …", "1, 2, 3 … (işaretsiz)"], "Doğu yarım küredeki dilimler +1, +2, +3…; batı yarım küredekiler −1, −2, −3… şeklinde numaralandırılır (s.39)."),
  s("Namaz, iftar ve sahur vakitlerinin belirlenmesinde hangi saat kullanılır?", "Yerel saat", ["Ulusal saat", "Uluslararası saat", "Başlangıç meridyeninin saati"], "Güneş'in en yüksek noktaya ulaştığı ana göre ayarlanan yerel saat bu vakitlerin belirlenmesinde kullanılır (s.39)."),
  s("Uluslararası saat dilimlerinin sınırları neden zikzaklı çizilmiştir?", "Ülkelerin siyasi sınırları esas alındığı için", ["Dağlar ve akarsular esas alındığı için", "Meridyenler eğri olduğu için", "Okyanus akıntıları esas alındığı için"], "Saat dilimlerinin sınırları, ülkelerin siyasi sınırları esas alınarak zikzak oluşturacak şekilde çizilmiştir (s.39)."),
  s("Aşağıdaki ülkelerden hangisi aynı anda birden fazla ortak saat kullanmaz?", "Türkiye", ["Kanada", "Avustralya", "Rusya Federasyonu"], "Doğu-batı doğrultusunda geniş yer kaplayan Kanada, ABD, Rusya Federasyonu ve Avustralya'da birden fazla ortak saat kullanılır; Türkiye tek ortak saat (45° D) kullanır (s.39)."),
  s("Bir yerin coğrafi koordinatlarını uydular aracılığıyla belirlemeye yarayan sistem hangisidir?", "GPS", ["CBS", "Lejant", "Projeksiyon"], "GPS, bir yerin coğrafi koordinatlarını uydular aracılığıyla belirlemeye yarayan Küresel Konumlandırma Sistemi'dir (s.37)."),
  s("Enlem ve boylam hangi birimlerle ifade edilir?", "Derece, dakika, saniye", ["Kilometre, metre, santimetre", "Saat, dakika, saniye", "Derece, metre, saniye"], "Enlem ve boylam derece (°), dakika (') ve saniye ('') ile ifade edilir (s.37)."),
];

/** Kitap s.34: Irma kasırgasının etkili olduğu gün, konum ve kategoriler (Eylül 2017) */
const IRMA: [string, number, number, string][] = [
  ["31 Ağustos", 16, -31, "Kategori yok"],
  ["1 Eylül", 17, -34, "3. kategori"],
  ["2 Eylül", 18, -38, "3. kategori"],
  ["3 Eylül", 18, -44, "2. kategori"],
  ["4 Eylül", 17, -49, "3. kategori"],
  ["5 Eylül", 16, -54, "4. kategori"],
  ["6 Eylül", 17, -59, "5. kategori"],
  ["7 Eylül", 18, -65, "5. kategori"],
  ["8 Eylül", 20, -71, "5. kategori"],
  ["9 Eylül", 22, -76, "4. kategori"],
  ["10 Eylül", 23, -80, "3. kategori"],
  ["11 Eylül", 26, -81, "2. kategori"],
  ["12 Eylül", 31, -84, "Kategori yok"],
  ["13 Eylül", 35, -88, "Kategori yok"],
];

export const SEKMELER: KonuSekmesi[] = [
  {
    id: "kavramlar",
    baslik: "Kavramlar",
    alt: "Kavramı tanımıyla eşleştir",
    tur: "eslestirme",
    solBaslik: "Kavram",
    sagBaslik: "Tanım",
    yonerge: "Koordinat ve zaman kavramlarını kitaptaki tanımlarıyla eşleştir.",
    turSecenekleri: [5, 7],
    ciftler: ciftler([
      ["Coğrafi koordinat sistemi", "Ekvator ve başlangıç meridyeni esas alınarak enlem ve boylamların kullanılmasıyla oluşturulan sistem"],
      ["Enlem", "Bir noktanın Ekvator'a uzaklığının yerin merkeziyle yaptığı açı değeri"],
      ["Boylam", "Bir noktanın başlangıç meridyenine uzaklığının yerin merkeziyle yaptığı açı değeri"],
      ["GPS", "Bir yerin coğrafi koordinatlarını uydular aracılığıyla belirlemeye yarayan Küresel Konumlandırma Sistemi"],
      ["Yerel saat", "Güneş'in en yüksek noktaya ulaştığı öğle vaktine (12.00) göre ayarlanan saat"],
      ["Ulusal (ortak) saat", "Ülke sınırları içindeki bir veya birden fazla meridyenin yerel saatinin ortak saat olarak kullanılması"],
      ["Tarih değiştirme çizgisi", "Başlangıç meridyeninin tam karşısında yer alan 180° meridyeni"],
    ]),
  },
  {
    id: "koordinat-bul",
    baslik: "Koordinat bul",
    alt: "Verilen enlem ve boylamı haritada işaretle",
    tur: "koordinat",
    mod: "bul",
    bolge: [-165, -55, 180, 75],
    izgara: 15,
    yonerge:
      "Verilen enlem ve boylamın kesiştiği noktayı haritada işaretle. Paraleller ve meridyenler 15 derecede bir çizildi; aradaki değerleri sen tahmin edeceksin. Hedefe ne kadar yakınsan o kadar puan.",
    turSecenekleri: [5, 10],
  },
  {
    id: "irma",
    baslik: "Irma kasırgası",
    alt: "Kasırganın rotasını gün gün çiz",
    tur: "koordinat",
    mod: "rota",
    bolge: [-105, 0, -25, 42],
    izgara: 5,
    yonerge:
      "Ders kitabının 34. sayfasındaki tabloda Irma kasırgasının (Eylül 2017) her gün bulunduğu paralel ve meridyen verildi. Günleri sırayla haritada işaretle; işaretlerin birleşince kasırganın hareket yönünü oluşturacak.",
    rota: IRMA.map(([etiket, lat, lon, grup]) => ({ etiket, lat, lon, grup })),
    gruplar: [
      { ad: "Kategori yok", renk: "#8a948f" },
      { ad: "2. kategori", renk: "#e6d04a" },
      { ad: "3. kategori", renk: "#f0932b" },
      { ad: "4. kategori", renk: "#d1451b" },
      { ad: "5. kategori", renk: "#7f1515" },
    ],
    sonNot:
      "Kasırgalar etkilerine göre kategorilere ayrılır. 4 ve 5. kategorideki kasırgalar etkili olduğu yerlerde doğal ve beşerî çevreye ciddi zararlar verebilir (kitap s.34). Haritada koyu kırmızı ve turuncu noktalar kasırganın en güçlü olduğu 5–9 Eylül günlerini gösteriyor. Bu günlerde hangi ülkelerin etkilendiğini atlasından bulmayı dene.",
  },
  {
    id: "bilgi",
    baslik: "Saat ve tarih",
    alt: "Kitaptaki bilgilerle çoktan seçmeli",
    tur: "soru",
    yonerge: "Yerel saat, ulusal saat, saat dilimleri ve tarih değiştirme çizgisi üzerine sorular.",
    turSecenekleri: [6, 12],
    sorular: SAAT_SORULARI,
  },
  {
    id: "hesap",
    baslik: "Saat dilimi hesapları",
    alt: "Türkiye saatinden başka dilimin saatini bul",
    tur: "soru",
    yonerge:
      "Dünya 15°'lik 24 saat dilimine ayrılır. Doğuya gidildikçe dilim numarası artar, batıya gidildikçe azalır. Türkiye +3. dilimdedir. Her turda sorular yeniden üretilir.",
    turSecenekleri: [10, 20],
    uretecler: ["saat-dilimi"],
  },
];
