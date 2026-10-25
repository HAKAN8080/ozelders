/** Öğretmen tarafı ortak sabitler: branşlar, komisyon bantları, başvuru aşamaları. */

export const TEACHER_FLOOR = 650; // öğretmen payı ders başı bunun altına düşmez (fark komisyondan)

export const BANDS = [
  { code: "baslangic", name: "Başlangıç", commission: 0.3, note: "Yeni öğretmen, ilk 3 ay" },
  { code: "gumus", name: "Gümüş", commission: 0.27, note: "Karne puanı 60–74" },
  { code: "altin", name: "Altın", commission: 0.24, note: "Karne puanı 75–89" },
  { code: "usta", name: "Usta", commission: 0.2, note: "Karne puanı 90 ve üstü" },
] as const;
export type BandCode = (typeof BANDS)[number]["code"];

export function bandInfo(code: string) {
  return BANDS.find((b) => b.code === code) ?? BANDS[0];
}

/** Öğretmenin ders başı payı: kalem fiyatı × (1 − komisyon), tabandan aşağı değil. */
export function teacherShare(lessonPrice: number, commission: number): number {
  return Math.max(TEACHER_FLOOR, Math.round(lessonPrice * (1 - commission)));
}

/**
 * Öğretmen branşları. Kodlar sınav bölüm kodlarıyla aynı: branş testi bu kodla eşleşir.
 * Sınıf öğretmenliği 3.–4. sınıfın tüm derslerini kapsar.
 */
export const TEACHER_BRANCHES: { code: string; name: string; level: "İlkokul" | "Ortaokul" | "Lise" | "Ortaokul–Lise" }[] = [
  { code: "sinif", name: "Sınıf öğretmenliği (3.–4. sınıf)", level: "İlkokul" },
  { code: "matematik", name: "Matematik", level: "Ortaokul–Lise" },
  { code: "geometri", name: "Geometri", level: "Lise" },
  { code: "fen", name: "Fen Bilimleri", level: "Ortaokul" },
  { code: "fizik", name: "Fizik", level: "Lise" },
  { code: "kimya", name: "Kimya", level: "Lise" },
  { code: "biyoloji", name: "Biyoloji", level: "Lise" },
  { code: "turkce", name: "Türkçe", level: "Ortaokul" },
  { code: "edebiyat", name: "Türk Dili ve Edebiyatı", level: "Lise" },
  { code: "ingilizce", name: "İngilizce", level: "Ortaokul–Lise" },
  { code: "sosyal", name: "Sosyal Bilgiler", level: "Ortaokul" },
  { code: "inkilap", name: "İnkılap Tarihi", level: "Ortaokul" },
  { code: "tarih", name: "Tarih", level: "Lise" },
  { code: "cografya", name: "Coğrafya", level: "Lise" },
  { code: "felsefe", name: "Felsefe", level: "Lise" },
  { code: "din", name: "Din Kültürü ve Ahlak Bilgisi", level: "Ortaokul–Lise" },
];

export function branchName(code: string): string {
  return TEACHER_BRANCHES.find((b) => b.code === code)?.name ?? code;
}

export const SEGMENTS: { code: string; label: string }[] = [
  { code: "atanamayan", label: "Atanmayı bekleyen öğretmen" },
  { code: "ozel_okul", label: "Özel okulda / dershanede çalışıyorum" },
  { code: "ucretli_ogretmen", label: "Ücretli öğretmenim" },
  { code: "emekli", label: "Emekli öğretmenim" },
  { code: "universite_ogrencisi", label: "Üniversite öğrencisiyim (son sınıf / yüksek lisans)" },
  { code: "diger", label: "Diğer" },
];

export function segmentLabel(code: string): string {
  return SEGMENTS.find((s) => s.code === code)?.label ?? code;
}

export type Stage = "basvuru" | "test" | "demo" | "belge" | "oryantasyon" | "golge" | "aktif" | "askida" | "ayrildi";

/** Başvuranın gördüğü huni adımları (sırasıyla). */
export const FUNNEL: { stage: Stage; title: string; body: string }[] = [
  { stage: "basvuru", title: "Başvuru formu", body: "Branşların, sınıf aralığın ve deneyimin. 5 dakika." },
  { stage: "test", title: "Branş testi", body: "Branşın ve kademen için 20 soru, 30 dakika. 17 doğru ve üstü geçer." },
  { stage: "demo", title: "Canlı demo ders", body: "20 dakika, bir değerlendiriciyle. Konu hâkimiyeti, anlatım, etkileşim." },
  { stage: "belge", title: "Belge doğrulama", body: "e-Devlet barkodlu diploma ve adli sicil kaydı. Kopya saklamayız." },
  { stage: "oryantasyon", title: "Sözleşme ve oryantasyon", body: "Bağımsız öğretmen sözleşmesi ve ödeme hesabı onayı." },
  { stage: "golge", title: "İlk dersler", body: "İlk 3 dersin kayıtları kıdemli bir öğretmenle birlikte incelenir." },
];

export function stageIndex(stage: string): number {
  if (stage === "aktif") return FUNNEL.length;
  const i = FUNNEL.findIndex((f) => f.stage === stage);
  return i < 0 ? 0 : i;
}

export const STAGE_LABEL: Record<Stage, string> = {
  basvuru: "Taslak",
  test: "Branş testi",
  demo: "Demo ders",
  belge: "Belge",
  oryantasyon: "Sözleşme",
  golge: "Gölge dönem",
  aktif: "Aktif",
  askida: "Askıda",
  ayrildi: "Ayrıldı",
};

export const BRANCH_TEST_PASS = 85;
export const DEMO_PASS = 70;

/** Demo ders rubriği: her ölçüt 1–5, toplam 100'e çevrilir. */
export const DEMO_RUBRIC = [
  { code: "konu", label: "Konu hâkimiyeti", weight: 30 },
  { code: "anlatim", label: "Anlatım ve sadeleştirme", weight: 25 },
  { code: "etkilesim", label: "Öğrenciyle etkileşim, soru sorma", weight: 20 },
  { code: "seviye", label: "Sınıf düzeyine uygunluk", weight: 15 },
  { code: "teknik", label: "Teknik düzen (ses, görüntü, tahta)", weight: 10 },
] as const;

export function demoScore(r: Record<string, number>): number {
  return Math.round(DEMO_RUBRIC.reduce((s, c) => s + ((Math.min(5, Math.max(1, r[c.code] ?? 1)) - 1) / 4) * c.weight, 0));
}
