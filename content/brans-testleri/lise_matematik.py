"""Öğretmen branş testi · Lise Matematik (9–12). 5 şık."""
from fractions import Fraction as F
from itertools import permutations
from math import comb, log2, sin, cos, radians, isclose

from _lib import build, fr

Q = [
    ("Kümeler", "temel", "A = {1, 2, 3, 4} ve B = {3, 4, 5} olduğuna göre A \\ B kümesi kaç elemanlıdır?", ["2", "1", "3", "4", "5"]),
    ("Mutlak değer", "temel", "|2x − 3| = 7 denklemini sağlayan x değerlerinin toplamı kaçtır?", ["3", "5", "−2", "7", "10"]),
    ("Köklü ifadeler", "temel", "(√2 + 1)(√2 − 1) işleminin sonucu kaçtır?", ["1", "√2", "2", "3", "2√2"]),
    ("Fonksiyonlar", "temel", "f(x) = 3x − 2 olduğuna göre f(f(2)) kaçtır?", ["10", "4", "6", "12", "8"]),
    ("Polinomlar", "temel", "P(x) = x³ − 2x² + x − 5 polinomunun x − 2 ile bölümünden kalan kaçtır?", ["−3", "3", "−5", "1", "0"]),
    ("İkinci dereceden denklemler", "temel", "x² − 5x + 6 = 0 denkleminin köklerinin çarpımı kaçtır?", ["6", "5", "−5", "−6", "1"]),
    ("Eşitsizlikler", "temel", "2x − 5 < 3 eşitsizliğini sağlayan en büyük tam sayı kaçtır?", ["3", "4", "2", "5", "8"]),
    ("Logaritma", "temel", "log₂ 32 değeri kaçtır?", ["5", "16", "4", "6", "2"]),
    ("Aritmetik dizi", "temel", "İlk terimi 3 ve ortak farkı 4 olan aritmetik dizinin 10. terimi kaçtır?", ["39", "43", "40", "35", "36"]),
    ("Trigonometri", "temel", "sin 30° + cos 60° işleminin sonucu kaçtır?", ["1", fr(1, 2), fr("√3", 2), "√3", "0"]),
    ("Olasılık", "temel", "İki zar birlikte atılıyor. Üst yüze gelen sayıların toplamının 7 olma olasılığı kaçtır?",
     [fr(1, 6), fr(1, 12), fr(7, 36), fr(1, 36), fr(1, 3)]),
    ("Permütasyon", "temel", "KALEM kelimesinin harfleri kullanılarak anlamlı ya da anlamsız 5 harfli kaç farklı kelime yazılabilir?",
     ["120", "60", "24", "25", "720"]),
    ("Analitik geometri", "temel", "A(1, 2) ve B(4, 6) noktaları arasındaki uzaklık kaç birimdir?", ["5", "7", "√7", "25", "3"]),
    ("Türev", "temel", "f(x) = x³ olduğuna göre f′(2) kaçtır?", ["12", "8", "6", "4", "3"]),
    ("Köklü ifadeler · öğrenci hatası", "temel",
     "Bir öğrenci √(9 + 16) = √9 + √16 = 7 yazmıştır. Öğrencinin hatası ve doğru sonuç aşağıdakilerin hangisinde birlikte verilmiştir?",
     ["Toplamın karekökü, kareköklerin toplamına eşit değildir; sonuç 5", "İşlem doğrudur; sonuç 7",
      "Önce kareler alınmalıdır; sonuç 25", "Toplamın karekökü kareköklerin çarpımıdır; sonuç 12", "Karekök yalnız tam kareler için alınır; sonuç tanımsız"]),
    ("Logaritmik denklem", "ileri", "log₃(x − 1) + log₃(x + 1) = 1 denklemini sağlayan x değeri kaçtır?", ["2", "√2", "4", "3", "−2"]),
    ("Türev · ekstremum", "ileri", "f(x) = x³ − 3x² + 1 fonksiyonunun yerel minimum değeri kaçtır?", ["−3", "1", "2", "0", "−4"]),
    ("Belirli integral", "ileri", "∫₀² (3x² + 2x) dx integralinin değeri kaçtır?", ["12", "10", "8", "14", "16"]),
    ("Kombinasyon", "ileri", "6 kişilik bir gruptan 3 kişilik bir komite seçilecektir. Belirli iki kişinin komitede birlikte bulunmaması koşuluyla kaç farklı komite seçilebilir?",
     ["16", "20", "12", "4", "18"]),
    ("Geometrik dizi", "ileri", "İlk terimi 2 ve ortak çarpanı 3 olan geometrik dizinin ilk 5 teriminin toplamı kaçtır?", ["242", "162", "486", "240", "122"]),
]

# Doğru şıkların hesapla doğrulanması (sırayla)
P = lambda x: x**3 - 2 * x**2 + x - 5
assert len({1, 2, 3, 4} - {3, 4, 5}) == 2
assert sum(x for x in range(-20, 21) if abs(2 * x - 3) == 7) == 3
assert isclose((2**0.5 + 1) * (2**0.5 - 1), 1)
f = lambda x: 3 * x - 2
assert f(f(2)) == 10 and P(2) == -3 and 6 == 6
assert max(x for x in range(-50, 50) if 2 * x - 5 < 3) == 3
assert log2(32) == 5 and 3 + 9 * 4 == 39
assert isclose(sin(radians(30)) + cos(radians(60)), 1)
assert F(sum(1 for a in range(1, 7) for b in range(1, 7) if a + b == 7), 36) == F(1, 6)
assert len(set(permutations("KALEM"))) == 120
assert ((4 - 1) ** 2 + (6 - 2) ** 2) ** 0.5 == 5
assert 3 * 2**2 == 12
assert [x for x in range(2, 10) if (x - 1) * (x + 1) == 3] == [2]
g = lambda x: x**3 - 3 * x**2 + 1
assert g(2) == -3  # f'(x)=3x²−6x=0 → x=0 (maks), x=2 (min)
assert (2**3 + 2**2) - 0 == 12
assert comb(6, 3) - comb(4, 1) == 16
assert sum(2 * 3**k for k in range(5)) == 242

if __name__ == "__main__":
    print(build("lise_matematik", "Lise Matematik · 9.–12. sınıf", 12, "Matematik", Q, options=5, seed=912001))
