import type { Metadata } from "next";
import Link from "next/link";

import { SifreYenileForm } from "@/app/sifre-yenile/form";
import { getSessionProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Yeni şifre — Özel Ders",
  description: "Hesabınız için yeni bir şifre belirleyin.",
};

export const instant = false;

export default async function SifreYenilePage() {
  const s = await getSessionProfile();
  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Yeni şifre</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {s.userId ? "Hesabınız için yeni bir şifre belirleyin. En az 8 karakter olmalı." : "Bu sayfayı açmak için e-postanıza gelen şifre yenileme bağlantısını kullanın."}
          </p>
        </div>
        {s.userId ? (
          <SifreYenileForm />
        ) : (
          <Link href="/sifremi-unuttum" className="text-primary underline-offset-4 hover:underline">
            Yeni bağlantı iste
          </Link>
        )}
      </div>
    </main>
  );
}
