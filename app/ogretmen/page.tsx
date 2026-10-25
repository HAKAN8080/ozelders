import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AvailabilityEditor, LessonActions, OfferActions, ProfileForm } from "@/app/ogretmen/panels";
import { signOut } from "@/app/panel/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { goalLabel, prefSummary, type Pref } from "@/lib/requests";
import { bandInfo, BANDS, branchName, TEACHER_FLOOR } from "@/lib/teacher";

export const instant = false;
export const metadata: Metadata = { title: "Öğretmen paneli — ÖzelDersBul", robots: { index: false, follow: false } };

const eyebrow = "text-sm font-semibold uppercase tracking-[0.08em]";
const card = "flex flex-col gap-5 rounded-[10px] border border-border bg-background p-6 sm:p-7";
const dt = new Intl.DateTimeFormat("tr-TR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });
const dFmt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" });

type Level = { subject: string; grades_min: number; grades_max: number };
type LessonRow = { id: string; starts_at: string; ends_at: string; status: string; meeting_url: string | null; students: { first_name: string; grade: number } | null };

/** Karne ocak, nisan, temmuz ve ekim başında çalışır. */
function nextReview(now: Date): Date {
  const y = now.getFullYear();
  for (const m of [0, 3, 6, 9]) {
    const d = new Date(Date.UTC(y, m, 1));
    if (d > now) return d;
  }
  return new Date(Date.UTC(y + 1, 0, 1));
}

export default async function TeacherPanel() {
  const session = await getSessionProfile();
  if (!session.userId) redirect("/giris?next=/ogretmen");
  const supabase = await createClient();
  const { data: t } = await supabase
    .from("teachers")
    .select("display_name, bio, intro_video_url, status, branch_levels, commission_band, activated_at")
    .eq("profile_id", session.userId)
    .maybeSingle();
  if (!t) redirect("/ogretmen-ol/basvuru");

  const now = new Date();
  const from = new Date(now.getTime() - 7 * 86400000).toISOString();
  const to = new Date(now.getTime() + 21 * 86400000).toISOString();
  const [{ data: avail }, { data: payout }, { data: lessons }, { count: doneMonth }, { data: offers }] = await Promise.all([
    supabase.from("teacher_availability").select("weekday, start_time, end_time").eq("teacher_id", session.userId).order("weekday").order("start_time"),
    supabase.from("teacher_payout_info").select("submerchant_status, iban_last4").eq("profile_id", session.userId).maybeSingle(),
    supabase
      .from("lessons")
      .select("id, starts_at, ends_at, status, meeting_url, students(first_name, grade)")
      .eq("teacher_id", session.userId)
      .gte("starts_at", from)
      .lte("starts_at", to)
      .order("starts_at"),
    supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("teacher_id", session.userId)
      .eq("status", "tamamlandi")
      .gte("starts_at", new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()),
    supabase.rpc("teacher_intro_offers"),
  ]);
  const pendingOffers = (offers ?? []).filter((o) => o.status === "bekliyor");
  const acceptedOffers = (offers ?? []).filter((o) => o.status === "kabul");

  const band = bandInfo(t.commission_band);
  const levels = (Array.isArray(t.branch_levels) ? t.branch_levels : []) as unknown as Level[];
  const rows = (lessons ?? []) as unknown as LessonRow[];
  const toMark = rows.filter((l) => l.status === "planlandi" && new Date(l.starts_at) <= now);
  const upcoming = rows.filter((l) => l.status === "planlandi" && new Date(l.starts_at) > now);
  const slots = (avail ?? []).map((a) => ({ weekday: a.weekday, start: a.start_time.slice(0, 5), end: a.end_time.slice(0, 5) }));
  const nextBand = BANDS[BANDS.findIndex((b) => b.code === band.code) + 1];

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-4 pt-12 pb-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className={`${eyebrow} m-0 text-primary`}>Öğretmen paneli</p>
              <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-[44px]">Merhaba, {t.display_name}</h1>
            </div>
            <form action={signOut}>
              <button type="submit" className="rounded-md border border-border bg-background px-4 py-2.5 font-semibold hover:bg-primary-soft">
                Çıkış
              </button>
            </form>
          </div>

          {t.status === "golge" ? (
            <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px] text-primary" role="status">
              Gölge dönemdesin: ilk 3 dersinin kayıtları kıdemli bir öğretmenle birlikte incelenecek. Sonra hesabın tam aktif olur.
            </p>
          ) : null}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            <div className="tahta flex flex-col gap-1.5 rounded-[10px] p-6 text-[#f2f5f1]">
              <span className={`${eyebrow} text-[#cfe3d6]`}>Bandın</span>
              <span className="font-serif text-[40px] leading-none font-bold">{band.name}</span>
              <span className="text-[15px] text-[#dce9e0]">
                Komisyon %{Math.round(band.commission * 100)} · payın %{Math.round((1 - band.commission) * 100)}
              </span>
              <span className="text-[14px] text-[#cfe3d6]">
                {nextBand ? `Sonraki bant ${nextBand.name}: ${nextBand.note.toLocaleLowerCase("tr")}` : "En üst bant"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 rounded-[10px] border border-border bg-background p-6">
              <span className={`${eyebrow} text-muted`}>Sonraki karne</span>
              <span className="font-serif text-[30px] leading-tight font-bold">{dFmt.format(nextReview(now))}</span>
              <span className="text-[15px] text-[#3d4743]">Dönemde en az 24 ders ya da 3 öğrencinin deneme verisi gerekir; yoksa bandın korunur.</span>
            </div>
            <div className="flex flex-col gap-1.5 rounded-[10px] border border-border bg-background p-6">
              <span className={`${eyebrow} text-muted`}>Bu ay</span>
              <span className="font-serif text-[40px] leading-none font-bold tabular-nums">{doneMonth ?? 0}</span>
              <span className="text-[15px] text-[#3d4743]">tamamlanan ders · ders başı en az {TEACHER_FLOOR} ₺</span>
            </div>
          </div>

          <section className={card}>
            <div className="flex flex-col gap-1">
              <h2 className="m-0 text-2xl font-semibold">Ders verdiğin alanlar</h2>
              <p className="m-0 text-[15px] text-muted">Geçtiğin branş testlerine göre. Yeni kademe eklemek için destekle iletişime geç.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => (
                <span key={`${l.subject}-${l.grades_min}`} className="rounded-full bg-primary-soft px-4 py-2 text-[15px] font-semibold text-primary">
                  {branchName(l.subject)} · {l.grades_min}.–{l.grades_max}. sınıf
                </span>
              ))}
            </div>
          </section>

          <section className={card}>
            <div className="flex flex-col gap-1">
              <h2 className="m-0 text-2xl font-semibold">Haftalık müsaitliğin</h2>
              <p className="m-0 text-[15px] text-muted">
                Öğrenci önerileri ve ders saatleri bu takvime göre yapılır. Önerilen öğrenciyi kabul etmek de senin elinde.
              </p>
            </div>
            <AvailabilityEditor initial={slots} />
          </section>

          <section className={card}>
            <h2 className="m-0 text-2xl font-semibold">Derslerin</h2>
            {toMark.length ? (
              <div className="flex flex-col gap-2">
                <span className="text-[15px] font-semibold text-destructive">İşaretlenmeyi bekleyen dersler</span>
                {toMark.map((l) => (
                  <LessonRowView key={l.id} l={l} action={<LessonActions id={l.id} />} />
                ))}
              </div>
            ) : null}
            {upcoming.length ? (
              <div className="flex flex-col gap-2">
                <span className="text-[15px] font-semibold">Önümüzdeki 3 hafta</span>
                {upcoming.map((l) => (
                  <LessonRowView
                    key={l.id}
                    l={l}
                    action={
                      l.meeting_url ? (
                        <a href={l.meeting_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                          Derse gir →
                        </a>
                      ) : null
                    }
                  />
                ))}
              </div>
            ) : null}
            {!toMark.length && !upcoming.length ? (
              <p className="m-0 text-[16px] text-[#3d4743]">
                Henüz planlanmış dersin yok. Müsaitliğini girdiğinde, sana uygun öğrencileri önermeye başlayacağız.
              </p>
            ) : null}
          </section>

          <section className={card}>
            <div className="flex flex-col gap-1">
              <h2 className="m-0 text-2xl font-semibold">Öğrenci önerileri</h2>
              <p className="m-0 text-[15px] text-muted">
                Veliler seni listeden seçip ücretsiz 20 dakikalık tanışma dersi ister. 24 saat içinde yanıt ver; reddetmek karneni etkilemez.
              </p>
            </div>
            {pendingOffers.length === 0 && acceptedOffers.length === 0 ? (
              <p className="m-0 rounded-md bg-[#f6f8f7] px-4 py-3 text-[16px]">Şu an bekleyen istek yok.</p>
            ) : null}
            {pendingOffers.map((o) => (
              <div key={o.offer_id} className="flex flex-col gap-3 rounded-[10px] border border-primary p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-lg font-semibold">
                      {o.student_name} · {o.grade}. sınıf · {branchName(o.subject)}
                    </span>
                    <span className="text-[15px] text-muted">
                      {goalLabel(o.goal)} · tercih: {prefSummary((o.preferred ?? []) as unknown as Pref[])}
                    </span>
                  </div>
                  <span className="rounded-full bg-primary-soft px-3 py-1 text-[14px] font-semibold text-primary">
                    Tanışma: {dt.format(new Date(o.starts_at))}
                  </span>
                </div>
                {o.note ? <p className="m-0 rounded-md bg-[#f6f8f7] px-4 py-2.5 text-[15px]">“{o.note}”</p> : null}
                {o.exam_title && Array.isArray(o.exam_results) ? (
                  <p className="m-0 text-[15px]">
                    <strong>{o.exam_title}:</strong>{" "}
                    {(o.exam_results as unknown as { name: string; net: number }[]).map((r) => `${r.name} ${String(r.net).replace(".", ",")} net`).join(" · ")}
                  </p>
                ) : null}
                <span className="text-sm text-muted">Yanıt için son: {dt.format(new Date(o.expires_at))}</span>
                <OfferActions id={o.offer_id} />
              </div>
            ))}
            {acceptedOffers.map((o) => (
              <div key={o.offer_id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border px-4 py-3">
                <span>
                  <strong>Tanışma ✓</strong> {o.student_name} · {o.grade}. sınıf · {branchName(o.subject)} — {dt.format(new Date(o.starts_at))}
                </span>
                {o.meeting_url ? (
                  <a href={o.meeting_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                    Görüşmeye gir →
                  </a>
                ) : (
                  <span className="text-sm text-muted">Bağlantı eklenmedi</span>
                )}
              </div>
            ))}
          </section>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
            <section className={card}>
              <h2 className="m-0 text-2xl font-semibold">Profilin</h2>
              <ProfileForm bio={t.bio ?? ""} video={t.intro_video_url ?? ""} />
            </section>
            <section className={card}>
              <h2 className="m-0 text-2xl font-semibold">Ödeme hesabın</h2>
              {payout?.submerchant_status === "aktif" ? (
                <p className="m-0 text-[16px]">Ödeme hesabın aktif{payout.iban_last4 ? ` · IBAN ••${payout.iban_last4}` : ""}. Ödemeler her hafta toplu aktarılır.</p>
              ) : (
                <p className="m-0 text-[16px] leading-relaxed text-[#3d4743]">
                  Ödeme hesabın açılış sırasında. Hesap açılırken kimlik numaran ve IBAN&apos;ın doğrudan lisanslı ödeme kuruluşuna
                  iletilecek; bizde saklanmaz. Hazır olduğunda sana e-postayla bağlantı göndereceğiz.
                </p>
              )}
              <Link href="/ogretmen-sozlesmesi" className="self-start font-semibold text-primary hover:underline">
                Öğretmen sözleşmesi →
              </Link>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function LessonRowView({ l, action }: { l: LessonRow; action: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border px-4 py-3">
      <div className="flex flex-col">
        <span className="font-semibold">{dt.format(new Date(l.starts_at))}</span>
        <span className="text-[15px] text-muted">
          {l.students ? `${l.students.first_name} · ${l.students.grade}. sınıf` : "Öğrenci"}
        </span>
      </div>
      {action}
    </div>
  );
}
