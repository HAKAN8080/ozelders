"use client";

import { useState } from "react";

import { BoslukOyunu, type BoslukCumlesi } from "@/components/oyun/bosluk-oyunu";
import { BulmacaOyunu, type BulmacaKelimesi } from "@/components/oyun/bulmaca-oyunu";
import { EslestirmeOyunu, type EslestirmeCifti } from "@/components/oyun/eslestirme-oyunu";
import { KategoriOyunu, type KategoriOgesi } from "@/components/oyun/kategori-oyunu";
import { SiralamaOyunu, type SiralamaOgesi } from "@/components/oyun/siralama-oyunu";
import { KoordinatOyunu, type KoordinatOyunuAyarlari } from "@/components/oyun/koordinat-oyunu";
import { SoruOyunu, type Soru, type UretecAdi } from "@/components/oyun/soru-oyunu";

type Ortak = { id: string; baslik: string; alt: string; yonerge: string; turSecenekleri?: number[] };

/** Bir konu sayfasındaki sekmeler. Tamamen veri; konu dosyaları bunu doldurur. */
export type KonuSekmesi = Ortak &
  (
    | { tur: "kategori"; kategoriler: string[]; ogeler: KategoriOgesi[] }
    | { tur: "eslestirme"; ciftler: EslestirmeCifti[]; solBaslik: string; sagBaslik: string }
    | { tur: "siralama"; ogeler: SiralamaOgesi[]; uclar?: [string, string] }
    | { tur: "soru"; sorular?: Soru[]; uretecler?: UretecAdi[] }
    | ({ tur: "koordinat" } & Omit<KoordinatOyunuAyarlari, "yonerge" | "turSecenekleri">)
    | { tur: "bosluk"; cumleler: BoslukCumlesi[] }
    | { tur: "bulmaca"; kelimeler: BulmacaKelimesi[] }
  );

export function KonuOyunlari({ sekmeler }: { sekmeler: KonuSekmesi[] }) {
  const [aktif, setAktif] = useState(sekmeler[0].id);
  const s = sekmeler.find((x) => x.id === aktif) ?? sekmeler[0];
  const kolon = sekmeler.length >= 7 ? "sm:grid-cols-3 lg:grid-cols-4" : sekmeler.length >= 5 ? "sm:grid-cols-3 lg:grid-cols-5" : sekmeler.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";

  return (
    <div className="flex flex-col gap-5">
      {sekmeler.length > 1 && (
        <div role="tablist" className={`grid gap-2 ${kolon}`}>
          {sekmeler.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={aktif === x.id}
              type="button"
              onClick={() => setAktif(x.id)}
              className={`flex flex-col gap-0.5 rounded-md border-2 px-4 py-3 text-left transition-colors ${
                aktif === x.id ? "border-primary bg-primary-soft" : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <span className="font-serif text-lg font-bold leading-tight">{x.baslik}</span>
              <span className="text-sm leading-snug text-muted">{x.alt}</span>
            </button>
          ))}
        </div>
      )}

      {s.tur === "kategori" && (
        <KategoriOyunu key={s.id} kategoriler={s.kategoriler} ogeler={s.ogeler} yonerge={s.yonerge} turSecenekleri={s.turSecenekleri} />
      )}
      {s.tur === "eslestirme" && (
        <EslestirmeOyunu
          key={s.id}
          ciftler={s.ciftler}
          solBaslik={s.solBaslik}
          sagBaslik={s.sagBaslik}
          yonerge={s.yonerge}
          turSecenekleri={s.turSecenekleri}
        />
      )}
      {s.tur === "siralama" && (
        <SiralamaOyunu key={s.id} ogeler={s.ogeler} yonerge={s.yonerge} uclar={s.uclar} turSecenekleri={s.turSecenekleri} />
      )}
      {s.tur === "koordinat" && (
        <KoordinatOyunu
          key={s.id}
          mod={s.mod}
          bolge={s.bolge}
          izgara={s.izgara}
          yonerge={s.yonerge}
          turSecenekleri={s.turSecenekleri}
          rota={s.rota}
          gruplar={s.gruplar}
          sonNot={s.sonNot}
        />
      )}
      {s.tur === "bosluk" && <BoslukOyunu key={s.id} cumleler={s.cumleler} yonerge={s.yonerge} turSecenekleri={s.turSecenekleri} />}
      {s.tur === "bulmaca" && <BulmacaOyunu key={s.id} kelimeler={s.kelimeler} yonerge={s.yonerge} turSecenekleri={s.turSecenekleri} />}
      {s.tur === "soru" && (
        <SoruOyunu key={s.id} yonerge={s.yonerge} sorular={s.sorular} uretecler={s.uretecler} turSecenekleri={s.turSecenekleri} />
      )}
    </div>
  );
}
