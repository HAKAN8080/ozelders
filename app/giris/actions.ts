"use server";

import { headers } from "next/headers";

import { authErrorMessage, normalizeEmail, normalizeTrPhone } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type OtpState =
  | { ok: true; destination: string }
  | { ok: false; error: string }
  | null;

export type VerifyState =
  | { ok: true; next: "/veli" | "/kayit" }
  | { ok: false; error: string }
  | null;

export async function sendOtp(
  _prev: OtpState,
  formData: FormData,
): Promise<OtpState> {
  const channel = formData.get("channel");
  const supabase = await createClient();
  const origin = await siteOrigin();

  if (channel === "email") {
    const email = normalizeEmail(String(formData.get("email") ?? ""));
    if (!email) {
      return { ok: false, error: "Geçerli bir e-posta adresi yazın." };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return { ok: false, error: authErrorMessage(error.message) };
    }

    return { ok: true, destination: email };
  }

  if (channel === "sms") {
    const phone = normalizeTrPhone(String(formData.get("phone") ?? ""));
    if (!phone) {
      return {
        ok: false,
        error: "Geçerli bir cep telefonu yazın. Örnek: 5xx xxx xx xx",
      };
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: true },
    });

    if (error) {
      return { ok: false, error: authErrorMessage(error.message) };
    }

    return { ok: true, destination: phone };
  }

  return { ok: false, error: "Giriş yöntemi seçin." };
}

export async function verifyOtp(
  _prev: VerifyState,
  formData: FormData,
): Promise<VerifyState> {
  const channel = formData.get("channel");
  const token = String(formData.get("token") ?? "").replace(/\s/g, "");
  if (!/^\d{6,8}$/.test(token)) {
    return { ok: false, error: "Kod 6 haneli olmalı." };
  }

  const supabase = await createClient();

  if (channel === "email") {
    const email = normalizeEmail(String(formData.get("destination") ?? ""));
    if (!email) {
      return { ok: false, error: "E-posta adresi doğrulanamadı." };
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) {
      return { ok: false, error: authErrorMessage(error.message) };
    }
  } else if (channel === "sms") {
    const phone = normalizeTrPhone(String(formData.get("destination") ?? ""));
    if (!phone) {
      return { ok: false, error: "Telefon numarası doğrulanamadı." };
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) {
      return { ok: false, error: authErrorMessage(error.message) };
    }
  } else {
    return { ok: false, error: "Giriş yöntemi seçin." };
  }

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) {
    return { ok: false, error: "Oturum açılamadı. Kodu yeniden deneyin." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role === "veli") {
    return { ok: true, next: "/veli" };
  }

  return { ok: true, next: "/kayit" };
}

async function siteOrigin(): Promise<string> {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) {
    return origin;
  }

  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}
