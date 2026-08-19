/**
 * EMA Futures Bot project cover — the bot's own dashboard: live 4-EMA chart with
 * candles, signal readout, optimizer combo, fleet selector and an open position,
 * in a floating browser window on the site's ink with a lime glow. Pure SVG via
 * sharp at 2× → public/projects/ema-bot.png. Run: node scripts/gen-cover-ema-bot.mjs
 */
import sharp from "sharp";
const W = 1280, H = 800;
const INK = "#0b0c0a", BONE = "#f4f4ef", LIME = "#c6f24e";
const F = "Helvetica, Arial, sans-serif", M = "Menlo, Courier, monospace";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const WX = 200, WY = 92, WW = 1020, WH = 672, R = 16, CHROME = 42, HDR = 56;
const t = (x, y, s, size, fill, op = 1, w = 400, anchor = "start", font = F, ls = 0) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${w}" fill="${fill}" fill-opacity="${op}" text-anchor="${anchor}" letter-spacing="${ls}">${esc(s)}</text>`;
const BODY_Y = WY + CHROME + HDR;

// ---- deterministic price series + EMAs ----
const rng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff);
const rand = rng(42);
let p = 400; const pts = [];
for (let i = 0; i < 110; i++) { p += (rand() - 0.46) * 13; pts.push(p); }
const ema = (arr, n) => { const k = 2 / (n + 1); let e = arr[0]; return arr.map(v => (e = v * k + e * (1 - k))); };
const E5 = ema(pts, 5), E13 = ema(pts, 13), E34 = ema(pts, 34), E89 = ema(pts, 89);

// ---- app header ----
const AV_X = WX + WW - 44, AV_Y = WY + CHROME + 28;
const hdr = `<rect x="${WX}" y="${WY + CHROME}" width="${WW}" height="${HDR}" fill="#0c0d0b"/>
  <line x1="${WX}" y1="${WY + CHROME + HDR}" x2="${WX + WW}" y2="${WY + CHROME + HDR}" stroke="${BONE}" stroke-opacity="0.08"/>
  <rect x="${WX + 36}" y="${WY + CHROME + 17}" width="22" height="22" rx="6" fill="${LIME}"/>
  <path d="M${WX + 41} ${WY + CHROME + 33} l5 -8 l4 4 l7 -9" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  ${t(WX + 66, WY + CHROME + 35, "EMA Bot", 15, BONE, 1, 700)}${t(WX + 132, WY + CHROME + 35, "/ Terminal", 13, BONE, 0.45)}
  ${t(WX + 470, WY + CHROME + 35, "Terminal", 13, LIME, 1, 600, "middle")}${t(WX + 548, WY + CHROME + 35, "Logs", 13, BONE, 0.6, 500, "middle")}${t(WX + 620, WY + CHROME + 35, "Backtest", 13, BONE, 0.6, 500, "middle")}${t(WX + 698, WY + CHROME + 35, "News", 13, BONE, 0.6, 500, "middle")}
  <rect x="${WX + 470 - 36}" y="${WY + CHROME + HDR - 2}" width="72" height="2" fill="${LIME}"/>
  <rect x="${AV_X - 196}" y="${AV_Y - 14}" width="120" height="28" rx="14" fill="${BONE}" fill-opacity="0.06" stroke="${BONE}" stroke-opacity="0.14"/>
  ${t(AV_X - 136, AV_Y + 4, "SOLUSDT  ▾", 11, BONE, 0.85, 600, "middle", M)}
  <circle cx="${AV_X - 52}" cy="${AV_Y}" r="4" fill="${LIME}"><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle>
  ${t(AV_X - 42, AV_Y + 4, "ACTIVE", 10, LIME, 1, 700, "start", M, 1.2)}`;

