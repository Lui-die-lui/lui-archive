"use client";

import { AiOutlinePlus } from "react-icons/ai";

const plusCircle =
  "pointer-events-none flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/65 bg-white/45 text-zinc-500/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-[3px] md:h-9 md:w-9";

type GhostProps = {
  disabled?: boolean;
  onClick: () => void;
};

/** 모바일: 수료·자격 카드와 비슷한 높이의 가로형 유령 버튼 */
export function AdminNewProjectGhostMobile({
  disabled,
  onClick,
}: GhostProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full min-w-0 items-center justify-center gap-4 rounded-2xl border border-dashed border-[#D7E4EE]/90 bg-[#F4F8FB]/35 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,background-color,box-shadow] hover:border-[#C5D4E2] hover:bg-[#EEF4F9]/80 disabled:pointer-events-none disabled:opacity-45"
      aria-label="새 프로젝트 추가"
    >
      <span className={plusCircle} aria-hidden>
        <AiOutlinePlus
          className="h-[0.95rem] w-[0.95rem] md:h-4 md:w-4"
          strokeWidth={1.65}
        />
      </span>
    </button>
  );
}

/**
 * 데스크톱: 프로젝트 카드와 동일한 셀 높이(`md:flex md:h-full`) 안에서
 * 본문 전체를 채우고 중앙에 플러스.
 */
export function AdminNewProjectGhostDesktop({
  disabled,
  onClick,
}: GhostProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group flex h-full w-full min-h-0 min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-dashed border-zinc-300/75 bg-zinc-50/50 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,background-color,box-shadow] hover:border-zinc-400/55 hover:bg-zinc-50/90 disabled:pointer-events-none disabled:opacity-45"
      aria-label="새 프로젝트 추가"
    >
      <div className="flex min-h-[12rem] flex-1 flex-col items-center justify-center gap-3 px-4 py-10 md:min-h-0">
        <span className={plusCircle} aria-hidden>
          <AiOutlinePlus
            className="h-[0.95rem] w-[0.95rem] md:h-4 md:w-4"
            strokeWidth={1.65}
          />
        </span>
        <span className="text-center text-[11px] font-medium tracking-wide text-zinc-500">
          새 프로젝트
        </span>
      </div>
    </button>
  );
}
