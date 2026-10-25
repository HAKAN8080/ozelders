/**
 * Kendi hazırladığımız deneme PDF'inden soru resimlerini tarayıcıda keser.
 *
 * Yöntem: pdf.js metin konumlarından soru numaralarını ("1.", "2." …) bulur.
 * Numara sırayla aranır; "1." yeniden görülünce sonraki bölüme geçilir.
 * Her soru, kendi numarasından aynı sütundaki bir sonraki numaraya kadar kesilir,
 * kenardaki boşluklar kırpılır. Numara bulunamazsa "her sayfa bir soru" moduna düşülür.
 */

export type CropMode = "auto" | "page";
export type Crop = { section: number; no: number; page: number; blob: Blob; url: string; width: number; height: number };
export type CropResult = { crops: Crop[]; warnings: string[]; pages: number };

type Marker = { no: number; page: number; col: number; top: number; x: number };
type TextItem = { str: string; transform: number[]; height: number; width: number };
type PageInfo = { items: TextItem[]; w: number; h: number };

const SCALE = 2.2; // ~160 dpi: ekranda net, dosya küçük
const SPLIT = 0.45; // sütun ayrımı: sağ sütun numarası bu oranın sağında
const FOOTER = /diğer sayfaya geçiniz|^sayfa\s*\d+|^\d{1,3}$/i;

