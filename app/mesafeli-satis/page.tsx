import type { Metadata } from "next";
import Link from "next/link";

import { H2, LegalPage, P, UL } from "@/components/legal-page";
import { COMPANY, companyValue } from "@/lib/company";

export const metadata: Metadata = {
  title: "Mesafeli satış sözleşmesi ve ön bilgilendirme — Özel Ders · Thorius",
  description: "Çevrim içi birebir ders paketlerinin satışına ilişkin ön bilgilendirme formu ve mesafeli hizmet sözleşmesi.",
};

export default function DistanceSalesPage() {
  return (
    <LegalPage
      title="Mesafeli satış sözleşmesi"
      lead="6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca ön bilgilendirme formu ve sözleşme. Satın alma sırasında paket, tutar ve tarih bilgileriyle birlikte yeniden gösterilir ve onayın alınır."
    >
      <H2>A. Ön bilgilendirme formu</H2>
      <UL
        items={[
          <>
            <strong>Hizmeti sunan ve aracı hizmet sağlayıcı:</strong> {COMPANY.legalName} · {companyValue(COMPANY.address)} · Vergi dairesi/no:{" "}
            {companyValue(COMPANY.taxOffice)} / {companyValue(COMPANY.taxNo)} · MERSİS: {companyValue(COMPANY.mersis)} · {COMPANY.tradeRegistry} · E-posta: {COMPANY.supportEmail}
            {COMPANY.phone ? ` · Telefon: ${COMPANY.phone}` : ""}
          </>,
          <>
            <strong>Hizmet:</strong> Özel Ders · Thorius platformunda, platformun seçip doğruladığı bağımsız öğretmenlerce verilen çevrim içi, canlı ve
            birebir ders paketi. Bir ders 50 dakikadır; dersler kayıt altına alınır.
          </>,
          <>
            <strong>Bedel:</strong> paketin satın alma sayfasında gösterilen, vergiler dahil toplam fiyatı. Tek çekimdir; taksit ve otomatik
            yenileme yoktur. Ek ücret alınmaz.
          </>,
          <>
            <strong>Ödeme:</strong> lisanslı ödeme kuruluşu aracılığıyla kredi ya da banka kartıyla. Kart bilgileri Platform tarafından
            görülmez ve saklanmaz. Ödeme ders ders güvenli hesapta bekler; dersin payı öğretmene ders yapıldıktan ve 72 saatlik itiraz süresinden
            sonra aktarılır.
          </>,
          <>
            <strong>İfa:</strong> ders saatleri öğretmenin müsaitliğine göre birlikte planlanır. Paket, satın alma sayfasında yazan geçerlilik süresi
            içinde kullanılır.
          </>,
          <>
            <strong>Cayma hakkı:</strong> satın almadan itibaren 14 gün. Ayrıntılar ve iade koşulları:{" "}
            <Link href="/iptal-iade" className="font-semibold text-primary hover:underline">
              iptal ve iade
            </Link>
            .
          </>,
          <>
            <strong>Şikayet ve itiraz:</strong> {COMPANY.supportEmail}. Uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen parasal sınırlar
            dahilinde tüketicinin yerleşim yerindeki tüketici hakem heyetine, sınırı aşan uyuşmazlıklarda tüketici mahkemelerine başvurulabilir.
          </>,
        ]}
      />

      <H2>B. Mesafeli hizmet sözleşmesi</H2>
      <P>
        <strong>Madde 1 · Taraflar.</strong> Bu sözleşme, {COMPANY.legalName} (“Platform”) ile platformda ders paketi satın alan veli ya da
        reşit öğrenci (“Alıcı”) arasında, satın alma anında elektronik ortamda kurulur.
      </P>
      <P>
        <strong>Madde 2 · Konu.</strong> Alıcının seçtiği ders paketinin, platform aracılığıyla bağımsız bir öğretmen tarafından çevrim içi olarak
        verilmesi ve Platform’un ölçme, eşleştirme, planlama, tahsilat ve iade hizmetlerini yürütmesidir. Paket bir ders ve bir öğretmen
        içindir; öğretmen değişikliği iptal ve iade metnindeki kurallarla yapılır.
      </P>
      <P>
        <strong>Madde 3 · Tarafların yükümlülükleri.</strong> Platform, derslerin planlanmasını, öğretmenin uygunluğunu (branş testi, demo ders,
        belge doğrulama) ve ödeme güvenliğini sağlar. Alıcı, derslere zamanında katılmayı, iptalleri iptal kurallarına uygun yapmayı ve öğretmenle
        platform dışında ücretli ders anlaşması yapmamayı kabul eder.
      </P>
      <P>
        <strong>Madde 4 · Çocuğun güvenliği.</strong> Dersler platform içinde ve kayıt altında yapılır; 21:00’den sonra ders planlanmaz. Velinin
        iletişim bilgileri öğretmenle paylaşılmaz. Uygunsuz bir durumu {COMPANY.supportEmail} adresine bildir; ders kaydı incelenir ve gerekli
        önlem derhal alınır.
      </P>
      <P>
        <strong>Madde 5 · Cayma, iptal ve iade.</strong> Alıcının cayma hakkı ve iade koşulları{" "}
        <Link href="/iptal-iade" className="font-semibold text-primary hover:underline">
          iptal ve iade
        </Link>{" "}
        metninde düzenlenmiştir ve bu sözleşmenin parçasıdır. İade, ödemenin yapıldığı karta en geç 14 gün içinde yapılır.
      </P>
      <P>
        <strong>Madde 6 · Kişisel veriler.</strong> Kişisel veriler{" "}
        <Link href="/kvkk" className="font-semibold text-primary hover:underline">
          KVKK aydınlatma metni
        </Link>{" "}
        uyarınca işlenir.
      </P>
      <P>
        <strong>Madde 7 · Yürürlük.</strong> Alıcı, ön bilgilendirme formunu okuduğunu ve sözleşmeyi elektronik ortamda onayladığını kabul eder.
        Sözleşme ve sipariş özeti Alıcının e-posta adresine gönderilir.
      </P>
    </LegalPage>
  );
}
