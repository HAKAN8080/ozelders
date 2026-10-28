"use client";

import { useCallback, useEffect, useState } from "react";

export type EslestirmeCifti = { id: string; sol: string; sag: string };

type Asama = "kurulum" | "oyun" | "sonuc";

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** İlk denemede 10 puan; her yanlış eşleştirme o çiftin puanından 3 düşer (en az 1). */
function ciftPuani(hata: number) {
  return Math.max(10 - hata * 3, 1);
}

export type EslestirmeOyunuAyarlari = {
  ciftler: EslestirmeCifti[];
  solBaslik: string;
  sagBaslik: string;
  yonerge: string;
  turSecenekleri?: number[];
};

export function EslestirmeOyunu({ ciftler, solBaslik, sagBaslik, yonerge, turSecenekleri = [5, 8] }: EslestirmeOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [adet, setAdet] = useState(turSecenekleri[0]);
  const [sol, setSol] = useState<EslestirmeCifti[]>([]);
  const [sag, setSag] = useState<EslestirmeCifti[]>([]);
  const [secSol, setSecSol] = useState<string | null>(null);
  const [secSag, setSecSag] = useState<string | null>(null);
  const [eslesen, setEslesen] = useState<Set<string>>(new Set());
  const [eslesmeNo, setEslesmeNo] = useState<Record<string, number>>({});
  const [hata, setHata] = useState<Record<string, number>>({});
  const [yanlis, setYanlis] = useState<{ sol: string; sag: string } | null>(null);
  const [puan, setPuan] = useState(0);
  const [sure, setSure] = useState(0);

  const baslat = useCallback(() => {
    const secilen = karistir(ciftler).slice(0, Math.min(adet, ciftler.length));
    setSol(karistir(secilen));
    setSag(karistir(secilen));
    setSecSol(null);
    setSecSag(null);
    setEslesen(new Set());
    setEslesmeNo({});
    setHata({});
    setYanlis(null);
    setPuan(0);
    setSure(0);
    setAsama("oyun");
  }, [ciftler, adet]);

  useEffect(() => {
    if (asama !== "oyun") return;
    const t = setInterval(() => setSure((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [asama]);

  useEffect(() => {
    if (!yanlis) return;
    const t = setTimeout(() => setYanlis(null), 600);
    return () => clearTimeout(t);
  }, [yanlis]);

  const dene = (solId: string, sagId: string) => {
    setSecSol(null);
    setSecSag(null);
    if (solId === sagId) {
      const yeni = new Set(eslesen).add(solId);
      setEslesen(yeni);
      setEslesmeNo((n) => ({ ...n, [solId]: yeni.size }));
      setPuan((p) => p + ciftPuani(hata[solId] ?? 0));
      if (yeni.size === sol.length) setTimeout(() => setAsama("sonuc"), 600);
    } else {
      setHata((h) => ({ ...h, [solId]: (h[solId] ?? 0) + 1 }));
      setYanlis({ sol: solId, sag: sagId });
    }
  };

  const solaTikla = (id: string) => {
    if (eslesen.has(id)) return;
    if (secSag) dene(id, secSag);
    else setSecSol(secSol === id ? null : id);
  };
  const sagaTikla = (id: string) => {
    if (eslesen.has(id)) return;
    if (secSol) dene(secSol, id);
    else setSecSag(secSag === id ? null : id);
  };

  const sureYaz = `${Math.floor(sure / 60)}:${String(sure % 60).padStart(2, "0")}`;
  const toplamHata = Object.values(hata).reduce((a, b) => a + b, 0);

  if (asama === "kurulum") {
    return (
      <div className="flex flex-col gap-8 rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynanır?</h2>
          <p className="m-0 max-w-[40em] leading-relaxed text-[#3d4743]">{yonerge}</p>
          <p className="m-0 text-sm text-muted">
            Soldan bir karta, sonra sağda eşine dokun. İlk denemede 10 puan, her yanlışta o çiftin puanı azalır.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-serif text-2xl font-bold">Kaç çift?</h2>
          <div className="flex flex-wrap gap-2">
            {turSecenekleri.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAdet(n)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  adet === n ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"
                }`}
              >
                {n >= ciftler.length ? `Hepsi (${ciftler.length})` : n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={baslat}
            className="rounded-md bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Oyunu başlat
          </button>
        </div>
      </div>
    );
  }

  if (asama === "sonuc") {
    const maks = sol.length * 10;
    const zorlanilan = sol.filter((c) => hata[c.id]);
    return (
      <div className="flex flex-col gap-6 rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">
            {puan === maks ? "Hepsi ilk seferde doğru." : puan >= maks * 0.7 ? "Çok iyi." : "Bir tur daha oyna, oturacak."}
          </h2>
        </div>
        <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Puan", `${puan} / ${maks}`],
            ["Eşleşen", `${eslesen.size} / ${sol.length}`],
            ["Süre", sureYaz],
            ["Hata", String(toplamHata)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md bg-primary-soft p-4">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="m-0 font-serif text-2xl font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        {zorlanilan.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-base font-semibold">Zorlandıkların</h3>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {zorlanilan.map((c) => (
                <li key={c.id} className="rounded-md bg-[#fbefd6] px-3 py-2 text-[15px]">
                  <strong>{c.sol}</strong> → {c.sag}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={baslat}
            className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Yeni çiftlerle oyna
          </button>
          <button
            type="button"
            onClick={() => setAsama("kurulum")}
            className="rounded-md border border-border px-6 py-3 font-semibold hover:border-primary"
          >
            Ayarları değiştir
          </button>
        </div>
      </div>
    );
  }

  const kart = (taraf: "sol" | "sag", c: EslestirmeCifti) => {
    const id = c.id;
    const tamam = eslesen.has(id);
    const secili = taraf === "sol" ? secSol === id : secSag === id;
    const hatali = yanlis && (taraf === "sol" ? yanlis.sol === id : yanlis.sag === id);
    return (
      <button
        key={`${taraf}-${id}`}
        type="button"
        data-eslestir={`${taraf}:${id}`}
        disabled={tamam}
        onClick={() => (taraf === "sol" ? solaTikla(id) : sagaTikla(id))}
        className={`rounded-md border-2 px-4 py-3 text-left text-[15px] leading-snug transition-all ${taraf === "sol" ? "w-auto px-3 py-2 sm:w-full sm:px-4 sm:py-3" : "w-full"} ${
          tamam
            ? "border-primary bg-primary text-primary-foreground opacity-90"
            : hatali
              ? "animate-[sallan_0.4s] border-[#c0392b] bg-[#fde8e5]"
              : secili
                ? "border-primary bg-primary-soft shadow-md"
                : "border-border bg-background hover:border-primary/60"
        } ${taraf === "sol" ? "font-semibold" : ""}`}
      >
        <span className="flex items-start gap-2.5">
          {tamam && (
            <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
              {eslesmeNo[id]}
            </span>
          )}
          <span>{taraf === "sol" ? c.sol : c.sag}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        <div className="flex flex-col" aria-live="polite">
          <span className="text-sm opacity-75">
            Eşleşen {eslesen.size}/{sol.length}
          </span>
          <span className="font-serif text-xl font-bold">
            {yanlis ? "Bu ikisi eş değil." : secSol || secSag ? "Şimdi eşine dokun." : "Bir kart seç."}
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex flex-col items-end">
            <span className="opacity-75">Puan</span>
            <span className="font-serif text-xl font-bold">{puan}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="opacity-75">Süre</span>
            <span className="font-serif text-xl font-bold tabular-nums">{sureYaz}</span>
          </div>
          <button
            type="button"
            onClick={() => setAsama("sonuc")}
            className="rounded-md border border-white/40 px-4 py-2 font-semibold hover:bg-white/10"
          >
            Bitir
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-5">
        {/* Telefonda sol sütun üstte, kaydırırken görünür kalan şerit olur */}
        <div className="sticky top-2 z-10 flex flex-col gap-2 rounded-[10px] bg-[#fbfbf8]/95 p-2 backdrop-blur sm:static sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <span className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">{solBaslik}</span>
          <div className="flex flex-wrap gap-2 sm:flex-col">{sol.map((c) => kart("sol", c))}</div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">{sagBaslik}</span>
          {sag.map((c) => kart("sag", c))}
        </div>
      </div>
    </div>
  );
}
