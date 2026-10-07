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

| Item | Owner / stage |
|---|---|
| Mobile section navigation (no header links below 768 px) | Stage 4, command palette |
| Lighthouse LCP / INP / CLS numbers | Stage 4 report |
| Forms rules (contact) | Stage 4 |
| Human checks listed as UAT above | Owner, `docs/UAT.md` |
