import SmoothScroll from "@/components/ui/SmoothScroll";
import HeroSection from "@/components/landing/HeroSection";
import StatsTicker from "@/components/sections/stats-ticker";
import StorySection from "@/components/landing/StorySection";
import PublicPreviewSection from "@/components/landing/PublicPreviewSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

import { FloatingNavbar } from "@/components/layout/floating-navbar";

export default function LandingPage() {
  return (
    <>
      <FloatingNavbar />
      <SmoothScroll>
        <main className="bg-neutral-950 min-h-screen text-white selection:bg-neon-blue selection:text-black relative">

          {/* Top Spotlight (Ceiling Light) */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

          {/* Global Noise */}
          <div className="fixed inset-0 bg-noise opacity-[0.03] pointer-events-none z-[50] mix-blend-overlay" />

          <HeroSection />
          <StatsTicker />
          <StorySection />
          <PublicPreviewSection />
          <FinalCTASection />
        </main>
      </SmoothScroll>
    </>
  );
}
