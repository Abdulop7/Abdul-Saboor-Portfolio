/**
 * ByteTuned Careers project cover — the recruiter console (applicant queue +
 * candidate detail with status pipeline, timeline and AI match score) in a
 * floating browser window on the site's ink, lime glow behind. Pure SVG via
 * sharp at 2× → public/projects/careers.png. Run: node scripts/gen-cover-careers.mjs
 */
import sharp from "sharp";
const W = 1280, H = 800;
const INK = "#0b0c0a", BONE = "#f4f4ef", LIME = "#c6f24e";
const F = "Helvetica, Arial, sans-serif", M = "Menlo, Courier, monospace";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const WX = 200, WY = 92, WW = 1020, WH = 672, R = 16, CHROME = 42, HDR = 56;
const t = (x, y, s, size, fill, op = 1, w = 400, anchor = "start", font = F, ls = 0) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${w}" fill="${fill}" fill-opacity="${op}" text-anchor="${anchor}" letter-spacing="${ls}">${esc(s)}</text>`;
const pill = (x, y, label, lime = false, w = null) => { const pw = w ?? label.length * 6.2 + 22; return `<rect x="${x}" y="${y}" width="${pw}" height="20" rx="10" fill="${lime ? LIME : BONE}" fill-opacity="${lime ? 0.16 : 0.08}" stroke="${lime ? LIME : BONE}" stroke-opacity="${lime ? 0.5 : 0.14}"/>` + t(x + pw / 2, y + 13.5, label, 9.5, lime ? LIME : BONE, lime ? 1 : 0.7, 600, "middle", M, 0.8); };
const BODY_Y = WY + CHROME + HDR;

// ---- app header ----
const AV_X = WX + WW - 44, AV_Y = WY + CHROME + 28;
const hdr = `<rect x="${WX}" y="${WY + CHROME}" width="${WW}" height="${HDR}" fill="#0c0d0b"/>
  <line x1="${WX}" y1="${WY + CHROME + HDR}" x2="${WX + WW}" y2="${WY + CHROME + HDR}" stroke="${BONE}" stroke-opacity="0.08"/>
  <rect x="${WX + 36}" y="${WY + CHROME + 17}" width="22" height="22" rx="6" fill="${LIME}"/>${t(WX + 47, WY + CHROME + 33, "b", 15, INK, 1, 800, "middle")}
  ${t(WX + 66, WY + CHROME + 35, "Careers", 15, BONE, 1, 700)}${t(WX + 128, WY + CHROME + 35, "/ Recruiter", 13, BONE, 0.45, 400)}
  ${t(WX + 470, WY + CHROME + 35, "Applicants", 13, LIME, 1, 600, "middle")}${t(WX + 556, WY + CHROME + 35, "Jobs", 13, BONE, 0.6, 500, "middle")}${t(WX + 626, WY + CHROME + 35, "Analytics", 13, BONE, 0.6, 500, "middle")}${t(WX + 706, WY + CHROME + 35, "Settings", 13, BONE, 0.6, 500, "middle")}
  <rect x="${WX + 470 - 36}" y="${WY + CHROME + HDR - 2}" width="72" height="2" fill="${LIME}"/>
  <circle cx="${AV_X - 150}" cy="${AV_Y}" r="4" fill="${LIME}"/>${t(AV_X - 140, AV_Y + 4, "Gmail connected", 11, BONE, 0.6, 500)}
  <circle cx="${AV_X}" cy="${AV_Y}" r="16" fill="${BONE}" fill-opacity="0.14"/>${t(AV_X, AV_Y + 5, "R", 13, BONE, 1, 600, "middle")}`;

