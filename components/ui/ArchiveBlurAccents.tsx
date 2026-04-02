/** 히어로용 소프트 블루 블러 오브(비포커스·비스크린리더). */
export default function ArchiveBlurAccents() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -left-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl" />
      <div className="absolute -right-32 top-0 h-[22rem] w-[22rem] rounded-full bg-blue-100/55 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-56 w-[22rem] rounded-full bg-sky-100/35 blur-3xl" />
    </div>
  );
}
