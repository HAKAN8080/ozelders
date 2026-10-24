import { NextResponse } from "next/server";

import { ensureVeliProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/giris`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/giris`);
  }

  const profile = await ensureVeliProfile();
  const next = profile === "ok" ? "/panel" : "/kayit";
  return NextResponse.redirect(`${origin}${next}`);
}
