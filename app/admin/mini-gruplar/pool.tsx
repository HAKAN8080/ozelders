"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { cancelGroup, createGroup, teacherOptions, type AdminResult, type TeacherOption } from "@/app/admin/mini-gruplar/actions";
import { ALL_SLOTS, covers, MG, scheduleText, type GroupSlot } from "@/lib/mini-grup";

export type PoolEntry = { id: string; name: string; preferred: unknown; created_at: string; note: string | null };

const DAY = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const key = (s: GroupSlot) => `${s.weekday}|${s.start}`;
const parse = (k: string): GroupSlot => ({ weekday: Number(k.split("|")[0]), start: k.split("|")[1] });

function nextMonday(): string {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return d.toISOString().slice(0, 10);
}

function Msg({ r }: { r: AdminResult | null }) {
  if (!r) return null;
  return (
    <p role={r.ok ? "status" : "alert"} className={`m-0 rounded-md px-4 py-3 text-[15px] ${r.ok ? "bg-primary-soft text-primary" : "bg-[#fdecea] text-destructive"}`}>
      {r.ok ? r.message : r.error}
    </p>
  );
}

export function Pool({ subject, subjectName, grade, entries }: { subject: string; subjectName: string; grade: number; entries: PoolEntry[] }) {
  const ranked = useMemo(
    () =>
      ALL_SLOTS.map((s) => ({ s, n: entries.filter((e) => covers(e.preferred, s)).length }))
        .filter((x) => x.n >= 2)
        .sort((a, b) => b.n - a.n || a.s.weekday - b.s.weekday || a.s.start.localeCompare(b.s.start)),
    [entries],
  );
  const [a, setA] = useState(ranked.at(0) ? key(ranked.at(0)!.s) : "");
  const [b, setB] = useState(ranked.find((x) => ranked.at(0) && x.s.weekday !== ranked.at(0)!.s.weekday) ? key(ranked.find((x) => x.s.weekday !== ranked.at(0)!.s.weekday)!.s) : "");
  const slots = [a, b].filter(Boolean).map(parse);
  const fits = (e: PoolEntry) => slots.length === 2 && slots.every((s) => covers(e.preferred, s));
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [teachers, setTeachers] = useState<TeacherOption[] | null>(null);
  const [teacher, setTeacher] = useState("");
  const [start, setStart] = useState(nextMonday());
  const [msg, setMsg] = useState<AdminResult | null>(null);
  const [pending, run] = useTransition();
  const router = useRouter();

  const toggle = (id: string) => {
    const n = new Set(picked);
    if (n.has(id)) n.delete(id);
    else if (n.size < MG.maxSize) n.add(id);
    setPicked(n);
  };
  const findTeachers = () =>
    run(async () => {
      setTeacher("");
      setTeachers(await teacherOptions(subject, grade, slots));
    });
  const create = () =>
    run(async () => {
      const r = await createGroup({ subject, grade, teacherId: teacher, schedule: slots, startsOn: start, waitlistIds: [...picked] });
      setMsg(r);
      if (r.ok) {
        setPicked(new Set());
        setTeachers(null);
        router.refresh();
      }
    });

  const slotSelect = (v: string, set: (x: string) => void, label: string) => (
    <label className="flex flex-col gap-1 text-[15px]">
      <span className="font-medium">{label}</span>
      <select
        value={v}
        onChange={(e) => {
          set(e.target.value);
          setTeachers(null);
        }}
        className="h-11 rounded-md border border-border bg-background px-3"
      >
        <option value="">Seç…</option>
        {ALL_SLOTS.map((s) => {
          const n = entries.filter((e) => covers(e.preferred, s)).length;
          return (
            <option key={key(s)} value={key(s)}>
              {DAY.at(s.weekday - 1)} {s.start} · {n} kişiye uyar
            </option>
          );
        })}
      </select>
    </label>
  );

  return (
    <article className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="m-0 text-xl font-semibold">
          {subjectName} · {grade}. sınıf
        </h3>
        <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${entries.length >= MG.minSize ? "bg-primary text-primary-foreground" : "bg-[#f1f3f2] text-muted"}`}>
          {entries.length} bekleyen{entries.length >= MG.minSize ? " · grup kurulabilir" : ""}
        </span>
      </div>
      {ranked.length ? (
        <p className="m-0 text-[15px] text-muted">
          En çok uyan saatler: {ranked.slice(0, 6).map((x) => `${DAY.at(x.s.weekday - 1)} ${x.s.start} (${x.n})`).join(" · ")}
        </p>
      ) : null}

      {entries.length >= MG.minSize ? (
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
            {slotSelect(a, setA, "1. ders saati")}
            {slotSelect(b, setB, "2. ders saati")}
            <label className="flex flex-col gap-1 text-[15px]">
              <span className="font-medium">Başlangıç tarihi</span>
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-11 rounded-md border border-border bg-background px-3" />
            </label>
          </div>
          <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
            <legend className="mb-1 text-[15px] font-medium">
              Öğrenciler ({picked.size}/{MG.maxSize}; en az {MG.minSize}) · ✓ iki saate de uyanlar
            </legend>
            {entries.map((e) => (
              <label key={e.id} className="flex cursor-pointer items-center gap-3 text-[15px]">
                <input type="checkbox" checked={picked.has(e.id)} onChange={() => toggle(e.id)} className="h-5 w-5 accent-[#0b4f2e]" />
                <span className={fits(e) ? "font-semibold" : "text-muted"}>
                  {fits(e) ? "✓ " : ""}
                  {e.name}
                </span>
                <span className="text-sm text-muted">{new Date(e.created_at).toLocaleDateString("tr-TR")}</span>
                {e.note ? <span className="truncate text-sm text-muted">· {e.note}</span> : null}
              </label>
            ))}
          </fieldset>
          <div className="flex flex-wrap items-end gap-3">
            <button type="button" disabled={pending || slots.length !== 2} onClick={findTeachers} className="h-11 rounded-md border border-border px-4 font-semibold hover:bg-primary-soft disabled:opacity-50">
              Uygun öğretmenleri bul
            </button>
            {teachers ? (
              teachers.length ? (
                <select value={teacher} onChange={(e) => setTeacher(e.target.value)} className="h-11 rounded-md border border-border bg-background px-3">
                  <option value="">Öğretmen seç…</option>
                  {teachers.map((t) => (
                    <option key={t.teacher_id} value={t.teacher_id} disabled={t.busy}>
                      {t.display_name}
                      {t.status === "golge" ? " (yeni)" : ""}
                      {t.busy ? " · bu saatte başka grubu var" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-[15px] text-destructive">Bu iki saatte müsait, branşı uyan öğretmen yok.</span>
              )
            ) : null}
            <button
              type="button"
              disabled={pending || !teacher || picked.size < MG.minSize || slots.length !== 2}
              onClick={create}
              className="h-11 rounded-md bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
            >
              Grubu kur ve davet gönder
            </button>
          </div>
          {slots.length === 2 ? <p className="m-0 text-sm text-muted">Seçili saatler: {scheduleText(slots)}</p> : null}
          <Msg r={msg} />
        </div>
      ) : (
        <p className="m-0 text-[15px] text-muted">
          {entries.map((e) => e.name).join(", ")} · grup için en az {MG.minSize} kişi gerekli.
        </p>
      )}
    </article>
  );
}

export function CancelGroupButton({ id }: { id: string }) {
  const [msg, setMsg] = useState<AdminResult | null>(null);
  const [pending, run] = useTransition();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Grup iptal edilsin mi? Öğrenciler bekleme listesine döner.")) return;
          run(async () => {
            const r = await cancelGroup(id);
            setMsg(r);
            if (r.ok) router.refresh();
          });
        }}
        className="self-start text-[15px] font-semibold text-destructive hover:underline"
      >
        Grubu iptal et
      </button>
      <Msg r={msg} />
    </div>
  );
}
