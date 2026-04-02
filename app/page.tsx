import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/sections/AboutSection";
import CertsSection from "@/components/sections/CertsSection";
import GuestbookSection from "@/components/sections/GuestbookSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertsSection />
      <GuestbookSection />
      <Footer />
    </main>
  );
}
