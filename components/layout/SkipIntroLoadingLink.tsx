"use client";

import type { LinkProps } from "next/link";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    // 방명록에서 메인의 섹션 앵커로 이동할 때만 intro-loading 스킵
    // 쿠키는 Link 프리패치/캐싱 타이밍 문제로 서버가 못 읽는 케이스가 있어
    // 항상 쿼리로 확실히 전달합니다.
    if (pathname === "/guestbook" && typeof href === "string" && href.startsWith("/#")) {
      e.preventDefault();

      const hashPart = href.slice(1); // "#about" 형태
      const next = `/?${SKIP_QUERY_KEY}=1${hashPart}`;
      onClick?.(e);
      window.location.assign(next);
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

