import Link from "next/link";

export function AdminShell({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f6f8f7]">
      <header className="bg-[#111111] text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/admin" className="font-serif text-lg font-bold text-white no-underline">
              Özel Ders · Thorius <span className="font-sans text-sm font-medium text-[#a9b2ae]">yönetim</span>
            </Link>
            <nav aria-label="Yönetim menüsü" className="flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
              <Link href="/admin" className="text-[#d6dbd8] hover:text-white">Genel bakış</Link>
              <Link href="/admin/sinavlar" className="text-[#d6dbd8] hover:text-white">Sınavlar</Link>
              <Link href="/admin/ogretmenler" className="text-[#d6dbd8] hover:text-white">Öğretmenler</Link>
              <Link href="/admin/mini-gruplar" className="text-[#d6dbd8] hover:text-white">Mini gruplar</Link>
            </nav>
          </div>
          <Link href="/" className="text-[15px] text-[#d6dbd8] hover:text-white">Siteye dön →</Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="m-0 font-serif text-3xl font-bold sm:text-4xl">{title}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
