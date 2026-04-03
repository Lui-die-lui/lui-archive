import ProjectCard from "@/components/projects/ProjectCard";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="bg-[#fafbfd]"
    >
      <div className="site-container py-24 md:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Reveal delayMs={0}>
            <SectionLabel as="p" className="w-full text-center">
              Works
            </SectionLabel>
          </Reveal>
          <Reveal delayMs={90}>
            <h2
              id="projects-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 md:mt-3 md:text-2xl"
            >
              Projects
            </h2>
          </Reveal>
          <Reveal delayMs={180}>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 md:mt-2.5 md:text-sm">
              만들고 배우며 정리한 프로젝트입니다.
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 flex flex-col gap-4 md:mt-12 md:grid md:grid-cols-3 md:gap-5 md:items-stretch">
          {projects.map((project, i) => (
            <li key={project.id} className="w-full md:flex md:h-full md:w-auto">
              <Reveal delayMs={i * 90 + 220} threshold={0.25}>
                <ProjectCard project={project} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
