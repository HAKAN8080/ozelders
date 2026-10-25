"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { cancelIntro, choosePackage, loadSlots, reopenRequest, requestIntro, type ActResult } from "@/app/panel/talep/actions";

export type Option = {
  teacher_id: string;
  display_name: string;
  bio: string | null;
  intro_video_url: string | null;
  experience_years: number | null;
  department: string | null;
  is_new: boolean;
  overlap_minutes: number;
  recommended: boolean;
};

const dayFmt = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Istanbul" });
const timeFmt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });

function Msg({ msg }: { msg: ActResult | null }) {
  if (!msg) return null;
  return (
    <p role={msg.ok ? "status" : "alert"} className={`m-0 rounded-md px-4 py-3 text-[15px] ${msg.ok ? "bg-primary-soft text-primary" : "bg-[#fdecea] text-destructive"}`}>
      {msg.ok ? msg.message : msg.error}
    </p>
  );
}

export function TeacherList({ requestId, options, locked }: { requestId: string; options: Option[]; locked: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [msg, setMsg] = useState<ActResult | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const choose = (id: string) => {
    setMsg(null);
    if (open === id) return setOpen(null);
    setOpen(id);
    setSlots(null);
    start(async () => setSlots(await loadSlots(requestId, id)));
  };
  const send = (teacher: string, at: string) =>
    start(async () => {
      const r = await requestIntro(requestId, teacher, at);
      setMsg(r);
      if (r.ok) {
        setOpen(null);
        router.refresh();
      }
    });

  const byDay = new Map<string, string[]>();
  for (const s of slots ?? []) {
    const k = dayFmt.format(new Date(s));
    byDay.set(k, [...(byDay.get(k) ?? []), s]);
  }

  return (
    <div className="flex flex-col gap-4">
      <Msg msg={msg} />
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {options.map((o) => (
          <li
            key={o.teacher_id}
            className={`flex flex-col gap-4 rounded-[10px] border bg-background p-5 sm:p-6 ${o.recommended ? "border-primary shadow-[0_0_0_1px_var(--color-primary)]" : "border-border"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="m-0 text-xl font-semibold">{o.display_name}</h3>
                  {o.recommended ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[13px] font-semibold text-primary-foreground">
                      <span aria-hidden="true">★</span> Sistem önerisi
                    </span>
                  ) : null}
                  {o.is_new ? <span className="rounded-full bg-[#f6f8f7] px-3 py-1 text-[13px] font-semibold text-muted">Yeni öğretmen</span> : null}
                </div>
                <span className="text-[15px] text-muted">
                  {[o.department, o.experience_years !== null ? `${o.experience_years} yıl deneyim` : null, `haftada ${Math.round(o.overlap_minutes / 60)} saat ortak zaman`]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              <button
                type="button"
                disabled={locked}
                onClick={() => choose(o.teacher_id)}
                className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
              >
                {open === o.teacher_id ? "Kapat" : "Tanışma saati seç"}
              </button>
            </div>
            {o.bio ? <p className="m-0 text-[16px] leading-relaxed text-[#3d4743]">{o.bio}</p> : null}
            {o.intro_video_url ? (
              <a href={o.intro_video_url} target="_blank" rel="noopener noreferrer" className="self-start font-semibold text-primary hover:underline">
                Tanıtım videosunu izle →
              </a>
            ) : null}
            {open === o.teacher_id ? (
              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <span className="text-[15px] font-medium">Ücretsiz 20 dakikalık tanışma dersi için bir saat seç</span>
                {slots === null ? (
                  <span className="text-[15px] text-muted">Saatler yükleniyor…</span>
                ) : slots.length === 0 ? (
                  <span className="text-[15px] text-muted">Önümüzdeki 7 günde seçtiğin saatlerle ortak boş zaman yok. Saat tercihini genişletip yeniden dene.</span>
                ) : (
                  [...byDay.entries()].map(([day, list]) => (
                    <div key={day} className="flex flex-wrap items-center gap-2">
                      <span className="w-full text-[15px] font-semibold sm:w-48">{day}</span>
                      {list.map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={pending}
                          onClick={() => send(o.teacher_id, s)}
                          className="rounded-md border border-primary px-3 py-2 text-[15px] font-semibold text-primary tabular-nums hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                        >
                          {timeFmt.format(new Date(s))}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CancelButton({ offerId, requestId, label }: { offerId: string; requestId: string; label: string }) {
  const [msg, setMsg] = useState<ActResult | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await cancelIntro(offerId, requestId);
            setMsg(r);
            if (r.ok) router.refresh();
          })
        }
        className="self-start rounded-md border border-[rgb(242_245_241/0.5)] px-4 py-2.5 font-semibold text-white hover:bg-white/10"
      >
        {label}
      </button>
      <Msg msg={msg} />
    </div>
  );
}

type Product = { code: string; name: string; lessons: number; price: number; days: number };
const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 });

export function PackageChooser({ requestId, products, current }: { requestId: string; products: Product[]; current: { code: string; price: number; lessons: number } | null }) {
  const [msg, setMsg] = useState<ActResult | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const run = (fn: () => Promise<ActResult>) =>
    start(async () => {
      const r = await fn();
      setMsg(r);
      if (r.ok) router.refresh();
    });
  return (
    <div className="flex flex-col gap-4">
      {current ? (
        <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px] text-primary" role="status">
          Seçimin: <strong>{products.find((p) => p.code === current.code)?.name ?? current.code}</strong> · {current.lessons} ders · {tl.format(current.price)}. Ödeme
          adımı için sana e-posta göndereceğiz; istersen aşağıdan değiştirebilirsin.
        </p>
      ) : null}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
        {products.map((p) => {
          const on = current?.code === p.code;
          return (
            <div key={p.code} className={`flex flex-col gap-2 rounded-[10px] border p-4 ${on ? "border-primary bg-primary-soft" : "border-border"}`}>
              <span className="font-semibold">{p.name}</span>
              <span className="font-serif text-2xl font-bold tabular-nums">{tl.format(p.price)}</span>
              <span className="text-sm text-muted">
                {p.lessons} ders · ders başı {tl.format(p.price / p.lessons)} · {Math.round(p.days / 7)} hafta
              </span>
              <button
                type="button"
                disabled={pending || on}
                onClick={() => run(() => choosePackage(requestId, p.code))}
                className="mt-1 rounded-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
              >
                {on ? "Seçildi ✓" : "Bu paketi seç"}
              </button>
            </div>
          );
        })}
      </div>
      <button type="button" disabled={pending} onClick={() => run(() => reopenRequest(requestId))} className="self-start text-[15px] font-semibold text-muted hover:text-primary hover:underline">
        Devam etmek istemiyorum, başka bir öğretmenle tanışayım
      </button>
      <Msg msg={msg} />
    </div>
  );
}
