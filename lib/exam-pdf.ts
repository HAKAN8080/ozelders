/**
 * Sınav kitapçığı PDF'inden (sayfa metinleri) bölümleri, cevap anahtarını ve soru metinlerini çıkarır.
 * Saf fonksiyonlar: tarayıcıda çalışır, PDF hiçbir sunucuya yüklenmez.
 * MEB LGS kitapçık biçimine göre yazıldı; başka yayınlarda sonuç eksik çıkarsa admin elle tamamlar.
 */

export type ParsedSection = {
  code: string;
  name: string;
  answers: string[]; // index 0 = 1. soru
  snippets: Record<number, string>; // soru no -> metnin başı (konu tahmini için)
};

export type ParsedExam = {
  sections: ParsedSection[];
  answerKeyFound: boolean;
  warnings: string[];
};

const KNOWN_SECTIONS: { code: string; name: string; pattern: RegExp }[] = [
  { code: "turkce", name: "Türkçe", pattern: /^T[ÜU]RK[ÇC]E$/ },
  { code: "inkilap", name: "T.C. İnkılap Tarihi ve Atatürkçülük", pattern: /İNKILAP|INKILAP/ },
  { code: "din", name: "Din Kültürü ve Ahlak Bilgisi", pattern: /D[İI]N K[ÜU]LT[ÜU]R[ÜU]/ },
  { code: "ingilizce", name: "İngilizce", pattern: /^(YABANCI D[İI]L|[İI]NG[İI]L[İI]ZCE)/ },
  { code: "matematik", name: "Matematik", pattern: /^MATEMAT[İI]K$/ },
  { code: "fen", name: "Fen Bilimleri", pattern: /^FEN B[İI]L[İI]MLER[İI]$/ },
];

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

function upperTr(s: string): string {
  return s.toLocaleUpperCase("tr");
}

function matchSection(line: string) {
  const u = upperTr(normalizeLine(line));
  return KNOWN_SECTIONS.find((s) => s.pattern.test(u)) ?? null;
}

/** Sayfa başlığı: sayfa no, "Diğer sayfaya geçiniz", eğitim yılı gibi ekler temizlenip aranır. */
function matchHeader(line: string) {
  const cleaned = upperTr(line)
    .replace(/D[İI]ĞER SAYFAYA GEÇ[İI]N[İI]Z\.?/g, " ")
    .replace(/\d{4}\s*-\s*\d{4}\s*EĞ[İI]T[İI]M\s*-\s*ÖĞRET[İI]M YILI/g, " ")
    .replace(/\d+/g, " ");
  return matchSection(cleaned);
}

/** Cevap anahtarı sayfası: "1. B" satırları + bölüm adı satırları. */
function parseAnswerKey(pages: string[]): { code: string; name: string; answers: string[] }[] {
  const keyPages = pages.filter((t) => /CEVAP\s+ANAHTARI/i.test(upperTr(t)));
  if (keyPages.length === 0) return [];

  type Tok = { kind: "block"; answers: string[] } | { kind: "name"; code: string; name: string };
  const toks: Tok[] = [];
  let current: string[] = [];
  const flush = () => {
    if (current.length) toks.push({ kind: "block", answers: current });
    current = [];
  };

  for (const page of keyPages) {
    for (const raw of page.split(/\n/)) {
      const line = normalizeLine(raw);
      // Bir satırda birden fazla "1. B 2. C" olabilir
      const pairs = [...line.matchAll(/(\d{1,3})\s*[.)-]\s*([A-E])(?![A-Za-zÇĞİÖŞÜçğıöşü])/g)];
      if (pairs.length && pairs.map((m) => m[0]).join(" ").length >= line.replace(/\s/g, "").length * 0.6) {
        for (const m of pairs) {
          const no = Number(m[1]);
          if (no === 1 && current.length) flush();
          if (no === current.length + 1) current.push(m[2]);
        }
        continue;
      }
      const sec = matchSection(line);
      if (sec) {
        flush();
        toks.push({ kind: "name", code: sec.code, name: sec.name });
      }
    }
    flush();
  }

  const blocks = toks.filter((t) => t.kind === "block") as Extract<Tok, { kind: "block" }>[];
  const names = toks.filter((t) => t.kind === "name") as Extract<Tok, { kind: "name" }>[];
  // Ad önce mi sonra mı geliyor? İlk token'a bak.
  return blocks.map((b, i) => {
    const n = names[i];
    return n
      ? { code: n.code, name: n.name, answers: b.answers }
      : { code: `bolum${i + 1}`, name: `Bölüm ${i + 1}`, answers: b.answers };
  });
}

/** Soru metinlerinin başı: bölüm başlıklarını izleyerek sıradaki soru numarasını yakalar. */
function parseSnippets(pages: string[]): Record<string, Record<number, string>> {
  const out: Record<string, Record<number, string>> = {};
  let sec: string | null = null;
  let expected = 1;
  let curNo = 0;
  let buf = "";

  const commit = () => {
    if (sec && curNo > 0 && buf) {
      out[sec] ??= {};
      out[sec][curNo] = buf.slice(0, 600).trim();
    }
    buf = "";
  };

  for (const page of pages) {
    if (/CEVAP\s+ANAHTARI/i.test(upperTr(page))) continue;
    const lines = page.split(/\n/).map(normalizeLine).filter(Boolean);
    // Sayfanın ilk satırlarındaki bölüm adı = o sayfanın bölümü
    const head = lines.slice(0, 5).map(matchHeader).find(Boolean);
    const newTest = lines.some((l) => /Bu testte \d+ soru vard/i.test(l));
    if (head && (head.code !== sec || newTest)) {
      commit();
      if (head.code !== sec) {
        sec = head.code;
        expected = 1;
        curNo = 0;
      }
    }
    if (!sec) continue;

    for (const line of lines) {
      if (/Bu testte \d+ soru vard|Cevaplarınızı|Diğer sayfaya geçiniz|EĞİTİM - ÖĞRETİM YILI|MERKEZ[İÎI] SINAV/i.test(line)) continue;
      const m = line.match(/^(\d{1,3})\.\s+(.*)$/);
      if (m && Number(m[1]) === expected) {
        commit();
        curNo = expected;
        expected += 1;
        buf = m[2];
        continue;
      }
      if (curNo > 0 && buf.length < 600) buf += " " + line;
    }
  }
  commit();
  return out;
}

export function parseExamPages(pages: string[]): ParsedExam {
  const warnings: string[] = [];
  const key = parseAnswerKey(pages);
  const snippets = parseSnippets(pages);

  let sections: ParsedSection[];
  if (key.length) {
    sections = key.map((k) => ({ ...k, snippets: snippets[k.code] ?? {} }));
  } else {
    warnings.push("Cevap anahtarı sayfası bulunamadı. Cevapları elle gir.");
    sections = Object.entries(snippets).map(([code, sn]) => {
      const known = KNOWN_SECTIONS.find((s) => s.code === code);
      const count = Math.max(0, ...Object.keys(sn).map(Number));
      return { code, name: known?.name ?? code, answers: Array(count).fill(""), snippets: sn };
    });
  }

  for (const s of sections) {
    const found = Object.keys(s.snippets).length;
    if (found && found !== s.answers.length) {
      warnings.push(`${s.name}: anahtarda ${s.answers.length} soru var, kitapçıkta ${found} soru metni bulundu. Kontrol et.`);
    }
  }
  if (sections.length === 0) warnings.push("Hiç bölüm bulunamadı. PDF metin içermiyor olabilir (taranmış görüntü).");
  return { sections, answerKeyFound: key.length > 0, warnings };
}
