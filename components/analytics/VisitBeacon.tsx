"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 공개 페이지 방문 시 하루 1회 방문 로그를 남깁니다(/api/visit).
 * /admin 경로는 제외합니다.
 */
export default function VisitBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    void fetch("/api/visit", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => {});
  }, [pathname]);

  return null;
}
