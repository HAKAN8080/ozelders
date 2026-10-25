"""Öğretmen branş testi · Ortaokul Fen Bilimleri (5–8)."""
from _lib import build, fr

Q = [
    ("Güneş, Dünya ve Ay", "temel", "Ay'ın evrelerinin oluşmasının nedeni aşağıdakilerden hangisidir?",
     ["Ay'ın Güneş tarafından aydınlatılan yarısının Dünya'dan farklı oranlarda görülmesi",
      "Dünya'nın gölgesinin Ay'ın üzerine düşmesi", "Ay'ın kendi ekseni etrafında dönmesi", "Ay'ın Güneş'e olan uzaklığının değişmesi"]),
    ("Canlılar dünyası", "temel", "Aşağıdakilerden hangisi bitkilerin hayvanlardan farklı olarak gerçekleştirebildiği bir olaydır?",
     ["Fotosentez yapma", "Solunum yapma", "Boşaltım yapma", "Büyüme ve gelişme"]),
    ("Kuvvet ve hareket", "temel", "180 km'lik yolu 2 saatte alan bir aracın ortalama sürati kaç km/sa'tir?", ["90", "60", "360", "45"]),
    ("Madde ve değişim", "temel", "Aşağıdakilerden hangisi bir hâl değişimi <b>değildir</b>?",
     ["Demirin paslanması", "Buzun erimesi", "Suyun buharlaşması", "Naftalinin süblimleşmesi"]),
    ("Vücudumuzdaki sistemler", "temel", "Kandaki atık maddeleri süzerek idrar oluşturan organ hangisidir?", ["Böbrek", "Karaciğer", "Akciğer", "Mide"]),
    ("Kütle ve ağırlık", "temel", "Dünya'da kütlesi 60 kg olan bir astronotun Ay'daki kütlesi kaç kg'dır? (Ay'daki çekim Dünya'dakinin yaklaşık 1/6'sıdır.)",
     ["60", "10", "360", "0"]),
    ("Hücre", "temel", "Aşağıdaki yapılardan hangisi bitki hücresinde bulunup hayvan hücresinde bulunmaz?",
     ["Hücre duvarı", "Hücre zarı", "Çekirdek", "Mitokondri"]),
    ("Elektrik devreleri", "temel", "Seri bağlı iki özdeş ampulden biri duyundan sökülürse diğer ampul için ne söylenebilir?",
     ["Söner", "Daha parlak yanar", "Aynı parlaklıkta yanmaya devam eder", "Daha sönük yanar"]),
    ("Işığın madde ile etkileşimi", "temel", "Beyaz ışığın prizmadan geçerken renklere ayrılması hangi olayla açıklanır?",
     ["Işığın kırılması", "Işığın yansıması", "Işığın soğurulması", "Gölge oluşumu"]),
    ("Katı basıncı", "temel", "Aynı tuğla zemine farklı yüzeyleri üzerine yerleştiriliyor. Tuğla en geniş yüzeyi üzerindeyken zemine uyguladığı basınç için ne söylenebilir?",
     ["En küçüktür", "En büyüktür", "Yüzeyden bağımsızdır, hep aynıdır", "Sıfır olur"]),
    ("DNA ve genetik kod", "temel", "DNA'nın yapı birimi aşağıdakilerden hangisidir?", ["Nükleotit", "Gen", "Kromozom", "Amino asit"]),
    ("Asitler ve bazlar", "temel", "Mavi turnusol kâğıdını kırmızıya çeviren madde aşağıdakilerden hangisidir?",
     ["Limon suyu", "Sabunlu su", "Çamaşır suyu", "Kireçli su"]),
    ("Isı ve sıcaklık", "temel", "Isı ve sıcaklık ile ilgili aşağıdaki ifadelerden hangisi doğrudur?",
     ["Isı, sıcaklık farkı nedeniyle aktarılan enerjidir; sıcaklık termometreyle ölçülür", "Isı termometreyle ölçülür",
      "Sıcaklığın birimi joule'dür", "Isı ve sıcaklık aynı kavramdır"]),
    ("Basit makineler", "temel", "Sabit makara ile ilgili aşağıdakilerden hangisi doğrudur?",
     ["Kuvvetin yönünü değiştirir, kuvvetten kazanç sağlamaz", "Kuvvetten yarı yarıya kazanç sağlar", "İşten kazanç sağlar", "Yoldan kazanç sağlar"]),
    ("Mevsimler · öğrenci hatası", "temel",
     "Bir öğrenci “Kışın Dünya Güneş'ten uzaklaştığı için havalar soğur.” diyor. Bu kavram yanılgısını gidermek için en uygun açıklama hangisidir?",
     ["Mevsimler, Dünya'nın eksen eğikliği nedeniyle güneş ışınlarının geliş açısının ve gündüz süresinin değişmesinden oluşur",
      "Kışın Güneş daha az ışık üretir", "Kışın Dünya kendi ekseni etrafında daha yavaş döner", "Kışın Ay, Güneş ışınlarının bir kısmını engeller"]),
    ("Katı basıncı (hesap)", "ileri", "Ağırlığı 400 N olan bir cisim, 0,02 m²'lik yüzeyi üzerinde duruyor. Cismin zemine uyguladığı basınç kaç Pa'dır?",
     ["20 000", "8", "800", "2 000"]),
    ("Yoğunluk", "ileri", "Kütlesi 54 g, hacmi 20 cm³ olan bir cismin yoğunluğu kaç g/cm³'tür?", ["2,7", "1 080", "0,37", "34"]),
    ("Kalıtım", "ileri", "Uzun boy geninin (U) kısa boy genine (u) baskın olduğu bezelyelerde, Uu genotipli iki bezelye çaprazlanıyor. Oluşacak bezelyelerin kaçta kaçının kısa boylu olması beklenir?",
     [fr(1, 4), fr(1, 2), fr(3, 4), "Hiçbiri"]),
    ("Sıvı basıncı", "ileri", "Biçimleri ve taban alanları farklı üç kap aynı sıvıyla aynı yüksekliğe kadar dolduruluyor. Sıvıların kap tabanlarına yaptığı basınçlar için ne söylenebilir?",
     ["Üçünde de eşittir", "Tabanı en geniş kapta en büyüktür", "Sıvı miktarı en çok olan kapta en büyüktür", "Ağzı en dar kapta en büyüktür"]),
    ("Kütlenin korunumu", "ileri", "12 g magnezyum yeterli miktarda oksijenle tamamen tepkimeye girerek 20 g magnezyum oksit oluşturuyor. Tepkimeye giren oksijen kaç gramdır?",
     ["8", "32", "20", "12"]),
]

# Hesaplı soruların doğrulaması
assert 180 / 2 == 90 and 400 / 0.02 == 20000 and 54 / 20 == 2.7 and 20 - 12 == 8

if __name__ == "__main__":
    print(build("ortaokul_fen", "Ortaokul Fen Bilimleri · 5.–8. sınıf", 8, "Fen Bilimleri", Q, seed=58001))
