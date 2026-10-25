"""Öğretmen branş testi · Ortaokul Matematik (5–8). 20 soru: 15 temel + 5 ileri. Doğru şık ilk sırada yazılır, yerleşim karıştırılır."""
import json, random, html

import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out") + "/"
os.makedirs(OUT, exist_ok=True)

def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'

# (konu, düzey, soru html, [doğru, çeldiriciler...])
Q = [
    ("İşlem önceliği", "temel", "48 − 6 · (12 − 9) : 2 işleminin sonucu kaçtır?", ["39", "21", "45", "63"]),
    ("Kesirlerle işlemler", "temel", f"{fr(3,4)} + {fr(5,6)} − {fr(1,3)} işleminin sonucu kaçtır?", [fr(5,4), fr(7,12), fr(4,3), fr(7,6)]),
    ("Oran", "temel", f"36 kişilik bir sınıfta kızların sayısının erkeklerin sayısına oranı {fr(4,5)}'tir. Bu sınıfta kaç kız öğrenci vardır?", ["16", "20", "18", "15"]),
    ("Tam sayılarla işlemler", "temel", "(−3)² − (−2)³ + (−1)⁵ işleminin sonucu kaçtır?", ["16", "0", "2", "14"]),
    ("Yüzdeler", "temel", "Etiket fiyatı 800 TL olan bir ürüne önce %20 indirim, ardından indirimli fiyat üzerinden %10 zam yapılıyor. Ürünün son fiyatı kaç TL'dir?", ["704", "720", "680", "712"]),
    ("Üslü ifadeler", "temel", "2⁵ · 4³ : 8² işleminin sonucu kaçtır?", ["32", "16", "64", "128"]),
    ("Kareköklü ifadeler", "temel", "√48 + √27 − √12 işleminin sonucu kaçtır?", ["5√3", "√63", "3√3", "7√3"]),
    ("Birinci dereceden denklemler", "temel", "3(x − 2) + 5 = 2x + 7 denklemini sağlayan x değeri kaçtır?", ["8", "2", "4", "6"]),
    ("Özdeşlikler · öğrenci hatası", "temel",
     "Bir öğrenci (2x − 3)² ifadesini 4x² − 9 olarak açmıştır. Öğrencinin hatası ve doğru açılım aşağıdakilerin hangisinde birlikte verilmiştir?",
     ["Terimlerin çarpımının iki katını unutmuştur; 4x² − 12x + 9",
      "Kare alırken işareti değiştirmiştir; 4x² + 12x + 9",
      "Katsayının karesini almamıştır; 2x² − 12x + 9",
      "Hata yoktur; 4x² − 9"]),
    ("Dikdörtgende çevre", "temel", "Kısa kenarı 6 cm olan bir dikdörtgenin uzun kenarı, kısa kenarının 2 katından 3 cm fazladır. Bu dikdörtgenin çevresi kaç cm'dir?", ["42", "36", "90", "48"]),
    ("Dairenin alanı", "temel", "Yarıçapı 5 cm olan dairenin alanı kaç cm²'dir? (π yerine 3 alınız.)", ["75", "30", "15", "150"]),
    ("Olasılık", "temel", "Bir torbada 3 kırmızı, 5 mavi ve 4 yeşil top vardır. Torbadan rastgele çekilen bir topun mavi olmama olasılığı kaçtır?", [fr(7,12), fr(5,12), fr(1,3), fr(1,4)]),
    ("Doğrusal denklemler", "temel", "y = 3x − 6 doğrusunun x eksenini kestiği nokta aşağıdakilerden hangisidir?", ["(2, 0)", "(0, −6)", "(−2, 0)", "(6, 0)"]),
    ("Aritmetik ortalama", "temel", "12, 15, 9, 18 ve x sayılarının aritmetik ortalaması 14'tür. Buna göre x kaçtır?", ["16", "14", "17", "20"]),
    ("EBOB–EKOK", "temel", "18 ve 24 sayılarının en küçük ortak katı ile en büyük ortak böleninin farkı kaçtır?", ["66", "60", "72", "78"]),
    ("Üslü ifadeler", "ileri", "2²⁰²⁶ + 2²⁰²⁵ + 2²⁰²⁴ = 7 · 2ᵏ olduğuna göre k kaçtır?", ["2024", "2025", "2026", "6075"]),
    ("Kareköklü ifadeler", "ileri", "√(7 + 4√3) − √3 işleminin sonucu kaçtır?", ["2", "1", "√3", "2√3"]),
    ("Sayma", "ileri", "Rakamları birbirinden farklı, üç basamaklı ve 5 ile tam bölünebilen kaç doğal sayı vardır?", ["136", "128", "144", "152"]),
    ("İş problemleri", "ileri", "Bir işi Ali tek başına 12 günde, Ayşe tek başına 18 günde bitirebiliyor. İkisi birlikte 4 gün çalıştıktan sonra Ali ayrılıyor. Kalan işi Ayşe tek başına kaç günde bitirir?", ["8", "6", "7", "10"]),
    ("Pisagor bağıntısı", "ileri", "Köşegeninin uzunluğu 13 cm ve çevresi 34 cm olan bir dikdörtgenin alanı kaç cm²'dir?", ["60", "30", "40", "50"]),
]

