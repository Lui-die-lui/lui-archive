import SkillCategoryCard from "@/components/skills/SkillCategoryCard";
import SkillsMobileCarousel from "@/components/skills/SkillsMobileCarousel";
import SectionIntroHeader from "@/components/ui/SectionIntroHeader";
import Reveal from "@/components/ui/Reveal";
import { skillCategories } from "@/data/skillCategories";
import { isAdminSession } from "@/lib/admin-auth";
import { getSkillCategoriesMerged } from "@/lib/skill-categories-db";

export default async function SkillsSection() {
  let categories = skillCategories;
  try {
    categories = await getSkillCategoriesMerged();
  } catch (e) {
    console.error("[skills] DB 로드 실패, 정적 데이터 사용", e);
  }

  const adminEditable = await isAdminSession();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
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
          <Reveal delayMs={260}>
            <SkillsMobileCarousel
              categories={categories}
              adminEditable={adminEditable}
            />
          </Reveal>

          <Reveal delayMs={360}>
            <ul className="mx-auto hidden w-full max-w-xl grid-cols-1 gap-6 md:grid md:gap-6 md:items-stretch lg:max-w-[42rem]">
              {categories.map((cat, i) => (
                <li key={cat.id} className="md:flex md:h-full md:min-h-0">
                  <Reveal
                    delayMs={i * 90}
                    className="h-full w-full"
                    threshold={0.25}
                  >
                    <SkillCategoryCard
                      category={cat}
                      variant="grid"
                      adminEditable={adminEditable}
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
