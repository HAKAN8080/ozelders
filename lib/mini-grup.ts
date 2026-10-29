/** Mini grup kuralları (fiyat ve oranlar veritabanında da varsayılan; burası gösterim için). */
export const MG = {
  pricePerLesson: 475,
  lessonsPerMonth: 8,
  monthly: 3800,
  minSize: 3,
  maxSize: 4,
  teacherShare: 0.7,
  minutes: 60,
} as const;

export type GroupSlot = { weekday: number; start: string };

const DAY = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export function scheduleText(s: unknown): string {
  const slots = (Array.isArray(s) ? s : []) as GroupSlot[];
  return slots.map((x) => `${DAY.at(x.weekday - 1) ?? "?"} ${x.start}`).join(" ve ");
}

export function dateTR(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long", timeZone: "Europe/Istanbul" }).format(new Date(iso));
}

type Window = { weekday: number; from: string; to: string };

const mins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/** Velinin tercihi (boş = fark etmez) bu saati 60 dakika boyunca kapsıyor mu? */
export function covers(prefs: unknown, slot: GroupSlot): boolean {
  const p = (Array.isArray(prefs) ? prefs : []) as Window[];
  if (!p.length) return true;
  const s = mins(slot.start);
  return p.some((w) => w.weekday === slot.weekday && mins(w.from) <= s && mins(w.to) >= s + 60);
}

/** Tüm olası ders başlangıçları (her gün 10:00–20:00, saat başı). */
export const ALL_SLOTS: GroupSlot[] = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 11 }, (_, h) => ({ weekday: d + 1, start: `${String(10 + h).padStart(2, "0")}:00` })),
).flat();
