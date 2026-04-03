"use client";

import type { LinkProps } from "next/link";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  ReactNode,
} from "react";

const SKIP_QUERY_KEY = "skipIntro";

type Props = {
  href: LinkProps["href"];
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
} & Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "children" | "onClick"
>;

export default function SkipIntroLoadingLink({
  href,
  children,
  onClick,
  ...rest
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    // 방명록에서 메인의 섹션 앵커로 이동할 때만 intro-loading 스킵
    // 쿠키는 Link 프리패치/캐싱 타이밍 문제로 서버가 못 읽는 케이스가 있어
    // 항상 쿼리로 확실히 전달합니다.
    if (pathname === "/guestbook" && typeof href === "string" && href.startsWith("/#")) {
      e.preventDefault();

      const hashPart = href.slice(1); // "#about" 형태
      const next = `/?${SKIP_QUERY_KEY}=1${hashPart}`;
      onClick?.(e);
      // 풀 리로드·loading UI 대신 클라이언트 전환 + 상단으로 끌어올리기 방지 → 해시 스크롤과 맞물려 흔들림 완화
      router.push(next, { scroll: false });
      return;
    }

    onClick?.(e);
  };

  return (
    <Link
      href={href}
      prefetch={pathname === "/guestbook" ? false : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
}

