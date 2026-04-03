"use client";

import { useEffect } from "react";
import ArchiveBlurAccents from "@/components/ui/ArchiveBlurAccents";

/**
 * 문서 스크롤을 막고 뷰포트 안에서만 레이아웃.
 * 배경·블러 악센트는 패딩 밖 전체 높이에 깔아 fixed navbar의 backdrop-blur가
 * 단색 body가 아닌 그라데이션/블롭을 비추게 함.
 */
export default function GuestbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  return (
    <div className="relative box-border flex h-dvh max-h-dvh flex-col overflow-hidden bg-[linear-gradient(180deg,#f4faff_0%,#f7fcff_42%,#fafbfd_100%)]">
      <ArchiveBlurAccents />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden pt-12 md:pt-[3.25rem]">
        {children}
      </div>
    </div>
  );
}
