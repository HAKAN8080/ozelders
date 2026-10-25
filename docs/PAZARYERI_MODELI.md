# Ödeme modeli: Pazaryeri (karar: 2026-10-25)

**Karar:** Veli ödemesi lisanslı ödeme kuruluşunun pazaryeri ürünü üzerinden alınır ve bölünür. Öğretmenin payı doğrudan öğretmene (bireysel alt üye) gider; para ÖzelDersBul hesabına girmez. ÖzelDersBul yalnız kendi hizmet bedelini/komisyonunu faturalar. Bordro (A), serbest meslek makbuzu (B), gider pusulası (C) ileride değerlendirilecek.

## Komisyon (karar: 2026-10-25)
- Standart komisyon **%30**; öğretmen 3 ayda bir otomatik karneyle **%27 / %24 / %20** bantlarına iner. Bonus yok.
- Karne = Gelişim 60 (3 aylık takip denemesinde, öğretmenin branşındaki bölümde yüzdelik artışı; aynı denemeyi çözenlere göre) + Memnuniyet 40 (30 öğrenci/veli puanı + 10 paket yenileme oranı) − hizmet kesintisi en fazla 15 (takvime uyum 8, yanıt hızı 4, ders raporu 3). Red oranı cezalandırılmaz (bağımsızlık / işçi sayılma riski).
- Takip denemesi 3 ayda bir (aralık, mart, haziran, eylül son iki hafta, 14 gün açık); yılda 4 dönem × 4 seviye = 16 deneme, kendimiz hazırlarız. Katılım < %70 → gelişim puanı katılım oranıyla çarpılır. Dönemde < 24 ders veya < 3 öğrencinin deneme verisi → bant korunur; dönemde en fazla 1 bant değişir.
- **Paket = bir ders + bir öğretmen; serbest kredi yok** (pazaryerinde kalem ödeme anında öğretmenin alt üyeliğine bağlanır). İki ders → iki paket. İlk öğretmen değişikliği ücretsiz; gelişim, dönemde verilen ders sayısı oranında iki öğretmene bölünür. Dönemde < 4 ders → o öğrenci o öğretmenin hesabına girmez.
- Taban ücret: öğretmen payı hiçbir pakette ders başı 650 ₺'nin altına düşmez (fark komisyondan).
- Öğretmen payı (`subMerchantPrice`) = kalem fiyatı × (1 − bant komisyonu), **ödeme anındaki bantla** sabitlenir.
- Sağlayıcı: **PayTR** (mevcut ilişki). Bireysel (vergi levhasız) alt mağaza kabulü teyit edilecek; olmazsa iyzico yedek.

## Neden
- Kayıtsız (şahıs) öğretmene ödemeyi biz yaparsak bordro ya da %20 stopajlı belge zorunlu; haftalık düzenli ders "arızi" sayılmaz.
- 1 Ocak 2025'ten beri aracı hizmet sağlayıcılar satıcılara yaptıkları ödemelerden %1 stopaj keser (CK 9284). Pazaryeri modelinde bu yükümlülüğün kimde olduğu YMM'ye sorulacak.
- Öğretmenin vergi yükümlülüğü sözleşmeyle öğretmendedir.

## Ödeme sağlayıcı
- **iyzico Pazaryeri** — doğrulandı: `PERSONAL` (bireysel) alt üye tipi var; zorunlu alanlar ad, soyad, TCKN, e-posta, telefon, adres, `subMerchantExternalId`; IBAN ad-soyadla eşleşmeli ve ürün onayından önce girilmeli. Ödeme iyzico koruma havuzunda bekler, **her sepet kalemi API ile onaylanınca** alt üyeye aktarılır; onay öncesi kalem bazında iade/iptal yapılabilir.
- **PayTR Pazaryeri** — bölme ve koruma hesabı var; bireysel (vergi levhasız) alt mağaza kabulü sitede yazmıyor → satış temsilcisine sorulacak.

## Akış (iyzico ile)
1. Öğretmen onaylanınca alt üye kaydı açılır (TCKN ve IBAN doğrudan iyzico'ya iletilir; **bizde saklanmaz**, yalnız `subMerchantKey` ve IBAN'ın son 4 hanesi tutulur).
2. Veli paketi alır: sepet = paketteki her ders bir kalem. Kalem fiyatı = paket fiyatı / ders sayısı; `subMerchantPrice` = öğretmenin o anki kademe ücreti. Fark = ÖzelDersBul hizmet bedeli.
3. Ders `tamamlandi` olunca (ve veli itiraz süresi geçince) o dersin kalemi API ile **onaylanır** → öğretmene aktarılır.
4. Veli iptali / iade → onaylanmamış kalemler kalem bazında iade edilir.

