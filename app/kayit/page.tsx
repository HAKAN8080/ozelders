import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { KayitForm } from "@/app/kayit/kayit-form";
import { ensureVeliProfile, getSessionProfile, safeNext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Kayıt ol — Özel Ders",
};

export const instant = false;

export default async function KayitPage(props: PageProps<"/kayit">) {
  const next = safeNext((await props.searchParams).next);
  const teacher = next?.startsWith("/ogretmen-ol") ?? false;
  const session = await getSessionProfile();
  if (session.profile?.role === "veli") {
    redirect(next ?? "/panel");
  }

  if (session.userId && !session.profile) {
    const ensured = await ensureVeliProfile();
    if (ensured === "ok") {
      redirect(next ?? "/panel");
    }
  }

  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">{teacher ? "Öğretmen başvurusu için hesap aç" : "Kayıt ol"}</h1>
        {session.profile ? (
          <div className="flex flex-col gap-4 text-lg leading-relaxed">
            <p>Bu hesap veli kaydı için kullanılamaz.</p>
            <Link href="/" className="text-primary underline-offset-4 hover:underline">
              Ana sayfa
            </Link>
          </div>
        ) : (
          <Suspense>
            <KayitForm
              mode={session.userId ? "complete" : "signup"}
              email={session.email}
            />
          </Suspense>
        )}
      </div>
    </main>
  );
}
