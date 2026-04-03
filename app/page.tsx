import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import CertsSection from "@/components/sections/CertsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";

const INTRO_MIN_LOADING_MS = 800;

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, INTRO_MIN_LOADING_MS));

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertsSection />
      <Footer />
    </main>
  );
}
