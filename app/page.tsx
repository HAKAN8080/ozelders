import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DenemeCarousel, type CarouselExam } from "@/components/deneme-carousel";
import { gradeLabel, kindInfo } from "@/lib/exam-kinds";
import { getPublishedExams, totalQuestions } from "@/lib/exams";
import { formatTL, getActiveProducts, type Product } from "@/lib/products";

const eyebrow = "text-sm font-semibold uppercase tracking-[0.08em]";

/** Paket kodlarına göre ders sıklığı metni. Fiyat, ders sayısı ve süre veritabanından gelir. */
const rhythm: Record<string, string> = {
  BASLANGIC: "haftada 1",
  STANDART: "haftada 2",
  YOGUN: "haftada 3",
  SEZON: "aylık veli görüşmesi",
};
const featured = "STANDART";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <HowItWorks />
        <Packages />
        <Teachers />
      </main>
      <SiteFooter />
    </>
  );
}

/** Arka planda, kareli defterin üstünde ama içeriğin arkasında kalan soluk tebeşir formüller. */
function ChalkFormulas() {
  const items: [string, string][] = [
    ["net = D − Y/3", "left-[2%] top-[2%] -rotate-3 text-[30px]"],
    ["a² + b² = c²", "right-[4%] top-[6%] rotate-3 text-[30px]"],
    ["√144 = 12", "left-[44%] top-[3%] rotate-2 text-[28px] max-lg:hidden"],
    ["π ≈ 3,14", "right-[30%] bottom-[7%] -rotate-3 text-[32px]"],
    ["x = (−b ± √Δ) / 2a", "left-[2%] bottom-[5%] rotate-2 text-[28px] max-md:hidden"],
    ["F = m · a", "right-[2%] bottom-[22%] -rotate-6 text-[30px] max-md:hidden"],
    ["2⁵ = 32", "left-[38%] bottom-[14%] rotate-6 text-[26px] max-lg:hidden"],
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none font-hand text-primary opacity-[0.13]">
      {items.map(([t, cls]) => (
        <span key={t} className={`absolute whitespace-nowrap ${cls}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="defter relative overflow-hidden border-b border-border">
      <ChalkFormulas />
      <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:pt-22 lg:pb-24">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
          <p className={`${eyebrow} m-0 text-primary`}>3.–12. sınıf · tüm okul dersleri · LGS ve YKS hazırlık</p>
          <h1 className="m-0 font-serif text-4xl leading-[1.08] font-bold tracking-[-0.01em] sm:text-5xl lg:text-[56px]">
            Oyna, kendini test et, doğru öğretmenle hızlan.
            <span className="mt-3 block text-[0.62em] leading-[1.2] text-primary">Her sınıfta, her derste.</span>
          </h1>
          <p className="m-0 max-w-[34em] text-[19px] leading-relaxed text-[#3d4743]">
            3. sınıftan 12. sınıfa: konuları oyunlarla oynayarak pekiştir, ücretsiz denemelerle nerede olduğunu gör,
            eksik kalan konular için seçilmiş bir öğretmenle birebir çalış. LGS ya da YKS yılındaysan tahmini puanını ve
            hedefine kalan neti de görürsün.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/deneme"
              className="rounded-md bg-primary px-6 py-4 text-[17px] font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Ücretsiz denemeyi çöz
            </Link>
            <Link
              href="/oyunlar"
              className="rounded-md border border-[#b9c7bf] bg-background px-5 py-4 text-[17px] font-semibold text-foreground hover:bg-primary-soft"
            >
              Oyunlarla öğren
            </Link>
            <Link href="#nasil" className="px-2 py-4 text-[17px] font-semibold text-primary hover:underline">
              Nasıl çalışır?
            </Link>
          </div>
        </div>

        <Suspense fallback={<div className="tahta min-h-[460px] min-w-0 flex-[1_1_400px] rounded-[10px]" />}>
          <WeeklyExams />
        </Suspense>
      </div>
    </section>
  );
}

/** Yayındaki ücretsiz denemeler sırayla döner (en yenisi önce, en çok 8). */
async function WeeklyExams() {
  const exams = (await getPublishedExams()).slice(0, 8);
  const slides: CarouselExam[] = exams.map((e) => ({
    slug: e.slug,
    title: e.title,
    meta: [kindInfo(e.kind).short, gradeLabel(e.grade), e.subtitle].filter(Boolean).join(" · "),
    questions: totalQuestions(e),
    duration: e.duration_min,
    sections: e.sections.length,
    detail: `${e.sections.map((s) => `${s.name} ${s.question_count}`).join(" + ")} soru. ${
      e.booklet_hosted ? "Soruları ekranda aç, cevapları dijital optik formda işaretle." : "Gerçek sınav kitapçığıyla, dijital optik formda çöz."
    }`,
  }));
  if (!slides.length) {
    slides.push({
      slug: "",
      title: "Ücretsiz denemeler",
      meta: "3.–12. sınıf",
      questions: 0,
      duration: 0,
      sections: 0,
      detail: "Yeni denemeler çok yakında. Şimdiden listeye göz at.",
    });
  }
  return <DenemeCarousel exams={slides} />;
}

function HowItWorks() {
  const steps = [
    ["Ölç", "Ücretsiz denemeyi çöz. Netini ve katılımcılar arasındaki sıranı hemen gör."],
    ["Eşleştir", "Hangi kazanımlarda puan kaybettiğini görürsün. Biz de o konularda güçlü bir öğretmen öneririz."],
    ["Raporla", "Her dersten sonra kısa rapor, her ay ara sınav. İlerlemeyi sözle değil netle görürsün."],
  ];
  return (
    <section id="nasil" className="tahta scroll-mt-4 text-[#f2f5f1]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-20 sm:px-6 lg:py-22">
        <div className="flex max-w-[40em] flex-col gap-3">
          <p className={`${eyebrow} m-0 text-[#cfe3d6]`}>Nasıl çalışır</p>
          <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-bold sm:text-[42px]">
            Üç adım. Tahmin yok, ölçüm var.
          </h2>
        </div>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10 p-0">
          {steps.map(([title, body], i) => (
            <li key={title} className="flex flex-col gap-3.5">
              <span aria-hidden="true" className="font-hand text-[56px] leading-none text-white">
                {i + 1}.
              </span>
              <h3 className="m-0 text-2xl font-semibold">{title}</h3>
              <p className="m-0 text-[17px] leading-relaxed text-[#dce9e0]">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section id="paketler" className="defter scroll-mt-4 border-b border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-20 sm:px-6 lg:py-22">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className={`${eyebrow} m-0 text-primary`}>Paketler</p>
            <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-bold sm:text-[42px]">
              Taahhüt yok. Otomatik yenileme yok.
            </h2>
          </div>
          <p className="m-0 max-w-[26em] text-base leading-relaxed text-[#3d4743]">
            Her ders 50 dakika, birebir ve kayıtlı. İlk dersten memnun kalmazsan paketin tamamını iade ederiz.
          </p>
        </div>
        <Suspense fallback={<PackageGridSkeleton />}>
          <PackageGrid />
        </Suspense>
      </div>
    </section>
  );
}

async function PackageGrid() {
  let products: Product[] = [];
  try {
    products = await getActiveProducts();
  } catch {
    products = [];
  }
  const main = products.filter((p) => p.kind === "ana");
  const extra = products.filter((p) => p.kind === "ek_ay");

  if (main.length === 0) {
    return (
      <p className="m-0 text-base text-muted">
        Paket bilgileri şu an yüklenemedi. Lütfen birazdan yeniden deneyin.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
        {main.map((p) => (
          <PackageCard key={p.code} product={p} highlighted={p.code === featured} />
        ))}
      </div>
      {extra.length > 0 && (
        <p className="m-0 text-[15px] text-muted">
          Paketin bitiyor mu? Aynı öğretmenle <strong className="text-foreground">Ek Ay</strong> alabilirsin:{" "}
          {extra
            .map((p) => `haftada ${Math.round(p.lesson_count / 4)} ders ${formatTL(p.price)}`)
            .join(", ")}
          .
        </p>
      )}
    </>
  );
}

function PackageCard({ product: p, highlighted }: { product: Product; highlighted: boolean }) {
  const weeks = Math.round(p.validity_days / 7);
  const perLesson = Math.round(p.price / p.lesson_count);
  const meta = [`${p.lesson_count} ders`, rhythm[p.code], `${weeks} hafta`].filter(Boolean).join(" · ");

  return (
    <div
      className={`relative flex flex-col gap-3.5 rounded-[10px] bg-background p-7 ${
        highlighted ? "border-2 border-primary" : "border border-border"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3.5 left-6 rounded bg-primary px-2.5 py-1 text-[13px] font-semibold text-primary-foreground">
          En çok seçilen
        </span>
      )}
      <h3 className="m-0 text-xl font-semibold">{p.name}</h3>
      <p className="m-0 text-[15px] text-muted">{meta}</p>
      <p className="m-0 font-serif text-4xl font-bold tabular-nums">{formatTL(p.price)}</p>
      <p className="m-0 text-[15px] text-muted">ders başı {formatTL(perLesson)}</p>
      <Link
        href={`/kayit?paket=${p.code}`}
        className={`mt-auto rounded-md py-3 text-center text-base font-semibold ${
          highlighted
            ? "bg-primary text-primary-foreground hover:bg-primary-hover"
            : "border border-primary text-primary hover:bg-primary-soft"
        }`}
      >
        Seç
      </Link>
    </div>
  );
}

function PackageGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-[268px] rounded-[10px] border border-border bg-background" />
      ))}
    </div>
  );
}

function Teachers() {
  const stages = [
    ["Branş testi", "Ders verdiği sınıf düzeyinde branş soruları, %85 başarı şartı."],
    ["Canlı demo ders", "Konu hâkimiyeti, anlatım ve etkileşim puanlanır."],
    ["Belge doğrulama", "Kimlik ve diploma doğrulanır, adli sicil kaydı her yıl yenilenir. Belge kopyası saklanmaz."],
    ["Gözetimli ilk dersler", "İlk 3 ders kıdemli bir öğretmen tarafından incelenir."],
  ];
  return (
    <section id="ogretmenler" className="scroll-mt-4 bg-background">
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-14 px-4 py-20 sm:px-6 lg:py-22">
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4">
          <p className={`${eyebrow} m-0 text-primary`}>Öğretmenlerimiz</p>
          <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-bold sm:text-[42px]">
            Öğretmenlerimiz, belli süreçlerden ve onaylardan geçerek sizinle buluşur.
          </h2>
          <p className="m-0 text-[17px] leading-relaxed text-[#3d4743]">
            Her öğretmen dört aşamadan geçer. Böylece çocuğunuzun karşısına bilgisini ve anlatımını göstermiş, belgeleri doğrulanmış biri çıkar.
          </p>
          <p className="m-0 mt-1 -rotate-1 font-hand text-[26px] text-primary">ve dersler hep kayıtlı ✓</p>
          <Link href="/ogretmen-ol" className="mt-2 self-start font-semibold text-primary hover:underline">
            Öğretmen misin? Üyelik ücreti yok, başvur →
          </Link>
          <figure className="m-0 mt-4 flex flex-col gap-2">
            <Image
              src="https://images.unsplash.com/photo-1758685848061-3080d0780285?fm=jpg&q=70&w=1200&auto=format&fit=crop"
              alt="Tahtadaki denklemlere bakan bir öğretmen"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 480px, 100vw"
              className="aspect-[4/3] w-full rounded-[10px] border border-border object-cover shadow-[0_18px_40px_rgb(11_79_46/0.14)]"
            />
            <figcaption className="text-xs text-muted">
              Temsili görsel · Fotoğraf:{" "}
              <a
                href="https://unsplash.com/@silverkblack?utm_source=ozelders&utm_medium=referral"
                className="underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vitaly Gariev
              </a>{" "}
              /{" "}
              <a
                href="https://unsplash.com/photos/woman-looking-at-a-blackboard-with-complex-math-equations-2N518py2mrQ?utm_source=ozelders&utm_medium=referral"
                className="underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
            </figcaption>
          </figure>
        </div>
        <ol className="m-0 grid min-w-0 flex-[1_1_560px] list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] border-t border-border p-0">
          {stages.map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-b border-border py-6 pr-6">
              <span aria-hidden="true" className="font-serif text-[28px] font-bold text-primary tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="m-0 mb-1.5 text-lg font-semibold">{title}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
