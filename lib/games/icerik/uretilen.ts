// scripts/icerik_jsondan.py ile üretildi. Elle düzenlemeyin.

import type { KonuSekmesi } from "@/components/oyun/konu-oyunlari";
import { SEKMELER as S0 } from "@/lib/games/icerik/hava-olaylari";
import { SEKMELER as S1 } from "@/lib/games/icerik/iklim-sistemi";
import { SEKMELER as S2 } from "@/lib/games/icerik/iklim-sistemi-sicaklik";
import { SEKMELER as S3 } from "@/lib/games/icerik/iklim-sistemi-basinc-ruzgar-yagis";
import { SEKMELER as S4 } from "@/lib/games/icerik/iklim-turleri";
import { SEKMELER as S5 } from "@/lib/games/icerik/iklim-degisiklikleri";
import { SEKMELER as S6 } from "@/lib/games/icerik/nufusun-tarihsel-degisimi";
import { SEKMELER as S7 } from "@/lib/games/icerik/nufusun-dagilisi-ve-hareketleri";
import { SEKMELER as S8 } from "@/lib/games/icerik/demografik-donusum-ve-nufus-piramitleri";
import { SEKMELER as S9 } from "@/lib/games/icerik/nufus-politikalari";
import { SEKMELER as S10 } from "@/lib/games/icerik/ekonomik-faaliyetler";
import { SEKMELER as S11 } from "@/lib/games/icerik/tehlike-risk-ve-afet";
import { SEKMELER as S12 } from "@/lib/games/icerik/afet-turleri";
import { SEKMELER as S13 } from "@/lib/games/icerik/butuncul-afet-yonetimi";
import { SEKMELER as S14 } from "@/lib/games/icerik/bolge-ve-bolge-sinirlari";
import { SEKMELER as S15 } from "@/lib/games/icerik/sozluk";

export const URETILEN_KONULAR: { href: string; baslik: string; sekmeler: KonuSekmesi[] }[] = [
  { href: "/oyunlar/hava-olaylari", baslik: "Hava Olayları", sekmeler: S0 },
  { href: "/oyunlar/iklim-sistemi", baslik: "İklim Sistemi: Bileşenler", sekmeler: S1 },
  { href: "/oyunlar/iklim-sistemi-sicaklik", baslik: "İklim Sistemi: Sıcaklık", sekmeler: S2 },
  { href: "/oyunlar/iklim-sistemi-basinc-ruzgar-yagis", baslik: "İklim Sistemi: Basınç, Rüzgâr ve Yağış", sekmeler: S3 },
  { href: "/oyunlar/iklim-turleri", baslik: "İklim Türleri", sekmeler: S4 },
  { href: "/oyunlar/iklim-degisiklikleri", baslik: "İklim Sisteminde Yaşanan Değişiklikler", sekmeler: S5 },
  { href: "/oyunlar/nufusun-tarihsel-degisimi", baslik: "Nüfusun Tarihsel Değişimi ve Geleceği", sekmeler: S6 },
  { href: "/oyunlar/nufusun-dagilisi-ve-hareketleri", baslik: "Nüfusun Dağılışı ve Hareketleri", sekmeler: S7 },
  { href: "/oyunlar/demografik-donusum-ve-nufus-piramitleri", baslik: "Demografik Dönüşüm Süreci ve Nüfus Piramitleri", sekmeler: S8 },
  { href: "/oyunlar/nufus-politikalari", baslik: "Nüfus Politikaları", sekmeler: S9 },
  { href: "/oyunlar/ekonomik-faaliyetler", baslik: "Ekonomik Faaliyetleri Etkileyen Coğrafi Faktörler", sekmeler: S10 },
  { href: "/oyunlar/tehlike-risk-ve-afet", baslik: "Tehlike, Risk ve Afet", sekmeler: S11 },
  { href: "/oyunlar/afet-turleri", baslik: "Afet Türleri", sekmeler: S12 },
  { href: "/oyunlar/butuncul-afet-yonetimi", baslik: "Bütüncül Afet Yönetimi", sekmeler: S13 },
  { href: "/oyunlar/bolge-ve-bolge-sinirlari", baslik: "Bölge ve Bölge Sınırı", sekmeler: S14 },
  { href: "/oyunlar/sozluk", baslik: "Sözlük", sekmeler: S15 },
];
