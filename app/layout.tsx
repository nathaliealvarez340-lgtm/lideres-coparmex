import type { Metadata } from "next";
import { Geist, Geist_Mono, League_Gothic } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const leagueGothic = League_Gothic({
  variable: "--font-league-gothic",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mesa de Líderes COPARMEX",
  description:
    "Landing page de reclutamiento estudiantil para la Mesa de Líderes COPARMEX.",
  icons: {
    icon: "/icon.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${leagueGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
