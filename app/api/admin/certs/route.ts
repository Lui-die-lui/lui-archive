import { CertAvatarVariant } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { issuerAvatarLetter } from "@/lib/cert-issuer-avatar";
import { prisma } from "@/lib/prisma";

/**
 * 자격증 행 생성. 응답 `{ ok: true, id }` — `id`는 `Certification.id`(cuid).
 */
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    const j = await req.json();
    body = j && typeof j === "object" ? (j as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : "새 자격증";
  const issuer =
    typeof body.issuer === "string" && body.issuer.trim()
      ? body.issuer.trim()
      : "발행처";
  const issuedAtLabel =
    typeof body.issuedAtLabel === "string" && body.issuedAtLabel.trim()
      ? body.issuedAtLabel.trim()
      : "Jan 2026";

  let url: string | null = null;
  if (typeof body.url === "string" && body.url.trim()) url = body.url.trim();

  const hasPublicLink = Boolean(url);
  const avatarText = issuerAvatarLetter(issuer);
  const avatarVariant = CertAvatarVariant.HAN;

  const agg = await prisma.certification.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (agg._max.sortOrder ?? 0) + 1;

  const created = await prisma.certification.create({
    data: {
      title,
      issuer,
      issuedAtLabel,
      url,
      hasPublicLink,
      avatarText,
      avatarVariant,
      sortOrder,
    },
  });

  return NextResponse.json({ ok: true, id: created.id });
}
