# Build plan

The staged plan for the portfolio, with every requirement as a checkbox. Work is
staged: finish one stage, stop, and wait for the owner to type "continue".
`CLAUDE.md` holds the rules and context; this file holds the order of work and
its state. Update the boxes in the same branch as the work they describe.

Legend: `[x]` done and verified · `[ ]` open · `[~]` partial (note says what is missing) · `[-]` dropped, with reason

---

## Stage 0: Facts and repo bootstrap (no UI) · DONE 2026-10-06 · on `main`

- [x] Folder `C:\Users\DELL\Desktop\portfolio-site`, `git init -b main` inside it (never run git from `C:\Users\DELL`, which is itself a repo)
- [x] `LICENSE` (MIT code; content and photos all rights reserved), `.gitignore`, `README.md` skeleton as separate commits on `main`
- [x] Read the evidence report (496 lines) and verify cited lines in the source repos
- [x] `src/data/{schema,personal,profile,projects,oss,experience,skills}.ts` + `oss.json`, each parsed by Zod at import (`source` + `asOf` required)
- [x] Probe every public link read-only (12 × 200, Streamlit 303 accepted, LinkedIn 999 kept as owner-supplied personal link)
- [x] Fetch exact PR titles with read-only `gh pr view`
- [x] `scripts/check-facts.ts` (schemas + banned terms + semantic asserts); negative-tested
- [x] `FACTS-CHECK.md` (14 conflicts logged) and `PERSONAL-INFO-CHECKLIST.md`
- [x] Render the repo-creation command block (owner ran it; `origin` exists, `main` pushed)

## Stage 1: Foundation · DONE 2026-10-06 · branch `feat/foundation-tokens-motion`

Skills loaded: modern-web-guidance (dark-mode, scroll-progress-indicator, same-document-transitions, fluid-scaling, visually-stable-font-fallbacks, improve-text-layout-and-legibility), ui-ux-pro-max, ui-ux-pro-max:design-system, ui-ux-pro-max:ui-styling, git-workflow. Not found: frontend-design.

