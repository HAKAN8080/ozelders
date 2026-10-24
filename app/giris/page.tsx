import type { Metadata } from "next";
import Link from "next/link";

import { GirisForm } from "@/app/giris/giris-form";

export const metadata: Metadata = {
  title: "Giriş — Özel Ders",
  description: "E-posta ve şifre ile giriş yapın.",
};

export default function GirisPage() {
  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Giriş</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            Kayıt olduğunuz e-posta ve şifreyle giriş yapın.
          </p>
        </div>
        <GirisForm />
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          Ana sayfa
        </Link>
      </div>
    </main>
  );
}
