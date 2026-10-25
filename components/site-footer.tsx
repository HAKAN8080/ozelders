import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#111111] text-[#d6dbd8]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 py-12 text-[15px] sm:px-6">
        <span className="font-serif text-xl font-bold text-white">
          ÖzelDersBul{" "}
          <span className="font-sans text-sm font-normal text-[#a9b2ae]">· ozeldersbul.com.tr</span>
        </span>
        {/* İptal ve iade, KVKK ve İletişim sayfaları hazırlandıkça buraya eklenecek. */}
        <nav aria-label="Alt menü" className="flex flex-wrap gap-6">
          <Link href="/deneme" className="hover:text-white">Ücretsiz denemeler</Link>
          <Link href="/ogretmen-ol" className="hover:text-white">Öğretmen ol</Link>
          <Link href="/kayit" className="hover:text-white">Kayıt ol</Link>
          <Link href="/giris" className="hover:text-white">Giriş</Link>
        </nav>
        <span>© Thorius Eğitim ve Danışmanlık</span>
      </div>
    </footer>
  );
}
