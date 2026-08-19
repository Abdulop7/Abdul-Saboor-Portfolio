/**
 * Manzil project cover — builder form (left) + live resume preview (right) in a
 * floating browser window on the site's ink, lime glow behind. Pure SVG rasterized
 * by sharp at 2× → public/projects/manzil.png. Run: node scripts/gen-cover-manzil.mjs
 */
import sharp from "sharp";
const W = 1280, H = 800;
const INK = "#0b0c0a", BONE = "#f4f4ef", LIME = "#c6f24e";
const F = "Helvetica, Arial, sans-serif", M = "Menlo, Courier, monospace";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const WX = 200, WY = 92, WW = 1020, WH = 672, R = 16, CHROME = 42, HDR = 56;
const t = (x, y, s, size, fill, op = 1, w = 400, anchor = "start", font = F, ls = 0) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${w}" fill="${fill}" fill-opacity="${op}" text-anchor="${anchor}" letter-spacing="${ls}">${esc(s)}</text>`;
const field = (x, y, w, label, value, focus = false) => `
  ${t(x, y, label, 10.5, BONE, 0.5, 500, "start", M, 1.2)}
  <rect x="${x}" y="${y + 8}" width="${w}" height="36" rx="8" fill="#0e0f0d" stroke="${focus ? LIME : BONE}" stroke-opacity="${focus ? 0.8 : 0.14}"/>
  ${t(x + 12, y + 31, value, 13, BONE, value ? 0.9 : 0.3)}`;

const BODY_Y = WY + CHROME + HDR;

// ---- left: builder form ----
const FX = WX + 36, FW = 400;
let fy = BODY_Y + 28, form = "";
form += t(FX, fy + 6, "STEP 3 OF 7", 10, LIME, 1, 600, "start", M, 1.6);
form += t(FX, fy + 38, "Experience", 22, BONE, 1, 700);
form += [0,1,2,3,4,5,6].map(i => `<rect x="${FX + i * 58}" y="${fy + 52}" width="50" height="3" rx="1.5" fill="${i < 3 ? LIME : BONE}" fill-opacity="${i < 3 ? 1 : 0.15}"/>`).join("");
fy += 84;
form += field(FX, fy, FW, "JOB TITLE", "Frontend Developer"); fy += 66;
const half = (FW - 14) / 2;
form += field(FX, fy, half, "COMPANY", "Systems Ltd"); form += field(FX + half + 14, fy, half, "LOCATION", "Lahore, PK"); fy += 66;
form += field(FX, fy, half, "FROM", "Jan 2023"); form += field(FX + half + 14, fy, half, "TO", "Present"); fy += 66;
form += t(FX, fy, "DESCRIPTION", 10.5, BONE, 0.5, 500, "start", M, 1.2);
form += `<rect x="${FX}" y="${fy + 8}" width="${FW}" height="92" rx="8" fill="#0e0f0d" stroke="${LIME}" stroke-opacity="0.8"/>`;
const d1 = "Built the customer dashboard in Next.js,", d2 = "cutting page load from 4.1s to 1.2s and", d3 = "shipping 30+ components to the design";
form += t(FX + 12, fy + 31, d1, 13, BONE, 0.9) + t(FX + 12, fy + 52, d2, 13, BONE, 0.9) + t(FX + 12, fy + 73, d3, 13, BONE, 0.9);
form += `<rect x="${FX + 12 + d3.length * 13 * 0.5 + 2}" y="${fy + 61}" width="2" height="15" fill="${LIME}"/>`;
fy += 122;
form += `<rect x="${FX}" y="${fy}" width="${FW}" height="40" rx="10" fill="none" stroke="${BONE}" stroke-opacity="0.2" stroke-dasharray="4 4"/>` + t(FX + FW / 2, fy + 25, "+  Add another position", 13, BONE, 0.6, 500, "middle");
fy += 62;
form += `<rect x="${FX}" y="${fy}" width="118" height="40" rx="20" fill="none" stroke="${BONE}" stroke-opacity="0.22"/>` + t(FX + 59, fy + 25, "← Back", 13, BONE, 0.8, 500, "middle");
form += `<rect x="${FX + 132}" y="${fy}" width="${FW - 132}" height="40" rx="20" fill="${LIME}"/>` + t(FX + 132 + (FW - 132) / 2, fy + 25, "Continue to Skills →", 13, INK, 1, 700, "middle");

