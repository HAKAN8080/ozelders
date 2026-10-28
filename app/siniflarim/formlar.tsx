"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { sinifOlustur } from "@/app/siniflarim/actions";

export function SinifFormu() {
  const [durum, eylem, bekliyor] = useActionState(sinifOlustur, null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (durum?.ok) form.current?.reset();
  }, [durum]);
  return (
    <form ref={form} action={eylem} className="flex flex-wrap items-end gap-3">
      <label className="flex min-w-0 flex-[1_1_260px] flex-col gap-1.5">
        <span className="text-sm font-semibold">Yeni sınıf</span>
        <input
          name="ad"
          required
          maxLength={60}
          placeholder="ör. 9-A Coğrafya"
          className="rounded-md border border-border bg-background px-3 py-2.5 text-[16px] outline-none focus:border-primary"
        />
      </label>
      <button type="submit" disabled={bekliyor} className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
        {bekliyor ? "Oluşturuluyor…" : "Sınıf oluştur"}
      </button>
      {durum && !durum.ok && <p className="m-0 w-full text-sm text-[#c0392b]">{durum.hata}</p>}
    </form>
  );
}

/** Katılma bağlantısını kopyalar; telefonda paylaşım menüsünü açar. */
export function BaglantiKopyala({ kod, ad }: { kod: string; ad: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const url = () => `${window.location.origin}/sinif/${kod}`;
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            setKopyalandi(true);
            setTimeout(() => setKopyalandi(false), 2000);
          } catch {
            window.prompt("Bağlantıyı kopyala:", url());
          }
        }}
        className="rounded-md border border-border bg-background px-3.5 py-2 text-sm font-semibold hover:border-primary"
      >
        {kopyalandi ? "Kopyalandı" : "Bağlantıyı kopyala"}
      </button>
      <button
        type="button"
        onClick={() => {
          const metin = `${ad} sınıfı coğrafya oyunlarına katıl:`;
          if (navigator.share) navigator.share({ title: ad, text: metin, url: url() }).catch(() => {});
          else window.open(`https://wa.me/?text=${encodeURIComponent(`${metin} ${url()}`)}`, "_blank", "noopener");
        }}
        className="rounded-md border border-border bg-background px-3.5 py-2 text-sm font-semibold hover:border-primary"
      >
        Paylaş
      </button>
    </div>
  );
}
