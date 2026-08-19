"use client";

import { useLayoutEffect, useRef, createElement } from "react";
import { gsap, motionOK } from "@/lib/gsap";

/**
 * Splits text into words, each clipped in a .mask-line and revealed with a
 * y:112%→0 mask-up. Server renders real text (SEO-safe); GSAP animates client-side.
 * trigger="scroll" reveals on enter; trigger="load" plays after the preloader.
 */
export default function WordReveal({
  text,
  as = "span",
  className = "",
  trigger = "scroll",
  delay = 0,
  stagger = 0.06,
  ariaLabel,
}: {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!ref.current || !motionOK()) return;
    const targets = ref.current.querySelectorAll<HTMLElement>(
      ".mask-line > span"
    );

    const ctx = gsap.context(() => {
      const vars: gsap.TweenVars = {
        y: 0,
        duration: 1.0,
        ease: "outExpo",
        stagger,
        delay,
      };
      if (trigger === "scroll") {
        gsap.to(targets, {
          ...vars,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      } else {
        const play = () => gsap.to(targets, vars);
        if (document.body.dataset.loaded === "true") play();
        else window.addEventListener("preloader:done", play, { once: true });
      }
    }, ref);
    return () => ctx.revert();
  }, [trigger, delay, stagger]);

  const words = text.split(" ");
  return createElement(
    as,
    { ref, className, "aria-label": ariaLabel ?? text },
    words.flatMap((word, i) => [
      createElement(
        "span",
        { key: i, "aria-hidden": true, className: "mask-line" },
        createElement("span", null, word)
      ),
      i < words.length - 1 ? " " : null,
    ])
  );
}
