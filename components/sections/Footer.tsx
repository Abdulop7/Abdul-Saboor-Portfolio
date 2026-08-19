"use client";

import Magnetic from "@/components/ui/Magnetic";
import type { SiteData } from "@/lib/types";

/**
 * Sticky-reveal footer via the clip-path pattern: the wrapper reserves 70vh of
 * layout space and clips a viewport-fixed footer to its own box (clip-path does
 * NOT create a containing block for fixed children, unlike transform). As the
 * wrapper scrolls into view it uncovers the stationary footer — no z-index
 * layering, no transparent-margin tricks, no theme-flip seams.
 */
export default function Footer({ site }: { site: SiteData }) {
  const year = new Date().getFullYear();

  return (
    <div className="relative h-[70vh]" style={{ clipPath: "inset(0 0 0 0)" }}>
      <footer
        className="fixed bottom-0 left-0 flex h-[70vh] w-full flex-col justify-between overflow-hidden px-6 pt-12 md:px-10"
        aria-label="Footer"
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <p className="mono-caption opacity-60">© {year} — {site.name}</p>
          <p className="mono-caption opacity-60">Built with {site.footer.builtWith}</p>
          <Magnetic>
            <button
              onClick={() => window.__lenis?.scrollTo(0, { duration: 1.6 })}
              aria-label="Back to top"
              data-cursor="TOP"
              className="flex h-12 w-12 items-center justify-center rounded-full border text-lg transition-colors duration-200 hover:bg-accent hover:text-ink"
              style={{ borderColor: "var(--line)" }}
            >
              ↑
            </button>
          </Magnetic>
        </div>

        <div aria-hidden className="translate-y-[28%] select-none">
          <p className="font-display whitespace-nowrap text-center text-[clamp(6rem,22vw,26rem)] leading-none opacity-90">
            {site.firstName}
          </p>
        </div>
      </footer>
    </div>
  );
}
