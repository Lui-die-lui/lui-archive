import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import CertsSection from "@/components/sections/CertsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToHash from "@/components/ui/ScrollToHash";

const INTRO_MIN_LOADING_MS = 800;

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const raw = params.skipIntro;
  const skipIntro =
    raw === "1" || (Array.isArray(raw) && raw.includes("1"));

  if (!skipIntro) {
    await new Promise((resolve) => setTimeout(resolve, INTRO_MIN_LOADING_MS));
  }

  return (
    <main>
      <ScrollProgress />
      {/* 해시(`#about` 등)로 이동해도 섹션이 늦게 렌더되면 최종 스크롤 보정 */}
      <ScrollToHash />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertsSection />
      <Footer />
    </main>
  );
}
