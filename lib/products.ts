import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

import type { Database } from "@/lib/database.types";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

export type Product = Pick<
  Database["public"]["Tables"]["package_products"]["Row"],
  "code" | "name" | "kind" | "lesson_count" | "validity_days" | "price"
>;

/**
 * Satıştaki paketler. Fiyatın tek kaynağı veritabanıdır; sayfada sabit rakam yok.
 * Oturum gerektirmez (anonim kullanıcı yalnızca aktif paketleri görebilir),
 * bu yüzden çerezsiz istemciyle okunur ve bir saat önbellekte tutulur.
 */
export async function getActiveProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const supabase = createClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await supabase
    .from("package_products")
    .select("code, name, kind, lesson_count, validity_days, price")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error || !Array.isArray(data)) {
    // Geçici hata: boş liste kısa süre önbellekte kalır, kısa sürede yeniden denenir.
    cacheLife("seconds");
    return [];
  }
  return data;
}

const tl = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function formatTL(value: number): string {
  return tl.format(value);
}