# Her harften 5 doğru cevap, ardışık tekrar en fazla 2
rng = random.Random(20261025)
while True:
    key = list("ABCD" * 5); rng.shuffle(key)
    if all(not (key[i] == key[i + 1] == key[i + 2]) for i in range(18)):
        break

items, meta = [], []
for i, (topic, level, stem, opts) in enumerate(Q):
    correct, wrong = opts[0], opts[1:]
    pos = "ABCD".index(key[i])
    order = wrong[:pos] + [correct] + wrong[pos:]
    li = "".join(f'<li><b>{L})</b> {o}</li>' for L, o in zip("ABCD", order))
    import re as _re
    long = max(len(_re.sub("<[^>]+>", "", o)) for o in order) > 22
    items.append(f'<div class="q"><p class="stem"><b class="no">{i + 1}.</b> {stem}</p><ol class="opts{" one" if long else ""}">{li}</ol></div>')
    meta.append({"no": i + 1, "correct": key[i], "topic": topic, "level": level})

page = f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>
@page {{ size: A4; margin: 16mm 14mm 18mm; }}
* {{ box-sizing: border-box; }}
body {{ font-family: "IBM Plex Sans", "DejaVu Sans", Arial, sans-serif; font-size: 10.5pt; color: #111; margin: 0; }}
header {{ border-bottom: 2px solid #0b4f2e; padding-bottom: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-end; }}
header .brand {{ font-family: Georgia, serif; font-weight: 700; font-size: 15pt; }}
header .brand span {{ font-family: Arial, sans-serif; font-weight: 400; font-size: 8.5pt; color: #5b6560; margin-left: 6px; }}
header .t {{ text-align: right; font-size: 10pt; font-weight: 600; color: #0b4f2e; }}
h1 {{ font-family: Georgia, serif; font-size: 17pt; margin: 4px 0 6px; }}
.info {{ background: #e8f1ec; border-radius: 6px; padding: 8px 12px; font-size: 9.5pt; line-height: 1.5; margin-bottom: 14px; }}
.info ul {{ margin: 0; padding-left: 16px; }}
.cols {{ column-count: 2; column-gap: 12mm; column-rule: 0.6px solid #c9d3ce; }}
.q {{ break-inside: avoid; margin: 0 0 13px; }}
.stem {{ margin: 0 0 6px; line-height: 1.5; }}
.no {{ color: #0b4f2e; margin-right: 2px; }}
.opts {{ list-style: none; margin: 0; padding: 0 0 0 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 3px 10px; line-height: 1.45; }}
.opts.one {{ grid-template-columns: 1fr; }}
.opts b {{ color: #0b4f2e; }}
.fr {{ display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; font-size: 0.9em; line-height: 1.05; margin: 0 1px; }}
.fr span:first-child {{ border-bottom: 1px solid currentColor; padding: 0 2px; }}
.end {{ column-span: all; text-align: center; margin-top: 10px; font-size: 9.5pt; color: #5b6560; }}
</style></head><body>
<header><div class="brand">ÖzelDersBul<span>bir Thorius girişimi</span></div><div class="t">Öğretmen Branş Testi</div></header>
<h1>Ortaokul Matematik · 5.–8. sınıf</h1>
<div class="info"><ul>
<li>20 soru, 30 dakika. Her sorunun yalnız bir doğru cevabı vardır.</li>
<li>Yanlış cevaplar doğruları götürmez; 17 ve üzeri doğru cevap barajı geçer.</li>
<li>Cevaplarını ekrandaki optik forma işaretle. Hesap makinesi kullanma.</li>
<li>Bu test yalnızca öğretmen başvurusu içindir; soruların paylaşılması başvuruyu geçersiz kılar.</li>
</ul></div>
<div class="cols">{''.join(items)}<p class="end">Test bitti. Cevaplarını kontrol edip “Sınavı bitir” düğmesine bas.</p></div>
</body></html>"""
open(OUT + "mat58.html", "w").write(page)
json.dump(meta, open(OUT + "mat58_key.json", "w"), ensure_ascii=False, indent=1)
print("".join(key))
