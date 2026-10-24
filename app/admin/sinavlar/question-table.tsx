"use client";

import { useId, useState } from "react";

import { TOPICS } from "@/lib/topic-guess";

export type EditableQuestion = { no: number; correct: string; topic: string; snippet?: string };
export type EditableSection = { code: string; name: string; questions: EditableQuestion[] };

const LETTERS = ["A", "B", "C", "D", "E"];
const cell = "h-10 rounded-md border border-border bg-background px-2 text-[15px] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/** Bir bölümün soru soru cevap + konu tablosu. Cevap anahtarı yapıştırma kısayolu içerir. */
export function QuestionTable({
  section,
  onChange,
  fixedCount = false,
}: {
  section: EditableSection;
  onChange: (next: EditableSection) => void;
  /** Yayındaki sınavda soru sayısı değişmez; yapıştırma yalnızca mevcut soruları doldurur. */
  fixedCount?: boolean;
}) {
  const listId = useId();
  const [paste, setPaste] = useState("");
  const topics = TOPICS[section.code] ?? [];
  const missing = section.questions.filter((q) => !q.correct).length;
  const noTopic = section.questions.filter((q) => !q.topic).length;
  const hasSnippets = section.questions.some((q) => q.snippet);

  function setQ(i: number, patch: Partial<EditableQuestion>) {
    const qs = section.questions.slice();
    qs[i] = { ...qs[i], ...patch };
    onChange({ ...section, questions: qs });
  }

  function applyPaste() {
    const letters = paste.toUpperCase().replace(/[^A-E]/g, "").split("");
    if (!letters.length) return;
    const count = fixedCount ? section.questions.length : Math.max(letters.length, section.questions.length);
    const qs = Array.from({ length: count }, (_, i) => ({
      no: i + 1,
      correct: letters[i] ?? section.questions[i]?.correct ?? "",
      topic: section.questions[i]?.topic ?? "",
      snippet: section.questions[i]?.snippet,
    }));
    onChange({ ...section, questions: qs });
    setPaste("");
  }

  return (
    <section className="flex flex-col gap-4 rounded-[10px] border border-border bg-background p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-xl font-semibold">{section.name}</h2>
          <p className="m-0 text-sm text-muted">
            {section.questions.length} soru
            {missing ? <span className="font-semibold text-destructive"> · {missing} cevap eksik</span> : " · cevaplar tamam"}
            {noTopic ? ` · ${noTopic} soruda konu boş` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`${listId}-paste`}>
            Cevap anahtarını yapıştır
          </label>
          <input
            id={`${listId}-paste`}
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder="Cevapları yapıştır: BBDCB…"
            className={`${cell} w-56`}
          />
          <button type="button" onClick={applyPaste} className="h-10 rounded-md border border-primary px-3 text-sm font-semibold text-primary hover:bg-primary-soft">
            Uygula
          </button>
        </div>
      </div>

      <datalist id={listId}>
        {topics.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      <div className="overflow-x-auto">
        <table className={`w-full ${hasSnippets ? "min-w-[640px]" : "max-w-[560px]"} border-collapse text-left`}>
          <thead>
            <tr className="border-b-2 border-[#111111] text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
              <th className="w-14 py-2 pr-3 font-semibold">No</th>
              <th className="w-28 py-2 pr-3 font-semibold">Cevap</th>
              <th className="w-72 py-2 pr-3 font-semibold">Konu</th>
              {hasSnippets ? <th className="py-2 font-semibold">Soru metninin başı</th> : null}
            </tr>
          </thead>
          <tbody>
            {section.questions.map((q, i) => (
              <tr key={q.no} className="border-b border-[#eef2ef] align-top">
                <td className="py-2 pr-3 pt-4 font-semibold tabular-nums">{q.no}.</td>
                <td className="py-2 pr-3">
                  <select
                    aria-label={`${q.no}. soru cevabı`}
                    value={q.correct}
                    onChange={(e) => setQ(i, { correct: e.target.value })}
                    className={`${cell} w-20 ${q.correct ? "" : "border-destructive"}`}
                  >
                    <option value="">–</option>
                    {LETTERS.map((L) => (
                      <option key={L} value={L}>
                        {L}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-3">
                  <input
                    aria-label={`${q.no}. soru konusu`}
                    list={listId}
                    value={q.topic}
                    onChange={(e) => setQ(i, { topic: e.target.value })}
                    placeholder="Konu seç ya da yaz"
                    className={`${cell} w-full`}
                  />
                </td>
                {hasSnippets ? (
                  <td className="py-2 pt-3 text-sm leading-snug text-muted">
                    {q.snippet ? <span title={q.snippet}>{q.snippet.slice(0, 140)}{q.snippet.length > 140 ? "…" : ""}</span> : "—"}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
