"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { OgretmenCagrisi } from "@/components/oyun/oyun-baglami";
import { SesliOku } from "@/components/oyun/sesli-oku";

/**
 * İzohips (eş yükselti eğrisi) okuma oyunu.
 * Her soruda yapay bir arazi üretilir; eğriler marching squares ile çizilir,
 * renkler kitaptaki renklendirme basamaklarıdır (s.52). Sorular kitabın izohips
 * kurallarından türetilir (s.53–54): aynı eğri aynı yükselti, sık eğri = fazla eğim,
 * en dar halka en yüksek yer, 0 m eğrisi kıyı çizgisi, zirve ve boyun tanımları.
 */

const G = 72; // ızgara genişliği (hücre)
const Y = 48; // ızgara yüksekliği

type Arazi = {
  h: Float32Array; // (G+1)*(Y+1) köşe yükseltileri
  aralik: number;
  zirveler: { x: number; y: number }[];
  boyunlar: { x: number; y: number }[];
};
type Nokta = { ad: string; x: number; y: number };
type Soru = { arazi: Arazi; noktalar: Nokta[]; soru: string; secenekler: string[]; dogru: number; cozum: string };
type Asama = "kurulum" | "oyun" | "sonuc";

const idx = (x: number, y: number) => y * (G + 1) + x;

function rastgeleAralik(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function araziUret(): Arazi {
  const aralik = Math.random() < 0.5 ? 100 : 50;
  const olcek = aralik === 100 ? 1 : 0.5;
  const tepeSayisi = 2 + Math.floor(Math.random() * 2);
  const tepeler = Array.from({ length: tepeSayisi }, (_, i) => ({
    x: rastgeleAralik(G * 0.35, G * 0.9) - (i === 0 ? 0 : 0),
    y: rastgeleAralik(Y * 0.2, Y * 0.8),
    a: rastgeleAralik(450, 950) * olcek,
    s: rastgeleAralik(6, 11),
  }));
  // tepeler birbirine çok yakınsa ayır
  for (let i = 1; i < tepeler.length; i++) {
    const t = tepeler[i];
    for (let k = 0; k < i; k++) {
      const d = Math.hypot(t.x - tepeler[k].x, t.y - tepeler[k].y);
      if (d < 14) {
        t.x = Math.min(G * 0.92, Math.max(G * 0.3, t.x + (t.x > tepeler[k].x ? 14 : -14)));
        t.y = Math.min(Y * 0.85, Math.max(Y * 0.15, t.y + (t.y > tepeler[k].y ? 6 : -6)));
      }
    }
  }
  const egim = rastgeleAralik(3, 6) * olcek; // batıdan doğuya yükselen taban; batı kenarı deniz
  const h = new Float32Array((G + 1) * (Y + 1));
  for (let y = 0; y <= Y; y++)
    for (let x = 0; x <= G; x++) {
      let v = (x - G * 0.18) * egim;
      for (const t of tepeler) v += t.a * Math.exp(-((x - t.x) ** 2 + (y - t.y) ** 2) / (2 * t.s * t.s));
      h[idx(x, y)] = v;
    }
  const zirveler = tepeler.map((t) => {
    // gerçek en yüksek köşe, tepe merkezinin çevresinde
    let best = { x: Math.round(t.x), y: Math.round(t.y) };
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const x = Math.round(t.x) + dx;
        const y = Math.round(t.y) + dy;
        if (x < 0 || y < 0 || x > G || y > Y) continue;
        if (h[idx(x, y)] > h[idx(best.x, best.y)]) best = { x, y };
      }
    return best;
  });
  // boyun: iki zirve arasındaki doğru üzerinde en alçak nokta (iki tepe arasında kalan alçak yer)
  const boyunlar: { x: number; y: number }[] = [];
  for (let i = 0; i < zirveler.length; i++)
    for (let k = i + 1; k < zirveler.length; k++) {
      const a = zirveler[i];
      const b = zirveler[k];
      let enAz = { x: a.x, y: a.y, v: Infinity };
      for (let s = 0.15; s <= 0.85; s += 0.02) {
        const x = Math.round(a.x + (b.x - a.x) * s);
        const y = Math.round(a.y + (b.y - a.y) * s);
        const v = h[idx(x, y)];
        if (v < enAz.v) enAz = { x, y, v };
      }
      const tepeAlcak = Math.min(h[idx(a.x, a.y)], h[idx(b.x, b.y)]);
      if (tepeAlcak - enAz.v > aralik * 1.5 && enAz.v > aralik) boyunlar.push({ x: enAz.x, y: enAz.y });
    }
  return { h, aralik, zirveler, boyunlar };
}

