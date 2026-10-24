import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { KayitForm } from "@/app/kayit/kayit-form";
import { getSessionProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Veli kaydı — Özel Ders",
};

export const instant = false;

export default async function KayitPage() {
  const session = await getSessionProfile();
  if (!session.userId) {
    redirect("/giris");
  }
  if (session.profile?.role === "veli") {
    redirect("/veli");
  }

  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">Veli kaydı</h1>
        <KayitForm email={session.email} phone={session.phone} />
      </div>
    </main>
  );
}
