import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExamRunner } from "@/app/deneme/[slug]/exam-runner";
import { getPublishedExam } from "@/lib/exams";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/deneme/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const exam = await getPublishedExam(slug).catch(() => null);
  return { title: exam ? `${exam.title} — Ücretsiz deneme · ÖzelDersBul` : "Deneme — ÖzelDersBul" };
}

export default async function ExamPage({ params }: PageProps<"/deneme/[slug]">) {
  const { slug } = await params;
  const exam = await getPublishedExam(slug).catch(() => null);
  if (!exam) {
    notFound();
  }
  return <ExamRunner exam={exam} />;
}
