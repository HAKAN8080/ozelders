import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatTL, getActiveProducts, type Product } from "@/lib/products";
import { BANDS, FUNNEL, TEACHER_BRANCHES, TEACHER_FLOOR, teacherShare } from "@/lib/teacher";

export const metadata: Metadata = {
  title: "Öğretmen ol — Özel Ders · Thorius",
  description:
    "3.–12. sınıf, tüm okul dersleri. Üyelik ve giriş ücreti yok; öğrenciyi, tahsilatı ve iadeyi biz üstleniriz. Sen derse odaklan.",
};

const eyebrow = "text-sm font-semibold uppercase tracking-[0.08em]";
const APPLY = "/ogretmen-ol/basvuru";

export default function TeacherLanding() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Promises />
        <Earnings />
        <Branches />
        <Steps />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="defter border-b border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 pt-16 pb-20 sm:px-6 lg:pt-22 lg:pb-24">
        <div className="flex min-w-0 flex-[1_1_540px] flex-col gap-6">
          <p className={`${eyebrow} m-0 text-primary`}>Öğretmenler için · 3.–12. sınıf · tüm okul dersleri</p>
          <h1 className="m-0 font-serif text-4xl leading-[1.08] font-bold tracking-[-0.01em] sm:text-5xl lg:text-[56px]">
            Sen ders ver, öğrenciyi biz getirelim.
            <span className="mt-3 block text-[0.62em] leading-[1.2] text-primary">Gerisini biz hallederiz, sen derse odaklan.</span>
          </h1>
          <p className="m-0 max-w-[34em] text-[19px] leading-relaxed text-[#3d4743]">
            Üyelik, ilan ya da giriş ücreti yok. İlkokuldan liseye, okul derslerinden LGS ve YKS hazırlığına kadar
            öğrenciyi biz buluruz; tahsilat, takvim ve iade bizde. Sen yalnızca verdiğin dersten kazanırsın.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={APPLY}
              className="rounded-md bg-primary px-6 py-4 text-[17px] font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              Başvur — 5 dakika
            </Link>
            <Link
              href="#kazanc"
              className="rounded-md border border-[#b9c7bf] bg-background px-5 py-4 text-[17px] font-semibold text-foreground hover:bg-primary-soft"
            >
              Ne kadar kazanırım?
            </Link>
          </div>
        </div>

        <div className="tahta flex min-w-0 flex-[1_1_380px] flex-col gap-5 rounded-[10px] p-7 text-[#f2f5f1] shadow-[0_1px_0_#083b22,0_18px_40px_rgb(11_79_46/0.18)] sm:p-9">
          <span className={`${eyebrow} text-[13px] text-[#cfe3d6]`}>Senden kesilen</span>
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-5">
            {[
              ["0 ₺", "üyelik ücreti"],
              ["0 ₺", "giriş / ilan ücreti"],
              ["%30 → %20", "komisyon, öğrencin geliştikçe iner"],
              [`${TEACHER_FLOOR} ₺`, "ders başı en düşük kazancın"],
            ].map(([n, label]) => (
              <div key={label} className="flex flex-col-reverse gap-1">
                <dt className="text-[15px] leading-snug text-[#cfe3d6]">{label}</dt>
                <dd className="m-0 font-serif text-3xl font-bold tabular-nums">{n}</dd>
              </div>
            ))}
          </dl>
          <p className="m-0 -rotate-[1.5deg] font-hand text-[24px] text-white">biz de öğretmeniz ✓</p>
        </div>
      </div>
    </section>
  );
}

