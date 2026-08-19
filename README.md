# Portfolio

Editorial single-page portfolio. Inset-card hero on an acid-lime field, cut-out
portrait occluding display type, sticky-stacked case cards, scroll-driven
everything. Built to an Awwwards-HM bar, not a template.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · GSAP
(ScrollTrigger + CustomEase) · Lenis · Framer Motion · simple-icons

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export-ready production build
```

## Where to swap things

| What | Where |
| --- | --- |
| **Portrait PNG** | Replace `public/portrait.png` with a background-removed portrait (transparent PNG, ~9:11 aspect, ≥900px wide). The placeholder silhouette is generated — the head must occlude the headline, so keep the subject centered with headroom. |
| **Accent color** | Three places, keep in sync: `--accent` in `app/globals.css`, `accent` in `tailwind.config.ts`, and `accent` in `data/site.json`. |
| **Name / copy / socials / metrics / manifesto / process / testimonials** | `data/site.json` |
| **Tech stack** | `data/techStack.json` — `icon` values are [simple-icons](https://simpleicons.org) slugs; new slugs must also be imported in `components/ui/TechIcon.tsx` (explicit imports keep tree-shaking). |
| **Projects** | `data/projects.json` — drop cover art in `public/projects/`, optional `video` (muted loop shown on hover), `live`/`repo` links may be `null`. |
| **Experience** | `data/experience.json` |
| **Project cover art** | Replace the generated `public/projects/*.png` (1280×800). Regenerate placeholders anytime: `node scripts/gen-placeholders.mjs`. |

Nothing is hardcoded in JSX — all content flows from `data/*.json` through the
typed loaders in `lib/data.ts` (`lib/types.ts` defines the shapes). Data is read
server-side; no JSON ships in the client bundle.

## Architecture

```
app/                    layout (fonts, grain, cursor, Lenis) + page assembly
components/
  providers/            SmoothScroll — Lenis + GSAP ticker sync
  ui/                   Cursor, Magnetic, WordReveal, Marquee, TechIcon
  sections/             Hero, Manifesto, TechStack, Projects, Experience,
                        Metrics, Process, Testimonials, Contact, Footer
  Preloader, Header     00→100 counter + curtain; fixed chrome + nav overlay
data/                   site.json, techStack.json, projects.json, experience.json
lib/                    types, data loaders, gsap setup (CustomEase curves)
scripts/                placeholder art generator (pure Node, no deps)
```

## Motion system

- Lenis smooth scroll (`lerp 0.08`), all scroll choreography via ScrollTrigger.
- Two custom curves everywhere: `outExpo (0.16,1,0.3,1)` entrances,
  `inHard (0.7,0,0.84,0)` exits. No default eases.
- Only `transform`/`opacity` are animated; velocity feedback (skew + chromatic
  ghost) is clamped and driven by `ScrollTrigger.getVelocity()`.
- The contact section flips the page to the accent color by toggling
  `body.theme-accent` — all colors flow through `--bg`/`--fg`/`--line` channels.
- `prefers-reduced-motion`: Lenis, cursor, preloader choreography, parallax,
  pinning and scrubs are all disabled; content renders fully visible via the CSS
  fallbacks in `globals.css`.
- Mobile drops scroll-jacking: the process track stacks vertically, the hero
  reflows to a top portrait with stacked type.
- The preloader has a 4s wall-clock failsafe so rAF-throttled (background) tabs
  can never trap the page behind the curtain.

## Performance notes

- Static prerender; first-load JS ≈ 216 kB (gzip) — the ~16 kB over the 200 kB
  target is Framer Motion (nav overlay + testimonial crossfade). Port those two
  to GSAP if you want the budget back.
- Images through `next/image` (sharp installed); the portrait is a static
  import with a blur placeholder and `priority`.
- Fonts self-hosted via `next/font` (Archivo w/ `wdth` axis, Instrument Serif,
  JetBrains Mono), `display: swap`.
- Grain is a single fixed SVG `feTurbulence` layer at 4% opacity; the marquee is
  a compositor-driven CSS animation.

Deploys as-is on Vercel.
