"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { completeVeliProfile, signUpVeli } from "@/app/kayit/actions";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-lg text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function KayitForm({
  mode,
  email,
}: {
  mode: "signup" | "complete";
  email: string | null;
}) {
  const [state, action, pending] = useActionState(
    mode === "signup" ? signUpVeli : completeVeliProfile,
    null,
  );
  const next = useSearchParams().get("next") ?? "";
  const teacher = next.startsWith("/ogretmen-ol");

  if (state?.ok) {
    return (
      <div className="flex flex-col gap-4 text-lg leading-relaxed">
        <p>
          Hesabınız oluştu. E-postanızdaki onay bağlantısını açın, sonra giriş
          yapın.
        </p>
        <Link href="/giris" className="text-primary underline-offset-4 hover:underline">
          Giriş yap
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      <p className="text-lg leading-relaxed text-muted">
        {teacher
          ? "Öğretmen başvurun bu hesaba kaydedilir. Adın, e-postan, şifren ve telefonun saklanır; başvurunun her adımında sana buradan haber veririz."
          : "Veli hesabında adınız, e-postanız, şifreniz ve telefonunuz saklanır. Çocuğunuz için yalnızca ad ve sınıf istenir."}
      </p>
      {mode === "complete" && email ? <p>E-posta: {email}</p> : null}
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
      {mode === "signup" ? (
        <>
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
              autoComplete="new-password"
              required
              minLength={8}
            />
          </label>
        </>
      ) : null}
      <label className="flex flex-col gap-2">
        <span className="font-medium">Telefon</span>
        <input
          className={fieldClass}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          placeholder="5xx xxx xx xx"
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
          {teacher
            ? "KVKK aydınlatma metnini okudum. Adımın, e-postamın, telefonumun ve başvuru bilgilerimin işlenmesini anladım."
            : "KVKK aydınlatma metnini okudum. Adımın, e-postamın, telefonumun ve çocuğumun adıyla sınıfının işlenmesini anladım."}
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
        {pending ? "Kaydediliyor" : "Kayıt ol"}
      </Button>
      <Link href="/giris" className="text-primary underline-offset-4 hover:underline">
        Hesabınız varsa giriş yapın
      </Link>
    </form>
  );
}
