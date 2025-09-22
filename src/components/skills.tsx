"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const techStack = [
    { name: "Next.js", logo: "/logos/nextjs.png" },
    { name: "React.js", logo: "/logos/react.png" },
    { name: "Node.js", logo: "/logos/nodejs.png" },
    { name: "MongoDB", logo: "/logos/mongodb.png" },
    { name: "TypeScript", logo: "/logos/typescript.png" },
    { name: "Tailwind CSS", logo: "/logos/tailwind.png" },
    { name: "Express.js", logo: "/logos/express.png" },
    { name: "Git & GitHub", logo: "/logos/github.png" },
    { name: "Postgres", logo: "/logos/postgres.png" },
    { name: "HTML", logo: "/logos/html.png" },
    { name: "CSS", logo: "/logos/css.png" },
    { name: "Javascript", logo: "/logos/javascript.png" },
    { name: "Prisma", logo: "/logos/prisma.png" },
    { name: "Typescript", logo: "/logos/git.png" },
    { name: "Docker", logo: "/logos/docker.png" },
];

export default function Skills() {
    return (
        <section
            id="skills"
            className="relative w-full min-h-screen flex flex-col items-center justify-center 
                       bg-gradient-to-b from-[#0F172A] via-[#0F172A] to-black px-6 py-24 overflow-hidden"
        >
            {/* Background aura */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[200px]" />
            </div>

            {/* Section Title */}
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-16 uppercase tracking-[0.3em] text-[#F8FAFC]"
            >
                Tech <span className="text-[#0EA5E9]">Stack</span>
            </motion.h2>

            {/* Tech Grid */}
            <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-12 max-w-5xl w-full">
                {techStack.map((tech, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="flex flex-col items-center text-center group cursor-pointer"
                    >
                        {/* Logo with refined glow */}
                        <div className="md:w-30 md:h-30 w-20 h-20 relative mb-3">
                            <Image
                                src={tech.logo}
                                alt={tech.name}
                                fill
                                className="object-contain 
                                           drop-shadow-[0_0_8px_rgba(14,165,233,0.6)] 
                                           group-hover:drop-shadow-[0_0_16px_rgba(34,197,94,0.9)] 
                                           transition-all duration-300"
                            />
                        </div>

                        {/* Tech Name */}
                        <p className="text-sm text-[#E2E8F0] group-hover:bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] bg-clip-text text-transparent transition-all duration-300">
                            {tech.name}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
