"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Magnetic from "@/components/ui/Magnetic";
import { scrollToAnchor } from "@/components/providers/SmoothScroll";
import type { NavLink, Project, SocialLink } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Header({
  logotype,
  email,
  nav,
  socials,
  projects,
}: {
  logotype: string;
  email: string;
  nav: NavLink[];
  socials: SocialLink[];
  projects: Project[];
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const go = (href: string) => {
    setOpen(false);
    // wait for the overlay exit before scrolling
    setTimeout(() => scrollToAnchor(href), 450);
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[110] flex items-start justify-between p-5 md:p-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.__lenis?.scrollTo(0);
          }}
          className="pointer-events-auto font-display text-xl text-current"
        >
          {logotype}
        </a>
        <div className="pointer-events-auto flex items-center gap-3">
          <Magnetic>
            <a
              href={`mailto:${email}`}
              data-cursor="SAY HI"
              className="mono-caption hidden rounded-full bg-accent px-5 py-2.5 !text-ink transition-transform duration-200 ease-out-expo hover:scale-105 md:inline-block"
              style={{ color: "#0B0C0A" }}
            >
              Available for work
            </a>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="mono-caption rounded-full border border-current px-5 py-2.5"
            >
              {open ? "Close" : "Menu"}
            </button>
          </Magnetic>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="overlay"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-[105] flex flex-col justify-between bg-ink px-6 pb-10 pt-28 text-bone md:px-16"
            aria-label="Site navigation"
          >
            <ul className="flex flex-col gap-1">
              {nav.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%", transition: { duration: 0.3 } }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.12 + i * 0.06 }}
                  >
                    <button
                      onClick={() => go(link.href)}
                      onMouseEnter={() =>
                        setPreview(
                          link.href === "#work" ? projects[0]?.image ?? null : null
                        )
                      }
                      onMouseLeave={() => setPreview(null)}
                      data-cursor="GO"
                      className="font-display text-[clamp(2.8rem,9vw,7.5rem)] text-bone/90 transition-colors duration-200 hover:text-accent"
                    >
                      {link.label}
                    </button>
                  </motion.div>
                </li>
              ))}
            </ul>

            <AnimatePresence>
              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="pointer-events-none absolute right-[8vw] top-1/2 hidden w-[26vw] -translate-y-1/2 overflow-hidden rounded-2xl lg:block"
                  aria-hidden
                >
                  <Image
                    src={preview}
                    alt=""
                    width={640}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
              className="flex flex-wrap items-end justify-between gap-6 border-t border-bone/15 pt-6"
            >
              <ul className="flex gap-6">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mono-caption text-bone/60 transition-colors hover:text-accent"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${email}`}
                className="mono-caption text-bone/60 transition-colors hover:text-accent"
              >
                {email}
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
