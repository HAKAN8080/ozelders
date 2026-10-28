"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { HaritaAlan, HaritaVerisi } from "@/lib/games/harita-tipleri";

type Mod = "isim" | "kod" | "kesfet";
type Asama = "kurulum" | "oyun" | "sonuc";
type AlanDurum = "bulundu" | "kacti";

export type HaritaOyunuAyarlari = {
  veri: HaritaVerisi;
  /** "Tüm Türkiye", "Tüm Dünya" */
  tumEtiketi: string;
  /** Filtre başlığı: "Hangi bölge?", "Hangi kıta?" */
  grupSorusu: string;
  /** İpucu ve Keşfet satırında grubun yazılışı: "Marmara Bölgesi", "Avrupa" */
  grupYaz: (grup: string) => string;
  /** Belirtme halinde alan adı: "ili", "ülkeyi" ("İli bul", "Bir ülkeyi seç") */
  alanAdi: string;
  /** İkincil kodla oynama modu (ör. plaka). */
  kodModu?: {
    baslik: string;
    aciklama: string;
    soru: (kod: string) => string;
  };
  /** Keşfet modunda haritaya yazılan kısa etiket (ör. plaka). Yoksa yazılmaz. */
  kesfetEtiketi?: (alan: HaritaAlan) => string;
  /** Tur uzunluğu seçenekleri; 0 = tümü. */
  turSecenekleri?: number[];
  /** Haritada kalan isimlerin yazı boyutu (tam harita ölçeğinde, px). */
  etiketBoyutu?: number;
};

/** İlk denemede 10, ikincide 5, üçüncüde 2 puan. Üç hatada alan kaçırılmış sayılır. */
const PUAN = [10, 5, 2];
const MAKS_HATA = 3;

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sureYaz(sn: number) {
  return `${Math.floor(sn / 60)}:${String(sn % 60).padStart(2, "0")}`;
}

function gruptaMi(alan: HaritaAlan, kapsam: string) {
  return kapsam === "tum" || alan.grup === kapsam || (alan.ekGruplar?.includes(kapsam) ?? false);
}

function oynanir(alan: HaritaAlan) {
  return alan.oynanir !== false;
}

