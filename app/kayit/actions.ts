"use server";

import { redirect } from "next/navigation";

import { getSessionProfile, normalizePersonName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type KayitState = { ok: false; error: string } | null;

export async function createVeliProfile(
  _prev: KayitState,
  formData: FormData,
): Promise<KayitState> {
  const session = await getSessionProfile();
  if (!session.userId) {
    redirect("/giris");
  }

  if (session.profile?.role === "veli") {
    redirect("/veli");
  }

  if (session.profile) {
    return { ok: false, error: "Bu hesap veli kaydı için kullanılamaz." };
  }

  if (formData.get("kvkk") !== "on") {
    return {
      ok: false,
      error: "Devam etmek için KVKK aydınlatma metnini onaylayın.",
    };
  }

  const fullName = normalizePersonName(String(formData.get("full_name") ?? ""), 80);
  if (!fullName) {
    return {
      ok: false,
      error: "Adınızı yazın. Rakam kullanmayın.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").insert({
    id: session.userId,
    role: "veli",
    full_name: fullName,
    email: session.email,
    phone: session.phone,
    kvkk_aydinlatma_at: new Date().toISOString(),
    pazarlama_izni: formData.get("pazarlama") === "on",
  });

  if (error) {
    if (error.code === "23505") {
      redirect("/veli");
    }
    return { ok: false, error: "Hesap kaydı tamamlanamadı. Yeniden deneyin." };
  }

  redirect("/veli");
}
