import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ExamFilter } from "@/app/deneme/exam-filter";
import { getPublishedExams } from "@/lib/exams";

export const metadata: Metadata = {
  title: "Ücretsiz Denemeler — ÖzelDersBul",
  description: "Ücretsiz LGS, YKS (TYT-AYT) ve okul denemeleri: dijital optik form, anında net hesabı ve konu raporu.",
};

export default function DenemePage() {
  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-4">
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Ücretsiz denemeler</p>
            <h1 className="m-0 max-w-[18em] font-serif text-4xl leading-[1.1] font-bold sm:text-5xl">
              Çöz, netini gör, eksiğini bul.
            </h1>
            <p className="m-0 max-w-[36em] text-[19px] leading-relaxed text-[#3d4743]">
              Ortaokuldan liseye, LGS&apos;den YKS&apos;ye. Kitapçık cevap kâğıdının yanında açılır, netin ve sıralaman
              hemen hesaplanır. Kayıt olmadan başlayabilirsin.
            </p>
          </div>
          <Suspense fallback={<div className="h-64 rounded-[10px] border border-border bg-background" />}>
            <ExamList />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function ExamList() {
  let exams: Awaited<ReturnType<typeof getPublishedExams>> = [];
  try {
    exams = await getPublishedExams();
  } catch {
    return <p className="m-0 text-muted">Denemeler şu an yüklenemedi. Lütfen birazdan yeniden deneyin.</p>;
  }
  if (exams.length === 0) {
    return <p className="m-0 text-muted">Şu an yayında deneme yok. Yenisi çok yakında.</p>;
  }

  return <ExamFilter exams={exams} />;
}
