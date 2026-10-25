import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ExamRunner } from "@/app/deneme/[slug]/exam-runner";
import { getSessionProfile } from "@/lib/auth";
import { getPublishedExam } from "@/lib/exams";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/deneme/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const exam = await getPublishedExam(slug).catch(() => null);
  if (exam?.purpose === "brans_testi") return { title: `${exam.title} — ÖzelDersBul`, robots: { index: false, follow: false } };
  return { title: exam ? `${exam.title} — Ücretsiz deneme · ÖzelDersBul` : "Deneme — ÖzelDersBul" };
}

export default async function ExamPage({ params }: PageProps<"/deneme/[slug]">) {
  const { slug } = await params;
  const exam = await getPublishedExam(slug).catch(() => null);
  if (!exam) {
    notFound();
  }
  // Öğretmen branş testi: sonuç başvuruya bağlanacağı için giriş şart
  if (exam.purpose === "brans_testi") {
    const session = await getSessionProfile();
    if (!session.userId) redirect(`/giris?next=${encodeURIComponent(`/deneme/${slug}`)}`);
  }
  return <ExamRunner exam={exam} />;
}
