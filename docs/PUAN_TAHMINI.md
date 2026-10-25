# Puan tahmini (LGS ve YKS)

Sonuç sayfasında tam formatlı denemeler için tahmini puan, Türkiye yüzdeliği / başarı sırası ve hedef okul/bölüm karşılaştırması.

## Model
`puan = base + Σ katsayı[ders] × net[ders]` (her yıl ayrı). LGS'de MEB standart puan yöntemi doğrusal olduğu için birebir; YKS'de o yılın sonuçlarına uydurulmuş katsayılar (yaklaşık). Sonuç 100–500 aralığına kırpılır.
- Denemede olmayan dersler (ör. yalnız sayısal) öğrencinin bu denemedeki başarı oranıyla doldurulur; ayrıca 0 net / tam net aralığı gösterilir.
- Mini denemelerde (bölüm soru sayısı resmi sayıdan farklı) tahmin gösterilmez.
- YKS yerleştirme puanı = ham puan + diploma × 5 × 0,12. Başarı sırası ÖSYM yerleştirme puanı dağılımından (log ölçekte ara değer).
- LGS yüzdeliği: okulların (taban puan, yüzdelik) çiftlerinden.

## Veri (2026 sonuçları)
| Tablo | İçerik | Kaynak |
|---|---|---|
| `score_models` | LGS 2023–2026, TYT/SAY/EA/SÖZ/DİL 2026 katsayıları | LGS 2026: inekle.com (tam net = 500,00; bağımsız örnekle ~1 puan); 2025: dogrupuan, egitim.net.tr, canlikoc. YKS 2026: ertansinansahin.com + canlikoc.com (birbirini doğruluyor), ortalamalar ÖSYM 2026-YKS Sayısal Bilgiler |
| `score_distribution` | LGS puan→yüzdelik (2025, 2026), YKS ham ve yerleştirme puanı → kümülatif aday sayısı (2026) | kazanabilirsin.com okul verileri, rehberpanda; ÖSYM Sayısal Bilgiler PDF |
| `score_targets` | 61 lise (2026), 72 üniversite programı (2026) | kazanabilirsin, basarisiralamalari, canlikoc; egitim.net.tr, yksprogram.com.tr, kazanabilirsin |

MEB ders bazında katsayı/ortalama yayımlamaz; LGS katsayıları hesaplama sitelerinin sonuçlardan çıkardığı değerlerdir (±1–4 puan belirsizlik). 2026 YKS'de AYT Matematik ve Edebiyat'tan birer soru iptal edildi; tam format kontrolü 1 eksik soruya izin verir.

## Her yıl güncelleme
Sonuçlar açıklanınca yeni yıl satırlarını ekle (eski yıllar kalır; uygulama her puan türünün en son yılını kullanır). Veri dosyası: `supabase/seed/score_data_2026.sql`. Önbellek etiketi: `scores`.
