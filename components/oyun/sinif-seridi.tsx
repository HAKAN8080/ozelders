"use client";

import { useEffect, useState } from "react";

import { sinifOku, sinifYaz, type SinifKaydi } from "@/components/oyun/sinif";

/** Öğrenci bir sınıfa katıldıysa oyun sayfalarının üstünde görünür. */
export function SinifSeridi() {
  const [k, setK] = useState<SinifKaydi | null>(null);
  useEffect(() => {
    const g = () => setK(sinifOku());
    const t = setTimeout(g, 0);
    window.addEventListener("ozd-sinif", g);
    return () => {
      clearTimeout(t);
      window.removeEventListener("ozd-sinif", g);
    };
  }, []);
  if (!k) return null;
  return (
    <div data-sinif-seridi="" className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/30 bg-primary-soft px-4 py-2.5 text-[15px]">
      <span>
        <strong>{k.ad}</strong> sınıfındasın · {k.ogrenci}. Bitirdiğin oyunların sonucu öğretmenine gider.
      </span>
      <button type="button" onClick={() => sinifYaz(null)} className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
        Sınıftan çık
      </button>
    </div>
  );
}
