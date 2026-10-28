"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { sinifOku } from "@/components/oyun/sinif";
import { createClient } from "@/lib/supabase/client";

/** Oyun sayfasının kimliği: hangi ders, hangi konu. Sonuç ekranı ve ilerleme kaydı kullanır. */
export type OyunBaglamiDegeri = {
  /** Öğretmen bulma formundaki ders kodu, ör. "cografya" */
  dersKodu?: string;
  dersAdi?: string;
  /** Konu sayfasının adresteki adı, ör. "harita-ve-olcek" */
  konu?: string;
  konuBasligi?: string;
  /** Konu sayfasındaki sekme (oyun) kimliği */
  oyun?: string;
};

const Baglam = createContext<OyunBaglamiDegeri>({});

export function OyunBaglami({ deger, children }: { deger: OyunBaglamiDegeri; children: ReactNode }) {
  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>;
}

export function useOyunBaglami() {
  return useContext(Baglam);
}

/** Üst bağlamı koruyup bazı alanları değiştirir (ör. sekme kimliği). */
export function AltBaglam({ ek, children }: { ek: Partial<OyunBaglamiDegeri>; children: ReactNode }) {
  const ust = useContext(Baglam);
  return <Baglam.Provider value={{ ...ust, ...ek }}>{children}</Baglam.Provider>;
}

/**
 * Sonuç ekranı açılınca bir kez çalışır:
 * - giriş yapmış kullanıcının sonucu ilerlemesine yazılır,
 * - öğrenci bir sınıfa katıldıysa sonuç öğretmenine gönderilir.
 * Tablolar henüz yoksa ya da ağ hatası olursa sessizce geçer; oyun etkilenmez.
 */
function SonucKaydedici({ oran }: { oran: number }) {
  const { konu, oyun } = useOyunBaglami();
  const calisti = useRef(false);
  const [durum, setDurum] = useState<{ ilerleme: boolean; sinif: string | null }>({ ilerleme: false, sinif: null });

  useEffect(() => {
    if (calisti.current || !konu) return;
    calisti.current = true;
    const sb = createClient();
    const oyunAdi = oyun ?? "ana";
    (async () => {
      try {
        const { data } = await sb.auth.getSession();
        if (data.session) {
          const { error } = await sb.from("oyun_sonuclari").insert({ konu, oyun: oyunAdi, oran });
          if (!error) setDurum((d) => ({ ...d, ilerleme: true }));
        }
      } catch {
        /* yok say */
      }
      const sinif = sinifOku();
      if (sinif) {
        try {
          const { data } = await sb.rpc("sinif_sonucu_kaydet", { p_kod: sinif.kod, p_ogrenci: sinif.ogrenci, p_konu: konu, p_oyun: oyunAdi, p_oran: oran });
          if (data === true) setDurum((d) => ({ ...d, sinif: sinif.ad }));
        } catch {
          /* yok say */
        }
      }
    })();
  }, [konu, oyun, oran]);

  if (!durum.ilerleme && !durum.sinif) return null;
  return (
    <p data-kaydedildi="" className="m-0 text-sm text-primary">
      {durum.sinif ? `Sonucun ${durum.sinif} sınıfının öğretmenine gönderildi. ` : ""}
      {durum.ilerleme ? (
        <>
          İlerlemene kaydedildi.{" "}
          <Link href="/panel/ilerleme" className="font-semibold underline">
            İlerlememi gör
          </Link>
        </>
      ) : null}
    </p>
  );
}

/**
 * Sonuç ekranındaki öğretmen çağrısı: oyunu ücretsiz tanışma dersine bağlar.
 * oran: 0–100 başarı yüzdesi; düşükse "zorlandın mı" der.
 */
/** Sonucu paylaş: telefonda paylaşım menüsü, olmazsa WhatsApp. */
function SonucPaylas({ oran }: { oran: number }) {
  const { konuBasligi, dersAdi } = useOyunBaglami();
  const paylas = async () => {
    const url = window.location.href.split("#")[0];
    const metin = `${dersAdi ? `${dersAdi} · ` : ""}${konuBasligi ?? "ÖzelDersBul oyunu"} oyununda %${oran} başarı yaptım. Sen de dene:`;
    try {
      if (navigator.share) {
        await navigator.share({ title: konuBasligi ?? "ÖzelDersBul", text: metin, url });
        return;
      }
    } catch {
      return; // kullanıcı paylaşımı kapattı
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${metin} ${url}`)}`, "_blank", "noopener");
  };
  return (
    <button
      type="button"
      onClick={paylas}
      data-paylas=""
      className="inline-flex items-center gap-2 self-start rounded-md border border-border bg-background px-4 py-2.5 font-semibold hover:border-primary"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      Sonucumu paylaş
    </button>
  );
}

export function OgretmenCagrisi({ oran }: { oran: number }) {
  return (
    <>
      <SonucKaydedici oran={oran} />
      <SonucPaylas oran={oran} />
      <OgretmenKutusu oran={oran} />
    </>
  );
}

function OgretmenKutusu({ oran }: { oran: number }) {
  const { dersKodu, dersAdi, konuBasligi } = useOyunBaglami();
  const href = `/panel/ogretmen-bul${dersKodu ? `?ders=${encodeURIComponent(dersKodu)}` : ""}`;
  const zorlandi = oran < 70;
  return (
    <section
      data-ogretmen-cagrisi=""
      className="tahta flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[10px] px-5 py-5 text-primary-foreground sm:px-7"
    >
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1.5">
        <p className="m-0 font-serif text-[22px] leading-snug font-bold">
          {zorlandi
            ? `${konuBasligi ? `${konuBasligi} konusunda` : "Bu konuda"} zorlandın mı?`
            : "Bu konuyu sağlamlaştırmak ister misin?"}
        </p>
        <p className="m-0 text-[15px] leading-relaxed text-[#dce9e0]">
          {dersAdi ? `${dersAdi} öğretmenlerimizden` : "Öğretmenlerimizden"} biriyle birebir çalış. Seçtiğin öğretmenle önce ücretsiz 20
          dakikalık tanışma dersi yaparsın.
        </p>
      </div>
      <div className="flex flex-[0_1_260px] flex-col items-stretch gap-1">
        <Link href={href} className="rounded-md bg-white px-5 py-3 text-center font-semibold text-primary no-underline hover:bg-primary-soft">
          {dersAdi ? `${dersAdi} öğretmeni bul` : "Öğretmen bul"}
        </Link>
        <span className="text-center font-hand text-[20px] text-white">önce ücretsiz 20 dk tanışma</span>
      </div>
    </section>
  );
}
