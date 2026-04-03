import SkillCategoryCard from "@/components/skills/SkillCategoryCard";
import SkillsMobileCarousel from "@/components/skills/SkillsMobileCarousel";
import SectionLabel from "@/components/ui/SectionLabel";
import { skillCategories } from "@/data/skillCategories";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-b border-zinc-200/80 bg-[#f0f7ff]"
    >
      <div className="site-container flex flex-col items-center py-24 text-center md:py-32">
        <SectionLabel as="p" className="w-full text-center">
          Skills
        </SectionLabel>
        <h2
          id="skills-heading"
          className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 md:mt-4 md:text-3xl"
        >
          기술 스택
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
          기능 구현 흐름을 직접 경험하며 쌓은 스택입니다.
        </p>

        <div className="mt-12 w-full md:mt-14">
          <SkillsMobileCarousel categories={skillCategories} />

          <ul className="mx-auto hidden w-full max-w-xl grid-cols-1 gap-6 md:grid md:gap-8 lg:max-w-2xl">
            {skillCategories.map((cat) => (
              <li key={cat.id}>
                <SkillCategoryCard category={cat} variant="grid" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
