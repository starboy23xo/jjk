# Craft Studio

**Ideas deserve good design.**

Production website for Craft Studio — a design and technology studio.
Static HTML, CSS and vanilla JavaScript. No runtime framework, no third-party
requests, seven HTTP requests for a full page load.

## Build

```bash
node build.mjs      # assembles src/ into dist/
```

No dependencies are needed to build. `dist/` is the deployable folder.

To preview locally:

```bash
node build.mjs && python3 -m http.server 8899 --directory dist
```

## Structure

```
src/
  pages/       one file per route, each with a JSON meta block at the top
  partials/    base.html shell + reusable fragments ({{> name }} includes)
  styles/      craft.css — the whole design system
  scripts/     craft.js — nav, reveals, accordion, contact form
  assets/      self-hosted fonts, logo, icons, OG image
  static/      files copied to the site root (webmanifest)
build.mjs      the build: templating, minification, sitemap, robots.txt
```

Routes: `/`, `/services/`, `/process/`, `/work/`, `/about/`, `/contact/`, `/404/`.

## Before going live

1. **Set the domain.** `SITE` at the top of `build.mjs` feeds canonical URLs,
   Open Graph tags, JSON-LD and the sitemap. It is currently a placeholder.
2. **Fill in the editable placeholders.** Everything shown in a dashed red box
   (`.ph`) is a deliberate placeholder — founder name, role, previous
   experience, projects, years, certifications, previous clients. They appear on
   `/`, `/about/` and `/work/`. Replace them with details you can verify, and
   delete any line you cannot back up.
3. **Project cards.** `/work/` carries three `[Project coming soon]` slots.
   Replace each with a real case study once a project ships.

The site makes no claim the studio cannot support: no invented clients,
testimonials, awards, statistics, years, certifications or results.

## Design system

Palette is taken from the cut-paper logo — warm paper `#E9E6E1`, near-black ink
`#1D1D1B`, with a terracotta accent `#B03D24` for annotations, underlines and
markers. Type is Inter Tight (variable, self-hosted) with Caveat for handwritten
accents only — never for body copy.

Tokens live at the top of `src/styles/craft.css`. Text colours are chosen to
clear 4.5:1 on the paper ground.

## Verified

- **Accessibility** — zero axe-core violations (WCAG 2.1 A/AA + best-practice)
  across all 7 pages at desktop and mobile widths. Skip link, visible focus,
  semantic landmarks, `prefers-reduced-motion` support.
- **Links** — every internal link and anchor resolves; external links carry
  `target="_blank"` and `rel="noopener noreferrer"`.
- **Contact form** — client-side validation, service preselected from
  `?service=`, submits to WhatsApp with a mailto fallback.
- **Layout** — no horizontal overflow at 390px, 834px or 1440px.
- **Performance** — 7 requests, ~167 KB uncompressed, CLS 0, FCP ~120 ms.

## Contact

WhatsApp / phone 6383283116 · craftstudio2k26@gmail.com · [@craftstudio\_\_](https://www.instagram.com/craftstudio__)
