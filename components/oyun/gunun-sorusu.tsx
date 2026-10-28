"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SesliOku } from "@/components/oyun/sesli-oku";
import type { GununSorusu as Soru } from "@/lib/games/gunun-sorusu";

/** İstanbul saatine göre gün numarası */
function bugun() {
  return Math.floor((Date.now() + 3 * 3600_000) / 86_400_000);
}

/** Her gün herkese aynı soru. Cevap tarayıcıda hatırlanır (yalnız kolaylık; tutulamazsa sorun değil). */
export function GununSorusuKarti({ havuz }: { havuz: Soru[] }) {
  const [gun, setGun] = useState<number | null>(null);
  const [secim, setSecim] = useState<number | null>(null);

  useEffect(() => {
    const g = bugun();
    let kayit: number | null = null;
    try {
      const v = window.localStorage.getItem(`gunun-sorusu-${g}`);
      if (v !== null) kayit = Number(v);
    } catch {
      /* depolama kapalı olabilir */
    }
    const t = setTimeout(() => {
      setGun(g);
      setSecim(kayit);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (gun === null || havuz.length === 0) return <div className="h-48 rounded-[10px] border border-border bg-background/70" />;

  // Aynı sırayla dönmesin diye adım asal sayı
  const s = havuz[(gun * 37) % havuz.length];
  const sec = (k: number) => {
    if (secim !== null) return;
    setSecim(k);
    try {
      window.localStorage.setItem(`gunun-sorusu-${gun}`, String(k));
    } catch {
      /* yok say */
    }
  };

  return (
    <section data-gunun-sorusu="" className="flex flex-col gap-4 rounded-[10px] border-2 border-primary bg-background/90 p-5 backdrop-blur-[2px] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Günün sorusu · {s.konuBasligi}</p>
        <SesliOku metin={`${s.soru} ${s.secenekler.map((x, k) => `${"ABCD"[k]}: ${x}`).join(". ")}`} />
      </div>
      <p className="m-0 font-serif text-xl leading-snug font-bold sm:text-2xl">{s.soru}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {s.secenekler.map((x, k) => {
          const durum = secim === null ? "" : k === s.dogru ? "dogru" : k === secim ? "yanlis" : "soluk";
          return (
            <button
              key={k}
              type="button"
              disabled={secim !== null}
              onClick={() => sec(k)}
              className={`flex items-center gap-3 rounded-md border-2 px-4 py-3 text-left text-[15px] font-semibold transition-colors ${
                durum === "dogru"
                  ? "border-primary bg-primary text-primary-foreground"
                  : durum === "yanlis"
                    ? "border-[#c0392b] bg-[#fde8e5]"
                    : durum === "soluk"
                      ? "border-border bg-background opacity-50"
                      : "border-border bg-background hover:border-primary/60"
              }`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-sm">{"ABCD"[k]}</span>
              {x}
            </button>
          );
        })}
      </div>
      {secim !== null && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-primary-soft px-4 py-3">
          <p className="m-0 text-[15px]">
            <strong>{secim === s.dogru ? "Doğru. " : "Yanlış. "}</strong>
            {s.cozum} <span className="text-muted">Yarın yeni bir soru var.</span>
          </p>
          <Link href={s.konu} className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground no-underline hover:bg-primary-hover">
            Bu konunun oyunları →
          </Link>
        </div>
      )}
    </section>
  );
}