/** Bir köşenin yükseltisine en yakın eğriye uzaklığı yeterliyse (aralığın %20'si) belirsiz değildir. */
function netMi(ar: Arazi, x: number, y: number) {
  const v = ar.h[idx(x, y)];
  const r = ((v % ar.aralik) + ar.aralik) % ar.aralik;
  return v > ar.aralik * 0.3 && r > ar.aralik * 0.2 && r < ar.aralik * 0.8;
}

function egimi(ar: Arazi, x: number, y: number) {
  const gx = (ar.h[idx(Math.min(x + 1, G), y)] - ar.h[idx(Math.max(x - 1, 0), y)]) / 2;
  const gy = (ar.h[idx(x, Math.min(y + 1, Y))] - ar.h[idx(x, Math.max(y - 1, 0))]) / 2;
  return Math.hypot(gx, gy);
}

function rastgeleKara(ar: Arazi, kosul: (x: number, y: number) => boolean = () => true, uzak: Nokta[] = []) {
  for (let i = 0; i < 2000; i++) {
    const x = 3 + Math.floor(Math.random() * (G - 6));
    const y = 3 + Math.floor(Math.random() * (Y - 6));
    if (!netMi(ar, x, y) || !kosul(x, y)) continue;
    if (uzak.some((p) => Math.hypot(p.x - x, p.y - y) < 7)) continue;
    return { x, y };
  }
  return null;
}

const HARFLER = ["A", "B", "C", "D"];

