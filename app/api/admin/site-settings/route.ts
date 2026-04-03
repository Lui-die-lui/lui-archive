import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const open =
    body &&
    typeof body === "object" &&
    typeof (body as { guestbookSubmissionsOpen?: unknown })
      .guestbookSubmissionsOpen === "boolean"
      ? (body as { guestbookSubmissionsOpen: boolean }).guestbookSubmissionsOpen
      : undefined;

  if (typeof open !== "boolean") {
    return NextResponse.json(
      { error: "guestbookSubmissionsOpen(boolean)이 필요합니다." },
      { status: 400 },
    );
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, guestbookSubmissionsOpen: open },
    update: { guestbookSubmissionsOpen: open },
  });

  return NextResponse.json({ ok: true, guestbookSubmissionsOpen: open });
}
