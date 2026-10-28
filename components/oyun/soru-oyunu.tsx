"use client";

import { useCallback, useEffect, useState } from "react";
import { OgretmenCagrisi } from "@/components/oyun/oyun-baglami";
import { SesliOku } from "@/components/oyun/sesli-oku";

/** Çoktan seçmeli soru. Hesap soruları her turda yeniden üretilir. */
export type Soru = {
  soru: string;
  secenekler: string[];
  dogru: number;
  /** Cevaptan sonra gösterilen kısa çözüm. */
  cozum: string;
};

/** Sunucudan istemciye fonksiyon geçemediği için soru üreteçleri adla seçilir. */
export type UretecAdi = "olcek-gercek" | "olcek-harita" | "olcek-kesir" | "saat-dilimi";

type Asama = "kurulum" | "oyun" | "sonuc";

const rastgele = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const tamsayi = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const binlik = (n: number) => n.toLocaleString("tr-TR");

function karistir<T>(dizi: T[]): T[] {
  const a = [...dizi];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Doğru cevap ve yanlış şıklarla soru kurar; şıkları karıştırır, tekrarları ayıklar. */
function kur(soru: string, dogru: string, yanlislar: string[], cozum: string): Soru {
  const benzersiz = [...new Set(yanlislar.filter((y) => y !== dogru))].slice(0, 3);
  const secenekler = karistir([dogru, ...benzersiz]);
  return { soru, secenekler, dogru: secenekler.indexOf(dogru), cozum };
}

const PAYDALAR = [25_000, 50_000, 100_000, 200_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000, 20_000_000];

/** km'yi okunur yazar (1 km altını metre olarak). */
function uzunluk(cm: number) {
  const km = cm / 100_000;
  if (km >= 1) return `${binlik(Number(km.toFixed(2)))} km`;
  return `${binlik(Math.round(cm / 100))} m`;
}

/** Kitap s.42-43: Ölçek = haritadaki uzunluk / gerçek uzunluk; pay 1, birim cm. */
const URETECLER: Record<UretecAdi, () => Soru> = {
  "olcek-gercek": () => {
    const payda = rastgele(PAYDALAR);
    const harita = tamsayi(2, 12);
    const gercekCm = harita * payda;
    return kur(
      `1/${binlik(payda)} ölçekli bir haritada iki şehir arası ${harita} cm'dir. Gerçek uzaklık kaç km'dir?`,
      uzunluk(gercekCm),
      [uzunluk(gercekCm * 10), uzunluk(gercekCm / 10), uzunluk(payda * (harita + 2)), uzunluk(gercekCm * 100)],
      `Gerçek uzunluk = haritadaki uzunluk × payda = ${harita} × ${binlik(payda)} = ${binlik(gercekCm)} cm = ${uzunluk(gercekCm)}.`,
    );
  },
  "olcek-harita": () => {
    const payda = rastgele(PAYDALAR.filter((p) => p >= 100_000));
    const harita = tamsayi(2, 15);
    const km = (harita * payda) / 100_000;
    return kur(
      `Gerçekte ${binlik(km)} km olan bir uzaklık, 1/${binlik(payda)} ölçekli haritada kaç cm ile gösterilir?`,
      `${harita} cm`,
      [`${harita * 10} cm`, `${harita / 10} cm`.replace(".", ","), `${harita + 3} cm`, `${harita * 2} cm`],
      `${binlik(km)} km = ${binlik(km * 100_000)} cm. Haritadaki uzunluk = gerçek ÷ payda = ${binlik(km * 100_000)} ÷ ${binlik(payda)} = ${harita} cm.`,
    );
  },
  "olcek-kesir": () => {
    const payda = rastgele(PAYDALAR.filter((p) => p >= 100_000));
    const km = payda / 100_000;
    const yon = Math.random() < 0.5;
    if (yon) {
      return kur(
        `1/${binlik(payda)} ölçekli bir haritada 1 cm gerçekte kaç km'dir?`,
        `${binlik(km)} km`,
        [`${binlik(km * 10)} km`, `${binlik(km / 10)} km`, `${binlik(km * 100)} km`],
        `1 cm × ${binlik(payda)} = ${binlik(payda)} cm = ${binlik(km)} km. (Kitap örneği: 1/100.000 ölçekte 1 cm = 1 km.)`,
      );
    }
    return kur(
      `Çizgi ölçekte 1 cm = ${binlik(km)} km gösteriliyor. Bu ölçeğin kesir karşılığı nedir?`,
      `1/${binlik(payda)}`,
      [`1/${binlik(payda * 10)}`, `1/${binlik(payda / 10)}`, `1/${binlik(km)}`],
      `${binlik(km)} km = ${binlik(payda)} cm olduğu için 1 cm = ${binlik(payda)} cm, yani 1/${binlik(payda)}.`,
    );
  },
  "saat-dilimi": () => {
    // Kitap s.39-40: 15°'lik 24 dilim; doğu +, batı −; Türkiye +3. dilimde.
    const dilim = rastgele([-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10]);
    const trSaat = tamsayi(6, 20);
    const fark = dilim - 3;
    let s = trSaat + fark;
    let gun = "";
    if (s < 0) {
      s += 24;
      gun = " (bir önceki gün)";
    } else if (s >= 24) {
      s -= 24;
      gun = " (ertesi gün)";
    }
    const yaz = (h: number) => `${String(((h % 24) + 24) % 24).padStart(2, "0")}.00`;
    const etiket = dilim > 0 ? `+${dilim}.` : dilim === 0 ? "0." : `${dilim}.`;
    return kur(
      `Türkiye'de (+3. saat dilimi) saat ${yaz(trSaat)} iken ${etiket} saat dilimindeki bir yerde saat kaçtır?`,
      yaz(s),
      [yaz(trSaat - fark), yaz(s + 1), yaz(s - 1), yaz(trSaat + dilim)],
      `Dilim farkı: ${etiket.replace(".", "")} − (+3) = ${fark > 0 ? "+" : ""}${fark} saat. ${yaz(trSaat)} ${fark >= 0 ? "+" : "−"} ${Math.abs(fark)} = ${yaz(s)}${gun}.`,
    );
  },
};

export type SoruOyunuAyarlari = {
  yonerge: string;
  /** Sabit sorular (kitaptan) ve/veya üreteçler. */
  sorular?: Soru[];
  uretecler?: UretecAdi[];
  turSecenekleri?: number[];
};

export function SoruOyunu({ yonerge, sorular = [], uretecler = [], turSecenekleri = [10, 20] }: SoruOyunuAyarlari) {
  const [asama, setAsama] = useState<Asama>("kurulum");
  const [adet, setAdet] = useState(turSecenekleri[0]);
  const [liste, setListe] = useState<Soru[]>([]);
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState<number | null>(null);
  const [dogruSayi, setDogruSayi] = useState(0);
  const [yanlislar, setYanlislar] = useState<Soru[]>([]);
  const [sure, setSure] = useState(0);

  const baslat = useCallback(() => {
    // Sabit soruların şıkları da her turda karıştırılır
    const havuz: Soru[] = karistir(sorular).map((q) => kur(q.soru, q.secenekler[q.dogru], q.secenekler.filter((_, k) => k !== q.dogru), q.cozum));
    let n = 0;
    while (havuz.length < adet && uretecler.length > 0 && n < 500) {
      havuz.push(URETECLER[uretecler[n % uretecler.length]]());
      n++;
    }
    setListe(karistir(havuz).slice(0, adet));
    setI(0);
    setSecim(null);
    setDogruSayi(0);
    setYanlislar([]);
    setSure(0);
    setAsama("oyun");
  }, [sorular, uretecler, adet]);

  useEffect(() => {
    if (asama !== "oyun") return;
    const t = setInterval(() => setSure((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [asama]);

  const sec = (k: number) => {
    if (secim !== null) return;
    setSecim(k);
    if (k === liste[i].dogru) setDogruSayi((d) => d + 1);
    else setYanlislar((y) => [...y, liste[i]]);
  };
  const sonraki = () => {
    if (i + 1 >= liste.length) setAsama("sonuc");
    else {
      setI(i + 1);
      setSecim(null);
    }
  };

  const sureYaz = `${Math.floor(sure / 60)}:${String(sure % 60).padStart(2, "0")}`;
  const kutu = "rounded-[10px] border border-border bg-background/80 p-6 backdrop-blur-[2px] sm:p-8";

  if (asama === "kurulum") {
    return (
      <div className={`flex flex-col gap-8 ${kutu}`}>
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-2xl font-bold">Nasıl oynanır?</h2>
          <p className="m-0 max-w-[40em] leading-relaxed text-[#3d4743]">{yonerge}</p>
          <p className="m-0 text-sm text-muted">Her soruda dört şık var. Cevapladıktan sonra çözümü görürsün.</p>
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
    return (
      <div className={`flex flex-col gap-6 ${kutu}`}>
        <div className="flex flex-col gap-1">
          <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tur bitti</p>
          <h2 className="m-0 font-serif text-3xl font-bold">
            {dogruSayi === liste.length ? "Hepsi doğru." : dogruSayi >= liste.length * 0.7 ? "Çok iyi." : "Çözümlere bak, bir tur daha."}
          </h2>
        </div>
        <dl className="m-0 grid grid-cols-3 gap-3">
          {[
            ["Doğru", `${dogruSayi} / ${liste.length}`],
            ["Puan", String(dogruSayi * 10)],
            ["Süre", sureYaz],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md bg-primary-soft p-4">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="m-0 font-serif text-2xl font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        <OgretmenCagrisi oran={liste.length ? Math.round((dogruSayi / liste.length) * 100) : 0} />
        {yanlislar.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-base font-semibold">Yanlış yaptıkların</h3>
            {yanlislar.map((s, k) => (
              <div key={k} className="rounded-md bg-[#fbefd6] px-4 py-3 text-[15px]">
                <p className="m-0 font-semibold">{s.soru}</p>
                <p className="m-0 mt-1">
                  Doğru cevap: <strong>{s.secenekler[s.dogru]}</strong>
                </p>
                <p className="m-0 mt-1 text-sm text-[#5a4210]">{s.cozum}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={baslat}
            className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Yeni sorularla oyna
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

  const s = liste[i];
  return (
    <div className="flex flex-col gap-4">
      <div className="tahta flex flex-wrap items-center justify-between gap-4 rounded-[10px] px-5 py-4 text-primary-foreground">
        <span className="text-sm opacity-75">
          Soru {i + 1}/{liste.length}
        </span>
        <div className="flex items-center gap-5 text-sm">
          <div className="flex flex-col items-end">
            <span className="opacity-75">Doğru</span>
            <span className="font-serif text-xl font-bold">{dogruSayi}</span>
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
      <div className={`flex flex-col gap-4 ${kutu}`}>
        <div className="flex items-start justify-between gap-3">
          <p className="m-0 font-serif text-xl leading-snug font-bold sm:text-2xl" data-soru="">
            {s.soru}
          </p>
          <SesliOku metin={`${s.soru} ${s.secenekler.map((x, k) => `${"ABCD"[k]}: ${x}`).join(". ")}`} />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {s.secenekler.map((x, k) => {
            const durum = secim === null ? "" : k === s.dogru ? "dogru" : k === secim ? "yanlis" : "soluk";
            return (
              <button
                key={k}
                type="button"
                data-secenek={k === s.dogru ? "dogru" : "yanlis"}
                disabled={secim !== null}
                onClick={() => sec(k)}
                className={`flex items-center gap-3 rounded-md border-2 px-4 py-3.5 text-left text-[16px] font-semibold transition-colors ${
                  durum === "dogru"
                    ? "border-primary bg-primary text-primary-foreground"
                    : durum === "yanlis"
                      ? "border-[#c0392b] bg-[#fde8e5]"
                      : durum === "soluk"
                        ? "border-border bg-background opacity-50"
                        : "border-border bg-background hover:border-primary/60"
                }`}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-sm">
                  {"ABCD"[k]}
                </span>
                {x}
              </button>
            );
          })}
        </div>
        {secim !== null && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-primary-soft px-4 py-3">
            <p className="m-0 text-[15px]">
              <strong>{secim === s.dogru ? "Doğru. " : "Yanlış. "}</strong>
              {s.cozum}
            </p>
            <button
              type="button"
              onClick={sonraki}
              className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              {i + 1 >= liste.length ? "Sonucu gör" : "Sonraki soru →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
