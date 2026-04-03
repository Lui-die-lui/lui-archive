import AdminSkillCategoryEdit from "@/components/skills/AdminSkillCategoryEdit";
import type { SkillCategory } from "@/data/skillCategories";

type Props = {
  category: SkillCategory;
  /** 캐러셀 슬라이드(모바일 전용) vs 그리드(데스크톱) */
  variant?: "grid" | "carousel";
  /** 관리자 세션일 때 카드 안에서 인라인 수정 */
  adminEditable?: boolean;
};

/** 데스크톱 그리드: 참고안과 같이 왼쪽 정렬·넉넉한 좌우 패딩·본문 블록 세로 중앙 */
const cardShellGrid =
  "rounded-3xl border border-zinc-200/70 bg-white text-left shadow-[0_8px_32px_-8px_rgba(15,23,42,0.08),0_2px_8px_-2px_rgba(15,23,42,0.05)]";

/** 캐러셀: 래퍼가 그림자 담당 · 본문은 얕은 그림자 + absolute 장식을 radius에 맞추기 위해 overflow-hidden */
const cardShellCarousel =
  "overflow-hidden rounded-3xl border border-zinc-200/70 bg-white text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)]";

export default function SkillCategoryCard({
  category,
  variant = "grid",
  adminEditable = false,
}: Props) {
  if (variant === "grid") {
    const title = (
      <h3
        className={`text-lg font-bold tracking-tight text-zinc-900 md:text-xl ${adminEditable ? "pr-11" : ""}`}
      >
        <span aria-hidden className="mr-1.5">
          {category.emoji}
        </span>
        {category.title}
      </h3>
    );

    return (
      <article
        className={`relative flex h-full min-h-0 w-full flex-col justify-center px-6 py-8 md:px-12 md:py-10 ${cardShellGrid}`}
      >
        {adminEditable ? (
          <AdminSkillCategoryEdit category={category} variant="grid">
            {title}
          </AdminSkillCategoryEdit>
        ) : (
          <>
            {title}
            <p className="mt-2 text-sm font-medium leading-snug text-zinc-600 md:mt-2 md:text-[0.9375rem] md:leading-snug">
              {category.techStack}
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-zinc-500 md:mt-3 md:text-base md:leading-relaxed">
              {category.description}
            </p>
          </>
        )}
      </article>
    );
  }

  const header = (
    <header className="relative flex flex-col items-center gap-2">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f1fb]/95 text-[1.3rem] leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-sky-200/35">
        <span aria-hidden>{category.emoji}</span>
      </div>
      <h3 className="text-[1.0625rem] font-bold tracking-[-0.02em] text-zinc-900">
        {category.title}
      </h3>
    </header>
  );

  const divider = (
    <div
      className="relative mx-auto my-3.5 h-px w-[min(100%,10.5rem)] shrink-0 bg-zinc-200/85"
      aria-hidden
    />
  );

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

      {adminEditable ? (
        <AdminSkillCategoryEdit category={category} variant="carousel">
          {header}
          {divider}
        </AdminSkillCategoryEdit>
      ) : (
        <>
          {header}
          {divider}
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
        </>
      )}
    </article>
  );
}
