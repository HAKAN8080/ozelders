"use client";

import { useCallback, useEffect, useState, type DragEvent } from "react";

export type KategoriOgesi = { id: string; ad: string; kategori: string };

type KartDurum = "dogru" | "kacti";
type Asama = "kurulum" | "oyun" | "sonuc";

/** İlk denemede 10, ikincide 5 puan. İki hatada kart doğru kutusuna kendiliğinden gider. */
const PUAN = [10, 5];
const MAKS_HATA = 2;

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Her kategoriden mümkün olduğunca eşit sayıda öğe seçer. */
function dengeliSec(ogeler: KategoriOgesi[], kategoriler: string[], adet: number) {
  const kovalar = kategoriler.map((k) => karistir(ogeler.filter((o) => o.kategori === k)));
  const secilen: KategoriOgesi[] = [];
  for (let tur = 0; secilen.length < adet; tur++) {
    let eklendi = false;
    for (const kova of karistir(kovalar)) {
      if (secilen.length >= adet) break;
      if (kova[tur]) {
        secilen.push(kova[tur]);
        eklendi = true;
      }
    }
    if (!eklendi) break;
  }
  return karistir(secilen);
}

export type KategoriOyunuAyarlari = {
  kategoriler: string[];
  ogeler: KategoriOgesi[];
  /** Kurulum ekranındaki kısa yönerge. */
  yonerge: string;
  turSecenekleri?: number[];
  /** Kategori kutusunun başlığı (ör. "Marmara" → "Marmara Bölgesi"). */
  kategoriYaz?: (k: string) => string;
};

