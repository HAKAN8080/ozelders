"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitResult = { ok: true; id: string; token: string } | { ok: false; error: string };

const LETTERS = new Set(["A", "B", "C", "D", "E"]);

/**
 * Cevapları sunucuya gönderir. Puanlama tamamen veritabanında yapılır;
 * istemci cevap anahtarını hiç görmez. Giriş yapılmışsa deneme hesaba bağlanır.
 */
export async function submitExam(
  examId: string,
  answers: Record<string, Record<string, string>>,
  name: string,
  grade: number,
): Promise<SubmitResult> {
  // Gelen veriyi daralt: yalnızca bölüm -> soru no -> tek harf
  const clean: Record<string, Record<string, string>> = {};
  for (const [section, qs] of Object.entries(answers ?? {})) {
    if (!/^[a-z]{2,20}$/.test(section) || typeof qs !== "object" || qs === null) continue;
    clean[section] = {};
    for (const [no, letter] of Object.entries(qs)) {
      if (/^\d{1,3}$/.test(no) && typeof letter === "string" && LETTERS.has(letter)) {
        clean[section][no] = letter;
      }
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_exam_attempt", {
    p_exam: examId,
    p_answers: clean,
    p_name: (name ?? "").slice(0, 40),
    p_grade: Number.isInteger(grade) ? grade : 8,
  });

  if (error || !data) {
    return { ok: false, error: "Cevapların gönderilemedi. Bağlantını kontrol edip yeniden dene." };
  }
  const result = data as { id: string; token: string };
  return { ok: true, id: result.id, token: result.token };
}