export async function cropExamPdf(
  file: File,
  opts: { mode: CropMode; sectionSizes: number[] },
  onProgress?: (done: number, total: number) => void,
): Promise<CropResult> {
  const { getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
  const warnings: string[] = [];
  const total = opts.sectionSizes.reduce((a, b) => a + b, 0);

  // 1) Metin konumlarını topla (hafif). Sayfalar ancak kesilirken, birer birer çizilir:
  //    33 sayfalık bir PDF'i aynı anda bellekte tutmak telefonda/sekmede çökmeye yol açar.
  const pages: PageInfo[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: SCALE });
    const w = Math.ceil(vp.width);
    const h = Math.ceil(vp.height);
    const tc = await page.getTextContent();
    const items = (tc.items as TextItem[])
      .filter((it) => typeof it.str === "string" && it.str.trim())
      .map((it) => {
        // PDF koordinatını (sol-alt) çizim koordinatına (sol-üst, ölçekli) çevir
        const [, , , , x, y] = it.transform;
        return { str: it.str, transform: [x * SCALE, h - y * SCALE], height: it.height * SCALE, width: it.width * SCALE };
      });
    pages.push({ items, w, h });
    page.cleanup();
    onProgress?.(i, pdf.numPages * 2);
  }

  const render = async (p: number) => {
    const page = await pdf.getPage(p + 1);
    const vp = page.getViewport({ scale: SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = pages[p].w;
    canvas.height = pages[p].h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
    page.cleanup();
    return canvas;
  };
  const release = (c: HTMLCanvasElement) => {
    c.width = 0;
    c.height = 0;
  };

  if (opts.mode === "page") {
    return {
      crops: await pageCrops(pages, render, release, opts.sectionSizes, onProgress),
      warnings: pageWarnings(pages.length, total),
      pages: pages.length,
    };
  }

  // 2) Soru numarası adaylarını topla (sayfa → sütun → yukarıdan aşağı)
  const all = collectCandidates(pages);

  // Her "1." adayından başlayarak sırayla eşleştir; en uzun diziyi seç.
  // Böylece kapaktaki "1. … 2. … 3." gibi numaralı açıklamalar soru sanılmaz.
  const walk = (start: number) => {
    const out: (Marker & { section: number })[] = [];
    let section = 0;
    let expected = 1;
    for (let i = start; i < all.length && section < opts.sectionSizes.length; i++) {
      if (all[i].no !== expected) continue;
      out.push({ ...all[i], section });
      expected++;
      if (expected > opts.sectionSizes[section]) {
        section++;
        expected = 1;
      }
    }
    return out;
  };
  let markers: (Marker & { section: number })[] = [];
  for (let i = 0; i < all.length; i++) {
    if (all[i].no !== 1) continue;
    const run = walk(i);
    // Eşit uzunlukta dizilerde sonrakini seç: kapak/yönerge listeleri gerçek sorulardan önce gelir
    if (run.length >= markers.length && run.length) markers = run;
  }

  if (markers.length < Math.min(3, total)) {
    warnings.push("Soru numaraları bulunamadı (PDF taranmış resim olabilir). Her sayfa bir soru olarak kesildi.");
    return {
      crops: await pageCrops(pages, render, release, opts.sectionSizes, onProgress),
      warnings: warnings.concat(pageWarnings(pages.length, total)),
      pages: pages.length,
    };
  }
  if (markers.length < total) {
    const last = markers[markers.length - 1];
    warnings.push(
      `${total} sorudan ${markers.length} tanesi bulundu (son bulunan: ${last.section + 1}. bölüm ${last.no}. soru). Eksikleri tek tek ekleyebilirsin.`,
    );
  }

  // 3) Her soruyu kes: numaradan, aynı sütun/sayfadaki bir sonraki numaraya ya da içerik sonuna kadar
  const crops: Crop[] = [];
  let canvas: HTMLCanvasElement | null = null;
  let canvasPage = -1;
  for (let i = 0; i < markers.length; i++) {
    const m = markers[i];
    const pg = pages[m.page];
    if (canvasPage !== m.page) {
      if (canvas) release(canvas);
      canvas = await render(m.page);
      canvasPage = m.page;
    }
    // Sağ sütunun sol kenarı: o sayfadaki sağ sütun soru numaralarından (yoksa sayfa ortası)
    const rightMarks = markers.filter((n) => n.page === m.page && n.col === 1).map((n) => n.x);
    const split = rightMarks.length ? Math.min(...rightMarks) - 3 * SCALE : pg.w * 0.5;
    const colX0 = m.col === 0 ? 0 : split;
    const colX1 = m.col === 0 ? split : pg.w;
    // Sütunu tek kullanan sayfalarda (tam genişlik soru) tüm sayfayı al
    const twoCols = pg.items.some((it) => it.transform[0] > pg.w * 0.52);
    const x0 = twoCols ? colX0 : 0;
    const x1 = twoCols ? colX1 : pg.w;
    const next = markers.find((n, j) => j > i && n.page === m.page && (n.col === m.col || !twoCols));
    const footerTop = Math.min(
      pg.h * 0.97,
      ...pg.items.filter((it) => it.transform[1] > pg.h * 0.88 && FOOTER.test(it.str.trim())).map((it) => it.transform[1] - it.height - 4),
    );
    const y0 = Math.max(0, m.top - 6 * SCALE);
    const y1 = next ? next.top - 4 * SCALE : footerTop;
    const crop = await cut(canvas!, x0, y0, x1, y1);
    if (crop) crops.push({ section: m.section, no: m.no, page: m.page + 1, ...crop });
    onProgress?.(pages.length + Math.round(((i + 1) / markers.length) * pages.length), pages.length * 2);
  }
  if (canvas) release(canvas);
  return { crops, warnings, pages: pages.length };
}

function pageWarnings(pages: number, total: number) {
  return pages === total ? [] : [`PDF'te ${pages} sayfa, sınavda ${total} soru var; sayfalar sırayla dağıtıldı, kontrol et.`];
}

async function pageCrops(
  pages: PageInfo[],
  render: (p: number) => Promise<HTMLCanvasElement>,
  release: (c: HTMLCanvasElement) => void,
  sizes: number[],
  onProgress?: (d: number, t: number) => void,
) {
  const out: Crop[] = [];
  let p = 0;
  for (let s = 0; s < sizes.length; s++) {
    for (let no = 1; no <= sizes[s] && p < pages.length; no++, p++) {
      const pg = pages[p];
      const canvas = await render(p);
      const crop = await cut(canvas, 0, 0, pg.w, pg.h);
      release(canvas);
      if (crop) out.push({ section: s, no, page: p + 1, ...crop });
      onProgress?.(pages.length + p + 1, pages.length * 2);
    }
  }
  return out;
}

/** Bölgeyi keser, kenarlardaki beyaz alanı kırpar, en fazla 1400 px genişlikte WebP üretir. */
async function cut(src: HTMLCanvasElement, x0: number, y0: number, x1: number, y1: number) {
  x0 = Math.max(0, Math.floor(x0));
  y0 = Math.max(0, Math.floor(y0));
  x1 = Math.min(src.width, Math.ceil(x1));
  y1 = Math.min(src.height, Math.ceil(y1));
  if (x1 - x0 < 20 || y1 - y0 < 20) return null;

  const ctx = src.getContext("2d", { willReadFrequently: true })!;
  const data = ctx.getImageData(x0, y0, x1 - x0, y1 - y0);
  const W = data.width;
  const H = data.height;
  const ink = (x: number, y: number) => {
    const k = (y * W + x) * 4;
    return data.data[k] < 235 || data.data[k + 1] < 235 || data.data[k + 2] < 235;
  };
  const rowInk = (y: number) => {
    for (let x = 0; x < W; x += 2) if (ink(x, y)) return true;
    return false;
  };
  const colInk = (x: number, t: number, b: number) => {
    for (let y = t; y < b; y += 2) if (ink(x, y)) return true;
    return false;
  };
  let t = 0;
  while (t < H && !rowInk(t)) t++;
  let b = H - 1;
  while (b > t && !rowInk(b)) b--;
  if (b - t < 10) return null;
  let l = 0;
  while (l < W && !colInk(l, t, b)) l++;
  let r = W - 1;
  while (r > l && !colInk(r, t, b)) r--;

  // Kenardaki ince çizgileri (sütun ayırıcı, üst/alt çizgi) at: boyunca uzanan, arkasında boşluk olan 1-6 px'lik bant
  const colFill = (x: number) => {
    let n = 0;
    for (let y = t; y <= b; y += 2) if (ink(x, y)) n++;
    return n / Math.max(1, (b - t) / 2);
  };
  const rowFill = (y: number) => {
    let n = 0;
    for (let x = l; x <= r; x += 2) if (ink(x, y)) n++;
    return n / Math.max(1, (r - l) / 2);
  };
  const rowInkLR = (y: number) => {
    for (let x = l; x <= r; x += 2) if (ink(x, y)) return true;
    return false;
  };
  /** from'dan içeri doğru: dolu ince bant (≤6 px) + en az 8 px boşluk varsa bandı atıp ilk mürekkebe döner. */
  const stripEdge = (from: number, to: number, fill: (i: number) => number, has: (i: number) => boolean) => {
    const step = to > from ? 1 : -1;
    const inside = (i: number) => (step > 0 ? i <= to : i >= to);
    let i = from;
    let band = 0;
    while (inside(i) && band < 7 && fill(i) > 0.6) {
      i += step;
      band++;
    }
    if (!band || band >= 7) return from;
    let gap = 0;
    while (inside(i) && !has(i)) {
      i += step;
      gap++;
    }
    return gap >= 8 && inside(i) ? i : from;
  };
  for (let pass = 0; pass < 2; pass++) {
    // çizgi atıldıktan sonra kalan boş kenarları da daralt
    while (b > t && !rowInkLR(b)) b--;
    while (t < b && !rowInkLR(t)) t++;
    r = stripEdge(r, l, colFill, (x) => colInk(x, t, b));
    l = stripEdge(l, r, colFill, (x) => colInk(x, t, b));
    b = stripEdge(b, t, rowFill, rowInkLR);
    t = stripEdge(t, b, rowFill, rowInkLR);
  }
  while (b > t && !rowInkLR(b)) b--;
  while (t < b && !rowInkLR(t)) t++;

  const pad = 12;
  const sx = Math.max(0, l - pad);
  const sy = Math.max(0, t - pad);
  const sw = Math.min(W, r + pad) - sx;
  const sh = Math.min(H, b + pad) - sy;
  const scale = Math.min(1, 1400 / sw);
  const out = document.createElement("canvas");
  out.width = Math.round(sw * scale);
  out.height = Math.round(sh * scale);
  const octx = out.getContext("2d")!;
  octx.fillStyle = "#fff";
  octx.fillRect(0, 0, out.width, out.height);
  octx.drawImage(src, x0 + sx, y0 + sy, sw, sh, 0, 0, out.width, out.height);
  const blob = await new Promise<Blob | null>((res) => out.toBlob(res, "image/webp", 0.85));
  if (!blob) return null;
  return { blob, url: URL.createObjectURL(blob), width: out.width, height: out.height };
}

function collectCandidates(pages: PageInfo[]): Marker[] {
  const all: Marker[] = [];
  for (let p = 0; p < pages.length; p++) {
    const { items, w } = pages[p];
    // İki sütunlu düzende sağ sütun sayfanın ortasından biraz önce başlayabilir (LGS: ~%47)
    const colOf = (x: number) => (x > w * SPLIT ? 1 : 0);
    const colLeft = [0, 1].map((c) => Math.min(...items.filter((it) => colOf(it.transform[0]) === c).map((it) => it.transform[0]), Infinity));
    const cands = items
      .map((it) => {
        const m = it.str.trim().match(/^(\d{1,2})\s?[.)]/);
        if (!m) return null;
        const x = it.transform[0];
        const col = colOf(x);
        if (x - colLeft[col] > 30 * SCALE) return null; // satır başında değil
        return { no: Number(m[1]), page: p, col, top: it.transform[1] - it.height, x };
      })
      .filter((m): m is Marker => !!m)
      .sort((a, b) => a.col - b.col || a.top - b.top);
    all.push(...cands);
  }
  return all;
}

