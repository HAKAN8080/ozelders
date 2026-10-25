import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CancelButton, PackageChooser, TeacherList, type Option } from "@/app/panel/talep/[id]/teacher-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { formatWhen } from "@/lib/email";
import { goalLabel, prefSummary, type Pref } from "@/lib/requests";
import { getActiveProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { branchName } from "@/lib/teacher";

export const instant = false;
export const metadata: Metadata = { title: "Öğretmen seç — ÖzelDersBul", robots: { index: false, follow: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Offer = { id: string; teacher_id: string; status: string; starts_at: string; ends_at: string; expires_at: string; meeting_url: string | null; teachers: { display_name: string } | null };

export default async function RequestPage(props: PageProps<"/panel/talep/[id]">) {
  const { id } = await props.params;
  const session = await getSessionProfile();
  if (!session.userId) redirect(`/giris?next=/panel/talep/${id}`);
  if (!UUID.test(id)) notFound();
  const supabase = await createClient();
  const { data: r } = await supabase
    .from("lesson_requests")
    .select("id, student_id, subject, goal, preferred, note, status, students(first_name, grade)")
    .eq("id", id)
    .maybeSingle();
  if (!r) notFound();
  const st = r.students as unknown as { first_name: string; grade: number };
  const [{ data: opts }, { data: offers }, { data: order }, products] = await Promise.all([
    supabase.rpc("request_teacher_options", { p_request: id }),
    supabase
      .from("intro_offers")
      .select("id, teacher_id, status, starts_at, ends_at, expires_at, meeting_url, teachers(display_name)")
      .eq("request_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("package_orders").select("product_code, price, lesson_count").eq("request_id", id).eq("status", "odeme_bekliyor").maybeSingle(),
    getActiveProducts().catch(() => []),
  ]);
  const options = (opts ?? []) as unknown as Option[];
  const list = (offers ?? []) as unknown as Offer[];
  const now = new Date().getTime();
  const live = list.find((o) => (o.status === "bekliyor" && Date.parse(o.expires_at) > now) || (o.status === "kabul" && Date.parse(o.ends_at) > now));
  // Tanışma yapıldı: kabul edilmiş ve saati geçmiş; talep hâlâ bu öğretmenle eşleşik
  const done = r.status === "eslesti" ? list.find((o) => o.status === "kabul" && Date.parse(o.ends_at) <= now) : undefined;
  const mainProducts = products.filter((p) => p.kind === "ana");
  const last = !live ? list[0] : null;
  const lastFailed = last && (last.status === "ret" || last.status === "suresi_doldu" || (last.status === "bekliyor" && Date.parse(last.expires_at) <= now));

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-7 px-4 pt-12 pb-20 sm:px-6">
          <div className="flex flex-col gap-2">
            <Link href="/panel" className="text-[15px] font-semibold text-primary hover:underline">
              ← Panelim
            </Link>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-[42px]">
              {st.first_name} için {branchName(r.subject).toLocaleLowerCase("tr")} öğretmeni
            </h1>
            <p className="m-0 text-[16px] text-[#3d4743]">
              {st.grade}. sınıf · {goalLabel(r.goal)} · {prefSummary((r.preferred ?? []) as unknown as Pref[])}{" "}
              <Link href={`/panel/ogretmen-bul?cocuk=${r.student_id}&ders=${r.subject}`} className="font-semibold text-primary hover:underline">
                Değiştir
              </Link>
            </p>
          </div>

          {done ? (
            <section className="flex flex-col gap-5 rounded-[10px] border border-primary bg-background p-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">Tanışma yapıldı</span>
                <h2 className="m-0 font-serif text-2xl font-bold">{done.teachers?.display_name} ile devam etmek ister misin?</h2>
                <p className="m-0 text-[16px] text-[#3d4743]">
                  Paketini seç; taahhüt ve otomatik yenileme yok. Ödemen ders ders güvenli hesapta bekler, yapılmayan dersin parası iade edilir.
                </p>
              </div>
              <PackageChooser
                requestId={id}
                products={mainProducts.map((p) => ({ code: p.code, name: p.name, lessons: p.lesson_count, price: Number(p.price), days: p.validity_days }))}
                current={order ? { code: order.product_code, price: Number(order.price), lessons: order.lesson_count } : null}
              />
            </section>
          ) : null}

          {live ? (
            <section className="tahta flex flex-col gap-3 rounded-[10px] p-6 text-[#f2f5f1] sm:p-8" aria-live="polite">
              {live.status === "bekliyor" ? (
                <>
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#cfe3d6]">Onay bekleniyor</span>
                  <h2 className="m-0 font-serif text-2xl font-bold">
                    {live.teachers?.display_name} ile tanışma: {formatWhen(live.starts_at)}
                  </h2>
                  <p className="m-0 text-[16px] text-[#dce9e0]">
                    Öğretmen en geç {formatWhen(live.expires_at)} tarihine kadar yanıt verecek. Yanıt gelince e-postayla haber vereceğiz.
                  </p>
                  <CancelButton offerId={live.id} requestId={id} label="İsteği iptal et" />
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold uppercase tracking-[0.08em] text-[#cfe3d6]">Tanışma dersi onaylandı ✓</span>
                  <h2 className="m-0 font-serif text-2xl font-bold">
                    {live.teachers?.display_name} · {formatWhen(live.starts_at)}
                  </h2>
                  {live.meeting_url ? (
                    <a href={live.meeting_url} target="_blank" rel="noopener noreferrer" className="self-start rounded-md bg-white px-5 py-3 font-semibold text-primary hover:bg-primary-soft">
                      Görüşmeye katıl
                    </a>
                  ) : (
                    <p className="m-0 text-[16px] text-[#dce9e0]">Görüşme bağlantısı ders saatinden önce burada ve e-postanda olacak.</p>
                  )}
                  <p className="m-0 text-[15px] text-[#dce9e0]">
                    20 dakika, ücretsiz. Tanışmadan sonra devam etmek istersen paketini seçersin; istemezsen başka bir öğretmenle tanışabilirsin.
                  </p>
                  <CancelButton offerId={live.id} requestId={id} label="Tanışmayı iptal et" />
                </>
              )}
            </section>
          ) : lastFailed ? (
            <p className="m-0 rounded-md bg-[#fff6e0] px-4 py-3 text-[16px] text-[#6b4e00]" role="status">
              {last!.teachers?.display_name} {last!.status === "ret" ? "bu saatte uygun değil" : "zamanında yanıt vermedi"}. Aşağıdan başka bir öğretmen
              ya da başka bir saat seçebilirsin.
            </p>
          ) : null}

          {r.status !== "acik" ? null : options.length ? (
            <>
              <p className="m-0 text-[16px] text-[#3d4743]">
                <strong>{options.length}</strong> öğretmen dersine, sınıfına ve saatlerine uyuyor. Hepsi branş testi, demo ders ve belge
                kontrolünden geçti; <span className="font-semibold text-primary">★ sistem önerisi</span> saat uyumu ve öğretmen karnesine göre en
                uygun olanlar.
              </p>
              <TeacherList requestId={id} options={options} locked={!!live} />
            </>
          ) : (
            <section className="flex flex-col gap-3 rounded-[10px] border border-border bg-background p-6">
              <h2 className="m-0 text-xl font-semibold">Şu an tüm kriterlere uyan öğretmen yok.</h2>
              <p className="m-0 text-[16px] text-[#3d4743]">
                Talebin kayıtlı. Saat tercihini genişletirsen daha fazla öğretmen çıkabilir; uygun bir öğretmen katıldığında sana e-postayla
                haber vereceğiz.
              </p>
              <Link href={`/panel/ogretmen-bul?cocuk=${r.student_id}&ders=${r.subject}`} className="self-start font-semibold text-primary hover:underline">
                Saat tercihini değiştir →
              </Link>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
