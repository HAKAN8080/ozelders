"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { sinifYaz } from "@/components/oyun/sinif";

export function KatilFormu({ kod, ad }: { kod: string; ad: string }) {
  const [isim, setIsim] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const temiz = isim.trim().replace(/\s+/g, " ");
        if (!temiz) return;
        sinifYaz({ kod, ad, ogrenci: temiz.slice(0, 40) });
        router.push("/oyunlar");
      }}
      className="flex flex-col gap-4"
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">Adın ve soyadının baş harfi</span>
        <input
          value={isim}
          onChange={(e) => setIsim(e.target.value)}
          required
          maxLength={40}
          autoComplete="off"
          placeholder="ör. Ayşe K."
          className="rounded-md border border-border bg-background px-3 py-3 text-[17px] outline-none focus:border-primary"
        />
        <span className="text-sm text-muted">Öğretmenin seni bu adla görecek. Tam soyadını yazmana gerek yok.</span>
      </label>
      <button type="submit" className="self-start rounded-md bg-primary px-6 py-3.5 font-semibold text-primary-foreground hover:bg-primary-hover">
        Sınıfa katıl ve oyunlara geç
      </button>
    </form>
  );
}
