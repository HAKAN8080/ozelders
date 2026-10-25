/**
 * "Yeni sınav" ekranında seçilen kendi PDF'imizi, sınav oluşturulduktan sonra açılan
 * düzenleme ekranına taşır (aynı sekmede, sayfa yenilenmeden). Hiçbir yere yüklenmez.
 */
let pending: File | null = null;

export function setPendingPdf(file: File | null) {
  pending = file;
}

export function takePendingPdf(): File | null {
  const f = pending;
  pending = null;
  return f;
}
