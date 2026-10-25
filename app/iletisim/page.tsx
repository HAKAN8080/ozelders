import type { Metadata } from "next";
import Link from "next/link";

import { H2, LegalPage, P, UL } from "@/components/legal-page";
import { COMPANY, companyValue } from "@/lib/company";

export const metadata: Metadata = {
  title: "İletişim — ÖzelDersBul",
  description: "ÖzelDersBul destek, KVKK başvurusu ve şirket bilgileri.",
};

export default function ContactPage() {
  const mail = (a: string) => (
    <a href={`mailto:${a}`} className="font-semibold text-primary hover:underline">
      {a}
    </a>
  );
  return (
    <LegalPage title="İletişim" lead="Sorunu kısa bir e-postayla yaz; hesabındaki e-postadan yazarsan daha hızlı yardımcı oluruz.">
      <H2>Destek</H2>
      <UL
        items={[
          <>Veliler ve öğrenciler: {mail(COMPANY.supportEmail)}</>,
          <>
            Öğretmen başvurusu:{" "}
            <Link href="/ogretmen-ol/basvuru" className="font-semibold text-primary hover:underline">
              başvuru sayfan
            </Link>{" "}
            ya da {mail(COMPANY.supportEmail)}
          </>,
          <>Kişisel veriler (KVKK başvurusu): {mail(COMPANY.kvkkEmail)}</>,
          ...(COMPANY.phone ? [<>Telefon: {COMPANY.phone}</>] : []),
          <>Çalışma saatleri: {COMPANY.supportHours}</>,
        ]}
      />
      <H2>Şirket bilgileri</H2>
      <P>
        {COMPANY.legalName}
        <br />
        Adres: {companyValue(COMPANY.address)}
        <br />
        Vergi dairesi / no: {companyValue(COMPANY.taxOffice)} / {companyValue(COMPANY.taxNo)}
        <br />
        MERSİS: {companyValue(COMPANY.mersis)}
        {COMPANY.kep ? (
          <>
            <br />
            KEP: {COMPANY.kep}
          </>
        ) : null}
      </P>
    </LegalPage>
  );
}
