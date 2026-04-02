import { skillCategories } from "@/data/skillCategories";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-b border-zinc-200/80 bg-[#fafbfd]"
    >
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <h2
          id="skills-heading"
          className="mb-12 text-lg font-medium tracking-tight text-zinc-900"
        >
          기술 스택
        </h2>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {skillCategories.map((cat) => (
            <li key={cat.id}>
              <article className="h-full rounded-lg border border-zinc-200/90 bg-white/90 px-6 py-6 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                <h3 className="text-base font-medium text-zinc-900">
                  {cat.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {cat.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
