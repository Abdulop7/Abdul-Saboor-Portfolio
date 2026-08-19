"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Testimonial } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Single oversized serif pull-quote, crossfading on a timer. */
export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000
    );
    return () => clearInterval(id);
  }, [testimonials.length]);

  const t = testimonials[index];
  if (!t) return null;

  return (
    <section
      aria-label="Testimonials"
      className="cv-auto mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-6 py-[12vh] md:px-10"
    >
      <AnimatePresence mode="wait">
        <motion.figure
          key={index}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <blockquote className="font-serif-display text-[clamp(1.8rem,3.6vw,3.4rem)] leading-tight">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-4">
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs"
              style={{ borderColor: "var(--line)" }}
            >
              {t.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <span className="mono-caption opacity-60">
              {t.author} — {t.roleLine}
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </section>
  );
}
