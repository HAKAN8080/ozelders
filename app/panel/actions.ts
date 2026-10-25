"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSessionProfile, normalizePersonName } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ChildState = { ok: true } | { ok: false; error: string } | null;

const grades = new Set([5, 6, 7, 8, 9, 10, 11, 12]);

export async function addChild(
  _prev: ChildState,
  formData: FormData,
): Promise<ChildState> {
  const session = await getSessionProfile();
  if (!session.userId) {
    redirect("/giris");
  }
  if (session.profile?.role !== "veli") {
    return { ok: false, error: "Çocuk eklemek için veli hesabı gerekir." };
  }

  const firstName = normalizePersonName(
    String(formData.get("first_name") ?? ""),
    40,
  );
  if (!firstName) {
    return { ok: false, error: "Çocuğun adını yazın. Rakam kullanmayın." };
  }

  const grade = Number(formData.get("grade"));
  if (!grades.has(grade)) {
    return { ok: false, error: "Sınıf 5 ile 12 arasında olmalı." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("students").insert({
    parent_id: session.userId,
    first_name: firstName,
    grade,
  });

  if (error) {
    return { ok: false, error: "Çocuk eklenemedi. Yeniden deneyin." };
  }

  revalidatePath("/panel");
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/giris");
}
