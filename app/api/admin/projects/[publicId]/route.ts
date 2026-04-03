import { ProjectKindTag } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const KIND_SET = new Set<string>(Object.values(ProjectKindTag));

function parseKindTags(raw: unknown): ProjectKindTag[] | undefined {
  if (raw === undefined) return undefined;
  if (!Array.isArray(raw)) return undefined;
  const next = [
    ...new Set(
      raw.filter(
        (x): x is ProjectKindTag =>
          typeof x === "string" && KIND_SET.has(x),
      ),
    ),
  ];
  return next;
}

function parseTechTags(raw: unknown): string[] | undefined {
  if (raw === undefined) return undefined;
  if (!Array.isArray(raw)) return undefined;
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const t = x.trim();
    if (!t) continue;
    if (t.length > 120) {
      return undefined;
    }
    out.push(t);
  }
  return out.slice(0, 40);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ publicId: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { publicId } = await ctx.params;
  if (!publicId?.trim()) {
    return NextResponse.json({ error: "publicId가 필요합니다." }, { status: 400 });
  }

  const existing = await prisma.project.findUnique({
    where: { publicId },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const o = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const title = typeof o.title === "string" ? o.title.trim() : undefined;
  const summary = typeof o.summary === "string" ? o.summary.trim() : undefined;
  const readmeUrl = typeof o.readmeUrl === "string" ? o.readmeUrl.trim() : undefined;

  let deployUrl: string | null | undefined;
  if (o.deployUrl === null || o.deployUrl === "") deployUrl = null;
  else if (typeof o.deployUrl === "string") deployUrl = o.deployUrl.trim() || null;

  let thumbnailUrl: string | null | undefined;
  if (o.thumbnailUrl === null || o.thumbnailUrl === "") thumbnailUrl = null;
  else if (typeof o.thumbnailUrl === "string") thumbnailUrl = o.thumbnailUrl.trim() || null;

  const kindTags = parseKindTags(o.kindTags);
  const techTags = parseTechTags(o.techTags);
  if (techTags === undefined && o.techTags !== undefined && !Array.isArray(o.techTags)) {
    return NextResponse.json({ error: "techTags 형식이 올바르지 않습니다." }, { status: 400 });
  }
  if (kindTags === undefined && o.kindTags !== undefined && !Array.isArray(o.kindTags)) {
    return NextResponse.json({ error: "kindTags 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (title !== undefined && !title) {
    return NextResponse.json({ error: "title은 비울 수 없습니다." }, { status: 400 });
  }
  if (summary !== undefined && !summary) {
    return NextResponse.json({ error: "summary는 비울 수 없습니다." }, { status: 400 });
  }
  if (readmeUrl !== undefined && !readmeUrl) {
    return NextResponse.json({ error: "readmeUrl은 비울 수 없습니다." }, { status: 400 });
  }

  const data: Record<string, string | null> = {};
  if (title !== undefined) data.title = title;
  if (summary !== undefined) data.summary = summary;
  if (readmeUrl !== undefined) data.readmeUrl = readmeUrl;
  if (deployUrl !== undefined) data.deployUrl = deployUrl;
  if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl;

  const hasScalar = Object.keys(data).length > 0;
  const hasKind = kindTags !== undefined;
  const hasTech = techTags !== undefined;

  if (!hasScalar && !hasKind && !hasTech) {
    return NextResponse.json({ error: "갱신할 필드가 없습니다." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    if (hasScalar) {
      await tx.project.update({
        where: { publicId },
        data,
      });
    }

    if (hasKind) {
      await tx.projectTagOnProject.deleteMany({
        where: { projectId: existing.id },
      });
      if (kindTags.length > 0) {
        await tx.projectTagOnProject.createMany({
          data: kindTags.map((tag) => ({
            projectId: existing.id,
            tag,
          })),
        });
      }
    }

    if (hasTech) {
      await tx.projectTechLine.deleteMany({
        where: { projectId: existing.id },
      });
      if (techTags.length > 0) {
        await tx.projectTechLine.createMany({
          data: techTags.map((label, sortOrder) => ({
            projectId: existing.id,
            label,
            sortOrder,
          })),
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ publicId: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { publicId } = await ctx.params;
  if (!publicId?.trim()) {
    return NextResponse.json({ error: "publicId가 필요합니다." }, { status: 400 });
  }

  const result = await prisma.project.deleteMany({ where: { publicId } });
  if (result.count === 0) {
    return NextResponse.json({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
