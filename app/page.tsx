import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import CertsSection from "@/components/sections/CertsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToHash from "@/components/ui/ScrollToHash";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      {/* 해시(`#about` 등)로 이동해도 섹션이 늦게 렌더되면 최종 스크롤 보정 */}
      <ScrollToHash />
      <HeroSection />
      {/* DB/GitHub 대기 중에도 히어로 RSC를 먼저 내려보내 LCP 개선 (fallback null = 아래 섹션만 순차 등장) */}
      <Suspense fallback={null}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={null}>
        <SkillsSection />
      </Suspense>
      <Suspense fallback={null}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={null}>
        <CertsSection />
      </Suspense>
      <Footer />
    </main>
  );
}
