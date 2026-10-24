"use server";

import { redirect } from "next/navigation";

import {
  authErrorMessage,
  ensureVeliProfile,
  normalizeEmail,
  normalizePassword,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type GirisState = { ok: false; error: string } | null;

export async function signInWithEmail(
  _prev: GirisState,
  formData: FormData,
): Promise<GirisState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = normalizePassword(String(formData.get("password") ?? ""));
  if (!email) {
    return { ok: false, error: "Geçerli bir e-posta adresi yazın." };
  }
  if (!password) {
    return { ok: false, error: "Şifre en az 8 karakter olmalı." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: authErrorMessage(error.message) };
  }

  const profile = await ensureVeliProfile();
  if (profile === "blocked") {
    return { ok: false, error: "Bu hesap veli hesabı değil." };
  }
  if (profile === "missing") {
    redirect("/kayit");
  }

  redirect("/panel");
}
