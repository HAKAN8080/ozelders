"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SinifDurumu = { ok: true } | { ok: false; hata: string } | null;

export async function sinifOlustur(_onceki: SinifDurumu, form: FormData): Promise<SinifDurumu> {
  const session = await getSessionProfile();
  if (!session.userId) redirect(`/giris?next=${encodeURIComponent("/siniflarim")}`);
  const ad = String(form.get("ad") ?? "").trim().replace(/\s+/g, " ");
  if (ad.length < 1 || ad.length > 60) return { ok: false, hata: "Sınıfa 1–60 karakterlik bir ad ver (ör. 9-A Coğrafya)." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("sinif_olustur", { p_ad: ad });
  if (error) {
    if (error.message.includes("sinif_siniri")) return { ok: false, hata: "En fazla 30 sınıf oluşturabilirsin." };
    return { ok: false, hata: "Sınıf şu an oluşturulamadı. Sınıf modu çok yakında açılıyor." };
  }
  revalidatePath("/siniflarim");
  return { ok: true };
}

export async function sinifSil(form: FormData) {
  const session = await getSessionProfile();
  if (!session.userId) redirect("/giris");
  const id = String(form.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const supabase = await createClient();
  await supabase.from("siniflar").delete().eq("id", id);
  revalidatePath("/siniflarim");
  redirect("/siniflarim");
}
