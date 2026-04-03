import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

/**
 * 홈에 노출되는 전체 프로젝트 `publicId` 순서를 한 번에 갱신합니다.
 * `sortOrder`는 0 … n-1 로 맞춥니다.
 */
export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const o = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const raw = o.orderedPublicIds;
  if (!Array.isArray(raw) || !raw.every((x) => typeof x === "string")) {
    return NextResponse.json(
      { error: "orderedPublicIds는 문자열 배열이어야 합니다." },
      { status: 400 },
    );
  }
  const orderedPublicIds = raw as string[];

  const rows = await prisma.project.findMany({ select: { publicId: true } });
  const dbSet = new Set(rows.map((r) => r.publicId));

  if (orderedPublicIds.length !== dbSet.size) {
    return NextResponse.json(
      { error: "프로젝트 개수가 일치하지 않습니다." },
      { status: 400 },
    );
  }
  const seen = new Set<string>();
  for (const id of orderedPublicIds) {
    if (!dbSet.has(id) || seen.has(id)) {
      return NextResponse.json(
        { error: "유효하지 않은 publicId가 포함되어 있습니다." },
        { status: 400 },
      );
    }
    seen.add(id);
  }

  await prisma.$transaction(
    orderedPublicIds.map((publicId, sortOrder) =>
      prisma.project.update({
        where: { publicId },
        data: { sortOrder },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
