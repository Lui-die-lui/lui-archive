"use client";

const bar = "motion-safe:animate-pulse rounded-md bg-zinc-200/75";

/**
 * 관리자 프로젝트 카드와 동일한 뼈대(16:10 썸네일 + 본문 + 푸터 슬롯) — 신규 POST 중 표시.
 */
export default function ProjectCardCreateSkeleton() {
  return (
    <div
      className="flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden"
      role="status"
      aria-busy="true"
      aria-label="프로젝트 저장 중"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100">
        <div
          className="pointer-events-none absolute inset-0 z-[1] ring-1 ring-inset ring-zinc-900/[0.04]"
          aria-hidden
        />
        <div className={`absolute inset-[6%] ${bar}`} aria-hidden />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pb-4 pt-3.5 md:px-5 md:pb-5 md:pt-4">
        <div className={`h-5 w-[55%] max-w-[12rem] ${bar}`} />
        <div className="mt-3 min-h-[4.75rem] space-y-2 md:min-h-[4.75rem]">
          <div className={`h-3 w-full ${bar}`} />
          <div className={`h-3 w-[94%] ${bar}`} />
          <div className={`h-3 w-[72%] ${bar}`} />
        </div>
        <div className="mt-3 mb-5 flex flex-wrap gap-1.5 md:mb-6">
          <div className={`h-6 w-16 rounded-full ${bar}`} />
          <div className={`h-6 w-14 rounded-full ${bar}`} />
          <div className={`h-6 w-20 rounded-full ${bar}`} />
        </div>
        <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-zinc-100/90 pt-5 md:pt-6">
          <div className={`h-8 w-[4.5rem] rounded-full ${bar}`} />
          <div className={`h-8 w-[4.5rem] rounded-full ${bar}`} />
        </div>
      </div>
      <span className="sr-only">프로젝트를 저장하는 중입니다.</span>
    </div>
  );
}
