import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { EVENT } from "@/lib/content";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://convite.heringfotografia.com.br"),
  title: EVENT.title,
  description: `Convite para os ${EVENT.age} anos de ${EVENT.guestName} — ${EVENT.dateLabel}, ${EVENT.venueName}.`,
  openGraph: {
    title: EVENT.title,
    description: `Você está convidado(a)! ${EVENT.dateLabel} · ${EVENT.venueName}`,
    images: ["/photos/alessandra-4.jpg"],
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2f3b30",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
