import Scene3D from "@/components/canvas/Scene3D";
import { HeroAsymmetric } from "@/components/sections/Hero";
import { SkillsBrutalist } from "@/components/sections/Skills";
import { ProjectsMonolith } from "@/components/sections/Projects";
import { ContactBlock } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black selection:bg-[#CCFF00] selection:text-white">
      {/* Scroll-driven + interactive 3D Background */}
      <Scene3D />
      
      {/* 1px Global grid layout lines (Pointer events none so they don't block clicks) */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20 hidden md:flex mix-blend-difference">
         <div className="w-1/4 h-full border-r border-white" />
         <div className="w-1/4 h-full border-r border-white" />
         <div className="w-1/4 h-full border-r border-white" />
      </div>

      <div className="fixed top-1/2 w-full border-t border-white opacity-20 pointer-events-none z-10 mix-blend-difference" />

      {/* Content overlay */}
      <div className="relative z-20 pointer-events-none w-full">
        <div className="pointer-events-auto">
          <HeroAsymmetric />
          <SkillsBrutalist />
          <ProjectsMonolith />
          <ContactBlock />
        </div>
      </div>
    </main>
  );
}
