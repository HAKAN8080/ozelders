"use server";

import { redirect } from "next/navigation";

import { getSessionProfile, normalizePassword } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type NewPasswordState = { ok: false; error: string } | null;

export async function setNewPassword(_prev: NewPasswordState, formData: FormData): Promise<NewPasswordState> {
  const password = normalizePassword(String(formData.get("password") ?? ""));
  const again = String(formData.get("password2") ?? "");
  if (!password) return { ok: false, error: "Şifre 8–72 karakter olmalı." };
  if (password !== again) return { ok: false, error: "İki şifre aynı değil." };

  const s = await getSessionProfile();
  if (!s.userId) return { ok: false, error: "Bağlantının süresi dolmuş. Yeni bir bağlantı isteyin." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      ok: false,
      error: /same|different/i.test(error.message) ? "Yeni şifre eskisinden farklı olmalı." : "Şifre güncellenemedi. Yeniden deneyin.",
    };
  }
  const role = s.profile?.role;
  redirect(role === "admin" ? "/admin" : role === "ogretmen" ? "/ogretmen" : "/panel");
}
