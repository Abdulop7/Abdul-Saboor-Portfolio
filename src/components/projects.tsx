"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "Astra AI",
    description:
      "An AI-powered chatbot platform with secure authentication and cloud-native deployment.",
    details: [
      "OpenAI API integration for intelligent conversations",
      "AWS Cognito authentication with role-based access",
      "Scalable serverless backend using AWS Lambda & API Gateway",
      "DynamoDB for persistent user session management",
    ],
    tech: [
      "Next.js",
      "AWS Cognito",
      "AWS Lambda",
      "API Gateway",
      "DynamoDB",
      "OpenAI API",
      "Tailwind CSS",
    ],
    link: "https://astra-nine-opal.vercel.app",
    image: "/projects/astra.png",
  },
  {
    title: "MANZIL Resume Builder",
    description:
      "A SaaS app that generates professional resumes instantly with simple input fields.",
    details: [
      "User authentication with NextAuth",
      "Resume export in polished formats",
      "PostgreSQL + Prisma for structured storage",
      "Modern UI with Tailwind CSS",
    ],
    tech: [
      "Next.js",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
      "GitHub",
    ],
    link: "https://manzil-resume-builder.vercel.app",
    image: "/projects/manzil.png",
  },
  {
    title: "ANU Architects Website",
    description:
      "Official website for ANU Architects with optimized performance and SEO.",
    details: [
      "Built with Next.js & Tailwind for modern UI",
      "SEO optimized for better search rankings",
      "Node Mailer for secure contact form",
      "Responsive across devices",
    ],
    tech: ["Next.js", "Tailwind CSS", "Node Mailer", "GitHub"],
    link: "https://www.anuarchitect.com",
    image: "/projects/anu.png",
  },
  {
    title: "Trading Bot",
    description:
      "A full-stack trading bot for automated strategies, backtesting, and live execution.",
    details: [
      "Binance API integration",
      "Live market data via WebSockets",
      "Backtesting with custom EMA/ATR strategies",
      "Dockerized for deployment",
    ],
    tech: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Binance API",
      "Docker",
    ],
    link: "",
    image: "/projects/trading.png",
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section
      id="projects"
      className="relative min-h-screen text-[#E2E8F0] px-6 py-20 md:px-12 overflow-hidden"
    >
      {/* ==== Section Header ==== */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-[#0EA5E9]">
          Projects
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          A showcase of my latest work, blending clean UI, solid backend, and
          cloud-first scalability.
        </p>
      </div>

      {/* ==== Projects Grid ==== */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="border border-[#0EA5E9]/20 rounded-xl bg-[#0F172A]/80 backdrop-blur-md shadow-lg overflow-hidden"
          >
            {/* Project Image (use next/image with fill inside a relative container) */}
            <div className="relative aspect-[1.92/1] w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority={idx === 0} // optional: prioritize first image
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-semibold text-[#22C55E]">
                {project.title}
              </h3>
              <p className="text-gray-300 mt-3">{project.description}</p>

              {/* Tech tags */}
              <ul className="flex flex-wrap gap-2 mt-4">
                {project.tech.slice(0, 4).map((t, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-300 border border-[#0EA5E9]/30 px-3 py-1 rounded-full hover:border-[#22C55E] transition-colors"
                  >
                    {t}
                  </li>
                ))}
                {project.tech.length > 4 && (
                  <li className="text-sm text-[#0EA5E9]">
                    +{project.tech.length - 4} more
                  </li>
                )}
              </ul>

              {/* Actions */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-[#0EA5E9] text-lg font-medium hover:text-[#22C55E] transition-colors"
                >
                  Details
                </button>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-[#22C55E] font-medium hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E] transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Live →
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ==== Modal ==== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0F172A] rounded-xl shadow-xl max-w-3xl w-full p-6 relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-[#22C55E]"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
              >
                ✕
              </button>

              {/* Project Content */}
              <h3 className="text-3xl font-bold text-[#0EA5E9]">
                {selectedProject.title}
              </h3>
              <p className="text-gray-300 mt-4">
                {selectedProject.description}
              </p>

              {/* Modal image */}
              <div className="relative aspect-[1.92/1] w-full rounded-lg overflow-hidden mt-6 border border-[#0EA5E9]/20">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              {/* Detailed Highlights */}
              {selectedProject.details && (
                <ul className="list-disc list-inside text-gray-400 mt-6 space-y-2">
                  {selectedProject.details.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {/* Full tech stack */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-[#22C55E]">
                  Tech Stack
                </h4>
                <ul className="flex flex-wrap gap-2 mt-2">
                  {selectedProject.tech.map((t, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-300 border border-[#22C55E]/30 px-3 py-1 rounded-full hover:border-[#0EA5E9] transition-colors"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
