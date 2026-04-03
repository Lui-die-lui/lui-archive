import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  isSkillCategoryPublicId,
  publicIdToPrismaSlug,
} from "@/lib/skill-categories-db";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { slug } = await ctx.params;
  if (!isSkillCategoryPublicId(slug)) {
    return NextResponse.json({ error: "알 수 없는 카테고리입니다." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const o = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const techStack = typeof o.techStack === "string" ? o.techStack.trim() : "";
  const description = typeof o.description === "string" ? o.description.trim() : "";

  if (!techStack || !description) {
    return NextResponse.json(
      { error: "techStack·description은 비어 있지 않은 문자열이어야 합니다." },
      { status: 400 },
    );
  }

  const prismaSlug = publicIdToPrismaSlug(slug);

  await prisma.skillCategoryContent.upsert({
    where: { slug: prismaSlug },
    create: { slug: prismaSlug, techStack, description },
    update: { techStack, description },
  });

  return NextResponse.json({ ok: true });
}
