import SectionIntroHeader from "@/components/ui/SectionIntroHeader";

const gridCardShell =
  "rounded-3xl border border-zinc-200/70 bg-white shadow-[0_8px_32px_-8px_rgba(15,23,42,0.08),0_2px_8px_-2px_rgba(15,23,42,0.05)]";

/**
 * `Suspense` fallback — #skills 영역 높이 선점으로 CLS 완화.
 * 모바일: 캐러셀 1장 분량 / 데스크톱: 4행 그리드(기본 카테고리 수)와 동일 레이아웃 클래스.
 */
export default function SkillsSectionSkeleton() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      aria-busy="true"
      className="border-b border-zinc-200/80 bg-[#f0f7ff]"
    >
      <div className="site-container flex flex-col items-center py-24 text-center md:py-28">
        <SectionIntroHeader
          label="Skills"
          titleId="skills-heading"
          title="기술 스택"
          description="기능 구현 흐름을 직접 경험하며 쌓은 스택입니다."
        />

        <div className="mt-12 w-full">
          {/* 모바일: 캐러셀 뷰포트 + 도트 높이에 맞춤 */}
          <div className="relative md:hidden" aria-hidden>
            <div className="touch-pan-y overflow-hidden px-11 py-3">
              <div className="mx-auto w-full max-w-[19rem]">
                <div
                  className={`flex min-h-[14.25rem] flex-col px-5 pb-5 pt-5 ${gridCardShell}`}
                >
                  <div className="mx-auto h-11 w-11 rounded-full bg-zinc-100" />
                  <div className="mx-auto mt-2 h-5 w-28 rounded bg-zinc-100" />
                  <div className="mx-auto my-3.5 h-px w-[min(100%,10.5rem)] bg-zinc-100" />
                  <div className="mx-auto mt-1 w-full max-w-[17.25rem] rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2.5">
                    <div className="mx-auto h-3 w-[90%] rounded bg-zinc-100" />
                    <div className="mx-auto mt-2 h-3 w-[70%] rounded bg-zinc-100" />
                  </div>
                  <div className="mx-auto mt-3.5 space-y-2 px-2">
                    <div className="mx-auto h-3 w-full max-w-[15.5rem] rounded bg-zinc-100/90" />
                    <div className="mx-auto h-3 w-[88%] max-w-[15.5rem] rounded bg-zinc-100/90" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2 px-4">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full bg-zinc-200 ${i === 0 ? "w-5" : "w-1.5"}`}
                />
              ))}
            </div>
          </div>

          <ul
            className="mx-auto hidden w-full max-w-xl grid-cols-1 gap-6 md:grid md:gap-6 md:items-stretch lg:max-w-[42rem]"
            aria-hidden
          >
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="md:flex md:h-full md:min-h-0">
                <div
                  className={`flex min-h-[13.5rem] w-full flex-col justify-center px-6 py-8 md:min-h-[14rem] md:px-12 md:py-10 ${gridCardShell}`}
                >
                  <div className="h-6 w-40 rounded bg-zinc-100" />
                  <div className="mt-2 h-4 w-full max-w-md rounded bg-zinc-100/90" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3.5 w-full rounded bg-zinc-50" />
                    <div className="h-3.5 w-[94%] rounded bg-zinc-50" />
                    <div className="h-3.5 w-[88%] rounded bg-zinc-50" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
