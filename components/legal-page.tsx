import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { COMPANY, LEGAL_UPDATED, LEGAL_VERSION } from "@/lib/company";

export const LEGAL_LINKS = [
  { href: "/kvkk", label: "KVKK aydınlatma metni" },
  { href: "/iptal-iade", label: "İptal ve iade" },
  { href: "/mesafeli-satis", label: "Mesafeli satış sözleşmesi" },
  { href: "/ogretmen-sozlesmesi", label: "Öğretmen sözleşmesi" },
  { href: "/iletisim", label: "İletişim" },
];

const incomplete = [COMPANY.address, COMPANY.mersis, COMPANY.taxNo].some((v) => !v);

export function LegalPage({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-background">
        <div className="mx-auto flex w-full max-w-[1100px] flex-wrap gap-12 px-4 pt-12 pb-20 sm:px-6">
          <nav aria-label="Yasal metinler" className="flex min-w-0 flex-[0_1_220px] flex-col gap-1 text-[15px] max-md:order-2 max-md:flex-[1_1_100%] max-md:border-t max-md:border-border max-md:pt-6">
            <span className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-muted">Yasal metinler</span>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="rounded px-2 py-1.5 text-foreground hover:bg-primary-soft hover:text-primary">
                {l.label}
              </Link>
            ))}
          </nav>
          <article className="legal flex min-w-0 flex-[1_1_560px] flex-col gap-4 text-[16px] leading-relaxed text-[#2c3531]">
            <header className="flex flex-col gap-2 border-b border-border pb-5">
              <h1 className="m-0 font-serif text-[34px] leading-[1.15] font-bold text-foreground sm:text-[40px]">{title}</h1>
              {lead ? <p className="m-0 text-[17px] text-[#3d4743]">{lead}</p> : null}
              <p className="m-0 text-sm text-muted">
                Sürüm {LEGAL_VERSION} · son güncelleme {LEGAL_UPDATED}
              </p>
            </header>
            {incomplete ? (
              <p className="m-0 rounded-md bg-[#fff6e0] px-4 py-3 text-[15px] text-[#6b4e00]" role="note">
                Bu metin yayına hazırlık aşamasındadır; şirket bilgileri tamamlanacaktır.
              </p>
            ) : null}
            {children}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="m-0 mt-6 scroll-mt-4 text-xl font-semibold text-foreground">
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="m-0">{children}</p>;
}

export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 marker:text-primary">
      {items.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  );
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-border">
      <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
        <thead>
          <tr className="border-b border-border bg-[#f6f8f7]">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[#eef2ef] align-top last:border-0">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
