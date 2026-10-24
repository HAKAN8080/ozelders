"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Kayıtsız çözülmüş denemeyi giriş yapan kullanıcının hesabına bağlar. */
export async function claimAttempt(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const token = String(formData.get("token") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!UUID.test(id) || !UUID.test(token) || !/^[a-z0-9-]{3,80}$/.test(slug)) {
    redirect("/deneme");
  }
  const supabase = await createClient();
  await supabase.rpc("claim_exam_attempt", { p_attempt: id, p_token: token });
  redirect(`/deneme/${slug}/sonuc/${id}?t=${token}`);
}
