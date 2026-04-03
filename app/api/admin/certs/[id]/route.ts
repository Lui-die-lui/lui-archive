import { CertAvatarVariant } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { issuerAvatarLetter } from "@/lib/cert-issuer-avatar";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  }

  const existing = await prisma.certification.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    const j = await req.json();
    body = j && typeof j === "object" ? (j as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const title =
    typeof body.title === "string" ? body.title.trim() : undefined;
  const issuer =
    typeof body.issuer === "string" ? body.issuer.trim() : undefined;
  const issuedAtLabel =
    typeof body.issuedAtLabel === "string"
      ? body.issuedAtLabel.trim()
      : undefined;

  let url: string | null | undefined;
  if (body.url === null || body.url === "") url = null;
  else if (typeof body.url === "string") url = body.url.trim() || null;


  if (title !== undefined && !title) {
    return NextResponse.json({ error: "이름은 비울 수 없습니다." }, { status: 400 });
  }
  if (issuer !== undefined && !issuer) {
    return NextResponse.json({ error: "발행원은 비울 수 없습니다." }, { status: 400 });
  }
  if (issuedAtLabel !== undefined && !issuedAtLabel) {
    return NextResponse.json({ error: "날짜 표기는 비울 수 없습니다." }, { status: 400 });
  }

  const d: {
    title?: string;
    issuer?: string;
    issuedAtLabel?: string;
    url?: string | null;
    hasPublicLink?: boolean;
    avatarText?: string;
    avatarVariant?: CertAvatarVariant;
  } = {};
  if (title !== undefined) d.title = title;
  if (issuer !== undefined) {
    d.issuer = issuer;
    d.avatarText = issuerAvatarLetter(issuer);
    d.avatarVariant = CertAvatarVariant.HAN;
  }
  if (issuedAtLabel !== undefined) d.issuedAtLabel = issuedAtLabel;
  if (url !== undefined) {
    d.url = url;
    d.hasPublicLink = Boolean(url && url.trim());
  }

  if (Object.keys(d).length === 0) {
    return NextResponse.json({ error: "갱신할 필드가 없습니다." }, { status: 400 });
  }

  await prisma.certification.update({
    where: { id },
    data: d,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await ctx.params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  }

  const result = await prisma.certification.deleteMany({ where: { id } });
  if (result.count === 0) {
    return NextResponse.json({ error: "항목을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
