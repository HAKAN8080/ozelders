import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedExams, totalQuestions } from "@/lib/exams";

export const metadata: Metadata = {
  title: "Ücretsiz Denemeler — ÖzelDersBul",
  description: "Ücretsiz LGS deneme sınavları: dijital optik form, anında net hesabı ve kazanım raporu.",
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
              Kitapçığı yeni sekmede aç, cevaplarını dijital optik forma işaretle. Netin ve sıralaman hemen
              hesaplanır. Kayıt olmadan başlayabilirsin.
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

  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 p-0">
      {exams.map((e) => (
        <li key={e.id} className="tahta flex flex-col gap-5 rounded-[10px] p-7 text-[#f2f5f1] sm:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#cfe3d6]">
              {e.grade}. sınıf
            </span>
            <span className="font-hand text-2xl text-white">ücretsiz!</span>
          </div>
          <h2 className="m-0 font-serif text-3xl leading-[1.15] font-bold">{e.title}</h2>
          <dl className="m-0 grid grid-cols-3 gap-3 border-y border-dashed border-[rgb(242_245_241/0.35)] py-4">
            {[
              [String(totalQuestions(e)), "soru"],
              [String(e.duration_min), "dakika"],
              [String(e.sections.length), "ders"],
            ].map(([n, label]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="text-sm text-[#cfe3d6]">{label}</dt>
                <dd className="m-0 text-3xl font-semibold tabular-nums">{n}</dd>
              </div>
            ))}
          </dl>
          {e.subtitle ? <p className="m-0 text-base text-[#e3eee7]">{e.subtitle}</p> : null}
          <Link
            href={`/deneme/${e.slug}`}
            className="self-start rounded-md bg-white px-6 py-3.5 text-[17px] font-semibold text-primary hover:bg-primary-soft"
          >
            Başla →
          </Link>
        </li>
      ))}
    </ul>
  );
}
