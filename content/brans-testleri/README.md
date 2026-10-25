# Öğretmen branş testleri

Her branşın her kademesi (3–4, 5–8, 9–12) için bir test: 20 soru, 30 dakika, 15 temel + 5 ileri soru,
yanlış doğruyu götürmez, baraj 17 doğru (%85).

Betik HTML ve cevap anahtarını `out/` klasörüne yazar; PDF, HTML'den Chromium ile basılır.
Cevap anahtarı başvuranlarla paylaşılmaz, yalnız yönetim ekranına girilir.

Yükleme: Yönetim → Sınavlar → Yeni sınav → PDF → Bölüm = branş, Sınıf = kademenin son sınıfı (4, 8 ya da 12),
Net hesabı = yanlış götürmez → düzenleyicide Kullanım = Öğretmen branş testi → kitapçık PDF'i → yayınla.

| Test | Durum |
|---|---|
| Ortaokul Matematik (5–8) | yayında (/deneme/matematik) |
| Ortaokul Fen Bilimleri (5–8) | yayında, bağımsız kontrol yapıldı |
| Ortaokul Türkçe (5–8) | yayında, bağımsız kontrol yapıldı |
| Ortaokul İngilizce (5–8) | yayında, bağımsız kontrol yapıldı |
| Lise Matematik (9–12, 5 şık) | yayında, bağımsız kontrol yapıldı |
| Sınıf Öğretmenliği (3–4) | yayında, bağımsız kontrol yapıldı |

Yeni test: `_lib.build()` ile; `python3 <test>.py` HTML ve anahtarı `out/`a yazar.
