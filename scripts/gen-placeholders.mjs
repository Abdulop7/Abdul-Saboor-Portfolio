/**
 * Generates placeholder art so the site runs out of the box:
 *  - public/portrait.png    → transparent cut-out silhouette (swap with a real
 *    background-removed portrait, same aspect ratio ~9:11)
 *  - public/projects/*.png  → abstract duotone covers, one per project
 * Pure Node, no deps. Run: node scripts/gen-placeholders.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function png(width, height, pixels /* RGBA Uint8Array */) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 0xffffffff);

// ---------- portrait ----------
function portrait() {
  const W = 900, H = 1100;
  const px = Buffer.alloc(W * H * 4);
  const rand = rng(7);
  const inside = (x, y) => {
    // head
    const hd = ((x - 450) / 175) ** 2 + ((y - 360) / 205) ** 2 <= 1;
    // neck
    const nk = x > 385 && x < 515 && y > 480 && y < 640;
    // shoulders
    const sh = ((x - 450) / 430) ** 2 + ((y - 1160) / 480) ** 2 <= 1 && y > 560;
    return hd || nk || sh;
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (inside(x, y)) {
        const shade = 22 + (y / H) * 14 + rand() * 6;
        px[i] = shade; px[i + 1] = shade + 2; px[i + 2] = shade - 2; px[i + 3] = 255;
      } // else transparent
    }
  }
  return png(W, H, px);
}

// ---------- project covers ----------
function cover(seed, [r1, g1, b1]) {
  const W = 1280, H = 800;
  const px = Buffer.alloc(W * H * 4);
  const rand = rng(seed);
  const blobs = Array.from({ length: 3 }, () => ({
    cx: 200 + rand() * 880, cy: 150 + rand() * 500, rad: 220 + rand() * 260,
  }));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      let t = 0;
      for (const b of blobs) {
        const d = Math.hypot(x - b.cx, y - b.cy) / b.rad;
        t += Math.max(0, 1 - d * d);
      }
      t = Math.min(1, t * 0.75);
      const grid = (x % 128 < 1 || y % 128 < 1) ? 10 : 0;
      const noise = rand() * 7;
      px[i]     = 11 + t * r1 + grid + noise;
      px[i + 1] = 12 + t * g1 + grid + noise;
      px[i + 2] = 10 + t * b1 + grid + noise;
      px[i + 3] = 255;
    }
  }
  return png(W, H, px);
}

// ---------- alt portrait (hover-reveal layer: same pose, lime helmet) ----------
function portraitAlt() {
  const W = 900, H = 1100;
  const px = Buffer.alloc(W * H * 4);
  const rand = rng(7);
  const helmet = (x, y) =>
    ((x - 450) / 200) ** 2 + ((y - 360) / 235) ** 2 <= 1;
  const visor = (x, y) =>
    ((x - 470) / 150) ** 2 + ((y - 375) / 78) ** 2 <= 1 && y > 320;
  const neck = (x, y) => x > 385 && x < 515 && y > 480 && y < 640;
  const shoulders = (x, y) =>
    ((x - 450) / 430) ** 2 + ((y - 1160) / 480) ** 2 <= 1 && y > 560;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (visor(x, y)) {
        const shade = 12 + rand() * 5;
        px[i] = shade; px[i + 1] = shade; px[i + 2] = shade; px[i + 3] = 255;
      } else if (helmet(x, y)) {
        // acid-lime shell with a vertical falloff
        const t = 1 - (y - 130) / 470;
        const n = rand() * 10;
        px[i] = 150 + t * 40 + n;
        px[i + 1] = 200 + t * 35 + n;
        px[i + 2] = 60 + t * 15 + n;
        px[i + 3] = 255;
      } else if (neck(x, y) || shoulders(x, y)) {
        const shade = 22 + (y / H) * 14 + rand() * 6;
        px[i] = shade; px[i + 1] = shade + 2; px[i + 2] = shade - 2; px[i + 3] = 255;
      }
    }
  }
  return png(W, H, px);
}

mkdirSync("public/projects", { recursive: true });
writeFileSync("public/portrait.png", portrait());
writeFileSync("public/portrait-alt.png", portraitAlt());
const palettes = {
  pulse:  [86, 130, 20],   // lime-leaning
  relay:  [60, 80, 120],   // steel blue
  forge:  [120, 70, 30],   // ember
  atlas:  [30, 100, 90],   // teal
  mono:   [70, 70, 72],    // graphite
};
for (const [slug, pal] of Object.entries(palettes)) {
  writeFileSync(`public/projects/${slug}.png`, cover(slug.length * 41, pal));
}
console.log("placeholders written");