export function HaritaOyunu({
  veri,
  tumEtiketi,
  grupSorusu,
  grupYaz,
  alanAdi,
  kodModu,
  kesfetEtiketi,
  turSecenekleri = [10, 20, 0],
  etiketBoyutu = 8.5,
}: HaritaOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [mod, setMod] = useState<Mod>("isim");
  const [kapsam, setKapsam] = useState<string>("tum");
  const [turUzunlugu, setTurUzunlugu] = useState<number>(turSecenekleri[0] ?? 0);

  const [sira, setSira] = useState<HaritaAlan[]>([]);
  const [adim, setAdim] = useState(0);
  const [durum, setDurum] = useState<Record<string, AlanDurum>>({});
  const [hataSayisi, setHataSayisi] = useState(0);
  const [puan, setPuan] = useState(0);
  const [toplamHata, setToplamHata] = useState(0);
  const [ipucu, setIpucu] = useState(false);
  const [sure, setSure] = useState(0);
  const [yanlis, setYanlis] = useState<HaritaAlan | null>(null);
  const [goster, setGoster] = useState<string | null>(null);
  const [uzerinde, setUzerinde] = useState<HaritaAlan | null>(null);
  const kilit = useRef(false);

  const modlar = useMemo(() => {
    const m: { id: Mod; baslik: string; aciklama: string }[] = [
      { id: "isim", baslik: `${alanAdi[0].toLocaleUpperCase("tr")}${alanAdi.slice(1)} bul`, aciklama: `Adı verilen ${alanAdi} haritada bul.` },
    ];
    if (kodModu) m.push({ id: "kod", baslik: kodModu.baslik, aciklama: kodModu.aciklama });
    m.push({ id: "kesfet", baslik: "Keşfet", aciklama: "Süre yok. Dokun ya da üstüne gel, adını gör." });
    return m;
  }, [alanAdi, kodModu]);

  const havuz = useMemo(() => veri.alanlar.filter((a) => oynanir(a) && gruptaMi(a, kapsam)), [veri, kapsam]);
  const hedef = asama === "oyun" ? sira[adim] : undefined;

  /* Görünür kutu: grup seçilince ona yakınlaş, en-boy oranını koru. */
  const kutu = useMemo(() => {
    const { genislik: W, yukseklik: H } = veri;
    if (kapsam === "tum") return { x: 0, y: 0, w: W, h: H };
    let [x0, y0, x1, y1] = veri.grupKutulari?.[kapsam] ?? [Infinity, Infinity, -Infinity, -Infinity];
    if (!veri.grupKutulari?.[kapsam]) {
      for (const a of veri.alanlar) {
        if (!gruptaMi(a, kapsam)) continue;
        x0 = Math.min(x0, a.bbox[0]);
        y0 = Math.min(y0, a.bbox[1]);
        x1 = Math.max(x1, a.bbox[2]);
        y1 = Math.max(y1, a.bbox[3]);
      }
    }
    const pad = Math.max(x1 - x0, y1 - y0) * 0.06;
    x0 -= pad;
    y0 -= pad;
    x1 += pad;
    y1 += pad;
    const oran = W / H;
    let w = x1 - x0;
    let h = y1 - y0;
    if (w / h > oran) {
      const yeniH = w / oran;
      y0 -= (yeniH - h) / 2;
      h = yeniH;
    } else {
      const yeniW = h * oran;
      x0 -= (yeniW - w) / 2;
      w = yeniW;
    }
    return { x: x0, y: y0, w, h };
  }, [veri, kapsam]);
  const olcek = kutu.w / veri.genislik; // 1 = tam harita

  useEffect(() => {
    if (asama !== "oyun" || mod === "kesfet") return;
    const t = setInterval(() => setSure((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [asama, mod]);

  useEffect(() => {
    if (!yanlis) return;
    const t = setTimeout(() => setYanlis(null), 1300);
    return () => clearTimeout(t);
  }, [yanlis]);

  const baslat = useCallback(() => {
    const karisik = karistir(havuz);
    setSira(turUzunlugu > 0 ? karisik.slice(0, turUzunlugu) : karisik);
    setAdim(0);
    setDurum({});
    setHataSayisi(0);
    setPuan(0);
    setToplamHata(0);
    setIpucu(false);
    setSure(0);
    setYanlis(null);
    setGoster(null);
    setUzerinde(null);
    kilit.current = false;
    setAsama("oyun");
  }, [havuz, turUzunlugu]);

  const sonraki = useCallback(() => {
    setHataSayisi(0);
    setIpucu(false);
    if (adim + 1 >= sira.length) setAsama("sonuc");
    else setAdim(adim + 1);
  }, [adim, sira.length]);

  const tikla = (alan: HaritaAlan) => {
    if (mod === "kesfet") {
      setUzerinde(alan);
      return;
    }
    if (asama !== "oyun" || !hedef || kilit.current || durum[alan.id]) return;
    if (alan.id === hedef.id) {
      setDurum((d) => ({ ...d, [alan.id]: "bulundu" }));
      setPuan((p) => p + PUAN[hataSayisi]);
      sonraki();
      return;
    }
    setYanlis(alan);
    setToplamHata((h) => h + 1);
    const yeni = hataSayisi + 1;
    if (yeni >= MAKS_HATA) {
      kilit.current = true;
      setDurum((d) => ({ ...d, [hedef.id]: "kacti" }));
      setGoster(hedef.id);
      setTimeout(() => {
        setGoster(null);
        kilit.current = false;
        sonraki();
      }, 1600);
    } else {
      setHataSayisi(yeni);
    }
  };

  const tiklanir = (a: HaritaAlan) => oynanir(a) && gruptaMi(a, kapsam);

  function renk(a: HaritaAlan) {
    if (!tiklanir(a)) return "fill-[#e9ebe9] stroke-[#d6dad7]";
    if (goster === a.id) return "fill-[#e8a317] stroke-white animate-pulse";
    if (yanlis?.id === a.id) return "fill-[#c0392b] stroke-white";
    const d = durum[a.id];
    if (d === "bulundu") return "fill-primary stroke-white";
    if (d === "kacti") return "fill-[#e8a317] stroke-white";
    if (ipucu && hedef && !gruptaMi(a, hedef.grup)) return "fill-[#f1f3f1] stroke-[#dde2de]";
    if (mod === "kesfet" && uzerinde?.id === a.id) return "fill-primary stroke-white";
    return "fill-[#dfe9e3] stroke-white hover:fill-[#b9d3c4]";
  }

  const sorulan = sira.length;
  const bulunan = Object.values(durum).filter((d) => d === "bulundu").length;
  const kacan = sira.filter((a) => durum[a.id] === "kacti");

  /* ---------- Kurulum ---------- */
  if (asama === "kurulum") {
    const secenekDugme = (secili: boolean) =>
      `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        secili ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"
      }`;
    return (
      <div className="flex flex-col gap-8 rounded-[10px] border border-border bg-background p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynamak istersin?</h2>
          <div className={`grid gap-3 ${modlar.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {modlar.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMod(m.id)}
                className={`flex flex-col gap-1 rounded-md border-2 p-4 text-left transition-colors ${
                  mod === m.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"
                }`}
              >
                <span className="font-semibold">{m.baslik}</span>
                <span className="text-sm text-muted">{m.aciklama}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-serif text-2xl font-bold">{grupSorusu}</h2>
          <div className="flex flex-wrap gap-2">
            {["tum", ...veri.gruplar].map((k) => {
              const adet = veri.alanlar.filter((a) => oynanir(a) && gruptaMi(a, k)).length;
              return (
                <button key={k} type="button" onClick={() => setKapsam(k)} className={secenekDugme(kapsam === k)}>
                  {k === "tum" ? tumEtiketi : k} <span className="opacity-70">· {adet}</span>
                </button>
              );
            })}
          </div>
        </div>

        {mod !== "kesfet" && (
          <div className="flex flex-col gap-3">
            <h2 className="m-0 font-serif text-2xl font-bold">Kaç soru?</h2>
            <div className="flex flex-wrap gap-2">
              {turSecenekleri.map((n) => {
                const gercek = n === 0 || n >= havuz.length ? havuz.length : n;
                if (n !== 0 && n >= havuz.length) return null;
                return (
                  <button key={n} type="button" onClick={() => setTurUzunlugu(n)} className={secenekDugme(turUzunlugu === n)}>
                    {n === 0 ? `Hepsi (${gercek})` : n}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={baslat}
            className="rounded-md bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            {mod === "kesfet" ? "Haritayı aç" : "Oyunu başlat"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Sonuç ---------- */
  if (asama === "sonuc") {
    const maks = sorulan * PUAN[0];
    const oran = maks ? Math.round((puan / maks) * 100) : 0;
    const yorum =
      oran >= 90
        ? "Harita senin elinde."
        : oran >= 70
          ? "Çok iyi, birkaç tane kaldı."
          : oran >= 40
            ? "Fena değil, bir tur daha."
            : "Önce Keşfet moduyla bir gez, sonra tekrar dene.";
    return (
      <div className="flex flex-col gap-6 rounded-[10px] border border-border bg-background p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">{yorum}</h2>
        </div>
        <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Puan", `${puan} / ${maks}`],
            ["Bulunan", `${bulunan} / ${sorulan}`],
            ["Süre", sureYaz(sure)],
            ["Hatalı tık", String(toplamHata)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md bg-primary-soft p-4">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="m-0 font-serif text-2xl font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        {kacan.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-base font-semibold">Tekrar bakman gerekenler</h3>
            <div className="flex flex-wrap gap-2">
              {kacan.map((a) => (
                <span key={a.id} className="rounded-full bg-[#fbefd6] px-3 py-1 text-sm">
                  {a.kod ? `${a.kod} · ` : ""}
                  {a.ad}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={baslat}
            className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Tekrar oyna
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

  /* ---------- Oyun / Keşfet ---------- */
  const soru = hedef ? (mod === "kod" && kodModu && hedef.kod ? kodModu.soru(hedef.kod) : hedef.ad) : "";
  // Ekranda çok küçük kalan alanlar için tıklanabilir nokta (yaklaşık 7 px altı)
  const noktaEsigi = 7 * olcek;
  const noktaR = 4.5 * olcek;

  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        {mod === "kesfet" ? (
          <div className="flex flex-col">
            <span className="text-sm opacity-75">Keşfet</span>
            <span className="font-serif text-2xl font-bold">
              {uzerinde ? `${uzerinde.kod ? `${uzerinde.kod} · ` : ""}${uzerinde.ad}` : `Bir ${alanAdi} seç`}
            </span>
            <span className="min-h-5 text-sm opacity-75">{uzerinde ? grupYaz(uzerinde.grup) : ""}</span>
          </div>
        ) : (
          <div className="flex flex-col" aria-live="polite">
            <span className="text-sm opacity-75">
              Bul · {adim + 1}/{sorulan}
              {hataSayisi > 0 && ` · ${MAKS_HATA - hataSayisi} hakkın kaldı`}
            </span>
            <span className="font-serif text-3xl font-bold">{soru}</span>
            <span className="min-h-5 text-sm">
              {yanlis ? (
                <span className="text-[#ffd5cf]">Bu {yanlis.ad}.</span>
              ) : goster !== null && hedef ? (
                <span className="text-[#ffe2a6]">Burası {hedef.ad}.</span>
              ) : ipucu && hedef ? (
                <span className="opacity-85">İpucu: {grupYaz(hedef.grup)}</span>
              ) : null}
            </span>
          </div>
        )}
        <div className="flex items-center gap-5 text-sm">
          {mod !== "kesfet" && (
            <>
              <div className="flex flex-col items-end">
                <span className="opacity-75">Puan</span>
                <span className="font-serif text-xl font-bold">{puan}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="opacity-75">Süre</span>
                <span className="font-serif text-xl font-bold tabular-nums">{sureYaz(sure)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIpucu(true)}
                disabled={ipucu}
                className="rounded-md bg-white/15 px-4 py-2 font-semibold hover:bg-white/25 disabled:opacity-50"
              >
                İpucu
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setAsama(mod === "kesfet" ? "kurulum" : "sonuc")}
            className="rounded-md border border-white/40 px-4 py-2 font-semibold hover:bg-white/10"
          >
            {mod === "kesfet" ? "Kapat" : "Bitir"}
          </button>
        </div>
      </div>

      {mod !== "kesfet" && (
        <div className="h-1.5 overflow-hidden rounded-full bg-[#dfe9e3]">
          <div
            className="h-full bg-primary transition-[width] duration-300"
            style={{ width: `${(adim / Math.max(sorulan, 1)) * 100}%` }}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-[10px] border border-border bg-[#eef4f8] p-2 sm:p-4">
        <svg
          viewBox={`${kutu.x} ${kutu.y} ${kutu.w} ${kutu.h}`}
          role="img"
          aria-label={`${tumEtiketi} haritası`}
          data-harita=""
          className="block h-auto w-full min-w-[640px] select-none"
          onMouseLeave={() => mod === "kesfet" && setUzerinde(null)}
        >
          {veri.alanlar.map((a) => {
            const t = tiklanir(a);
            return (
              <path
                key={a.id}
                data-id={a.id}
                d={a.d}
                strokeWidth={0.8}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                className={`${renk(a)} transition-colors duration-150 ${t ? "cursor-pointer" : ""}`}
                onClick={() => t && tikla(a)}
                onMouseEnter={() => mod === "kesfet" && t && setUzerinde(a)}
              />
            );
          })}
          {veri.alanlar.map((a) => {
            if (!tiklanir(a)) return null;
            const boyut = Math.max(a.bbox[2] - a.bbox[0], a.bbox[3] - a.bbox[1]);
            if (boyut >= noktaEsigi) return null;
            return (
              <circle
                key={`n${a.id}`}
                data-id={a.id}
                cx={a.cx}
                cy={a.cy}
                r={noktaR}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                className={`${renk(a)} cursor-pointer transition-colors duration-150`}
                onClick={() => tikla(a)}
                onMouseEnter={() => mod === "kesfet" && setUzerinde(a)}
              />
            );
          })}
          {veri.alanlar.map((a) => {
            if (!tiklanir(a)) return null;
            const yazi = mod === "kesfet" ? (kesfetEtiketi?.(a) ?? null) : durum[a.id] ? a.ad : null;
            if (!yazi) return null;
            const koyu = durum[a.id] === "bulundu" || (mod === "kesfet" && uzerinde?.id === a.id);
            return (
              <text
                key={`t${a.id}`}
                x={a.cx}
                y={a.cy}
                textAnchor="middle"
                dominantBaseline="central"
                className={`pointer-events-none font-sans font-semibold ${koyu ? "fill-white" : "fill-[#1d2a24]"}`}
                style={{
                  fontSize: (mod === "kesfet" ? etiketBoyutu + 1.5 : etiketBoyutu) * olcek,
                  paintOrder: "stroke",
                  stroke: koyu ? "rgb(11 79 46 / 0.6)" : "rgb(255 255 255 / 0.7)",
                  strokeWidth: 2 * olcek,
                }}
              >
                {yazi}
              </text>
            );
          })}
        </svg>
      </div>
      <p className="m-0 text-sm text-muted">
        Çok küçük yerleri yuvarlak işaretinden seçebilirsin. Bir bölge seçersen harita oraya yakınlaşır.
      </p>
    </div>
  );
}
