import ProjectCard from "@/components/projects/ProjectCard";
import SectionLabel from "@/components/ui/SectionLabel";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-b border-zinc-200/80 bg-[#fafbfd]"
    >
      <div className="site-container py-24 md:py-32">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <SectionLabel as="p" className="w-full text-center">
            Works
          </SectionLabel>
          <h2
            id="projects-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 md:mt-4 md:text-3xl"
          >
            Projects
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 md:text-[0.9375rem]">
            만들고 배우며 정리한 프로젝트입니다.
          </p>
        </div>

        <ul className="mt-12 flex flex-col gap-4 md:mt-14 md:grid md:grid-cols-3 md:gap-5">
          {projects.map((project) => (
            <li key={project.id} className="w-full md:w-auto">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
