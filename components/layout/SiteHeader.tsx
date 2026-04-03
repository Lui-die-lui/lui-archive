import MobileNavMenu from "@/components/layout/MobileNavMenu";
import { ctaPillGlassButton } from "@/components/ui/ctaPill";
import { siteNavItems } from "@/data/siteNav";

/** 와이어: 좌 로고 · 중앙 4링크(md+) · 우 방명록 + 모바일 메뉴 */
export default function SiteHeader() {
  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-white/25 bg-white/[0.06] backdrop-blur-md backdrop-saturate-150"
      role="banner"
    >
      <div className="site-container flex h-12 items-center justify-between gap-3 md:h-[3.25rem] md:gap-6">
        <a
          href="#hero"
          className="shrink-0 text-sm font-medium tracking-tight text-zinc-800 transition-colors hover:text-zinc-950"
        >
          Lui Arc.
        </a>

        <nav
          aria-label="페이지 섹션"
          className="absolute left-1/2 hidden -translate-x-1/2 md:block"
        >
          <ul className="flex justify-center gap-4 whitespace-nowrap text-[0.8125rem] text-zinc-600 lg:gap-5">
            {siteNavItems.map((item) => (
              <li key={item.href} className="shrink-0">
                <a
                  href={item.href}
                  className="transition-colors hover:text-zinc-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a href="#guestbook" className={ctaPillGlassButton}>
            방명록
          </a>
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}
