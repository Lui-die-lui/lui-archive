import SkillCategoryCard from "@/components/skills/SkillCategoryCard";
import SkillsMobileCarousel from "@/components/skills/SkillsMobileCarousel";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { skillCategories } from "@/data/skillCategories";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-b border-zinc-200/80 bg-[#f0f7ff]"
    >
      <div className="site-container flex flex-col items-center py-24 text-center md:py-28">
        <Reveal delayMs={0}>
          <SectionLabel as="p" className="w-full text-center">
            Skills
          </SectionLabel>
        </Reveal>

        <Reveal delayMs={90}>
          <h2
            id="skills-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 md:mt-3 md:text-2xl"
          >
            기술 스택
          </h2>
        </Reveal>

        <Reveal delayMs={180}>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
            기능 구현 흐름을 직접 경험하며 쌓은 스택입니다.
          </p>
        </Reveal>

        <div className="mt-12 w-full md:mt-12">
          <Reveal delayMs={260}>
            <SkillsMobileCarousel categories={skillCategories} />
          </Reveal>

          <Reveal delayMs={360}>
            <ul className="mx-auto hidden w-full max-w-xl grid-cols-1 gap-6 md:grid md:gap-6 md:items-stretch lg:max-w-[42rem]">
              {skillCategories.map((cat, i) => (
                <li key={cat.id} className="md:flex md:h-full md:min-h-0">
                  <Reveal
                    delayMs={i * 90}
                    className="h-full w-full"
                    threshold={0.25}
                  >
                    <SkillCategoryCard category={cat} variant="grid" />
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
