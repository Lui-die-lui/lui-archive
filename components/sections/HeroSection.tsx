import ArchiveBlurAccents from "@/components/ui/ArchiveBlurAccents";

const navItems = [
  { href: "#about", label: "intro" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "works" },
  { href: "#certs", label: "certs" },
  { href: "#guestbook", label: "방명록" },
] as const;

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-zinc-200/80 bg-[#fafbfd]"
    >
      <ArchiveBlurAccents />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-10 md:pb-32 md:pt-14">
        <header className="mb-20 flex flex-col gap-10 md:mb-28 md:flex-row md:items-start md:justify-between md:gap-6">
          <p className="shrink-0 text-sm font-medium tracking-tight text-zinc-800">
            Lui Arc.
          </p>

          <nav aria-label="페이지 섹션" className="md:flex-1 md:flex md:justify-center">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="transition-colors hover:text-zinc-800"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 gap-6 text-sm text-zinc-500 md:justify-end">
            <a href="#" className="transition-colors hover:text-zinc-800">
              GitHub
            </a>
            <a href="#" className="transition-colors hover:text-zinc-800">
              Velog
            </a>
          </div>
        </header>

        <div className="max-w-2xl">
          <h1
            id="hero-heading"
            className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl"
          >
            Lui Archive
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-600">
            기록과 정리를 바탕으로 만든 작은 아카이브입니다. 프로젝트와 학습
            흔적을 차분히 모아 둡니다.
          </p>
          <div className="mt-10">
            <a
              href="#footer"
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white/80 px-5 py-2.5 text-sm font-medium text-zinc-800 backdrop-blur-sm transition-colors hover:border-zinc-400 hover:bg-white"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
