"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    title: "Astra AI",
    description: "An AI-powered chatbot platform with secure authentication and cloud-native deployment.",
    tags: ["Next.js", "AWS Cognito", "Lambda"],
    link: "https://astra-nine-opal.vercel.app"
  },
  {
    title: "MANZIL",
    description: "A SaaS app generating professional resumes instantly via seamless UI paths.",
    tags: ["Next.js", "Tailwind", "Prisma"],
    link: "https://manzil-resume-builder.vercel.app"
  },
  {
    title: "ANU Arch",
    description: "Official website for ANU Architects focusing on SEO and absolute performance.",
    tags: ["Next.js", "Node Mailer"],
    link: "https://www.anuarchitect.com"
  },
  {
    title: "Trade Bot",
    description: "A full-stack algorithmic trading bot for strategies, backtesting, and live execution.",
    tags: ["React", "Express", "MongoDB"],
    link: "#"
  }
];

export function ProjectsMonolith() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Creates a highly dynamic horizontal scrolling effect based on vertical scroll
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress to x translation (0 to -100%)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 1) * 100}vw`]);

  return (
    <section id="projects" ref={scrollRef} className="h-[400vh] bg-black/90">
       <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
          
          <div className="p-8 md:p-16 lg:px-24 lg:py-12 brutal-border-b bg-[#111] z-10 shrink-0">
            <h2 className="text-[12vw] md:text-[6vw] font-bold heading text-[#00FFCC] uppercase leading-none mix-blend-screen glitch-hover">
              WORK_LOGS
            </h2>
          </div>

          <motion.div 
             style={{ x }} 
             className="flex flex-row h-full w-full"
          >
             {projects.map((project, idx) => (
               <div
                 key={idx}
                 className="w-screen h-full shrink-0 flex items-center justify-center p-8 md:p-24"
               >
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-white/20 p-8 md:p-16 flex flex-col justify-between group h-[60vh] w-full max-w-6xl brutal-hover-accent bg-black relative overflow-hidden"
                  >
                    {/* Hover effect background slip */}
                    <div className="absolute inset-0 bg-[#00FFCC] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-0" />
                    
                    <div className="relative z-10 flex justify-between items-start mb-12 border-t pt-4 border-white/20 group-hover:border-black transition-colors">
                      <h3 className="text-4xl md:text-8xl font-bold heading text-white group-hover:text-black uppercase tracking-tighter">
                        {project.title}
                      </h3>
                      <span className="font-mono text-zinc-600 group-hover:text-black text-2xl md:text-4xl italic font-bold">
                         0{idx + 1}
                      </span>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-zinc-400 group-hover:text-[#111] font-body text-xl md:text-3xl mb-12 leading-relaxed max-w-3xl font-bold uppercase transition-colors">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-sm md:text-lg font-mono px-4 py-2 border border-zinc-700 text-zinc-500 group-hover:border-black group-hover:text-black uppercase tracking-widest font-bold transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.a>
               </div>
             ))}
          </motion.div>
       </div>
    </section>
  );
}
