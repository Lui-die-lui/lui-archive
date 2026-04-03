import GithubContributionCard from "@/components/about/GithubContributionCard";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { fetchContributionSummary } from "@/lib/github/fetchContributionSummary";

export default async function AboutSection() {
  const { summary, displayHandle } = await fetchContributionSummary();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-zinc-200/80 bg-white"
    >
      <div className="site-container flex flex-col items-center py-24 text-center md:py-28">
        <Reveal delayMs={0}>
          <SectionLabel
            as="h2"
            id="about-heading"
            className="w-full text-center"
          >
            About
          </SectionLabel>
        </Reveal>

        <Reveal delayMs={90}>
          <GithubContributionCard summary={summary} username={displayHandle} />
        </Reveal>

        <Reveal delayMs={180}>
          <p className="max-w-xl text-2xl font-light leading-snug tracking-tight text-zinc-900 md:text-2xl md:leading-snug">
            끊임없이 탐구하며,
            <br />
            꾸준함을 결과로 만듭니다.
          </p>
        </Reveal>
        <Reveal delayMs={260}>
          <p className="mt-10 max-w-lg text-[14px] leading-7 text-zinc-500 md:mt-8 md:text-sm md:leading-6">
            화면과 기능의 흐름을 고민하는 개발자입니다.<br />
            <br />
            모르는 부분은 피하지 않고 직접 부딪히며 익히고,<br />
            매일 꾸준히 코드를 다루며 이해와 감각을 함께 채워가고 있습니다.
          </p>
          
        </Reveal>
      </div>
    </section>
  );
}
