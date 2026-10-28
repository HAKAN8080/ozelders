"use client";

import { useCallback, useMemo, useState, type KeyboardEvent } from "react";

import { OgretmenCagrisi } from "@/components/oyun/oyun-baglami";

/** Bulmaca kelimesi: tek kelime cevap ve ipucu (kitaptaki tanım). */
export type BulmacaKelimesi = { cevap: string; ipucu: string };

type Yon = "yatay" | "dikey";
type Yer = { kelime: string; ipucu: string; x: number; y: number; yon: Yon; no: number };
type Asama = "kurulum" | "oyun" | "sonuc";

const buyut = (s: string) => s.toLocaleUpperCase("tr").replace(/[^A-ZÇĞİÖŞÜÂÎÛ]/g, "");

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Kelimeleri kesiştirerek yerleştirir; birkaç denemeden en çok kelime sığan ve en derli toplu olanı seçer. */
function uret(kelimeler: BulmacaKelimesi[], hedef: number): Yer[] {
  let enIyi: Omit<Yer, "no">[] = [];
  let enIyiPuan = -Infinity;
  for (let deneme = 0; deneme < 40; deneme++) {
    const secilen = karistir(kelimeler)
      .slice(0, hedef + 4)
      .map((k) => ({ kelime: buyut(k.cevap), ipucu: k.ipucu }))
      .filter((k) => k.kelime.length >= 3)
      .sort((a, b) => b.kelime.length - a.kelime.length);
    const izgara = new Map<string, string>();
    const yerler: Omit<Yer, "no">[] = [];
    const al = (x: number, y: number) => izgara.get(`${x},${y}`);

    const uygun = (k: string, x: number, y: number, yon: Yon) => {
      const dx = yon === "yatay" ? 1 : 0;
      const dy = yon === "dikey" ? 1 : 0;
      if (al(x - dx, y - dy) || al(x + dx * k.length, y + dy * k.length)) return -1;
      let kesisim = 0;
      for (let i = 0; i < k.length; i++) {
        const cx = x + dx * i;
        const cy = y + dy * i;
        const var_ = al(cx, cy);
        if (var_) {
          if (var_ !== k[i]) return -1;
          kesisim++;
        } else if (al(cx + dy, cy + dx) || al(cx - dy, cy - dx)) return -1; // yan komşu harf olmasın
      }
      return kesisim;
    };
    const koy = (k: string, ipucu: string, x: number, y: number, yon: Yon) => {
      for (let i = 0; i < k.length; i++) izgara.set(`${x + (yon === "yatay" ? i : 0)},${y + (yon === "dikey" ? i : 0)}`, k[i]);
      yerler.push({ kelime: k, ipucu, x, y, yon });
    };

    for (const { kelime, ipucu } of secilen) {
      if (yerler.length >= hedef) break;
      if (yerler.some((y) => y.kelime === kelime)) continue;
      if (yerler.length === 0) {
        koy(kelime, ipucu, 0, 0, "yatay");
        continue;
      }
      let aday: { x: number; y: number; yon: Yon; s: number } | null = null;
      for (const p of yerler) {
        const yon: Yon = p.yon === "yatay" ? "dikey" : "yatay";
        for (let i = 0; i < p.kelime.length; i++) {
          for (let j = 0; j < kelime.length; j++) {
            if (p.kelime[i] !== kelime[j]) continue;
            const px = p.x + (p.yon === "yatay" ? i : 0);
            const py = p.y + (p.yon === "dikey" ? i : 0);
            const x = px - (yon === "yatay" ? j : 0);
            const y = py - (yon === "dikey" ? j : 0);
            const s = uygun(kelime, x, y, yon);
            if (s > 0 && (!aday || s > aday.s || (s === aday.s && Math.random() < 0.3))) aday = { x, y, yon, s };
          }
        }
      }
      if (aday) koy(kelime, ipucu, aday.x, aday.y, aday.yon);
    }

    const xs = [...izgara.keys()].map((k) => Number(k.split(",")[0]));
    const ys = [...izgara.keys()].map((k) => Number(k.split(",")[1]));
    const alan = (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1);
    const puan = yerler.length * 1000 - alan;
    if (puan > enIyiPuan) {
      enIyiPuan = puan;
      enIyi = yerler.map((y) => ({ ...y }));
    }
  }
  // Koordinatları 0'dan başlat ve numarala (yukarıdan aşağı, soldan sağa)
  const minX = Math.min(...enIyi.map((y) => y.x));
  const minY = Math.min(...enIyi.map((y) => y.y));
  const kaydir = enIyi.map((y) => ({ ...y, x: y.x - minX, y: y.y - minY }));
  const baslar = [...new Set(kaydir.map((y) => `${y.y},${y.x}`))].sort((a, b) => {
    const [ay, ax] = a.split(",").map(Number);
    const [by, bx] = b.split(",").map(Number);
    return ay - by || ax - bx;
  });
  return kaydir.map((y) => ({ ...y, no: baslar.indexOf(`${y.y},${y.x}`) + 1 }));
}

