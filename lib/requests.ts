import { TEACHER_BRANCHES } from "@/lib/teacher";

export const GOALS = [
  { code: "okul", label: "Okul dersleri", hint: "Konu tekrarı, ödev, yazılıya hazırlık" },
  { code: "lgs", label: "LGS hazırlık", hint: "7. ve 8. sınıf" },
  { code: "yks", label: "YKS hazırlık", hint: "10.–12. sınıf" },
] as const;
export type Goal = (typeof GOALS)[number]["code"];

export function goalsForGrade(grade: number) {
  return GOALS.filter((g) => g.code === "okul" || (g.code === "lgs" && grade >= 7 && grade <= 8) || (g.code === "yks" && grade >= 10));
}

export function goalLabel(code: string) {
  return GOALS.find((g) => g.code === code)?.label ?? code;
}

/** Çocuğun sınıfına uygun dersler (öğretmen branş kademeleriyle aynı mantık). */
export function subjectsForGrade(grade: number) {
  return TEACHER_BRANCHES.filter((b) => {
    if (b.level === "İlkokul") return grade <= 4;
    if (b.level === "Ortaokul") return grade >= 5 && grade <= 8;
    if (b.level === "Lise") return grade >= 9;
    return grade >= 5; // Ortaokul–Lise
  });
}

export const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
export const WINDOWS = [
  { from: "10:00", to: "13:00", label: "10–13" },
  { from: "13:00", to: "17:00", label: "13–17" },
  { from: "17:00", to: "21:00", label: "17–21" },
];

export type Pref = { weekday: number; from: string; to: string };

export function prefSummary(p: Pref[]): string {
  if (!p.length) return "Gün ve saat fark etmez";
  return DAYS.map((d, i) => {
    const w = p.filter((x) => x.weekday === i + 1).map((x) => `${x.from}–${x.to}`);
    return w.length ? `${d.slice(0, 3)} ${w.join(", ")}` : null;
  })
    .filter(Boolean)
    .join(" · ");
}
