export type AuthorType = "admin" | "guest";

/** 게스트 말풍선 색상 키(작성 시 선택) */
export type GuestbookBubbleColor = "lavender" | "mint" | "peach" | "sky" | "rose";

export type GuestbookEntry = {
  id: string;
  authorType: AuthorType;
  nickname: string;
  message: string;
  /** admin 은 고정 스타일을 쓰므로 `null` */
  bubbleColor: GuestbookBubbleColor | null;
  /** ISO 8601 문자열 */
  createdAt: string;
};

/** 게스트가 선택 가능한 파스텔 팔레트(표시 라벨 + Tailwind 클래스) */
export const guestBubblePalette: {
  id: GuestbookBubbleColor;
  label: string;
  bubbleClass: string;
  /** 색상 스와치(원형 버튼)용 배경 */
  swatchClass: string;
}[] = [
  {
    id: "lavender",
    label: "라벤더",
    bubbleClass:
      "border border-violet-200/70 bg-violet-100/90 text-violet-950",
    swatchClass: "bg-violet-200",
  },
  {
    id: "mint",
    label: "민트",
    bubbleClass:
      "border border-emerald-200/70 bg-emerald-100/90 text-emerald-950",
    swatchClass: "bg-emerald-200",
  },
  {
    id: "peach",
    label: "피치",
    bubbleClass:
      "border border-orange-200/70 bg-orange-100/90 text-orange-950",
    swatchClass: "bg-orange-200",
  },
  {
    id: "sky",
    label: "스카이",
    bubbleClass: "border border-sky-200/70 bg-sky-100/90 text-sky-950",
    swatchClass: "bg-sky-200",
  },
  {
    id: "rose",
    label: "로즈",
    bubbleClass: "border border-rose-200/70 bg-rose-100/90 text-rose-950",
    swatchClass: "bg-rose-200",
  },
];

/** 관리자 말풍선 — 고정 톤 */
export const adminBubbleClass =
  "border border-zinc-300/60 bg-zinc-200/90 text-zinc-900";

export function getGuestBubbleClass(
  color: GuestbookBubbleColor | null,
): string {
  if (!color) return adminBubbleClass;
  return (
    guestBubblePalette.find((p) => p.id === color)?.bubbleClass ??
    "border border-zinc-200/80 bg-white text-zinc-900"
  );
}

export const guestbookEntries: GuestbookEntry[] = [
  {
    id: "gb-1",
    authorType: "admin",
    nickname: "Lui",
    message:
      "방명록에 남겨 주신 글은 아카이브에 차곡차곡 쌓입니다. 스팸·광고성 내용은 정리될 수 있어요.",
    bubbleColor: null,
    createdAt: "2026-03-01T01:00:00.000Z",
  },
  {
    id: "gb-2",
    authorType: "guest",
    nickname: "dayvisitor",
    message: "깔끔한 구성이네요. 응원합니다!",
    bubbleColor: "sky",
    createdAt: "2026-03-05T08:42:00.000Z",
  },
  {
    id: "gb-3",
    authorType: "guest",
    nickname: "mute",
    message: "프로젝트 카드 스크롤이 모바일에서 보기 편했어요.",
    bubbleColor: "mint",
    createdAt: "2026-03-12T11:15:00.000Z",
  },
  {
    id: "gb-4",
    authorType: "admin",
    nickname: "Lui",
    message: "좋은 말씀 감사합니다. 기록해 두었어요.",
    bubbleColor: null,
    createdAt: "2026-03-12T18:30:00.000Z",
  },
  {
    id: "gb-5",
    authorType: "guest",
    nickname: "echo",
    message: "다음 업데이트도 기대할게요.",
    bubbleColor: "lavender",
    createdAt: "2026-03-20T09:05:00.000Z",
  },
];
