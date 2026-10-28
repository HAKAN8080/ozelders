"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { HARITA_GENISLIK, HARITA_YUKSEKLIK, ILLER, type Bolge, type Il } from "@/lib/games/tr-iller";

type Mod = "isim" | "plaka" | "kesfet";
type Kapsam = "tum" | Bolge;
type Asama = "kurulum" | "oyun" | "sonuc";

const BOLGELER: Bolge[] = [
  "Marmara",
  "Ege",
  "Akdeniz",
  "İç Anadolu",
  "Karadeniz",
  "Doğu Anadolu",
  "Güneydoğu Anadolu",
];

/** İlk denemede bulunca 10, ikincide 5, üçüncüde 2 puan. Üç hatada il kaçırılmış sayılır. */
const PUAN = [10, 5, 2];
const MAKS_HATA = 3;

const MODLAR: { id: Mod; baslik: string; aciklama: string }[] = [
  { id: "isim", baslik: "İli bul", aciklama: "Adı verilen ili haritada bul." },
  { id: "plaka", baslik: "Plakadan bul", aciklama: "Plaka kodu verilen ili bul." },
  { id: "kesfet", baslik: "Keşfet", aciklama: "Süre yok. Üstüne gel, adını ve plakasını gör." },
];

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sureYaz(sn: number) {
  const m = Math.floor(sn / 60);
  const s = sn % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function plakaYaz(kod: number) {
  return String(kod).padStart(2, "0");
}

type IlDurum = "bulundu" | "kacti";

export function IllerOyunu() {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [mod, setMod] = useState<Mod>("isim");
  const [kapsam, setKapsam] = useState<Kapsam>("tum");

  const [sira, setSira] = useState<Il[]>([]);
  const [adim, setAdim] = useState(0);
  const [durum, setDurum] = useState<Record<number, IlDurum>>({});
  const [hataSayisi, setHataSayisi] = useState(0); // mevcut il için
  const [puan, setPuan] = useState(0);
  const [toplamHata, setToplamHata] = useState(0);
  const [ipucu, setIpucu] = useState(false);
  const [sure, setSure] = useState(0);
  const [yanlisIl, setYanlisIl] = useState<Il | null>(null);
  const [goster, setGoster] = useState<number | null>(null); // kaçırılan ilin yanıp sönmesi
  const [uzerinde, setUzerinde] = useState<Il | null>(null);
  const kilit = useRef(false);

  const aktifIller = useMemo(
    () => (kapsam === "tum" ? ILLER : ILLER.filter((il) => il.bolge === kapsam)),
    [kapsam],
  );
  const hedef = asama === "oyun" ? sira[adim] : undefined;

  useEffect(() => {
    if (asama !== "oyun" || mod === "kesfet") return;
    const t = setInterval(() => setSure((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [asama, mod]);

  useEffect(() => {
    if (!yanlisIl) return;
    const t = setTimeout(() => setYanlisIl(null), 1300);
    return () => clearTimeout(t);
  }, [yanlisIl]);

  const baslat = useCallback(() => {
    setSira(karistir(aktifIller));
    setAdim(0);
    setDurum({});
    setHataSayisi(0);
    setPuan(0);
    setToplamHata(0);
    setIpucu(false);
    setSure(0);
    setYanlisIl(null);
    setGoster(null);
    kilit.current = false;
    setAsama("oyun");
  }, [aktifIller]);

  const sonraki = useCallback(() => {
    setHataSayisi(0);
    setIpucu(false);
    if (adim + 1 >= sira.length) setAsama("sonuc");
    else setAdim(adim + 1);
  }, [adim, sira.length]);

  const tikla = (il: Il) => {
    if (asama !== "oyun" || mod === "kesfet" || !hedef || kilit.current) return;
    if (durum[il.kod]) return;
    if (il.kod === hedef.kod) {
      setDurum((d) => ({ ...d, [il.kod]: "bulundu" }));
      setPuan((p) => p + PUAN[hataSayisi]);
      sonraki();
      return;
    }
    setYanlisIl(il);
    setToplamHata((h) => h + 1);
    const yeni = hataSayisi + 1;
    if (yeni >= MAKS_HATA) {
      kilit.current = true;
      setDurum((d) => ({ ...d, [hedef.kod]: "kacti" }));
      setGoster(hedef.kod);
      setTimeout(() => {
        setGoster(null);
        kilit.current = false;
        sonraki();
      }, 1600);
    } else {
      setHataSayisi(yeni);
    }
  };

  const ipucuAl = () => {
    if (ipucu || !hedef) return;
    setIpucu(true);
  };

  const bulunan = Object.values(durum).filter((d) => d === "bulundu").length;
  const kacan = sira.filter((il) => durum[il.kod] === "kacti");
  const maksPuan = sira.length * PUAN[0];

  function ilRengi(il: Il) {
    const kapsamDisi = kapsam !== "tum" && il.bolge !== kapsam;
    if (kapsamDisi) return "fill-[#eceeec] stroke-[#d9ddda]";
    if (goster === il.kod) return "fill-[#e8a317] stroke-white animate-pulse";
    if (yanlisIl?.kod === il.kod) return "fill-[#c0392b] stroke-white";
    const d = durum[il.kod];
    if (d === "bulundu") return "fill-primary stroke-white";
    if (d === "kacti") return "fill-[#e8a317] stroke-white";
    if (ipucu && hedef && il.bolge !== hedef.bolge) return "fill-[#f1f3f1] stroke-[#dde2de]";
    if (mod === "kesfet" && uzerinde?.kod === il.kod) return "fill-primary stroke-white";
    return "fill-[#dfe9e3] stroke-white hover:fill-[#b9d3c4]";
  }

  /* ---------- Kurulum ---------- */
  if (asama === "kurulum") {
    return (
      <div className="flex flex-col gap-8 rounded-[10px] border border-border bg-background p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynamak istersin?</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {MODLAR.map((m) => (
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
          <h2 className="m-0 font-serif text-2xl font-bold">Hangi bölge?</h2>
          <div className="flex flex-wrap gap-2">
            {(["tum", ...BOLGELER] as Kapsam[]).map((k) => {
              const adet = k === "tum" ? 81 : ILLER.filter((il) => il.bolge === k).length;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKapsam(k)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    kapsam === k
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  {k === "tum" ? "Tüm Türkiye" : k} <span className="opacity-70">· {adet}</span>
                </button>
              );
            })}
          </div>
        </div>

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
    const oran = maksPuan ? Math.round((puan / maksPuan) * 100) : 0;
    const yorum =
      oran >= 90 ? "Harita senin elinde." : oran >= 70 ? "Çok iyi, birkaç il kaldı." : oran >= 40 ? "Fena değil, bir tur daha." : "Önce Keşfet moduyla bir gez, sonra tekrar dene.";
    return (
      <div className="flex flex-col gap-6 rounded-[10px] border border-border bg-background p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">{yorum}</h2>
        </div>
        <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Puan", `${puan} / ${maksPuan}`],
            ["Bulunan", `${bulunan} / ${sira.length}`],
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
            <h3 className="m-0 text-base font-semibold">Tekrar bakman gereken iller</h3>
            <div className="flex flex-wrap gap-2">
              {kacan.map((il) => (
                <span key={il.kod} className="rounded-full bg-[#fbefd6] px-3 py-1 text-sm">
                  {plakaYaz(il.kod)} · {il.ad}
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
  const soru = hedef ? (mod === "plaka" ? `${plakaYaz(hedef.kod)} plakalı il` : hedef.ad) : "";
  const viewBox = `0 0 ${HARITA_GENISLIK} ${HARITA_YUKSEKLIK}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        {mod === "kesfet" ? (
          <div className="flex flex-col">
            <span className="text-sm opacity-75">Keşfet</span>
            <span className="font-serif text-2xl font-bold">
              {uzerinde ? `${plakaYaz(uzerinde.kod)} · ${uzerinde.ad}` : "Bir ilin üstüne gel"}
            </span>
            {uzerinde && <span className="text-sm opacity-75">{uzerinde.bolge} Bölgesi</span>}
          </div>
        ) : (
          <div className="flex flex-col" aria-live="polite">
            <span className="text-sm opacity-75">
              Bul · {adim + 1}/{sira.length}
              {hataSayisi > 0 && ` · ${MAKS_HATA - hataSayisi} hakkın kaldı`}
            </span>
            <span className="font-serif text-3xl font-bold">{soru}</span>
            <span className="min-h-5 text-sm">
              {yanlisIl ? (
                <span className="text-[#ffd5cf]">Bu {yanlisIl.ad}.</span>
              ) : goster !== null && hedef ? (
                <span className="text-[#ffe2a6]">Burası {hedef.ad}.</span>
              ) : ipucu && hedef ? (
                <span className="opacity-85">İpucu: {hedef.bolge} Bölgesi</span>
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
                onClick={ipucuAl}
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
            style={{ width: `${(adim / Math.max(sira.length, 1)) * 100}%` }}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-[10px] border border-border bg-[#f4f8fb] p-2 sm:p-4">
        <svg
          viewBox={viewBox}
          role="img"
          aria-label="Türkiye il haritası"
          className="block h-auto w-full min-w-[640px] select-none"
          onMouseLeave={() => setUzerinde(null)}
        >
          {ILLER.map((il) => {
            const kapsamDisi = kapsam !== "tum" && il.bolge !== kapsam;
            return (
              <path
                key={il.kod}
                d={il.d}
                strokeWidth={0.8}
                strokeLinejoin="round"
                className={`${ilRengi(il)} transition-colors duration-150 ${kapsamDisi ? "" : "cursor-pointer"}`}
                onClick={() => !kapsamDisi && tikla(il)}
                onMouseEnter={() => mod === "kesfet" && !kapsamDisi && setUzerinde(il)}
              >
                {mod === "kesfet" && <title>{`${plakaYaz(il.kod)} ${il.ad}`}</title>}
              </path>
            );
          })}
          {/* Bulunan illerin adları haritada kalır; Keşfet modunda plaka kodları görünür */}
          {ILLER.map((il) => {
            const kapsamDisi = kapsam !== "tum" && il.bolge !== kapsam;
            if (kapsamDisi) return null;
            const yazi = mod === "kesfet" ? plakaYaz(il.kod) : durum[il.kod] ? il.ad : null;
            if (!yazi) return null;
            const koyu = durum[il.kod] === "bulundu" || (mod === "kesfet" && uzerinde?.kod === il.kod);
            return (
              <text
                key={`t${il.kod}`}
                x={il.cx}
                y={il.cy}
                textAnchor="middle"
                dominantBaseline="central"
                className={`pointer-events-none font-sans font-semibold ${koyu ? "fill-white" : "fill-[#1d2a24]"}`}
                style={{ fontSize: mod === "kesfet" ? 10 : 8.5 }}
              >
                {yazi}
              </text>
            );
          })}
        </svg>
      </div>
      <p className="m-0 text-sm text-muted">
        Telefonda harita yana kayar. Küçük illerde (Yalova, Kilis, Bartın gibi) ekranı yakınlaştırabilirsin.
      </p>
    </div>
  );
}
