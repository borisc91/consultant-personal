# CLAUDE.md

This file gives AI assistants (Claude Code, Cursor, etc.) the context they need to work on this project without breaking things.

## Project

`boristheconsultant.com` — a trilingual portfolio site for an independent SEO consultant based in Novi Sad, Serbia.

Three locales: English (root), Serbian (`/rs/`), Russian (`/ru/`).

Nine page types total (27 URLs across locales): home, case-studies hub, six individual case studies, contact.

## Tech stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS v3.4
- GSAP 3 with ScrollTrigger
- Lucide React for icons
- Fonts via `next/font`: Inter, Fraunces, Instrument Serif, JetBrains Mono

## Content source files

All site content lives in markdown and one JSON config. Do not hardcode content into components. Always load from these files so translations stay in sync.

### Structure config
- `site-structure.json` — canonical source for all routes, page titles, hreflang codes, case study card metadata, and content file references. Every page route, every `<title>`, every hreflang tag must be derived from this file.

### Home page copy (3 files, one per locale)
- `homepage-draft.md` — English
- `homepage-draft.sr.md` — Serbian
- `homepage-draft.ru.md` — Russian

### Case study copy (18 files, 6 case studies × 3 locales)
- `case-study-1-igaming.md` / `.sr.md` / `.ru.md`
- `case-study-2-matcha.md` / `.sr.md` / `.ru.md`
- `case-study-3-parfem.md` / `.sr.md` / `.ru.md`
- `case-study-4-crypto-exchange.md` / `.sr.md` / `.ru.md`
- `case-study-5-crypto-media.md` / `.sr.md` / `.ru.md`
- `case-study-6-saas.md` / `.sr.md` / `.ru.md`

Map from page ID to markdown file is in `site-structure.json` under each page's `contentFile` field, keyed by locale.

## Routing rules

Read route structure from `site-structure.json` → `pages[]` → `paths`. Example paths:

| Page | EN | SR | RU |
|---|---|---|---|
| Home | `/` | `/rs/` | `/ru/` |
| Case studies hub | `/case-studies` | `/rs/case-studies` | `/ru/case-studies` |
| Individual case study | `/case-studies/[slug]` | `/rs/case-studies/[slug]` | `/ru/case-studies/[slug]` |
| Contact | `/contact` | `/rs/contact` | `/ru/contact` |

Slugs are identical across locales. This is intentional for simpler hreflang mapping.

## Hreflang implementation

For every page, emit:

1. One `<link rel="alternate">` tag per locale in `site-structure.json` → `config.locales`, using:
   - `hreflang="[config.hreflangCodes[locale]]"` (values: `en`, `sr-RS`, `ru`)
   - `href="[config.baseUrl + paths[locale]]"`

2. One additional tag with `hreflang="x-default"` pointing to `paths.en`.

The `<html lang="...">` attribute uses `config.localeHtmlLang[locale]` (values: `en`, `sr`, `ru`).

## Design system

**Design direction is already decided. Do not change it without explicit instruction.**

The full design specification is in `design-prompt.md`. That document is the source of truth for:
- Aesthetic direction ("Editorial Analyst")
- Typography hierarchy
- Spacing and radius system
- Component structure (navbar, hero, results strip, capabilities, tools, case studies carousel, contact, footer)
- Micro-interactions and animation lifecycle
- Responsive breakpoints

If something in this file appears to conflict with `design-prompt.md`, `design-prompt.md` wins.

### Two specific section rules worth calling out

These override or clarify what is in `design-prompt.md`:

**1. Services section is now called "Capabilities."**

The section previously labeled "Services" in `homepage-draft.md` is now rendered as **Capabilities**. Section label reads "WHAT I KNOW" in small caps. Section heading reads "Four capabilities. No packages." followed by "So scope and pricing get built around your actual problem."

The visual treatment is **Option C — Minimal Cards**:
- 2x2 grid on desktop, single column on mobile
- Hairline borders between cards, no gap (1px background border-tertiary shows through)
- Each card has:
  - Monospace top label in muted grey, letter-spaced: `01 ── TECHNICAL`, `02 ── SEMANTIC`, `03 ── LINKS`, `04 ── AUTOMATION`
  - Monospace tag in top right corner: `{ I code too }`, `TF-IDF`, `digital PR`, `n8n + Claude`
  - Card title in Fraunces Medium, 17px
  - Description in Inter, 13px, muted
  - Footer line in monospace: `→ see: iGaming case study` (or similar, one per card, linking to relevant case study page)
- No icons. No illustrations. Typography and whitespace carry the section.
- On hover, the card's bottom monospace link shifts to the accent color. Nothing else moves.

**2. Capabilities copy stays as written in `homepage-draft.md`.**

If the markdown uses the word "Services" in a heading, render it as "Capabilities" in the UI. Do not edit the markdown. The mapping lives in the component, not in the content.

## Accessibility and performance

- Semantic HTML. Every section wrapped in `<section>` with a proper heading hierarchy.
- Alt text on every meaningful image. Hero video has a `<track>` or descriptive context for screen readers.
- Respect `prefers-reduced-motion` and disable GSAP entrance animations when set.
- Target Core Web Vitals out of the box:
  - LCP under 1.5s
  - Zero CLS from fonts (use `next/font` with proper fallback metrics)
  - No hydration errors
- Images use `next/image` where applicable.

## Things not to do

- Do not add stock photography. The only image asset is the hero video, which will be added manually later.
- Do not invent case studies, tools, or testimonials. All content comes from the files above.
- Do not add a blog, about page, pricing page, or testimonials section. Scope is locked to the nine page types.
- Do not change the design direction, the palette, the typography, or the component structure defined in `design-prompt.md`.
- Do not hardcode copy. All user-facing text comes from markdown or `site-structure.json`.
- Do not add tracking scripts, analytics, cookie banners, or newsletter popups at this stage.
- Do not generate AI images for any section.
- Do not change the "Capabilities" section from the Option C minimal-cards pattern described above.

## Hero video placeholder

The hero has a reserved container for a video that will be added later.

- Desktop aspect ratio: `16/9`
- Mobile aspect ratio: `4/5`
- Reserve the space with CSS `aspect-ratio` so layout does not shift when the video is added.
- Until the video is in place, render a warm off-white panel with a subtle monospace label reading `[ video placeholder ]` in the center. Add a subtle grain overlay so the placeholder blends with the page texture.
- When the video is added, it should autoplay, muted, loop, and playsinline.

## When in doubt

1. Check `site-structure.json` first.
2. Check `design-prompt.md` second.
3. Check the relevant markdown file third.
4. If still unclear, ask the human rather than guess. Do not invent.
