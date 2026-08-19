"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, motionOK } from "@/lib/gsap";
import WordReveal from "@/components/ui/WordReveal";
import type { ProcessStep } from "@/lib/types";

/**
 * Horizontal track driven by vertical scroll on desktop (pinned).
 * Mobile gets a plain vertical stack — no scroll-jacking on touch.
 */
export default function Process({ steps }: { steps: ProcessStep[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!motionOK()) return;
    // matchMedia arms/disarms the pin live when the window crosses 1024px,
    // instead of deciding once at mount
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current!;
      const getDistance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="process" className="overflow-hidden py-[12vh] lg:py-0">
      <div className="lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="px-6 pb-12 md:px-10">
          <WordReveal
            text="HOW I WORK"
            as="h2"
            className="font-display text-[clamp(3rem,8vw,8rem)]"
          />
        </div>
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-6 will-change-transform md:px-10 lg:w-max lg:flex-row lg:gap-8 lg:pr-[40vw]"
        >
          {steps.map((step) => (
            <article
              key={step.step}
              className="flex flex-col justify-between rounded-2xl border p-8 lg:h-[46vh] lg:w-[38vw] lg:shrink-0"
              style={{ borderColor: "var(--line)" }}
            >
              <p className="font-mono text-sm text-accent">{step.step}</p>
              <div>
                <h3 className="font-display text-[clamp(1.8rem,3vw,3rem)]">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed opacity-70">
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
