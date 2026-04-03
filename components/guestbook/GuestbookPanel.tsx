"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  adminBubbleClass,
  getGuestBubbleClass,
  guestBubblePalette,
  type GuestbookBubbleColor,
  type GuestbookEntry,
} from "@/data/guestbook";

function formatArchivedTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  initialEntries: GuestbookEntry[];
};

export default function GuestbookPanel({ initialEntries }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [selectedColor, setSelectedColor] =
    useState<GuestbookBubbleColor>("sky");

  const sorted = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [entries],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedNick = nickname.trim() || "guest";
    const trimmedMsg = message.trim();
    if (!trimmedMsg) return;

    const next: GuestbookEntry = {
      id: `gb-local-${Date.now()}`,
      authorType: "guest",
      nickname: trimmedNick,
      message: trimmedMsg,
      bubbleColor: selectedColor,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, next]);
    setMessage("");
  }

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-200/90 bg-white/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="space-y-4 p-4 md:p-5">
        <div
          className="max-h-[min(28rem,55vh)] overflow-y-auto rounded-xl border border-zinc-200/80 bg-zinc-50/40 px-4 py-4"
          role="log"
          aria-label="방명록 기록"
        >
          <div className="mx-auto w-full max-w-[30rem] space-y-4">
            {sorted.map((entry) => {
              const isAdmin = entry.authorType === "admin";
              const bubbleClass = isAdmin
                ? adminBubbleClass
                : getGuestBubbleClass(entry.bubbleColor);

              return (
                <div
                  key={entry.id}
                  className={`flex w-full ${
                    isAdmin ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[min(100%,20rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm md:max-w-[22rem] md:px-3 md:py-2 md:text-[0.8125rem] md:leading-relaxed ${bubbleClass}`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-xs font-semibold tracking-tight opacity-90">
                        {entry.nickname}
                      </span>
                      <span
                        className="font-mono text-[10px] font-normal opacity-60"
                        title={entry.createdAt}
                      >
                        {formatArchivedTime(entry.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap">
                      {entry.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-200/80 bg-white/95 p-4 md:p-5"
          aria-label="방명록 남기기"
        >
          <p className="mb-3 text-xs text-zinc-500 md:mb-2.5 md:text-[0.6875rem]">
            기록만 남기는 공간입니다. 실시간 채팅이 아니에요.
          </p>
          <div className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="gb-nickname">
              닉네임
            </label>
            <input
              id="gb-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              maxLength={32}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 md:py-1.5 md:text-xs"
            />
            <label className="sr-only" htmlFor="gb-message">
              메시지
            </label>
            <textarea
              id="gb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 남겨 주세요"
              rows={3}
              maxLength={500}
              className="resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 md:py-1.5 md:text-xs"
            />
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400 md:mb-1.5 md:text-[10px]">
                말풍선 색
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="말풍선 색 선택"
              >
                {guestBubblePalette.map((opt) => {
                  const selected = selectedColor === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedColor(opt.id)}
                      title={opt.label}
                      aria-pressed={selected}
                      className={`h-8 w-8 rounded-full border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 ${
                        selected
                          ? "border-zinc-700 ring-2 ring-zinc-300 ring-offset-1"
                          : "border-white ring-1 ring-zinc-200"
                      } ${opt.swatchClass}`}
                    />
                  );
                })}
              </div>
            </div>
            <button
              type="submit"
              className="self-start rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-400 md:px-3 md:py-1.5 md:text-xs"
            >
              기록 남기기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
