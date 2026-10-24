"use client";

import { useActionState } from "react";

import { createVeliProfile } from "@/app/kayit/actions";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-lg text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function KayitForm({
  email,
  phone,
}: {
  email: string | null;
  phone: string | null;
}) {
  const [state, action, pending] = useActionState(createVeliProfile, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      <p className="text-lg leading-relaxed text-muted">
        Hesabınızda adınız ve doğruladığınız iletişim bilgisi saklanır.
        Çocuğunuz için yalnızca ad ve sınıf istenir. Soyad, T.C. kimlik
        numarası ve okul adı alınmaz.
      </p>
      {email ? <p>E-posta: {email}</p> : null}
      {phone ? <p>Telefon: {phone}</p> : null}
      <label className="flex flex-col gap-2">
        <span className="font-medium">Adınız soyadınız</span>
        <input
          className={fieldClass}
          name="full_name"
          autoComplete="name"
          required
          maxLength={80}
        />
      </label>
      <label className="flex items-start gap-3">
        <input
          className="mt-1 size-6 shrink-0 accent-primary"
          type="checkbox"
          name="kvkk"
          required
        />
        <span>
          KVKK aydınlatma metnini okudum. Adımın, iletişim bilgimin ve
          çocuğumun adıyla sınıfının işlenmesini anladım.
        </span>
      </label>
      <label className="flex items-start gap-3">
        <input
          className="mt-1 size-6 shrink-0 accent-primary"
          type="checkbox"
          name="pazarlama"
        />
        <span>Kampanya ve duyurular için ileti izni veriyorum.</span>
      </label>
      {state && !state.ok ? (
        <p className="text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor" : "Veli hesabını aç"}
      </Button>
    </form>
  );
}
