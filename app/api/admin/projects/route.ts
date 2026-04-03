import { ProjectKindTag } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const KIND_SET = new Set<string>(Object.values(ProjectKindTag));

function parseKindTags(raw: unknown): ProjectKindTag[] | undefined {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) return undefined;
  return [
    ...new Set(
      raw.filter(
        (x): x is ProjectKindTag =>
          typeof x === "string" && KIND_SET.has(x),
      ),
    ),
  ];
}

function parseTechTags(raw: unknown): string[] | undefined {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) return undefined;
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const t = x.trim();
    if (!t) continue;
    if (t.length > 120) return undefined;
    out.push(t);
  }
  return out.slice(0, 40);
}

function slugifyPublicId(input: string): string {
  const s = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s || "project";
}

/**
 * 최소 필드로 프로젝트 행을 만들고 `publicId`를 반환합니다.
 * 관리자 UI에서 즉시 수정 화면을 열 때 사용합니다.
 */
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown> = {};
  try {
    const j = await req.json();
    if (j && typeof j === "object") body = j as Record<string, unknown>;
  } catch {
    /* 빈 본문 허용 */
  }

  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : "새 프로젝트";
  const summary =
    typeof body.summary === "string" && body.summary.trim()
      ? body.summary.trim()
      : "요약을 입력하세요.";
  const readmeUrl =
    typeof body.readmeUrl === "string" && body.readmeUrl.trim()
      ? body.readmeUrl.trim()
      : "https://github.com/";

  let deployUrl: string | null = null;
  if (typeof body.deployUrl === "string" && body.deployUrl.trim()) {
    deployUrl = body.deployUrl.trim();
  }

  let thumbnailUrl: string | null = null;
  if (typeof body.thumbnailUrl === "string" && body.thumbnailUrl.trim()) {
    thumbnailUrl = body.thumbnailUrl.trim();
  }

  const kindTags = parseKindTags(body.kindTags);
  const techTags = parseTechTags(body.techTags);
  if (kindTags === undefined) {
    return NextResponse.json(
      { error: "kindTags 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }
  if (techTags === undefined) {
    return NextResponse.json(
      { error: "techTags 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const baseSlug = slugifyPublicId(title);
  let publicId = baseSlug;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop -- 충돌 시에만 반복
  while (await prisma.project.findUnique({ where: { publicId } })) {
    publicId = `${baseSlug}-${n}`;
    n += 1;
  }

  const agg = await prisma.project.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (agg._max.sortOrder ?? 0) + 1;

  const created = await prisma.$transaction(async (tx) => {
    const p = await tx.project.create({
      data: {
        publicId,
        title,
        summary,
        readmeUrl,
        deployUrl,
        thumbnailUrl,
        sortOrder,
      },
    });
    if (kindTags.length > 0) {
      await tx.projectTagOnProject.createMany({
        data: kindTags.map((tag) => ({ projectId: p.id, tag })),
      });
    }
    if (techTags.length > 0) {
      await tx.projectTechLine.createMany({
        data: techTags.map((label, i) => ({
          projectId: p.id,
          label,
          sortOrder: i,
        })),
      });
    }
    return p;
  });

  return NextResponse.json({ ok: true, publicId: created.publicId });
}
