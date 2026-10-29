"use server";

import { headers } from "next/headers";

import { normalizeEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ResetState = { ok: true; message: string } | { ok: false; error: string } | null;

async function siteOrigin(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) return { ok: false, error: "Geçerli bir e-posta adresi yazın." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteOrigin()}/auth/callback?next=/sifre-yenile`,
  });
  if (error && /rate|too many|seconds/i.test(error.message)) {
    return { ok: false, error: "Çok sık istek gönderildi. Birkaç dakika sonra yeniden deneyin." };
  }
  // Hesabın var olup olmadığını belli etmemek için her durumda aynı cevap
  return {
    ok: true,
    message: "Bu adresle bir hesap varsa şifre yenileme bağlantısı gönderdik. E-postanızı (gerekirse gereksiz klasörünü) kontrol edin; bağlantıyı bu tarayıcıda açın.",
  };
}
