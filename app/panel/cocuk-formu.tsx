"use client";

import { useActionState, useEffect, useRef } from "react";

import { addChild } from "@/app/panel/actions";
import { Button } from "@/components/ui/button";
import { GRADES, gradeLabel } from "@/lib/exam-kinds";

const fieldClass =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-lg text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CocukFormu() {
  const [state, action, pending] = useActionState(addChild, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Çocuğumu ekle</h2>
      <label className="flex flex-col gap-2">
        <span className="font-medium">Ad</span>
        <input
          className={fieldClass}
          name="first_name"
          autoComplete="off"
          required
          maxLength={40}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-medium">Sınıf</span>
        <select className={fieldClass} name="grade" required defaultValue="8">
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {gradeLabel(g)}
            </option>
          ))}
        </select>
      </label>
      {state && !state.ok ? (
        <p className="text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Ekleniyor" : "Kaydet"}
      </Button>
    </form>
  );
}