export function KategoriOyunu({
  kategoriler,
  ogeler,
  yonerge,
  turSecenekleri = [14, 21, 28],
  kategoriYaz = (k) => k,
}: KategoriOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [adet, setAdet] = useState(turSecenekleri[0]);
  const [kartlar, setKartlar] = useState<KategoriOgesi[]>([]);
  const [durum, setDurum] = useState<Record<string, KartDurum>>({});
  const [hata, setHata] = useState<Record<string, number>>({});
  const [secili, setSecili] = useState<string | null>(null);
  const [sallanan, setSallanan] = useState<string | null>(null);
  const [mesaj, setMesaj] = useState<string>("");
  const [puan, setPuan] = useState(0);
  const [sure, setSure] = useState(0);
  const [hedefKutu, setHedefKutu] = useState<string | null>(null);

  const baslat = useCallback(() => {
    setKartlar(dengeliSec(ogeler, kategoriler, adet));
    setDurum({});
    setHata({});
    setSecili(null);
    setSallanan(null);
    setMesaj("");
    setPuan(0);
    setSure(0);
    setAsama("oyun");
  }, [ogeler, kategoriler, adet]);

  useEffect(() => {
    if (asama !== "oyun") return;
    const t = setInterval(() => setSure((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [asama]);

  useEffect(() => {
    if (!sallanan) return;
    const t = setTimeout(() => setSallanan(null), 500);
    return () => clearTimeout(t);
  }, [sallanan]);

  const yerlestir = (kartId: string, kategori: string) => {
    const kart = kartlar.find((k) => k.id === kartId);
    if (!kart || durum[kart.id]) return;
    const yeniDurum = { ...durum };
    if (kart.kategori === kategori) {
      yeniDurum[kart.id] = "dogru";
      setPuan((p) => p + PUAN[hata[kart.id] ?? 0]);
      setMesaj(`Doğru: ${kart.ad} → ${kategoriYaz(kategori)}`);
    } else {
      const h = (hata[kart.id] ?? 0) + 1;
      setHata((x) => ({ ...x, [kart.id]: h }));
      setSallanan(kart.id);
      if (h >= MAKS_HATA) {
        yeniDurum[kart.id] = "kacti";
        setMesaj(`${kart.ad}, ${kategoriYaz(kart.kategori)} içinde.`);
      } else {
        setMesaj(`${kart.ad} ${kategoriYaz(kategori)} içinde değil. Bir hakkın daha var.`);
        setSecili(null);
        return;
      }
    }
    setDurum(yeniDurum);
    setSecili(null);
    if (kartlar.every((k) => yeniDurum[k.id])) setTimeout(() => setAsama("sonuc"), 700);
  };

  const kutuyaTikla = (kategori: string) => {
    if (secili) yerlestir(secili, kategori);
  };

  const surukle = (e: DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setSecili(id);
  };
  const birak = (e: DragEvent, kategori: string) => {
    e.preventDefault();
    setHedefKutu(null);
    const id = e.dataTransfer.getData("text/plain");
    if (id) yerlestir(id, kategori);
  };

  const sureYaz = `${Math.floor(sure / 60)}:${String(sure % 60).padStart(2, "0")}`;
  const kalan = kartlar.filter((k) => !durum[k.id]);
  const dogruSayi = kartlar.filter((k) => durum[k.id] === "dogru").length;
  const toplamHata = Object.values(hata).reduce((a, b) => a + b, 0);

  if (asama === "kurulum") {
    return (
      <div className="flex flex-col gap-8 rounded-[10px] border border-border bg-background p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynanır?</h2>
          <p className="m-0 max-w-[40em] leading-relaxed text-[#3d4743]">{yonerge}</p>
          <p className="m-0 text-sm text-muted">
            Bilgisayarda kartı sürükleyip kutuya bırak. Telefonda önce karta, sonra kutuya dokun. İlk denemede 10, ikincide 5
            puan.
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
                {n}
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
    const maks = kartlar.length * PUAN[0];
    const oran = maks ? Math.round((puan / maks) * 100) : 0;
    const kacan = kartlar.filter((k) => durum[k.id] === "kacti");
    return (
      <div className="flex flex-col gap-6 rounded-[10px] border border-border bg-background p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">
            {oran >= 90 ? "Hepsi yerli yerinde." : oran >= 60 ? "İyi gidiyor, bir tur daha." : "Bir tur daha oyna, oturacak."}
          </h2>
        </div>
        <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Puan", `${puan} / ${maks}`],
            ["İlk seferde", `${kartlar.filter((k) => durum[k.id] === "dogru" && !hata[k.id]).length} / ${kartlar.length}`],
            ["Süre", sureYaz],
            ["Hata", String(toplamHata)],
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
              {kacan.map((k) => (
                <span key={k.id} className="rounded-full bg-[#fbefd6] px-3 py-1 text-sm">
                  {k.ad} → {kategoriYaz(k.kategori)}
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
          <span className="text-sm opacity-75">
            Yerleştirilen {kartlar.length - kalan.length}/{kartlar.length}
          </span>
          <span className="min-h-6 font-serif text-xl font-bold">
            {secili ? `Seçili: ${kartlar.find((k) => k.id === secili)?.ad}. Şimdi kutusuna dokun.` : mesaj || "Bir kart seç ya da sürükle."}
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

      {/* Kart havuzu */}
      <div className="sticky top-2 z-10 flex min-h-16 flex-wrap gap-2 rounded-[10px] border border-dashed border-[#b9c7bf] bg-[#fbfbf8]/95 p-3 backdrop-blur">
        {kalan.length === 0 ? (
          <span className="self-center text-sm text-muted">Hepsi yerleşti.</span>
        ) : (
          kalan.map((k) => (
            <button
              key={k.id}
              type="button"
              draggable
              data-kart={k.ad}
              onDragStart={(e) => surukle(e, k.id)}
              onDragEnd={() => setHedefKutu(null)}
              onClick={() => setSecili(secili === k.id ? null : k.id)}
              className={`cursor-grab rounded-md border-2 px-3.5 py-2 text-[15px] font-semibold shadow-sm transition-all active:cursor-grabbing ${
                sallanan === k.id
                  ? "animate-[sallan_0.4s] border-[#c0392b] bg-[#fde8e5]"
                  : secili === k.id
                    ? "-translate-y-0.5 border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-border bg-background hover:border-primary/60"
              }`}
            >
              {k.ad}
              {hata[k.id] ? <span className="ml-1.5 text-xs opacity-70">·{MAKS_HATA - hata[k.id]}</span> : null}
            </button>
          ))
        )}
      </div>

      {/* Kutular */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kategoriler.map((kat) => {
          const icindekiler = kartlar.filter((k) => k.kategori === kat && durum[k.id]);
          return (
            <div
              key={kat}
              role="button"
              tabIndex={0}
              data-kutu={kat}
              onClick={() => kutuyaTikla(kat)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && kutuyaTikla(kat)}
              onDragOver={(e) => {
                e.preventDefault();
                setHedefKutu(kat);
              }}
              onDragLeave={() => setHedefKutu((h) => (h === kat ? null : h))}
              onDrop={(e) => birak(e, kat)}
              className={`flex min-h-32 flex-col gap-2 rounded-[10px] border-2 p-4 transition-colors ${
                hedefKutu === kat
                  ? "border-primary bg-primary-soft"
                  : secili
                    ? "cursor-pointer border-[#9cbcaa] bg-background hover:border-primary hover:bg-primary-soft"
                    : "border-border bg-background"
              }`}
            >
              <span className="font-serif text-lg font-bold">{kategoriYaz(kat)}</span>
              <div className="flex flex-wrap gap-1.5">
                {icindekiler.map((k) => (
                  <span
                    key={k.id}
                    className={`rounded px-2 py-0.5 text-sm ${
                      durum[k.id] === "dogru" ? "bg-primary text-primary-foreground" : "bg-[#fbefd6] text-[#5a4210]"
                    }`}
                  >
                    {k.ad}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="m-0 text-sm text-muted">
        Doğru: {dogruSayi} · Turuncu kartlar iki hatadan sonra doğru kutusuna kendiliğinden giden kartlardır.
      </p>
    </div>
  );
}
