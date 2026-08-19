"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, motionOK } from "@/lib/gsap";
import type { Metric } from "@/lib/types";

/** Four mono counters with an odometer roll-up when the strip enters. */
export default function Metrics({ metrics }: { metrics: Metric[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!motionOK()) return;
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>("[data-count]");
      nums.forEach((el) => {
        const value = parseFloat(el.dataset.count ?? "0");
        const decimals = parseInt(el.dataset.decimals ?? "0", 10);
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration: 1.6,
          ease: "outExpo",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = counter.n.toFixed(decimals);
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Career metrics"
      className="border-y px-6 py-[10vh] md:px-10"
      style={{ borderColor: "var(--line)" }}
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dd className="font-mono text-[clamp(2.4rem,5vw,4.5rem)] font-light tabular-nums leading-none">
              <span data-count={metric.value} data-decimals={metric.decimals ?? 0}>
                {metric.value.toFixed(metric.decimals ?? 0)}
              </span>
              <span className="text-accent">{metric.suffix}</span>
            </dd>
            <dt className="mono-caption mt-4 opacity-50">{metric.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
