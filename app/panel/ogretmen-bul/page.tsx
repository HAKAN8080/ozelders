import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RequestForm } from "@/app/panel/ogretmen-bul/request-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const instant = false;
export const metadata: Metadata = { title: "Öğretmen bul — ÖzelDersBul", robots: { index: false, follow: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function FindTeacherPage(props: PageProps<"/panel/ogretmen-bul">) {
  const sp = await props.searchParams;
  const q = new URLSearchParams(Object.entries(sp).filter(([, v]) => typeof v === "string") as [string, string][]).toString();
  const session = await getSessionProfile();
  if (!session.userId) redirect(`/giris?next=${encodeURIComponent(`/panel/ogretmen-bul${q ? `?${q}` : ""}`)}`);
  if (session.profile?.role !== "veli") redirect("/panel");

  const supabase = await createClient();
  const { data: kids } = await supabase.from("students").select("id, first_name, grade").order("created_at");
  const attempt = typeof sp.deneme === "string" && UUID.test(sp.deneme) ? sp.deneme : "";
  let examTitle: string | null = null;
  let weakest = "";
  if (attempt) {
    const { data } = await supabase.from("exam_attempts").select("results, exams(title)").eq("id", attempt).maybeSingle();
    examTitle = (data?.exams as unknown as { title: string } | null)?.title ?? null;
    // En düşük netli bölüm: dersi önceden seçmek için
    const res = (Array.isArray(data?.results) ? data!.results : []) as unknown as { code: string; net: number }[];
    weakest = [...res].sort((a, b) => a.net - b.net)[0]?.code ?? "";
  }

  return (
    <>
      <SiteHeader />
      <main className="defter flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[860px] flex-col gap-8 px-4 pt-12 pb-20 sm:px-6">
          <div className="flex flex-col gap-2">
            <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">Öğretmen bul</p>
            <h1 className="m-0 font-serif text-4xl leading-[1.1] font-bold sm:text-[44px]">Doğru öğretmenle tanış.</h1>
            <p className="m-0 max-w-[40em] text-[17px] leading-relaxed text-[#3d4743]">
              Ders, sınıf ve saatine uyan tüm öğretmenleri listeleriz; en uygunlarını yıldızla işaretleriz. Seçtiğin öğretmenle
              önce ücretsiz 20 dakikalık bir tanışma dersi yaparsın.
            </p>
          </div>
          {examTitle ? (
            <p className="m-0 rounded-md bg-primary-soft px-4 py-3 text-[16px] text-primary">
              <strong>{examTitle}</strong> sonucun talebe eklenecek; öğretmen eksik konuları derse girmeden görür.
            </p>
          ) : null}
          <section className="rounded-[10px] border border-border bg-background p-6 sm:p-8">
            {kids && kids.length ? (
              <RequestForm
                kids={kids}
                initialChild={typeof sp.cocuk === "string" ? sp.cocuk : ""}
                attemptId={attempt}
                initialSubject={typeof sp.ders === "string" ? sp.ders : weakest}
              />
            ) : (
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[17px]">Önce çocuğunu ekle: yalnızca adı ve sınıfı yeterli.</p>
                <Link href={`/panel${q ? `?next=${encodeURIComponent(`/panel/ogretmen-bul?${q}`)}` : ""}`} className="self-start rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground">
                  Çocuğumu ekle
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