function soruUret(): Soru {
  for (;;) {
    const ar = araziUret();
    const tur = Math.floor(Math.random() * 5);
    const bant = (v: number) => Math.floor(v / ar.aralik) * ar.aralik;
    const yaz = (alt: number) => `${alt}–${alt + ar.aralik} m`;

    if (tur === 0) {
      const p = rastgeleKara(ar);
      if (!p) continue;
      const alt = bant(ar.h[idx(p.x, p.y)]);
      const dogru = yaz(alt);
      const yanlislar = [alt - ar.aralik, alt + ar.aralik, alt + 2 * ar.aralik, alt - 2 * ar.aralik].filter((v) => v >= 0).slice(0, 3).map(yaz);
      const secenekler = karistir([dogru, ...yanlislar]);
      return {
        arazi: ar,
        noktalar: [{ ad: "A", ...p }],
        soru: "A noktasının yükseltisi hangi aralıktadır?",
        secenekler,
        dogru: secenekler.indexOf(dogru),
        cozum: `A noktası ${alt} m ve ${alt + ar.aralik} m eğrileri arasında kalıyor. Aynı izohips üzerindeki tüm noktaların yükseltisi aynıdır.`,
      };
    }
    if (tur === 1) {
      const noktalar: Nokta[] = [];
      for (const ad of HARFLER) {
        const p = rastgeleKara(ar, () => true, noktalar);
        if (!p) break;
        noktalar.push({ ad, ...p });
      }
      if (noktalar.length < 4) continue;
      const v = noktalar.map((p) => ar.h[idx(p.x, p.y)]);
      const sirali = [...v].sort((a, b) => b - a);
      if (bant(sirali[0]) === bant(sirali[1])) continue; // tek bir en yüksek nokta olsun
      const i = v.indexOf(sirali[0]);
      return {
        arazi: ar,
        noktalar,
        soru: "İşaretli noktalardan hangisi en yüksektedir?",
        secenekler: [...HARFLER],
        dogru: i,
        cozum: `${HARFLER[i]} noktası ${bant(sirali[0])}–${bant(sirali[0]) + ar.aralik} m arasında; diğerlerinden daha iç halkada kalıyor. En dar halka en yüksek yeri gösterir.`,
      };
    }
    if (tur === 2) {
      const a = rastgeleKara(ar, (x, y) => egimi(ar, x, y) > ar.aralik * 0.45);
      if (!a) continue;
      const b = rastgeleKara(ar, (x, y) => egimi(ar, x, y) < egimi(ar, a.x, a.y) / 2.5 && egimi(ar, x, y) > 1, [{ ad: "A", ...a }]);
      if (!b) continue;
      const tersle = Math.random() < 0.5;
      const noktalar = tersle ? [{ ad: "A", ...b }, { ad: "B", ...a }] : [{ ad: "A", ...a }, { ad: "B", ...b }];
      const dogruAd = tersle ? "B" : "A";
      const secenekler = ["A noktasında", "B noktasında", "İkisinde eşittir", "Haritadan anlaşılamaz"];
      return {
        arazi: ar,
        noktalar,
        soru: "A ve B noktalarından hangisinde eğim daha fazladır?",
        secenekler,
        dogru: secenekler.indexOf(`${dogruAd} noktasında`),
        cozum: `${dogruAd} noktası çevresinde izohipsler birbirine daha yakın. İzohipslerin sık olduğu yerde eğim fazla, seyrek olduğu yerde azdır.`,
      };
    }
    if (tur === 3) {
      const secenekler = karistir(["50 m", "100 m", "200 m", "250 m"]);
      return {
        arazi: ar,
        noktalar: [],
        soru: "Bu haritada izohips aralığı kaç metredir?",
        secenekler,
        dogru: secenekler.indexOf(`${ar.aralik} m`),
        cozum: `Ardışık iki eğrinin değeri arasındaki fark ${ar.aralik} m. İzohipsler arasındaki yükselti farkı haritanın tamamında aynıdır.`,
      };
    }
    // tur 4: zirve mi boyun mu?
    const boyunVar = ar.boyunlar.length > 0;
    const boyunSor = boyunVar && Math.random() < 0.55;
    const p = boyunSor ? ar.boyunlar[0] : ar.zirveler[0];
    if (!p || ar.h[idx(p.x, p.y)] < ar.aralik * 1.5) continue;
    const dogru = boyunSor ? "Boyun" : "Zirve";
    const secenekler = karistir(["Zirve", "Boyun", "Falez", "Delta"]);
    return {
      arazi: ar,
      noktalar: [{ ad: "X", ...p }],
      soru: "X ile gösterilen yer şekli hangisidir?",
      secenekler,
      dogru: secenekler.indexOf(dogru),
      cozum: boyunSor
        ? "X iki tepe arasında kalıyor ve çevresine göre yükseltisi daha az. Boyun: iki tepe arasında kalan ve çevresine göre yükseltinin daha az olduğu yer."
        : "X en iç halkanın içinde, çevredeki en yüksek nokta. Zirve: dağ ya da tepelerin en yüksek noktası.",
    };
  }
}

/** Kitap s.52: yükselti arttıkça yeşil → sarı → turuncu → kahverengi; deniz açıktan koyu maviye. */
function renk(v: number, aralik: number) {
  if (v < 0) return v < -aralik ? [104, 160, 205] : [158, 200, 230];
  const basamak = Math.floor(v / aralik);
  const tonlar = [
    [96, 168, 92],
    [150, 196, 112],
    [226, 214, 120],
    [233, 178, 96],
    [204, 150, 96],
    [166, 112, 72],
    [134, 88, 58],
  ];
  return tonlar[Math.min(basamak, tonlar.length - 1)];
}