## Mevcut şemaya etkisi (entegrasyonda yapılacak)
- `teacher_payout_info.payout_model` (varsayılan `'pazaryeri'`) eklendi; eski `payment_model` sütunu kullanılmıyor. `submerchant_key`, `iban_last4`, `submerchant_status` eklendi (2026-10-25).
- Yeni `payment_items` (payment_id, sıra, teacher_id, submerchant_key, item_price, teacher_price, provider_item_id, lesson_id, status: beklemede/onaylandi/iade, approved_at).
- `payout_lines` hakediş defteri olarak kalır; `payouts` iyzico onay kayıtlarına dönüşür.

## Açık konular (modeli etkiler)
1. **Bonuslar** (yenileme, net artışı, referans) ve **geç iptal %50**: pazaryerinde öğretmene yalnız kalem payı gider. Bonusu kendi cebimizden ödersek yine "biz öğretmene ödüyoruz" durumuna düşeriz. Öneri: bonuslar yerine kademe yükseltme (sonraki paketlerde daha yüksek `subMerchantPrice`); geç iptalde kalemin %50'si iade + kalan onay — iyzico kısmi kalem iadesini destekliyor mu, sorulacak.
2. **Öğretmen değişikliği:** kalemin alt üyesi ödeme anında sabitlenir. Değişiklikte eski öğretmenin onaylanmamış kalemleri iade edilip yeni öğretmenle yeniden tahsil mi edilecek (kayıtlı kart gerekir), yoksa iyzico kalem alt üyesini güncellemeye izin veriyor mu? → iyzico'ya sorulacak.
3. **Bekletme süresi:** 32 derslik SEZON paketi ~4 ay sürer. iyzico koruma havuzunda onaysız kalem en fazla ne kadar bekleyebilir? → sorulacak. Gerekirse uzun paketler aylık taksit yerine "aylık tahsilat" (kayıtlı kart) ile bölünür. (Taksit yok kararı korunur.)
4. Veliye fatura: yalnız hizmet bedeli mi, tüm tutar mı (öğretmen adına)? KDV oranı? → YMM.
5. İşçi sayılma riski: öğretmen müsaitliğini kendisi girer, dersi kabul/ret hakkı vardır, "atama" yerine "öneri + öğretmen onayı".

## YMM'ye sorulacaklar
1. Komisyon/hizmet bedeli faturasının konusu ve KDV oranı.
2. %1 e-ticaret stopajı bize mi düşer, ödeme kuruluşu mu keser?
3. Kayıtsız bireysel öğretmenin alt üye olması bizi sorumlu kılar mı; sözleşmeye hangi maddeler girmeli?
4. Fiyat ve öğretmen önerisini biz yaparsak hizmet akdi (işçi) sayılma riski.
5. Deneme dersi ve iadede belge düzeni.

## İade ve güvence (karar: 2026-10-25)
- Kalem onayı: ders `tamamlandi` + 72 saat itiraz süresi; onaylar haftalık toplu. Öğretmen kaybolursa onaylanmamış kalemler veliye iade / yeni öğretmene.
- Ters ibraz (onaylanmış ders) asıl risk: ders kaydı (90 gün), giriş-çıkış kaydı ve rapor delil; kaybedilirse öğretmenin sonraki kalemlerinden mahsup (sözleşme maddesi).
- PayTR'ye sorulacaklar: kalem bazında aktarımı biz mi tetikliyoruz; onaysız kalemin azami bekleme süresi; kalem bazında tam/kısmi iade; ters ibrazda kimden düşülür ve mahsup; bireysel alt mağaza; öğretmen değişikliğinde kalem aktarımı. İlk iki soru olumsuzsa iyzico.
- Marka sözü: "Prosedürü biz hallederiz, sen derse odaklan." Öğretmene: üyelik/giriş ücreti yok, tahsilat ve iade bizde, "biz de öğretmeniz". Veliye: kolay iade, numara paylaşılmaz, ilk öğretmen değişikliği ücretsiz.
