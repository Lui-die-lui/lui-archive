"use client";

import type { ButtonHTMLAttributes } from "react";

/** 2×3 점 — 드래그 핸들 전용( dnd-kit listeners 연결 ) */
export default function ProjectDragGrip(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      type="button"
      className="pointer-events-auto flex touch-none cursor-grab items-center justify-center rounded-md border border-zinc-200/90 bg-white/92 p-1.5 shadow-sm backdrop-blur-sm transition-[border-color,background-color,box-shadow] hover:border-zinc-300 hover:bg-white active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-400/50"
      aria-label="드래그하여 순서 변경"
      title="순서 변경"
      {...props}
    >
      <span className="grid grid-cols-2 gap-0.5" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className="h-[3px] w-[3px] rounded-full bg-zinc-500"
          />
        ))}
      </span>
    </button>
  );
}
