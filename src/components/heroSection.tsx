"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="intro"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-red-950 via-black to-black px-6 overflow-hidden"
    >
      {/* Background spotlight */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-red-600/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl w-full flex flex-col md:flex-row items-center gap-12 z-10">
        
        {/* ==== Left: Portrait PNG with Glow ==== */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full md:w-1/2 flex justify-center"
        >
          <div className="relative w-[320px] md:w-[800px] aspect-[3/4]">
            <Image
              src="/profile.png" // <-- use your background-removed PNG here
              alt="Abdul Saboor - Web Developer"
              fill
              className="object-contain drop-shadow-[0_0_40px_rgba(220,38,38,0.7)]"
              priority
            />
          </div>
        </motion.div>

        {/* ==== Right: Text with Overlap ==== */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left relative"
        >
          <h2 className="text-lg text-red-400 tracking-widest uppercase mb-3">
            Hello, I’m
          </h2>

          {/* Overlapping Name */}
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight relative z-10">
              Abdul Saboor
            </h1>
            {/* Behind effect */}
            <span className="absolute -left-4 -top-4 text-[120px] md:text-[180px] font-extrabold text-red-900/20 select-none z-0">
              SABOOR
            </span>
          </div>

          <h3 className="text-xl md:text-2xl mt-6 text-gray-200">
            A <span className="text-red-500 font-semibold">Web Developer</span>
          </h3>

          <p className="mt-6 text-gray-400 max-w-xl">
            Crafting <span className="text-red-400">modern</span>, 
            <span className="text-red-400"> scalable</span>, and 
            <span className="text-red-400"> responsive</span> web apps with 
            <span className="text-red-400"> Next.js</span> & the 
            <span className="text-red-400"> MERN stack</span>.  
            Focused on performance, clean code, and detail-oriented design.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex justify-center md:justify-start gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all"
            >
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
