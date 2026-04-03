import { NextResponse } from "next/server";
import { GuestbookAuthorType } from "@prisma/client";
import type { GuestbookBubbleColor } from "@/data/guestbook";
import { isAdminSession } from "@/lib/admin-auth";
import {
  appBubbleToPrismaEnum,
  guestbookRowToEntry,
} from "@/lib/guestbook-db";
import { ADMIN_GUESTBOOK_NICKNAME } from "@/lib/guestbook-constants";
import { prisma } from "@/lib/prisma";

const MAX_MESSAGE = 200;
const MAX_NICKNAME = 20;

const ALLOWED_BUBBLES = new Set<GuestbookBubbleColor>([
  "lavender",
  "mint",
  "peach",
  "sky",
  "rose",
]);

export async function GET() {
  try {
    const [settings, rows] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
      prisma.guestbookEntry.findMany({
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const submissionsOpen = settings?.guestbookSubmissionsOpen ?? true;

    return NextResponse.json({
      entries: rows.map(guestbookRowToEntry),
      submissionsOpen,
    });
  } catch (e) {
    console.error("[guestbook GET]", e);
    return NextResponse.json(
      { error: "방명록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const postingAsAdmin = await isAdminSession();

    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });
    const open = settings?.guestbookSubmissionsOpen ?? true;
    if (!open && !postingAsAdmin) {
      return NextResponse.json(
        { error: "지금은 새 글을 받지 않습니다." },
        { status: 403 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const { nickname, message, bubbleColor } = body as Record<
      string,
      unknown
    >;

    const trimmedMsg =
      typeof message === "string" ? message.trim().slice(0, MAX_MESSAGE) : "";
    if (!trimmedMsg) {
      return NextResponse.json(
        { error: "메시지를 입력해 주세요." },
        { status: 400 },
      );
    }

    if (postingAsAdmin) {
      const row = await prisma.guestbookEntry.create({
        data: {
          authorType: GuestbookAuthorType.ADMIN,
          nickname: ADMIN_GUESTBOOK_NICKNAME,
          message: trimmedMsg,
          bubbleColor: null,
        },
      });
      return NextResponse.json({ entry: guestbookRowToEntry(row) });
    }

    const trimmedNick =
      typeof nickname === "string"
        ? nickname.trim().slice(0, MAX_NICKNAME)
        : "";
    const displayNick = trimmedNick || "guest";

    if (
      typeof bubbleColor !== "string" ||
      !ALLOWED_BUBBLES.has(bubbleColor as GuestbookBubbleColor)
    ) {
      return NextResponse.json(
        { error: "유효하지 않은 색상입니다." },
        { status: 400 },
      );
    }

    const row = await prisma.guestbookEntry.create({
      data: {
        authorType: GuestbookAuthorType.GUEST,
        nickname: displayNick,
        message: trimmedMsg,
        bubbleColor: appBubbleToPrismaEnum(bubbleColor as GuestbookBubbleColor),
      },
    });

    return NextResponse.json({ entry: guestbookRowToEntry(row) });
  } catch (e) {
    console.error("[guestbook POST]", e);
    return NextResponse.json(
      { error: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}

/** 관리자만 — `{ deleteAll: true }` 또는 `{ ids: string[] }` */
export async function DELETE(req: Request) {
  try {
    if (!(await isAdminSession())) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const { deleteAll, ids } = body as {
      deleteAll?: unknown;
      ids?: unknown;
    };

    if (deleteAll === true) {
      const result = await prisma.guestbookEntry.deleteMany({});
      return NextResponse.json({ ok: true, deletedCount: result.count });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "삭제할 id 배열이 필요합니다." },
        { status: 400 },
      );
    }

    const stringIds = ids.filter(
      (id): id is string => typeof id === "string" && id.length > 0,
    );
    if (stringIds.length === 0) {
      return NextResponse.json(
        { error: "유효한 id가 없습니다." },
        { status: 400 },
      );
    }

    const result = await prisma.guestbookEntry.deleteMany({
      where: { id: { in: stringIds } },
    });

    return NextResponse.json({ ok: true, deletedCount: result.count });
  } catch (e) {
    console.error("[guestbook DELETE]", e);
    return NextResponse.json(
      { error: "삭제하지 못했습니다." },
      { status: 500 },
    );
  }
}
