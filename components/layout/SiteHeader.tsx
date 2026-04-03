import Link from "next/link";
import MobileNavMenu from "@/components/layout/MobileNavMenu";
import { ctaPillGlassButtonHeader } from "@/components/ui/ctaPill";
import { siteNavItems } from "@/data/siteNav";
import SkipIntroLoadingLink from "@/components/layout/SkipIntroLoadingLink";
import { isAdminSession } from "@/lib/admin-auth";

/** 와이어: 좌 로고 · 중앙 4링크(md+) · 우 방명록 + 모바일 메뉴 */
export default async function SiteHeader() {
  const showAdminDashboard = await isAdminSession();

  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-white/25 bg-white/[0.06] backdrop-blur-md backdrop-saturate-150"
      role="banner"
    >
      <div className="site-container flex h-12 items-center justify-between gap-3 md:h-14 md:gap-6 lg:h-[3.75rem]">
        <SkipIntroLoadingLink
          href="/#hero"
          className="shrink-0 text-sm font-medium tracking-tight text-zinc-800 transition-colors hover:text-zinc-950 md:text-[0.9375rem] lg:text-base"
        >
          Lui Arc.
        </SkipIntroLoadingLink>

        <nav
          aria-label="페이지 섹션"
          className="absolute left-1/2 hidden -translate-x-1/2 md:block"
        >
          <ul className="flex justify-center gap-4 whitespace-nowrap text-[0.8125rem] text-zinc-600 md:gap-10 md:text-[0.875rem] lg:gap-13 lg:text-[0.9375rem]">
            {siteNavItems.map((item) => (
              <li key={item.href} className="shrink-0">
                <SkipIntroLoadingLink
                  href={item.href}
                  className="transition-colors hover:text-zinc-900"
                >
                  {item.label}
                </SkipIntroLoadingLink>
              </li>
            ))}
            {showAdminDashboard ? (
              <li key="/admin" className="shrink-0">
                <Link
                  href="/admin"
                  className="transition-colors hover:text-zinc-900"
                >
                  dashboard
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:gap-2.5">
          <Link href="/guestbook" className={ctaPillGlassButtonHeader}>
            방명록
          </Link>
          <MobileNavMenu showAdminDashboard={showAdminDashboard} />
        </div>
      </div>
    </header>
  );
}
