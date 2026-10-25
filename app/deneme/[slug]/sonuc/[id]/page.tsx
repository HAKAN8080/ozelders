import type { Metadata } from "next";
import Link from "next/link";

import { claimAttempt } from "@/app/deneme/[slug]/sonuc/[id]/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScoreEstimate } from "@/app/deneme/[slug]/sonuc/[id]/score-estimate";
import { penaltyLabel } from "@/lib/exam-kinds";
import { formatNet, getPublishedExam, type ExamResult, type PublicExam, type TopicResult } from "@/lib/exams";
import { getScoreData } from "@/lib/score-data";
import { relevantFamilies, type Family } from "@/lib/score-estimate";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata: Metadata = {
  title: "Deneme sonucu — ÖzelDersBul",
  robots: { index: false, follow: false }, // sonuç sayfaları kişiseldir, arama motorlarına kapalı
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const eyebrow = "text-sm font-semibold uppercase tracking-[0.08em]";
const collator = new Intl.Collator("tr");

export default async function ResultPage({ params, searchParams }: PageProps<"/deneme/[slug]/sonuc/[id]">) {
  const { slug, id } = await params;
  const t = (await searchParams).t;
  const token = typeof t === "string" && UUID.test(t) ? t : null;

  const exam = await getPublishedExam(slug).catch(() => null);
  let result: ExamResult | null = null;
  if (UUID.test(id)) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_exam_result", token ? { p_attempt: id, p_token: token } : { p_attempt: id });
    result = (data as ExamResult | null) ?? null;
  }

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 pt-12 pb-16 sm:px-6">
          {result ? (
            <Result result={result} exam={exam} slug={slug} id={id} token={token} />
          ) : (
            <NotFoundBlock slug={slug} />
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function NotFoundBlock({ slug }: { slug: string }) {
  return (
    <section className="flex flex-col gap-5">
      <h1 className="m-0 font-serif text-4xl font-bold">Bu sonuç açılamadı.</h1>
      <p className="m-0 max-w-[34em] text-lg text-[#3d4743]">
        Bağlantı eksik ya da hatalı olabilir. Sonucunu hesabına kaydettiysen giriş yaparak görebilirsin.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href={`/deneme/${slug}`} className="rounded-md bg-primary px-6 py-4 font-semibold text-primary-foreground hover:bg-primary-hover">
          Denemeye dön
        </Link>
        <Link href="/giris" className="rounded-md border border-[#b9c7bf] bg-background px-5 py-4 font-semibold hover:bg-primary-soft">
          Giriş yap
        </Link>
      </div>
    </section>
  );
}

async function Result({
  result,
  exam,
  slug,
  id,
  token,
}: {
  result: ExamResult;
  exam: PublicExam | null;
  slug: string;
  id: string;
  token: string | null;
}) {
  const selfUrl = `/deneme/${slug}/sonuc/${id}${token ? `?t=${token}` : ""}`;
  const best = [...result.results].sort((a, b) => b.net - a.net)[0];
  const total = result.results.reduce((n, s) => n + s.dogru + s.yanlis + s.bos, 0);
  const headline = `${result.name ? `${result.name}, ` : ""}${formatNet(result.total_net).replace(/,00$/, "")} net yaptın.`;

  return (
    <>
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className={`${eyebrow} m-0 text-primary`}>{result.exam.title} · Sonuç</p>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-[44px]">{headline}</h1>
          </div>
          {best && best.net > 0 ? (
            <p className="m-0 -rotate-[1.5deg] font-hand text-[26px] text-primary">
              {best.name.toLocaleLowerCase("tr")} bugün senden yana ✓
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {result.results.map((s) => (
            <div key={s.code} className="flex flex-col gap-1.5 rounded-[10px] border border-border bg-background p-6">
              <span className="text-sm font-semibold uppercase tracking-[0.06em] text-muted">{s.name}</span>
              <span className="font-serif text-[44px] font-bold tabular-nums">{formatNet(s.net)}</span>
              <span className="text-[15px] text-[#3d4743] tabular-nums">
                {s.dogru} doğru · {s.yanlis} yanlış · {s.bos} boş
              </span>
            </div>
          ))}
          <div className="flex flex-col gap-1.5 rounded-[10px] bg-[#111111] p-6 text-white">
            <span className="text-sm font-semibold uppercase tracking-[0.06em] text-[#c9cfcc]">Toplam net</span>
            <span className="font-serif text-[44px] font-bold tabular-nums">{formatNet(result.total_net)}</span>
            <span className="text-[15px] text-[#c9cfcc]">{total} sorudan</span>
          </div>
          <div className="tahta flex flex-col gap-1.5 rounded-[10px] p-6 text-[#f2f5f1]">
            <span className="text-sm font-semibold uppercase tracking-[0.06em] text-[#cfe3d6]">Sıralaman</span>
            <span className="font-serif text-[44px] font-bold tabular-nums">{result.rank}.</span>
            <span className="text-[15px] text-[#cfe3d6]">{result.participants} öğrenci arasında</span>
          </div>
        </div>
        <p className="m-0 text-sm text-muted">Net hesabı: {penaltyLabel(exam?.wrong_penalty ?? 3).toLocaleLowerCase("tr")}.</p>
      </section>

      {exam?.purpose === "brans_testi" ? (
        <section className="tahta flex flex-wrap items-center justify-between gap-5 rounded-[10px] p-7 text-[#f2f5f1] sm:p-9">
          <div className="flex max-w-[36em] flex-col gap-2">
            <p className={`${eyebrow} m-0 text-[#cfe3d6]`}>Öğretmen branş testi</p>
            <h2 className="m-0 font-serif text-[28px] leading-[1.2] font-bold">Sonucunu başvuruna işle.</h2>
            <p className="m-0 text-[16px] leading-relaxed text-[#dce9e0]">
              Cevap anahtarı branş testlerinde gösterilmez. Başvuru sayfandaki “Sonucu başvuruma işle” düğmesiyle bir sonraki adıma geç.
            </p>
          </div>
          <Link href="/ogretmen-ol/basvuru" className="rounded-md bg-white px-6 py-4 font-semibold text-primary hover:bg-primary-soft">
            Başvuruma dön
          </Link>
        </section>
      ) : (
        <Estimate result={result} exam={exam} next={selfUrl} findHref={`/panel/ogretmen-bul?deneme=${id}`} />
      )}

      {result.claimable && token ? (
        <form action={claimAttempt} className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-primary bg-primary-soft p-5">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="slug" value={slug} />
          <p className="m-0 text-base font-medium text-primary">Bu sonucu hesabına kaydet; sonraki denemelerle karşılaştıralım.</p>
          <button type="submit" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
            Hesabıma kaydet
          </button>
        </form>
      ) : null}

      {exam?.purpose === "brans_testi" ? null : result.topics ? (
        <>
          <TopicReport topics={result.topics} sections={result.results.map((s) => ({ code: s.code, name: s.name }))} />
          <Recommendation topics={result.topics} findHref={`/panel/ogretmen-bul?deneme=${id}`} />
          {result.detail ? <QuestionGrid detail={result.detail} sections={result.results} /> : null}
        </>
      ) : (
        <LockedReport next={selfUrl} />
      )}

      <section className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
        <p className="m-0 text-base text-[#3d4743]">Yeni ücretsiz denemeler düzenli olarak yayınlanır.</p>
        <Link href="/deneme" className="rounded-md bg-[#111111] px-6 py-3.5 font-semibold text-white hover:bg-black">
          Diğer denemeler
        </Link>
      </section>
    </>
  );
}

function LockedReport({ next }: { next: string }) {
  const q = `?next=${encodeURIComponent(next)}`;
  return (
    <section className="tahta flex flex-wrap items-center gap-10 rounded-[10px] p-8 text-[#f2f5f1] sm:p-10">
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
        <p className={`${eyebrow} m-0 text-[#cfe3d6]`}>Konu konu rapor</p>
        <h2 className="m-0 font-serif text-[30px] leading-[1.2] font-bold sm:text-[34px]">
          Hangi konuda kaç soru kaçtı? Raporun hazır.
        </h2>
        <p className="m-0 text-[17px] leading-relaxed text-[#dce9e0]">
          Ücretsiz veli hesabıyla soru soru cevaplarını, eksik konuları ve sonraki denemelerle karşılaştırmayı görürsün.
        </p>
      </div>
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-3">
        <Link href={`/kayit${q}`} className="rounded-md bg-white px-6 py-4 text-center text-[17px] font-semibold text-primary hover:bg-primary-soft">
          Ücretsiz hesap aç, raporu gör
        </Link>
        <Link
          href={`/giris${q}`}
          className="rounded-md border border-[rgb(242_245_241/0.5)] px-6 py-3.5 text-center font-semibold text-white hover:bg-[rgb(255_255_255/0.08)]"
        >
          Hesabım var, giriş yap
        </Link>
      </div>
    </section>
  );
}

function TopicReport({ topics, sections }: { topics: TopicResult[]; sections: { code: string; name: string }[] }) {
  return (
    <>
      {sections.map((sec) => {
        const rows = topics.filter((t) => t.section === sec.code).sort((a, b) => collator.compare(a.topic, b.topic));
        if (rows.length === 0) return null;
        return (
          <section key={sec.code} className="flex flex-col gap-6 rounded-[10px] border border-border bg-background p-6 sm:p-8">
            <div className="flex flex-col gap-1.5">
              <h2 className="m-0 font-serif text-[28px] font-bold sm:text-3xl">{sec.name}: konu konu</h2>
              <p className="m-0 text-[15px] text-muted">Her soru bir konuya bağlı. Hangi konuda puan kaybettiğin burada.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#111111] text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
                    <th className="py-2.5 pr-4 font-semibold">Konu</th>
                    <th className="py-2.5 pr-4 font-semibold">Sorular</th>
                    <th className="py-2.5 pr-4 font-semibold">Durum</th>
                    <th className="py-2.5 text-right font-semibold">Doğru</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const ratio = r.total ? r.correct / r.total : 0;
                    const full = ratio === 1;
                    const none = ratio === 0;
                    return (
                      <tr key={r.topic} className="border-b border-[#eef2ef]">
                        <td className="py-3.5 pr-4 text-base font-medium">{r.topic}</td>
                        <td className="py-3.5 pr-4 text-[15px] text-muted tabular-nums">{r.questions}</td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <span className="block h-2.5 flex-1 overflow-hidden rounded-full bg-[#eef2ef]">
                              <span
                                className={`block h-full ${full ? "bg-primary" : none ? "bg-[#111111]" : "bg-[#6e9a83]"}`}
                                style={{ width: `${Math.max(ratio * 100, 4)}%` }}
                              />
                            </span>
                            <span
                              className={`rounded px-2 py-1 text-[13px] font-semibold whitespace-nowrap ${
                                full
                                  ? "bg-primary-soft text-primary"
                                  : none
                                    ? "bg-[#111111] text-white"
                                    : "border border-[#c9d3cd] bg-[#f1f3f2] text-[#3d4743]"
                              }`}
                            >
                              {full ? "Tamam" : none ? "Çalışılmalı" : "Eksik var"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-right text-base font-semibold tabular-nums">
                          {r.correct} / {r.total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </>
  );
}

function Recommendation({ topics, findHref }: { topics: TopicResult[]; findHref: string }) {
  const weak = topics.filter((t) => t.correct < t.total).sort((a, b) => b.total - b.correct - (a.total - a.correct));
  if (weak.length === 0) {
    return (
      <section className="tahta rounded-[10px] p-8 text-[#f2f5f1] sm:p-10">
        <h2 className="m-0 font-serif text-[30px] font-bold">Bütün konular tamam. Tebrikler!</h2>
        <p className="mt-3 mb-0 text-[17px] text-[#dce9e0]">Bir sonraki denemede bu seviyeyi koruyup korumadığını birlikte görelim.</p>
      </section>
    );
  }
  const missed = weak.reduce((n, t) => n + (t.total - t.correct), 0);
  const names = weak.slice(0, 6).map((t) => t.topic.toLocaleLowerCase("tr"));
  return (
    <section className="tahta flex flex-wrap items-center gap-10 rounded-[10px] p-8 text-[#f2f5f1] sm:p-10">
      <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
        <p className={`${eyebrow} m-0 text-[#cfe3d6]`}>Sana önerimiz</p>
        <h2 className="m-0 font-serif text-[30px] leading-[1.2] font-bold sm:text-[34px]">
          {weak.length} konuda toplam {missed} soru kaçtı. Hepsi kapanabilir.
        </h2>
        <p className="m-0 text-[17px] leading-relaxed text-[#dce9e0]">
          Öncelik sırası: {names.join(", ")}
          {weak.length > 6 ? " ve diğerleri" : ""}. Bu konularda güçlü bir öğretmenle çalışırsın; bir sonraki denemede farkı
          birlikte görürüz.
        </p>
      </div>
      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
        <Link href={findHref} className="rounded-md bg-white px-6 py-4 text-center text-[17px] font-semibold text-primary hover:bg-primary-soft">
          Bu konular için öğretmen bul
        </Link>
        <p className="m-0 text-center font-hand text-[22px] text-white">önce ücretsiz 20 dk tanışma</p>
      </div>
    </section>
  );
}

function QuestionGrid({
  detail,
  sections,
}: {
  detail: NonNullable<ExamResult["detail"]>;
  sections: { code: string; name: string }[];
}) {
  return (
    <section className="flex flex-col gap-6 rounded-[10px] border border-border bg-background p-6 sm:p-8">
      <h2 className="m-0 font-serif text-[28px] font-bold">Soru soru cevapların</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
        {sections.map((sec) => (
          <div key={sec.code} className="flex flex-col gap-2">
            <h3 className="m-0 border-b-2 border-[#111111] pb-2 text-base font-semibold uppercase tracking-[0.04em]">{sec.name}</h3>
            <ol className="m-0 grid list-none grid-cols-5 gap-2 p-0">
              {detail
                .filter((d) => d.section === sec.code)
                .map((d) => {
                  const state = !d.answer ? "bos" : d.answer === d.correct ? "dogru" : "yanlis";
                  return (
                    <li
                      key={d.no}
                      className={`flex flex-col items-center rounded-md border px-1 py-2 text-sm tabular-nums ${
                        state === "dogru"
                          ? "border-primary bg-primary-soft text-primary"
                          : state === "yanlis"
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-border text-muted"
                      }`}
                      title={`${d.no}. soru · cevabın: ${d.answer ?? "boş"} · doğru: ${d.correct}${d.topic ? ` · ${d.topic}` : ""}`}
                    >
                      <span className="font-semibold">{d.no}</span>
                      <span>
                        {d.answer ?? "–"}
                        {state === "yanlis" ? `→${d.correct}` : ""}
                      </span>
                    </li>
                  );
                })}
            </ol>
          </div>
        ))}
      </div>
      <p className="m-0 text-sm text-muted">Yeşil: doğru · Siyah: yanlış (ok doğru cevabı gösterir) · Gri: boş</p>
    </section>
  );
}

/** Tahmini puan + hedef okul. Sınav türüne uygun puan modeli yoksa hiçbir şey göstermez. */
async function Estimate({ result, exam, next, findHref }: { result: ExamResult; exam: PublicExam | null; next: string; findHref: string }) {
  if (!exam) return null;
  const counts = new Map(exam.sections.map((s) => [s.code, s.question_count]));
  const sections = result.results.map((s) => ({
    code: s.code,
    name: s.name,
    net: Number(s.net),
    questions: counts.get(s.code) ?? s.dogru + s.yanlis + s.bos,
  }));
  const wanted: Record<string, Family[]> = { lgs: ["lgs"], tyt: ["tyt"], ayt: ["say", "ea", "soz"], ydt: ["dil"] };
  const candidates = wanted[exam.kind] ?? [];
  if (!candidates.length) return null;
  const data = await getScoreData(candidates);
  const families = relevantFamilies(
    exam.kind,
    sections.map((s) => s.code),
    data.models,
  );
  if (!families.length) return null;
  return <ScoreEstimate families={families} sections={sections} data={data} next={next} findHref={findHref} loggedIn={!!result.topics} />;
}
