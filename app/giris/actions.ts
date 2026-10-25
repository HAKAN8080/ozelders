"use server";

import { redirect } from "next/navigation";

import {
  authErrorMessage,
  ensureVeliProfile,
  getSessionProfile,
  normalizeEmail,
  normalizePassword,
  safeNext,
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

  const next = safeNext(formData.get("next"));
  const profile = await ensureVeliProfile();
  if (profile === "blocked") {
    // Veli olmayan hesaplar (admin, öğretmen) kendi alanlarına gider
    const session = await getSessionProfile();
    if (session.profile?.role === "admin") {
      redirect(next ?? "/admin");
    }
    if (session.profile?.role === "ogretmen") {
      redirect(next ?? "/ogretmen");
    }
    return { ok: false, error: "Bu hesap veli hesabı değil." };
  }
  if (profile === "missing") {
    redirect(next ? `/kayit?next=${encodeURIComponent(next)}` : "/kayit");
  }

  redirect(next ?? "/panel");
}