/** Marching squares: her seviye için çizgi parçaları */
function egriler(ar: Arazi) {
  let enYuksek = -Infinity;
  for (const v of ar.h) enYuksek = Math.max(enYuksek, v);
  const seviyeler: number[] = [];
  for (let s = 0; s <= enYuksek; s += ar.aralik) seviyeler.push(s);
  return seviyeler.map((s) => {
    const parcalar: [number, number, number, number][] = [];
    const ara = (x1: number, y1: number, v1: number, x2: number, y2: number, v2: number): [number, number] => {
      const t = (s - v1) / (v2 - v1);
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    };
    for (let y = 0; y < Y; y++)
      for (let x = 0; x < G; x++) {
        const a = ar.h[idx(x, y)];
        const b = ar.h[idx(x + 1, y)];
        const c = ar.h[idx(x + 1, y + 1)];
        const d = ar.h[idx(x, y + 1)];
        const kenarlar: [number, number][] = [];
        if (a < s !== b < s) kenarlar.push(ara(x, y, a, x + 1, y, b));
        if (b < s !== c < s) kenarlar.push(ara(x + 1, y, b, x + 1, y + 1, c));
        if (c < s !== d < s) kenarlar.push(ara(x + 1, y + 1, c, x, y + 1, d));
        if (d < s !== a < s) kenarlar.push(ara(x, y + 1, d, x, y, a));
        if (kenarlar.length === 2) parcalar.push([...kenarlar[0], ...kenarlar[1]]);
        else if (kenarlar.length === 4) {
          parcalar.push([...kenarlar[0], ...kenarlar[1]]);
          parcalar.push([...kenarlar[2], ...kenarlar[3]]);
        }
      }
    return { seviye: s, parcalar };
  });
}

