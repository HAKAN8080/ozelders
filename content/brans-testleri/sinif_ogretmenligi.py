"""Öğretmen branş testi · Sınıf Öğretmenliği (3–4). Matematik, Türkçe, Fen, Hayat Bilgisi/Sosyal ve öğretim."""
from _lib import build, fr

Q = [
    ("Matematik · toplama", "temel", "456 + 278 işleminin sonucu kaçtır?", ["734", "724", "634", "744"]),
    ("Matematik · çarpım tablosu", "temel", "7 × 8 işleminin sonucu kaçtır?", ["56", "54", "48", "64"]),
    ("Matematik · kesirler", "temel", f"{fr(3, 8)} + {fr(2, 8)} işleminin sonucu kaçtır?", [fr(5, 8), fr(5, 16), fr(6, 8), fr(1, 8)]),
    ("Matematik · alan", "temel", "Kenar uzunlukları 6 cm ve 4 cm olan dikdörtgenin alanı kaç cm²'dir?", ["24", "20", "10", "48"]),
    ("Matematik · zaman ölçme", "temel", "2 saat 15 dakika kaç dakikadır?", ["135", "125", "215", "120"]),
    ("Matematik · bölme", "temel", "96 : 8 işleminin sonucu kaçtır?", ["12", "11", "13", "14"]),
    ("Türkçe · alfabetik sıralama", "temel", "Aşağıdaki sözcüklerden hangisi sözlükte en önce yer alır?", ["böcek", "ceylan", "çanta", "deniz"]),
    ("Türkçe · cümle türleri", "temel", "Aşağıdakilerden hangisi soru cümlesidir?",
     ["Yarın okula gelecek misin?", "Yarın okula geleceğim.", "Lütfen kapıyı kapat.", "Ne güzel bir gün!"]),
    ("Türkçe · eş anlamlı sözcükler", "temel", "“Okul” sözcüğünün eş anlamlısı hangisidir?", ["mektep", "öğretmen", "sınıf", "ders"]),
    ("Fen · canlı ve cansız", "temel", "Aşağıdakilerden hangisi canlıdır?", ["Mantar", "Taş", "Bulut", "Su"]),
    ("Fen · mıknatıs", "temel", "Mıknatıs aşağıdakilerden hangisini çekmez?", ["Plastik kaşık", "Demir çivi", "Toplu iğne", "Çelik makas"]),
    ("Fen · maddenin hâlleri", "temel", "Deniz seviyesinde saf su kaç °C'de donar?", ["0", "100", "10", "−10"]),
    ("Sosyal bilgiler · tarih", "temel", "Türkiye Büyük Millet Meclisi hangi yıl açılmıştır?", ["1920", "1919", "1923", "1938"]),
    ("Hayat bilgisi · afetler", "temel", "Aşağıdakilerden hangisi bir doğal afettir?", ["Deprem", "Trafik kazası", "Elektrik kesintisi", "Hava kirliliği"]),
    ("Çıkarma · öğrenci hatası", "temel",
     "3. sınıftaki bir öğrenci 52 − 27 işleminin sonucunu 35 bulmuştur. Öğrencinin hatası en olası olarak hangisidir?",
     ["Onluktan bozmak yerine birler basamağında küçük rakamı büyükten çıkarmıştır.", "Çıkarma yerine toplama yapmıştır.",
      "Onlar basamağındaki rakamları toplamıştır.", "İşlem doğrudur, yalnız sonucu yanlış yazmıştır."]),
    ("Matematik · problem", "ileri", f"Ali'nin 120 TL'si var. Parasının {fr(1, 4)}'ü ile kitap, kalan parasının {fr(1, 3)}'ü ile defter alıyor. Ali'nin kaç TL'si kalır?",
     ["60", "50", "30", "40"]),
    ("Matematik · örüntü", "ileri", "3, 7, 15, 31, … örüntüsünün bir sonraki terimi kaçtır?", ["63", "47", "62", "64"]),
    ("Matematik · çevre", "ileri", "Bir kenarı 9 cm olan karenin çevresi, bir eşkenar üçgenin çevresine eşittir. Eşkenar üçgenin bir kenarı kaç cm'dir?",
     ["12", "9", "27", "18"]),
    ("Öğretim · kesir kavramı", "ileri", "4. sınıfta kesir kavramını ilk kez öğretirken en uygun başlangıç etkinliği hangisidir?",
     ["Bir bütünü (kâğıt, pasta modeli) eş parçalara bölerek somut modelle çalışmak", "Kesirlerle dört işlem kurallarını ezberletmek",
      "Payda eşitleme alıştırmalarıyla başlamak", "Ondalık gösterimleri tahtaya yazdırmak"]),
    ("Fen · kavram yanılgısı", "ileri", "Bir öğrenci “Bitkiler besinlerini topraktan alır.” diyor. Bu kavram yanılgısını gidermek için en uygun etkinlik hangisidir?",
     ["Aynı türden iki bitkiyi ışıklı ve karanlık ortamda büyütüp karşılaştırmak; bitkinin ışık, su ve havayla kendi besinini ürettiğini tartışmak",
      "Bitkiyi gübreyle besleyip büyümesini izlemek", "Bitkiyi saksısından çıkarıp köklerini incelemek", "Bitkiyi hiç sulamayıp solmasını izlemek"]),
]

assert 456 + 278 == 734 and 7 * 8 == 56 and 6 * 4 == 24 and 2 * 60 + 15 == 135 and 96 // 8 == 12
assert sorted(["böcek", "ceylan", "deniz"])[0] == "böcek"  # ç, c'den sonra gelir
k = 120 - 120 // 4
assert k - k // 3 == 60 and 31 * 2 + 1 == 63 and 9 * 4 / 3 == 12 and 52 - 27 == 25

if __name__ == "__main__":
    print(build("sinif_ogretmenligi", "Sınıf Öğretmenliği · 3.–4. sınıf", 4, "Sınıf Öğretmenliği (branş testi)", Q, seed=34001))
