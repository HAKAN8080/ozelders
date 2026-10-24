"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  authErrorMessage,
  getSessionProfile,
  normalizeEmail,
  normalizePassword,
  normalizePersonName,
  normalizeTrPhone,
  safeNext,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type KayitState =
  | { ok: true; confirmEmail: true }
  | { ok: false; error: string }
  | null;

export async function signUpVeli(
  _prev: KayitState,
  formData: FormData,
): Promise<KayitState> {
  if (formData.get("kvkk") !== "on") {
    return {
      ok: false,
      error: "Devam etmek için KVKK aydınlatma metnini onaylayın.",
    };
  }

  const fullName = normalizePersonName(String(formData.get("full_name") ?? ""), 80);
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = normalizePassword(String(formData.get("password") ?? ""));
  const phone = normalizeTrPhone(String(formData.get("phone") ?? ""));

  if (!fullName) {
    return { ok: false, error: "Adınızı soyadınızı yazın. Rakam kullanmayın." };
  }
  if (!email) {
    return { ok: false, error: "Geçerli bir e-posta adresi yazın." };
  }
  if (!password) {
    return { ok: false, error: "Şifre en az 8 karakter olmalı." };
  }
  if (!phone) {
    return {
      ok: false,
      error: "Geçerli bir cep telefonu yazın. Örnek: 5xx xxx xx xx",
    };
  }

  const kvkkAt = new Date().toISOString();
  const pazarlama = formData.get("pazarlama") === "on";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${await siteOrigin()}/auth/callback${
        safeNext(formData.get("next")) ? `?next=${encodeURIComponent(safeNext(formData.get("next"))!)}` : ""
      }`,
      data: {
        full_name: fullName,
        phone,
        kvkk_aydinlatma_at: kvkkAt,
        pazarlama_izni: pazarlama,
      },
    },
  });

  if (error) {
    return { ok: false, error: authErrorMessage(error.message) };
  }

  if (!data.session) {
    return { ok: true, confirmEmail: true };
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: data.user?.id ?? data.session.user.id,
    role: "veli",
    full_name: fullName,
    email,
    phone,
    kvkk_aydinlatma_at: kvkkAt,
    pazarlama_izni: pazarlama,
  });

  if (insertError && insertError.code !== "23505") {
    return { ok: false, error: "Hesap kaydı tamamlanamadı. Yeniden deneyin." };
  }

  redirect(safeNext(formData.get("next")) ?? "/panel");
}

export async function completeVeliProfile(
  _prev: KayitState,
  formData: FormData,
): Promise<KayitState> {
  const session = await getSessionProfile();
  if (!session.userId) {
    redirect("/giris");
  }
  if (session.profile?.role === "veli") {
    redirect(safeNext(formData.get("next")) ?? "/panel");
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
  const phone = normalizeTrPhone(String(formData.get("phone") ?? ""));
  if (!fullName) {
    return { ok: false, error: "Adınızı soyadınızı yazın. Rakam kullanmayın." };
  }
  if (!phone) {
    return {
      ok: false,
      error: "Geçerli bir cep telefonu yazın. Örnek: 5xx xxx xx xx",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").insert({
    id: session.userId,
    role: "veli",
    full_name: fullName,
    email: session.email,
    phone,
    kvkk_aydinlatma_at: new Date().toISOString(),
    pazarlama_izni: formData.get("pazarlama") === "on",
  });

  if (error && error.code !== "23505") {
    return { ok: false, error: "Hesap kaydı tamamlanamadı. Yeniden deneyin." };
  }

  redirect(safeNext(formData.get("next")) ?? "/panel");
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
