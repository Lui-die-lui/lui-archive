import ArchiveBlurAccents from "@/components/ui/ArchiveBlurAccents";
import {
  ctaPillGlassContactButton,
  ctaPillSocialBase,
} from "@/components/ui/ctaPill";
import { contact } from "@/data/contact";

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative box-border flex min-h-dvh flex-col overflow-hidden border-b border-zinc-200/60 bg-[#fafbfd] pt-[calc(3rem+2.25rem)] md:pt-[3.25rem]"
    >
      <ArchiveBlurAccents />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="site-container flex min-h-0 flex-1 flex-col">
          {/* 내비 아래·히어로 상단 우측: 와이어와 동일한 캡슐 버튼 */}
          <div
            className="mt-[10px] flex shrink-0 items-center justify-end gap-2 pt-1 pb-3 md:pt-0 md:pb-4"
            aria-label="소셜 링크"
          >
            <a
              href={contact.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaPillSocialBase} hover:bg-[#238636] hover:shadow-md`}
            >
              github
            </a>
            <a
              href={contact.velog.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaPillSocialBase} hover:bg-[#20C997] hover:shadow-md`}
            >
              velog
            </a>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-center py-6 md:py-8 lg:py-10">
            <div className="min-w-0 max-w-2xl text-left">
              <p className="text-[0.8125rem] font-normal leading-relaxed text-zinc-500 md:text-sm">
                Fullstack junior dev with a design-driven mind.
              </p>

              <h1
                id="hero-heading"
                className="mt-4 text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.98] tracking-tight text-zinc-900 md:mt-5"
              >
                <span className="block">Lui</span>
                <span className="block">Archive</span>
              </h1>

              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-zinc-600 md:mt-8 md:text-base">
                사용자의 흐름을 설계하고, <br /> 화면과 기능을 함께 연결하는 것을
                추구합니다.
              </p>


              <div className="mt-8 md:mt-10">
                <a
                  href="#footer"
                  className={`${ctaPillGlassContactButton}`}
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-center pb-6 pt-6 md:pb-8 md:pt-8">
            <a
              href="#about"
              className="group flex flex-col items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-500"
              aria-label="다음 섹션으로 스크롤"
            >
              <span
                className="text-[0.5625rem] font-medium uppercase tracking-[0.3em] [writing-mode:vertical-rl]"
                style={{ textOrientation: "mixed" }}
              >
                scroll
              </span>
              <svg
                className="h-5 w-3.5 text-zinc-400 motion-safe:animate-scroll-hint"
                viewBox="0 0 14 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <linearGradient
                    id="hero-scroll-arrow"
                    x1="7"
                    y1="2"
                    x2="7"
                    y2="20"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="currentColor" stopOpacity="0.25" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
                <path
                  d="M7 3v12M3 13l4 4 4-4"
                  stroke="url(#hero-scroll-arrow)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
