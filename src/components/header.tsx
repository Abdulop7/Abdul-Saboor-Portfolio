"use client";

import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Intro", to: "intro" },
  { label: "Skills", to: "skills" },
  { label: "Projects", to: "projects" },
  { label: "Contact", to: "contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
<div className="max-w-7xl mx-auto px-6 py-16 flex items-center justify-end">
  {/* ==== Desktop Nav Links ==== */}
  <ul className="hidden md:flex space-x-20 text-[#E2E8F0] text-2xl font-semibold tracking-wide">
    {navItems.map((item) => (
      <li key={item.to}>
        <ScrollLink
          to={item.to}
          smooth={true}
          duration={500}
          offset={-80}
          spy={true}
          isDynamic={true}
          activeClass="active-link"
          className="relative cursor-pointer transition-colors hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E]"
        >
          {item.label}
        </ScrollLink>
      </li>
    ))}
  </ul>

        {/* ==== Mobile Menu Button ==== */}
        <button
          className="md:hidden text-[#E2E8F0] ml-4 hover:text-[#22C55E] "
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ==== Mobile Dropdown Menu (Animated) ==== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden flex flex-col items-center bg-black/80 backdrop-blur-md text-white font-medium py-8 space-y-6 shadow-lg border-t border-white/10"
          >
            {navItems.map((item) => (
              <li
                key={item.to}
                className="w-full text-center border-b border-white/10 last:border-none"
              >
                <ScrollLink
                  to={item.to}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  spy={true}
                  activeClass="active-link"
                  className="block py-3 cursor-pointer transition-colors hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:to-[#22C55E]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

    </nav>
  );
}
