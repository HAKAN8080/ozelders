"use client";

import { useActionState } from "react";

import { setNewPassword } from "@/app/sifre-yenile/actions";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-lg text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function SifreYenileForm() {
  const [state, action, pending] = useActionState(setNewPassword, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-medium">Yeni şifre</span>
        <input className={fieldClass} name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-medium">Yeni şifre (tekrar)</span>
        <input className={fieldClass} name="password2" type="password" autoComplete="new-password" required minLength={8} maxLength={72} />
      </label>
      {state && !state.ok ? (
        <p className="text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor" : "Şifremi kaydet"}
      </Button>
    </form>
  );
}