// ---- right: live preview ----
const PX = WX + 500, PW = 472, TOOL_Y = BODY_Y + 26, PY = TOOL_Y + 34, PH = PW * 1.294;
const inkP = "#141512";
let sheet = `<rect x="${PX}" y="${PY + 6}" width="${PW}" height="${PH}" fill="#000" fill-opacity="0.5" rx="3" filter="url(#soft)"/>`;
sheet += `<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="#f6f5ef" rx="3"/>`;
sheet += t(PX + 34, PY + 52, "Abdul Saboor", 24, inkP, 1, 700) + t(PX + 34, PY + 72, "Frontend Developer", 11.5, inkP, 0.6, 500);
sheet += t(PX + PW - 34, PY + 50, "Multan, Pakistan", 9.5, inkP, 0.6, 400, "end") + t(PX + PW - 34, PY + 64, "hello@bytetuned.com", 9.5, inkP, 0.6, 400, "end") + t(PX + PW - 34, PY + 78, "github.com/Abdulop7", 9.5, inkP, 0.6, 400, "end");
sheet += `<rect x="${PX + 34}" y="${PY + 92}" width="${PW - 68}" height="2" fill="${LIME}"/>`;
const sec = (y, s) => t(PX + 34, y, s.toUpperCase(), 9.5, inkP, 1, 700, "start", F, 1.6) + `<rect x="${PX + 34}" y="${y + 6}" width="${PW - 68}" height="0.7" fill="${inkP}" fill-opacity="0.18"/>`;
const line = (y, s, size = 9.5, op = 0.75, w = 400, x = PX + 34) => t(x, y, s, size, inkP, op, w);
const date = (y, s) => t(PX + PW - 34, y, s, 9, inkP, 0.55, 400, "end");
sheet += sec(PY + 118, "Summary") + line(PY + 136, "Frontend developer with 3 years shipping production React and Next.js products.") + line(PY + 150, "Focused on performance, design systems and accessible interfaces.");
sheet += sec(PY + 178, "Experience") + line(PY + 196, "Frontend Developer — Systems Ltd", 10.5, 1, 700) + date(PY + 196, "Jan 2023 — Present") + line(PY + 211, "• Built the customer dashboard in Next.js, cutting page load from 4.1s to 1.2s") + line(PY + 225, "• Shipped 30+ components to the design system") + line(PY + 246, "Junior Developer — Fieldnote", 10.5, 1, 700) + date(PY + 246, "2022 — 2023") + line(PY + 261, "• Rebuilt onboarding flow, +31% activation");
sheet += sec(PY + 290, "Education") + line(PY + 308, "BS Computer Science — BZU Multan", 10.5, 1, 700) + date(PY + 308, "2018 — 2022");
sheet += sec(PY + 338, "Skills");
[["React", 90], ["Next.js", 85], ["TypeScript", 75], ["Tailwind", 90], ["PostgreSQL", 60], ["Prisma", 70]].forEach(([s, v], i) => {
  const col = i % 2, row = (i / 2) | 0, sx = PX + 34 + col * ((PW - 68) / 2 + 8), sy = PY + 360 + row * 24, bw = (PW - 68) / 2 - 108;
  sheet += line(sy, s, 9.5, 0.9, 500, sx) + `<rect x="${sx + 92}" y="${sy - 7}" width="${bw}" height="5" rx="2.5" fill="${inkP}" fill-opacity="0.1"/><rect x="${sx + 92}" y="${sy - 7}" width="${bw * v / 100}" height="5" rx="2.5" fill="${LIME}"/>`; });
sheet += sec(PY + 448, "Languages") + line(PY + 466, "English — Fluent    ·    Urdu — Native    ·    Punjabi — Native");
const toolbar = t(PX, TOOL_Y + 4, "LIVE PREVIEW", 10, BONE, 0.5, 600, "start", M, 1.6)
  + `<rect x="${PX + PW - 180}" y="${TOOL_Y - 10}" width="74" height="26" rx="13" fill="none" stroke="${BONE}" stroke-opacity="0.22"/>` + t(PX + PW - 143, TOOL_Y + 7, "Classic", 11, BONE, 0.85, 500, "middle")
  + `<rect x="${PX + PW - 98}" y="${TOOL_Y - 10}" width="98" height="26" rx="13" fill="${LIME}"/>` + t(PX + PW - 49, TOOL_Y + 7, "↓ Download PDF", 11, INK, 1, 700, "middle");

