import React from "react";
import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/app/providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Capítulo José Barreto de Albuquerque N°512 | Ordem DeMolay",
  description:
    "Capítulo José Barreto de Albuquerque N°512 da Ordem DeMolay: história, quadro de lideranças, membros ativos e como fazer parte.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body className="font-sans flex min-h-screen flex-col antialiased">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Providers>
          <Header />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
