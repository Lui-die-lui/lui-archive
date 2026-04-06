import SectionIntroHeader from "@/components/ui/SectionIntroHeader";

/**
 * `Suspense` fallback — DB 대기 중에도 #projects 영역 높이를 확보해 CLS 완화.
 * 본문 `ProjectsSection`과 동일 id·배경·헤더 카피·그리드 간격을 맞춤.
 */
export default function ProjectsSectionSkeleton() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      aria-busy="true"
      className="bg-[#fafbfd]"
    >
      <div className="site-container py-24 md:py-28">
        <SectionIntroHeader
          label="Works"
          titleId="projects-heading"
          title="Projects"
          description="만들고 배우며 정리한 프로젝트입니다."
        />

        <ul
          className="mt-12 flex min-w-0 flex-col gap-4 md:grid md:min-w-0 md:grid-cols-3 md:gap-5 md:items-stretch"
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="w-full min-w-0 md:flex md:h-full md:w-auto md:min-w-0"
            >
              <div className="flex h-full min-h-[26rem] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/55 bg-white md:min-h-[22rem] lg:min-h-[23rem]">
                <div className="aspect-[16/10] w-full shrink-0 bg-zinc-100" />
                <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3.5 md:px-5 md:pb-5 md:pt-4">
                  <div className="h-5 w-2/5 max-w-[10rem] rounded bg-zinc-100" />
                  <div className="mt-3 min-h-[5rem] space-y-2 md:mt-3 md:min-h-[4.75rem]">
                    <div className="h-3 w-full rounded bg-zinc-100/90" />
                    <div className="h-3 w-[92%] rounded bg-zinc-100/90" />
                    <div className="h-3 w-[78%] rounded bg-zinc-100/90 md:block" />
                    <div className="h-3 w-[65%] rounded bg-zinc-100/90 md:hidden" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5 md:mb-1">
                    <span className="h-6 w-14 rounded-full bg-zinc-50" />
                    <span className="h-6 w-20 rounded-full bg-zinc-50" />
                    <span className="h-6 w-16 rounded-full bg-zinc-50 md:hidden" />
                  </div>
                  <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-zinc-100/90 pt-5 md:pt-6">
                    <span className="h-8 w-[4.5rem] rounded-full bg-zinc-100" />
                    <span className="h-8 w-[3.25rem] rounded-full bg-zinc-100" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
