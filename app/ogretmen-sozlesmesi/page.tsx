import type { Metadata } from "next";
import Link from "next/link";

import { H2, LegalPage, P, Table, UL } from "@/components/legal-page";
import { COMPANY, companyValue, LEGAL_VERSION } from "@/lib/company";
import { BANDS, TEACHER_FLOOR } from "@/lib/teacher";

export const metadata: Metadata = {
  title: "Öğretmen hizmet sözleşmesi — Özel Ders · Thorius",
  description: "Özel Ders · Thorius ile bağımsız öğretmen arasındaki hizmet sözleşmesi: komisyon, ödeme, iptal, çocuk güvenliği.",
};

export default function TeacherAgreementPage() {
  return (
    <LegalPage
      title="Öğretmen hizmet sözleşmesi"
      lead={`Başvurunun sözleşme adımında onayladığın metin budur (sürüm ${LEGAL_VERSION}). Kısa hali: bağımsız öğretmensin, ders verdikçe kazanırsın; öğrenci, tahsilat ve iade bizde.`}
    >
      <H2>1. Taraflar</H2>
      <P>
        {COMPANY.legalName} (“Platform”), {companyValue(COMPANY.address)} ile başvurusu onaylanan öğretmen (“Öğretmen”) arasında, sözleşme
        adımındaki elektronik onayla kurulur.
      </P>

      <H2>2. Bağımsız hizmet ilişkisi</H2>
      <UL
        items={[
          "Öğretmen, platformda bağımsız hizmet sağlayıcı olarak ders verir; taraflar arasında işçi–işveren, ortaklık ya da temsil ilişkisi yoktur.",
          "Öğretmen ders saatlerini kendisi belirler ve önerilen öğrenciyi kabul ya da reddetme hakkına sahiptir. Önerinin reddedilmesi karnesini etkilemez.",
          "Öğretmen ders yöntemini ve materyalini kendisi seçer; platformun ölçme raporlarını dersin hazırlığında kullanır.",
          "Gelirinin vergisel yükümlülükleri Öğretmen’e aittir. Mevzuat gereği yapılması zorunlu kesintiler ödeme kuruluşu ya da Platform tarafından yapılır.",
        ]}
      />

      <H2>3. Platform’un yükümlülükleri</H2>
      <UL
        items={[
          "Öğrenciyi ölçmek (deneme ve konu raporu) ve Öğretmen’in branş ve kademesine uygun öğrenci önermek.",
          "Tahsilat, iade ve fatura işlemlerini yürütmek; Öğretmen’den üyelik, ilan, başvuru ya da öne çıkma ücreti almamak.",
          "Ders altyapısını, ders kaydını ve dönem karnesini sağlamak; karnenin bileşenlerini Öğretmen’e şeffaf göstermek.",
        ]}
      />

      <H2>4. Öğretmen’in yükümlülükleri</H2>
      <UL
        items={[
          "Kabul ettiği dersleri zamanında, kayıt altında ve platform içinde vermek; ders raporunu 24 saat içinde girmek.",
          "Dersi 48 saatten az kala iptal etmemek; zorunlu hallerde derhal bildirmek. Geç iptaller karnede hizmet kesintisi olarak işlenir.",
          "Öğrenci ve veliyle platform dışından iletişim kurmamak, iletişim bilgisi istememek ve platform dışında ücretli ders anlaşması yapmamak. Bu yükümlülük sözleşme süresince ve sona ermesinden sonraki 12 ay boyunca, platformda tanıştığı öğrenciler için geçerlidir.",
          "Adli sicil kaydını 12 ayda bir yenilemek; ders vermesine engel bir durum oluşursa derhal bildirmek.",
          "Öğrenci verilerini yalnızca ders amacıyla kullanmak ve gizli tutmak.",
        ]}
      />

      <H2>5. Komisyon ve kazanç</H2>
      <P>
        Her ders için velinin ödediği ders bedelinden komisyon düşülür; kalan tutar Öğretmen’in payıdır. Komisyon, 3 ayda bir otomatik hesaplanan
        karneye göre belirlenen banda bağlıdır. Öğretmen payı hiçbir pakette ders başı {TEACHER_FLOOR} TL’nin altına düşmez; fark komisyondan
        karşılanır. Pay, paketin satıldığı andaki banda göre sabitlenir.
      </P>
      <Table
        head={["Bant", "Komisyon", "Öğretmen payı", "Koşul"]}
        rows={BANDS.map((b) => [b.name, `%${Math.round(b.commission * 100)}`, `%${Math.round((1 - b.commission) * 100)}`, b.note])}
      />
      <P>
        Karne: gelişim (öğrencilerin 3 aylık takip denemesindeki ilerlemesi, 60 puan) + memnuniyet (öğrenci ve veli puanı 30, paket yenileme 10)
        − hizmet kesintisi (takvime uyum, yanıt hızı, ders raporu; en fazla 15). Bir dönemde en fazla bir bant değişir; yeterli veri yoksa bant korunur.
      </P>

      <H2>6. Ödeme</H2>
      <UL
        items={[
          "Ödemeler lisanslı ödeme kuruluşu üzerinden, Öğretmen adına açılan bireysel alt hesaba yapılır. T.C. kimlik numarası ve IBAN doğrudan ödeme kuruluşuna iletilir.",
          "Bir dersin payı, ders yapıldıktan ve velinin 72 saatlik itiraz süresi dolduktan sonra onaylanır; onaylar haftada bir toplu olarak aktarılır.",
          "İtiraz edilen derste ders kaydı incelenir. Haksız alındığı anlaşılan ya da ters ibrazla geri alınan tutar, Öğretmen’in onaylanmamış ya da sonraki ödemelerinden mahsup edilir.",
        ]}
      />

      <H2>7. Çocuk güvenliği</H2>
      <P>
        Dersler kayıt altındadır ve kayıtlar 90 gün saklanır. 21:00’den sonra ders verilmez. Çocuğa yönelik uygunsuz söz, davranış ya da iletişim
        girişimi sözleşmenin derhal feshi sebebidir ve gerektiğinde yetkili makamlara bildirilir.
      </P>

      <H2>8. Süre ve fesih</H2>
      <UL
        items={[
          "Sözleşme belirsiz sürelidir. Taraflar 15 gün önceden bildirimle feshedebilir; planlanmış derslerin akıbeti birlikte belirlenir.",
          "Doğrulanmış şikayet, adli sicilin yenilenmemesi, platform dışına öğrenci çekme ya da çocuk güvenliği ihlalinde Platform sözleşmeyi bildirimsiz feshedebilir.",
          "Fesihte, yapılmış ve itiraz süresi dolmuş derslerin payı ödenir.",
        ]}
      />

      <H2>9. Kişisel veriler ve uyuşmazlık</H2>
      <P>
        Öğretmen’in kişisel verileri{" "}
        <Link href="/kvkk" className="font-semibold text-primary hover:underline">
          KVKK aydınlatma metni
        </Link>{" "}
        uyarınca işlenir. Uyuşmazlıklarda İstanbul mahkemeleri ve icra daireleri yetkilidir. Sözleşmede değişiklik olursa Öğretmen’e en az 15
        gün önceden bildirilir; yeni sürüm onaylanmadıkça mevcut sürüm geçerlidir.
      </P>
    </LegalPage>
  );
}
