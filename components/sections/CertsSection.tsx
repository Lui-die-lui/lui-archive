import { certs } from "@/data/certs";

export default function CertsSection() {
  return (
    <section
      id="certs"
      aria-labelledby="certs-heading"
      className="border-b border-zinc-200/80 bg-[#fafbfd]"
    >
      <div className="site-container py-24 md:py-32">
        <h2
          id="certs-heading"
          className="text-lg font-medium tracking-tight text-zinc-900"
        >
          수료 및 자격
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
          꾸준히 배우고, 필요한 역량을 차근차근 쌓아가고 있습니다.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert) => {
            const inner = (
              <>
                <h3 className="text-base font-medium text-zinc-900">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{cert.issuer}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.15em] text-zinc-400">
                  {cert.issuedAt}
                </p>
                {!cert.url ? (
                  <div className="mt-6 border-t border-zinc-200/80 pt-4">
                    <p className="text-xs text-zinc-400">공개 링크 없음</p>
                  </div>
                ) : null}
              </>
            );

            if (cert.url) {
              return (
                <li key={cert.id} className="min-h-[10.5rem]">
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full min-h-[10.5rem] flex-col rounded-lg border border-zinc-200/90 bg-white/90 p-6 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] transition-colors hover:border-zinc-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
                  >
                    {inner}
                  </a>
                </li>
              );
            }

            return (
              <li key={cert.id} className="min-h-[10.5rem]">
                <div className="flex h-full min-h-[10.5rem] cursor-default flex-col rounded-lg border border-dashed border-zinc-200/90 bg-zinc-50/90 p-6 text-zinc-600">
                  {inner}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
