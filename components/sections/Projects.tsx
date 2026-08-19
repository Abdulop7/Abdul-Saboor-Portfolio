"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, motionOK } from "@/lib/gsap";
import Magnetic from "@/components/ui/Magnetic";
import WordReveal from "@/components/ui/WordReveal";
import type { Project } from "@/lib/types";

/**
 * Sticky-stacked case cards. Each card pins while its image scales 0.9→1 and
 * metadata slides in from the left. Scroll velocity skews the wrapper and
 * fades in a chromatic ghost layer on the images.
 */
export default function Projects({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const skewRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!motionOK()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach((card) => {
        const img = card.querySelector("[data-card-img]");
        const meta = card.querySelector("[data-card-meta]");
        gsap.fromTo(
          img,
          { scale: 0.9 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          }
        );
        gsap.fromTo(
          meta,
          { x: -48, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "outExpo",
            scrollTrigger: { trigger: card, start: "top 60%", once: true },
          }
        );
      });

      // velocity → skew + chromatic ghost opacity
      const skewSetter = gsap.quickTo(skewRef.current, "skewY", {
        duration: 0.4,
        ease: "power3.out",
      });
      const ghosts =
        rootRef.current?.querySelectorAll<HTMLElement>("[data-ghost]") ?? [];
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          skewSetter(gsap.utils.clamp(-4, 4, v / -400));
          const ca = gsap.utils.clamp(0, 1, Math.abs(v) / 2200);
          ghosts.forEach((g) => {
            g.style.opacity = String(ca * 0.5);
            g.style.transform = `translateX(${ca * 8}px)`;
          });
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="work" aria-label="Selected work">
      <div className="px-6 pb-8 pt-[12vh] md:px-10">
        <WordReveal
          text="SELECTED WORK"
          as="h2"
          className="font-display text-[clamp(3rem,8vw,8rem)]"
        />
      </div>

      <div ref={skewRef} className="will-change-transform">
        <ul>
          {projects.map((project) => (
            <li
              key={project.slug}
              data-card
              className="sticky top-0 flex min-h-screen items-center border-t bg-ink text-bone"
              style={{ borderColor: "var(--line)" }}
            >
              <article className="grid w-full gap-8 px-6 py-20 md:grid-cols-[1fr_1.35fr] md:gap-14 md:px-10">
                {/* metadata */}
                <div data-card-meta className="flex flex-col justify-center">
                  <p className="font-display text-[clamp(2.4rem,5vw,4.5rem)] text-bone/25">
                    {project.index} —
                  </p>
                  <h3 className="font-display mt-4 text-[clamp(2.4rem,5vw,5.5rem)]">
                    {project.title}
                  </h3>
                  <p className="mono-caption mt-5 text-bone/50">
                    {project.year} · {project.role}
                  </p>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-bone/70">
                    {project.problem}
                  </p>
                  <p className="mt-3 max-w-md text-base leading-relaxed">
                    <span className="text-accent">→</span> {project.result}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((chip) => (
                      <li
                        key={chip}
                        className="mono-caption rounded-full border border-bone/15 px-3 py-1.5 text-bone/60"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                  <div className="mono-caption mt-8 flex gap-6">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-bone/30 underline-offset-4 transition-colors hover:text-accent"
                      >
                        Live ↗
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-bone/30 underline-offset-4 transition-colors hover:text-accent"
                      >
                        Repo ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* image */}
                <div className="group relative overflow-hidden rounded-2xl">
                  <div data-card-img className="relative will-change-transform">
                    <Image
                      src={project.image}
                      alt={`${project.title} — project cover`}
                      width={1280}
                      height={800}
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className="h-auto w-full object-cover"
                    />
                    {/* chromatic ghost, driven by scroll velocity */}
                    <div
                      data-ghost
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,0,80,0.35), rgba(0,180,255,0.35))",
                        maskImage: "linear-gradient(black, black)",
                      }}
                    />
                  </div>
                  {/* magnetic view-case CTA */}
                  <div className="absolute inset-0 hidden items-center justify-center md:flex">
                    <Magnetic className="opacity-0 transition-opacity duration-300 ease-out-expo group-hover:opacity-100">
                      <a
                        href={project.live ?? project.repo ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="VIEW"
                        className="mono-caption rounded-full bg-accent px-7 py-4 text-ink"
                      >
                        VIEW CASE →
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
