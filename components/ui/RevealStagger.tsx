"use client";

import { Children, useEffect, useRef, useState } from "react";

export default function RevealStagger({
  children,
  staggerMs = 90,
  delayMs = 0,
  threshold = 0.15,
  rootMargin = "0px 0px -15% 0px",
  once = true,
  className = "",
}: {
  children: React.ReactNode;
  staggerMs?: number;
  delayMs?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
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

  const items = Children.toArray(children);

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <div
          // 자식이 여러 노드여도 안정적으로 stagger 적용
          key={i}
          style={{ transitionDelay: `${delayMs + i * staggerMs}ms` }}
          className={[
            "opacity-0 translate-y-2",
            "motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none",
            hasRevealed ? "opacity-100 translate-y-0" : "",
            "transform-gpu transition-[opacity,transform] duration-[1050ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          ].join(" ")}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

