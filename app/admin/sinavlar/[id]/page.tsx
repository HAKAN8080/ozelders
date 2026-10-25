import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/app/admin/admin-shell";
import { ExamEditor } from "@/app/admin/sinavlar/[id]/exam-editor";
import { requireAdmin } from "@/lib/admin";
import { imageKey } from "@/lib/exam-images";
import type { ExamKind } from "@/lib/exam-kinds";
import { createClient } from "@/lib/supabase/server";

export const instant = false;
export const metadata: Metadata = { title: "Sınav düzenle — Yönetim", robots: { index: false, follow: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditExamPage(props: PageProps<"/admin/sinavlar/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  await requireAdmin(`/admin/sinavlar/${id}`);
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: exam }, { data: sections }, { data: questions }, { count }, { data: imgRows }] = await Promise.all([
    supabase
      .from("exams")
      .select("id, slug, title, subtitle, grade, booklet_url, booklet_path, booklet_label, duration_min, kind, option_count, wrong_penalty, status, published_at")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("exam_sections").select("code, name, position").eq("exam_id", id).order("position"),
    supabase.from("exam_questions").select("section, no, correct, topic").eq("exam_id", id).order("no"),
    supabase.from("exam_attempts").select("id", { count: "exact", head: true }).eq("exam_id", id),
    supabase.from("exam_question_images").select("section, no, path, width, height").eq("exam_id", id),
  ]);
  if (!exam) notFound();

  const editable = (sections ?? []).map((s) => ({
    code: s.code,
    name: s.name,
    questions: (questions ?? [])
      .filter((q) => q.section === s.code)
      .map((q) => ({ no: q.no, correct: q.correct, topic: q.topic ?? "" })),
  }));

  return (
    <AdminShell
      title={exam.title}
      actions={
        <Link href="/admin/sinavlar" className="font-semibold text-primary hover:underline">
          ← Tüm sınavlar
        </Link>
      }
    >
      {sp.yeni ? (
        <p className="m-0 rounded-md bg-primary-soft p-4 text-[15px]" role="status">
          Sınav <strong>taslak</strong> olarak oluşturuldu. Cevapları ve konuları son kez kontrol et; kitapçık PDF&apos;ini yükle (ya da resmi kitapçık bağlantısını gir), sonra yayınla.
        </p>
      ) : null}
      <ExamEditor
        exam={{
          id: exam.id,
          slug: exam.slug,
          status: exam.status,
          title: exam.title,
          subtitle: exam.subtitle ?? "",
          grade: exam.grade,
          kind: exam.kind as ExamKind,
          option_count: exam.option_count,
          wrong_penalty: exam.wrong_penalty,
          booklet_url: exam.booklet_url ?? "",
          booklet_path: exam.booklet_path,
          booklet_label: exam.booklet_label ?? "",
          duration_min: exam.duration_min,
        }}
        sections={editable}
        attemptCount={count ?? 0}
        images={Object.fromEntries(
          (imgRows ?? []).map((r) => [imageKey(r.section, r.no), { path: r.path, width: r.width, height: r.height }]),
        )}
      />
    </AdminShell>
  );
}
