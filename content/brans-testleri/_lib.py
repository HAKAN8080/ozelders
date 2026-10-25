"""Branş testi üretimi: soru listesinden kitapçık HTML'i, PDF ve gizli cevap anahtarı.

Her soru: (konu, düzey, soru_html, [doğru, çeldirici, ...]). Doğru şık ilk sırada yazılır;
yerleşim, her harfe eşit sayıda doğru düşecek ve aynı harf üst üste 3 kez gelmeyecek şekilde karıştırılır.
"""
import json, os, random, re

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def _key(n, letters, seed):
    rng = random.Random(seed)
    per = n // len(letters)
    while True:
        key = list(letters * per)
        rng.shuffle(key)
        if all(not (key[i] == key[i + 1] == key[i + 2]) for i in range(n - 2)):
            return key


CSS = """
@page { size: A4; margin: 16mm 14mm 18mm; }
* { box-sizing: border-box; }
body { font-family: "IBM Plex Sans", "DejaVu Sans", Arial, sans-serif; font-size: 10.5pt; color: #111; margin: 0; }
header { border-bottom: 2px solid #0b4f2e; padding-bottom: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-end; }
header .brand { font-family: Georgia, serif; font-weight: 700; font-size: 15pt; }
header .brand span { font-family: Arial, sans-serif; font-weight: 400; font-size: 8.5pt; color: #5b6560; margin-left: 6px; }
header .t { text-align: right; font-size: 10pt; font-weight: 600; color: #0b4f2e; }
h1 { font-family: Georgia, serif; font-size: 17pt; margin: 4px 0 6px; }
.info { background: #e8f1ec; border-radius: 6px; padding: 8px 12px; font-size: 9.5pt; line-height: 1.5; margin-bottom: 14px; }
.info ul { margin: 0; padding-left: 16px; }
.cols { column-count: 2; column-gap: 12mm; column-rule: 0.6px solid #c9d3ce; }
.q { break-inside: avoid; margin: 0 0 13px; }
.stem { margin: 0 0 6px; line-height: 1.5; }
.stem i { font-style: italic; }
.no { color: #0b4f2e; margin-right: 2px; }
.opts { list-style: none; margin: 0; padding: 0 0 0 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 3px 10px; line-height: 1.45; }
.opts.one { grid-template-columns: 1fr; }
.opts b { color: #0b4f2e; }
.fr { display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; font-size: 0.9em; line-height: 1.05; margin: 0 1px; }
.fr span:first-child { border-bottom: 1px solid currentColor; padding: 0 2px; }
.end { break-inside: avoid; text-align: center; margin: 6px 0 0; font-size: 9pt; color: #5b6560; }
"""


def build(slug, title, grade, subject, questions, options=4, minutes=30, seed=20261025, note=""):
    """questions: 20 öğe. Çıktı: out/<slug>.html, out/<slug>_key.json, out/<slug>_key.txt. Cevap dizisini döndürür."""
    assert len(questions) == 20, len(questions)
    letters = "ABCDE"[:options]
    for q in questions:
        assert len(q[3]) == options, (q[2], len(q[3]))
        assert len(set(q[3])) == options, ("tekrarlı şık", q[2])
    key = _key(20, letters, seed)
    items, meta = [], []
    for i, (topic, level, stem, opts) in enumerate(questions):
        correct, wrong = opts[0], opts[1:]
        pos = letters.index(key[i])
        order = wrong[:pos] + [correct] + wrong[pos:]
        li = "".join(f"<li><b>{L})</b> {o}</li>" for L, o in zip(letters, order))
        long = max(len(re.sub("<[^>]+>", "", o)) for o in order) > 22
        items.append(f'<div class="q"><p class="stem"><b class="no">{i + 1}.</b> {stem}</p><ol class="opts{" one" if long else ""}">{li}</ol></div>')
        meta.append({"no": i + 1, "correct": key[i], "topic": topic, "level": level})

    rules = [
        f"20 soru, {minutes} dakika. Her sorunun yalnız bir doğru cevabı vardır.",
        "Yanlış cevaplar doğruları götürmez; 17 ve üzeri doğru cevap barajı geçer.",
        "Cevaplarını ekrandaki optik forma işaretle." + (" Hesap makinesi kullanma." if note != "nocalc-skip" else ""),
        "Bu test yalnızca öğretmen başvurusu içindir; soruların paylaşılması başvuruyu geçersiz kılar.",
    ]
    page = f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<header><div class="brand">ÖzelDersBul<span>bir Thorius girişimi</span></div><div class="t">Öğretmen Branş Testi</div></header>
<h1>{title}</h1>
<div class="info"><ul>{''.join(f'<li>{r}</li>' for r in rules)}</ul></div>
<div class="cols">{''.join(items)}<p class="end">Test bitti. Cevaplarını kontrol edip “Sınavı bitir” düğmesine bas.</p></div>
</body></html>"""
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, f"{slug}.html"), "w").write(page)
    json.dump(meta, open(os.path.join(OUT, f"{slug}_key.json"), "w"), ensure_ascii=False, indent=1)
    lines = [
        f"ÖĞRETMEN BRANŞ TESTİ · {title.upper()} · CEVAP ANAHTARI",
        "GİZLİ: bu dosya başvuranlarla paylaşılmaz; yalnız yönetim ekranına girilir.",
        "",
        "Yönetim ekranına yapıştırılacak cevap dizisi:",
        "".join(key),
        "",
        f"Sınav ayarları: Kullanım = Öğretmen branş testi · Sınıf = {grade} · Bölüm = {subject} · Şık = {options} (A–{letters[-1]}) · Net hesabı = yanlış götürmez · Süre = {minutes} dk",
        "",
        "No  Cevap  Düzey  Konu",
    ] + [f"{m['no']:>2}   {m['correct']}     {m['level']:<6} {m['topic']}" for m in meta]
    open(os.path.join(OUT, f"{slug}_key.txt"), "w").write("\n".join(lines) + "\n")
    return "".join(key)
