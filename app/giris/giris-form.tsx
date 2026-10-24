"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { sendOtp, verifyOtp } from "@/app/giris/actions";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-lg text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function GirisForm() {
  const router = useRouter();
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [sendState, sendAction, sendPending] = useActionState(sendOtp, null);
  const [verifyState, verifyAction, verifyPending] = useActionState(
    verifyOtp,
    null,
  );

  useEffect(() => {
    if (verifyState?.ok) {
      router.push(verifyState.next);
      router.refresh();
    }
  }, [router, verifyState]);

  const destination = sendState?.ok ? sendState.destination : null;

  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant={channel === "email" ? "default" : "outline"}
          onClick={() => setChannel("email")}
        >
          E-posta
        </Button>
        <Button
          type="button"
          variant={channel === "sms" ? "default" : "outline"}
          onClick={() => setChannel("sms")}
        >
          SMS
        </Button>
      </div>

      <form action={sendAction} className="flex flex-col gap-4">
        <input type="hidden" name="channel" value={channel} />
        {channel === "email" ? (
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
        ) : (
          <label className="flex flex-col gap-2">
            <span className="font-medium">Cep telefonu</span>
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
        )}
        {sendState && !sendState.ok ? (
          <p className="text-destructive" role="alert">
            {sendState.error}
          </p>
        ) : null}
        <Button type="submit" disabled={sendPending}>
          {sendPending ? "Gönderiliyor" : "Kod gönder"}
        </Button>
      </form>

      {destination ? (
        <form action={verifyAction} className="flex flex-col gap-4">
          <input type="hidden" name="channel" value={channel} />
          <input type="hidden" name="destination" value={destination} />
          <p className="text-muted">
            {channel === "email"
              ? `Kod ${destination} adresine gönderildi. E-postadaki bağlantıya da tıklayabilirsiniz.`
              : `Kod ${destination} numarasına gönderildi.`}
          </p>
          <label className="flex flex-col gap-2">
            <span className="font-medium">Doğrulama kodu</span>
            <input
              className={fieldClass}
              name="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              minLength={6}
              maxLength={8}
              placeholder="6 haneli kod"
            />
          </label>
          {verifyState && !verifyState.ok ? (
            <p className="text-destructive" role="alert">
              {verifyState.error}
            </p>
          ) : null}
          <Button type="submit" disabled={verifyPending}>
            {verifyPending ? "Kontrol ediliyor" : "Giriş yap"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
