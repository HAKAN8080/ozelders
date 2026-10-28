"use client";

import { useCallback, useMemo, useState } from "react";

import { OgretmenCagrisi } from "@/components/oyun/oyun-baglami";

/**
 * Boşluk doldurma. Cümlede boşluklar süslü parantezle yazılır:
 *   "Coğrafya kavramını ilk kez {Eratosthenes} kullanmıştır."
 */
export type BoslukCumlesi = { metin: string; kaynak?: string };

type Asama = "kurulum" | "oyun" | "sonuc";
type Parca = { tur: "metin"; deger: string } | { tur: "bosluk"; cevap: string; no: number };

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parcala(metin: string): Parca[] {
  const out: Parca[] = [];
  let no = 0;
  for (const p of metin.split(/(\{[^}]+\})/)) {
    if (!p) continue;
    if (p.startsWith("{")) out.push({ tur: "bosluk", cevap: p.slice(1, -1), no: no++ });
    else out.push({ tur: "metin", deger: p });
  }
  return out;
}

const PUAN = [10, 5];

export type BoslukOyunuAyarlari = { cumleler: BoslukCumlesi[]; yonerge: string; turSecenekleri?: number[] };

export function BoslukOyunu({ cumleler, yonerge, turSecenekleri = [5, 8] }: BoslukOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [adet, setAdet] = useState(turSecenekleri[0]);
  const [sira, setSira] = useState<BoslukCumlesi[]>([]);
  const [i, setI] = useState(0);
  const [dolu, setDolu] = useState<Record<number, string>>({});
  const [secili, setSecili] = useState<number>(0);
  const [kontrol, setKontrol] = useState<Record<number, boolean> | null>(null);
  const [deneme, setDeneme] = useState(0);
  const [bitti, setBitti] = useState(false);
  const [puan, setPuan] = useState(0);
  const [maks, setMaks] = useState(0);
  const [havuz, setHavuz] = useState<string[]>([]); // kelime havuzu
  const [zorlanilan, setZorlanilan] = useState<BoslukCumlesi[]>([]);

  const tumCevaplar = useMemo(() => [...new Set(cumleler.flatMap((c) => parcala(c.metin).flatMap((p) => (p.tur === "bosluk" ? [p.cevap] : []))))], [cumleler]);

  const cumleyiKur = useCallback(
    (c: BoslukCumlesi) => {
      const cevaplar = parcala(c.metin).flatMap((p) => (p.tur === "bosluk" ? [p.cevap] : []));
      const celdirici = karistir(tumCevaplar.filter((x) => !cevaplar.includes(x))).slice(0, Math.max(2, 4 - cevaplar.length));
      setHavuz(karistir([...cevaplar, ...celdirici]));
      setDolu({});
      setSecili(0);
      setKontrol(null);
      setDeneme(0);
      setBitti(false);
    },
    [tumCevaplar],
  );

  const baslat = useCallback(() => {
    const s = karistir(cumleler).slice(0, adet);
    setSira(s);
    setI(0);
    setPuan(0);
    setMaks(s.reduce((t, c) => t + parcala(c.metin).filter((p) => p.tur === "bosluk").length * PUAN[0], 0));
    setZorlanilan([]);
    cumleyiKur(s[0]);
    setAsama("oyun");
  }, [cumleler, adet, cumleyiKur]);

  const parcalar = useMemo(() => (sira[i] ? parcala(sira[i].metin) : []), [sira, i]);
  const bosluklar = parcalar.filter((p): p is Extract<Parca, { tur: "bosluk" }> => p.tur === "bosluk");

  const kelimeSec = (k: string) => {
    if (bitti) return;
    const yeni = { ...dolu, [secili]: k };
    // aynı kelime başka boşluktaysa oradan al
    for (const [no, v] of Object.entries(dolu)) if (v === k && Number(no) !== secili) delete yeni[Number(no)];
    setDolu(yeni);
    setKontrol(null);
    const bos = bosluklar.find((b) => !yeni[b.no] && b.no !== secili);
    if (bos) setSecili(bos.no);
  };

  const kontrolEt = () => {
    const sonuc: Record<number, boolean> = {};
    bosluklar.forEach((b) => (sonuc[b.no] = dolu[b.no] === b.cevap));
    setKontrol(sonuc);
    const hepsi = bosluklar.every((b) => sonuc[b.no]);
    const yeniDeneme = deneme + 1;
    setDeneme(yeniDeneme);
    if (hepsi || yeniDeneme >= 2) {
      const dogru = bosluklar.filter((b) => sonuc[b.no]).length;
      setPuan((p) => p + dogru * PUAN[yeniDeneme - 1]);
      if (!hepsi || yeniDeneme > 1) setZorlanilan((z) => [...z, sira[i]]);
      setBitti(true);
      // ikinci denemede de yanlışsa doğrusunu göster
      if (!hepsi) setDolu(Object.fromEntries(bosluklar.map((b) => [b.no, b.cevap])));
    } else {
      // yanlışları boşalt, ikinci şans
      const kalan = { ...dolu };
      bosluklar.forEach((b) => !sonuc[b.no] && delete kalan[b.no]);
      setDolu(kalan);
      const ilkYanlis = bosluklar.find((b) => !sonuc[b.no]);
      if (ilkYanlis) setSecili(ilkYanlis.no);
    }
  };

  const sonraki = () => {
    if (i + 1 >= sira.length) setAsama("sonuc");
    else {
      setI(i + 1);
      cumleyiKur(sira[i + 1]);
    }
  };

  const kutu = "rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8";

  if (asama === "kurulum") {
    return (
      <div className={`flex flex-col gap-8 ${kutu}`}>
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynanır?</h2>
          <p className="m-0 max-w-[40em] leading-relaxed text-[#3d4743]">{yonerge}</p>
          <p className="m-0 text-sm text-muted">
            Bir boşluğa dokun, sonra alttaki kelimelerden birini seç. İki hakkın var: ilk denemede her boşluk 10, ikincide 5 puan.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-serif text-2xl font-bold">Kaç cümle?</h2>
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
                {n >= cumleler.length ? `Hepsi (${cumleler.length})` : n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <button type="button" onClick={baslat} className="rounded-md bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-hover">
            Oyunu başlat
          </button>
        </div>
      </div>
    );
  }

  if (asama === "sonuc") {
    const oran = maks ? Math.round((puan / maks) * 100) : 0;
    return (
      <div className={`flex flex-col gap-6 ${kutu}`}>
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">{oran >= 90 ? "Boşluk bırakmadın." : oran >= 60 ? "İyi gidiyor." : "Bir tur daha oyna, oturacak."}</h2>
          <p className="m-0 text-muted">
            Puan: {puan} / {maks}
          </p>
        </div>
        <OgretmenCagrisi oran={oran} />
        {zorlanilan.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-base font-semibold">Tekrar okuman gerekenler</h3>
            {zorlanilan.map((c, k) => (
              <p key={k} className="m-0 rounded-md bg-[#fbefd6] px-4 py-3 text-[15px] leading-relaxed">
                {parcala(c.metin).map((p, j) => (p.tur === "metin" ? <span key={j}>{p.deger}</span> : <strong key={j}>{p.cevap}</strong>))}
                {c.kaynak && <span className="text-sm text-muted"> ({c.kaynak})</span>}
              </p>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={baslat} className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
            Yeni cümlelerle oyna
          </button>
          <button type="button" onClick={() => setAsama("kurulum")} className="rounded-md border border-border px-6 py-3 font-semibold hover:border-primary">
            Ayarları değiştir
          </button>
        </div>
      </div>
    );
  }

  const tamam = bosluklar.every((b) => dolu[b.no]);
  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        <div className="flex flex-col" aria-live="polite">
          <span className="text-sm opacity-75">
            Cümle {i + 1}/{sira.length}
          </span>
          <span className="font-serif text-xl font-bold">
            {bitti
              ? kontrol && bosluklar.every((b) => kontrol[b.no])
                ? "Doğru."
                : "Doğrusu yerleştirildi."
              : kontrol
                ? "Kırmızılar yanlıştı, bir daha dene."
                : "Boşlukları doldur."}
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex flex-col items-end">
            <span className="opacity-75">Puan</span>
            <span className="font-serif text-xl font-bold">{puan}</span>
          </div>
          <button type="button" onClick={() => setAsama("sonuc")} className="rounded-md border border-white/40 px-4 py-2 font-semibold hover:bg-white/10">
            Bitir
          </button>
        </div>
      </div>
      <div className={`flex flex-col gap-5 ${kutu}`}>
        <p className="m-0 font-serif text-[20px] leading-[2.1] sm:text-[22px]" data-bosluk-cumle="">
          {parcalar.map((p, j) =>
            p.tur === "metin" ? (
              <span key={j}>{p.deger}</span>
            ) : (
              <button
                key={j}
                type="button"
                data-bosluk={p.no}
                onClick={() => !bitti && setSecili(p.no)}
                className={`mx-1 inline-flex min-w-28 items-center justify-center rounded-md border-2 border-dashed px-3 py-0.5 align-middle font-sans text-[17px] leading-normal font-semibold transition-colors ${
                  kontrol?.[p.no] === true || (bitti && dolu[p.no] === p.cevap && kontrol?.[p.no] !== false)
                    ? "border-solid border-primary bg-primary text-primary-foreground"
                    : bitti && kontrol?.[p.no] === false
                      ? "border-solid border-[#e8a317] bg-[#fbefd6]"
                      : kontrol?.[p.no] === false
                        ? "border-[#c0392b] bg-[#fde8e5]"
                        : secili === p.no
                          ? "border-primary bg-primary-soft"
                          : "border-[#9cbcaa] bg-background"
                }`}
              >
                {dolu[p.no] ?? " "}
              </button>
            ),
          )}
        </p>
        {!bitti ? (
          <>
            <div className="flex flex-wrap gap-2">
              {havuz.map((k) => {
                const kullanildi = Object.values(dolu).includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    data-kelime={k}
                    onClick={() => kelimeSec(k)}
                    className={`rounded-md border-2 px-3.5 py-2 text-[15px] font-semibold transition-colors ${
                      kullanildi ? "border-border bg-[#eef1ef] text-muted" : "border-border bg-background hover:border-primary/60"
                    }`}
                  >
                    {k}
                  </button>
                );
              })}
            </div>
            <div>
              <button
                type="button"
                disabled={!tamam}
                onClick={kontrolEt}
                className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-40"
              >
                Kontrol et
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-primary-soft px-4 py-3">
            <span className="text-sm text-muted">{sira[i]?.kaynak ?? ""}</span>
            <button type="button" onClick={sonraki} className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover">
              {i + 1 >= sira.length ? "Sonucu gör" : "Sonraki cümle →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