function Promises() {
  const items = [
    ["Öğrenciyi biz getiririz", "Öğrenci önce ücretsiz denememizi çözer. Eksik konusu ve hedefi belli olarak sana gelir; derse hazırlıksız girmezsin."],
    ["Veliyle para konuşmazsın", "Tahsilat ve iade bizde. Ödeme kovalamazsın, fiyat pazarlığı yapmazsın."],
    ["Ödemen güvende", "Velinin ödemesi ders ders güvenli hesapta bekler; ders yapıldığında payın her hafta doğrudan hesabına geçer."],
    ["Takvim ve karar senin", "Hangi saatlerde çalışacağını sen girersin. Önerilen öğrenciyi kabul etmek de senin elinde."],
  ];
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-20 sm:px-6">
        <div className="flex max-w-[44em] flex-col gap-3">
          <p className={`${eyebrow} m-0 text-primary`}>Neden Özel Ders · Thorius</p>
          <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-bold sm:text-[42px]">
            Bu platformu, öğretmen emeğinin karşılığını alsın diye kurduk.
          </h2>
          <p className="m-0 text-[17px] leading-relaxed text-[#3d4743]">
            Yüksek komisyon yok, giriş ücreti yok, “öne çıkma” paketi yok. Ders dışındaki her şeyi biz üstleniyoruz.
          </p>
        </div>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-10 gap-y-8 border-t border-border p-0 pt-8">
          {items.map(([t, b]) => (
            <li key={t} className="flex flex-col gap-2">
              <h3 className="m-0 text-xl font-semibold">{t}</h3>
              <p className="m-0 text-[16px] leading-relaxed text-[#3d4743]">{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Earnings() {
  return (
    <section id="kazanc" className="defter scroll-mt-4 border-y border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[40em] flex-col gap-3">
            <p className={`${eyebrow} m-0 text-primary`}>Kazanç</p>
            <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-bold sm:text-[42px]">İyi öğretmen daha çok kazanır.</h2>
            <p className="m-0 text-[17px] leading-relaxed text-[#3d4743]">
              Herkes %30 komisyonla başlar. Her 3 ayda bir karnen otomatik hesaplanır: öğrencilerinin denemelerdeki
              gelişimi, öğrenci ve veli puanları ve devam oranı. Karnen yükseldikçe komisyonun %20&apos;ye kadar iner.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {BANDS.map((b, i) => (
            <div
              key={b.code}
              className={`flex flex-col gap-1.5 rounded-[10px] p-6 ${i === BANDS.length - 1 ? "tahta text-[#f2f5f1]" : "border border-border bg-background"}`}
            >
              <span className={`text-sm font-semibold uppercase tracking-[0.06em] ${i === BANDS.length - 1 ? "text-[#cfe3d6]" : "text-muted"}`}>
                {b.name}
              </span>
              <span className="font-serif text-[40px] leading-none font-bold tabular-nums">%{Math.round((1 - b.commission) * 100)}</span>
              <span className={`text-[15px] ${i === BANDS.length - 1 ? "text-[#dce9e0]" : "text-[#3d4743]"}`}>
                senin payın · {b.note.toLocaleLowerCase("tr")}
              </span>
            </div>
          ))}
        </div>

        <Suspense fallback={<p className="m-0 text-muted">Kazanç tablosu yükleniyor…</p>}>
          <EarningsTable />
        </Suspense>
      </div>
    </section>
  );
}

async function EarningsTable() {
  let products: Product[] = [];
  try {
    products = await getActiveProducts();
  } catch {
    products = [];
  }
  if (!products.length) return null;
  const rows = [...products].sort((a, b) => (a.kind === b.kind ? a.lesson_count - b.lesson_count : a.kind === "ana" ? -1 : 1));
  const standard = products.find((p) => p.code === "STANDART") ?? rows[0];
  const stdLesson = Number(standard.price) / standard.lesson_count;
  const monthly = 80; // 10 öğrenci × haftada 2 ders
  const low = teacherShare(stdLesson, BANDS[0].commission) * monthly;
  const high = teacherShare(stdLesson, BANDS[BANDS.length - 1].commission) * monthly;

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-[10px] border border-border bg-background">
        <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
          <caption className="px-5 pt-4 text-left text-[15px] font-semibold">Ders başı kazancın (50 dakika, birebir)</caption>
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="px-5 py-3 font-semibold">Paket</th>
              <th className="px-5 py-3 font-semibold">Velinin ödediği</th>
              {BANDS.map((b) => (
                <th key={b.code} className="px-5 py-3 font-semibold">
                  {b.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const lesson = Number(p.price) / p.lesson_count;
              return (
                <tr key={p.code} className="border-b border-[#eef2ef] last:border-0">
                  <td className="px-5 py-3.5 font-medium">
                    {p.name} <span className="text-muted">({p.lesson_count} ders)</span>
                  </td>
                  <td className="px-5 py-3.5 tabular-nums">{formatTL(lesson)}</td>
                  {BANDS.map((b) => {
                    const share = teacherShare(lesson, b.commission);
                    const floored = share === TEACHER_FLOOR && lesson * (1 - b.commission) < TEACHER_FLOOR;
                    return (
                      <td key={b.code} className="px-5 py-3.5 font-semibold tabular-nums">
                        {formatTL(share)}
                        {floored ? <span className="text-primary">*</span> : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="m-0 text-sm leading-relaxed text-muted">
        * Taban ücret: hiçbir pakette ders başı {formatTL(TEACHER_FLOOR)}&apos;nin altına düşmezsin; uzun paket indirimini biz
        karşılarız. Tutarlar vergi ve ödeme kuruluşu kesintisi öncesidir; payın, paketin satıldığı andaki bandına göre sabitlenir.
      </p>
      <p className="m-0 rounded-[10px] bg-primary-soft p-5 text-[17px] leading-relaxed">
        Örnek: haftada 2 ders alan 10 öğrenci, ayda yaklaşık {monthly} ders. Başlangıç bandında{" "}
        <strong>{formatTL(low)}</strong>, Usta bandında <strong>{formatTL(high)}</strong>.
      </p>
    </div>
  );
}

function Branches() {
  const levels = ["İlkokul", "Ortaokul", "Ortaokul–Lise", "Lise"] as const;
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-14 px-4 py-20 sm:px-6">
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4">
          <p className={`${eyebrow} m-0 text-primary`}>Branşlar</p>
          <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-bold sm:text-[42px]">Dokuz yıl, her ders.</h2>
          <p className="m-0 text-[17px] leading-relaxed text-[#3d4743]">
            LGS ve YKS önemli, ama 3. sınıftan 12. sınıfa dokuz yılın yalnızca ikisi sınav yılı. Öğrencilerin çoğu okul
            dersine destek arar: kesirler, okuduğunu anlama, fizik ödevi. Hangi sınıf aralığında ders vereceğini sen
            seçersin.
          </p>
        </div>
        <div className="grid min-w-0 flex-[1_1_560px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
          {levels.map((lv) => (
            <div key={lv} className="flex flex-col gap-2 border-t-2 border-primary pt-4">
              <h3 className="m-0 text-base font-semibold uppercase tracking-[0.06em] text-primary">{lv}</h3>
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[16px]">
                {TEACHER_BRANCHES.filter((b) => b.level === lv).map((b) => (
                  <li key={b.code}>{b.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="tahta text-[#f2f5f1]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-20 sm:px-6">
        <div className="flex max-w-[44em] flex-col gap-3">
          <p className={`${eyebrow} m-0 text-[#cfe3d6]`}>Başvuru</p>
          <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-bold sm:text-[42px]">Her başvuran öğretmen olamaz. Bu yüzden veliler bize güvenir.</h2>
          <p className="m-0 text-[17px] leading-relaxed text-[#dce9e0]">Adımların hepsi çevrim içi; çoğu başvuru 1–2 haftada sonuçlanır.</p>
        </div>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-10 p-0">
          {FUNNEL.map((f, i) => (
            <li key={f.stage} className="flex flex-col gap-2.5">
              <span aria-hidden="true" className="font-hand text-[48px] leading-none text-white">
                {i + 1}.
              </span>
              <h3 className="m-0 text-xl font-semibold">{f.title}</h3>
              <p className="m-0 text-[16px] leading-relaxed text-[#dce9e0]">{f.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  const qs: [string, string][] = [
    [
      "Kimler başvurabilir?",
      "Branşında lisans mezunu öğretmenler: atanmayı bekleyenler, özel okul ve dershane öğretmenleri, ücretli öğretmenler, emekli öğretmenler. Son sınıf ve yüksek lisans öğrencileri de başvurabilir. Kadrolu devlet memurları (657 sayılı Kanun md. 28) özel ders veremediği için kabul edilmez.",
    ],
    [
      "Ücret ödüyor muyum?",
      "Hayır. Üyelik, başvuru, ilan ya da öne çıkma ücreti yok. Yalnızca verdiğin derslerden komisyon alırız; komisyon platform giderlerini ve ödeme altyapısını karşılar.",
    ],
    [
      "Ödememi nasıl alırım?",
      "Onaylandığında lisanslı ödeme kuruluşunda adına bir alt hesap açılır. Velinin ödemesi ders ders orada bekler; ders yapılıp 72 saatlik itiraz süresi dolunca payın haftalık olarak doğrudan IBAN'ına geçer. TCKN ve IBAN bilgin bizde saklanmaz, ödeme kuruluşuna iletilir.",
    ],
    [
      "Vergi ve sözleşme nasıl işliyor?",
      "Platformda bağımsız öğretmen olarak çalışırsın; işçi–işveren ilişkisi yoktur. Gelirinin vergisel yükümlülüğü sana aittir. Sözleşmeyi oryantasyon adımında görür ve onaylarsın.",
    ],
    [
      "Öğrenci gelmezse ya da son dakika iptal ederse?",
      "İptal ve gelmeme kuralları veliyle yapılan sözleşmede yazılıdır; uygulamasını biz yaparız. Seninle velinin arasında para konuşulmaz.",
    ],
    [
      "Komisyonum neye göre düşer?",
      "3 ayda bir otomatik karne: öğrencilerinin takip denemelerindeki gelişimi (60), öğrenci ve veli puanları ile paket yenileme oranı (40). Takvime uymamak, geç yanıt ve eksik ders raporu puan düşürür. Önerilen öğrenciyi reddetmen cezalandırılmaz.",
    ],
    [
      "Branş testinde neler soruluyor?",
      "Her branşın her kademesi (3–4, 5–8, 9–12. sınıf) için 20 soruluk, 30 dakikalık çevrim içi bir test: 15 temel, 5 ileri düzey soru. 17 doğru ve üstü geçer, yanlış doğruyu götürmez. Başvurduğun aralıkta birden fazla kademe varsa her birini ayrı çözebilirsin; geçtiğin kademede ders verirsin. Her test bir kez çözülür.",
    ],
    [
      "Belgelerimi yüklemem gerekiyor mu?",
      "Hayır. e-Devlet'ten aldığın diploma ve adli sicil kaydının barkod numaralarını yazarsın, biz doğrularız. Belge kopyası saklamayız; barkodlar doğrulamadan sonra silinir.",
    ],
  ];
  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-[900px] flex-col gap-8 px-4 py-20 sm:px-6">
        <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-bold sm:text-[42px]">Sık sorulanlar</h2>
        <div className="flex flex-col border-t border-border">
          {qs.map(([q, a]) => (
            <details key={q} className="group border-b border-border py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {q}
                <span aria-hidden="true" className="text-2xl text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="m-0 mt-3 text-[16px] leading-relaxed text-[#3d4743]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="defter border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="m-0 font-serif text-[30px] leading-[1.2] font-bold sm:text-[36px]">Biz de öğretmeniz. Sen dersine odaklan.</h2>
          <p className="m-0 text-[17px] text-[#3d4743]">Başvuru formu 5 dakika; branş testine hemen geçersin.</p>
        </div>
        <Link href={APPLY} className="rounded-md bg-primary px-7 py-4 text-[17px] font-semibold text-primary-foreground hover:bg-primary-hover">
          Başvuruya başla
        </Link>
      </div>
    </section>
  );
}
