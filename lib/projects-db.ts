import { type Prisma, ProjectKindTag } from "@prisma/client";
import type { Project } from "@/data/projects";
import { projects as staticProjects } from "@/data/projects";
import { prisma } from "@/lib/prisma";

const TAG_LABELS: Record<ProjectKindTag, string> = {
  [ProjectKindTag.TEAM]: "Team",
  [ProjectKindTag.PERSONAL]: "Personal",
  [ProjectKindTag.IN_PROGRESS]: "In Progress",
};

const projectInclude = {
  techLines: { orderBy: { sortOrder: "asc" as const } },
  tagLinks: true,
} as const;

type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: typeof projectInclude;
}>;

function mapRow(p: ProjectWithRelations): Project {
  return {
    id: p.publicId,
    title: p.title,
    summary: p.summary,
    statusChips: p.tagLinks.map((t) => TAG_LABELS[t.tag]),
    image: p.thumbnailUrl,
    techTags: p.techLines.map((l) => l.label),
    readmeUrl: p.readmeUrl,
    liveUrl: p.deployUrl?.trim() ? p.deployUrl : undefined,
  };
}

export type ProjectsHomePayload = {
  projects: Project[];
  /** 관리자 수정·삭제 API 대상( DB 행이 있는 publicId ) */
  persistedPublicIds: Set<string>;
};

/** 홈 Projects 섹션용. DB 비어 있거나 오류 시 정적 목록. */
export async function getProjectsForHome(): Promise<ProjectsHomePayload> {
  try {
    const rows = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
      include: projectInclude,
    });
    if (rows.length === 0) {
      return { projects: staticProjects, persistedPublicIds: new Set() };
    }
    return {
      projects: rows.map(mapRow),
      persistedPublicIds: new Set(rows.map((r) => r.publicId)),
    };
  } catch (e) {
    console.error("[projects] DB 로드 실패, 정적 데이터 사용", e);
    return { projects: staticProjects, persistedPublicIds: new Set() };
  }
}
