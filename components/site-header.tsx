import Link from "next/link";
import { Suspense } from "react";

import { getSessionProfile } from "@/lib/auth";

const navLinks = [
  { href: "/deneme", label: "Ücretsiz Denemeler" },
  { href: "/oyunlar", label: "Oyunlar" },
  { href: "/#nasil", label: "Nasıl Çalışır" },
  { href: "/#paketler", label: "Paketler" },
  { href: "/#ogretmenler", label: "Öğretmenlerimiz" },
  { href: "/ogretmen-ol", label: "Öğretmen ol" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-foreground no-underline">
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-md bg-primary font-serif text-xl font-bold text-primary-foreground"
      >
        ∑
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-serif text-[22px] font-bold">ÖzelDersBul</span>
        <span className="text-xs font-medium tracking-wide text-muted">
          bir Thorius girişimi
        </span>
      </span>
    </Link>
  );
}

function GuestActions() {
  return (
    <>
      <Link href="/giris" className="px-2 py-3 text-base font-medium text-foreground">
        Giriş
      </Link>
      <Link
        href="/kayit"
        className="rounded-md bg-primary px-5 py-3 text-base font-semibold text-primary-foreground hover:bg-primary-hover"
      >
        Kayıt ol
      </Link>
    </>
  );
}

async function AuthActions() {
  const session = await getSessionProfile();
  if (!session.userId) {
    return <GuestActions />;
  }
  const role = session.profile?.role;
  const isAdmin = role === "admin";
  return (
    <Link
      href={isAdmin ? "/admin" : role === "ogretmen" ? "/ogretmen" : "/panel"}
      className="rounded-md bg-primary px-5 py-3 text-base font-semibold text-primary-foreground hover:bg-primary-hover"
    >
      {isAdmin ? "Yönetim" : "Hesabım"}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo />

        <nav aria-label="Ana menü" className="hidden items-center gap-7 text-base font-medium lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-foreground hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Suspense fallback={<GuestActions />}>
            <AuthActions />
          </Suspense>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-md border border-border [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Menüyü aç</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <div className="absolute right-0 z-20 mt-2 flex w-64 flex-col gap-1 rounded-lg border border-border bg-background p-3 shadow-lg">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-md px-3 py-3 text-base font-medium hover:bg-primary-soft">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3 sm:hidden">
              <Suspense fallback={<GuestActions />}>
                <AuthActions />
              </Suspense>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
