import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Bir kullanıcının e-postası (yalnız sunucuda, bildirim için). Hizmet anahtarı yoksa null döner;
 * e-posta adresleri hiçbir zaman tarayıcıya ya da karşı tarafa gönderilmez.
 */
export async function emailOf(profileId: string): Promise<string | null> {
  try {
    const { data } = await createAdminClient().from("profiles").select("email").eq("id", profileId).maybeSingle();
    return data?.email ?? null;
  } catch {
    return null;
  }
}
