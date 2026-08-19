/**
 * Generates the hero reveal texture — the image that shows through the hero
 * background wherever the cursor's fluid trail has been. Dark-lime light field.
 * Swap with any 16:9 image at public/hero-reveal.jpg (dark and low-contrast
 * reads best under the contours).
 * Run: node scripts/gen-hero-reveal.mjs
 */
import { execFileSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";

execFileSync(
  ffmpeg,
  [
    "-y",
    "-f", "lavfi", "-i",
    "gradients=s=1920x1080:c0=0x0b0c0a:c1=0x28340c:c2=0x101408:n=3:speed=0.18:d=4:r=30",
    "-ss", "3",
    "-frames:v", "1",
    "-vf", "noise=alls=5:allf=t,vignette=PI/4.5,eq=brightness=0.06:saturation=1.4",
    "public/hero-reveal.jpg",
  ],
  { stdio: "pipe" }
);
console.log("public/hero-reveal.jpg");
