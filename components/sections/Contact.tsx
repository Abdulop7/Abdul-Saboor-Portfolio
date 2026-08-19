"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, motionOK } from "@/lib/gsap";
import type { SiteData } from "@/lib/types";

/**
 * The inversion moment: as this section enters, the whole page floods with the
 * accent color (body.theme-accent flips the --bg/--fg channels). The giant
 * headline is the mailto link, with per-character hover skew.
 */
export default function Contact({ site }: { site: SiteData }) {
  const rootRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");

  // live local clock in the site owner's timezone
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: site.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [site.timezone]);

  useLayoutEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: "top 55%",
      onEnter: () => document.body.classList.add("theme-accent"),
      onLeaveBack: () => document.body.classList.remove("theme-accent"),
    });
    return () => {
      trigger.kill();
      document.body.classList.remove("theme-accent");
    };
  }, []);

  const onCharEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!motionOK()) return;
    gsap.to(e.currentTarget, {
      yPercent: -14,
      skewY: 6,
      duration: 0.2,
      ease: "outExpo",
      yoyo: true,
      repeat: 1,
    });
  };

  const headline = "LET'S BUILD →";

  return (
    <section
      ref={rootRef}
      id="contact"
      className="flex min-h-screen flex-col justify-center px-6 py-[14vh] md:px-10"
    >
      <a
        href={`mailto:${site.email}`}
        aria-label={`Email ${site.name} at ${site.email}`}
        data-cursor="SAY HI"
        className="font-display block text-[clamp(3rem,11vw,12rem)]"
      >
        {headline.split("").map((char, i) => (
          <span
            key={i}
            aria-hidden
            onMouseEnter={onCharEnter}
            className="inline-block will-change-transform"
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </a>

      <div
        className="mt-[10vh] grid gap-10 border-t pt-10 md:grid-cols-3"
        style={{ borderColor: "var(--line)" }}
      >
        <div>
          <p className="mono-caption opacity-50">Email</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-2 inline-block font-mono text-sm underline decoration-current underline-offset-4"
          >
            {site.email}
          </a>
        </div>
        <div>
          <p className="mono-caption opacity-50">Location</p>
          <p className="mt-2 font-mono text-sm">
            {site.location} ·{" "}
            <span suppressHydrationWarning>{time || "--:--:--"}</span>
          </p>
          <p className="mt-3 flex items-center gap-2 font-mono text-sm">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${
                  site.available ? "animate-ping bg-current opacity-50" : ""
                }`}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>
            {site.availabilityLabel}
          </p>
        </div>
        <div>
          <p className="mono-caption opacity-50">Elsewhere</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm transition-opacity hover:opacity-60"
                >
                  {s.label} · {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
