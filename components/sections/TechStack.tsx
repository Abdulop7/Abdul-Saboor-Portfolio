"use client";

import { useState } from "react";
import Marquee from "@/components/ui/Marquee";
import TechIcon from "@/components/ui/TechIcon";
import WordReveal from "@/components/ui/WordReveal";
import type { TechStackData } from "@/lib/types";

/**
 * Sticky category rail on the left; monochrome tile grid on the right.
 * Tiles colorize + lift on hover with a years/usage tooltip.
 */
export default function TechStack({ data }: { data: TechStackData }) {
  const [filter, setFilter] = useState<string>("all");

  const visible =
    filter === "all"
      ? data.categories
      : data.categories.filter((c) => c.id === filter);

  return (
    <section id="stack" className="px-6 py-[12vh] md:px-10">
      <div className="mb-16 flex items-end justify-between gap-6">
        <WordReveal
          text="STACK"
          as="h2"
          className="font-display text-[clamp(3rem,8vw,8rem)]"
        />
        <p className="mono-caption hidden max-w-56 text-right opacity-50 md:block">
          Tools are boring on purpose — outcomes aren&apos;t
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
        {/* sticky rail */}
        <nav aria-label="Stack categories" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-x-5 gap-y-3 lg:flex-col lg:gap-3">
            {[{ id: "all", label: "Everything" }, ...data.categories].map(
              (c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setFilter(c.id)}
                    aria-pressed={filter === c.id}
                    className={`mono-caption transition-colors duration-200 ${
                      filter === c.id
                        ? "text-accent"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    {filter === c.id ? "● " : ""}
                    {c.label}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* tile grid */}
        <div className="flex flex-col gap-14">
          {visible.map((category) => (
            <div key={category.id}>
              <h3 className="mono-caption mb-5 opacity-50">{category.label}</h3>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {category.items.map((item) => (
                  <li key={item.name}>
                    <div
                      tabIndex={0}
                      className="group relative flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-xl border transition-transform duration-300 ease-out-expo hover:-translate-y-1 focus-visible:-translate-y-1"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <span className="relative h-9 w-9">
                        <TechIcon
                          slug={item.icon}
                          className="absolute inset-0 h-9 w-9 opacity-60 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0"
                        />
                        <TechIcon
                          slug={item.icon}
                          color
                          className="absolute inset-0 h-9 w-9 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
                        />
                      </span>
                      <span className="text-sm font-medium">{item.name}</span>
                      {/* tooltip */}
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute inset-x-2 bottom-2 translate-y-1 rounded-lg bg-ink/95 p-3 text-left opacity-0 backdrop-blur transition-all duration-300 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                      >
                        <p className="mono-caption text-accent">
                          {item.years} yrs
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-bone/80">
                          {item.use}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* top-12 marquee */}
      <div className="mt-24 border-y py-8" style={{ borderColor: "var(--line)" }}>
        <Marquee speed={30}>
          {data.marquee.map((slug) => (
            <span key={slug} className="mx-10 opacity-40 transition-opacity hover:opacity-100">
              <TechIcon slug={slug} className="h-10 w-10" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
