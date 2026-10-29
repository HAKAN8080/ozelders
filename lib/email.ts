import "server-only";

/**
 * İşlem e-postaları (Resend HTTP API). Anahtar yoksa gönderim atlanır ve kayda düşer;
 * e-posta hiçbir zaman asıl işlemi bozmaz.
 *
 * Ortam değişkenleri: RESEND_API_KEY, EMAIL_FROM (ör. "Özel Ders · Thorius <bildirim@ozelders.thorius.com.tr>"),
 * ADMIN_NOTIFY_EMAIL (yeni başvuru vb. için, virgülle birden fazla), NEXT_PUBLIC_SITE_URL.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ozelders.thorius.com.tr";
const FROM = process.env.EMAIL_FROM ?? "Özel Ders · Thorius <bildirim@ozelders.thorius.com.tr>";

export type Mail = { to: string | string[]; subject: string; title: string; body: string[]; cta?: { label: string; href: string } };

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

export function renderMail(m: Mail): { html: string; text: string } {
  const href = m.cta ? (m.cta.href.startsWith("http") ? m.cta.href : SITE + m.cta.href) : null;
  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#f6f8f7;font-family:Arial,Helvetica,sans-serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8f7;padding:24px 0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border:1px solid #dfe6e2;border-radius:10px">
<tr><td style="padding:22px 28px;border-bottom:3px solid #0b4f2e;font-family:Georgia,serif;font-size:20px;font-weight:bold">Özel Ders <span style="font-family:Arial,sans-serif;font-size:13px;font-weight:normal;color:#6b7570">· Thorius</span></td></tr>
<tr><td style="padding:26px 28px 8px"><h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:22px;line-height:1.3">${esc(m.title)}</h1>
${m.body.map((p) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#2c3531">${esc(p)}</p>`).join("")}
${href ? `<p style="margin:20px 0 8px"><a href="${esc(href)}" style="display:inline-block;background:#0b4f2e;color:#fff;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:6px">${esc(m.cta!.label)}</a></p>` : ""}
</td></tr>
<tr><td style="padding:18px 28px 24px;font-size:12px;line-height:1.5;color:#6b7570">Bu e-postayı Özel Ders · Thorius hesabındaki bir işlem nedeniyle aldın. Prosedürü biz hallederiz, sen derse odaklan.<br>${esc(SITE.replace(/^https?:\/\//, ""))}</td></tr>
</table></td></tr></table></body></html>`;
  const text = [m.title, "", ...m.body, ...(href ? ["", `${m.cta!.label}: ${href}`] : []), "", "Özel Ders · Thorius · Thorius Eğitim ve Danışmanlık Ltd. Şti."].join("\n");
  return { html, text };
}

export async function sendMail(m: Mail): Promise<boolean> {
  const to = (Array.isArray(m.to) ? m.to : [m.to]).map((x) => x.trim()).filter((x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x));
  if (!to.length) return false;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[e-posta atlandı: RESEND_API_KEY yok] ${m.subject} → ${to.length} alıcı`);
    return false;
  }
  const { html, text } = renderMail(m);
  try {
    const res = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject: m.subject, html, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[e-posta hatası] ${res.status} ${m.subject}`);
    return res.ok;
  } catch (e) {
    console.error(`[e-posta hatası] ${m.subject}`, e instanceof Error ? e.message : e);
    return false;
  }
}

export function adminRecipients(): string[] {
  return (process.env.ADMIN_NOTIFY_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

const APPLY = "/ogretmen-ol/basvuru";

/** Öğretmen başvurusu e-postaları (başvurana). */
export const teacherMail = {
  received: (to: string, name: string): Mail => ({
    to,
    subject: "Başvurun alındı · sıradaki adım branş testi",
    title: `Hoş geldin${name ? `, ${name}` : ""}.`,
    body: [
      "Öğretmen başvurun bize ulaştı. Sıradaki adım branş testi: çevrim içi, 20 soru, 30 dakika.",
      "Testi sessiz bir ortamda, tek oturumda çöz; her test bir kez çözülür. Branşın için test henüz yayında değilse hazır olduğunda yeniden yazacağız.",
    ],
    cta: { label: "Başvuruma git", href: APPLY },
  }),
  testPassed: (to: string): Mail => ({
    to,
    subject: "Branş testini geçtin · demo ders için saatlerini gir",
    title: "Tebrikler, branş testini geçtin.",
    body: [
      "Sıradaki adım 20 dakikalık çevrim içi bir demo ders. Başvuru sayfandan uygun olduğun gün ve saatleri yaz; 2 iş günü içinde saatini bildiririz.",
    ],
    cta: { label: "Uygun saatlerimi gir", href: APPLY },
  }),
  demoScheduled: (to: string, when: string, url: string | null): Mail => ({
    to,
    subject: `Demo dersin: ${when}`,
    title: "Demo dersin planlandı.",
    body: [
      `Tarih ve saat: ${when}.`,
      url ? `Görüşme bağlantısı: ${url}` : "Görüşme bağlantısı başvuru sayfanda paylaşılacak.",
      "Kimliğini yanında bulundur; görüşmenin başında kısa bir görüntülü kimlik doğrulaması yapılır. Başvurduğun kademeden bir konuyu 10–15 dakikada anlatman beklenir.",
    ],
    cta: { label: "Başvuruma git", href: APPLY },
  }),
  demoPassed: (to: string): Mail => ({
    to,
    subject: "Demo dersini geçtin · belge doğrulama",
    title: "Demo dersini geçtin.",
    body: [
      "Sıradaki adım belge doğrulama. Belge yüklemen gerekmiyor: e-Devlet'ten alacağın mezun belgesi ve adli sicil kaydının barkod numaralarını başvuru sayfana yazman yeterli.",
    ],
    cta: { label: "Barkodları gir", href: APPLY },
  }),
  docsVerified: (to: string): Mail => ({
    to,
    subject: "Belgelerin doğrulandı · son adım",
    title: "Belgelerin doğrulandı.",
    body: [
      "Son adım: öğretmen sözleşmesini ve ödeme hesabı onayını başvuru sayfandan ver. Onaylarının ardından hesabın açılır.",
    ],
    cta: { label: "Son adıma geç", href: APPLY },
  }),
  approved: (to: string): Mail => ({
    to,
    subject: "Artık Özel Ders · Thorius öğretmenisin",
    title: "Aramıza hoş geldin.",
    body: [
      "Başvurun onaylandı. İlk 3 dersin kıdemli bir öğretmenle birlikte incelenecek; amaç not vermek değil, ilk haftalarını kolaylaştırmak.",
      "Ödeme hesabını açman için ayrıca bilgi göndereceğiz. Biz de öğretmeniz: sen derse odaklan, gerisini biz hallederiz.",
    ],
    cta: { label: "Öğretmen paneline git", href: "/ogretmen" },
  }),
  rejected: (to: string, reason: string): Mail => ({
    to,
    subject: "Öğretmen başvurun hakkında",
    title: "Başvurun bu dönem sonuçlanmadı.",
    body: [reason, "6 ay sonra yeniden başvurabilirsin. Emeğin ve ilgin için teşekkür ederiz."],
  }),
};

