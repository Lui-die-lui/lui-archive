import GithubContributionCard from "@/components/about/GithubContributionCard";
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
        <SectionLabel
          as="h2"
          id="about-heading"
          className="w-full text-center"
        >
          About
        </SectionLabel>
        <GithubContributionCard summary={summary} username={displayHandle} />
        <p className="max-w-xl text-2xl font-light leading-snug tracking-tight text-zinc-900 md:text-2xl md:leading-snug">
          끊임없이 탐구하며,
          <br />
          꾸준함을 결과로 만듭니다.
        </p>
        <p className="mt-10 max-w-lg text-[15px] leading-7 text-zinc-500 md:mt-8 md:text-sm md:leading-6">
          새로운 도구와 패턴을 익히는 것을 멈추지 않고, <br />매일의 작은 개선이
        쌓이도록 기록하고 되돌아봅니다. <br />화려함보다는 읽기 쉬운 구조와
          예측 가능한 동작을 우선합니다.
        </p>
      </div>
    </section>
  );
}
