import type { Metadata } from "next";

import { H2, LegalPage, P, Table, UL } from "@/components/legal-page";
import { COMPANY, companyValue } from "@/lib/company";

export const metadata: Metadata = {
  title: "KVKK aydınlatma metni — Özel Ders · Thorius",
  description: "Kişisel verilerin hangi amaçla, hangi hukuki sebeple işlendiği, kimlere aktarıldığı ve hakların.",
};

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK aydınlatma metni"
      lead="6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 10. maddesi uyarınca, hangi verini neden işlediğimizi ve haklarını açıklıyoruz. Az veri ilkesiyle çalışırız: çocuklar için yalnızca ad ve sınıf isteriz."
    >
      <H2>1. Veri sorumlusu</H2>
      <P>
        {COMPANY.legalName} (“Özel Ders · Thorius”, “biz”) · Adres: {companyValue(COMPANY.address)} · MERSİS: {companyValue(COMPANY.mersis)} ·
        E-posta: {COMPANY.kvkkEmail}
        {COMPANY.kep ? ` · KEP: ${COMPANY.kep}` : ""}
      </P>

      <H2>2. Hangi verileri işliyoruz?</H2>
      <Table
        head={["Kim", "Veriler"]}
        rows={[
          ["Veli", "Ad soyad, e-posta, telefon, şifre (şifrelenmiş olarak, kimlik doğrulama altyapısında), ileti izni tercihi, satın alınan paketler, fatura bilgileri. Kart bilgilerin bizde değil, lisanslı ödeme kuruluşunda işlenir."],
          ["Öğrenci", "Yalnızca ad ve sınıf; çözülen denemelerin cevapları ve sonuçları; ders tarihleri, ders raporları ve puanları; canlı ders kayıtları (90 gün). Soyad, T.C. kimlik numarası ya da okul adı istemeyiz."],
          ["Hesapsız deneme çözen", "İsteğe bağlı girilen ad, sınıf, cevaplar ve sonuç. Sonuca yalnızca sana verilen bağlantıyla erişilir."],
          ["Öğretmen adayı ve öğretmen", "Ad soyad, e-posta, telefon, eğitim ve deneyim bilgileri, branş ve sınıf tercihleri, branş testi ve demo ders değerlendirmeleri, tanıtım videosu bağlantısı, kadrolu memur olmadığına ve vergi durumuna dair beyanlar, e-Devlet belge barkodları (yalnız doğrulanana kadar), kimlik, diploma ve adli sicil doğrulama kayıtları, sözleşme onayları. T.C. kimlik numarası ve IBAN doğrudan ödeme kuruluşuna iletilir; bizde yalnızca IBAN’ın son 4 hanesi tutulur."],
          ["Site ziyaretçisi", "Oturumun açık kalması için zorunlu çerez; güvenlik için sunucu kayıtları (IP adresi, tarih-saat, istek bilgisi). Reklam ya da izleme çerezi kullanmıyoruz."],
        ]}
      />

      <H2>3. Hangi amaçla ve hangi hukuki sebeple?</H2>
      <Table
        head={["Amaç", "Hukuki sebep (KVKK)"]}
        rows={[
          ["Hesap açmak, deneme sonucu ve konu raporu sunmak, öğretmen eşleştirmek, dersleri planlamak ve yürütmek", "Sözleşmenin kurulması ve ifası (md. 5/2-c)"],
          ["Ödeme, iade ve fatura işlemleri; vergi ve ticari defter yükümlülükleri; yetkili kurumların talepleri", "Hukuki yükümlülük (md. 5/2-ç)"],
          ["Öğretmen başvurusunu değerlendirmek: branş testi, demo ders, belge doğrulama", "Sözleşmenin kurulması (md. 5/2-c) ve meşru menfaat (md. 5/2-f)"],
          ["Çocuklarla çalışacak öğretmenin adli sicil kaydının doğrulanması", "Açık rıza (md. 6/2) — rıza vermeden bu adım tamamlanamaz"],
          ["Ders kalitesini ölçmek, şikayetleri incelemek, ders kayıtlarını 90 gün saklamak, sistem güvenliği", "Meşru menfaat (md. 5/2-f), hakkın tesisi ve korunması (md. 5/2-e)"],
          ["Kampanya ve duyuru iletileri", "Açık rıza (md. 5/1); izin her zaman geri alınabilir"],
        ]}
      />

      <H2>4. Kimlere aktarıyoruz?</H2>
      <UL
        items={[
          "Lisanslı ödeme kuruluşu (tahsilat, öğretmene ödeme, iade).",
          "Altyapı hizmeti aldığımız bulut sağlayıcıları: veritabanı ve dosya depolama (Avrupa Birliği, Almanya’daki sunucular), web barındırma ve e-posta gönderimi. Yurt dışına aktarım KVKK md. 9 kapsamında uygun güvencelerle (standart sözleşme) yapılır.",
          "Ders hizmeti için öğretmene: öğrencinin adı, sınıfı, deneme sonucu ve eksik konuları. Velinin telefon numarası ve e-postası öğretmenle paylaşılmaz.",
          "Mali müşavir ve hukuk danışmanı (yasal yükümlülükler kapsamında), talep halinde yetkili kamu kurum ve kuruluşları.",
        ]}
      />

      <H2>5. Ne kadar süre saklıyoruz?</H2>
      <UL
        items={[
          "Hesap bilgileri: hesap açık olduğu sürece; hesap kapanınca yasal saklama süreleri dışındaki veriler silinir ya da anonimleştirilir.",
          "Fatura ve ödeme kayıtları: ilgili mevzuatın öngördüğü süre (10 yıl).",
          "Canlı ders kayıtları: 90 gün, ardından otomatik silinir.",
          "e-Devlet belge barkodları: doğrulama yapılana kadar; doğrulamadan sonra yalnız doğrulama tarihi kalır. Adli sicil doğrulaması 12 ayda bir yenilenir.",
          "Sonuçlanan öğretmen başvuruları: yeniden başvuru süresi dikkate alınarak 12 ay.",
        ]}
      />

      <H2>6. Hakların (KVKK md. 11)</H2>
      <P>
        Verinin işlenip işlenmediğini öğrenme, bilgi isteme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı kişileri bilme,
        eksik ya da yanlışsa düzeltilmesini, şartları oluştuğunda silinmesini isteme, bu işlemlerin aktarılan kişilere bildirilmesini isteme,
        otomatik sistemlerle analiz sonucu aleyhine bir sonuca itiraz etme ve zarara uğradıysan giderilmesini isteme hakların vardır.
      </P>
      <P>
        Başvurunu {COMPANY.kvkkEmail} adresine kayıtlı e-postandan, yazılı olarak {companyValue(COMPANY.address)} adresine
        {COMPANY.kep ? ` ya da ${COMPANY.kep} KEP adresine` : ""} iletebilirsin. Başvuruları en geç 30 gün içinde ücretsiz yanıtlarız.
      </P>
    </LegalPage>
  );
}
