import type { SkillCategory } from "@/data/skillCategories";

type Props = {
  category: SkillCategory;
  /** 캐러셀 슬라이드(모바일 전용) vs 그리드(데스크톱) */
  variant?: "grid" | "carousel";
};

const cardShell =
  "rounded-3xl border border-zinc-200/70 bg-white text-center shadow-[0_8px_32px_-8px_rgba(15,23,42,0.1),0_2px_8px_-2px_rgba(15,23,42,0.06)]";

/** 캐러셀: 래퍼가 그림자 담당 · 본문은 얕은 그림자 + absolute 장식을 radius에 맞추기 위해 overflow-hidden */
const cardShellCarousel =
  "overflow-hidden rounded-3xl border border-zinc-200/70 bg-white text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)]";

export default function SkillCategoryCard({
  category,
  variant = "grid",
}: Props) {
  if (variant === "grid") {
    return (
      <article
        className={`flex h-full flex-col px-8 py-8 md:px-10 md:py-8 ${cardShell}`}
      >
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 md:text-xl">
          <span aria-hidden className="mr-1.5">
            {category.emoji}
          </span>
          {category.title}
        </h3>
        <p className="mt-4 text-sm font-medium leading-relaxed text-zinc-600 md:mt-5 md:text-[0.9375rem]">
          {category.techStack}
        </p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-zinc-500 md:mt-5 md:text-base md:leading-7">
          {category.description}
        </p>
      </article>
    );
  }

  return (
    <article
      className={`relative flex min-h-[14.25rem] flex-col px-5 pb-5 pt-5 ${cardShellCarousel}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-white via-white/70 to-transparent"
      />

      <header className="relative flex flex-col items-center gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f1fb]/95 text-[1.3rem] leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-sky-200/35">
          <span aria-hidden>{category.emoji}</span>
        </div>
        <h3 className="text-[1.0625rem] font-bold tracking-[-0.02em] text-zinc-900">
          {category.title}
        </h3>
      </header>

      <div
        className="relative mx-auto my-3.5 h-px w-[min(100%,10.5rem)] shrink-0 bg-zinc-200/85"
        aria-hidden
      />

      <section
        aria-label="사용 기술"
        className="relative mx-auto w-full max-w-[17.25rem] rounded-xl border border-zinc-200/55 bg-zinc-50/85 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
      >
        <p className="text-center text-[0.8125rem] font-medium leading-snug tracking-[-0.012em] text-zinc-600">
          {category.techStack}
        </p>
      </section>

      <p className="relative mx-auto mt-3.5 max-w-[15.5rem] text-center text-[0.8125rem] font-normal leading-[1.62] tracking-[-0.01em] text-zinc-500">
        {category.description}
      </p>
    </article>
  );
}