/** Yönetime bildirim. */
export function adminMail(subject: string, line: string, appId: string): Mail {
  return { to: adminRecipients(), subject: `[Yönetim] ${subject}`, title: subject, body: [line], cta: { label: "Başvuruyu aç", href: `/admin/ogretmenler/${appId}` } };
}

const tsFmt = new Intl.DateTimeFormat("tr-TR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Istanbul" });
export function formatWhen(iso: string): string {
  return tsFmt.format(new Date(iso));
}

/** Tanışma dersi e-postaları. */
export const introMail = {
  toTeacher: (to: string, student: string, grade: number, subject: string, when: string): Mail => ({
    to,
    subject: `Yeni tanışma dersi isteği · ${student}, ${grade}. sınıf`,
    title: "Bir veli seninle tanışmak istiyor.",
    body: [
      `${student} (${grade}. sınıf, ${subject}) için ücretsiz 20 dakikalık tanışma dersi: ${when}.`,
      "24 saat içinde öğretmen panelinden kabul ya da ret yanıtı ver. Reddetmek karneni etkilemez; yanıt vermemek yanıt hızı puanını düşürür.",
    ],
    cta: { label: "İsteği gör", href: "/ogretmen" },
  }),
  accepted: (to: string, teacher: string, when: string, url: string | null, requestId: string): Mail => ({
    to,
    subject: `Tanışma dersi onaylandı · ${when}`,
    title: `${teacher} tanışma dersini onayladı.`,
    body: [
      `Ücretsiz 20 dakikalık tanışma dersi: ${when}.`,
      url ? `Görüşme bağlantısı: ${url}` : "Görüşme bağlantısını ders saatinden önce sayfanda paylaşacağız.",
      "Tanışmadan sonra devam etmek istersen paketini seçersin; istemezsen başka bir öğretmenle tanışabilirsin.",
    ],
    cta: { label: "Talebimi aç", href: `/panel/talep/${requestId}` },
  }),
  declined: (to: string, teacher: string, requestId: string): Mail => ({
    to,
    subject: "Tanışma dersi için başka bir öğretmen seç",
    title: `${teacher} bu saatte uygun değil.`,
    body: ["Listeden başka bir öğretmen ya da başka bir saat seçebilirsin; sistem önerileri yıldızla işaretli."],
    cta: { label: "Öğretmen listesine dön", href: `/panel/talep/${requestId}` },
  }),
};

export function orderMail(to: string, teacher: string, product: string, lessons: number, price: number, requestId: string): Mail {
  return {
    to,
    subject: `Paket seçimin alındı · ${lessons} ders`,
    title: "Paket seçimin alındı.",
    body: [
      `${teacher} ile ${lessons} derslik ${product.toLocaleLowerCase("tr")} paket: ${price.toLocaleString("tr-TR")} TL, tek çekim.`,
      "Ödeme adımı için sana ayrıca e-posta göndereceğiz. Ödemen ders ders güvenli hesapta bekler; yapılmayan dersin parası iade edilir.",
    ],
    cta: { label: "Talebimi aç", href: `/panel/talep/${requestId}` },
  };
}
