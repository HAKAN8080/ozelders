/**
 * Puan tahmini (LGS MSP, YKS ham ve yerleştirme puanı). Saf fonksiyonlar: sunucuda da tarayıcıda da çalışır.
 *
 * Model (her yıl için ayrı): puan = base + Σ katsayı[ders] × net[ders]
 * - LGS: MEB standart puan yöntemi doğrusal olduğu için yıllık katsayılarla birebir ifade edilir.
 * - YKS: ÖSYM standart puanları; katsayılar o yılın sonuçlarına uydurulmuş değerlerdir (yaklaşık).
 * Denemede olmayan dersler öğrencinin bu denemedeki başarı oranıyla doldurulur ve sonuçta belirtilir.
 */

export type Family = "lgs" | "tyt" | "say" | "ea" | "soz" | "dil";

export type ScoreModel = {
  family: Family;
  year: number;
  base: number;
  coefs: Record<string, number>;
  question_counts: Record<string, number>;
  means: Record<string, number> | null;
  min_score: number;
  max_score: number;
};

export type DistributionRow = { score: number; value: number };
export type Target = {
  id: string;
  level: "lise" | "universite";
  family: Family;
  year: number;
  city: string | null;
  district: string | null;
  institution: string;
  program: string | null;
  base_score: number;
  rank_value: number | null;
};

export const FAMILY_LABEL: Record<Family, string> = {
  lgs: "LGS puanı",
  tyt: "TYT puanı",
  say: "Sayısal (SAY) puanı",
  ea: "Eşit ağırlık (EA) puanı",
  soz: "Sözel (SÖZ) puanı",
  dil: "Dil (DİL) puanı",
};

export type SectionNet = { code: string; name: string; net: number; questions: number };

export type Estimate = {
  family: Family;
  year: number;
  score: number;
  /** Denemede olmayan derslerde Türkiye ortalaması yerine 0 ve tam net alınırsa */
  low: number;
  high: number;
  /** Denemede olmayan, öğrencinin başarı oranıyla doldurulan dersler */
  assumed: string[];
  /** Tahmine giren dersler */
  used: string[];
};

/** Sınav türüne göre hesaplanacak puan türleri; yalnız denemede en az bir AYT/YDT/LGS dersi bulunanlar. */
export function relevantFamilies(kind: string, codes: string[], models: ScoreModel[]): Family[] {
  const byKind: Record<string, Family[]> = { lgs: ["lgs"], tyt: ["tyt"], ayt: ["say", "ea", "soz"], ydt: ["dil"] };
  return (byKind[kind] ?? []).filter((f) =>
    models.some((m) => m.family === f && codes.some((c) => c in m.coefs && (f === "tyt" || !c.startsWith("tyt")))),
  );
}

/**
 * Denemenin bölümleri resmi formatla uyumlu mu? Mini denemelerde (ör. 5 soru) tahmin anlamsızdır.
 * Her bölüm resmi soru sayısına eşit olmalı (iptal edilen sorular için 1 eksik kabul edilir).
 */
export function isFullFormat(sections: SectionNet[], model: ScoreModel): boolean {
  const known = sections.filter((s) => s.code in model.coefs);
  if (!known.length) return false;
  return known.every((s) => {
    const official = model.question_counts[s.code];
    return official ? s.questions >= official - 1 && s.questions <= official : false;
  });
}

export function estimate(sections: SectionNet[], model: ScoreModel): Estimate | null {
  if (!isFullFormat(sections, model)) return null;
  const nets = new Map(sections.map((s) => [s.code, s.net]));
  // Denemede olmayan dersler için öğrencinin bu denemedeki başarı oranı varsayılır
  // (ör. yalnız sayısal çözdüyse sözelde de aynı oranda net). Aralık: 0 net ile tam net.
  let gotNet = 0;
  let gotQ = 0;
  for (const s of sections) {
    if (s.code in model.coefs) {
      gotNet += Math.max(0, s.net);
      gotQ += model.question_counts[s.code] ?? s.questions;
    }
  }
  const ratio = gotQ ? gotNet / gotQ : 0;
  let score = model.base;
  let low = model.base;
  let high = model.base;
  const assumed: string[] = [];
  const used: string[] = [];
  for (const [code, coef] of Object.entries(model.coefs)) {
    const n = nets.get(code);
    const qc = model.question_counts[code] ?? 0;
    if (n !== undefined) {
      const v = coef * Math.min(qc || Infinity, Math.max(0, n));
      score += v;
      low += v;
      high += v;
      used.push(code);
    } else {
      score += coef * ratio * qc;
      high += coef * qc;
      assumed.push(code);
    }
  }
  const clamp = (x: number) => Math.min(model.max_score, Math.max(model.min_score, x));
  return { family: model.family, year: model.year, score: clamp(score), low: clamp(low), high: clamp(high), assumed, used };
}

/**
 * Dağılım tablosundan değer bulur.
 * YKS (sira): "puanı ≥ X olan aday sayısı" — log ölçekte doğrusal ara değer.
 * LGS (yuzdelik): "% dilim" — log ölçekte doğrusal ara değer.
 */
export function lookup(rows: DistributionRow[], score: number): number | null {
  if (rows.length < 2) return null;
  const r = [...rows].sort((a, b) => b.score - a.score); // yüksekten düşüğe
  if (score >= r[0].score) return r[0].value;
  if (score <= r[r.length - 1].score) return r[r.length - 1].value;
  for (let i = 0; i < r.length - 1; i++) {
    const hi = r[i];
    const lo = r[i + 1];
    if (score <= hi.score && score >= lo.score) {
      const t = (score - lo.score) / (hi.score - lo.score);
      const a = Math.log(Math.max(lo.value, 1e-6));
      const b = Math.log(Math.max(hi.value, 1e-6));
      return Math.exp(a + (b - a) * t);
    }
  }
  return null;
}

/** Puan açığını net olarak ifade eder: en çok puan getiren ve hâlâ boşluğu olan derslerden başlar. */
export function netsToClose(gap: number, sections: SectionNet[], model: ScoreModel): { code: string; name: string; nets: number }[] {
  if (gap <= 0) return [];
  const room = sections
    .filter((s) => s.code in model.coefs)
    .map((s) => ({ ...s, coef: model.coefs[s.code], free: (model.question_counts[s.code] ?? s.questions) - Math.max(0, s.net) }))
    .filter((s) => s.free > 0.5)
    .sort((a, b) => b.coef - a.coef);
  const out: { code: string; name: string; nets: number }[] = [];
  let left = gap;
  for (const s of room) {
    if (left <= 0) break;
    const need = Math.min(s.free, left / s.coef);
    out.push({ code: s.code, name: s.name, nets: Math.ceil(need * 4) / 4 });
    left -= need * s.coef;
  }
  return out;
}

/** OBP katkısı: diploma notu (50–100) × 5 × 0,12 (önceki yıl yerleşmişse 0,06). */
export function obpBonus(diploma: number, placedLastYear = false) {
  const obp = Math.min(100, Math.max(50, diploma)) * 5;
  return obp * (placedLastYear ? 0.06 : 0.12);
}

const nf = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
export const fmtInt = (n: number) => nf.format(Math.round(n));
export const fmtScore = (n: number) => nf1.format(n);
export const fmtPct = (n: number) => (n < 1 ? nf2.format(n) : nf1.format(n));
