import { getSupabaseUrl } from "@/lib/supabase/env";

export const EXAM_IMAGE_BUCKET = "exam-images";

export type QuestionImage = { path: string; width: number | null; height: number | null };

/** Herkese açık bucket'taki soru resminin adresi (CDN üzerinden). */
export function examImageUrl(path: string): string {
  return `${getSupabaseUrl()}/storage/v1/object/public/${EXAM_IMAGE_BUCKET}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export function imageKey(section: string, no: number) {
  return `${section}:${no}`;
}

/**
 * Tarayıcıda resmi küçültüp WebP'ye çevirir (en fazla 1400 px genişlik).
 * Telefonda çekilmiş 4-5 MB'lık fotoğraflar ~150-300 KB'a iner.
 */
export async function compressImage(file: File, maxWidth = 1400): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#ffffff"; // şeffaf PNG'ler beyaz zeminde dursun
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  if (!blob) throw new Error("encode");
  return { blob, width, height };
}

/** "soru 2.png", "soru 10.png" sırası: sayılar sayı olarak karşılaştırılır. */
export function naturalSort(files: File[]): File[] {
  const c = new Intl.Collator("tr", { numeric: true, sensitivity: "base" });
  return [...files].sort((a, b) => c.compare(a.name, b.name));
}

export const EXAM_BOOKLET_BUCKET = "exam-booklets";

/** Kendi denemelerimizin kitapçık PDF'i (bizim depoda). */
export function bookletPublicUrl(path: string): string {
  return `${getSupabaseUrl()}/storage/v1/object/public/${EXAM_BOOKLET_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
}
