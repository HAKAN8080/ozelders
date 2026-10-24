"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { signInWithEmail } from "@/app/giris/actions";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-lg text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function GirisForm() {
  const [state, action, pending] = useActionState(signInWithEmail, null);
  const next = useSearchParams().get("next") ?? "";

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-2">
        <span className="font-medium">E-posta</span>
        <input
          className={fieldClass}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="ornek@eposta.com"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-medium">Şifre</span>
        <input
          className={fieldClass}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
        />
      </label>
      {state && !state.ok ? (
        <p className="text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Giriş yapılıyor" : "Giriş yap"}
      </Button>
      <Link href={next ? `/kayit?next=${encodeURIComponent(next)}` : "/kayit"} className="text-primary underline-offset-4 hover:underline">
        Hesabınız yoksa kayıt olun
      </Link>
    </form>
  );
}