/**
 * Cevap anahtarı olmayan (kendi hazırladığımız) PDF'te soru sayısını bulur.
 * Numaralar 1'den sırayla aranır; "1." yeniden başlarsa yeni bölüm sayılır.
 * Dönen dizi: bölüm başına soru sayısı (ör. [20, 20]). Hiç bulunamazsa [].
 */
export async function detectQuestionCounts(file: File): Promise<{ sizes: number[]; pages: number }> {
  const { getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
  const pages: PageInfo[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: SCALE });
    const h = Math.ceil(vp.height);
    const tc = await page.getTextContent();
    const items = (tc.items as TextItem[])
      .filter((it) => typeof it.str === "string" && it.str.trim())
      .map((it) => ({ str: it.str, transform: [it.transform[4] * SCALE, h - it.transform[5] * SCALE], height: it.height * SCALE, width: it.width * SCALE }));
    pages.push({ items, w: Math.ceil(vp.width), h });
    page.cleanup();
  }
  const all = collectCandidates(pages);
  let best: number[] = [];
  for (let i = 0; i < all.length; i++) {
    if (all[i].no !== 1) continue;
    const sizes = [0];
    let expected = 1;
    for (let j = i; j < all.length; j++) {
      const n = all[j].no;
      if (n === expected) {
        sizes[sizes.length - 1]++;
        expected++;
      } else if (n === 1 && expected > 3) {
        sizes.push(1);
        expected = 2;
      }
    }
    const total = sizes.reduce((x, y) => x + y, 0);
    if (total >= best.reduce((x, y) => x + y, 0)) best = sizes;
  }
  return { sizes: best.filter((n) => n > 0), pages: pdf.numPages };
}
