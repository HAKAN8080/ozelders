"use client";

import Link from "next/link";
import { useState } from "react";

import { gradeLabel, kindInfo, penaltyLabel } from "@/lib/exam-kinds";
import type { PublicExam } from "@/lib/exams";

const totalQuestions = (e: PublicExam) => e.sections.reduce((n, s) => n + s.question_count, 0);

const GROUPS = [
  { key: "hepsi", label: "Tümü", test: () => true },
  { key: "ilkokul", label: "İlkokul (3–4)", test: (e: PublicExam) => e.grade <= 4 },
  { key: "ortaokul", label: "Ortaokul · LGS (5–8)", test: (e: PublicExam) => e.kind === "lgs" || (e.grade >= 5 && e.grade <= 8) },
  { key: "lise", label: "Lise", test: (e: PublicExam) => e.grade >= 9 && !["tyt", "ayt", "ydt"].includes(e.kind) },
  { key: "yks", label: "YKS · TYT-AYT", test: (e: PublicExam) => ["tyt", "ayt", "ydt"].includes(e.kind) },
] as const;

export function ExamFilter({ exams }: { exams: PublicExam[] }) {
  const [group, setGroup] = useState<(typeof GROUPS)[number]["key"]>("hepsi");
  const visible = exams.filter(GROUPS.find((g) => g.key === group)!.test);
  // Yalnızca içinde sınav olan grupları göster
  const groups = GROUPS.filter((g) => g.key === "hepsi" || exams.some(g.test));

  return (
    <div className="flex flex-col gap-6">
      {groups.length > 2 ? (
        <div role="tablist" aria-label="Deneme grubu" className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={group === g.key}
              onClick={() => setGroup(g.key)}
              className={`rounded-full px-4 py-2 text-[15px] font-semibold ${
                group === g.key ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-primary-soft"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      ) : null}
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 p-0">
        {visible.map((e) => (
          <li key={e.id} className="tahta flex flex-col gap-5 rounded-[10px] p-7 text-[#f2f5f1] sm:p-8">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#cfe3d6]">
                {kindInfo(e.kind).short} · {gradeLabel(e.grade)}
              </span>
              <span className="font-hand text-2xl text-white">ücretsiz!</span>
            </div>
            <h2 className="m-0 font-serif text-3xl leading-[1.15] font-bold">{e.title}</h2>
            <dl className="m-0 grid grid-cols-3 gap-3 border-y border-dashed border-[rgb(242_245_241/0.35)] py-4">
              {[
                [String(totalQuestions(e)), "soru"],
                [String(e.duration_min), "dakika"],
                [String(e.sections.length), "ders"],
              ].map(([n, label]) => (
                <div key={label} className="flex flex-col-reverse">
                  <dt className="text-sm text-[#cfe3d6]">{label}</dt>
                  <dd className="m-0 text-3xl font-semibold tabular-nums">{n}</dd>
                </div>
              ))}
            </dl>
            <p className="m-0 text-base text-[#e3eee7]">
              {e.subtitle ? `${e.subtitle} · ` : ""}
              {penaltyLabel(e.wrong_penalty)}
            </p>
            <Link
              href={`/deneme/${e.slug}`}
              className="self-start rounded-md bg-white px-6 py-3.5 text-[17px] font-semibold text-primary hover:bg-primary-soft"
            >
              Başla →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
