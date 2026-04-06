import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import VisitBeacon from "@/components/analytics/VisitBeacon";
import AppHeader from "@/components/layout/AppHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lui Archive",
  description: "Lui's Archive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-zinc-900">
        <AppHeader />
        <VisitBeacon />
        {children}
      </body>
    </html>
  );
}
