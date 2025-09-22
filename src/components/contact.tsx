"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen text-[#F8FAFC]  overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute inset-0 -z-10">
        {/* Center Halo */}
        <div
          className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full 
          bg-[#0EA5E9]/20 border border-[#0EA5E9]/50 
          -translate-x-1/2 -translate-y-1/2 rotate-12 blur-[120px]"
        />

        {/* Accent Shape */}
        <div
          className="absolute top-1/4 right-1/4 w-40 h-40 
          bg-[#22C55E]/30 border-2 border-[#22C55E]/60 rotate-45 
          shadow-[0_0_150px_rgba(34,197,94,0.6)]"
        />
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row w-full min-h-screen px-6 md:px-20 py-24 gap-12 relative z-10">
        {/* Left: Heading & Description */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center gap-6"
        >
          <h2 className="text-6xl font-bold text-[#0EA5E9] tracking-tight">
            {"Let's Connect"}
          </h2>
          <p className="text-[#E2E8F0] text-xl max-w-lg">
            I’m open to collaborating on exciting projects, discussing ideas, or
            just having a friendly chat. Feel free to reach out via email,
            phone, or socials!
          </p>
        </motion.div>

        {/* Right: Contact Info & Socials */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center gap-10"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-[#0EA5E9]">Email</h3>
            <p className="text-[#E2E8F0] hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E] hover:text-transparent hover:bg-clip-text transition-colors">
              abdulsaboora691@gmail.com
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-[#0EA5E9]">Phone</h3>
            <p className="text-[#E2E8F0] hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E] hover:text-transparent hover:bg-clip-text transition-colors">
              +92 309 8113300
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-[#0EA5E9]">Location</h3>
            <p className="text-[#E2E8F0] hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E] hover:text-transparent hover:bg-clip-text transition-colors">
              Multan, Pakistan
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold text-[#0EA5E9]">Follow Me</h3>
            <div className="flex gap-6 mt-2 text-[#E2E8F0]">
              <a
                href="https://www.linkedin.com/in/abdul-saboor-1333b8167"
                className="hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E] hover:text-transparent hover:bg-clip-text transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/Abdulop7"
                className="hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E] hover:text-transparent hover:bg-clip-text transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.instagram.com/abdul_saboor78/?hl=en"
                className="hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E] hover:text-transparent hover:bg-clip-text transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61565458451605"
                className="hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E] hover:text-transparent hover:bg-clip-text transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
