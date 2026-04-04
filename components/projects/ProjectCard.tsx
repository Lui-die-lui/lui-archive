import Image from "next/image";
import ProjectCardAdmin from "@/components/projects/ProjectCardAdmin";
import {
  MAX_TECH_VISIBLE,
  ProjectCardBadgeList,
  ThumbFallback,
} from "@/components/projects/project-card-shared";
import {
  projectCardLiveLink,
  projectCardReadmeLink,
} from "@/components/ui/ctaPill";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  adminEditable?: boolean;
  /** DB에 행이 있을 때만 수정·삭제 */
  canMutate?: boolean;
  /** 새 초안 카드에 한 번 자동으로 편집 모드 */
  autoEditOnce?: boolean;
  onAutoEditConsumed?: () => void;
  /** DB 저장 전 로컬 초안 */
  localDraft?: boolean;
  onEphemeralPersisted?: () => void;
  onEphemeralAbandoned?: () => void;
  onEphemeralHideOptimistic?: () => void;
  onEphemeralShowAgain?: () => void;
  onProjectSavedLocally?: (next: Project) => void;
  onReportEditing?: (active: boolean) => void;
};

export default function ProjectCard({
  project,
  adminEditable = false,
  canMutate = false,
  autoEditOnce = false,
  onAutoEditConsumed,
  localDraft = false,
  onEphemeralPersisted,
  onEphemeralAbandoned,
  onEphemeralHideOptimistic,
  onEphemeralShowAgain,
  onProjectSavedLocally,
  onReportEditing,
}: Props) {
  const techVisible = project.techTags.slice(0, MAX_TECH_VISIBLE);
  const techExtra = project.techTags.length - techVisible.length;

  return (
    <article className="group flex h-full w-full min-h-0 min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/55 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[box-shadow,border-color] duration-200 hover:border-zinc-200/90 hover:shadow-[0_8px_28px_-8px_rgba(15,23,42,0.08)]">
      {adminEditable && (canMutate || localDraft) ? (
        <ProjectCardAdmin
          project={project}
          canMutate={canMutate}
          autoEditOnce={autoEditOnce}
          onAutoEditConsumed={onAutoEditConsumed}
          localDraft={localDraft}
          onEphemeralPersisted={onEphemeralPersisted}
          onEphemeralAbandoned={onEphemeralAbandoned}
          onEphemeralHideOptimistic={onEphemeralHideOptimistic}
          onEphemeralShowAgain={onEphemeralShowAgain}
          onProjectSavedLocally={onProjectSavedLocally}
          onReportEditing={onReportEditing}
          summary={
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-zinc-600 md:mt-3 md:min-h-[4.75rem] md:text-sm md:leading-relaxed md:line-clamp-4">
              {project.summary}
            </p>
          }
          techList={
            <ul className="mt-3 mb-5 flex flex-wrap gap-1.5 md:mb-6">
              {techVisible.map((tag) => (
                <li key={tag}>
                  <span className="inline-block rounded-full border border-[#D7E4EE] bg-[#F4F8FB] px-2.5 py-0.5 text-[11px] font-normal leading-snug text-[#5E7486]">
                    {tag}
                  </span>
                </li>
              ))}
              {techExtra > 0 ? (
                <li>
                  <span className="inline-block rounded-full border border-dashed border-[#D7E4EE] bg-[#F4F8FB] px-2.5 py-0.5 text-[11px] font-normal leading-snug text-[#5E7486]/75">
                    +{techExtra}
                  </span>
                </li>
              ) : null}
            </ul>
          }
          footer={
            <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-zinc-100/90 pt-5 md:pt-6">
              <a
                href={project.readmeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={projectCardReadmeLink}
              >
                README
              </a>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={projectCardLiveLink}
                >
                  LIVE
                </a>
              ) : null}
            </div>
          }
        />
      ) : (
        <>
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100">
            <div
              className="pointer-events-none absolute inset-0 z-[1] ring-1 ring-inset ring-zinc-900/[0.04]"
              aria-hidden
            />
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} 대표 화면`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 88vw, 33vw"
              />
            ) : (
              <ThumbFallback projectId={project.id} title={project.title} />
            )}

            <ProjectCardBadgeList project={project} />
          </div>

          <div className="flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-x-hidden px-4 pb-4 pt-3.5 md:px-5 md:pb-5 md:pt-4">
            <h3 className="text-[0.9375rem] font-semibold uppercase tracking-[0.06em] text-zinc-900 md:text-base">
              {project.title}
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-zinc-600 md:mt-3 md:min-h-[4.75rem] md:text-sm md:leading-relaxed md:line-clamp-4">
              {project.summary}
            </p>

            <ul className="mt-3 mb-5 flex flex-wrap gap-1.5 md:mb-6">
              {techVisible.map((tag) => (
                <li key={tag}>
                  <span className="inline-block rounded-full border border-[#D7E4EE] bg-[#F4F8FB] px-2.5 py-0.5 text-[11px] font-normal leading-snug text-[#5E7486]">
                    {tag}
                  </span>
                </li>
              ))}
              {techExtra > 0 ? (
                <li>
                  <span className="inline-block rounded-full border border-dashed border-[#D7E4EE] bg-[#F4F8FB] px-2.5 py-0.5 text-[11px] font-normal leading-snug text-[#5E7486]/75">
                    +{techExtra}
                  </span>
                </li>
              ) : null}
            </ul>

            <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-zinc-100/90 pt-5 md:pt-6">
              <a
                href={project.readmeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={projectCardReadmeLink}
              >
                README
              </a>
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={projectCardLiveLink}
                >
                  LIVE
                </a>
              ) : null}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
