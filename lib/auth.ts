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

export function authErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("expired") ||
    lower.includes("invalid") ||
    lower.includes("otp")
  ) {
    return "Kod geçersiz veya süresi dolmuş. Yeni kod isteyip yeniden deneyin.";
  }
  if (lower.includes("rate") || lower.includes("too many")) {
    return "Çok fazla deneme yapıldı. Bir süre sonra yeniden deneyin.";
  }
  if (
    lower.includes("sms") ||
    lower.includes("phone provider") ||
    lower.includes("error sending")
  ) {
    return "Kod gönderilemedi. Numarayı kontrol edip yeniden deneyin.";
  }
  return "İşlem tamamlanamadı. Bilgileri kontrol edip yeniden deneyin.";
}
