"use client";

import { useActionState } from "react";

import { requestPasswordReset } from "@/app/sifremi-unuttum/actions";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-lg text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function SifremiUnuttumForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  if (state?.ok) {
    return (
      <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px] text-primary" role="status">
        {state.message}
      </p>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-medium">E-posta</span>
        <input className={fieldClass} name="email" type="email" autoComplete="email" inputMode="email" required placeholder="ornek@eposta.com" />
      </label>
      {state && !state.ok ? (
        <p className="text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Gönderiliyor" : "Yenileme bağlantısı gönder"}
      </Button>
    </form>
  );
}
