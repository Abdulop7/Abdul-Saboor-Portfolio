"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, motionOK } from "@/lib/gsap";
import WordReveal from "@/components/ui/WordReveal";
import PortraitFX from "@/components/ui/PortraitFX";
import HeroField from "@/components/ui/HeroField";
import { scrollToAnchor } from "@/components/providers/SmoothScroll";
import portraitImg from "@/public/portrait.png";
import portraitAltImg from "@/public/portrait-alt.png";
import type { SiteData } from "@/lib/types";

/**
 * Inset-card hero: content lives in a rounded ink card floating on the accent
 * field. On scroll the card scales to fill the viewport and the frame drains.
 * The cut-out portrait occludes the back headline; the serif line sits in front.
 */
export default function Hero({ site }: { site: SiteData }) {
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (!motionOK()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.94, borderRadius: 40 },
        {
          scale: 1,
          borderRadius: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=60%",
            scrub: true,
          },
        }
      );

      // portrait rises in after the preloader curtain
      const enter = () =>
        gsap.fromTo(
          portraitRef.current,
          { yPercent: 10, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, ease: "outExpo", delay: 0.25 }
        );
      if (document.body.dataset.loaded === "true") enter();
      else window.addEventListener("preloader:done", enter, { once: true });

      // gentle parallax on a separate wrapper so tweens never fight
      gsap.to(parallaxRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      ScrollTrigger.create({
        start: 10,
        once: true,
        onEnter: () =>
          gsap.to(hintRef.current, { opacity: 0, duration: 0.4, ease: "inHard" }),
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const backWords = site.hero.lineBack.split(" ");

  return (
    <section ref={rootRef} id="top" className="relative h-[170vh] bg-accent">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={cardRef}
          className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-ink text-bone will-change-transform md:block"
          style={{ borderRadius: 40 }}
        >
          {/* full-bleed WebGL field: drifting contours + fluid cursor trail
              that reveals the texture beneath. -z-10 keeps it above the card
              bg but under every content layer. */}
          <HeroField revealSrc={site.hero.bgReveal} className="-z-10" />

          {/* kicker */}
          <p className="mono-caption relative z-10 order-3 px-8 pb-0 pt-5 text-center text-bone/50 md:absolute md:inset-x-0 md:top-24 md:z-auto md:order-none md:p-0">
            {site.hero.kicker}
          </p>

          {/* headline — BACK layer, occluded by the portrait */}
          <div className="relative z-10 order-2 mt-1 text-center md:absolute md:inset-x-0 md:top-[17vh] md:z-0 md:mt-0">
            {backWords.map((word, i) => (
              <WordReveal
                key={word}
                text={word}
                as="span"
                trigger="load"
                delay={0.1 + i * 0.09}
                className="font-display block text-[clamp(3rem,11vw,12rem)] text-bone"
              />
            ))}
          </div>

          {/* portrait — parallax wrapper outside, entrance wrapper inside */}
          <div
            ref={parallaxRef}
            className="pointer-events-none relative z-10 order-1 flex h-[50vh] shrink-0 items-end justify-center overflow-hidden md:absolute md:inset-x-0 md:bottom-0 md:h-[78vh] md:overflow-visible"
          >
            <div ref={portraitRef} className="flex h-full items-end justify-center">
              <PortraitFX
                image={portraitImg}
                altImage={portraitAltImg}
                alt={`Cut-out portrait of ${site.name}`}
                className="origin-bottom scale-[1.08] md:scale-100"
              />
            </div>
          </div>

          {/* headline — FRONT layer, serif italic across the subject */}
          <div className="relative z-10 order-2 pb-1 text-center md:absolute md:left-[54%] md:top-[47%] md:z-20 md:pb-0 md:text-left">
            <WordReveal
              text={site.hero.lineFront}
              as="span"
              trigger="load"
              delay={0.5}
              className="font-serif-display text-[clamp(2.4rem,6.5vw,7rem)] leading-none text-bone"
            />
          </div>

          {/* left rail — page nav */}
          <nav
            aria-label="Section navigation"
            className="absolute left-8 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
          >
            <ul className="flex flex-col gap-3">
              {site.nav.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToAnchor(link.href)}
                    className="mono-caption text-bone/50 transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* right rail — socials */}
          <ul className="absolute right-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mono-caption text-bone/50 transition-colors duration-200 hover:text-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          {/* corner HUD — currently building */}
          <aside
            aria-label="Currently building"
            className="absolute bottom-8 right-8 z-30 hidden w-64 rounded-xl border border-bone/15 bg-ink/70 p-4 backdrop-blur-sm md:block"
          >
            <div className="flex items-center justify-between">
              <span className="mono-caption text-bone/50">
                {site.currentlyBuilding.label}
              </span>
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
            </div>
            <p className="mt-3 font-mono text-sm text-bone">
              {site.currentlyBuilding.repo}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {site.currentlyBuilding.stack.map((chip) => (
                <li
                  key={chip}
                  className="mono-caption rounded-full border border-bone/15 px-2.5 py-1 text-bone/70"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </aside>

          {/* scroll hint */}
          <p
            ref={hintRef}
            aria-hidden
            className="mono-caption absolute bottom-7 left-1/2 z-30 -translate-x-1/2 text-center text-bone/40 md:bottom-8"
          >
            ( scroll )
          </p>
        </div>
      </div>
    </section>
  );
}
