import { createClient } from "@/lib/supabase/server";

export type SessionProfile = {
  userId: string | null;
  email: string | null;
  phone: string | null;
  profile: { role: "veli" | "ogretmen" | "admin" } | null;
};

export async function getSessionProfile(): Promise<SessionProfile> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return { userId: null, email: null, phone: null, profile: null };
  }

  const userId = data.claims.sub;
  const email = claimText(data.claims.email);
  const phone = claimText(data.claims.phone);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return {
    userId,
    email,
    phone,
    profile: profile ? { role: profile.role } : null,
  };
}

function claimText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    return null;
  }
  return email;
}

export function normalizeTrPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) {
    digits = digits.slice(2);
  }
  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }
  if (digits.length !== 10 || !digits.startsWith("5")) {
    return null;
  }
  return `+90${digits}`;
}

export function normalizePersonName(input: string, max: number): string | null {
  const name = input.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > max) {
    return null;
  }
  if (/\d/.test(name)) {
    return null;
  }
  return name;
}

export function normalizePassword(input: string): string | null {
  if (input.length < 8 || input.length > 72) {
    return null;
  }
  return input;
}

export function authErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "E-posta veya şifre hatalı.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "Bu e-posta ile kayıt var. Giriş yapın.";
  }
  if (lower.includes("email not confirmed")) {
    return "Girişten önce e-postanızdaki onay bağlantısını açın.";
  }
  if (lower.includes("password")) {
    return "Şifre en az 8 karakter olmalı.";
  }
  if (lower.includes("rate") || lower.includes("too many")) {
    return "Çok fazla deneme yapıldı. Bir süre sonra yeniden deneyin.";
  }
  return "İşlem tamamlanamadı. Bilgileri kontrol edip yeniden deneyin.";
}

export async function ensureVeliProfile(): Promise<
  "ok" | "missing" | "blocked"
> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) {
    return "missing";
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role === "veli") {
    return "ok";
  }
  if (profile) {
    return "blocked";
  }

  const { data: userData } = await supabase.auth.getUser();
  const meta = metaRecord(userData.user?.user_metadata);
  const fullName =
    typeof meta.full_name === "string"
      ? normalizePersonName(meta.full_name, 80)
      : null;
  const phone =
    typeof meta.phone === "string" ? normalizeTrPhone(meta.phone) : null;
  const kvkkAt =
    typeof meta.kvkk_aydinlatma_at === "string"
      ? meta.kvkk_aydinlatma_at
      : null;
  if (!fullName || !phone || !kvkkAt) {
    return "missing";
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: userId,
    role: "veli",
    full_name: fullName,
    email: userData.user?.email ?? null,
    phone,
    kvkk_aydinlatma_at: kvkkAt,
    pazarlama_izni: meta.pazarlama_izni === true,
  });

  if (insertError && insertError.code !== "23505") {
    return "missing";
  }

  return "ok";
}

function metaRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

/**
 * Giriş/kayıt sonrası dönülecek adres. Sadece site içi yollar kabul edilir
 * (açık yönlendirme saldırısına karşı: "//evil.com", "/\\evil.com" reddedilir).
 */
export function safeNext(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\") || v.length > 300) return null;
  return v;
}
