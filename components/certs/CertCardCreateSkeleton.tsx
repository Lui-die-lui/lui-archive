"use client";

/** `CertCard`의 `cardShell`과 동일한 외곽 */
const cardShell =
  "flex h-full w-full min-h-0 items-stretch gap-4 rounded-2xl border border-[#D7E4EE]/90 bg-[#F4F8FB]/95 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:gap-4 md:p-4";

const pulse = "motion-safe:animate-pulse rounded-md bg-zinc-200/75";

/**
 * 자격증 카드와 비슷한 가로 레이아웃 — 신규 POST 중 표시.
 */
export default function CertCardCreateSkeleton() {
  return (
    <div
      className={`${cardShell} cursor-default`}
      role="status"
      aria-busy="true"
      aria-label="자격증 저장 중"
    >
      <div className="flex w-12 shrink-0 items-center justify-center self-stretch md:w-11">
        <div
          className={`h-12 w-12 shrink-0 rounded-full md:h-11 md:w-11 ${pulse}`}
          aria-hidden
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-2 py-0.5">
        <div className="flex items-center justify-between gap-3">
          <div className={`h-5 flex-1 max-w-[14rem] ${pulse}`} />
          <div className={`h-5 w-16 shrink-0 rounded-md ${pulse}`} />
        </div>
        <div className={`h-3.5 w-[min(100%,18rem)] ${pulse}`} />
      </div>
      <span className="sr-only">자격증을 저장하는 중입니다.</span>
    </div>
  );
}
