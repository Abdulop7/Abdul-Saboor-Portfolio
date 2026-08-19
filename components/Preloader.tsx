"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, motionOK } from "@/lib/gsap";

/**
 * 00→100 mono counter, then a clip-path curtain wipe. Dispatches
 * "preloader:done" so the hero can start its mask-up in sync.
 * A wall-clock fallback guarantees completion even in rAF-throttled
 * (backgrounded) tabs where the GSAP ticker is suspended.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      document.body.dataset.loaded = "true";
      window.dispatchEvent(new Event("preloader:done"));
      setGone(true);
    };

    if (!motionOK()) {
      finish();
      return;
    }

    const counter = { n: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(counter, {
      n: 100,
      duration: 1.3,
      ease: "inHard",
      onUpdate: () => {
        if (numRef.current)
          numRef.current.textContent = String(Math.round(counter.n)).padStart(
            2,
            "0"
          );
      },
    }).to(rootRef.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.9,
      ease: "outExpo",
      delay: 0.15,
    });

    // hard fallback: never trap the page behind the curtain
    const failsafe = setTimeout(finish, 4000);

    return () => {
      clearTimeout(failsafe);
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[150] flex items-end justify-between bg-ink p-6 md:p-10"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <span className="mono-caption text-bone/60">Loading portfolio</span>
      <span
        ref={numRef}
        className="font-mono text-7xl font-light tabular-nums text-bone md:text-9xl"
      >
        00
      </span>
    </div>
  );
}
