import type { Metadata } from "next";
import Link from "next/link";

import { SifremiUnuttumForm } from "@/app/sifremi-unuttum/form";

export const metadata: Metadata = {
  title: "Şifremi unuttum — Özel Ders",
  description: "Şifre yenileme bağlantısı isteyin.",
};

export default function SifremiUnuttumPage() {
  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Şifremi unuttum</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">Kayıtlı e-posta adresinizi yazın; şifrenizi yenilemeniz için bir bağlantı gönderelim.</p>
        </div>
        <SifremiUnuttumForm />
        <Link href="/giris" className="text-primary underline-offset-4 hover:underline">
          Girişe dön
        </Link>
      </div>
    </main>
  );
}
