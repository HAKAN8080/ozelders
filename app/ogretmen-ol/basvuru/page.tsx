import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { recordBranchTest } from "@/app/ogretmen-ol/basvuru/actions";
import { AgreementForm, ApplicationForm, DemoForm, DocumentsForm } from "@/app/ogretmen-ol/basvuru/forms";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { formatNet } from "@/lib/exams";
import { createClient } from "@/lib/supabase/server";
import { BRANCH_TEST_PASS, branchName, FUNNEL, stageIndex } from "@/lib/teacher";

export const instant = false;
export const metadata: Metadata = { title: "Öğretmen başvurum — ÖzelDersBul", robots: { index: false, follow: false } };

const PAGE = "/ogretmen-ol/basvuru";
const eyebrow = "text-sm font-semibold uppercase tracking-[0.08em]";
const card = "flex flex-col gap-5 rounded-[10px] border border-border bg-background p-6 sm:p-8";
const dateFmt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul" });

export default async function ApplicationPage(props: PageProps<"/ogretmen-ol/basvuru">) {
  const sp = await props.searchParams;
  const session = await getSessionProfile();
  const errorMsg = typeof sp.hata === "string" ? sp.hata.slice(0, 160) : null;

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 pt-12 pb-20 sm:px-6">
          <div className="flex flex-col gap-2">
            <p className={`${eyebrow} m-0 text-primary`}>Öğretmen başvurusu</p>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-[44px]">Başvurum</h1>
          </div>
          {errorMsg ? (
            <p className="m-0 rounded-md bg-[#fdecea] px-4 py-3 text-[15px] text-destructive" role="alert">
              {errorMsg}
            </p>
          ) : null}
          {!session.userId ? <SignInFirst /> : <Body userId={session.userId} role={session.profile?.role ?? null} justSent={!!sp.gonderildi} />}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function SignInFirst() {
  const q = `?next=${encodeURIComponent(PAGE)}`;
  return (
    <section className={card}>
      <h2 className="m-0 text-2xl font-semibold">Önce bir hesap aç</h2>
      <p className="m-0 text-[17px] leading-relaxed text-[#3d4743]">
        Başvurunu kaydedebilmemiz ve her adımda sana haber verebilmemiz için ad, e-posta ve telefonla ücretsiz hesap
        açman yeterli. Sonra başvuru formuna dönersin.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href={`/kayit${q}`} className="rounded-md bg-primary px-6 py-4 font-semibold text-primary-foreground hover:bg-primary-hover">
          Hesap aç
        </Link>
        <Link href={`/giris${q}`} className="rounded-md border border-[#b9c7bf] bg-background px-5 py-4 font-semibold hover:bg-primary-soft">
          Hesabım var, giriş yap
        </Link>
      </div>
    </section>
  );
}

async function Body({ userId, role, justSent }: { userId: string; role: string | null; justSent: boolean }) {
  if (!role) redirect(`/kayit?next=${encodeURIComponent(PAGE)}`);
  const supabase = await createClient();
  const { data: app } = await supabase
    .from("teacher_applications")
    .select(
      "id, stage, subjects, grades_min, grades_max, submitted_at, rejected_at, rejection_reason, branch_test_score, demo_availability, demo_scheduled_at, demo_meeting_url, intro_video_url, branch_tests, criminal_record_consent_at, diploma_verified_at, criminal_record_verified_at, contract_signed_at",
    )
    .eq("profile_id", userId)
    .maybeSingle();

  if (role === "admin" && !app) {
    return (
      <section className={card}>
        <p className="m-0 text-[17px]">Yönetici hesabıyla girdin. Başvuruları yönetim ekranından görebilirsin.</p>
        <Link href="/admin/ogretmenler" className="self-start font-semibold text-primary hover:underline">
          Öğretmen başvuruları →
        </Link>
      </section>
    );
  }

  if (!app || (app.stage === "basvuru" && !app.submitted_at)) {
    return (
      <>
        <Progress current={0} />
        <section className={card}>
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-2xl font-semibold">Başvuru formu</h2>
            <p className="m-0 text-[16px] leading-relaxed text-[#3d4743]">
              5 dakika sürer. Gönderdiğinde hemen branş testine geçersin. Ücret yok, sonuç her adımda bu sayfada.
            </p>
          </div>
          <ApplicationForm />
        </section>
      </>
    );
  }

  if (app.rejected_at) {
    return (
      <section className={card}>
        <h2 className="m-0 text-2xl font-semibold">Başvurun bu dönem sonuçlanmadı.</h2>
        <p className="m-0 text-[17px] leading-relaxed text-[#3d4743]">
          {app.rejection_reason ?? "Değerlendirme sonucunda başvurunu şimdilik ilerletemiyoruz."} 6 ay sonra yeniden başvurabilirsin.
          Emeğin ve ilgin için teşekkür ederiz.
        </p>
      </section>
    );
  }

  const idx = stageIndex(app.stage);
  const recorded = (Array.isArray(app.branch_tests) ? app.branch_tests : []) as unknown as Recorded[];
  const passed = recorded.filter((r) => r.passed);
  return (
    <>
      {justSent ? (
        <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px] font-medium text-primary" role="status">
          Başvurun alındı. Sıradaki adım branş testi.
        </p>
      ) : null}
      <Progress current={idx} />
      <Summary subjects={app.subjects} gMin={app.grades_min} gMax={app.grades_max} />
      {passed.length ? (
        <p className="m-0 -mt-4 text-[16px] text-primary">
          Geçtiğin testler:{" "}
          <strong>
            {passed
              .map((r) => `${branchName(r.subject)} ${Math.max(r.grades_min, app.grades_min)}.–${Math.min(r.grades_max, app.grades_max)}. sınıf`)
              .join(", ")}
          </strong>
        </p>
      ) : null}
      {app.stage === "test" ? <TestStep userId={userId} recorded={recorded} optional={false} /> : null}
      {app.stage === "demo" ? (
        <section className={card}>
          <StepHead
            n={3}
            title="Canlı demo ders"
            body="Branş testini geçtin, tebrikler. Şimdi bir değerlendiriciyle 20 dakikalık çevrim içi bir ders yapacaksın: geçtiğin kademeden bir konuyu anlatırsın, değerlendirici öğrenci gibi sorular sorar."
          />
          {app.demo_scheduled_at ? (
            <div className="tahta flex flex-col gap-2 rounded-[10px] p-5 text-[#f2f5f1]">
              <span className={`${eyebrow} text-[#cfe3d6]`}>Demo dersin</span>
              <span className="font-serif text-2xl font-bold">{dateFmt.format(new Date(app.demo_scheduled_at))}</span>
              {app.demo_meeting_url ? (
                <a href={app.demo_meeting_url} target="_blank" rel="noopener noreferrer" className="self-start font-semibold text-white underline">
                  Görüşme bağlantısı →
                </a>
              ) : null}
              <span className="text-[15px] text-[#dce9e0]">Kimliğini yanında bulundur; görüşmenin başında kısa bir kimlik doğrulaması yapılır.</span>
            </div>
          ) : app.demo_availability ? (
            <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px]" role="status">
              Uygun saatlerin bize ulaştı. 2 iş günü içinde demo ders saatini e-postayla bildireceğiz.
            </p>
          ) : null}
          <DemoForm availability={app.demo_availability ?? ""} video={app.intro_video_url ?? ""} />
        </section>
      ) : null}
      {app.stage === "belge" ? (
        <section className={card}>
          <StepHead
            n={4}
            title="Belge doğrulama"
            body="Demo dersini geçtin. Belge yüklemen gerekmiyor: e-Devlet'ten alacağın iki belgenin barkod numarasını yazman yeterli. Kopya saklamıyoruz; barkodlar doğrulandıktan sonra silinir."
          />
          {app.criminal_record_consent_at ? (
            <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px]" role="status">
              Barkodlar alındı, doğrulanıyor (genellikle 1 iş günü).
              {app.diploma_verified_at ? " Mezun belgesi doğrulandı ✓" : ""}
              {app.criminal_record_verified_at ? " Adli sicil doğrulandı ✓" : ""}
            </p>
          ) : (
            <DocumentsForm />
          )}
        </section>
      ) : null}
      {app.stage === "oryantasyon" ? (
        <section className={card}>
          <StepHead
            n={5}
            title="Sözleşme ve ödeme hesabı"
            body="Son adım. Ödemelerin lisanslı ödeme kuruluşu üzerinden ders ders doğrudan sana geçer; bunun için adına bir alt hesap açılır. Onayların sonrasında hesabın açılır ve öğrenci önerileri gelmeye başlar."
          />
          {app.contract_signed_at ? (
            <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px]" role="status">
              Onayların alındı. Hesabın açılıyor; ödeme hesabı bilgilerini girmen için e-posta göndereceğiz.
            </p>
          ) : (
            <AgreementForm />
          )}
        </section>
      ) : null}
      {["demo", "belge", "oryantasyon"].includes(app.stage) ? <TestStep userId={userId} recorded={recorded} optional /> : null}
      {app.stage === "golge" || app.stage === "aktif" ? (
        <section className="tahta flex flex-col gap-3 rounded-[10px] p-7 text-[#f2f5f1] sm:p-9">
          <span className="font-hand text-[30px] text-white">aramıza hoş geldin ✓</span>
          <h2 className="m-0 font-serif text-3xl font-bold">ÖzelDersBul öğretmenisin.</h2>
          <p className="m-0 max-w-[40em] text-[17px] leading-relaxed text-[#dce9e0]">
            {app.stage === "golge"
              ? "İlk 3 dersin kıdemli bir öğretmenle birlikte incelenecek; amaç not vermek değil, ilk haftalarını kolaylaştırmak. Takvimini ve öğrenci önerilerini öğretmen panelinden yöneteceksin."
              : "Öğrenci önerileri ve takvimin öğretmen panelinde."}
          </p>
          <Link href="/ogretmen" className="self-start rounded-md bg-white px-6 py-3.5 font-semibold text-primary hover:bg-primary-soft">
            Öğretmen paneline git →
          </Link>
        </section>
      ) : null}
    </>
  );
}

