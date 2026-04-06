import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import VisitBeacon from "@/components/analytics/VisitBeacon";
import AppHeader from "@/components/layout/AppHeader";
import { getSiteOrigin } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** 링크 공유(OG/Twitter)용 썸네일 — Firebase Storage 공개 URL */
const OG_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/lui-archive.firebasestorage.app/o/portfolio%2F%EC%8D%B8%EB%84%A4%EC%9D%BC.png?alt=media&token=cccb7615-36ec-43ce-b070-6408c82ce40e";

const siteOrigin = getSiteOrigin();
const defaultTitle = "Lui Archive";
const defaultDescription =
  "Lui의 아카이브 — 포트폴리오, 기술 스택, 프로젝트, 방명록.";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: defaultTitle,
    template: "%s · Lui Archive",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteOrigin,
    siteName: defaultTitle,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Lui Archive 썸네일",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [OG_IMAGE_URL],
  },
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