// ---- left: applicant queue ----
const QX = WX, QW = 372;
let q = `<rect x="${QX}" y="${BODY_Y}" width="${QW}" height="${WH - CHROME - HDR}" fill="#0c0d0b"/><line x1="${QX + QW}" y1="${BODY_Y}" x2="${QX + QW}" y2="${WY + WH}" stroke="${BONE}" stroke-opacity="0.08"/>`;
q += t(QX + 24, BODY_Y + 34, "Senior Fullstack Developer", 14, BONE, 1, 700);
q += t(QX + 24, BODY_Y + 52, "Multan · Hybrid  ·  14 applicants", 11, BONE, 0.45);
q += `<rect x="${QX + 24}" y="${BODY_Y + 66}" width="${QW - 48}" height="34" rx="8" fill="#0e0f0d" stroke="${BONE}" stroke-opacity="0.14"/>` + t(QX + 38, BODY_Y + 88, "Search applicants…", 12, BONE, 0.35);
let qy = BODY_Y + 112;
q += pill(QX + 24, qy, "ALL 14", true) + pill(QX + 88, qy, "NEW 5") + pill(QX + 148, qy, "REVIEWING 4") + pill(QX + 240, qy, "INVITED 3");
qy += 36;
const rows = [
  ["Ayesha Khan", "NEW", "2h ago", 92, false],
  ["Hamza Malik", "INTERVIEW_INVITED", "Replied · 1d", 88, true],
  ["Sara Ahmed", "REVIEWING", "3d ago", 81, false],
  ["Bilal Hussain", "NEW", "5h ago", 76, false],
  ["Zainab Raza", "INTERVIEWED", "Booked · Fri", 74, false],
  ["Usman Tariq", "REVIEWING", "1w ago", 69, false],
];
rows.forEach(([name, status, when, score, active], i) => {
  const ry = qy + i * 62;
  if (active) q += `<rect x="${QX + 12}" y="${ry - 8}" width="${QW - 24}" height="56" rx="10" fill="${LIME}" fill-opacity="0.1" stroke="${LIME}" stroke-opacity="0.35"/>`;
  else q += `<line x1="${QX + 24}" y1="${ry + 48}" x2="${QX + QW - 24}" y2="${ry + 48}" stroke="${BONE}" stroke-opacity="0.06"/>`;
  q += `<circle cx="${QX + 42}" cy="${ry + 18}" r="16" fill="${BONE}" fill-opacity="0.1"/>` + t(QX + 42, ry + 23, name.split(" ").map(n => n[0]).join(""), 11, BONE, 0.9, 700, "middle");
  q += t(QX + 68, ry + 14, name, 13, BONE, active ? 1 : 0.92, 600) + t(QX + 68, ry + 32, when, 10.5, BONE, 0.45);
  q += t(QX + QW - 26, ry + 14, `${score}%`, 12, score >= 85 ? LIME : BONE, score >= 85 ? 1 : 0.6, 700, "end", M);
  const st = status.replace("_", " "); const sw = st.length * 5.8 + 14;
  q += `<rect x="${QX + QW - 26 - sw}" y="${ry + 22}" width="${sw}" height="16" rx="8" fill="${BONE}" fill-opacity="0.08"/>` + t(QX + QW - 26 - sw / 2, ry + 33, st, 8, BONE, 0.6, 600, "middle", M, 0.6);
});

