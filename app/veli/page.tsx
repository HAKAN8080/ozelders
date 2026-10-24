import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signOut } from "@/app/veli/actions";
import { CocukFormu } from "@/app/veli/cocuk-formu";
import { Button } from "@/components/ui/button";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Veli paneli — Özel Ders",
};

export const instant = false;

export default async function VeliPage() {
  const session = await getSessionProfile();
  if (!session.userId) {
    redirect("/giris");
  }
  if (!session.profile) {
    redirect("/kayit");
  }
  if (session.profile.role !== "veli") {
    redirect("/giris");
  }

  const supabase = await createClient();
  const { data: children } = await supabase
    .from("students")
    .select("id, first_name, grade")
    .order("created_at", { ascending: true });

  return (
    <main className="flex flex-1 flex-col bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="flex w-full max-w-xl flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Çocuklarım</h1>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Çıkış
            </Button>
          </form>
        </div>
        {children && children.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {children.map((child) => (
              <li
                key={child.id}
                className="rounded-2xl border border-border bg-primary-soft px-5 py-4"
              >
                <p className="text-xl font-semibold">{child.first_name}</p>
                <p className="text-muted">{child.grade}. sınıf</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-muted">Henüz çocuk eklemediniz.</p>
        )}
        <CocukFormu />
      </div>
    </main>
  );
}
