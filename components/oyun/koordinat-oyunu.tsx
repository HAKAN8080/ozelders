"use client";

import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";

import { OgretmenCagrisi } from "@/components/oyun/oyun-baglami";
import { useYakinlastirma } from "@/components/oyun/yakinlastirma";
import { DUNYA_ULKELERI } from "@/lib/games/dunya-ulkeler";
import { boylamYaz, enlemYaz, geriProjekte, projekte } from "@/lib/games/projeksiyon";

export type RotaNoktasi = { etiket: string; lat: number; lon: number; grup?: string };

export type KoordinatOyunuAyarlari = {
  /** "bul": verilen koordinatı haritada işaretle. "rota": tablodaki noktaları sırayla işaretle, yol oluşsun. */
  mod: "bul" | "rota";
  /** Görünen bölge: [batı boylam, güney enlem, doğu boylam, kuzey enlem] (batı ve güney negatif) */
  bolge: [number, number, number, number];
  /** Paralel ve meridyen aralığı (derece) */
  izgara: number;
  yonerge: string;
  turSecenekleri?: number[];
  rota?: RotaNoktasi[];
  /** Rota noktalarının grupları ve renkleri (lejant) */
  gruplar?: { ad: string; renk: string }[];
  /** Rota bitince gösterilen not (ör. kitaptaki açıklama) */
  sonNot?: string;
};

type Asama = "kurulum" | "oyun" | "sonuc";
type Isaret = { lat: number; lon: number };

const yaz = (p: Isaret) => `${enlemYaz(p.lat)} ${boylamYaz(p.lon)}`;
/** Derece cinsinden yaklaşık uzaklık */
const uzaklik = (a: Isaret, b: Isaret) => Math.hypot(a.lat - b.lat, (a.lon - b.lon) * Math.cos(((a.lat + b.lat) / 2) * (Math.PI / 180)));

function puanBul(d: number) {
  if (d <= 2.5) return 10;
  if (d <= 5) return 6;
  if (d <= 10) return 3;
  return 0;
}

