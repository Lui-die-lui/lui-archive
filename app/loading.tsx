import ArchiveBlurAccents from "@/components/ui/ArchiveBlurAccents";

export default function Loading() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#fafbfd]">
      {/* 히어로와 동일한 blob 무드 재사용 (존재감은 유지, 콘텐츠보다 뒤 레이어) */}
      <ArchiveBlurAccents />

      {/* 중앙 콘텐츠 가독성용 소프트 레이어 */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.72),rgba(255,255,255,0.38)_48%,rgba(255,255,255,0.18)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 flex w-full max-w-xs flex-col items-center px-6">
        <p className="text-[2rem] font-semibold tracking-tight text-zinc-900 md:text-[2.25rem]">
          Lui Arc.
        </p>
        <div className="mt-4 h-[2px] w-32 overflow-hidden rounded-full bg-sky-100/80">
          <span className="block h-full w-full rounded-full bg-sky-300 animate-intro-loading-fill" />
        </div>
        <p className="mt-2 text-xs text-zinc-500">Loading...</p>
      </div>
    </main>
  );
}

