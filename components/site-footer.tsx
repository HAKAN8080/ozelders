import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#111111] text-[#d6dbd8]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 py-12 text-[15px] sm:px-6">
        <span className="font-serif text-xl font-bold text-white">
          Özel Ders · Thorius{" "}
          <span className="font-sans text-sm font-normal text-[#a9b2ae]">· ozelders.thorius.com.tr</span>
        </span>
        <nav aria-label="Alt menü" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/deneme" className="hover:text-white">Ücretsiz denemeler</Link>
          <Link href="/oyunlar" className="hover:text-white">Oyunlar</Link>
          <Link href="/siniflarim" className="hover:text-white">Sınıf modu</Link>
          <Link href="/ogretmen-ol" className="hover:text-white">Öğretmen ol</Link>
          <Link href="/iptal-iade" className="hover:text-white">İptal ve iade</Link>
          <Link href="/mesafeli-satis" className="hover:text-white">Mesafeli satış</Link>
          <Link href="/kvkk" className="hover:text-white">KVKK</Link>
          <Link href="/iletisim" className="hover:text-white">İletişim</Link>
        </nav>
        <span className="w-full border-t border-white/10 pt-5 text-sm text-[#a9b2ae]">
          <strong className="font-semibold text-[#d6dbd8]">Thorius Eğitim ve Danışmanlık Ltd. Şti.</strong> güvencesiyle
        </span>
      </div>
    </footer>
  );
}
