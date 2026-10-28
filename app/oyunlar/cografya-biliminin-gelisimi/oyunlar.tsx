"use client";

import { useState } from "react";

import { EslestirmeOyunu } from "@/components/oyun/eslestirme-oyunu";
import { KategoriOyunu } from "@/components/oyun/kategori-oyunu";
import { SiralamaOyunu } from "@/components/oyun/siralama-oyunu";
import { BILGINLER, CAGLAR, GELISMELER } from "@/lib/games/icerik/cografya-biliminin-gelisimi";

const SEKMELER = [
  { id: "cag", baslik: "Hangi çağ?", alt: "Kişi ve gelişmeleri çağına yerleştir" },
  { id: "sira", baslik: "Zaman şeridi", alt: "Bilim insanlarını kronolojik sıraya diz" },
  { id: "eslestir", baslik: "Kim ne yaptı?", alt: "Bilim insanını katkısıyla eşleştir" },
] as const;

type Sekme = (typeof SEKMELER)[number]["id"];

const CAG_OGELERI = [
  ...BILGINLER.map((b) => ({ id: b.id, ad: b.ad, kategori: b.cag })),
  ...GELISMELER.map((g) => ({ id: g.id, ad: g.ad, kategori: g.cag })),
];

const SIRA_OGELERI = BILGINLER.filter((b) => b.dogum !== undefined && b.yillar).map((b) => ({
  id: b.id,
  ad: b.ad,
  anahtar: b.dogum as number,
  etiket: b.yillar as string,
}));

const CIFTLER = BILGINLER.filter((b) => b.katki).map((b) => ({ id: b.id, sol: b.ad, sag: b.katki as string }));

export function CografyaGelisimOyunlari() {
  const [sekme, setSekme] = useState<Sekme>("cag");
  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" className="grid gap-2 sm:grid-cols-3">
        {SEKMELER.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={sekme === s.id}
            type="button"
            onClick={() => setSekme(s.id)}
            className={`flex flex-col gap-0.5 rounded-md border-2 px-4 py-3 text-left transition-colors ${
              sekme === s.id ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/40"
            }`}
          >
            <span className="font-serif text-lg font-bold">{s.baslik}</span>
            <span className="text-sm text-muted">{s.alt}</span>
          </button>
        ))}
      </div>

      {sekme === "cag" && (
        <KategoriOyunu
          key="cag"
          kategoriler={[...CAGLAR]}
          ogeler={CAG_OGELERI}
          yonerge="Coğrafya biliminin gelişimine katkı veren bilim insanlarını ve coğrafyanın gelişmesinde rol oynayan etkenleri ait oldukları çağa yerleştir."
          turSecenekleri={[10, 15, 25]}
        />
      )}
      {sekme === "sira" && (
        <SiralamaOyunu
          key="sira"
          ogeler={SIRA_OGELERI}
          yonerge="Ders kitabındaki tarih şeridinde yer alan bilim insanlarını yaşadıkları döneme göre en eskiden en yeniye sırala."
          uclar={["En eski", "En yeni"]}
          turSecenekleri={[5, 8, 0]}
        />
      )}
      {sekme === "eslestir" && (
        <EslestirmeOyunu
          key="eslestir"
          ciftler={CIFTLER}
          solBaslik="Bilim insanı"
          sagBaslik="Katkısı"
          yonerge="Coğrafya biliminin gelişimine katkı veren bilim insanlarını yaptıkları çalışmalarla eşleştir."
          turSecenekleri={[5, 8, 100]}
        />
      )}
    </div>
  );
}
