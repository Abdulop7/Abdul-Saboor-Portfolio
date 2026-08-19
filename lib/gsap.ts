"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  // The two curves used everywhere — never default ease-in-out.
  if (!CustomEase.get("outExpo")) CustomEase.create("outExpo", "0.16,1,0.3,1");
  if (!CustomEase.get("inHard")) CustomEase.create("inHard", "0.7,0,0.84,0");
  if (process.env.NODE_ENV === "development") {
    // dev console handle for debugging scroll choreography
    (window as unknown as Record<string, unknown>).__st = ScrollTrigger;
  }
}

export const motionOK = () =>
  typeof window !== "undefined" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isDesktop = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 1024px)").matches;

export { gsap, ScrollTrigger };
