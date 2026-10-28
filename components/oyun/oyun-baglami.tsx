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
export function OgretmenCagrisi({ oran }: { oran: number }) {
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
