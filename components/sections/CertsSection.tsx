import CertCard from "@/components/certs/CertCard";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { certs } from "@/data/certs";

export default function CertsSection() {
  return (
    <section
      id="certs"
      aria-labelledby="certs-heading"
      className="border-b border-zinc-200/80 bg-[#fafbfd]"
    >
      <div className="site-container py-24 md:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Reveal delayMs={0}>
            <SectionLabel as="p" className="w-full text-center">
              Certs
            </SectionLabel>
          </Reveal>

          <Reveal delayMs={90}>
            <h2
              id="certs-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 md:mt-3 md:text-2xl"
            >
              수료 및 자격
            </h2>
          </Reveal>

          <Reveal delayMs={180}>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 md:mt-2.5 md:text-sm">
              꾸준히 배우고, 필요한 역량을 차근차근 쌓아가고 있습니다.
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-5 md:items-stretch lg:grid-cols-3">
          {certs.map((cert, i) => (
            <li key={cert.id} className="md:flex md:h-full md:min-h-0">
              <Reveal delayMs={i * 80 + 240} threshold={0.25} className="h-full w-full">
                <CertCard cert={cert} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
