import type {
  GuestbookBubbleColor as PrismaBubbleColor,
  GuestbookEntry as GuestbookRow,
} from "@prisma/client";
import type {
  AuthorType,
  GuestbookBubbleColor,
  GuestbookEntry,
} from "@/data/guestbook";

const prismaBubbleToApp: Record<PrismaBubbleColor, GuestbookBubbleColor> = {
  LAVENDER: "lavender",
  MINT: "mint",
  PEACH: "peach",
  SKY: "sky",
  ROSE: "rose",
};

const appBubbleToPrisma: Record<GuestbookBubbleColor, PrismaBubbleColor> = {
  lavender: "LAVENDER",
  mint: "MINT",
  peach: "PEACH",
  sky: "SKY",
  rose: "ROSE",
};

export function guestbookRowToEntry(row: GuestbookRow): GuestbookEntry {
  const authorType: AuthorType =
    row.authorType === "ADMIN" ? "admin" : "guest";

  let bubbleColor: GuestbookBubbleColor | null = null;
  if (authorType === "guest" && row.bubbleColor) {
    bubbleColor = prismaBubbleToApp[row.bubbleColor];
  }

  return {
    id: row.id,
    authorType,
    nickname: row.nickname,
    message: row.message,
    bubbleColor,
    createdAt: row.createdAt.toISOString(),
  };
}

export function appBubbleToPrismaEnum(
  color: GuestbookBubbleColor,
): PrismaBubbleColor {
  return appBubbleToPrisma[color];
}
