"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";

/** Oyun sayfasının kimliği: hangi ders, hangi konu. Sonuç ekranı ve ilerleme kaydı kullanır. */
export type OyunBaglamiDegeri = {
  /** Öğretmen bulma formundaki ders kodu, ör. "cografya" */
  dersKodu?: string;
  dersAdi?: string;
  /** Konu sayfasının adresteki adı, ör. "harita-ve-olcek" */
  konu?: string;
  konuBasligi?: string;
};

const Baglam = createContext<OyunBaglamiDegeri>({});

export function OyunBaglami({ deger, children }: { deger: OyunBaglamiDegeri; children: ReactNode }) {
  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>;
}

export function useOyunBaglami() {
  return useContext(Baglam);
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