const hucreleri = (y: Yer) =>
  Array.from({ length: y.kelime.length }, (_, i) => `${y.x + (y.yon === "yatay" ? i : 0)},${y.y + (y.yon === "dikey" ? i : 0)}`);

export type BulmacaOyunuAyarlari = { kelimeler: BulmacaKelimesi[]; yonerge: string; turSecenekleri?: number[] };

export function BulmacaOyunu({ kelimeler, yonerge, turSecenekleri = [6, 9] }: BulmacaOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [adet, setAdet] = useState(turSecenekleri[0]);
  const [yerler, setYerler] = useState<Yer[]>([]);
  const [harfler, setHarfler] = useState<Record<string, string>>({});
  const [acilan, setAcilan] = useState<Record<string, true>>({});
  const [secili, setSecili] = useState<number>(0); // yerler içindeki indeks
  const [kontrol, setKontrol] = useState(false);
  const [hucreOdak, setHucreOdak] = useState<string | null>(null);

  const baslat = useCallback(() => {
    setYerler(uret(kelimeler, adet));
    setHarfler({});
    setAcilan({});
    setSecili(0);
    setKontrol(false);
    setAsama("oyun");
  }, [kelimeler, adet]);

  const dogruHarf = useMemo(() => {
    const m = new Map<string, string>();
    yerler.forEach((y) => hucreleri(y).forEach((h, i) => m.set(h, y.kelime[i])));
    return m;
  }, [yerler]);

  const boyut = useMemo(() => {
    const xs = [...dogruHarf.keys()].map((k) => Number(k.split(",")[0]));
    const ys = [...dogruHarf.keys()].map((k) => Number(k.split(",")[1]));
    return { w: xs.length ? Math.max(...xs) + 1 : 0, h: ys.length ? Math.max(...ys) + 1 : 0 };
  }, [dogruHarf]);

  const numaralar = useMemo(() => {
    const m = new Map<string, number>();
    yerler.forEach((y) => m.set(`${y.x},${y.y}`, y.no));
    return m;
  }, [yerler]);

  const kelimeDogru = (y: Yer) => hucreleri(y).every((h, i) => harfler[h] === y.kelime[i]);
  const hepsiDogru = yerler.length > 0 && yerler.every(kelimeDogru);

  const odakla = (h: string) => {
    document.querySelector<HTMLInputElement>(`[data-hucre="${h}"]`)?.focus();
    setHucreOdak(h);
  };

  const hucreSec = (h: string) => {
    const icinde = yerler.map((y, i) => ({ y, i })).filter(({ y }) => hucreleri(y).includes(h));
    if (!icinde.length) return;
    // Aynı hücreye ikinci dokunuşta yön değiştir
    const mevcut = icinde.findIndex(({ i }) => i === secili);
    const sonraki = hucreOdak === h && mevcut >= 0 ? icinde[(mevcut + 1) % icinde.length] : (icinde.find(({ i }) => i === secili) ?? icinde[0]);
    setSecili(sonraki.i);
    setHucreOdak(h);
  };

  const yaz = (h: string, harf: string) => {
    const b = buyut(harf.replace("i", "İ").replace("ı", "I")).slice(-1);
    if (!b) return;
    setHarfler((x) => ({ ...x, [h]: b }));
    setKontrol(false);
    const y = yerler[secili];
    if (!y) return;
    const hs = hucreleri(y);
    const k = hs.indexOf(h);
    if (k >= 0 && k + 1 < hs.length) odakla(hs[k + 1]);
  };

  const tus = (h: string, e: KeyboardEvent<HTMLInputElement>) => {
    const y = yerler[secili];
    const hs = y ? hucreleri(y) : [];
    const k = hs.indexOf(h);
    if (e.key === "Backspace") {
      e.preventDefault();
      if (harfler[h]) setHarfler((x) => ({ ...x, [h]: "" }));
      else if (k > 0) {
        setHarfler((x) => ({ ...x, [hs[k - 1]]: "" }));
        odakla(hs[k - 1]);
      }
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const [x, yy] = h.split(",").map(Number);
      const d = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key]!;
      const n = `${x + d[0]},${yy + d[1]}`;
      if (dogruHarf.has(n)) {
        hucreSec(n);
        odakla(n);
      }
    }
  };

  const harfAc = () => {
    const y = yerler[secili];
    if (!y) return;
    const hs = hucreleri(y);
    const i = hs.findIndex((h, k) => harfler[h] !== y.kelime[k]);
    if (i < 0) return;
    setHarfler((x) => ({ ...x, [hs[i]]: y.kelime[i] }));
    setAcilan((x) => ({ ...x, [hs[i]]: true }));
  };

  const kelimePuani = (y: Yer) => (kelimeDogru(y) ? Math.max(10 - hucreleri(y).filter((h) => acilan[h]).length * 3, 2) : 0);
  const puan = yerler.reduce((t, y) => t + kelimePuani(y), 0);

  const kutu = "rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8";

  if (asama === "kurulum") {
    return (
      <div className={`flex flex-col gap-8 ${kutu}`}>
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynanır?</h2>
          <p className="m-0 max-w-[40em] leading-relaxed text-[#3d4743]">{yonerge}</p>
          <p className="m-0 text-sm text-muted">
            Bir kareye dokun ve yaz. Aynı kareye tekrar dokunursan yön değişir. Takılırsan &ldquo;Harf aç&rdquo; ile bir harf görebilirsin
            (o kelimenin puanı azalır). Her turda bulmaca yeniden kurulur.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-serif text-2xl font-bold">Kaç kelime?</h2>
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
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <button type="button" onClick={baslat} className="rounded-md bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-hover">
            Bulmacayı oluştur
          </button>
        </div>
      </div>
    );
  }

  if (asama === "sonuc") {
    const maks = yerler.length * 10;
    const oran = maks ? Math.round((puan / maks) * 100) : 0;
    const eksik = yerler.filter((y) => !kelimeDogru(y));
    return (
      <div className={`flex flex-col gap-6 ${kutu}`}>
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Bulmaca bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">{oran >= 90 ? "Tek harf kaçmadı." : oran >= 60 ? "İyi gidiyor." : "Bir bulmaca daha çöz, oturacak."}</h2>
          <p className="m-0 text-muted">
            Puan: {puan} / {maks}
          </p>
        </div>
        <OgretmenCagrisi oran={oran} />
        {eksik.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 text-base font-semibold">Cevaplar</h3>
            {eksik.map((y) => (
              <p key={`${y.no}${y.yon}`} className="m-0 rounded-md bg-[#fbefd6] px-3 py-2 text-[15px]">
                <strong>{y.kelime}</strong>: {y.ipucu}
              </p>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={baslat} className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
            Yeni bulmaca
          </button>
          <button type="button" onClick={() => setAsama("kurulum")} className="rounded-md border border-border px-6 py-3 font-semibold hover:border-primary">
            Ayarları değiştir
          </button>
        </div>
      </div>
    );
  }

  const seciliHucreler = new Set(yerler[secili] ? hucreleri(yerler[secili]) : []);
  const yatay = yerler.map((y, i) => ({ y, i })).filter(({ y }) => y.yon === "yatay").sort((a, b) => a.y.no - b.y.no);
  const dikey = yerler.map((y, i) => ({ y, i })).filter(({ y }) => y.yon === "dikey").sort((a, b) => a.y.no - b.y.no);
  const ipucuListesi = (liste: typeof yatay, baslik: string) => (
    <div className="flex flex-col gap-1.5">
      <h3 className="m-0 text-sm font-semibold uppercase tracking-[0.06em] text-muted">{baslik}</h3>
      {liste.map(({ y, i }) => (
        <button
          key={i}
          type="button"
          onClick={() => {
            setSecili(i);
            odakla(hucreleri(y)[0]);
          }}
          className={`rounded-md px-2.5 py-1.5 text-left text-[15px] leading-snug ${i === secili ? "bg-primary-soft" : "hover:bg-[#f1f5f2]"} ${
            kontrol && kelimeDogru(y) ? "text-primary line-through decoration-1" : ""
          }`}
        >
          <strong>{y.no}.</strong> {y.ipucu} <span className="text-muted">({y.kelime.length})</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        <div className="flex min-w-0 flex-col" aria-live="polite">
          <span className="text-sm opacity-75">
            {yerler[secili] ? `${yerler[secili].no}. ${yerler[secili].yon === "yatay" ? "soldan sağa" : "yukarıdan aşağı"}` : ""}
          </span>
          <span className="font-serif text-lg leading-snug font-bold">{yerler[secili]?.ipucu}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button type="button" onClick={harfAc} className="rounded-md bg-white/15 px-3.5 py-2 font-semibold hover:bg-white/25">
            Harf aç
          </button>
          <button type="button" onClick={() => setKontrol(true)} className="rounded-md bg-white px-3.5 py-2 font-semibold text-primary hover:bg-white/90">
            Kontrol et
          </button>
          <button type="button" onClick={() => setAsama("sonuc")} className="rounded-md border border-white/40 px-3.5 py-2 font-semibold hover:bg-white/10">
            {hepsiDogru ? "Bitir" : "Bırak"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="overflow-x-auto rounded-[10px] border border-border bg-background/85 p-2 sm:p-3">
          <div
            className="mx-auto grid w-max"
            style={{ gridTemplateColumns: `repeat(${boyut.w}, minmax(0, 1fr))` }}
            data-bulmaca=""
          >
            {Array.from({ length: boyut.h * boyut.w }, (_, k) => {
              const x = k % boyut.w;
              const y = Math.floor(k / boyut.w);
              const h = `${x},${y}`;
              const dogru = dogruHarf.get(h);
              if (!dogru) return <div key={h} className="size-8 sm:size-9" />;
              const no = numaralar.get(h);
              const yanlis = kontrol && harfler[h] && harfler[h] !== dogru;
              const tamam = kontrol && harfler[h] === dogru;
              return (
                <div key={h} className="relative size-8 sm:size-9">
                  {no && <span className="pointer-events-none absolute top-0 left-0.5 z-10 text-[9px] font-bold text-[#3d4743] sm:text-[10px]">{no}</span>}
                  <input
                    data-hucre={h}
                    value={harfler[h] ?? ""}
                    onChange={(e) => yaz(h, e.target.value)}
                    onKeyDown={(e) => tus(h, e)}
                    onFocus={() => setHucreOdak(h)}
                    onClick={() => hucreSec(h)}
                    maxLength={2}
                    autoCapitalize="characters"
                    autoComplete="off"
                    spellCheck={false}
                    aria-label={`Kare ${x + 1}, ${y + 1}`}
                    className={`size-full border border-[#9fb5a8] text-center font-sans text-[16px] font-bold uppercase caret-transparent outline-none sm:text-[17px] ${
                      acilan[h]
                        ? "bg-[#fbefd6] text-[#5a4210]"
                        : yanlis
                          ? "bg-[#fde8e5] text-[#c0392b]"
                          : tamam
                            ? "bg-primary-soft text-primary"
                            : hucreOdak === h
                              ? "bg-[#cfe3d6]"
                              : seciliHucreler.has(h)
                                ? "bg-[#eaf3ed]"
                                : "bg-white"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-[10px] border border-border bg-background/85 p-4">
          {yatay.length > 0 && ipucuListesi(yatay, "Soldan sağa")}
          {dikey.length > 0 && ipucuListesi(dikey, "Yukarıdan aşağı")}
        </div>
      </div>
      {hepsiDogru && (
        <div className="flex items-center justify-between gap-3 rounded-md bg-primary-soft px-4 py-3">
          <strong>Bulmaca tamam.</strong>
          <button type="button" onClick={() => setAsama("sonuc")} className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground">
            Sonucu gör
          </button>
        </div>
      )}
    </div>
  );
}
