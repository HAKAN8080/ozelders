"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { ScoreData } from "@/lib/score-data";
import {
  estimate,
  FAMILY_LABEL,
  fmtInt,
  fmtPct,
  fmtScore,
  lookup,
  netsToClose,
  obpBonus,
  type Family,
  type SectionNet,
  type Target,
} from "@/lib/score-estimate";

const eyebrow = "text-sm font-semibold uppercase tracking-[0.08em]";

export function ScoreEstimate({
  families,
  sections,
  data,
  next,
  findHref,
  loggedIn,
}: {
  families: Family[];
  sections: SectionNet[];
  data: ScoreData;
  /** Kayıt/giriş sonrası dönülecek adres */
  next: string;
  findHref: string;
  loggedIn: boolean;
}) {
  const results = useMemo(
    () =>
      families
        .map((f) => {
          const model = data.models.find((m) => m.family === f);
          return model ? { model, est: estimate(sections, model) } : null;
        })
        .filter((x): x is NonNullable<typeof x> => !!x),
    [families, sections, data.models],
  );
  const [tab, setTab] = useState(0);
  const [diploma, setDiploma] = useState(80);
  const [targetId, setTargetId] = useState("");

  if (!results.length) return null;

  // Mini deneme: resmi formatta değil
  if (results.every((r) => !r.est)) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-border bg-background p-6">
        <p className="m-0 max-w-[40em] text-[15px] leading-relaxed text-[#3d4743]">
          <strong>Puan tahmini</strong> yalnızca tam formatlı denemelerde hesaplanır (bu deneme kısa bir konu denemesi). Tam denemeyi çöz,
          tahmini puanını ve hedef okuluna ne kadar uzak olduğunu gör.
        </p>
        <Link href="/deneme" className="rounded-md border border-primary px-5 py-3 font-semibold text-primary hover:bg-primary-soft">
          Tam denemeler
        </Link>
      </section>
    );
  }

  const current = results[Math.min(tab, results.length - 1)];
  const { model, est } = current;
  if (!est) return null;
  const isLgs = model.family === "lgs";
  const dist = data.distributions[model.family] ?? {};

  // LGS: MSP → yüzdelik. YKS: ham puan → sıra; yerleştirme (OBP eklenmiş) → sıra
  const placement = isLgs ? est.score : est.score + obpBonus(diploma);
  const percentile = isLgs ? lookup(dist.msp ?? [], est.score) : null;
  const rank = !isLgs ? lookup(dist.yerlestirme ?? dist.ham ?? [], placement) : null;

  const targets = data.targets.filter((t) => t.family === model.family);
  const target = targets.find((t) => t.id === targetId) ?? null;
  // Öneri: tahminin hemen üstündeki 3 hedef (ulaşılabilir hedefler)
  const above = targets
    .filter((t) => t.base_score > placement)
    .sort((a, b) => a.base_score - b.base_score)
    .slice(0, 3);

  const gap = target ? target.base_score - placement : 0;
  const plan = target && gap > 0 ? netsToClose(gap, sections, model) : [];
  const planNets = plan.reduce((n, p) => n + p.nets, 0);
  const reachable = target && gap > 0 && plan.length && planNets > 0 && gap - plan.reduce((n, p) => n + p.nets * model.coefs[p.code], 0) <= 0.5;

  const assumedNames = est.assumed.length;
  const sectionNames = sections.filter((s) => est.used.includes(s.code)).map((s) => s.name);

  return (
    <section className="tahta flex flex-col gap-6 rounded-[10px] p-6 text-[#f2f5f1] sm:p-9" aria-label="Puan tahmini">
      {results.length > 1 ? (
        <div role="tablist" aria-label="Puan türü" className="flex flex-wrap gap-2">
          {results.map((r, i) => (
            <button
              key={r.model.family}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => {
                setTab(i);
                setTargetId("");
              }}
              className={`rounded-full px-4 py-2 text-[15px] font-semibold ${i === tab ? "bg-white text-primary" : "border border-[rgb(242_245_241/0.4)] text-white hover:bg-white/10"}`}
            >
              {r.model.family.toUpperCase()}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
        <div className="flex flex-col gap-1">
          <span className={`${eyebrow} text-[#cfe3d6]`}>
            Tahmini {FAMILY_LABEL[model.family]} · {model.year} sonuçlarına göre
          </span>
          <span className="font-serif text-[64px] leading-none font-bold tabular-nums sm:text-[76px]">{fmtScore(est.score)}</span>
          {assumedNames ? (
            <span className="text-[15px] text-[#cfe3d6]">
              {fmtInt(est.low)} – {fmtInt(est.high)} aralığında
            </span>
          ) : null}
        </div>
        {percentile !== null ? (
          <div className="flex flex-col gap-1">
            <span className={`${eyebrow} text-[#cfe3d6]`}>Türkiye geneli</span>
            <span className="font-serif text-[44px] leading-none font-bold tabular-nums">%{fmtPct(percentile)}</span>
            <span className="text-[15px] text-[#cfe3d6]">yüzdelik dilim</span>
          </div>
        ) : null}
        {rank !== null ? (
          <div className="flex flex-col gap-1">
            <span className={`${eyebrow} text-[#cfe3d6]`}>Tahmini başarı sırası</span>
            <span className="font-serif text-[44px] leading-none font-bold tabular-nums">≈ {fmtInt(rank)}</span>
            <span className="text-[15px] text-[#cfe3d6]">yerleştirme puanı {fmtScore(placement)}</span>
          </div>
        ) : null}
      </div>

      {assumedNames ? (
        <p className="m-0 max-w-[48em] text-[15px] leading-relaxed text-[#dce9e0]">
          Bu denemede yalnızca {sectionNames.join(" ve ")} vardı. Diğer derslerde de aynı başarıyı gösterdiğin varsayıldı; o derslerde hiç net
          yapmazsan {fmtInt(est.low)}, hepsini doğru yaparsan {fmtInt(est.high)} olur.
        </p>
      ) : null}

      {!isLgs ? (
        <label className="flex flex-wrap items-center gap-3 text-[15px]">
          <span>Diploma notun (OBP için):</span>
          <input
            type="number"
            min={50}
            max={100}
            step={1}
            value={diploma}
            onChange={(e) => setDiploma(Number(e.target.value) || 80)}
            className="h-10 w-20 rounded-md border border-[rgb(242_245_241/0.4)] bg-white/10 px-2 text-white tabular-nums"
          />
          <span className="text-[#cfe3d6]">+{fmtScore(obpBonus(diploma))} puan eklenir</span>
        </label>
      ) : null}

      {targets.length ? (
        <div className="flex flex-col gap-4 rounded-[10px] bg-[rgb(0_0_0/0.18)] p-5 sm:p-6">
          <label className="flex flex-col gap-2">
            <span className="text-lg font-semibold">{isLgs ? "Hedef lisen hangisi?" : "Hedef bölümün hangisi?"}</span>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="h-12 max-w-full rounded-lg border-0 bg-white px-3 text-base text-foreground"
            >
              <option value="">Seç…</option>
              {groupTargets(targets, isLgs).map(([group, list]) => (
                <optgroup key={group} label={group}>
                  {list.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.institution}
                      {t.program && !isLgs ? ` – ${t.program}` : ""} · {fmtScore(t.base_score)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          {!target && above.length ? (
            <div className="flex flex-wrap items-center gap-2 text-[15px]">
              <span className="text-[#cfe3d6]">Sana en yakın hedefler:</span>
              {above.map((t) => (
                <button key={t.id} type="button" onClick={() => setTargetId(t.id)} className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20">
                  {short(t, isLgs)} · {fmtInt(t.base_score)}
                </button>
              ))}
            </div>
          ) : null}

          {target ? (
            <div className="flex flex-col gap-2">
              <p className="m-0 text-[15px] text-[#cfe3d6]">
                {target.institution}
                {target.program ? ` · ${target.program}` : ""} — {target.year} taban puanı <strong className="text-white">{fmtScore(target.base_score)}</strong>
                {target.rank_value !== null
                  ? isLgs
                    ? ` (%${fmtPct(target.rank_value)})`
                    : ` (sıra ${fmtInt(target.rank_value)})`
                  : ""}
              </p>
              {gap <= 0 ? (
                <p className="m-0 font-serif text-2xl font-bold">Bu tahminle taban puanının {fmtScore(-gap)} puan üstündesin ✓</p>
              ) : (
                <>
                  <p className="m-0 font-serif text-2xl leading-snug font-bold sm:text-[28px]">
                    {fmtScore(gap)} puan uzaktasın
                    {reachable ? ` — yaklaşık ${fmtNet(planNets)} net daha (${plan.map((p) => `${p.name} ${fmtNet(p.nets)}`).join(", ")}).` : "."}
                  </p>
                  {!reachable ? (
                    <p className="m-0 text-[15px] text-[#dce9e0]">
                      Bu denemedeki derslerle kapanmayacak kadar büyük bir açık; diğer derslerde de net artışı gerekiyor.
                    </p>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="m-0 max-w-[40em] text-sm leading-relaxed text-[#cfe3d6]">
          Tahmindir: {model.year} sınavının sonuçlarından çıkarılan katsayılarla hesaplanır. Gerçek puan sınavın zorluğuna ve tüm adayların
          başarısına göre birkaç puan değişebilir.
        </p>
        <Link
          href={loggedIn ? findHref : `/kayit?next=${encodeURIComponent(next)}`}
          className="rounded-md bg-white px-5 py-3.5 font-semibold text-primary hover:bg-primary-soft"
        >
          {loggedIn ? "Açığı kapatacak öğretmeni bul" : "Hangi konulardan puan kazanırım? Ücretsiz gör"}
        </Link>
      </div>
    </section>
  );
}

function fmtNet(n: number) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(n);
}

function short(t: Target, isLgs: boolean) {
  return isLgs ? t.institution.replace(/ Lisesi/, " L.") : `${t.institution} ${t.program ?? ""}`.trim();
}

function groupTargets(targets: Target[], isLgs: boolean): [string, Target[]][] {
  const m = new Map<string, Target[]>();
  const c = new Intl.Collator("tr");
  for (const t of [...targets].sort((a, b) => c.compare(a.institution, b.institution))) {
    const k = isLgs ? (t.city ?? "Diğer") : (t.program?.replace(/\s*\(.*$/, "") ?? "Diğer");
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(t);
  }
  return [...m.entries()].sort((a, b) => c.compare(a[0], b[0]));
}
