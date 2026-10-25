"use client";

import { EXAM_KINDS, GRADES, gradeLabel, kindInfo, penaltyLabel, SUBJECT_GROUPS, SUBJECTS, type ExamKind } from "@/lib/exam-kinds";

const field =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export type ExamRules = { kind: ExamKind; grade: number; option_count: number; wrong_penalty: number };

/** Sınav türü, sınıf, şık sayısı ve yanlış cezası. Tür seçilince diğerleri varsayılana çekilir. */
export function ExamRulesFields({ value, onChange }: { value: ExamRules; onChange: (v: ExamRules) => void }) {
  return (
    <>
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Sınav türü</span>
        <select
          className={field}
          value={value.kind}
          onChange={(e) => {
            const k = kindInfo(e.target.value);
            onChange({ kind: k.code, grade: k.grade, option_count: k.optionCount, wrong_penalty: k.penalty });
          }}
        >
          {EXAM_KINDS.map((k) => (
            <option key={k.code} value={k.code}>
              {k.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Sınıf</span>
        <select className={field} value={value.grade} onChange={(e) => onChange({ ...value, grade: Number(e.target.value) })}>
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {gradeLabel(g)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Şık sayısı</span>
        <select className={field} value={value.option_count} onChange={(e) => onChange({ ...value, option_count: Number(e.target.value) })}>
          <option value={4}>4 şık (A–D)</option>
          <option value={5}>5 şık (A–E)</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[15px] font-medium">Net hesabı</span>
        <select className={field} value={value.wrong_penalty} onChange={(e) => onChange({ ...value, wrong_penalty: Number(e.target.value) })}>
          {[3, 4, 0].map((p) => (
            <option key={p} value={p}>
              {penaltyLabel(p)}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

/** Ders seçici (gruplu). `taken` içindeki kodlar başka bölümde kullanıldığı için gizlenir. */
export function SubjectSelect({
  value,
  taken,
  onChange,
  placeholder,
  label = "Bölüm (ders)",
}: {
  value: string;
  taken: string[];
  onChange: (code: string, name: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const groups = SUBJECT_GROUPS;
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => {
        const s = SUBJECTS.find((x) => x.code === e.target.value);
        if (s) onChange(s.code, s.name);
      }}
      className="h-10 rounded-md border border-border bg-background px-2 text-sm font-semibold"
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {groups.map((g) => (
        <optgroup key={g} label={g}>
          {SUBJECTS.filter((s) => s.group === g && (s.code === value || !taken.includes(s.code))).map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
