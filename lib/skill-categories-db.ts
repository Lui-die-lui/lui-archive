import { SkillCategorySlug } from "@prisma/client";
import type { SkillCategory } from "@/data/skillCategories";
import { skillCategories as skillCategoryMeta } from "@/data/skillCategories";
import { prisma } from "@/lib/prisma";

export const SKILL_CATEGORY_PUBLIC_IDS = [
  "frontend",
  "backend",
  "data-state",
  "build-deploy",
] as const;

export type SkillCategoryPublicId = (typeof SKILL_CATEGORY_PUBLIC_IDS)[number];

const ID_TO_SLUG: Record<SkillCategoryPublicId, SkillCategorySlug> = {
  frontend: SkillCategorySlug.FRONTEND,
  backend: SkillCategorySlug.BACKEND,
  "data-state": SkillCategorySlug.DATA_STATE,
  "build-deploy": SkillCategorySlug.BUILD_DEPLOY,
};

export function isSkillCategoryPublicId(
  s: string,
): s is SkillCategoryPublicId {
  return (SKILL_CATEGORY_PUBLIC_IDS as readonly string[]).includes(s);
}

export function publicIdToPrismaSlug(id: SkillCategoryPublicId): SkillCategorySlug {
  return ID_TO_SLUG[id];
}

/** DB 행 + 고정 메타(이모지·제목) 병합. DB 오류 시 호출부에서 정적 데이터로 폴백. */
export async function getSkillCategoriesMerged(): Promise<SkillCategory[]> {
  const rows = await prisma.skillCategoryContent.findMany();
  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  return skillCategoryMeta.map((meta) => {
    if (!isSkillCategoryPublicId(meta.id)) return meta;
    const slug = publicIdToPrismaSlug(meta.id);
    const row = bySlug.get(slug);
    return {
      ...meta,
      techStack: row?.techStack ?? meta.techStack,
      description: row?.description ?? meta.description,
    };
  });
}
