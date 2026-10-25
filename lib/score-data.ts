import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

import type { Database } from "@/lib/database.types";
import type { DistributionRow, Family, ScoreModel, Target } from "@/lib/score-estimate";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

export type ScoreData = {
  models: ScoreModel[];
  /** family → basis → satırlar */
  distributions: Record<string, Record<string, DistributionRow[]>>;
  targets: Target[];
};

const EMPTY: ScoreData = { models: [], distributions: {}, targets: [] };

/**
 * Puan tahmini verileri (herkese açık, saatlik önbellek). Her puan türünün EN SON yılı kullanılır.
 * Admin güncelleyince updateTag("scores") ile yenilenir.
 */
export async function getScoreData(families: Family[]): Promise<ScoreData> {
  "use cache";
  cacheLife("hours");
  cacheTag("scores");
  if (!families.length) return EMPTY;

  const sb = createClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: modelRows, error } = await sb
    .from("score_models")
    .select("family, year, base, coefs, question_counts, means, min_score, max_score")
    .in("family", families)
    .order("year", { ascending: false });
  if (error || !Array.isArray(modelRows)) {
    cacheLife("seconds");
    return EMPTY;
  }
  const latest = new Map<string, ScoreModel>();
  for (const m of modelRows) {
    if (!latest.has(m.family)) {
      latest.set(m.family, {
        family: m.family as Family,
        year: m.year,
        base: Number(m.base),
        coefs: m.coefs as Record<string, number>,
        question_counts: m.question_counts as Record<string, number>,
        means: (m.means as Record<string, number> | null) ?? null,
        min_score: Number(m.min_score),
        max_score: Number(m.max_score),
      });
    }
  }
  const models = [...latest.values()];
  if (!models.length) return EMPTY;

  const distributions: ScoreData["distributions"] = {};
  const targets: Target[] = [];
  await Promise.all(
    models.map(async (m) => {
      const { data: d } = await sb.from("score_distribution").select("basis, score, value").eq("family", m.family).eq("year", m.year);
      distributions[m.family] = {};
      for (const r of Array.isArray(d) ? d : []) {
        (distributions[m.family][r.basis] ??= []).push({ score: Number(r.score), value: Number(r.value) });
      }
    }),
  );
  // Hedefler: lise → lgs; üniversite → say/ea/soz/dil. En son yılın taban puanları.
  const { data: t } = await sb
    .from("score_targets")
    .select("id, level, family, year, city, district, institution, program, base_score, rank_value")
    .in("family", families)
    .order("year", { ascending: false })
    .order("base_score", { ascending: false })
    .limit(2000);
  const latestYear = new Map<string, number>();
  for (const r of Array.isArray(t) ? t : []) {
    if (!latestYear.has(r.family)) latestYear.set(r.family, r.year);
    if (r.year !== latestYear.get(r.family)) continue;
    targets.push({
      id: r.id,
      level: r.level as Target["level"],
      family: r.family as Family,
      year: r.year,
      city: r.city,
      district: r.district,
      institution: r.institution,
      program: r.program,
      base_score: Number(r.base_score),
      rank_value: r.rank_value === null ? null : Number(r.rank_value),
    });
  }
  return { models, distributions, targets };
}
