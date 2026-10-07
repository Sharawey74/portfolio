# UX review: UI UX Pro Max audit

| | |
|---|---|
| Scope | Stages 1–3 as built on branch `feat/projects-case-studies` (PR #3): `/`, `/projects/{eventora,recruiter-pro,sysplex}`, `/dev/type` |
| Rulebook | `ui-ux-pro-max` v2.13.0, `references/quick-reference.md` (all 10 categories). `references/pro-rules.md` is scoped to native/mobile apps; its web-applicable checklist items are folded in below |
| Method | Rules checked against the code and against the production build in the in-app browser (desktop 1280 px, phone 375 px), plus `npm run check` (facts, contrast, colors) and `report:bundle` |
| Reviewed | 2026-10-07 |
| Precedence | The build brief overrides skill defaults (see "Brief overrides" below). Those rows are marked **Brief** and are not defects |

Verdicts: **Pass** · **Fixed** (defect found in this review and fixed on PR #3) · **Open** (known gap, owner or later stage) · **N/A** (no such UI yet) · **Brief** (deliberate, the build brief requires otherwise) · **UAT** (needs a human check, listed in `docs/UAT.md`).

## Defects found and fixed in this review

| ID | Rule | Defect | Fix | Verified |
|---|---|---|---|---|
| R1 | `focus-not-obscured`, `fixed-element-offset` | No `scroll-padding-top`: anchor jumps and keyboard focus could land under the fixed header when Lenis is off (reduced motion) | `html { scroll-padding-top: header + 1rem }` | Computed 72 px |
| R2 | `focus-not-obscured` (WCAG 2.4.11 AA) | A focused link in an earlier stacked card could sit under the next sticky card | `.stack-item:focus-within { z-index: 2 }` | Focused card z-index 2, next card `auto` |
| R3 | `back-behavior`, `persistent-nav` | Header "02 Work" link on case-study pages pointed at `#work`, which does not exist there; clicking did nothing | Nav links use `/#id` off the home page | `/#work` on case pages, `#work` on `/` |
| R4 | `responsive-chart`, `axis-readability` | At 375 px the charts scaled their 12 px labels to ~6 px | Charts keep ≥ 560 px and scroll inside their own region below that | Labels ~10.5 px, region 343 px wide |
| R5 | `contrast-data` (WCAG 1.4.11) | Diagram edges at `--g6`: 2.03:1 dark, 1.76:1 light, below 3:1 for meaningful graphics | Edges use `--g8` (text-3): 6.12:1 dark, 5.27:1 light; pairing added to `check:contrast` | Computed stroke rgb(143,143,143) |
| R6 | `line-length` | Key-decision paragraphs ran ~110 characters per line on desktop | `max-w-[70ch]` | Computed ~668 px |
| R7 | `cursor-pointer` | Tailwind v4 preflight gives buttons the arrow cursor when the custom cursor is off | `button:not(:disabled), [role=button] { cursor: pointer }` (custom cursor still hides it) | Rule present; overridden by `data-cursor="on"` as intended |
| R8 | `horizontal-scroll`, `long-token-wrapping` | Case-study pages were 627 px wide at 375 px: long unbreakable source paths and an `sr-only` table that ignored its 1 px width | Source lines use `overflow-wrap: anywhere`; chart tables wrapped in an `sr-only` div; nested chart grid item gets `min-w-0` | All five pages 375 px wide at 375 px |

## Category results

### 1. Accessibility (CRITICAL)

| Rule | Verdict | Evidence |
|---|---|---|
| `color-contrast`, `color-accessible-pairs` | Pass | `check:contrast`: 30 pairings per theme, tightest 4.64:1 (light text-3 on hover) |
| `focus-states`, `focus-appearance` | Pass | 2 px `--break` outline, 3 px offset; 5.81:1 / 5.77:1 against the page |
| `alt-text` | Pass | Screenshot alt written after viewing each image; decorative SVG/canvas `aria-hidden` |
| `aria-labels`, `icon-context` | Pass | Icon-only controls (theme, ← →) have names; glyphs beside text are `aria-hidden` |
| `keyboard-nav` | UAT | All controls are native buttons/links; full tab-order walk is UAT-07 |
| `skip-links` | Pass | "Skip to content" → `#main` (`tabIndex=-1`) |
| `heading-hierarchy` | Pass | `/`: h1 → h2 Work → h3 cards; case pages: h1 → h2 sections |
| `color-not-only` | Pass | Status by pill shape + glyph + text; active nav = dot + ink; current step = → + ink |
| `dynamic-type` | UAT | rem-based scale; fluid sizes keep max ≤ 2.5 × min; 200 % zoom is UAT-09 |
| `reduced-motion` | UAT | Pre-paint flags, static SVG/diagram states and CSS guards in place; not run with the OS setting (UAT-05) |
| `voiceover-sr` | UAT | sr-only full text for split headings, sr-only chart tables, step lists; screen-reader pass is UAT-08 |
| `escape-routes` | Pass | Zoom dialog: Esc, Close button, backdrop click (with Safari fallback) |
| `focus-not-obscured` | Fixed | R1, R2 |
| `web-target-size` | Pass | Controls ≥ 44 px (`min-h-11`); inline text links are exempt |
| `auto-rotation-controls` | Pass | Carousel: manual ← →, holds on hover/focus/off-screen, global pause, never autoplays under reduced motion |
| `dragging-alternative`, `accessible-authentication`, `consistent-help`, `redundant-entry` | N/A | No drag, auth, help or multi-step input |

### 2. Touch & interaction (CRITICAL)

| Rule | Verdict | Evidence |
|---|---|---|
| `touch-target-size`, `touch-spacing` | Pass | 44 px minimum on buttons and nav; ≥ 8 px gaps |
| `hover-vs-tap` | Pass | Hover only adds polish (spotlight, tilt, color); every action is a click |
| `cursor-pointer` | Fixed | R7 |
| `press-feedback` | Pass | Hover and focus states on all controls; no `:active` effect (minor, acceptable) |
| `gesture-conflicts`, `system-gestures` | Pass | Only vertical page scroll; diagram and charts scroll sideways in their own regions |
| `tap-delay` | Pass | `width=device-width` viewport removes the 300 ms delay |
| `loading-buttons`, `error-feedback` | N/A | No async actions until the Stage 4 contact form |

### 3. Performance (HIGH)

| Rule | Verdict | Evidence |
|---|---|---|
| `image-optimization`, `image-dimension`, `lazy-load-below-fold` | Pass | WebP via `next/image`, intrinsic width/height in data, lazy below the fold, hidden slides `fetchPriority="low"` |
| `font-loading` | Pass | `next/font`, `display: swap`, `font-size-adjust: from-font` |
| `lazy-loading`, `bundle-splitting` | Pass | Canvas is a 1.6 KB idle-loaded chunk; first-load JS `/` 151.8 KB gz (budget 170) |
| `content-jumping` | Pass | H1 weight effect pins word widths (measured CLS 0.0000) |
| `main-thread-budget`, `reduce-reflows` | Pass | One rAF scheduler; per-frame work is transforms; React state only on step changes |
| LCP / INP field numbers | Open | Lighthouse report is a Stage 4 deliverable |

### 4. Style selection (HIGH)

| Rule | Verdict | Evidence |
|---|---|---|
| `consistency`, `effects-match-style` | Pass | One token set; no shadows; radius ≤ 2 px |
| `no-emoji-icons`, `icon-style-consistent` | Brief | Brief mandates text glyphs (→ ↗ ✓ ○ ·) in mono; ▶ forced to text presentation (VS15) |
| `primary-action` | Pass | Hero: one filled CTA, resume as outline |
| `state-clarity` | Pass | Hover, focus, pressed (`aria-pressed`), disabled (`disabled` + ink-3 + `not-allowed`) |
| `dark-mode-pairing` | Pass | Light mirrors dark from the same ramp; contrast checked per theme |
| `blur-purpose` | Pass | No blur anywhere |

### 5. Layout & responsive (HIGH)

| Rule | Verdict | Evidence |
|---|---|---|
| `viewport-meta` | Pass | Next default; zoom not disabled |
| `horizontal-scroll` | Fixed | R8; also the Stage 3 grid fix (`.grid-12 > * { min-width: 0 }`) |
| `readable-font-size` | Pass | Body 16–18 px; mono labels 12 px are metadata |
| `line-length-control` | Fixed | R6; summaries ≤ 60ch, card copy 46ch |
| `fixed-element-offset` | Fixed | R1 |
| `viewport-units` | Pass | Hero uses `100svh` |
| `z-index-management` | Pass | header 50 · progress 60 · intro 80 · cursor 90 · skip link 100 |
| `orientation-support` | UAT | Landscape phone not tested (UAT-10) |
| `breakpoint-consistency` | Pass | One breakpoint for the 12-column grid (48 rem) plus content-driven grids |

### 6. Typography & color (MEDIUM)

| Rule | Verdict | Evidence |
|---|---|---|
| `line-height`, `font-scale`, `text-styles-system` | Pass | Body 1.55; tokenised scale (display XL/L, H2, H3, body, small, mono) |
| `weight-hierarchy` | Brief | Brief sets display at 300–400; hierarchy comes from size and gray step |
| `color-semantic` | Pass | Three-layer tokens; components use roles, never raw hex (`check:colors`) |
| `number-tabular` | Pass | `.num`, `font-variant-numeric: tabular-nums lining-nums` on every figure |
| `heading-line-balance` | Pass | `text-wrap: balance` on h1–h3, `pretty` on paragraphs |
| `long-token-wrapping` | Fixed | R8 |

### 7. Animation (MEDIUM)

| Rule | Verdict | Evidence |
|---|---|---|
| `transform-performance`, `layout-shift-avoid` | Pass | transform / opacity / clip-path only (diagram draw-on uses `scale`, not stroke-dashoffset) |
| `duration-timing`, `motion-consistency` | Pass | 200 / 400 / 800 ms tokens, one easing |
| `spring-physics` | Brief | Brief mandates one `cubic-bezier(0.22, 1, 0.36, 1)` |
| `excessive-motion` | UAT | Brief allows ≤ 3 animating regions per viewport; the Work section can show carousel + marquee + stack at once (UAT-12) |
| `interruptible`, `no-blocking-animation` | Pass | Reveals never block input; `::view-transition { pointer-events: none }` |
| `opacity-threshold` | Pass | Stack recedes to 0.45, never lingers near 0.2 |
| `shared-element-transition`, `continuity` | UAT | Morph pairs in place; the animation itself not seen in captures (UAT-11) |
| `parallax-subtle` | Pass | Card numeral drift ±0.6 rem, decoration only, off under reduced motion |
| `stagger-sequence` | Pass | 45–60 ms per word, 90 ms per line |

### 8. Forms & feedback (MEDIUM)

N/A until the Stage 4 contact form. Rules to apply then: `input-labels`, `error-placement`, `inline-validation`, `error-summary`, `focus-management`, `aria-live-errors`, `autofill-support`, `submit-feedback`.

### 9. Navigation (HIGH)

| Rule | Verdict | Evidence |
|---|---|---|
| `nav-state-active` | Pass | Break dot + full ink + `aria-current` |
| `focus-on-route-change` | Pass | Case-study H1 receives focus after navigation |
| `deep-linking` | Pass | Every case study has a static URL |
| `back-behavior`, `persistent-nav` | Fixed | R3; browser Back with scroll restore is UAT-04 |
| `empty-nav-state`, `adaptive-navigation` | Open | Below 768 px the header shows no section links; mobile navigation arrives with the command palette (Stage 4) |
| `modal-escape` | Pass | Zoom dialog |

### 10. Charts & data (LOW)

| Rule | Verdict | Evidence |
|---|---|---|
| `chart-type` | Pass | Operating points (two configurations, two measures) and a schedule line; reasoning in FACTS-CHECK.md |
| `data-table`, `screen-reader-summary` | Pass | sr-only tables; `role="img"` with caption |
| `axis-labels`, `direct-labeling`, `gridline-subtle` | Pass | Units on axes; direct value labels; hairline grid |
| `legend-visible` | Pass | Single series per chart: no legend needed (dataviz rule) |
| `responsive-chart` | Fixed | R4 |
| `contrast-data` | Pass | Data marks ink on page; highlighted mark `--break` ≥ 3:1 |
| `tooltip-on-interact`, `tooltip-keyboard`, `focusable-elements` | Pass | Native `<title>` on hover; same values are direct labels and in the table, so no hover-only information |
| `animation-optional` | Pass | Chart line reveal only with `data-reveal="on"`; static otherwise |

## Brief overrides (not defects)

| Skill default | Brief rule that wins |
|---|---|
| SVG icon set (Lucide, Heroicons) | Text glyphs in mono; custom 1.5 px SVG only where unavoidable |
| Spring / physics easing | One cubic-bezier, 200 / 400 / 800 ms |
| Bold headings (600–700) | Newsreader 300–400; hierarchy by size and gray step |
| shadcn/ui components | No untouched shadcn look; own components |
| Color for state (error red, success green) | One break color; state by shape and text |

## Open items carried forward

Stage 1–3 items closed in Stage 4: mobile navigation (command palette, "Menu"
below 768 px), Lighthouse numbers and the forms rules (see "Stage 4 review"
below). Human checks marked UAT stay with the owner (`docs/UAT.md`).

---

# Stage 4 review

| | |
|---|---|
| Scope | Branch `feat/sections-seo-docs`: About, Open source, Experience, Contact, footer, command palette (M13), text scramble (M11), surfaces (M12), metadata, share images, JSON-LD, sitemap, robots |
| Method | Same rulebook. Production build captured with headless Chrome over the DevTools protocol at 1440 px and 375 px, dark and light; palette and form driven in the in-app browser; Lighthouse 12 mobile, both simulated and applied (DevTools) throttling |
| Reviewed | 2026-10-07 |

## Stage 4 defects found and fixed

| ID | Rule | Defect | Fix | Verified |
|---|---|---|---|---|
| S1 | `form-state-preservation` (forms) | React resets a form after its Server Action; a message rejected by validation was wiped | The action returns the submitted values with a fresh `at`; the form remounts with them as defaults | Invalid submit keeps all three values, marks email and message `aria-invalid`, focuses email |
| S2 | `cls` (performance) | Hero headline re-wrapped when Newsreader swapped in on a slow connection: CLS 0.188 (applied throttling) | Display face `font-display: optional` (preloaded; fallback is metric-adjusted) | CLS 0.001 on three runs |
| S3 | `color-contrast` (WCAG 1.4.3) | Section index labels faded from 35% opacity with the title-settle scroll effect; Lighthouse measured 1.66:1 below the fold | Effect animates scale only | Lighthouse accessibility 100 on `/` and `/projects/eventora` |
| S4 | Honesty (brief) | Footer and meta description said every number *links* to its source; home-page numbers carry it as a tooltip only | "names its source …; the case studies link to the cited lines" | Copy in `profile.ts`, logged in `FACTS-CHECK.md` |
| S5 | `lcp-priority` | Case-study hero image used the deprecated `priority` without `fetchpriority=high` | `loading="eager"` + `fetchPriority="high"` | LCP 3.6 s → 2.7–3.0 s (applied throttling) |
| S6 | `errors-in-console` | `/favicon.ico` 404 | `src/app/icon.svg`, grayscale | Icon route in the build |
| S7 | `consistent-sizing` | Tech chips stretched to the width of their "used in" caption | Chip list items `items-start` | 1440 px capture |
| S8 | Copy accuracy | "Not connected" note said "use a link below"; on desktop the links sit to the right | "Use one of the direct links instead." | Copy |
| S9 | Brand (share image) | The red period wrapped onto its own line in the share image | Words laid out as separate flex items, period inside the last word | `/opengraph-image` rendered |

## Stage 4 rule results

| Rule | Verdict | Evidence |
|---|---|---|
| `heading-hierarchy` | Pass | One H1; each section H2 (`SectionHeading`); months (Open source) and role titles (Experience) are H3 |
| `form-labels`, `required-indicators`, `input-type-keyboard`, `autofill-support` | Pass | Visible labels above fields with "(required)"; `type="email"`, `autocomplete` name/email, `enterkeyhint`, no autocorrect on email |
| `inline-validation`, `error-placement`, `focus-management`, `aria-live-errors` | Pass | Native constraints styled only after interaction (`:user-invalid`); server re-validates (Zod); `aria-invalid` on failed fields; focus to the first; status line is `role=status` |
| `error-feedback` without color | Pass | Dashed 2 px underline + ○ glyph + message; success ✓ + message |
| `submit-feedback`, `loading-buttons` | Pass | Button reads "Sending" and is disabled while pending (no double post) |
| Progressive enhancement | Pass | Server Action form posts without JavaScript |
| Spam and abuse | Pass | Off-screen honeypot (`aria-hidden`, `tabindex=-1`) answers with a silent success; 3 messages per 10 min per address (in memory, per instance); 10 s send timeout; message body never logged |
| Not-configured state | Pass | Without the three Resend variables the form is replaced by a note; direct links remain |
| Command palette: `keyboard-nav`, `escape-routes`, `focus-trap` | Pass | Ctrl/Cmd+K; combobox + listbox with `aria-activedescendant`; ↑ ↓, Ctrl+Home/End, Enter; Esc and click outside close (native modal `<dialog>`, `closedby="any"`); focus returns to the opener |
| `mobile-nav` | Pass | Header button reads "Menu" below 768 px and opens the palette (sections first) |
| `focus-after-navigation` | Pass | Palette section jumps scroll with Lenis and move focus to the section heading (`tabindex=-1`) |
| `touch-target-size` | Pass | Header controls, palette options, footer and contact links ≥ 44 px tall |
| `status-not-color-only` | Pass | PR status: filled ✓ pill + filled square node vs outline ○ pill + hollow node |
| `motion-meaning`, `reduced-motion` | Pass | Scramble is decorative over an sr-only copy, ≤ 360 ms, off under reduced motion and for hover on coarse pointers; the experience rule draw and grid fade are scroll-linked and static under reduced motion |
| `max-animated-regions` | UAT | The new sections add no autoplaying loops; the count with the Work section in view is UAT-12 |
| `horizontal-scroll` | Pass | `/`, three case studies and `/dev/type`: `scrollWidth` 375 at 375 px |
| `line-length` | Pass | Bio, lead and notes capped at 48–64 ch |
| Light theme | Pass | 1440 px capture of Open source in light mode |
| `meta-tags`, `og-image`, `structured-data`, `sitemap` | Pass | Title template, description, canonical per page, Open Graph and Twitter cards, generated share images, JSON-LD `Person`, `/sitemap.xml`, `/robots.txt` (excludes `/dev/`) |
| Break-color budget | Brief | Each open PR's status pill carries the break dot (the brief's open-status rule), so Open source shows up to 4 at once; every other break use stays single per section |

## Anti-slop self-review (brief list)

| Banned | Result |
|---|---|
| Purple/blue gradients, neon glow, glass blur, gradient blobs, gradient text | Pass: none. Gradients only draw the 1 px grid lines and the gray vignette |
| Sparkle or emoji icons | Pass: text glyphs only (→ ↗ ✓ ○ · ↑ ↓) |
| Grids of identical rounded shadowed cards | Pass: the bento has varied spans, hairline seams, no radius, no shadow |
| 3-column icon-feature rows | Pass: none |
| Everything centered | Pass: left-aligned editorial grid with `col-start-2` offsets |
| Colored left-border stat cards | Pass: none. The palette's active option uses a 2 px break marker (active nav marker, allowed) |
| Untouched shadcn/Tailwind default look | Pass: default palette, shadows and radii removed from the theme |
| Drop shadows | Pass: none |

| Required | Result |
|---|---|
| Asymmetric 12-column grid, deliberate offsets | Pass |
| Numbered section indices ("01 / About") | Pass: 01–05 |
| Mono figure captions | Pass (case studies) |
| Hairline rules, oversized numerals, radius 0–2 px | Pass: About and Open source numerals at display size |
| Real content as the visual material | Pass: data-driven bento, PR timeline, sourced roles |

## Lighthouse (mobile, production build on localhost, 2026-10-07)

| Page | Throttling | Perf | A11y | Best pr. | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` (before S2, S3) | simulated (default) | 73 | 97 | 96 | 100 | 4.5 s simulated, 1.45 s observed | 360 ms | 0.001 |
| `/` (before S2) | applied (DevTools) | 51 | – | – | – | 3.0 s | 1.61 s | 0.188 |
| `/` | applied (DevTools) | 64–66 | 100 | 96 | 100 | 2.0–2.4 s | 1.55–2.08 s | 0.001 |
| `/projects/eventora` | applied (DevTools) | 64–65 | 100 | 96 | 100 | 2.7–3.0 s | 1.12–1.53 s | 0.001 |

Best practices 96 was the favicon 404 (S6), fixed after these runs.

Open, carried to Stage 5 polish:

- **Main-thread time (Open).** TBT 1.1–2.1 s under 4× CPU slowdown: React
  hydration plus the client islands (hero, cards, diagrams, palette). INP
  under 200 ms is not proven by these runs; measure it on a real phone
  (UAT-31) and trim client components where the numbers point.
- **Case-study LCP (Open).** 2.7–3.0 s against the 2.5 s budget. Re-measure on
  the Vercel deployment, whose image cache and CDN change the load phase.
- Localhost has no CDN; numbers on Vercel will differ. Re-run on the
  production URL before launch.

---

# Stage 5 review

## 5.1 Design critique (before any code)

| | |
|---|---|
| Scope | `/`, `/projects/eventora`, `/projects/recruiter-pro`, `/projects/sysplex` at 375, 768, 1280 and 1920 px, dark and light (32 full-page captures) |
| Captures | `docs/screens/stage5-before/<page>-<width>-<theme>.webp`. Production build, `prefers-reduced-motion: reduce` (so reveals are static and the intro is skipped), headless Chrome at 1× scrolled tile by tile at the real viewport height and stitched. The header is pinned to the top of the document so it appears once. In the Work section the sticky stack shows each card where it sat at that scroll position, so cards repeat across tiles: that is the stitching, not the page |
| Lens | `frontend-design` (critique against generic, templated defaults), then the brief. Where the skill calls a brief-required choice generic, the brief wins and the row says **Brief** |
| Reviewed | 2026-10-07 |

Verdicts: **Open** (defect, fix planned in 5.2) · **Owner** (needs a decision from the owner before a fix) · **Brief** (the brief requires it; kept) · **Pass**.

### Issues

| ID | Where | Issue | Verdict | Proposed fix (inside the token system) |
|---|---|---|---|---|
| D1 | Header, 768 px (upper bound to measure in 5.2) | The section nav wraps to two rows; the first row rides above the header bar and the second spills below it (`home-768-*`) | Open | Show the nav from 1024 px; below that the existing Menu button (palette) is the navigation |
| D2 | `/` About and Work | The same 31 tech chips appear twice on one page: "Stack, by where it was used" in About and "Stack across these projects" in Work. On a phone that is about two screens of repeated chips | Owner | Recommended: keep About's lane list (it carries `usedIn`, the evidence) and drop the chip marquee from Work. That retires the M6 marquee; the alternative is keeping the marquee and cutting About's list to lanes only |
| D3 | Work cards, 1280 px (other widths to measure in 5.2) | "Recruiter-Pro" breaks at its hyphen ("Recruiter-" / "Pro") at `display-l`, and the next sticky card covers the second line (`home-1280-*`) | Open | Card titles one step down (`text-h2` scale at md–xl) or a non-breaking hyphen in the rendered name (data unchanged) |
| D4 | Work cards, phones | Recruiter-Pro and SysPlex card previews scale their diagram labels to about 4 px: unreadable texture under the button (`home-375-*`) | Open | Hide the flow preview below 768 px (it is decorative, `aria-hidden`); the case study shows the full diagram |
| D5 | Case studies | Inconsistent hierarchy: "Problem" is a small mono label in a side column, while Architecture, Key decisions, Evidence and the rest are `display-l` words as large as the home page's section titles. The page reads as a stack of giant words | Open | One pattern for every case section: mono index + `text-h2` heading in the left column, content to the right (the Problem layout), keeping display sizes for the H1 only |
| D6 | Many blocks | Uppercase mono eyebrows above nearly every block (Education, Open source, Internships, Flagship project, Stack…, Also built, Roles, Issues reported, Or reach me directly). `frontend-design` names the eyebrow-on-everything pattern as the most common generated tell | Open (partly Brief) | The brief requires mono labels for labels and metadata, so they stay where they name data. Cut the redundant ones: "Roles" (directly under "Experience"), "Or reach me directly" (the links say what they are) |
| D7 | `/` About → Open source | The open-source "7" is shown at display size twice within a few screens (About cell, then the Open source headline) | Open | About's numerals step down to `text-h2`; Open source keeps the oversized numerals |
| D8 | Case study diagrams, phones | The architecture diagram scrolls sideways inside its box at 375 px, showing only the first two nodes, with no sign that more is there (`eventora-375-*`) | Open | A mono caption under the box on phones only ("Scroll sideways for the full diagram"), copy in `profile.ui` |
| D9 | Eventora steps | A code token wraps inside itself: "availableCount -" / "= n" | Open (Low) | Keep code-like tokens together (`white-space: nowrap` on inline code spans) |
| D10 | Contact (no Resend variables) | Under a `display-l` title the section holds one sentence and two links | Pass | Expected until the owner sets the variables; with the form it is balanced |

### Brief over skill

| `frontend-design` calls generic | Brief rule kept |
|---|---|
| Near-black page with one bright accent | The gray ramp and one `--break` color are the brief's identity |
| Hairline rules, zero radius, editorial columns | Required (anti-slop "Required" list) |
| Mono face for small data labels; uppercase labels | Required: JetBrains Mono, labels uppercase +0.06em |
| Numbered markers (01 / About …) on non-sequential content | Required: numbered section indices |
| "→" appended to links and buttons; middle dots in meta strings | Required: text glyphs (→ ↗ ✓ ○ ·) instead of icons |
| Accenting one word (the red final period) | The H1 final period is the one sanctioned text use of `--break` |

### What already works (keep)

- The hero is the memorable thing: the headline at display size, the node graph quiet behind it, one break mark. Nothing else on the page competes with it.
- Real material carries the page: diagrams drawn from sourced steps, charts, screenshots, the PR timeline. No stock imagery, no filler sections.
- Light mode is a true mirror; nothing breaks between themes at any width.
- Every page measures exactly its viewport width at all four widths (`scrollWidth` = viewport).

## 5.2 Fixes and motion completion

Skills: `modern-web-guidance` (scrollability-affordance-hints; apply-webgl-shaders was retrieved and does not apply, it renders HTML into a canvas), `ui-ux-pro-max` (quick-reference rules; the searches for pressed state and scroll hints returned nothing specific). `ui-ux-pro-max:design-system` and `ui-ux-pro-max:ui-styling` were not loaded: token architecture and component styling are fixed by the brief, and both skills target new systems and shadcn/ui.

### D1–D9 resolved

| ID | Verdict | Change |
|---|---|---|
| D1 | Fixed | Section links from 1024 px (`lg`); below that the header button reads "Menu" and opens the palette |
| D2 | Fixed (owner chose A) | The chip marquee is gone from Work, with its component and CSS; About keeps the lane list with `usedIn`. M6 keeps the sticky stack and numeral parallax |
| D3 | Fixed | Card titles at `text-h2`, and the card is one column below 1024 px (a 5/12 column at 768 px still split "Recruiter-" / "Pro"): one line at all four captured widths |
| D4 | Fixed | Flow previews render from 768 px only |
| D5 | Fixed | Every case section heading is `text-h2` in the display face (Problem, Stack and Limits headings are now visible headings, not mono labels); display sizes only for the H1 |
| D6 | Fixed | "Roles" and "Or reach me directly" removed (the latter kept as the list's `aria-label`) |
| D7 | Fixed | About numerals at `text-h2`; Open source keeps the display numerals |
| D8 | Fixed | Below 1024 px a mono line under the diagram: "← → Scroll sideways for the full diagram." (copy in `profile.ui.diagram.scrollHint`) |
| D9 | Fixed | Parenthesised parts of step labels never break inside ("(availableCount -= n)") |

### Motion audit, M1–M14 against the motion rules

Method: grep for scroll listeners, raw `requestAnimationFrame`, hard-coded durations and easings; then every page in five modes in headless Chrome (reduced motion, coarse pointer, Save-Data, JavaScript off, global pause), recording running animations, hero layer, cursor, hidden text and console errors.

| Rule | Result |
|---|---|
| No scroll event listeners | Pass: none (Lenis' own callback and IntersectionObserver only) |
| One rAF loop (scheduler) | Pass: no `requestAnimationFrame` outside `scheduler.ts` |
| One easing | Pass: every transition and keyframe animation uses `--ease-out`; `linear` only on scroll-linked timelines and the packet's constant-rate travel |
| Durations 200 / 400 / 800 ms | **Fixed**: intro was 1000 + 650 ms (now 800 ms count, 300 ms hold, 400 ms lift = 1500 ms), count-up 1200 ms (now 800), scramble 360 ms (now 400), diagram packet 900 ms per step (now 800). Stagger delays (45–90 ms per word) are offsets, not durations |
| ≤ 3 animating regions per viewport | Pass by inventory: Work in view = carousel autoplay + scroll-linked card recede + numeral drift (the marquee, a fourth, is gone); case study = diagram packet + progress hairline; hero = canvas + one-shot headline entrance |
| Only transform / opacity / clip-path / small filter | Pass: the new pressed state uses `translate` only |
| Reduced motion | Pass on all 4 pages: no running animations, no hero canvas, no cursor, no hidden text |
| `pointer: coarse` | Pass on all 4 pages: no custom cursor (tilt and magnet key off the same flag) |
| Save-Data | Pass on all 4 pages: no intro, no canvas (static hero) |
| JavaScript off | Pass on all 4 pages: no hidden text; CSS-only scroll effects still run |
| Global pause | Pass on all 4 pages: `data-motion="paused"`, the CSS numeral drift stops (observed), and the carousel, canvas and diagram packet are scheduler "loop" tasks, which the pause stops (verified in Stage 1); scroll-linked and one-shot effects keep running by design |
| Console | No errors or warnings in any of the 20 runs |

| Item | Status after audit |
|---|---|
| M1 | DONE, now on duration tokens (1500 ms) |
| M2–M5, M7–M14 | DONE, unchanged |
| M6 | PARTIAL by owner decision: sticky stack and parallax kept, marquee retired (D2) |
| M15 | DONE, default OFF |

### Interaction states

| State | Result |
|---|---|
| Hover | Unchanged: color, border or underline steps on every control (Tailwind `hover:` variants only apply on hover-capable devices; the few plain-CSS `:hover` rules can stick after a tap on touch screens and are harmless there) |
| Focus-visible | Unchanged: 2 px `--break` ring everywhere |
| Active (new) | One pressed state for every control: a 1 px drop (`translate`), 200 ms, in the base layer so a component's own transition list still wins. Applies to buttons, `role=button`, palette options, contact links and button-styled links (`data-press`) |
| Disabled | `cursor: not-allowed` and no pressed response; the Resume button keeps its outline-only disabled style |

### `motion` package

Removed (`npm uninstall motion`): nothing imports it, and M15 is raw WebGL2. First-load JS before and after: `/` 155.9 KB gz both, case studies 155.6 KB gz both (it was never bundled). The lockfile loses 61 lines; `npm audit --omit=dev`: 0 vulnerabilities.

### M15 shader

`src/components/hero/hero-shader.tsx`: raw WebGL2, a grayscale flow field drawn as contour lines from two token grays (`--g0`, `--g5`), so it cannot produce a color off the ramp. Half resolution, DPR ≤ 1.5, a "loop" task on the scheduler (stops off-screen, on a hidden tab, under the pause), re-reads the colors on theme change. Chunk: 3.2 KB raw, 1.7 KB gz (budget 15 KB). `HeroGraph` loads it only when `NEXT_PUBLIC_ENABLE_SHADER=1` and WebGL2, `deviceMemory ≥ 4`, `hardwareConcurrency ≥ 4`, a visible tab, no reduced motion and no Save-Data all hold; a failed context or compile falls back to the M4 canvas. Verified with the flag on in headless Chrome (WebGL2 via SwiftShader): canvas live, no console errors, contour lines behind the headline. With the flag off (default) `/` does not reference the chunk.

## 5.3 Audit and budgets

### UI UX Pro Max rules for the new and changed UI

| Rule | Verdict | Evidence |
|---|---|---|
| `nav-hierarchy`, `breakpoint-consistency` | Pass | One navigation per width: header links from 1024 px, Menu (palette) below; the header stays one row at 768 px (`stage5-after/home-768-*`) |
| `press-feedback`, `state-clarity` | Pass | One pressed state on every control (1 px `translate`, 200 ms); disabled controls show `not-allowed` and do not move |
| `scroll-affordance` | Pass | Scroll hint under the diagram below 1024 px; the ordered step list is the full text equivalent |
| `heading-hierarchy` | Pass | Case studies: H1 at display size, every section an H2 at `text-h2`; the home page keeps display-size section titles (one per screen) |
| `content-priority`, no duplication | Pass | The stack appears once on `/` (About), with where each chip was used |
| `long-token-wrapping` | Pass | Parenthesised step details stay whole; source paths still wrap anywhere (R8) |
| `motion-consistency` (one easing, token durations) | Pass | See the motion audit above; every JS-driven duration reads `DUR_MS` |
| `horizontal-scroll` | Pass | `scrollWidth` equals the viewport on all 32 after captures (375, 768, 1280, 1920 × 4 pages × 2 themes) |
| `decorative-motion-optional` (M15) | Pass | Off by default; gated on capability, reduced motion, Save-Data, a visible tab; pause stops it |

After captures: `docs/screens/stage5-after/` (32 WebP, 6.6 MB), taken the same way as the before set.

### Lighthouse

Not recorded yet. Twelve runs (3 per page) on 2026-10-07 were discarded: the laptop was on battery and Lighthouse's CPU benchmark read 512–671, against 1,500–2,372 for the Stage 4 runs, so TBT came out at 4–8 s and every run warned about a slow CPU. The runs are re-done on mains power before the 5.3 Lighthouse item is ticked.