// ---- app header ----
const AV_X = WX + WW - 44, AV_Y = WY + CHROME + 28;
const hdr = `<rect x="${WX}" y="${WY + CHROME}" width="${WW}" height="${HDR}" fill="#0c0d0b"/>
  <line x1="${WX}" y1="${WY + CHROME + HDR}" x2="${WX + WW}" y2="${WY + CHROME + HDR}" stroke="${BONE}" stroke-opacity="0.08"/>
  ${t(WX + 36, WY + CHROME + 36, "MANZIL", 16, BONE, 1, 800, "start", F, 3)}
  ${t(WX + 380, WY + CHROME + 35, "Templates", 13, BONE, 0.6, 500, "middle")}${t(WX + 470, WY + CHROME + 35, "My Resumes", 13, LIME, 1, 600, "middle")}${t(WX + 560, WY + CHROME + 35, "Pricing", 13, BONE, 0.6, 500, "middle")}
  <circle cx="${AV_X}" cy="${AV_Y}" r="16" fill="${BONE}" fill-opacity="0.14"/>${t(AV_X, AV_Y + 5, "A", 13, BONE, 1, 600, "middle")}
  <path d="M ${AV_X - 8} ${AV_Y - 15} l 3 -7 l 5 5 l 0 -7 l 5 7 l 3 -5 l -3 12 z" fill="${LIME}"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${LIME}" stop-opacity="0.34"/><stop offset="55%" stop-color="${LIME}" stop-opacity="0.10"/><stop offset="100%" stop-color="${LIME}" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" cx="50%" cy="45%" r="70%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/></radialGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="44" stdDeviation="40" flood-color="#000" flood-opacity="0.85"/></filter>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="blur"><feGaussianBlur stdDeviation="26"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer></filter>
  <clipPath id="win"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="${R}"/></clipPath>
</defs>
<rect width="100%" height="100%" fill="${INK}"/>
<ellipse cx="${WX + WW * 0.68}" cy="${WY + WH * 0.62}" rx="520" ry="330" fill="url(#glow)" filter="url(#blur)"/>
<g transform="translate(${WX + WW * 0.6} ${WY + WH / 2}) skewY(-2.2) scale(0.985 1) translate(${-(WX + WW * 0.6)} ${-(WY + WH / 2)})">
  <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="${R}" fill="#101210" filter="url(#shadow)"/>
  <g clip-path="url(#win)">
    <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" fill="#101210"/>
    <rect x="${WX}" y="${WY}" width="${WW}" height="${CHROME}" fill="#0e0f0d"/>
    <line x1="${WX}" y1="${WY + CHROME}" x2="${WX + WW}" y2="${WY + CHROME}" stroke="${BONE}" stroke-opacity="0.08"/>
    ${[0,1,2].map(i => `<circle cx="${WX + 22 + i * 19}" cy="${WY + 21}" r="5.5" fill="${BONE}" fill-opacity="0.16"/>`).join("")}
    <rect x="${WX + 96}" y="${WY + 10}" width="380" height="22" rx="6" fill="${BONE}" fill-opacity="0.06"/>
    ${hdr}
    <line x1="${WX + 472}" y1="${BODY_Y}" x2="${WX + 472}" y2="${WY + WH}" stroke="${BONE}" stroke-opacity="0.08"/>
    ${form}${sheet}${toolbar}
  </g>
  <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="${R}" fill="none" stroke="${BONE}" stroke-opacity="0.14"/>
</g>
<rect width="100%" height="100%" filter="url(#grain)" opacity="0.9"/>
<rect width="100%" height="100%" fill="url(#vig)"/>
</svg>`;
await sharp(Buffer.from(svg), { density: 144 }).png({ compressionLevel: 9, palette: true, quality: 92 }).toFile("public/projects/manzil.png");
console.log("public/projects/manzil.png");
