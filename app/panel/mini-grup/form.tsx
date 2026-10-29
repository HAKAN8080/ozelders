"use client";

import { useActionState, useState } from "react";

import { joinWaitlist } from "@/app/panel/mini-grup/actions";
import { DAYS, subjectsForGrade, WINDOWS } from "@/lib/requests";

const field =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type Child = { id: string; first_name: string; grade: number };

export function MiniGrupForm({ kids }: { kids: Child[] }) {
  const [state, action, pending] = useActionState(joinWaitlist, null);
  const [childId, setChildId] = useState(kids[0]?.id ?? "");
  const child = kids.find((k) => k.id === childId) ?? kids[0];
  const subjects = subjectsForGrade(child.grade);
  const [subject, setSubject] = useState("");
  const [prefs, setPrefs] = useState<Set<string>>(new Set());
  const toggle = (k: string) => {
    const n = new Set(prefs);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setPrefs(n);
  };

  return (
    <form action={action} className="flex flex-col gap-7">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Çocuğun</span>
          <select
            name="student_id"
            value={childId}
            onChange={(e) => {
              setChildId(e.target.value);
              setSubject("");
            }}
            className={field}
          >
            {kids.map((k) => (
              <option key={k.id} value={k.id}>
                {k.first_name} · {k.grade}. sınıf
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[15px] font-medium">Ders</span>
          <select name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} className={field}>
            <option value="" disabled>
              Seç…
            </option>
            {subjects.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
        <legend className="mb-1 text-[15px] font-medium">
          Hangi gün ve saatler uygun? Ne kadar çok seçersen grup o kadar hızlı kurulur.
        </legend>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-[15px]">
            <thead>
              <tr>
                <th className="py-1.5 pr-3 text-left font-medium text-muted">Gün</th>
                {WINDOWS.map((w) => (
                  <th key={w.label} className="px-1 py-1.5 font-medium text-muted">
                    {w.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((d, i) => (
                <tr key={d} className="border-t border-[#eef2ef]">
                  <td className="py-1.5 pr-3 font-medium">{d}</td>
                  {WINDOWS.map((w) => {
                    const k = `${i + 1}|${w.from}|${w.to}`;
                    const on = prefs.has(k);
                    return (
                      <td key={k} className="px-1 py-1.5 text-center">
                        <label
                          className={`relative inline-flex h-9 w-full min-w-16 cursor-pointer items-center justify-center rounded-md border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-primary-soft"}`}
                        >
                          <input type="checkbox" name="pref" value={k} checked={on} onChange={() => toggle(k)} className="sr-only" aria-label={`${d} ${w.label}`} />
                          {on ? "✓" : ""}
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <span className="text-sm text-muted">Boş bırakırsan “fark etmez” kabul ederiz.</span>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Not (isteğe bağlı)</span>
        <textarea name="note" rows={2} maxLength={500} className="rounded-lg border border-border px-4 py-3 leading-relaxed" placeholder="ör. Kesirlerde zorlanıyor." />
        <span className="text-sm text-muted">Telefon, e-posta ya da soyad yazma.</span>
      </label>

      {state && !state.ok ? (
        <p className="m-0 rounded-md bg-[#fdecea] px-4 py-3 text-[15px] text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending || !subject} className="self-start rounded-md bg-primary px-6 py-4 text-[17px] font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60">
        {pending ? "Kaydediliyor…" : "Bekleme listesine yaz"}
      </button>
    </form>
  );
}
