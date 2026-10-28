"use client";

import { useCallback, useState, type DragEvent } from "react";

export type SiralamaOgesi = { id: string; ad: string; anahtar: number; etiket: string };

type Asama = "kurulum" | "oyun" | "sonuc";

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type SiralamaOyunuAyarlari = {
  ogeler: SiralamaOgesi[];
  yonerge: string;
  /** Liste başı ve sonu etiketi: ["En eski", "En yeni"] */
  uclar?: [string, string];
  turSecenekleri?: number[];
};

/** Her öğe doğru yerdeyse 10 puan. İki deneme hakkı: ikincide doğru yere gelenler 5 puan. */
export function SiralamaOyunu({ ogeler, yonerge, uclar = ["En eski", "En yeni"], turSecenekleri = [5, 7, 0] }: SiralamaOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [adet, setAdet] = useState(turSecenekleri[0]);
  const [liste, setListe] = useState<SiralamaOgesi[]>([]);
  const [deneme, setDeneme] = useState(0); // kaç kez kontrol edildi
  const [kontrol, setKontrol] = useState<Record<string, boolean> | null>(null);
  const [ilkDogru, setIlkDogru] = useState<Set<string>>(new Set());
  const [puan, setPuan] = useState(0);
  const [surukle, setSurukle] = useState<number | null>(null);

  const dogruSira = useCallback((l: SiralamaOgesi[]) => [...l].sort((a, b) => a.anahtar - b.anahtar), []);

  const baslat = useCallback(() => {
    const secilen = karistir(ogeler).slice(0, adet > 0 ? adet : ogeler.length);
    let l = karistir(secilen);
    // Zaten doğru sıradaysa bir kez daha karıştır
    if (l.every((o, i) => o.id === dogruSira(secilen)[i].id)) l = [...l].reverse();
    setListe(l);
    setDeneme(0);
    setKontrol(null);
    setIlkDogru(new Set());
    setPuan(0);
    setAsama("oyun");
  }, [ogeler, adet, dogruSira]);

  const tasi = (from: number, to: number) => {
    if (to < 0 || to >= liste.length || from === to) return;
    const l = [...liste];
    const [o] = l.splice(from, 1);
    l.splice(to, 0, o);
    setListe(l);
    setKontrol(null);
  };

  const kontrolEt = () => {
    const dogru = dogruSira(liste);
    const sonuc: Record<string, boolean> = {};
    liste.forEach((o, i) => (sonuc[o.id] = o.id === dogru[i].id));
    setKontrol(sonuc);
    const yeniDeneme = deneme + 1;
    setDeneme(yeniDeneme);
    if (yeniDeneme === 1) {
      const ilk = new Set(Object.keys(sonuc).filter((k) => sonuc[k]));
      setIlkDogru(ilk);
      setPuan(ilk.size * 10);
      if (ilk.size === liste.length) setTimeout(() => setAsama("sonuc"), 900);
    } else {
      const ikinci = Object.keys(sonuc).filter((k) => sonuc[k] && !ilkDogru.has(k)).length;
      setPuan((p) => p + ikinci * 5);
      setTimeout(() => setAsama("sonuc"), 1200);
    }
  };

  const birak = (e: DragEvent, i: number) => {
    e.preventDefault();
    if (surukle !== null) tasi(surukle, i);
    setSurukle(null);
  };

  if (asama === "kurulum") {
    return (
      <div className="flex flex-col gap-8 rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynanır?</h2>
          <p className="m-0 max-w-[40em] leading-relaxed text-[#3d4743]">{yonerge}</p>
          <p className="m-0 text-sm text-muted">
            Kartları oklarla ya da sürükleyerek diz, sonra kontrol et. İki hakkın var: ilk denemede doğru yerdekiler 10,
            ikincide 5 puan.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-serif text-2xl font-bold">Kaç kart?</h2>
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
                {n === 0 ? `Hepsi (${ogeler.length})` : n}
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
    const maks = liste.length * 10;
    return (
      <div className="flex flex-col gap-6 rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">
            {puan === maks ? "Sıralama kusursuz." : puan >= maks * 0.6 ? "İyi gidiyor." : "Doğru sıraya bir göz at, sonra tekrar dene."}
          </h2>
          <p className="m-0 text-muted">
            Puan: {puan} / {maks}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-base font-semibold">Doğru sıra</h3>
          <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
            {dogruSira(liste).map((o, i) => (
              <li key={o.id} className="flex items-center gap-3 rounded-md bg-primary-soft px-3 py-2">
                <span className="w-6 text-right font-serif font-bold text-primary">{i + 1}</span>
                <span className="font-semibold">{o.ad}</span>
                <span className="ml-auto text-sm text-muted tabular-nums">{o.etiket}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={baslat}
            className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Yeni kartlarla oyna
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

  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        <div className="flex flex-col" aria-live="polite">
          <span className="text-sm opacity-75">{deneme === 0 ? "1. deneme" : "2. deneme"}</span>
          <span className="font-serif text-xl font-bold">
            {kontrol
              ? `${Object.values(kontrol).filter(Boolean).length}/${liste.length} doğru yerde. Kırmızıları düzelt.`
              : "Kartları sıraya diz."}
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex flex-col items-end">
            <span className="opacity-75">Puan</span>
            <span className="font-serif text-xl font-bold">{puan}</span>
          </div>
          <button
            type="button"
            onClick={kontrolEt}
            className="rounded-md bg-white px-5 py-2 font-semibold text-primary hover:bg-white/90"
          >
            Kontrol et
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-[10px] border border-border bg-background p-3 sm:p-4">
        <span className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">↑ {uclar[0]}</span>
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {liste.map((o, i) => {
            const k = kontrol?.[o.id];
            const kilitli = ilkDogru.has(o.id) && deneme > 0;
            return (
              <li
                key={o.id}
                data-sira={o.ad}
                draggable={!kilitli}
                onDragStart={() => setSurukle(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => birak(e, i)}
                className={`flex items-center gap-3 rounded-md border-2 px-3 py-2.5 transition-colors ${
                  k === true || kilitli
                    ? "border-primary bg-primary-soft"
                    : k === false
                      ? "border-[#c0392b] bg-[#fde8e5]"
                      : "cursor-grab border-border bg-background hover:border-primary/50"
                }`}
              >
                <span className="w-6 text-right font-serif font-bold text-primary">{i + 1}</span>
                <span className="font-semibold">{o.ad}</span>
                {kilitli && <span className="ml-1 text-sm text-muted tabular-nums">{o.etiket}</span>}
                <span className="ml-auto flex gap-1">
                  <button
                    type="button"
                    aria-label={`${o.ad} yukarı`}
                    disabled={kilitli || i === 0}
                    onClick={() => tasi(i, i - 1)}
                    className="flex size-9 items-center justify-center rounded border border-border bg-background text-lg disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`${o.ad} aşağı`}
                    disabled={kilitli || i === liste.length - 1}
                    onClick={() => tasi(i, i + 1)}
                    className="flex size-9 items-center justify-center rounded border border-border bg-background text-lg disabled:opacity-30"
                  >
                    ↓
                  </button>
                </span>
              </li>
            );
          })}
        </ol>
        <span className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">↓ {uclar[1]}</span>
      </div>
    </div>
  );
}
