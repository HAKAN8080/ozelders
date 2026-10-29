"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselExam = {
  slug: string;
  title: string;
  meta: string;
  questions: number;
  duration: number;
  sections: number;
  detail: string;
};

const eyebrow = "text-sm font-semibold uppercase tracking-[0.08em]";
const INTERVAL = 6000;

export function DenemeCarousel({ exams }: { exams: CarouselExam[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = exams.length;

  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(m.matches);
    set();
    m.addEventListener("change", set);
    return () => m.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (n < 2 || paused || reduced) return;
    const t = setInterval(() => go(1), INTERVAL);
    return () => clearInterval(t);
  }, [n, paused, reduced, go]);

  const e = exams.at(i) ?? exams.at(0)!;

  return (
    <div
      className="tahta flex min-w-0 flex-[1_1_400px] flex-col gap-5 rounded-[10px] p-7 text-[#f2f5f1] shadow-[0_1px_0_#083b22,0_18px_40px_rgb(11_79_46/0.18)] sm:p-9"
      role="region"
      aria-roledescription="carousel"
      aria-label="Ücretsiz denemeler"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(ev) => {
        touchX.current = ev.touches[0]?.clientX ?? null;
        setPaused(true);
      }}
      onTouchEnd={(ev) => {
        const x0 = touchX.current;
        const x1 = ev.changedTouches[0]?.clientX;
        if (x0 != null && x1 != null && Math.abs(x1 - x0) > 40)
          go(x1 < x0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className={`${eyebrow} text-[13px] text-[#cfe3d6]`}>
          Ücretsiz denemeler
          {n > 1 ? (
            <span className="ml-2 tabular-nums text-[#9fc2ac]">
              {i + 1} / {n}
            </span>
          ) : null}
        </span>
        <span className="font-hand text-2xl text-white">ücretsiz!</span>
      </div>

      <div
        key={e.slug}
        aria-live={paused ? "polite" : "off"}
        className="flex animate-[fadein_.45s_ease] flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <h2 className="m-0 min-h-[2.3em] font-serif text-[34px] leading-[1.15] font-bold">
            {e.title}
          </h2>
          <p className="m-0 text-[15px] text-[#cfe3d6]">{e.meta}</p>
        </div>
        {e.questions ? (
          <dl className="m-0 grid grid-cols-3 gap-3 border-y border-dashed border-[rgb(242_245_241/0.35)] py-4">
            {(
              [
                [e.questions, "soru"],
                [e.duration, "dakika"],
                [e.sections, "ders"],
              ] as const
            ).map(([v, label]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="text-sm text-[#cfe3d6]">{label}</dt>
                <dd className="m-0 text-3xl font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <p className="m-0 min-h-[3.2em] text-base leading-relaxed text-[#e3eee7]">
          {e.detail}
        </p>
        <Link
          href={e.slug ? `/deneme/${e.slug}` : "/deneme"}
          className="self-start rounded-md bg-white px-6 py-3.5 text-[17px] font-semibold text-primary hover:bg-primary-soft"
        >
          Başla →
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 -rotate-[1.5deg] font-hand text-[22px] text-white">
          kayıt olmadan başlayabilirsin ↗
        </p>
        {n > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Önceki deneme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(242_245_241/0.45)] text-lg hover:bg-white/10"
            >
              ‹
            </button>
            <div className="flex gap-1.5">
              {exams.map((x, j) => (
                <button
                  key={x.slug}
                  type="button"
                  onClick={() => setI(j)}
                  aria-label={`${j + 1}. deneme: ${x.title}`}
                  aria-current={j === i}
                  className={`h-2.5 rounded-full transition-all ${j === i ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Sonraki deneme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(242_245_241/0.45)] text-lg hover:bg-white/10"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
