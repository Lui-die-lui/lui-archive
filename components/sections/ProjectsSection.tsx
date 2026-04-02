import Image from "next/image";
import { projects } from "@/data/projects";

function ProjectImagePlaceholder({ accent }: { accent: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${accent} text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/90`}
      aria-hidden
    >
      Preview
    </div>
  );
}

const placeholderAccents: Record<string, string> = {
  omijoy: "from-sky-400/90 to-blue-500/80",
  "odyssey-plan": "from-indigo-400/85 to-violet-500/75",
  muzin: "from-cyan-400/85 to-teal-500/80",
};

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-b border-zinc-200/80 bg-white"
    >
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <h2
          id="projects-heading"
          className="mb-12 text-lg font-medium tracking-tight text-zinc-900"
        >
          Projects
        </h2>

        <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:thin] md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:snap-none [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-200">
          {projects.map((project) => (
            <li
              key={project.id}
              className="w-[min(100%,calc(100vw-3rem))] max-w-sm shrink-0 snap-center md:w-auto md:max-w-none md:snap-align-none"
            >
              <article className="flex h-full min-h-[26rem] flex-col overflow-hidden rounded-lg border border-zinc-200/90 bg-white/90 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                <div className="relative aspect-[5/3] w-full shrink-0 overflow-hidden bg-zinc-100">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`${project.title} 프로젝트 이미지`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 85vw, 33vw"
                    />
                  ) : (
                    <ProjectImagePlaceholder
                      accent={
                        placeholderAccents[project.id] ??
                        "from-zinc-300 to-zinc-400"
                      }
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-medium text-zinc-900">
                    {project.title}
                  </h3>

                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {project.statusChips.map((chip) => (
                      <li key={chip}>
                        <span className="inline-block rounded border border-zinc-200/90 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                          {chip}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600">
                    {project.summary}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.techTags.map((tag) => (
                      <li key={tag}>
                        <span className="text-xs text-zinc-500">{tag}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
                    <a
                      href={project.readmeUrl}
                      className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:border-zinc-400"
                    >
                      README
                    </a>
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        className="inline-flex items-center justify-center rounded-md border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
                      >
                        LIVE
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
