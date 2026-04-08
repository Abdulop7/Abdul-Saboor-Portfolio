"use client";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export function HeroAsymmetric() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Connect scroll to animations for zoom and blur effects
  const { scrollYProgress } = useScroll({
     target: containerRef,
     offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(20px)"]);


  const grainOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 0.8]);

  return (
    <motion.section 
      ref={containerRef}
      style={{ scale, opacity, filter: blur }}
      className="min-h-screen brutal-border-b grid grid-cols-1 md:grid-cols-4 relative transform-origin-top overflow-hidden bg-transparent"
    >
      {/* Dynamic Scrolling SVG Grain Overlay */}
      <motion.div 
         style={{ opacity: grainOpacity }}
         className="absolute inset-0 pointer-events-none z-50 mix-blend-color-dodge"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </motion.div>

      <div className="md:col-span-3 brutal-border-r p-8 md:p-16 lg:p-24 flex flex-col justify-between z-10 bg-black/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none transition-all">
         <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
         >
            <h2 className="text-sm md:text-xl font-mono uppercase tracking-[0.5em] text-[#00FFCC] font-bold mb-12 flex items-center gap-4">
               <span className="w-12 h-[2px] bg-[#00FFCC]" /> FullStack Developer
            </h2>
         </motion.div>

         <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="pointer-events-auto relative z-20"
         >
            {/* Clean Typographic Element without glitch */}
            <motion.h1 
               className="text-[18vw] md:text-[12vw] font-bold heading uppercase leading-[0.8] mb-12 text-white mix-blend-difference transition-colors duration-300"
            >
               ABDUL
               <br />
               SABOOR
            </motion.h1>
         </motion.div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pointer-events-auto">
            <p className="text-zinc-400 font-body text-sm md:text-lg uppercase leading-relaxed brutal-border-l-[4px] pl-6 border-[#CCFF00] relative z-20 bg-black/40 md:bg-transparent">
               Crafting scalable and responsive web apps. Technical execution meets stark visual clarity. Next.js & MERN Stack specialist based in Pakistan.
            </p>
         </div>
      </div>

      {/* Right Column: PFP Image Integration - Brutalist Duotone */}
      <div className="md:col-span-1 border-t md:border-t-0 border-white/20 relative group overflow-hidden flex flex-col min-h-[50vh] md:min-h-0 pointer-events-auto bg-black border-l border-white/20">
         {/* The PFP Image */}
         <Image
            src="/pfp.webp"
            alt="Abdul Saboor"
            fill
            className="object-cover object-center grayscale contrast-[1.5] brightness-75 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
         />
         {/* Stark Overlay to blend with theme */}
         <div className="absolute inset-0 bg-[#CCFF00] mix-blend-color opacity-40 group-hover:opacity-0 transition-opacity duration-700 z-0" />

         {/* Typographic elements over the image */}
         <div className="relative z-10 flex flex-col justify-between h-full p-8">
            <span className="font-mono text-sm tracking-widest uppercase text-black drop-shadow-[0_2px_2px_rgba(255,255,255,1)] bg-[#CCFF00] px-2 py-1 self-start font-bold">
               [ STATUS: OPERATIONAL ]
            </span>
         </div>

         <a href="#projects" className="relative z-20 w-full mt-auto font-heading text-2xl font-bold brutal-hover block py-8 border-t border-white/20 uppercase tracking-widest text-center bg-black hover:bg-[#00FFCC] hover:text-black transition-colors text-white">
            Access Data
         </a>
      </div>
    </motion.section>
  );
}
