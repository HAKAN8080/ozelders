"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { markLesson, respondIntro, saveAvailability, updateProfile, type PanelResult, type Slot } from "@/app/ogretmen/actions";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const TIMES = Array.from({ length: 27 }, (_, i) => {
  const m = 8 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}); // 08:00 … 21:00
const sel = "h-10 rounded-md border border-border bg-background px-2 text-[15px] tabular-nums";
const btn = "rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60";

function useAction() {
  const [msg, setMsg] = useState<PanelResult | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const run = (fn: () => Promise<PanelResult>) => {
    setMsg(null);
    start(async () => {
      try {
        const r = await fn();
        setMsg(r);
        if (r.ok) router.refresh();
      } catch {
        setMsg({ ok: false, error: "İşlem yapılamadı. Sayfayı yenileyip yeniden dene." });
      }
    });
  };
  return { msg, pending, run };
}

function Msg({ msg }: { msg: PanelResult | null }) {
  if (!msg) return null;
  return (
    <p role={msg.ok ? "status" : "alert"} className={`m-0 rounded-md px-4 py-3 text-[15px] ${msg.ok ? "bg-primary-soft text-primary" : "bg-[#fdecea] text-destructive"}`}>
      {msg.ok ? msg.message : msg.error}
    </p>
  );
}

export function AvailabilityEditor({ initial }: { initial: Slot[] }) {
  const [slots, setSlots] = useState<Slot[]>(initial);
  const { msg, pending, run } = useAction();
  const hours = slots.reduce((n, s) => n + (toMin(s.end) - toMin(s.start)) / 60, 0);

  /** Günün ilk boş aralığına (en az 1, tercihen 2 saat) yeni saat ekler; son aralıktan sonrası önce denenir. */
  const add = (weekday: number) => {
    const day = slots.filter((s) => s.weekday === weekday).map((s) => [toMin(s.start), toMin(s.end)] as const);
    const free = (a: number, b: number) => day.every(([s, e]) => b <= s || a >= e);
    const lastEnd = Math.max(18 * 60, ...day.map(([, e]) => e));
    const order = [...TIMES.filter((t) => toMin(t) >= lastEnd), ...TIMES.filter((t) => toMin(t) < lastEnd)];
    for (const t of order) {
      const st = toMin(t);
      const next = Math.min(21 * 60, ...day.map(([s]) => s).filter((s) => s > st));
      const en = Math.min(st + 120, next);
      if (en - st >= 60 && free(st, en)) {
        setSlots([...slots, { weekday, start: t, end: fromMin(en) }]);
        return;
      }
    }
  };
  const upd = (i: number, k: "start" | "end", v: string) => setSlots(slots.map((s, j) => (j === i ? { ...s, [k]: v } : s)));

  return (
    <div className="flex flex-col gap-4">
      <ul className="m-0 flex list-none flex-col divide-y divide-[#eef2ef] rounded-[10px] border border-border p-0">
        {DAYS.map((d, di) => {
          const wd = di + 1;
          const rows = slots.map((s, i) => ({ s, i })).filter((x) => x.s.weekday === wd);
          return (
            <li key={d} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="w-full shrink-0 font-semibold sm:w-24">{d}</span>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                {rows.length === 0 ? <span className="text-[15px] text-muted">Ders yok</span> : null}
                {rows.map(({ s, i }) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-primary-soft px-2 py-1">
                    <select aria-label={`${d} başlangıç`} className={sel} value={s.start} onChange={(e) => upd(i, "start", e.target.value)}>
                      {TIMES.slice(0, -2).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    –
                    <select aria-label={`${d} bitiş`} className={sel} value={s.end} onChange={(e) => upd(i, "end", e.target.value)}>
                      {TIMES.slice(2).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      aria-label={`${d} ${s.start} aralığını sil`}
                      onClick={() => setSlots(slots.filter((_, j) => j !== i))}
                      className="px-1.5 text-lg leading-none text-muted hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button type="button" onClick={() => add(wd)} className="text-[15px] font-semibold text-primary hover:underline">
                + Saat ekle
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" disabled={pending} onClick={() => run(() => saveAvailability(slots))} className={btn}>
          {pending ? "Kaydediliyor…" : "Takvimi kaydet"}
        </button>
        <span className="text-[15px] text-muted">
          Haftada {hours.toLocaleString("tr-TR")} saat · dersler 50 dakika, 08:00–21:00 arası
        </span>
      </div>
      <Msg msg={msg} />
    </div>
  );
}

function fromMin(m: number) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function ProfileForm({ bio, video }: { bio: string; video: string }) {
  const [b, setB] = useState(bio);
  const [v, setV] = useState(video);
  const { msg, pending, run } = useAction();
  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Velilerin göreceği tanıtım metni</span>
        <textarea value={b} onChange={(e) => setB(e.target.value)} rows={5} maxLength={1200} className="rounded-lg border border-border p-3 leading-relaxed" />
        <span className="text-sm text-muted">{b.length}/1200</span>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Tanıtım videosu (isteğe bağlı)</span>
        <input value={v} onChange={(e) => setV(e.target.value)} inputMode="url" placeholder="https://…" className="h-11 rounded-lg border border-border px-3" />
      </label>
      <button type="button" disabled={pending} onClick={() => run(() => updateProfile(b, v))} className={`${btn} self-start`}>
        Profili kaydet
      </button>
      <Msg msg={msg} />
    </div>
  );
}

export function LessonActions({ id }: { id: string }) {
  const { msg, pending, run } = useAction();
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button type="button" disabled={pending} onClick={() => run(() => markLesson(id, "tamamlandi"))} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
          Yapıldı
        </button>
        <button type="button" disabled={pending} onClick={() => run(() => markLesson(id, "gelmedi"))} className="rounded-md border border-border px-3 py-2 text-sm font-semibold">
          Öğrenci gelmedi
        </button>
      </div>
      <Msg msg={msg} />
    </div>
  );
}

export function OfferActions({ id }: { id: string }) {
  const { msg, pending, run } = useAction();
  const [url, setUrl] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  return (
    <div className="flex flex-col gap-3">
      {rejecting ? (
        <div className="flex flex-wrap items-center gap-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="Veliye kısa not (isteğe bağlı)" className="h-11 min-w-0 flex-1 rounded-lg border border-border px-3" />
          <button type="button" disabled={pending} onClick={() => run(() => respondIntro(id, false, "", note))} className="rounded-md border border-destructive px-4 py-2.5 font-semibold text-destructive">
            Reddet
          </button>
          <button type="button" onClick={() => setRejecting(false)} className="px-2 font-semibold text-muted">
            Vazgeç
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" placeholder="Görüşme bağlantısı (isteğe bağlı) https://…" className="h-11 min-w-0 flex-1 rounded-lg border border-border px-3" />
          <button type="button" disabled={pending} onClick={() => run(() => respondIntro(id, true, url, ""))} className={btn}>
            Kabul et
          </button>
          <button type="button" onClick={() => setRejecting(true)} className="rounded-md border border-border px-4 py-3 font-semibold">
            Uygun değilim
          </button>
        </div>
      )}
      <Msg msg={msg} />
    </div>
  );
}
