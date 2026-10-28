/**
 * 9. sınıf Coğrafya — 2.1.1 Coğrafi koordinatlar, yerel/ulusal saat, saat dilimleri
 * Kaynak: MEB Coğrafya 9. Sınıf Ders Kitabı (TYMM), s.37–40. Bilgiler kitaptan;
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
