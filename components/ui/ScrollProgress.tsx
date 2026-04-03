"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0); // 0 ~ 1
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const hadHtmlNoScrollbar = html.classList.contains("no-scrollbar");
    const hadBodyNoScrollbar = body.classList.contains("no-scrollbar");

    // 메인 페이지에서만 기본 스크롤바 UI를 숨김(스크롤 기능은 유지).
    html.classList.add("no-scrollbar");
    body.classList.add("no-scrollbar");

    const computeAndSet = () => {
      const scrollTop = window.scrollY || html.scrollTop || body.scrollTop || 0;
      const docHeight = html.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
      setProgress(ratio);
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        computeAndSet();
      });
    };

    computeAndSet();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (!hadHtmlNoScrollbar) html.classList.remove("no-scrollbar");
      if (!hadBodyNoScrollbar) body.classList.remove("no-scrollbar");
    };
  }, []);

  const width = `${(progress * 100).toFixed(2)}%`;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[3px] w-full bg-[#7AAEDE]/25 backdrop-blur-sm"
      aria-hidden
    >
      <div
        className="h-full bg-[#7AAEDE] motion-safe:transition-[width] motion-reduce:transition-none"
        style={{ width }}
      />
    </div>
  );
}

