import { createClient } from "@supabase/supabase-js";
import { cacheLife } from "next/cache";

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

  // Hata önbelleğe alınmasın diye fırlatılır; sayfa yakalayıp mesaj gösterir.
  if (error || !data) {
    throw new Error(`Paketler okunamadı: ${error?.message ?? "veri yok"}`);
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
