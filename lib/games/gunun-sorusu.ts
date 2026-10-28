import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";
import type { Soru } from "@/components/oyun/soru-oyunu";
import { SEKMELER as GELISIMI } from "@/lib/games/icerik/cografya-biliminin-gelisimi";
import { SEKMELER as KONUSU } from "@/lib/games/icerik/cografyanin-konusu-ve-bolumleri";
import { SEKMELER as HARITA } from "@/lib/games/icerik/harita-ve-olcek";
import { SEKMELER as HARITALAMA } from "@/lib/games/icerik/haritalama-ve-yer-sekilleri";
import { SEKMELER as KOORDINAT } from "@/lib/games/icerik/koordinatlar-ve-saat";
import { SEKMELER as MBT } from "@/lib/games/icerik/mbt-bilesenleri";
import { SEKMELER as KONUM } from "@/lib/games/icerik/turkiyenin-konumu";

export type GununSorusu = Soru & { konu: string; konuBasligi: string };

const KONULAR: { href: string; baslik: string; sekmeler: KonuSekmesi[] }[] = [
  { href: "/oyunlar/cografyanin-konusu-ve-bolumleri", baslik: "Coğrafyanın Konusu ve Bölümleri", sekmeler: KONUSU },
  { href: "/oyunlar/cografya-biliminin-gelisimi", baslik: "Coğrafya Biliminin Gelişimi", sekmeler: GELISIMI },
  { href: "/oyunlar/harita-ve-olcek", baslik: "Harita ve Ölçek", sekmeler: HARITA },
  { href: "/oyunlar/koordinatlar-ve-saat-dilimleri", baslik: "Koordinatlar ve Saat Dilimleri", sekmeler: KOORDINAT },
  { href: "/oyunlar/haritalama-teknikleri-ve-yer-sekilleri", baslik: "Haritalama Teknikleri ve Yer Şekilleri", sekmeler: HARITALAMA },
  { href: "/oyunlar/turkiyenin-cografi-konumu", baslik: "Türkiye'nin Coğrafi Konumu", sekmeler: KONUM },
  { href: "/oyunlar/mekansal-bilgi-teknolojileri", baslik: "Mekânsal Bilgi Teknolojileri", sekmeler: MBT },
];

/** Tüm konulardan günün sorusu havuzu: sabit çoktan seçmeliler + eşleştirme çiftlerinden türetilen sorular. */
export function gununSorusuHavuzu(): GununSorusu[] {
  const havuz: GununSorusu[] = [];
  for (const k of KONULAR) {
    for (const s of k.sekmeler) {
      if (s.tur === "soru" && s.sorular) {
        s.sorular.forEach((q, i) => {
          // Sabit sorularda doğru şık hep başta yazılı; yerini soruya göre kaydır
          const yer = (i + havuz.length) % q.secenekler.length;
          const yanlislar = q.secenekler.filter((_, j) => j !== q.dogru);
          const secenekler = [...yanlislar];
          secenekler.splice(yer, 0, q.secenekler[q.dogru]);
          havuz.push({ ...q, secenekler, dogru: yer, konu: k.href, konuBasligi: k.baslik });
        });
      }
      if (s.tur === "eslestirme" && s.ciftler.length >= 4) {
        const n = s.ciftler.length;
        s.ciftler.forEach((c, i) => {
          const yanlis = [1, 2, 3].map((d) => s.ciftler[(i + d) % n].sag);
          // Doğru şıkkın yeri soruya göre değişsin
          const yer = i % 4;
          const secenekler = [...yanlis];
          secenekler.splice(yer, 0, c.sag);
          havuz.push({
            soru: `${s.solBaslik === "Kavram" || s.solBaslik === "Yer şekli" || s.solBaslik === "Teknik" ? `“${c.sol}” hangisidir?` : `${s.solBaslik}: “${c.sol}”. Doğru eşleşme hangisidir?`}`,
            secenekler,
            dogru: yer,
            cozum: `${c.sol}: ${c.sag}.`,
            konu: k.href,
            konuBasligi: k.baslik,
          });
        });
      }
    }
  }
  return havuz;
}
