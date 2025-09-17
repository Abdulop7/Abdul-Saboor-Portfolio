"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "Astra AI",
    description:
      "Developed Astra AI, an intelligent chatbot powered by the OpenAI API with secure authentication via AWS Cognito. Built using Next.js, Tailwind CSS, AWS Lambda, API Gateway, DynamoDB, and Git/GitHub for scalable cloud deployment.",
    tech: ["Next.js", "AWS Cognito", "AWS Lamda", "AWS Api Gateway", "AWS DynamoDB" , "OpenAI Api" , "AWS IAM" ,"Tailwind CSS" , "Git" , "Github"],
    link: "https://astra-nine-opal.vercel.app",
  },
  {
    title: "MANZIL Resume Builder",
    description:
      "Built MANZIL, a SaaS resume builder that lets users generate professional resumes by simply entering their details. Developed with Next.js, Tailwind CSS, PostgreSQL, Prisma, and NextAuth for secure and seamless user experience.",
    tech: ["Next.js" , "Tailwind CSS" , "Prisma","PostgreSql" , "Next Auth" , "Git" , "Github"],
    link: "",
  },
  {
    title: "ANU Architects Website",
    description:
      "Developed the official website for ANU Architects using Next.js, Tailwind CSS, and Node Mailer. Enhanced performance with SEO optimization for better visibility.",
    tech: ["Nest.js", "Tailwind CSS", "Node Mailer" , "Git" , "Github"],
    link: "https://www.anuarchitect.com",
  },
  {
    title: "Trading Bot",
    description:
      "A full-stack trading automation system using Next.js, Node.js, and Binance API with backtesting and live execution.",
    tech: ["React.js", "Node.js", "Express.js","MongoDB","Web Socket" , "Binance API", "Docker", "Git" , "Github"],
    link: "",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative min-h-screen  bg-black text-white px-6 py-20 md:px-12 overflow-hidden"
    >
      {/* ==== Background Illustrations ==== */}
      <div className="absolute inset-0">

        {/* Geometric accents */}
        <div className="absolute top-40 left-10 w-40 h-40 border-2 border-red-500/80 rotate-45 shadow-[0_0_50px_rgba(255,0,0,0.7)] z-0" />
        <div className="absolute bottom-32 right-16 w-28 h-28 border-2 border-red-400/70 rounded-full shadow-[0_0_40px_rgba(255,0,0,0.6)] z-0" />
      </div>

      {/* ==== Section Header ==== */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-wide">
          Projects
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          A selection of my recent work, combining clean UI with solid functionality.
        </p>
      </div>

      {/* ==== Projects Grid ==== */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 relative z-10">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="border border-white/20 p-6 rounded-xl bg-black/80 backdrop-blur-md shadow-xl relative z-10"
          >
            <h3 className="text-2xl font-semibold text-red-400">{project.title}</h3>
            <p className="text-gray-300 mt-3">{project.description}</p>

            <ul className="flex flex-wrap gap-2 mt-4">
              {project.tech.map((t, i) => (
                <li
                  key={i}
                  className="text-sm text-gray-300 border border-white/20 px-3 py-1 rounded-full"
                >
                  {t}
                </li>
              ))}
            </ul>

            <a
              href={project.link}
              className="inline-block mt-6 text-red-400 font-medium tracking-wide hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project →
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
