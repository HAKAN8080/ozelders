import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArkaPlan } from "@/components/oyun/arka-planlar";
import { GununSorusuKarti } from "@/components/oyun/gunun-sorusu";
import { SinifSeridi } from "@/components/oyun/sinif-seridi";
import { gununSorusuHavuzu } from "@/lib/games/gunun-sorusu";
import { derslereGore, YAKINDA_DERSLER, type Oyun } from "@/lib/games/konular";
import { GORSELLER, gorselSrc } from "@/lib/games/gorseller";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Ücretsiz Eğitim Oyunları — ÖzelDersBul",
  description:
    "Harita, eşleştirme ve kategori oyunlarıyla konuları oynayarak pekiştir. Ücretsiz, kayıt gerekmez.",
};

const DERSLER = derslereGore();
const KREDILER = [
  ...new Map(Object.values(GORSELLER).map((g) => [g.byUrl, g])).values(),
];

function dersSlug(d: string) {
  return d
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-");
}

function OyunKarti({ oyun: o }: { oyun: Oyun }) {
  const g = GORSELLER[o.href.replace("/oyunlar/", "")];
  return (
    <Link
      href={o.href}
      className="group flex flex-col overflow-hidden rounded-[10px] border border-border bg-background text-foreground no-underline shadow-[0_1px_0_rgb(0_0_0/0.03)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary-soft">
        {g ? (
          <Image
            src={gorselSrc(g.url, 640)}
            alt={g.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="tahta flex h-full items-center justify-center font-serif text-4xl font-bold text-white/85"
          >
            {o.baslik.slice(0, 1)}
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-[13px] font-semibold text-primary">
          {o.etiket}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-serif text-[22px] leading-tight font-bold">
          {o.baslik}
        </span>
        <span className="text-[15px] leading-relaxed text-muted">
          {o.aciklama}
        </span>
        <span className="mt-auto pt-2 font-semibold text-primary group-hover:underline">
          Oyna →
        </span>
      </div>
    </Link>
  );
}

export default function OyunlarPage() {
  return (
    <>
      <SiteHeader />
      <main className="defter relative isolate flex flex-1 flex-col">
        <ArkaPlan tur="pusula" />
        <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
              <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-primary">
                Ücretsiz oyunlar
              </p>
              <h1 className="m-0 max-w-[18em] font-serif text-4xl leading-[1.1] font-bold sm:text-5xl">
                Oynayarak tekrar et.
              </h1>
              <p className="m-0 max-w-[36em] text-[19px] leading-relaxed text-[#3d4743]">
                Kısa, etkileşimli oyunlarla konuları pekiştir. Kayıt olmadan
                başlayabilirsin.
              </p>
            </div>
            <figure className="m-0 flex min-w-0 flex-[1_1_380px] flex-col gap-2">
              <Image
                src="https://images.unsplash.com/photo-1650526087824-163941841b52?fm=jpg&q=70&w=1200&auto=format&fit=crop"
                alt="Üzerinde renkli raptiyeler olan dünya haritası"
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 520px, 100vw"
                priority
                className="aspect-[3/2] w-full rounded-[10px] border border-border object-cover shadow-[0_18px_40px_rgb(11_79_46/0.14)]"
              />
              <figcaption className="text-xs text-muted">
                Fotoğraf:{" "}
                <a
                  href="https://unsplash.com/@lpbarreto?utm_source=ozelders&utm_medium=referral"
                  className="underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leandro Barreto
                </a>{" "}
                /{" "}
                <a
                  href="https://unsplash.com/photos/a-map-of-the-world-with-pins-on-it-nomAp6_KVXU?utm_source=ozelders&utm_medium=referral"
                  className="underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unsplash
                </a>
              </figcaption>
            </figure>
          </div>
          <SinifSeridi />
          <GununSorusuKarti havuz={gununSorusuHavuzu()} />
          <nav aria-label="Dersler" className="flex flex-wrap gap-2">
            {DERSLER.map(({ ders, gruplar }) => (
              <a
                key={ders}
                href={`#ders-${dersSlug(ders)}`}
                className="rounded-full bg-primary px-4 py-2 text-[15px] font-semibold text-primary-foreground no-underline hover:bg-primary-hover"
              >
                {ders}{" "}
                <span className="font-normal opacity-80">
                  · {gruplar.reduce((n, g) => n + g.oyunlar.length, 0)} konu
                </span>
              </a>
            ))}
            {YAKINDA_DERSLER.map((d) => (
              <span
                key={d}
                className="rounded-full border border-border bg-background/85 px-4 py-2 text-[15px] text-muted"
              >
                {d} <span className="text-sm">· yakında</span>
              </span>
            ))}
          </nav>
          {DERSLER.map(({ ders, gruplar }) => (
            <section
              key={ders}
              id={`ders-${dersSlug(ders)}`}
              className="flex scroll-mt-6 flex-col gap-10"
            >
              <h2 className="m-0 border-b-2 border-primary pb-2 font-serif text-[34px] font-bold">
                {ders}
              </h2>
              {gruplar.map((g) => (
                <section key={g.baslik} className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2">
                    <h3 className="m-0 font-serif text-2xl font-bold">
                      {g.baslik}
                    </h3>
                    {g.alt && (
                      <span className="text-[15px] text-muted">{g.alt}</span>
                    )}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {g.oyunlar.map((o) => (
                      <OyunKarti key={o.href} oyun={o} />
                    ))}
                  </div>
                </section>
              ))}
            </section>
          ))}
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-border bg-background/85 p-6 backdrop-blur-[2px]">
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-1">
              <h2 className="m-0 font-serif text-2xl font-bold">
                Öğretmen misin?
              </h2>
              <p className="m-0 text-[15px] leading-relaxed text-muted">
                Ücretsiz sınıf oluştur, bağlantıyı öğrencilerine gönder.
                Öğrenciler giriş yapmadan oynar; kim hangi konuda zorlanıyor,
                sen görürsün.
              </p>
            </div>
            <Link
              href="/siniflarim"
              className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground no-underline hover:bg-primary-hover"
            >
              Sınıf oluştur
            </Link>
          </section>
          <details className="text-sm text-muted">
            <summary className="cursor-pointer">Görseller</summary>
            <p className="m-0 mt-2 leading-relaxed">
              Fotoğraflar Unsplash lisansıyla kullanılmıştır:{" "}
              {KREDILER.map((k, i) => (
                <span key={k.byUrl}>
                  {i ? ", " : ""}
                  <a
                    href={`${k.byUrl}?utm_source=ozelders&utm_medium=referral`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    {k.by}
                  </a>
                </span>
              ))}{" "}
              /{" "}
              <a
                href="https://unsplash.com/?utm_source=ozelders&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                Unsplash
              </a>
              .
            </p>
          </details>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
