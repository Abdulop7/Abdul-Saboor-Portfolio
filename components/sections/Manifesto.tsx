"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, motionOK } from "@/lib/gsap";

/** One large paragraph, revealed word by word with a scrubbed mask-up. */
export default function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!ref.current || !motionOK()) return;
    const words = ref.current.querySelectorAll<HTMLElement>("[data-word]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.12, y: "0.4em" },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          stagger: 0.6,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            end: "top 15%",
            scrub: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const words = text.split(" ");
  return (
    <section
      ref={ref}
      aria-label="Manifesto"
      className="mx-auto max-w-5xl px-6 py-[16vh] md:px-10"
    >
      <p
        className="text-[clamp(1.5rem,3vw,3rem)] font-medium leading-snug tracking-tight"
        aria-label={text}
      >
        {words.flatMap((word, i) => [
          <span key={i} aria-hidden data-word className="inline-block">
            {word}
          </span>,
          " ",
        ])}
      </p>
    </section>
  );
}
