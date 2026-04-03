"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
  delayMs = 0,
  durationMs = 1050,
  initialOpacity = 0,
  offsetY = 8,
  // 조금만 걸려도 미리 트리거되도록(빈 화면 감도 감소)
  threshold = 0.07,
  // bottom을 +로 확장해서, 실제로 더 들어오기 전에 먼저 관찰 성공
  rootMargin = "0px 0px 18% 0px",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  durationMs?: number;
  initialOpacity?: number;
  offsetY?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasRevealed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setHasRevealed(true);
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasRevealed, once, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={[
        "transform-gpu transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none",
        className,
      ].join(" ")}
      style={{
        opacity: hasRevealed ? 1 : initialOpacity,
        transform: hasRevealed ? "translate3d(0,0,0)" : `translate3d(0, ${offsetY}px, 0)`,
        transitionDelay: `${delayMs}ms`,
        transitionDuration: `${durationMs}ms`,
      }}
    >
      {children}
    </div>
  );
}

