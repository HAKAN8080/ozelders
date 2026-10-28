"use client";

import { useEffect, useState } from "react";

/** Tarayıcının Türkçe sesiyle okur. Ses desteği yoksa düğme hiç görünmez. */
export function SesliOku({ metin, etiket = "Sesli oku", acik = false }: { metin: string; etiket?: string; acik?: boolean }) {
  const [destek, setDestek] = useState(false);
  const [okuyor, setOkuyor] = useState(false);

  useEffect(() => {
    // Tarayıcı özelliği yalnız istemcide bilinir
    const var_ = typeof window !== "undefined" && "speechSynthesis" in window;
    const t = setTimeout(() => setDestek(var_), 0);
    return () => {
      clearTimeout(t);
      if (var_) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Metin değişince (yeni soru) okumayı durdur
    if (destek) window.speechSynthesis.cancel();
    const t = setTimeout(() => setOkuyor(false), 0);
    return () => clearTimeout(t);
  }, [metin, destek]);

  if (!destek) return null;

  const oku = () => {
    const s = window.speechSynthesis;
    if (okuyor) {
      s.cancel();
      setOkuyor(false);
      return;
    }
    s.cancel();
    const u = new SpeechSynthesisUtterance(metin.replace(/[{}]/g, "").replace(/_{2,}/g, "boşluk"));
    u.lang = "tr-TR";
    const ses = s.getVoices().find((v) => v.lang?.toLowerCase().startsWith("tr"));
    if (ses) u.voice = ses;
    u.rate = 0.95;
    u.onend = () => setOkuyor(false);
    u.onerror = () => setOkuyor(false);
    setOkuyor(true);
    s.speak(u);
  };

  return (
    <button
      type="button"
      onClick={oku}
      aria-label={okuyor ? "Okumayı durdur" : etiket}
      title={okuyor ? "Okumayı durdur" : etiket}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors ${
        acik ? "bg-white/15 text-white hover:bg-white/25" : "border border-border bg-background text-foreground hover:border-primary"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        {okuyor ? <path d="M23 9l-6 6M17 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />}
      </svg>
      {okuyor ? "Durdur" : "Dinle"}
    </button>
  );
}