export function KoordinatOyunu({ mod, bolge, izgara, yonerge, turSecenekleri = [5, 10], rota = [], gruplar = [], sonNot }: KoordinatOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [adet, setAdet] = useState(turSecenekleri[0]);
  const [hedefler, setHedefler] = useState<Isaret[]>([]);
  const [i, setI] = useState(0);
  const [isaret, setIsaret] = useState<Isaret | null>(null); // "bul" modunda son tık
  const [yerlesen, setYerlesen] = useState<{ p: RotaNoktasi; kendiliginden: boolean }[]>([]); // "rota" modu
  const [hata, setHata] = useState(0);
  const [mesaj, setMesaj] = useState("");
  const [puan, setPuan] = useState(0);
  const [gecmis, setGecmis] = useState<{ hedef: Isaret; isaret: Isaret; d: number }[]>([]);

  const [bati, guney, dogu, kuzey] = bolge;
  const temel = useMemo(() => {
    const a = projekte(bati, kuzey);
    const b = projekte(dogu, guney);
    const pad = (b.x - a.x) * 0.03;
    return { x: a.x - pad, y: a.y - pad, w: b.x - a.x + 2 * pad, h: b.y - a.y + 2 * pad };
  }, [bati, guney, dogu, kuzey]);
  const { gorus, svgRef, piksel: px, yakinlik, yakinlas, uzaklas, sifirla, tiklamaGecerli, svgOlaylari } = useYakinlastirma(temel);

  const toplam = mod === "rota" ? rota.length : hedefler.length;

  const baslat = useCallback(() => {
    if (mod === "bul") {
      const yeni: Isaret[] = [];
      const lats: number[] = [];
      const lons: number[] = [];
      for (let v = Math.ceil((guney + 5) / 5) * 5; v <= kuzey - 5; v += 5) lats.push(v);
      for (let v = Math.ceil((bati + 5) / 5) * 5; v <= dogu - 5; v += 5) lons.push(v);
      while (yeni.length < adet) {
        const p = { lat: lats[Math.floor(Math.random() * lats.length)], lon: lons[Math.floor(Math.random() * lons.length)] };
        if (!yeni.some((q) => q.lat === p.lat && q.lon === p.lon)) yeni.push(p);
      }
      setHedefler(yeni);
    }
    setI(0);
    setIsaret(null);
    setYerlesen([]);
    setHata(0);
    setMesaj("");
    setPuan(0);
    setGecmis([]);
    sifirla();
    setAsama("oyun");
  }, [mod, adet, bati, guney, dogu, kuzey, sifirla]);

  useEffect(() => {
    if (!mesaj || mod !== "rota") return;
    const t = setTimeout(() => setMesaj(""), 2600);
    return () => clearTimeout(t);
  }, [mesaj, mod]);

  const ileriRota = (kendiliginden: boolean) => {
    const h = rota[yerlesen.length];
    const yeni = [...yerlesen, { p: h, kendiliginden }];
    setYerlesen(yeni);
    setHata(0);
    if (yeni.length >= rota.length) setTimeout(() => setAsama("sonuc"), 1400);
  };

  const haritaTik = (e: MouseEvent<SVGSVGElement>) => {
    if (asama !== "oyun" || !tiklamaGecerli() || !svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return;
    const s = pt.matrixTransform(m.inverse());
    const g = geriProjekte(s.x, s.y);
    const tik = { lat: g.lat, lon: g.lon };

    if (mod === "bul") {
      if (isaret) return; // cevaplandı, "Sonraki" bekleniyor
      const h = hedefler[i];
      const d = uzaklik(tik, h);
      setIsaret(tik);
      setPuan((p) => p + puanBul(d));
      setGecmis((x) => [...x, { hedef: h, isaret: tik, d }]);
      return;
    }

    const h = rota[yerlesen.length];
    if (!h) return;
    const d = uzaklik(tik, h);
    if (d <= 3) {
      setPuan((p) => p + (hata === 0 ? 10 : 5));
      ileriRota(false);
      setMesaj(`${h.etiket}: doğru. ${yaz(h)}`);
    } else if (hata + 1 >= 2) {
      ileriRota(true);
      setMesaj(`Burası ${yaz(yuvarla(tik))}. Doğru yer ${yaz(h)}; işaretledim.`);
    } else {
      setHata(hata + 1);
      setMesaj(`Burası ${yaz(yuvarla(tik))}. Hedef ${yaz(h)}; bir daha dene.`);
    }
  };

  const sonraki = () => {
    if (i + 1 >= hedefler.length) setAsama("sonuc");
    else {
      setI(i + 1);
      setIsaret(null);
    }
  };

  const grupRengi = (g?: string) => gruplar.find((x) => x.ad === g)?.renk ?? "#0b4f2e";
  const kutuSinif = "rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8";

  /* ---------- Harita ---------- */
  const harita = (sonucta = false) => {
    const latlar: number[] = [];
    const lonlar: number[] = [];
    for (let v = Math.ceil(guney / izgara) * izgara; v <= kuzey; v += izgara) latlar.push(v);
    for (let v = Math.ceil(bati / izgara) * izgara; v <= dogu; v += izgara) lonlar.push(v);
    const sol = projekte(bati, 0).x;
    const sag = projekte(dogu, 0).x;
    const ust = projekte(0, kuzey).y;
    const alt = projekte(0, guney).y;
    const yazi = 10 * px;
    const hedef = mod === "bul" ? hedefler[i] : undefined;
    const yol = yerlesen.map(({ p }) => projekte(p.lon, p.lat));

    return (
      <div className="relative overflow-hidden rounded-[10px] border border-border bg-[#eef4f8]">
        <svg
          ref={svgRef}
          viewBox={`${gorus.x} ${gorus.y} ${gorus.w} ${gorus.h}`}
          data-koordinat-haritasi=""
          className={`block h-auto w-full touch-none select-none ${sonucta ? "" : "cursor-crosshair"}`}
          style={{ aspectRatio: `${temel.w} / ${temel.h}` }}
          {...svgOlaylari}
          onClick={sonucta ? undefined : haritaTik}
        >
          {DUNYA_ULKELERI.alanlar.map((a) => (
            <path key={a.id} d={a.d} className="fill-[#dfe8e1] stroke-white" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
          ))}
          <g className="stroke-[#5b7d6a]" fill="none">
            {latlar.map((v) => {
              const y = projekte(0, v).y;
              return <line key={`p${v}`} x1={sol} x2={sag} y1={y} y2={y} strokeWidth={v === 0 ? 1.6 : 0.7} vectorEffect="non-scaling-stroke" opacity={v === 0 ? 0.9 : 0.55} />;
            })}
            {lonlar.map((v) => {
              const x = projekte(v, 0).x;
              return <line key={`m${v}`} y1={ust} y2={alt} x1={x} x2={x} strokeWidth={v === 0 ? 1.6 : 0.7} vectorEffect="non-scaling-stroke" opacity={v === 0 ? 0.9 : 0.55} />;
            })}
          </g>
          <g className="fill-[#2d4a3b] font-sans font-semibold" style={{ fontSize: yazi }}>
            {latlar.map((v) => (
              <text key={`tp${v}`} x={Math.max(gorus.x, sol) + 3 * px} y={projekte(0, v).y - 3 * px}>
                {enlemYaz(v)}
              </text>
            ))}
            {lonlar.map((v) => (
              <text key={`tm${v}`} x={projekte(v, 0).x + 3 * px} y={Math.max(gorus.y, ust) + 12 * px}>
                {boylamYaz(v)}
              </text>
            ))}
          </g>

          {/* bul modu: hedef ve işaret */}
          {mod === "bul" && isaret && hedef && (() => {
            const a = projekte(hedef.lon, hedef.lat);
            const b = projekte(isaret.lon, isaret.lat);
            const iyi = uzaklik(isaret, hedef) <= 5;
            return (
              <g>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-[#c0392b]" strokeDasharray="4 3" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
                <circle cx={b.x} cy={b.y} r={5 * px} className={iyi ? "fill-[#e8a317]" : "fill-[#c0392b]"} />
                <circle cx={a.x} cy={a.y} r={7 * px} className="fill-primary stroke-white" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              </g>
            );
          })()}

          {/* rota modu */}
          {mod === "rota" && (
            <g>
              {yol.length > 1 && (
                <polyline
                  points={yol.map((q) => `${q.x},${q.y}`).join(" ")}
                  fill="none"
                  className="stroke-[#1d2a24]"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              {yerlesen.map(({ p, kendiliginden }, k) => {
                const q = projekte(p.lon, p.lat);
                return (
                  <g key={k}>
                    <circle
                      cx={q.x}
                      cy={q.y}
                      r={(sonucta ? 7 : 6) * px}
                      fill={sonucta ? grupRengi(p.grup) : kendiliginden ? "#e8a317" : "#0b4f2e"}
                      stroke="white"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                    />
                    {sonucta && (
                      <text x={q.x + 9 * px} y={q.y + 4 * px} className="fill-[#1d2a24] font-sans font-semibold" style={{ fontSize: 10 * px, paintOrder: "stroke", stroke: "white", strokeWidth: 3 * px }}>
                        {p.etiket}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>
        <div className="flex border-t border-border bg-background/95 sm:absolute sm:right-2 sm:bottom-2 sm:flex-col sm:overflow-hidden sm:rounded-md sm:border sm:shadow-sm">
          <button type="button" aria-label="Yakınlaştır" onClick={yakinlas} className="flex h-11 flex-1 items-center justify-center text-xl font-bold hover:bg-primary-soft sm:size-10 sm:flex-none">
            +
          </button>
          <button
            type="button"
            aria-label="Uzaklaştır"
            onClick={uzaklas}
            disabled={yakinlik <= 1.01}
            className="flex h-11 flex-1 items-center justify-center border-l border-border text-xl font-bold hover:bg-primary-soft disabled:opacity-30 sm:size-10 sm:flex-none sm:border-t sm:border-l-0"
          >
            −
          </button>
        </div>
      </div>
    );
  };

  /* ---------- Kurulum ---------- */
  if (asama === "kurulum") {
    return (
      <div className={`flex flex-col gap-8 ${kutuSinif}`}>
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynanır?</h2>
          <p className="m-0 max-w-[40em] leading-relaxed text-[#3d4743]">{yonerge}</p>
          <p className="m-0 text-sm text-muted">
            Enlemler K (kuzey) ve G (güney), boylamlar D (doğu) ve B (batı) ile yazılır. Haritayı + düğmesiyle ya da iki parmakla
            yakınlaştırabilirsin.
          </p>
        </div>
        {mod === "bul" && (
          <div className="flex flex-col gap-3">
            <h2 className="m-0 font-serif text-2xl font-bold">Kaç nokta?</h2>
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
        )}
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

  /* ---------- Sonuç ---------- */
  if (asama === "sonuc") {
    const maks = toplam * 10;
    const oran = maks ? Math.round((puan / maks) * 100) : 0;
    return (
      <div className={`flex flex-col gap-6 ${kutuSinif}`}>
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">{oran >= 85 ? "Koordinatlar senin elinde." : oran >= 50 ? "İyi gidiyor." : "Bir tur daha oyna, oturacak."}</h2>
          <p className="m-0 text-muted">
            Puan: {puan} / {maks}
          </p>
        </div>
        {mod === "rota" && (
          <>
            {harita(true)}
            {gruplar.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {gruplar.map((g) => (
                  <span key={g.ad} className="flex items-center gap-1.5">
                    <span className="inline-block size-3.5 rounded-full border border-white" style={{ background: g.renk }} />
                    {g.ad}
                  </span>
                ))}
              </div>
            )}
            {sonNot && <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[15px]">{sonNot}</p>}
          </>
        )}
        {mod === "bul" && gecmis.some((g) => g.d > 5) && (
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 text-base font-semibold">Uzak düştüklerin</h3>
            {gecmis
              .filter((g) => g.d > 5)
              .map((g, k) => (
                <span key={k} className="rounded-md bg-[#fbefd6] px-3 py-2 text-[15px]">
                  Hedef <strong>{yaz(g.hedef)}</strong> · senin işaretin {yaz(yuvarla(g.isaret))} ({Math.round(g.d)}° uzakta)
                </span>
              ))}
          </div>
        )}
        <OgretmenCagrisi oran={oran} />
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={baslat} className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
            Tekrar oyna
          </button>
          <button type="button" onClick={() => setAsama("kurulum")} className="rounded-md border border-border px-6 py-3 font-semibold hover:border-primary">
            Ayarları değiştir
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Oyun ---------- */
  const hedef: (Isaret & { etiket?: string }) | undefined = mod === "bul" ? hedefler[i] : rota[yerlesen.length];
  const sonDurum = mod === "bul" && isaret && hedef ? uzaklik(isaret, hedef) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        <div className="flex flex-col" aria-live="polite">
          <span className="text-sm opacity-75">
            {mod === "bul" ? `Nokta ${i + 1}/${toplam}` : `${yerlesen.length}/${toplam} gün işaretlendi`}
          </span>
          <span className="font-serif text-3xl font-bold" data-hedef-koordinat={hedef ? `${hedef.lat},${hedef.lon}` : ""}>
            {hedef ? (hedef.etiket ? `${hedef.etiket}: ${yaz(hedef)}` : yaz(hedef)) : "Tamamlandı"}
          </span>
          <span className="min-h-5 text-sm text-[#ffe2a6]">
            {mod === "bul" && sonDurum !== null && isaret
              ? `Senin işaretin ${yaz(yuvarla(isaret))} · ${Math.round(sonDurum)}° uzakta · +${puanBul(sonDurum)}`
              : mesaj}
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex flex-col items-end">
            <span className="opacity-75">Puan</span>
            <span className="font-serif text-xl font-bold">{puan}</span>
          </div>
          {mod === "bul" && isaret && (
            <button type="button" onClick={sonraki} className="rounded-md bg-white px-5 py-2 font-semibold text-primary hover:bg-white/90">
              {i + 1 >= toplam ? "Sonucu gör" : "Sonraki →"}
            </button>
          )}
          <button type="button" onClick={() => setAsama("sonuc")} className="rounded-md border border-white/40 px-4 py-2 font-semibold hover:bg-white/10">
            Bitir
          </button>
        </div>
      </div>

      {harita()}

      {mod === "rota" && (
        <div className="overflow-x-auto rounded-[10px] border border-border bg-background/85">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-primary-soft text-left">
                <th className="px-3 py-2">Gün</th>
                <th className="px-3 py-2">Paralel</th>
                <th className="px-3 py-2">Meridyen</th>
                {gruplar.length > 0 && <th className="px-3 py-2">Kategori</th>}
              </tr>
            </thead>
            <tbody>
              {rota.map((p, k) => (
                <tr
                  key={k}
                  className={`border-t border-border ${k === yerlesen.length ? "bg-[#fdf6e6] font-semibold" : k < yerlesen.length ? "text-muted" : ""}`}
                >
                  <td className="px-3 py-1.5">{p.etiket}</td>
                  <td className="px-3 py-1.5">{enlemYaz(p.lat)}</td>
                  <td className="px-3 py-1.5">{boylamYaz(p.lon)}</td>
                  {gruplar.length > 0 && <td className="px-3 py-1.5">{p.grup}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function yuvarla(p: Isaret): Isaret {
  return { lat: Math.round(p.lat), lon: Math.round(p.lon) };
}
