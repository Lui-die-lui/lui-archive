"use client";

import SkillCategoryCard from "@/components/skills/SkillCategoryCard";
import { ctaPillGlassIconButtonSm } from "@/components/ui/ctaPill";
import type { SkillCategory } from "@/data/skillCategories";
import clsx from "clsx";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

type Props = {
  categories: SkillCategory[];
};

const SWIPE_PX = 48;
const SLIDE_GAP_PX = 12;
const MAX_SLIDE_PX = 304; /* ~19rem */

export default function SkillsMobileCarousel({ categories }: Props) {
  const n = categories.length;
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ vp: 0, slide: 0 });

  const goTo = useCallback(
    (i: number) => {
      setActive(Math.max(0, Math.min(n - 1, i)));
    },
    [n],
  );

  const goPrev = useCallback(() => {
    setActive((a) => Math.max(0, a - 1));
  }, []);

  const goNext = useCallback(() => {
    setActive((a) => Math.min(n - 1, a + 1));
  }, [n]);

  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const update = () => {
      const vpw = vp.clientWidth;
      if (vpw <= 0) return;
      const target = Math.min(MAX_SLIDE_PX, Math.floor(vpw * 0.86));
      const slide = Math.max(248, target);
      setLayout({ vp: vpw, slide });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [n]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx > SWIPE_PX) goPrev();
    else if (dx < -SWIPE_PX) goNext();
  };

  if (n === 0) return null;

  const { vp, slide } = layout;
  const step = slide + SLIDE_GAP_PX;
  const translateX =
    vp > 0 && slide > 0
      ? (vp - slide) / 2 - active * step
      : 0;

  return (
    <div className="md:hidden">
      <div
        className="relative mx-auto max-w-lg outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f0f7ff]"
        role="region"
        aria-roledescription="캐러셀"
        aria-label="기술 스택 카드. 좌우로 스와이프하거나 화살표 버튼을 사용할 수 있습니다."
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
          }
        }}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={active === 0}
          aria-label="이전 기술 카드"
          className={clsx(
            "absolute left-1 top-[42%] z-20 -translate-y-1/2",
            ctaPillGlassIconButtonSm,
          )}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={active === n - 1}
          aria-label="다음 기술 카드"
          className={clsx(
            "absolute right-1 top-[42%] z-20 -translate-y-1/2",
            ctaPillGlassIconButtonSm,
          )}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div
          className="touch-pan-y overflow-hidden px-11 py-3"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div ref={viewportRef} className="min-w-0 w-full">
            <div
              className="flex w-max gap-3 transition-[transform] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(${translateX}px)` }}
            >
              {categories.map((cat, i) => (
                <div
                  key={cat.id}
                  id={`skill-carousel-${cat.id}`}
                  role="group"
                  aria-roledescription="슬라이드"
                  aria-label={`${i + 1} / ${n}: ${cat.title}`}
                  aria-hidden={i !== active}
                  style={{ width: slide > 0 ? slide : undefined }}
                  className={clsx(
                    "min-w-[15.5rem] shrink-0 transition-[opacity,transform,filter] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                    i === active
                      ? "z-[1] scale-100 opacity-100"
                      : "z-0 scale-[0.97] opacity-[0.4]",
                  )}
                >
                  <div
                    className={clsx(
                      "overflow-hidden rounded-3xl transition-[box-shadow] duration-[320ms] ease-out motion-reduce:transition-none",
                      i === active
                        ? "shadow-[0_1px_4px_-1px_rgba(15,23,42,0.06),0_4px_16px_-8px_rgba(15,23,42,0.09)]"
                        : "shadow-none",
                    )}
                  >
                    <SkillCategoryCard category={cat} variant="carousel" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-5 flex justify-center px-4"
        aria-label="슬라이드 위치"
        role="tablist"
      >
        <span className="sr-only" aria-live="polite">
          {active + 1}번째 카드, 전체 {n}개
        </span>
        <div className="flex items-center justify-center gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              aria-label={`${cat.title} 카드로 이동 (${i + 1}번째)`}
              className={clsx(
                "h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
                i === active
                  ? "w-5 bg-zinc-600"
                  : "w-1.5 bg-zinc-300 hover:bg-zinc-400",
              )}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
