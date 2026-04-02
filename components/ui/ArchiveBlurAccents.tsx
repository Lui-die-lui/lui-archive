/** 히어로용 소프트 블루 블러 — 스카이/블루 톤, 존재감 있게 불투명도·크기 상향 + 느린 드리프트 */
export default function ArchiveBlurAccents() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="archive-blob archive-blob-1 absolute -left-20 top-[22%] h-[32rem] w-[32rem] rounded-full bg-sky-200/58 blur-3xl sm:-left-16" />
      <div className="archive-blob archive-blob-2 absolute -right-24 top-[-5%] h-[26rem] w-[26rem] rounded-full bg-blue-100/72 blur-3xl sm:-right-20" />
      <div className="archive-blob archive-blob-3 absolute bottom-[-10%] left-[28%] h-64 w-[26rem] rounded-full bg-sky-100/52 blur-3xl md:left-1/3" />
      <div className="archive-blob archive-blob-4 absolute bottom-[0%] right-[-12%] h-56 w-[22rem] rounded-full bg-sky-200/46 blur-3xl sm:right-[-6%] md:bottom-[4%] md:right-[-4%] md:h-64 md:w-[26rem]" />
    </div>
  );
}