function Harita({ soru }: { soru: Soru }) {
  const ar = soru.arazi;
  const tuval = useRef<HTMLCanvasElement | null>(null);
  const cizgiler = useMemo(() => egriler(ar), [ar]);

  useEffect(() => {
    const c = tuval.current;
    if (!c) return;
    const k = 6; // hücre başına piksel
    c.width = G * k;
    c.height = Y * k;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(c.width, c.height);
    for (let py = 0; py < c.height; py++)
      for (let px = 0; px < c.width; px++) {
        // köşeler arası çift doğrusal ara değer
        const fx = px / k;
        const fy = py / k;
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const tx = fx - x0;
        const ty = fy - y0;
        const v =
          ar.h[idx(x0, y0)] * (1 - tx) * (1 - ty) +
          ar.h[idx(Math.min(x0 + 1, G), y0)] * tx * (1 - ty) +
          ar.h[idx(x0, Math.min(y0 + 1, Y))] * (1 - tx) * ty +
          ar.h[idx(Math.min(x0 + 1, G), Math.min(y0 + 1, Y))] * tx * ty;
        const [r, g, b] = renk(v, ar.aralik);
        const o = (py * c.width + px) * 4;
        img.data[o] = r;
        img.data[o + 1] = g;
        img.data[o + 2] = b;
        img.data[o + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
  }, [ar]);

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-border" style={{ aspectRatio: `${G} / ${Y}` }}>
      <canvas ref={tuval} className="absolute inset-0 size-full" />
      <svg viewBox={`0 0 ${G} ${Y}`} className="absolute inset-0 size-full" data-izohips="">
        {cizgiler.map(({ seviye, parcalar }) => (
          <path
            key={seviye}
            d={parcalar.map(([x1, y1, x2, y2]) => `M${x1.toFixed(2)},${y1.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}`).join("")}
            fill="none"
            stroke={seviye === 0 ? "#1d4e7a" : "#3b2a1a"}
            strokeWidth={seviye === 0 ? 1.8 : (seviye / ar.aralik) % 5 === 0 ? 1.4 : 0.9}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            opacity={0.85}
          />
        ))}
        {cizgiler.map(({ seviye, parcalar }) => {
          if (!parcalar.length) return null;
          // etiketi eğrinin kenardan uzak bir parçasına koy
          const uygun = parcalar.filter(([x1, y1]) => x1 > 3 && x1 < G - 6 && y1 > 3 && y1 < Y - 3);
          const p = (uygun.length ? uygun : parcalar)[Math.floor((uygun.length || parcalar.length) / 3)];
          return (
            <text
              key={`t${seviye}`}
              x={p[0]}
              y={p[1]}
              fontSize={1.9}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-[#2a1d12] font-sans font-semibold"
              style={{ paintOrder: "stroke", stroke: "rgb(255 255 255 / 0.85)", strokeWidth: 0.5 }}
            >
              {seviye}
            </text>
          );
        })}
        {soru.noktalar.map((n) => (
          <g key={n.ad}>
            <circle cx={n.x} cy={n.y} r={0.9} className="fill-[#c0392b] stroke-white" strokeWidth={0.35} />
            <text
              x={n.x + 1.4}
              y={n.y - 1.1}
              fontSize={2.6}
              className="fill-[#1d1d1d] font-sans font-bold"
              style={{ paintOrder: "stroke", stroke: "white", strokeWidth: 0.6 }}
            >
              {n.ad}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export type IzohipsOyunuAyarlari = { yonerge: string; turSecenekleri?: number[] };

export function IzohipsOyunu({ yonerge, turSecenekleri = [5, 10] }: IzohipsOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [adet, setAdet] = useState(turSecenekleri[0]);
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState<number | null>(null);
  const [dogruSayi, setDogruSayi] = useState(0);

  const baslat = useCallback(() => {
    setSorular(Array.from({ length: adet }, soruUret));
    setI(0);
    setSecim(null);
    setDogruSayi(0);
    setAsama("oyun");
  }, [adet]);

  const kutu = "rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8";

  if (asama === "kurulum") {
    return (
      <div className={`flex flex-col gap-8 ${kutu}`}>
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynanır?</h2>
          <p className="m-0 max-w-[40em] leading-relaxed text-[#3d4743]">{yonerge}</p>
          <p className="m-0 text-sm text-muted">Her soruda yeni bir arazi çizilir. Eğrilerin üzerindeki sayılar yükseltiyi (m) gösterir.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-serif text-2xl font-bold">Kaç soru?</h2>
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
            Oyunu başlat
          </button>
        </div>
      </div>
    );
  }

  if (asama === "sonuc") {
    const oran = sorular.length ? Math.round((dogruSayi / sorular.length) * 100) : 0;
    return (
      <div className={`flex flex-col gap-6 ${kutu}`}>
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">{oran >= 90 ? "İzohips okumada ustasın." : oran >= 60 ? "İyi gidiyor." : "Kuralları bir daha oku, sonra yeni arazi dene."}</h2>
          <p className="m-0 text-muted">
            Doğru: {dogruSayi} / {sorular.length}
          </p>
        </div>
        <OgretmenCagrisi oran={oran} />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={baslat} className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
            Yeni arazilerle oyna
          </button>
          <button type="button" onClick={() => setAsama("kurulum")} className="rounded-md border border-border px-6 py-3 font-semibold hover:border-primary">
            Ayarları değiştir
          </button>
        </div>
      </div>
    );
  }

  const s = sorular[i];
  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        <div className="flex flex-col">
          <span className="text-sm opacity-75">
            Soru {i + 1}/{sorular.length}
          </span>
          <span className="font-serif text-xl font-bold" data-soru="">
            {s.soru}
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <SesliOku metin={s.soru} acik />
          <div className="flex flex-col items-end">
            <span className="opacity-75">Doğru</span>
            <span className="font-serif text-xl font-bold">{dogruSayi}</span>
          </div>
          <button type="button" onClick={() => setAsama("sonuc")} className="rounded-md border border-white/40 px-4 py-2 font-semibold hover:bg-white/10">
            Bitir
          </button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Harita soru={s} />
        <div className={`flex flex-col gap-3 ${kutu} !p-4 sm:!p-5`}>
          <div className="grid gap-2">
            {s.secenekler.map((x, k) => {
              const durum = secim === null ? "" : k === s.dogru ? "dogru" : k === secim ? "yanlis" : "soluk";
              return (
                <button
                  key={k}
                  type="button"
                  data-secenek={k === s.dogru ? "dogru" : "yanlis"}
                  disabled={secim !== null}
                  onClick={() => {
                    setSecim(k);
                    if (k === s.dogru) setDogruSayi((d) => d + 1);
                  }}
                  className={`flex items-center gap-3 rounded-md border-2 px-4 py-3 text-left font-semibold transition-colors ${
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
            <>
              <p className="m-0 rounded-md bg-primary-soft px-3 py-2 text-[15px]">
                <strong>{secim === s.dogru ? "Doğru. " : "Yanlış. "}</strong>
                {s.cozum}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (i + 1 >= sorular.length) setAsama("sonuc");
                  else {
                    setI(i + 1);
                    setSecim(null);
                  }
                }}
                className="self-start rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover"
              >
                {i + 1 >= sorular.length ? "Sonucu gör" : "Sonraki soru →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