function Progress({ current }: { current: number }) {
  return (
    <ol aria-label="Başvuru adımları" className="m-0 grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-6">
      {FUNNEL.map((f, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <li
            key={f.stage}
            aria-current={now ? "step" : undefined}
            className={`flex flex-col gap-1 rounded-md border px-3 py-2.5 text-sm ${
              now ? "border-primary bg-primary text-primary-foreground" : done ? "border-primary/40 bg-primary-soft text-primary" : "border-border bg-background text-muted"
            }`}
          >
            <span className="font-semibold tabular-nums">{done ? "✓" : i + 1}</span>
            <span className="leading-snug font-medium">{f.title}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Summary({ subjects, gMin, gMax }: { subjects: string[]; gMin: number; gMax: number }) {
  return (
    <p className="m-0 text-[16px] text-[#3d4743]">
      Branşların: <strong>{subjects.map(branchName).join(", ")}</strong> · {gMin}.–{gMax}. sınıf
    </p>
  );
}

function StepHead({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`${eyebrow} text-primary`}>Adım {n}</span>
      <h2 className="m-0 text-2xl font-semibold">{title}</h2>
      <p className="m-0 max-w-[46em] text-[16px] leading-relaxed text-[#3d4743]">{body}</p>
    </div>
  );
}

type Recorded = { exam_id: string; score: number; passed: boolean; subject: string; grades_min: number; grades_max: number };

async function TestStep({ userId, recorded, optional }: { userId: string; recorded: Recorded[]; optional: boolean }) {
  const supabase = await createClient();
  // Branş + kademe eşleşmesi veritabanında (başvurunun branşları ve sınıf aralığı)
  const { data: tests } = await supabase.rpc("teacher_branch_tests");
  const list = tests ?? [];
  const done = new Map(recorded.map((r) => [r.exam_id, r]));
  const ids = list.map((t) => t.exam_id);
  const { data: attempts } = ids.length
    ? await supabase.from("exam_attempts").select("id, exam_id, total_net, created_at").eq("user_id", userId).in("exam_id", ids).order("created_at")
    : { data: [] as { id: string; exam_id: string; total_net: number; created_at: string }[] };
  const first = new Map<string, { id: string; total_net: number }>();
  for (const a of attempts ?? []) if (!first.has(a.exam_id)) first.set(a.exam_id, a);

  const open = list.filter((t) => !done.has(t.exam_id));
  if (optional && open.length === 0) return null;

  return (
    <section className={card}>
      {optional ? (
        <div className="flex flex-col gap-2">
          <h2 className="m-0 text-xl font-semibold">Diğer kademe testlerin (isteğe bağlı)</h2>
          <p className="m-0 max-w-[46em] text-[16px] leading-relaxed text-[#3d4743]">
            Başvurduğun sınıf aralığında başka kademeler de var. Bu testleri de geçersen o sınıflarda da ders verebilirsin;
            geçemezsen mevcut onayın etkilenmez.
          </p>
        </div>
      ) : (
        <StepHead
          n={2}
          title="Branş testi"
          body={`Her test bir branş ve bir kademe içindir (3–4, 5–8 ya da 9–12. sınıf). %${BRANCH_TEST_PASS} ve üstü demo derse geçer; geçtiğin kademede ders verirsin. Her test bir kez çözülür, tekrar çözsen de ilk denemen sayılır.`}
        />
      )}
      {list.length === 0 ? (
        <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px]" role="status">
          Seçtiğin branş ve sınıf aralığı için branş testini hazırlıyoruz. Hazır olduğunda e-postayla haber vereceğiz; başvurun kayıtlı.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {list.map((t) => {
            const rec = done.get(t.exam_id);
            const att = first.get(t.exam_id);
            return (
              <li key={t.exam_id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border p-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-semibold">{t.title}</span>
                  <span className="text-[15px] text-muted">
                    {branchName(t.subject)} · {t.grades_min}.–{t.grades_max}. sınıf · {t.question_count} soru · {t.duration_min} dakika
                  </span>
                </div>
                {rec ? (
                  <span className={`rounded px-3 py-1.5 text-[15px] font-semibold ${rec.passed ? "bg-primary-soft text-primary" : "bg-[#fdecea] text-destructive"}`}>
                    %{formatNet(Number(rec.score)).replace(/,00$/, "")} · {rec.passed ? "geçtin ✓" : "baraj altı"}
                  </span>
                ) : att ? (
                  <form action={recordBranchTest}>
                    <input type="hidden" name="attempt" value={att.id} />
                    <button type="submit" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
                      Sonucu başvuruma işle
                    </button>
                  </form>
                ) : (
                  <Link href={`/deneme/${t.slug}`} className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">
                    Teste başla
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
