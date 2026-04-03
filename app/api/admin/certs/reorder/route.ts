import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

/**
 * `Certification.id`(cuid) 전체 순서를 한 번에 갱신합니다. `sortOrder`는 0 … n-1.
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
  const raw = o.orderedIds;
  if (!Array.isArray(raw) || !raw.every((x) => typeof x === "string")) {
    return NextResponse.json(
      { error: "orderedIds는 문자열 배열이어야 합니다." },
      { status: 400 },
    );
  }
  const orderedIds = raw as string[];

  const rows = await prisma.certification.findMany({ select: { id: true } });
  const dbSet = new Set(rows.map((r) => r.id));

  if (orderedIds.length !== dbSet.size) {
    return NextResponse.json(
      { error: "자격증 개수가 일치하지 않습니다." },
      { status: 400 },
    );
  }
  const seen = new Set<string>();
  for (const id of orderedIds) {
    if (!dbSet.has(id) || seen.has(id)) {
      return NextResponse.json(
        { error: "유효하지 않은 id가 포함되어 있습니다." },
        { status: 400 },
      );
    }
    seen.add(id);
  }

  await prisma.$transaction(
    orderedIds.map((id, sortOrder) =>
      prisma.certification.update({
        where: { id },
        data: { sortOrder },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
