/** Sınav türleri, dersler ve sınıflar. 3.–12. sınıf: okul dersleri (10 yılın 8'i) + LGS (8. sınıf) + YKS (12. sınıf / mezun). */

export type ExamKind = "lgs" | "tyt" | "ayt" | "ydt" | "okul" | "diger";

export const EXAM_KINDS: {
  code: ExamKind;
  label: string;
  short: string;
  optionCount: 4 | 5;
  penalty: 0 | 3 | 4;
  grade: number;
}[] = [
  { code: "lgs", label: "LGS (ortaokul)", short: "LGS", optionCount: 4, penalty: 3, grade: 8 },
  { code: "tyt", label: "YKS – TYT", short: "TYT", optionCount: 5, penalty: 4, grade: 12 },
  { code: "ayt", label: "YKS – AYT", short: "AYT", optionCount: 5, penalty: 4, grade: 12 },
  { code: "ydt", label: "YKS – YDT (yabancı dil)", short: "YDT", optionCount: 5, penalty: 4, grade: 12 },
  { code: "okul", label: "Okul / ders denemesi", short: "Okul", optionCount: 5, penalty: 0, grade: 9 },
  { code: "diger", label: "Diğer", short: "Deneme", optionCount: 5, penalty: 0, grade: 9 },
];

export function kindInfo(code: string) {
  return EXAM_KINDS.find((k) => k.code === code) ?? EXAM_KINDS[EXAM_KINDS.length - 1];
}

export const GRADES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export function gradeLabel(g: number) {
  return g === 12 ? "12. sınıf / mezun" : `${g}. sınıf`;
}

export function penaltyLabel(p: number) {
  return p === 0 ? "Yanlış doğruyu götürmez" : `${p} yanlış 1 doğruyu götürür`;
}

/** Bölüm (ders) seçenekleri. Kod veritabanında ^[a-z]{2,20}$ olmalı. */
export const SUBJECT_GROUPS = ["İlkokul–Ortaokul", "Lise", "YKS"] as const;
export type SubjectGroup = (typeof SUBJECT_GROUPS)[number];

export const SUBJECTS: { code: string; name: string; group: SubjectGroup }[] = [
  { code: "matematik", name: "Matematik", group: "İlkokul–Ortaokul" },
  { code: "fen", name: "Fen Bilimleri", group: "İlkokul–Ortaokul" },
  { code: "turkce", name: "Türkçe", group: "İlkokul–Ortaokul" },
  { code: "hayatbilgisi", name: "Hayat Bilgisi", group: "İlkokul–Ortaokul" },
  { code: "sinif", name: "Sınıf Öğretmenliği (branş testi)", group: "İlkokul–Ortaokul" },
  { code: "sosyal", name: "Sosyal Bilgiler", group: "İlkokul–Ortaokul" },
  { code: "inkilap", name: "T.C. İnkılap Tarihi ve Atatürkçülük", group: "İlkokul–Ortaokul" },
  { code: "din", name: "Din Kültürü ve Ahlak Bilgisi", group: "İlkokul–Ortaokul" },
  { code: "ingilizce", name: "İngilizce", group: "İlkokul–Ortaokul" },
  { code: "edebiyat", name: "Türk Dili ve Edebiyatı", group: "Lise" },
  { code: "fizik", name: "Fizik", group: "Lise" },
  { code: "kimya", name: "Kimya", group: "Lise" },
  { code: "biyoloji", name: "Biyoloji", group: "Lise" },
  { code: "tarih", name: "Tarih", group: "Lise" },
  { code: "cografya", name: "Coğrafya", group: "Lise" },
  { code: "felsefe", name: "Felsefe", group: "Lise" },
  { code: "geometri", name: "Geometri", group: "Lise" },
  { code: "tytturkce", name: "TYT Türkçe", group: "YKS" },
  { code: "tytsosyal", name: "TYT Sosyal Bilimler", group: "YKS" },
  { code: "tytmat", name: "TYT Temel Matematik", group: "YKS" },
  { code: "tytfen", name: "TYT Fen Bilimleri", group: "YKS" },
  { code: "aytmat", name: "AYT Matematik", group: "YKS" },
  { code: "aytfizik", name: "AYT Fizik", group: "YKS" },
  { code: "aytkimya", name: "AYT Kimya", group: "YKS" },
  { code: "aytbiyoloji", name: "AYT Biyoloji", group: "YKS" },
  { code: "aytedebiyat", name: "AYT Türk Dili ve Edebiyatı", group: "YKS" },
  { code: "ayttarihbir", name: "AYT Tarih-1", group: "YKS" },
  { code: "aytcografyabir", name: "AYT Coğrafya-1", group: "YKS" },
  { code: "ayttarihiki", name: "AYT Tarih-2", group: "YKS" },
  { code: "aytcografyaiki", name: "AYT Coğrafya-2", group: "YKS" },
  { code: "aytfelsefe", name: "AYT Felsefe Grubu", group: "YKS" },
  { code: "aytdin", name: "AYT Din Kültürü", group: "YKS" },
  { code: "ydt", name: "YDT Yabancı Dil", group: "YKS" },
];

/** Kendi PDF'imizde dersi metinden tahmin et (yalnızca varsayılan seçim için). */
export function guessSubject(text: string): string {
  const u = text.toLocaleUpperCase("tr");
  if (/TEMEL MATEMATİK/.test(u)) return "tytmat";
  if (/TÜRK DİLİ VE EDEBİYATI|EDEBİYAT/.test(u)) return "edebiyat";
  if (/FİZİK/.test(u)) return "fizik";
  if (/KİMYA/.test(u)) return "kimya";
  if (/BİYOLOJİ/.test(u)) return "biyoloji";
  if (/COĞRAFYA/.test(u)) return "cografya";
  if (/FELSEFE/.test(u)) return "felsefe";
  if (/İNKILAP/.test(u)) return "inkilap";
  if (/TARİH/.test(u)) return "tarih";
  if (/FEN BİLİMLERİ/.test(u)) return "fen";
  if (/DİN KÜLTÜRÜ/.test(u)) return "din";
  if (/İNGİLİZCE|ENGLISH/.test(u)) return "ingilizce";
  if (/TÜRKÇE/.test(u)) return "turkce";
  if (/HAYAT BİLGİSİ/.test(u)) return "hayatbilgisi";
  if (/SOSYAL BİLGİLER/.test(u)) return "sosyal";
  return "matematik";
}

/** Metinden sınav türü ve sınıf tahmini. */
export function guessKind(text: string): { kind: ExamKind; grade: number | null } {
  const u = text.toLocaleUpperCase("tr");
  const g = u.match(/\b(9|10|11|12)\.\s*SINIF/)?.[1] ?? u.match(/\b([5-8])\.\s*SINIF/)?.[1];
  const grade = g ? Number(g) : null;
  if (/\bTYT\b|TEMEL YETERLİLİK/.test(u)) return { kind: "tyt", grade: 12 };
  if (/\bAYT\b|ALAN YETERLİLİK/.test(u)) return { kind: "ayt", grade: 12 };
  if (/\bYDT\b/.test(u)) return { kind: "ydt", grade: 12 };
  if (/\bLGS\b|SAYISAL BÖLÜM|SÖZEL BÖLÜM/.test(u)) return { kind: "lgs", grade: 8 };
  return { kind: "okul", grade };
}
