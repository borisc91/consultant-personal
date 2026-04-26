# Cinematic SEO Consultant Portfolio

## Role

Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. Build a high-fidelity, editorial, pixel-perfect consultant portfolio site. Every page should feel premium, intentional, clean, and built for decision-makers evaluating whether to hire Boris.

Avoid generic AI website patterns. No floating shapes. No useless effects. No gimmicks. Typography, spacing, credibility, and clarity are the design.



---

## Aesthetic Preset — "Editorial Precision"

**Identity:**  
A senior SEO consultant portfolio with the discipline of a serious digital publication. Think modern business media, elite SaaS minimalism, and premium consulting presence combined.

The visitor should instantly feel trust, competence, and authority.

---

## Palette Direction

Use an elegant ultra-light palette.

- Main backgrounds should feel clean, premium, almost paper-like or refined white.
- Surfaces/cards should feel crisp and elevated through borders and spacing.
- Text should remain highly readable and dark.
- Accents can use subtle light blue or light blue-green tones **only when useful** for emphasis, active states, or small UI moments.
- Keep all color decisions tasteful, restrained, and minimal.

Avoid loud colors, trendy gradients, saturated palettes, dark neon themes, or anything flashy.

---

## Typography

- Headings / Display: **Fraunces** or **Instrument Serif**
- Body: **Inter**
- Data / Metrics / Code labels: **JetBrains Mono**

Typography should carry authority and elegance.

---

## Image Mood

No stock photos.

Use:
- abstract data visuals
- editorial style media
- clean motion placeholders
- monochrome or muted professional portrait/video treatment

---

## Fixed Design System (NEVER CHANGE)

### Visual Texture

- Very subtle texture or grain overlay allowed.
- Border radius should remain modest and professional.
- Use crisp borders instead of heavy shadows.
- Shadows only if extremely soft.

### Micro-Interactions

- Buttons should feel refined, never playful.
- Slight scale on hover.
- Cards may lift minimally.
- Links should have tasteful underline transitions.

### Animation Lifecycle

Use GSAP carefully.

- Animate hero
- animate headings
- animate numbers
- avoid over-animation

No motion spam.

### Editorial Details

- Pull quotes allowed
- Large result metrics encouraged
- Strong spacing rhythm
- No emoji
- No cliché startup design language

---

## Responsive Requirements

- Mobile first
- Premium experience on 375px width
- Hero video container responsive
- Clean stacking behavior
- Tools grid responsive
- Case studies swipeable on mobile

---

# Component Architecture

---

## A. NAVBAR — "The Byline"

Minimal top bar.

- Left: clean brand logo (NOT text logo saying Boris)
- Right nav:
  - Case Studies
  - Services
  - Contact

- Language switcher:
  EN / SR / RU

Should feel elegant and discreet.

Sticky or smart-hide on scroll allowed.

---

## B. HERO SECTION — "The Opening Line"

### Layout

Asymmetrical.

Text left. Media right.  
Stacks vertically on mobile.

### Text

H1:

Hi, I'm Boris.  
The consultant.



Two CTAs:

- See Case Studies
- Book a 30-min Audit

### Media Area

Use video placeholder container.

Later real video will be added manually.

Placeholder text:

`[ video: me dragging a chart upward ]`

Autoplay / muted / loop when real asset added.

### Animation

Elegant reveal sequence.

---

## C. RESULTS STRIP

One horizontal credibility strip below hero.

Examples:

- 8+ Years SEO
- Clients on 3 Continents
- Revenue-Focused Strategy

Metric examples:

- +1,185% Organic Clicks
- +850% ROI
- 0 to 22K Organic
- Full Recovery Case

Scrollable on mobile.

---

## D. SERVICES — "What I Do"

Heading:

Four services. No packages.

Subtext:

Scope and pricing are built around your actual problem.

### Cards

1. Technical SEO  
2. Semantic & On-Page SEO  
3. Link Building  
4. AI Workflow Systems for SEO

Use tasteful icons for each service.  
Find strong modern icons. Avoid cheesy icon packs.

No illustrations.

---

## E. TOOLS STRIP — "What I Use"

Heading:

Tools I Use Daily

Single row of icons:

- Ahrefs
- Semrush
- Screaming Frog
- Google Search Console
- GA4
- n8n
- Claude Code

Use proper clean brand icons where possible.  
If unavailable, use premium neutral replacements.

No labels required unless needed.

---

## F. CASE STUDIES — "The Work"

Most important sales section after hero.

Heading:

Case Studies.

Subtext:

Real clients. Real numbers. Real strategy.

### Layout

Desktop:
3 cards visible

Mobile:
horizontal swipe

### Card Content

- Industry
- Title
- Key metric
- Short summary
- Read Case Study →



---

## G. CONTACT — "The Closing Line"

Heading:

Let's Talk.

Copy:

If your SEO feels stuck, or previous retainers delivered reports instead of results, send a short note.

### Form

- Name
- Email
- Company URL
- Message

CTA:

Send →

---

## H. FOOTER

Elegant light footer.

Left:
brand mark

Center:
Based in Novi Sad, Serbia.

Right:
Language switcher  
LinkedIn

Bottom small line:

last updated: [date]

---

# Technical Requirements

- Next.js 14+
- TypeScript
- Tailwind
- GSAP
- App Router


---

# Accessibility

- Semantic HTML
- Reduced motion support
- Proper contrast
- Fast loading

---

# Performance

- Core Web Vitals optimized
- Fast LCP
- No layout shift
- Clean hydration

---

# Final Directive

Do NOT build a generic freelancer portfolio.

Build a serious, premium consultant website that makes founders think:

“This person clearly knows what they’re doing.”

Use restraint.  
Use typography.  
Use trust.  
Use clarity.