// ---- right: candidate detail ----
const DX = WX + QW + 32, DW = WW - QW - 64;
let d = "";
d += `<circle cx="${DX + 24}" cy="${BODY_Y + 44}" r="24" fill="${BONE}" fill-opacity="0.1"/>` + t(DX + 24, BODY_Y + 50, "HM", 15, BONE, 0.9, 700, "middle");
d += t(DX + 62, BODY_Y + 40, "Hamza Malik", 20, BONE, 1, 700) + t(DX + 62, BODY_Y + 58, "Lahore · 4 yrs · React, NestJS, PostgreSQL", 11.5, BONE, 0.5);
d += `<rect x="${DX + DW - 150}" y="${BODY_Y + 26}" width="150" height="36" rx="18" fill="${LIME}"/>` + t(DX + DW - 75, BODY_Y + 49, "Send interview invite", 12, INK, 1, 700, "middle");
// AI match card
const MY = BODY_Y + 84;
d += `<rect x="${DX}" y="${MY}" width="${DW}" height="64" rx="12" fill="#0e0f0d" stroke="${BONE}" stroke-opacity="0.12"/>`;
d += t(DX + 18, MY + 22, "AI MATCH SCORE", 9.5, BONE, 0.5, 600, "start", M, 1.4);
d += t(DX + 18, MY + 48, "88", 26, LIME, 1, 700, "start", M) + t(DX + 56, MY + 48, "/100", 12, BONE, 0.45, 400, "start", M);
d += `<rect x="${DX + 110}" y="${MY + 46}" width="${DW - 130}" height="5" rx="2.5" fill="${BONE}" fill-opacity="0.1"/><rect x="${DX + 110}" y="${MY + 46}" width="${(DW - 130) * 0.88}" height="5" rx="2.5" fill="${LIME}"/>`;
d += t(DX + 110, MY + 34, "Strong on NestJS + Prisma · gap: Redis queues · 4/4 must-haves", 11, BONE, 0.65);
d += t(DX + DW - 18, MY + 22, "cached · regenerate", 9.5, BONE, 0.4, 500, "end", M);
// status pipeline
const SY = MY + 88;
d += t(DX, SY, "STATUS", 9.5, BONE, 0.5, 600, "start", M, 1.4);
const stages = ["NEW", "REVIEWING", "INVITED", "INTERVIEWED", "HIRED"], cur = 2;
const segW = (DW - 8 * 4) / 5;
stages.forEach((s, i) => { const sx = DX + i * (segW + 8); const on = i <= cur, here = i === cur;
  d += `<rect x="${sx}" y="${SY + 10}" width="${segW}" height="28" rx="6" fill="${here ? LIME : on ? LIME : BONE}" fill-opacity="${here ? 1 : on ? 0.22 : 0.06}"/>` + t(sx + segW / 2, SY + 28, s, 9.5, here ? INK : on ? LIME : BONE, here ? 1 : on ? 1 : 0.45, 700, "middle", M, 0.6); });
// timeline
const TY = SY + 64;
d += t(DX, TY, "ACTIVITY", 9.5, BONE, 0.5, 600, "start", M, 1.4);
const ev = [
  ["REPLY_RECEIVED", "Candidate replied to interview invite", "1d ago", true],
  ["INVITE_SENT", "Interview invite sent via Gmail · thread 18c4…", "3d ago", false],
  ["NOTE_ADDED", "“Strong systems thinking, ask about queue design” · ★★★★☆", "4d ago", false],
  ["STATUS_CHANGED", "NEW → REVIEWING by recruiter@bytetuned.com", "5d ago", false],
  ["APPLIED", "Applied to Senior Fullstack Developer", "6d ago", false],
];
const lx = DX + 9;
d += `<line x1="${lx}" y1="${TY + 18}" x2="${lx}" y2="${TY + 18 + (ev.length - 1) * 44}" stroke="${BONE}" stroke-opacity="0.14"/>`;
ev.forEach(([type, desc, when, hot], i) => { const ey = TY + 18 + i * 44;
  d += `<circle cx="${lx}" cy="${ey}" r="${hot ? 6 : 4}" fill="${hot ? LIME : "#101210"}" stroke="${hot ? LIME : BONE}" stroke-opacity="${hot ? 1 : 0.35}" stroke-width="1.5"/>`;
  if (hot) d += `<circle cx="${lx}" cy="${ey}" r="11" fill="none" stroke="${LIME}" stroke-opacity="0.35"/>`;
  d += t(DX + 28, ey - 3, type, 9, hot ? LIME : BONE, hot ? 1 : 0.5, 700, "start", M, 0.8);
  d += t(DX + 28, ey + 13, desc, 12, BONE, 0.85);
  d += t(DX + DW, ey + 13, when, 10.5, BONE, 0.4, 400, "end"); });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${LIME}" stop-opacity="0.34"/><stop offset="55%" stop-color="${LIME}" stop-opacity="0.10"/><stop offset="100%" stop-color="${LIME}" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" cx="50%" cy="45%" r="70%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/></radialGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="44" stdDeviation="40" flood-color="#000" flood-opacity="0.85"/></filter>
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
    ${hdr}${q}${d}
  </g>
  <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="${R}" fill="none" stroke="${BONE}" stroke-opacity="0.14"/>
</g>
<rect width="100%" height="100%" filter="url(#grain)" opacity="0.9"/>
<rect width="100%" height="100%" fill="url(#vig)"/>
</svg>`;
await sharp(Buffer.from(svg), { density: 144 }).png({ compressionLevel: 9, palette: true, quality: 92 }).toFile("public/projects/careers.png");
console.log("public/projects/careers.png");
