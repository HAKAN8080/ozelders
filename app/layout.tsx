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
  title: "Özel Ders · Thorius — 3.–12. sınıf özel ders: okul dersleri, LGS ve YKS",
  description:
    "3.–12. sınıf: konuları ücretsiz oyunlarla pekiştir, ücretsiz denemelerle kendini test et, eksiklerin için seçilmiş bir öğretmenle birebir çalış. Okul dersleri, LGS ve YKS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