// ---- left: chart panel ----
const CX = WX + 28, CY = BODY_Y + 24, CW = 640, CH = 420;
const lo = Math.min(...pts) - 18, hi = Math.max(...pts) + 18;
const X = (i) => CX + 16 + i * ((CW - 32) / 109);
const Y = (v) => CY + 44 + (1 - (v - lo) / (hi - lo)) * (CH - 80);
const path = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
let chart = `<rect x="${CX}" y="${CY}" width="${CW}" height="${CH}" rx="12" fill="#0e0f0d" stroke="${BONE}" stroke-opacity="0.1"/>`;
chart += t(CX + 18, CY + 26, "SOLUSDT · 3m", 12, BONE, 0.9, 700, "start", M) + t(CX + 122, CY + 26, "EMA 5 · 13 · 34 · 89", 11, BONE, 0.45, 400, "start", M);
chart += t(CX + CW - 18, CY + 26, `${pts[pts.length - 1].toFixed(2)}`, 14, LIME, 1, 700, "end", M);
// grid
for (let g = 0; g < 6; g++) { const gy = CY + 44 + g * ((CH - 80) / 5); chart += `<line x1="${CX + 16}" y1="${gy}" x2="${CX + CW - 16}" y2="${gy}" stroke="${BONE}" stroke-opacity="0.06"/>`; chart += t(CX + CW - 18, gy - 4, (hi - (g / 5) * (hi - lo)).toFixed(0), 9, BONE, 0.3, 400, "end", M); }
// candles
const r2 = rng(7);
for (let i = 0; i < 110; i++) {
  const o = pts[i] + (r2() - 0.5) * 6, c = pts[i] + (r2() - 0.5) * 6;
  const h = Math.max(o, c) + r2() * 5, l = Math.min(o, c) - r2() * 5, up = c >= o, x = X(i);
  const col = up ? LIME : BONE;
  chart += `<line x1="${x}" y1="${Y(h)}" x2="${x}" y2="${Y(l)}" stroke="${col}" stroke-opacity="${up ? 0.5 : 0.3}" stroke-width="1"/>`;
  chart += `<rect x="${x - 2}" y="${Y(Math.max(o, c))}" width="4" height="${Math.max(1, Math.abs(Y(o) - Y(c)))}" fill="${up ? LIME : "#0e0f0d"}" fill-opacity="${up ? 0.75 : 1}" stroke="${col}" stroke-opacity="${up ? 0 : 0.45}"/>`;
}
// EMAs
chart += `<path d="${path(E89)}" fill="none" stroke="${BONE}" stroke-opacity="0.28" stroke-width="1.8"/>`;
chart += `<path d="${path(E34)}" fill="none" stroke="${BONE}" stroke-opacity="0.5" stroke-width="1.8"/>`;
chart += `<path d="${path(E13)}" fill="none" stroke="${LIME}" stroke-opacity="0.7" stroke-width="2"/>`;
chart += `<path d="${path(E5)}" fill="none" stroke="${LIME}" stroke-width="2.4"/>`;
// entry marker on the last BUY-stack candle
const ei = 78; chart += `<line x1="${X(ei)}" y1="${CY + 44}" x2="${X(ei)}" y2="${CY + CH - 36}" stroke="${LIME}" stroke-opacity="0.35" stroke-dasharray="3 4"/>`;
chart += `<polygon points="${X(ei) - 6},${Y(pts[ei]) + 14} ${X(ei) + 6},${Y(pts[ei]) + 14} ${X(ei)},${Y(pts[ei]) + 4}" fill="${LIME}"/>`;
chart += `<rect x="${X(ei) - 22}" y="${Y(pts[ei]) + 18}" width="44" height="16" rx="8" fill="${LIME}"/>` + t(X(ei), Y(pts[ei]) + 29.5, "BUY", 9, INK, 1, 800, "middle", M, 1);
// TP / SL levels
const tpY = Y(pts[ei] * 1.0112), slY = Y(pts[ei] * 0.9962);
chart += `<line x1="${X(ei)}" y1="${tpY}" x2="${CX + CW - 16}" y2="${tpY}" stroke="${LIME}" stroke-opacity="0.5" stroke-dasharray="2 3"/>` + t(CX + CW - 18, tpY - 4, "TP 1.12%", 9, LIME, 0.9, 600, "end", M);
chart += `<line x1="${X(ei)}" y1="${slY}" x2="${CX + CW - 16}" y2="${slY}" stroke="${BONE}" stroke-opacity="0.35" stroke-dasharray="2 3"/>` + t(CX + CW - 18, slY + 11, "SL 0.38%", 9, BONE, 0.5, 600, "end", M);
// legend
const leg = [["EMA5", LIME, 1], ["EMA13", LIME, 0.7], ["EMA34", BONE, 0.5], ["EMA89", BONE, 0.28]];
leg.forEach(([n, c, o], i) => { const lx = CX + 18 + i * 74; chart += `<line x1="${lx}" y1="${CY + CH - 16}" x2="${lx + 14}" y2="${CY + CH - 16}" stroke="${c}" stroke-opacity="${o}" stroke-width="2"/>` + t(lx + 20, CY + CH - 12.5, n, 9.5, BONE, 0.5, 400, "start", M); });

