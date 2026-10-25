import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

import type { Database } from "@/lib/database.types";
import { bookletPublicUrl, imageKey, type QuestionImage } from "@/lib/exam-images";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

export type ExamSection = { code: string; name: string; position: number; question_count: number };
export type PublicExam = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  grade: number;
  booklet_url: string | null;
  booklet_label: string | null;
  /** Kitapçığın açılacağı adres: bizim depodaki PDF ya da resmi kaynağın bağlantısı */
  booklet_src: string | null;
  /** true: PDF bizim depoda (kendi denememiz) */
  booklet_hosted: boolean;
  duration_min: number;
  published_at: string | null;
  sections: ExamSection[];
  /** Kendi denemelerimizde soru resimleri; anahtar "bolum:no". Resmi kitapçıklı sınavda boş. */
  images: Record<string, QuestionImage>;
};

export type SectionResult = {
  code: string;
  name: string;
  dogru: number;
  yanlis: number;
  bos: number;
  net: number;
};
export type TopicResult = {
  section: string;
  topic: string;
  questions: string;
  total: number;
  correct: number;
};
export type QuestionDetail = {
  section: string;
  no: number;
  correct: string;
  topic: string | null;
  answer: string | null;
};
export type ExamResult = {
  exam: { slug: string; title: string; subtitle: string | null };
  name: string | null;
  created_at: string;
  results: SectionResult[];
  total_net: number;
  rank: number;
  participants: number;
  is_owner: boolean;
  claimable: boolean;
  detail: QuestionDetail[] | null;
  topics: TopicResult[] | null;
};

function publicClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Yayındaki sınavlar. Cevap anahtarı burada yok: soru tablosu herkese kapalıdır,
 * sadece bölüm adları ve soru sayıları açıktır. 10 dakika önbellekli.
 */
export async function getPublishedExams(): Promise<PublicExam[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("exams");

  const { data, error } = await publicClient()
    .from("exams")
    .select(
      "id, slug, title, subtitle, grade, booklet_url, booklet_path, booklet_label, duration_min, published_at, exam_sections(code, name, position, question_count), exam_question_images(section, no, path, width, height)",
    )
    .eq("status", "yayinda")
    .order("published_at", { ascending: false });

  if (error || !Array.isArray(data)) {
    // Geçici hata: boş liste kısa süre önbellekte kalır, kısa sürede yeniden denenir.
    cacheLife("seconds");
    return [];
  }

  return data.map(({ exam_sections, exam_question_images, booklet_path, ...e }) => ({
    ...e,
    booklet_src: booklet_path ? bookletPublicUrl(booklet_path) : e.booklet_url,
    booklet_hosted: !!booklet_path,
    sections: [...(exam_sections ?? [])].sort((a, b) => a.position - b.position),
    images: Object.fromEntries(
      (exam_question_images ?? []).map((i) => [imageKey(i.section, i.no), { path: i.path, width: i.width, height: i.height }]),
    ),
  }));
}

export async function getPublishedExam(slug: string): Promise<PublicExam | null> {
  const exams = await getPublishedExams();
  return exams.find((e) => e.slug === slug) ?? null;
}

export function totalQuestions(exam: PublicExam): number {
  return exam.sections.reduce((sum, s) => sum + s.question_count, 0);
}

const netFormat = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function formatNet(n: number): string {
  return netFormat.format(n);
}
