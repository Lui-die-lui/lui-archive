"use client";

import { siteNavItems } from "@/data/siteNav";
import { useCallback, useEffect, useId, useRef, useState } from "react";

/** 방명록과 같은 높이·글라스 느낌, 테두리 없음 */
const menuTriggerClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.28] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-md backdrop-saturate-150 transition-[background-color,box-shadow,color] hover:bg-white/[0.38] hover:text-zinc-900 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_8px_rgba(15,23,42,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

/** 헤더 바로 아래 전폭 아코디언 — 불투명 글라스 */
const accordionPanelClass =
  "fixed left-0 right-0 top-12 z-[55] border-t border-[#D7E4EE]/90 bg-[#F4F8FB]/94 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_12px_24px_-12px_rgba(15,23,42,0.08)] backdrop-blur-2xl backdrop-saturate-150 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-out md:hidden";

export default function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div ref={wrapRef} className="relative md:hidden">
      <button
        type="button"
        className={menuTriggerClass}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "메뉴 닫기" : "섹션 메뉴 열기"}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          {open ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <path d="M4 8h16" />
              <path d="M4 12h16" />
              <path d="M4 16h16" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="페이지 섹션"
          className={accordionPanelClass}
        >
          <div className="site-container max-h-[min(70vh,24rem)] overflow-y-auto py-1">
            <ul className="divide-y divide-[#D7E4EE]/80">
              {siteNavItems.map((item) => (
                <li key={item.href} role="none">
                  <a
                    role="menuitem"
                    href={item.href}
                    className="block py-3.5 text-base font-medium tracking-tight text-zinc-800 transition-colors hover:bg-white/45 active:bg-white/55 sm:py-4 sm:text-[1.0625rem]"
                    onClick={close}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
