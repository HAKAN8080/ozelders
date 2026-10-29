import type { Metadata } from "next";
import Link from "next/link";

import { H2, LegalPage, P, Table, UL } from "@/components/legal-page";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "İptal ve iade — Özel Ders · Thorius",
  description: "Ders iptali, yapılmayan dersin iadesi, ilk ders güvencesi, öğretmen değişikliği ve cayma hakkı.",
};

// Liste ders fiyatı: veritabanındaki pricing_settings.refund_list_lesson_price ile aynı olmalı
const LIST_PRICE = "1.100 TL";

export default function RefundPage() {
  return (
    <LegalPage title="İptal ve iade" lead="Kısa hali: yapılmayan dersin parası iade edilir. İlk paketinde ilk dersten memnun kalmazsan paketin tamamını iade ederiz.">
      <H2>1. Ders iptali ve saat değişikliği</H2>
      <Table
        head={["Durum", "Sonuç"]}
        rows={[
          ["Dersten 24 saat veya daha önce iptal ya da saat değişikliği", "Ücretsiz; ders hakkın korunur."],
          ["Derse 24 saatten az kala iptal", "Ders hakkından düşer (öğretmen o saati sana ayırdığı için)."],
          ["Öğrencinin derse katılmaması", "Ders hakkından düşer."],
          ["Öğretmenin iptali ya da derse gelmemesi", "Ders hakkın iade edilir; telafi dersi birlikte planlanır."],
          ["Teknik sorun (bağlantı, platform)", "Ders yapılamadıysa hakkın iade edilir."],
        ]}
      />

      <H2>2. Yapılmayan dersin iadesi</H2>
      <P>
        Ödemen ders ders, lisanslı ödeme kuruluşunun güvenli hesabında bekler. Bir dersin payı öğretmene ancak ders yapıldıktan ve 72 saatlik
        itiraz süresi dolduktan sonra geçer. Ders yapılmadıysa ya da sorun yaşadıysan bu sürede “Sorun var” bildirimiyle itiraz et; ders
        kaydına bakılır ve ders iade edilir ya da telafi edilir.
      </P>

      <H2>3. Paket iadesi</H2>
      <UL
        items={[
          <>
            <strong>İlk ders güvencesi:</strong> ilk paketinde, ilk dersten sonra memnun kalmazsan paketin tamamı iade edilir.
          </>,
          <>
            <strong>Diğer durumlarda:</strong> kullanılmamış dersler iade edilir. Paket indirimi yalnızca paketin tamamı kullanıldığında geçerli
            olduğundan, yapılmış dersler liste ders fiyatı ({LIST_PRICE}) üzerinden hesaplanıp ödenen tutardan düşülür. Örnek: 8 derslik 7.600
            TL’lik paketin 3 dersi yapıldıysa iade 7.600 − 3 × 1.100 = 4.300 TL’dir.
          </>,
          "Paketler satın alma sayfasında yazan geçerlilik süresi içinde kullanılır. Süresi dolmadan kullanılmamış dersler için iade isteyebilirsin.",
          "Paketler tek çekimdir, taksit yoktur. Otomatik yenileme yoktur.",
        ]}
      />

      <H2>4. Öğretmen değişikliği</H2>
      <P>
        Öğretmeni beğenmezsen ilk değişiklik ücretsizdir: ileri tarihli derslerin yeni öğretmenle yeniden planlanır, ders hakkından bir şey
        düşmez. Sonraki değişiklik taleplerini birlikte değerlendiririz.
      </P>

      <H2>5. Cayma hakkı</H2>
      <P>
        Mesafeli Sözleşmeler Yönetmeliği uyarınca satın almadan itibaren 14 gün içinde gerekçe göstermeden cayabilirsin. İlk ders yapılmadan
        cayarsan ödemenin tamamı iade edilir. Senin onayınla ifasına başlanan derslerde, yapılan dersler için yukarıdaki paket iadesi kuralları
        uygulanır; bu kurallar yasal cayma hakkından daha geniştir.
      </P>

      <H2>6. Mini grup</H2>
      <UL
        items={[
          "Mini grup aylık 8 derstir (haftada 2, 60 dakika); grup en az 3 öğrenci katılınca başlar. Başlamayan grup için ödeme alınmaz, alındıysa tamamı iade edilir.",
          "İlk grup dersinden memnun kalmazsan kalan 7 dersin ücreti iade edilir.",
          "Gruptan ayrılırsan yapılmamış derslerin ücreti iade edilir. Grubun ders saati ve öğretmeni grubun tamamı için geçerlidir; kişisel saat değişikliği yapılamaz.",
          "Bir öğrencinin katılmadığı grup dersi yapılmış sayılır; dersi öğretmen ya da platform kaynaklı bir nedenle yapılamazsa tüm grup için iade ya da telafi edilir.",
        ]}
      />

      <H2>7. İade nasıl yapılır?</H2>
      <UL
        items={[
          <>
            Hesabındaki paket sayfasından ya da{" "}
            <a href={`mailto:${COMPANY.supportEmail}`} className="font-semibold text-primary hover:underline">
              {COMPANY.supportEmail}
            </a>{" "}
            adresine yazarak iste; gerekçe sorgusu yapmayız.
          </>,
          "İade, ödemenin yapıldığı karta ödeme kuruluşu üzerinden, en geç 14 gün içinde yapılır; bankana yansıma süresi bankaya göre değişir.",
          <>
            Ayrıntılı koşullar için{" "}
            <Link href="/mesafeli-satis" className="font-semibold text-primary hover:underline">
              mesafeli satış sözleşmesi
            </Link>
            .
          </>,
        ]}
      />
    </LegalPage>
  );
}
