"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, motionOK } from "@/lib/gsap";
import WordReveal from "@/components/ui/WordReveal";
import type { ExperienceEntry } from "@/lib/types";

/**
 * Vertical timeline. The entry crossing the viewport center enlarges; a thin
 * accent progress line fills with scroll; positions snap gently between entries.
 */
export default function Experience({ entries }: { entries: ExperienceEntry[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!motionOK()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      const items = gsap.utils.toArray<HTMLElement>("[data-entry]");
      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            gsap.to(item, {
              scale: self.isActive ? 1 : 0.94,
              opacity: self.isActive ? 1 : 0.35,
              duration: 0.5,
              ease: "outExpo",
            });
          },
        });
      });

      // gentle snap between entries
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: 1 / (items.length - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: "outExpo",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="experience" className="relative px-6 py-[12vh] md:px-10">
      <WordReveal
        text="EXPERIENCE"
        as="h2"
        className="font-display mb-20 text-[clamp(3rem,8vw,8rem)]"
      />

      <div className="relative mx-auto max-w-4xl">
        {/* progress line */}
        <div
          className="absolute bottom-0 left-0 top-0 w-px"
          style={{ background: "var(--line)" }}
          aria-hidden
        >
          <div
            ref={lineRef}
            className="h-full w-full origin-top bg-accent will-change-transform"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        <ol className="flex flex-col gap-[14vh] pl-8 md:pl-16">
          {entries.map((entry) => (
            <li
              key={entry.company}
              data-entry
              className="origin-left will-change-transform"
            >
              <h3 className="font-display text-[clamp(2rem,4.5vw,4rem)]">
                {entry.company}
              </h3>
              <p className="mono-caption mt-3 opacity-50">
                {entry.role} · {entry.dates}
              </p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="max-w-xl border-l pl-4 text-sm leading-relaxed opacity-80"
                    style={{ borderColor: "var(--line)" }}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
