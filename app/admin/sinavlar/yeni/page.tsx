import type { Metadata } from "next";

import { AdminShell } from "@/app/admin/admin-shell";
import { NewExamForm } from "@/app/admin/sinavlar/yeni/new-exam-form";
import { requireAdmin } from "@/lib/admin";

export const instant = false;
export const metadata: Metadata = { title: "Yeni sınav — Yönetim", robots: { index: false, follow: false } };

export default async function NewExamPage() {
  await requireAdmin("/admin/sinavlar/yeni");
  return (
    <AdminShell title="Yeni sınav">
      <NewExamForm />
    </AdminShell>
  );
}