// ---- below chart: status strip ----
const SY = CY + CH + 18;
const cell = (x, w, label, val, valColor = BONE, valOp = 1) => `<rect x="${x}" y="${SY}" width="${w}" height="64" rx="10" fill="#0e0f0d" stroke="${BONE}" stroke-opacity="0.1"/>` + t(x + 14, SY + 22, label, 9.5, BONE, 0.45, 600, "start", M, 1.2) + t(x + 14, SY + 48, val, 16, valColor, valOp, 700, "start", M);
const cw = (CW - 3 * 12) / 4;
chart += cell(CX, cw, "SIGNAL", "BUY ▲", LIME) + cell(CX + cw + 12, cw, "ATR(14)", "0.612", BONE, 0.9) + cell(CX + 2 * (cw + 12), cw, "IN TRADE", "LONG · 10x", BONE, 0.9) + cell(CX + 3 * (cw + 12), cw, "UNREALIZED", "+$7.84", LIME);

// ---- right: optimizer + position + filters ----
const RX = CX + CW + 20, RW = WX + WW - RX - 28;
let side = "";
// optimizer card
const OY = CY;
side += `<rect x="${RX}" y="${OY}" width="${RW}" height="186" rx="12" fill="#0e0f0d" stroke="${BONE}" stroke-opacity="0.1"/>`;
side += t(RX + 16, OY + 24, "SELF-OPTIMIZER", 9.5, BONE, 0.45, 600, "start", M, 1.4) + t(RX + RW - 16, OY + 24, "30d · 214 trades", 9.5, BONE, 0.4, 400, "end", M);
side += t(RX + 16, OY + 58, "57%", 30, LIME, 1, 700, "start", M) + t(RX + 80, OY + 58, "win rate", 11, BONE, 0.5, 400, "start");
const kv = [["atr range", "0.42 – 0.91"], ["slope", "±0.18"], ["NY session", "ON"], ["weekdays", "ON"], ["tp / sl", "1.12% / 0.38%"]];
kv.forEach(([k, v], i) => { const ky = OY + 84 + i * 19; side += t(RX + 16, ky, k, 10.5, BONE, 0.5, 400, "start", M) + t(RX + RW - 16, ky, v, 10.5, BONE, 0.9, 600, "end", M); });
// position card
const PY = OY + 200;
side += `<rect x="${RX}" y="${PY}" width="${RW}" height="150" rx="12" fill="#0e0f0d" stroke="${LIME}" stroke-opacity="0.4"/>`;
side += t(RX + 16, PY + 24, "OPEN POSITION", 9.5, LIME, 1, 600, "start", M, 1.4);
side += t(RX + 16, PY + 52, "LONG SOLUSDT", 15, BONE, 1, 700) + t(RX + RW - 16, PY + 52, "10x · isolated", 10.5, BONE, 0.5, 400, "end", M);
const pk = [["entry", `${pts[ei].toFixed(2)}`], ["size", "$100 → $1,000"], ["partial TP", "50% @ 30% · BE lock"], ["opened", "14:24 UTC · 3m ago"]];
pk.forEach(([k, v], i) => { const ky = PY + 76 + i * 19; side += t(RX + 16, ky, k, 10.5, BONE, 0.5, 400, "start", M) + t(RX + RW - 16, ky, v, 10.5, BONE, 0.9, 600, "end", M); });
// gate checklist
const GY = PY + 164;
side += `<rect x="${RX}" y="${GY}" width="${RW}" height="${SY + 64 - GY}" rx="12" fill="#0e0f0d" stroke="${BONE}" stroke-opacity="0.1"/>`;
side += t(RX + 16, GY + 24, "ENTRY GATES", 9.5, BONE, 0.45, 600, "start", M, 1.4);
const gates = ["loss-streak cooldown", "optimizer combo", "ATR range", "EMA spread", "NY session", "slope"];
gates.forEach((g, i) => { const gy = GY + 46 + i * 17; side += `<circle cx="${RX + 21}" cy="${gy - 4}" r="4.5" fill="${LIME}"/><path d="M${RX + 18.5} ${gy - 4} l2 2 l3.5 -4" stroke="${INK}" stroke-width="1.4" fill="none"/>` + t(RX + 32, gy, g, 10.5, BONE, 0.8, 400, "start", M); });

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
    ${hdr}${chart}${side}
  </g>
  <rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="${R}" fill="none" stroke="${BONE}" stroke-opacity="0.14"/>
</g>
<rect width="100%" height="100%" filter="url(#grain)" opacity="0.9"/>
<rect width="100%" height="100%" fill="url(#vig)"/>
</svg>`;
await sharp(Buffer.from(svg), { density: 144 }).png({ compressionLevel: 9, palette: true, quality: 92 }).toFile("public/projects/ema-bot.png");
console.log("public/projects/ema-bot.png");
