"use client";

import { useLayoutEffect } from "react";

/**
 * 로드·클라이언트 전환 직후 URL 해시(`#about` 등)에 맞춤.
 * - 페인트 전에 맞추려고 `useLayoutEffect` 사용
 * - `behavior: "instant"` — 같은 타이밍에 `smooth`를 쓰면 잠깐 상단이 보였다가 밀리는 느낌(흔들림)이 남
 * - 메인 페이지 안에서 같은 문서의 `#` 링크로 이동할 때의 부드러운 스크롤은 `globals.css`의 `html { scroll-behavior: smooth }`가 담당
 */
export default function ScrollToHash() {
  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const id = hash.slice(1);
    let attempts = 0;

    const tick = () => {
      const el = document.getElementById(id);
      if (!el) {
        attempts += 1;
        if (attempts <= 6) window.setTimeout(tick, 50);
        return;
      }

      el.scrollIntoView({ behavior: "instant", block: "start" });
    };

    tick();
  }, []);

  return null;
}
