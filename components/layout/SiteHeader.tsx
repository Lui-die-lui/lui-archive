import { ctaPillGlassButton } from "@/components/ui/ctaPill";

const navItems = [
  { href: "#about", label: "intro" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "works" },
  { href: "#certs", label: "certs" },
] as const;

/** 와이어: 좌 로고 · 중앙 4링크 · 우 방명록. 얇고 투명한 고정 바 */
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
            {navItems.map((item) => (
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

        <a href="#guestbook" className={ctaPillGlassButton}>
          방명록
        </a>
      </div>

      <nav
        aria-label="페이지 섹션 모바일"
        className="border-t border-white/15 bg-white/[0.04] py-2 md:hidden"
      >
        <div className="site-container">
          <ul className="flex justify-center gap-x-4 gap-y-1 overflow-x-auto whitespace-nowrap text-[0.6875rem] text-zinc-600">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors hover:text-zinc-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
