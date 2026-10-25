import type { Metadata } from "next";

// Fontlar projeye gömülü (Google'a istek gitmez). Türkçe karakterler latin-ext'te.
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-ext-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-ext-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-ext-600.css";
import "@fontsource/source-serif-4/latin-600.css";
import "@fontsource/source-serif-4/latin-ext-600.css";
import "@fontsource/source-serif-4/latin-700.css";
import "@fontsource/source-serif-4/latin-ext-700.css";
import "@fontsource/caveat/latin-500.css";
import "@fontsource/caveat/latin-ext-500.css";
import "@fontsource/caveat/latin-700.css";
import "@fontsource/caveat/latin-ext-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ÖzelDersBul — LGS, YKS ve okul dersleri için özel ders",
  description:
    "Ücretsiz LGS ve YKS denemelerini çöz, eksik konularını gör, o konularda seçilmiş bir öğretmenle birebir çalış. 5–12. sınıf.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