- [x] `PLAN.md` and `CLAUDE.md`
- [x] Private project names removed from tracked files; terms live in git-ignored `CLAUDE.local.md` and `scripts/private-terms.local.txt` (still in `main` history: owner decision, see `CLAUDE.local.md`)
- [x] Scaffold: npm, Next.js 16.4 App Router (Turbopack), React 19.3, TypeScript strict, Tailwind 4.3 via `@tailwindcss/postcss`, ESLint 9 flat config, `motion`, Lenis 1.3, Zod 4
- [x] `tsconfig.json` with `allowImportingTsExtensions` and `erasableSyntaxOnly`
- [x] Tokens: primitive ramp (dark default, light mirror, no-JS light block), `--break`, semantic roles, motion and type tokens; Tailwind palette, shadows, blurs and radii above 2 px removed
- [x] `check-contrast.ts`: 30 pairings per theme pass. Changed light `--g8` #707070 → #666666 (4.27:1 on card and 4.00:1 on hover before; 4.64:1 or better after). Break: 5.81:1 dark, 5.77:1 light on the page
- [x] `check-colors.ts`: source and built CSS; only `#ff3b4e` and `#c4152a` as `--break` (Tailwind's `@supports` probes ignored)
- [x] `check-launch.ts`: 13 items listed; strict mode exits 1; runs before `next build`
- [x] Fonts via `next/font/google`: Newsreader (opsz + wght, normal + italic), Hanken Grotesk, JetBrains Mono
- [x] Type scale tokens; display XL is 80–200 px (max ≤ 2.5 × min so zoom still scales it); tabular figures via `.num`
- [x] `/dev/type` specimen: scale, ramp, break rules, components, kernel demo; `noindex`; 404 when `VERCEL_ENV=production`
- [x] Root layout: header / main landmarks, skip link, 2 px `--break` focus ring, `::selection`, `color-scheme` meta
- [x] Theme (M14): verified in browser: dark default, light toggle, VT circle centered on the button, pin cleared when choosing the system value. Following OS changes while unpinned is implemented but not browser-tested
- [x] Lenis (M2): on the shared scheduler, off under reduced motion, anchors glide, `data-lenis-prevent` styles
- [x] Scroll-progress hairline (M2): native `scroll()` timeline confirmed in browser; Lenis callback fallback
- [x] Motion kernel: verified ~60 frames/s in view, frozen when paused, resumes on play
- [x] Global pause: persisted, `aria-pressed`, pauses CSS animations; hidden under reduced motion (nothing autoplays)
- [x] Cursor (M5 base): dot + ring as separate fixed layers (so `difference` blends with the page), fine pointer only, native cursor in fields, `data-cursor` labels, `data-magnetic`, `--break` ring on hover; absent on a touch viewport
- [x] Base components: Button / ButtonLink, TextLink, SectionHeading, Rule, Chip, StatusPill, Figure, MonoLabel, `.grid-12`
- [-] VisuallyHidden component: dropped; Tailwind's `sr-only` does the job without a wrapper
- [x] Minimal `/` with the approved hero copy (static); verified at 1024 px and 375 px (no horizontal overflow)
- [x] `.github/workflows/ci.yml`: install, lint, typecheck, facts, contrast, build, colors (on built CSS), bundle budget
- [x] Gates green locally; first-load JS on `/` 142.6 KB gz (`nomodule` polyfill excluded)
- [x] Stage summary and push + PR command rendered

## Stage 2: Hero and navigation · DONE 2026-10-07 · branch `feat/hero-navigation`

Skills loaded: modern-web-guidance (scrollspy, state-aware-sticky-headers, scroll-entry-exit-effects, expose-canvas-content-to-browser-features, detect-initial-visibility-state), ui-ux-pro-max (ux + gsap text-reveal guidance), git-workflow. Not found: frontend-design.

- [x] Skills listed and loaded
- [x] Hero with approved copy; H1 final period in `--break`
- [x] "View My Work" renders only when its target section is `live` (profile.ts); hidden until Stage 3 flips `work` live, so no dead anchor ships
- [x] M1 intro: pure CSS (`@property` integer counter 000→100, clip-path lift), 1100 + 650 = 1750 ms; first visit per session (sessionStorage); skipped under reduced motion, Save-Data and the pause; name rendered only when `personal.name` is set; page fully rendered beneath; aria-hidden. Verified: played once, then `visibility: hidden`
- [x] M3 split text: `SplitWords` (server-rendered, sr-only full text + aria-hidden words), `RevealText` (view or load trigger, words or lines); hidden state only when the pre-paint script set `data-reveal="on"`, plus a 4 s CSS safety reveal
- [x] M3 H1 weight follows cursor proximity (300→460, fine pointer, motion allowed); words pinned to measured widths so the line never reflows. Verified: weights respond, layout-shift total 0.0000
- [x] M3 section titles settle in scale on entry (CSS `view()` timeline, decorative, no fallback)
- [x] M4 canvas: lazy chunk (1.6 KB gz) imported on idle, never with reduced motion or Save-Data; "loop" task paused off-screen, on hidden tab and under the pause; DPR ≤ 2; ≤ 80 nodes (area-based) desktop, 30 below 768 px; one `--break` packet; colors follow the theme. Static SVG (same seeded graph) server-rendered as the fallback. Verified on desktop and 375 px
- [x] M13 scroll-spy: one IntersectionObserver, current = last section past 45% of the viewport; `aria-current` + break marker dot. Verified on `/dev/type` down and back up
- [x] M13 smart header: hides on scroll down, returns on scroll up via Lenis' callback; `:focus-within` keeps it visible. Verified
- [x] Gates green; first-load JS on `/` 145.0 KB gz (canvas chunk not in first load)
- [ ] Not verifiable here: reduced-motion and no-JS paths (code paths in place: pre-paint flags, static SVG, CSS guards); scrolled-state screenshots (the hidden browser pane renders black frames after programmatic scrolls; behavior verified through the DOM)

Decisions:
- Header nav lists only `live` sections; on `/` it is empty until Stage 3. Below 768 px the header nav is hidden; mobile navigation arrives with the command palette (Stage 4).
- On first visit the intro's lift is the hero reveal; on repeat visits the H1 words rise. Either way the hero text is painted early (LCP).
- Mobile: the graph is masked to the top-right corner so no line crosses the text.

## Stage 3: Projects and case studies · DONE 2026-10-07 · branch `feat/projects-case-studies`

Skills loaded: modern-web-guidance (light-dismiss-a-dialog, declarative-dialog-popover-control, optimize-image-priority; plus Stage 1–2 guides), dataviz (before the charts), git-workflow. Not found: frontend-design.

- [x] `dataviz` loaded before any chart code
- [x] 9 Eventora screenshots copied read-only into `public/projects/eventora/` (source repo left clean); intrinsic sizes in data; alt text written after viewing them
- [x] `work` flipped live: header shows "02 Work", hero shows "View My Work"
- [x] M6 sticky stack: one named `view-timeline` on the list, per-card `exit-crossing` ranges (scale 0.92, opacity 0.45); Lenis-driven `--stack-p` fallback where scroll timelines are missing (no scroll listener); numeral parallax (decoration only); marquee runs only in view, holds on hover/focus, stops under pause and reduced motion (then wraps as a static list)
- [x] M7 cards: spotlight = radial alpha mask over a hairline grid (no color); tilt ≤ 4° (fine pointer, motion allowed); clip-path media reveal; carousel = opacity crossfade on the scheduler, holds on hover/focus, off-screen and pause, manual ← → controls, `aria-roledescription` carousel/slide, hidden slides `fetchPriority="low"`
- [x] `/projects/[slug]` (eventora, recruiter-pro, sysplex; static): problem + facts → architecture → key decisions → evidence (every metric shows source + date) → charts → screenshots → stack → limits; links in the header
- [x] Sources link to GitHub permalinks pinned to the evidence commits (`src/lib/sources.ts`); 131 of 142 source strings resolve, all 38 linked files verified to exist at their commit
- [x] M8: React `<ViewTransition name share="morph" default="none">` on card title + first screenshot and the case-study title + hero image; CSS fade when the View Transitions API is missing (pre-paint `data-vt="none"`); focus moves to the case-study H1. Verified: client navigation, focus on `#case-title`. The morph itself was not visible in captures (hidden pane)
- [x] M9 `FlowDiagram`: nodes and steps only from sourced `flow` data (schema rejects steps between undeclared nodes; missing layout fails the build); edges draw on via transform `scale`; one `--break` packet; Pause/Play, Step, Restart, Follow scroll (Lenis), path toggle (Seats available / Sold out); ordered step list with `aria-current="step"` + → marker as the text equivalent; static final state with JS off / reduced motion. Verified: autoplay advances when frames render, Step, alt path order matches README:124-148
- [x] M9a Eventora reservation flow · M9b Recruiter-Pro request path · M9c SysPlex collection → dashboard
- [x] M9d charts: operating points (660 req/s @ p95 511 ms vs 800 req/s @ p95 9.0 ms, footnote with the 870 / 568 ceiling) and the 16-minute ramp schedule with whole-run outcomes; one axis each, thin marks, direct labels, `<title>` tooltips, sr-only tables, one `--break` mark per chart; schema caps highlights at 1
- [x] M10 `CountUp`: final value in server HTML, tabular figures, counts once in view after hydration, off under reduced motion / pause
- [x] Recruiter-Pro and SysPlex cards show their flow preview instead of screenshots (no mockups used)
- [x] Gates green; `/` 151.9 KB gz; case studies 152.6 KB gz
- [x] Fixed during review: card numerals overlapping titles, highlight numbers colliding, a wide diagram widening the whole grid on phones (`.grid-12 > * { min-width: 0 }`)
- [x] UI UX Pro Max audit (`docs/UX-REVIEW.md`): 8 defects found and fixed on this branch (R1–R8: focus under header/cards, broken header link on case pages, unreadable mobile charts, low-contrast diagram edges, long lines, button cursor, 627 px-wide case pages)
- [-] Owner UAT run before merge: PR #3 was merged on 2026-10-07 without a recorded run; the full run is now due before launch (Definition of done)

Decisions:
- M6 fallback uses Lenis' scroll callback instead of `motion`'s `useScroll`, which listens to scroll events (against the motion rules); M8's fallback fade is CSS. The `motion` package is installed but not shipped in any bundle yet.
- The "660 vs 800" chart is an operating-point plot, not bars (different measures; see FACTS-CHECK.md).

## Stage 4: Remaining sections, SEO, docs · DONE 2026-10-07 · branch `feat/sections-seo-docs`

Skills loaded: modern-web-guidance (forms, validate-input-after-interaction, required-field-feedback, light-dismiss-a-dialog; Stage 1–3 guides), UI UX Pro Max rulebook (review), git-workflow. Not found: frontend-design (ListPlugins shows neither plugin from the Stage 3 install card as enabled).

- [x] About bento (education, open source, internships, flagship; bio, portrait, location, availability cells appear only once set) + stack by lane, each chip naming where it was used
- [x] Open source: headline numbers derived (`ossSummary`), month-grouped timeline, status by shape; daily refresh from the GitHub API (`fetch` with `revalidate: 86400`, `/` is ISR 1 d), `oss.json` fallback per PR, optional `GITHUB_TOKEN`; verified live at build
- [x] Experience: timeline whose rule draws with scroll (view timeline, static fallback), entries clip in; education; certifications without dates; capstone hidden (TODO)
- [x] Contact: Server Action, Zod, Resend over `fetch`, honeypot, 3 per 10 min per address (in memory), values kept on rejection; "not connected" note when the Resend variables are unset. Verified: invalid path, honeypot, not-configured; a real send is UAT-33
- [x] Footer: name, site index, outbound links, palette button, sourcing note, license, back to top
- [x] M13 command palette (Ctrl/Cmd+K, header Search / mobile Menu, footer): sections, projects, PRs, links, theme, pause; native modal dialog + ARIA combobox. Verified: filter, Enter to PR, jump + focus to section, theme action, Esc
- [x] M11 text scramble on mono nav, footer, contact and palette-trigger labels: ≤ 360 ms, delegated listener, sr-only real text
- [x] M12 surfaces: static SVG grain, hairline grid fading over the first screen (scroll timeline), gray vignette
- [x] SEO: metadata with title template and per-page canonical, Open Graph and Twitter, `next/og` share images (home + each case study, Newsreader and JetBrains Mono, colors read from the tokens), JSON-LD `Person`, sitemap, robots, grayscale icon
- [x] `.env.example`
- [x] README complete: routes, stack, commands, data-file table, how to update, env vars, Vercel steps, launch checklist
- [x] Anti-slop self-review: pass/fail per rule (`docs/UX-REVIEW.md` → Stage 4)
- [x] Lighthouse (mobile) and bundle report with numbers (below and in `docs/UX-REVIEW.md`)
- [x] UI UX Pro Max review of the new UI: 9 defects found and fixed (S1–S9, incl. CLS 0.188 → 0.001 and the form wiping rejected input); UAT-28 to UAT-40 added
- [ ] Owner UAT run of the Stage 4 cases

Decisions:
- Display font is `font-display: optional` (CLS); text and mono stay `swap`.
- The palette is the mobile navigation; the header keeps only Menu, Pause (glyph only below 768 px) and Theme.
- A PR closed upstream without merging is dropped from the live list (FACTS-CHECK.md → Stage 4).
- The `motion` package is still unused; Stage 5 polish removes it unless M15 needs it.

## Stage 5: Optional shader and polish

- [ ] M15 (default OFF, `NEXT_PUBLIC_ENABLE_SHADER=0`): raw WebGL2 grayscale noise / flow field, ≤ 15 KB, lazy after idle; gated on WebGL2, `deviceMemory ≥ 4`, `hardwareConcurrency ≥ 4`, no Save-Data, no reduced motion, visible tab; falls back to M4
- [ ] Polish pass
- [ ] M1–M15 status table (DONE / PARTIAL / SKIPPED)
- [ ] Final budget report
- [ ] Final message reminds the owner to pin the repo and add the URL to `Sharawey74/Sharawey74`

---

## Motion spec status (M1–M15)

| ID | Item | Stage | Status |
|---|---|---|---|
| M1 | Intro sequence | 2 | DONE |
| M2 | Lenis + scroll-progress hairline | 1 | DONE |
| M3 | Kinetic typography | 2 | DONE |
| M4 | Hero node-graph canvas | 2 | DONE |
| M5 | Cursor dot + ring, magnetic, labels | 1 + 3 | DONE (View / Zoom labels on cards and gallery) |
| M6 | Scroll choreography, sticky stack, marquee | 3 | DONE |
| M7 | Project card interactions | 3 | DONE |
| M8 | Route transitions | 3 | DONE (morph not visually verified; hidden pane) |
| M9 | Motion graphics a–d | 3 | DONE |
| M10 | Count-up numbers | 3 | DONE |
| M11 | Text scramble | 4 | DONE |
| M12 | Grain, grid, vignette | 4 | DONE |
| M13 | Command palette, scroll-spy, smart header | 2 + 4 | DONE |
| M14 | Theme toggle with VT reveal, no flash | 1 | DONE |
| M15 | Optional WebGL2 shader | 5 | open |

## Budgets (measured, not assumed)

| Budget | Target | Last measured |
|---|---|---|
| First-load JS on `/` (gz, excl. lazy hero and diagrams) | ≤ 170 KB | 155.9 KB (Stage 4); case studies 155.5 KB |
| Mobile LCP | < 2.5 s | `/` 2.0–2.4 s; `/projects/eventora` 2.7–3.0 s (over; Lighthouse applied throttling, localhost, Stage 4) |
| INP | < 200 ms | not measured in the field; TBT 1.1–2.1 s under 4× CPU suggests risk (UAT-31, Stage 5) |
| CLS | < 0.05 | 0.001 (was 0.188 before the display font became `optional`) |
| `--break` pixels in viewport | ≤ 2% | — |
| Concurrently animating regions per viewport | ≤ 3 | — |

## Definition of done (whole project)

- [ ] `docs/UAT.md` signed off by the owner, no open High defects

- [ ] `next build` passes; no TypeScript or lint errors; no unused data
- [ ] Every public claim traces to `FACTS-CHECK.md`; zero banned claims, including alt text and metadata
- [ ] Exactly one non-gray color in shipped CSS and assets (`--break`), within its usage budget
- [ ] Anti-slop list self-reviewed with pass/fail per rule
- [ ] Contrast check passes in both themes; reduced-motion, no-JS and mobile views checked
- [ ] `npm run check:launch` lists only personal items the owner still owes
