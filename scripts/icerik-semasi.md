# Çıktı biçimi (JSON)

Tek bir JSON dosyası yaz. Kök bir dizi; her öğe bir KONU SAYFASI:

```json
[
  {
    "slug": "hava-olaylari",              // küçük harf, Türkçe harfsiz, tire ile
    "baslik": "Hava Olayları",            // kitaptaki alt başlık
    "kitapBolum": "3.1.1",
    "sayfalar": "77-88",
    "aciklama": "9. sınıf Coğrafya, 3. ünite. ...tek cümle...",
    "sekmeler": [ ... ]
  }
]
```

Her sekme şu türlerden biri (her sayfada 5–8 sekme, türleri karıştır):

1. Eşleştirme (en az 4, en çok 10 çift)
```json
{"id":"kavramlar","baslik":"Kavramlar","alt":"Kavramı tanımıyla eşleştir","tur":"eslestirme",
 "solBaslik":"Kavram","sagBaslik":"Tanım","yonerge":"...","turSecenekleri":[5,8],
 "ciftler":[["Sol","Sağ (s.79)"], ...]}
```
Sağ taraf kısa olsun (en çok ~20 kelime). Sayfa numarasını sağ tarafa YAZMA; ayrı "kaynaklar" alanına koy:
"kaynaklar": ["s.79", ...] (çiftlerle aynı sırada).

2. Kategori (2–8 kategori, her kategoride en az 2 öğe, toplam en az 8 öğe)
```json
{"id":"...","baslik":"...","alt":"...","tur":"kategori","yonerge":"...","turSecenekleri":[8,12],
 "kategoriler":["A","B"], "gruplar":{"A":["öğe", ...], "B":[...]}, "kaynak":"s.80-82"}
```
Bir öğe kesinlikle tek kategoriye ait olmalı (kitaba göre). Belirsiz olanı koyma.

3. Sıralama (en az 4 öğe; sıra kitapta açıkça veriliyorsa)
```json
{"id":"...","baslik":"...","alt":"...","tur":"siralama","yonerge":"...","uclar":["En ...","En ..."],
 "turSecenekleri":[5,0], "ogeler":[["ad", sayısalAnahtar, "etiket (ör. yıl ya da değer)"], ...], "kaynak":"s.."}
```

4. Çoktan seçmeli (6–12 soru)
```json
{"id":"sorular","baslik":"...","alt":"Kitaptaki bilgilerle çoktan seçmeli","tur":"soru","yonerge":"...",
 "turSecenekleri":[5,10],
 "sorular":[{"soru":"...?","dogru":"doğru cevap","yanlislar":["y1","y2","y3"],"cozum":"Kısa açıklama (s.80)."}]}
```
Doğru cevap ve çözüm KİTAPTAN. Yanlış şıklar inandırıcı ama kesinlikle yanlış olmalı.

5. Boşluk doldurma (5–9 cümle)
```json
{"id":"bosluk","baslik":"Boşluk doldur","alt":"Kitaptaki cümleleri tamamla","tur":"bosluk","yonerge":"...",
 "turSecenekleri":[5,8], "cumleler":[["Kitaptaki cümle, {boşluk} süslü parantezle.","s.80"], ...]}
```
Cümleler kitaptan birebir ya da çok az kısaltılmış. Boşluk kısa bir kavram/sayı olmalı (1–3 kelime).

6. Çengel bulmaca (8–14 kelime)
```json
{"id":"bulmaca","baslik":"Çengel bulmaca","alt":"Tanımlardan kavramları bul","tur":"bulmaca","yonerge":"...",
 "turSecenekleri":[6,9], "kelimeler":[["TekKelime","kitaptaki tanımdan kısa ipucu"], ...]}
```
Cevap TEK kelime, boşluksuz, en az 3 harf; â, î, û İÇERMESİN.

## Kurallar (çok önemli)
- Yalnızca kitapta yazan bilgileri kullan. Dış bilgi ekleme. Emin olmadığın şeyi koyma.
- Metin çıkarımında bazı "ı" harfleri düşebilir; Türkçe yazımı düzelt.
- Etkinliklerdeki boş tablolar, öğrencinin dolduracağı yerler, cevabı kitapta olmayan sorular KULLANILMAZ.
- Yazım: Türkçe, kitabın terimleriyle. "OTB" gibi kısaltma yok.
- id'ler sayfa içinde benzersiz, küçük harf, tireli.
