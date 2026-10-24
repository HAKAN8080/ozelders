import "server-only";

import { redirect } from "next/navigation";

import { getSessionProfile } from "@/lib/auth";

/** Admin değilse giriş sayfasına (geri dönüş adresiyle) gönderir. */
export async function requireAdmin(nextPath: string) {
  const session = await getSessionProfile();
  if (!session.userId || session.profile?.role !== "admin") {
    redirect(`/giris?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}
