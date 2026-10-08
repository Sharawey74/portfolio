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

## Stage 5: Design polish, motion completion, optional shader · DONE 2026-10-08 · branch `feat/design-polish-motion`

Skills loaded: frontend-design (critique), modern-web-guidance (scrollability-affordance-hints, defer-rendering-heavy-content; apply-webgl-shaders retrieved, not applicable), ui-ux-pro-max (quick-reference audit), git-workflow. Not loaded: ui-ux-pro-max:design-system and ui-ux-pro-max:ui-styling (token architecture and component styling are fixed by the brief; both target new systems and shadcn/ui).

Skills, in this order: `frontend-design`, `modern-web-guidance:modern-web-guidance` (before any HTML/CSS/client JS), then `ui-ux-pro-max:ui-ux-pro-max`, `ui-ux-pro-max:design-system`, `ui-ux-pro-max:ui-styling`. The "Visual system" and "Motion rules" sections of CLAUDE.md override every skill: use the skills for craft, critique and accessibility only. Never change the gray ramp, `--break`, fonts, radius, the no-shadow rule, the easing or the 200/400/800 ms durations. Where frontend-design calls a brief-required choice "generic", the brief wins; record it as **Brief** in `docs/UX-REVIEW.md`.

5.1 Design critique (no code first)
- [x] frontend-design self-critique of every page (`/`, all case studies) at 375 / 768 / 1280 / 1920, dark and light. Screenshots in `docs/screens/stage5-before/` (32 WebP, 6.7 MB; `scrollWidth` equals the viewport on all 32)
- [x] Issues list in `docs/UX-REVIEW.md` (new section "Stage 5"), each with a verdict: D1–D10 (8 Open, D6 partly Brief; 1 Owner; 1 Pass) plus the Brief-over-skill table
- [x] Each fix stays inside the token system (no new colors, sizes, shadows or radii): only existing utilities and tokens; `check:colors` and `check:contrast` pass

5.2 Motion completion (inside the existing system)
- [x] Audit every M1–M14 item against CLAUDE.md motion rules: one easing, fixed durations, ≤ 3 animating regions per viewport, scheduler only, no scroll listeners. Fixed off-token durations (intro 1000 + 650 → 800 + 300 hold + 400 ms; count-up 1200 → 800; scramble 360 → 400; packet 900 → 800 ms); the rest pass (`docs/UX-REVIEW.md` → 5.2)
- [x] Interaction states consistent on every control: hover, focus-visible, active, disabled; motion limited to `transform` / `opacity` / `clip-path`. New: one pressed state (1 px `translate`) and `not-allowed` on disabled
- [x] Reduced motion, `pointer: coarse`, Save-Data, JS-off and the global Pause control re-verified on every page: 4 pages × 5 modes in headless Chrome, all pass, no console errors
- [x] `motion` package decision: removed (no item needs it; M15 is raw WebGL2). `/` 155.9 KB gz before and after, case studies 155.6 KB both (it was never bundled)
- [x] M15 (default OFF, `NEXT_PUBLIC_ENABLE_SHADER=0`): raw WebGL2 grayscale noise / flow field, ≤ 15 KB, lazy after idle; gated on WebGL2, `deviceMemory ≥ 4`, `hardwareConcurrency ≥ 4`, no Save-Data, no reduced motion, visible tab; falls back to M4. Built: 3.2 KB raw / 1.7 KB gz chunk; verified with the flag on (WebGL2 canvas live, no console errors)

5.3 Audit and budgets
- [x] Re-run the UI UX Pro Max audit (`references/quick-reference.md`) for all new UI; add rows to `docs/UX-REVIEW.md` (5.3 table)
- [x] New behavior gets cases in `docs/UAT.md` (never marked passed): UAT-41 to UAT-47; UAT-23 updated (no marquee)
- [x] `npm run check`, `lint`, `typecheck`, `build`, `report:bundle` green; `/` ≤ 170 KB gz: 156.1 KB gz, case studies 155.6 KB
- [~] Lighthouse mobile on the local production build (`portfolio-prod`), median of 3 runs. Targets: LCP < 2.5 s, CLS < 0.05, TBT < 200 ms as the lab proxy for INP. Reports saved to `docs/reports/`. After the performance pass (P1–P3, mains power, CPU benchmark 2,732–3,182): CLS 0.001 and a11y / best practices / SEO 100 everywhere; LCP passes on `/` 2.11 s, Recruiter-Pro 2.27 s, SysPlex 2.45 s, over on Eventora 2.79 s; TBT 695–989 ms on every page (over). Partial: Eventora LCP and TBT over budget. Owner decision 2026-10-08: option C, accept and re-measure on a Vercel preview in Stage 6 (`docs/ISSUES.md` → ISS-01, ISS-02)
- [x] 375 px `scrollWidth` check on every page: equal to the viewport at 375, 768, 1280 and 1920 on all 4 pages, both themes
- [x] After screenshots in `docs/screens/stage5-after/` (32 WebP, 6.6 MB); M1–M15 status table updated

Notes:
- Screenshots and reports are committed one file per commit (CLAUDE.md git rules), or up to four per commit when they are one identical change (for example the four widths of one page and theme). Keep them as compressed PNG/JPEG at 1× so the repo stays small.

## Review round 1: owner review fixes (planned 2026-10-08; R0 decided 2026-10-08)

Source: the owner's review of a local production build on 2026-10-08 (21 notes, six screenshots). Every item is an issue in `docs/ISSUES.md` (ISS-12 to ISS-34, with context, options and recommendations) and an owner-reported entry in the `docs/UAT.md` defect log. Branch when started: `feat/owner-review-1`. Stage gating as usual: finish, stop, wait for "continue". Several items change rules the brief fixed (approved hero copy, one accent color, radius, banned fonts, grayscale screenshots); `CLAUDE.md` changes in the same branch as the decision, never before.

R0 Owner decisions (blocks R2 to R4; nothing is coded before these are answered)
- [x] ISS-12 hero: label "Abdelrhman Mohamed / Software engineer", H1 "Software engineer building systems that stay correct under concurrency." (owner's choice, 2026-10-08)
- [x] ISS-21 palette direction: A, crimson ramp
- [x] ISS-22 button radius: pill for buttons and CTAs only
- [x] ISS-23 nav, footer and stack captions: Hanken Grotesk
- [x] ISS-16 practice PR stays excluded: 8 merged across 6 projects, 3 under review
- [x] ISS-17 elwahapumps issue left out
- [x] ISS-18 Eventora's README performance figures (selection in `docs/ISSUES.md` → ISS-18)
- [x] ISS-03 keep the still hero graph on phones (closed)

R1 Facts and content (data files only)
- [ ] ISS-14 name "Abdelrhman Mohamed": `personal.name`, LICENSE holder, share images, JSON-LD; `CLAUDE.md` decision line
- [ ] ISS-15 email `personal.email`
- [ ] ISS-13 hero sub without the student sentence; ISS-12 headline once chosen; `CLAUDE.md` approved copy
- [ ] ISS-16 `oss.json`: mage #16440 merged 2026-10-07, #2688 retitled; facts-check asserts; headline 8 merged across 6 projects, 3 under review (or as decided)
- [ ] ISS-17 every filed issue with its state
- [ ] ISS-18 metrics audit table (site metric, source line, README line today, match), owner review, evidence report and `FACTS-CHECK.md` updated
- [ ] ISS-19, ISS-20 (later): Alstom internship and the Claude certificates entry once the owner supplies the facts

R2 Visual system and layout (after R0)
- [ ] Update `CLAUDE.md` "Visual system" with the decided palette, radius and fonts; extend `check-colors.ts` and `check-contrast.ts` to the new tokens; both themes pass
- [ ] ISS-21 palette tokens and where each tone is used
- [ ] ISS-22 radius tokens for buttons (and controls if chosen)
- [ ] ISS-23 font for nav, footer and stack captions
- [ ] ISS-28 type and spacing rescaled for laptop viewports; display sizes capped by viewport height; tested at 1280×720, 1366×768, 1440×900, 1536×864, 1920×1080
- [ ] ISS-31 project cards fit one viewport; stack overlap off when the viewport is too short
- [ ] ISS-29 "Also built" names no longer overlap
- [ ] ISS-30 stack section as an aligned grid per lane
- [ ] ISS-24 GitHub and LinkedIn marks (inline SVG, with text labels) in Contact and the footer
- [ ] ISS-32 one hover / press / focus treatment per control type, within the motion rules
- [ ] ISS-33 cursor "ON" label bug
- [ ] ISS-34 scroll-spy current-section bug

R3 Media and diagrams
- [ ] ISS-25 color screenshots: Eventora dark set and Recruiter-Pro's 13 real screens, each viewed and checked for placeholder or private data before use; carousels on both cards; case-study galleries; closes the Recruiter-Pro screenshot TODO
- [ ] ISS-26 slide sharpness: measured cause fixed (`sizes`, quality, filter, scaling)
- [ ] ISS-27 SysPlex diagram recomposed inside the sourced nodes and steps; card preview to match

R4 Verify and record
- [ ] UI UX Pro Max audit rows for every change (`docs/UX-REVIEW.md`), `frontend-design` critique of the new palette and type
- [ ] Before and after captures at the laptop sizes above, both themes, in `docs/screens/review-1/`
- [ ] `npm run check`, `lint`, `typecheck`, `build`, `report:bundle` green; 375 px `scrollWidth` on every page
- [ ] Lighthouse on mains power, 3 runs per page; no regression against Stage 5 (`docs/reports/`)
- [ ] Each fixed issue closed in `docs/ISSUES.md` with its evidence; UAT-49 to UAT-51 ready for the owner

## Stage 6: Release docs, CD and v1.0.0

6.1 Docs (repo copy rules: no banned words, no emoji, no exclamation marks)
- [ ] `DEPLOY.md`:
  - Hosting: Vercel Git integration, production = `main`, preview per PR
  - Owner-only Vercel import steps (the project is not imported yet)
  - Env var names from CLAUDE.md only
  - Pre-release checklist: `npm run check`, `lint`, `typecheck`, `build`, `report:bundle`, `check:launch -- --strict`, and the local-only private-terms facts check
  - Release steps: 1. bump `package.json` version; 2. date the CHANGELOG section; 3. PR and merge to `main` (owner); 4. tag `vX.Y.Z` on the merge commit (owner); 5. push the tag (owner)
  - Post-deploy smoke checks
  - Rollback: Vercel instant rollback, or redeploy the previous tag
  - Domain notes
  - Updating the repo homepage URL
- [ ] `CHANGELOG.md` in Keep a Changelog format, SemVer for this site:
  - MAJOR: redesign or new information architecture
  - MINOR: a new section or case study
  - PATCH: copy, fixes, performance
  - 0.x until launch; launch is v1.0.0
  - Backfill one 0.x entry per DONE stage, using only PLAN.md, merged PR titles and `git log` dates

6.2 CD (extend, do not replace, `.github/workflows/ci.yml`)
- [ ] Playwright smoke job in `ci.yml` or a separate workflow: build, `next start`; every route returns 200; no console errors; header nav works; reduced-motion and JS-off render content
- [ ] Re-measure Lighthouse on a Vercel preview (3 runs) and act on `docs/ISSUES.md` ISS-01 and ISS-02: close them if within budget, otherwise apply their next option (ISS-01 option A, ISS-02 option B1) and re-measure
- [ ] `.github/workflows/lighthouse.yml`: on `deployment_status` when the state is `success` and the deployment is not production; Lighthouse CI against the preview URL from the event, 3 runs, CLAUDE.md budgets; uses secret `VERCEL_AUTOMATION_BYPASS_SECRET` if Deployment Protection is on
- [ ] `.github/workflows/release.yml`: on tag `v*.*.*`, `permissions: contents: write`; extracts that version's CHANGELOG section and fails if it is missing; runs `gh release create`
- [ ] `.github/dependabot.yml`: npm and github-actions, weekly, minor and patch grouped. Watches for the patched `braces` chain (`docs/ISSUES.md` → ISS-10); never `npm audit fix --force` (it downgrades `eslint-config-next` to 14)
- [ ] Try ESLint 10 on its own branch (`docs/ISSUES.md` → ISS-11): `npm run lint` clean and CI green, or stay on 9.39.5 with the reason recorded
- [ ] Least-privilege `permissions` in every workflow; actions pinned to at least a major version
- [ ] Owner actions listed, not performed: import the project in Vercel; add the secret if needed; mark the required status checks in the `main` ruleset (exact job names); set the repo homepage URL

6.3 Release v1.0.0
- [ ] Definition of done (below) fully met; `check:launch --strict` passes (no `TODO(owner)` left); `docs/ISSUES.md` has no Open or Owner issue of High severity
- [ ] Render the owner's release block per `DEPLOY.md`; after the deploy, run the smoke checks on the production URL and confirm the GitHub Release exists
- [ ] Final message reminds the owner to pin the repo and add the URL to `Sharawey74/Sharawey74` (carried over from the old Stage 5 list)

Notes:
- Backfilled CHANGELOG versions (0.1.0 … 0.4.0 for Stages 1–4, or similar) are numbers assigned now for the record. No such tags or releases exist; the CHANGELOG says so, and only v1.0.0 (and later) gets a tag and a GitHub Release unless the owner decides to tag the old merge commits.
- `package.json` is at `0.1.0` today and has never been bumped.

---

## Motion spec status (M1–M15)

| ID | Item | Stage | Status |
|---|---|---|---|
| M1 | Intro sequence | 2 + 5 | DONE (on duration tokens since Stage 5: 1500 ms) |
| M2 | Lenis + scroll-progress hairline | 1 | DONE |
| M3 | Kinetic typography | 2 | DONE |
| M4 | Hero node-graph canvas | 2 | DONE |
| M5 | Cursor dot + ring, magnetic, labels | 1 + 3 | DONE (View / Zoom labels on cards and gallery) |
| M6 | Scroll choreography, sticky stack, marquee | 3 + 5 | PARTIAL by owner decision: sticky stack and parallax kept, marquee retired (Stage 5 D2) |
| M7 | Project card interactions | 3 | DONE |
| M8 | Route transitions | 3 | DONE (morph not visually verified; hidden pane) |
| M9 | Motion graphics a–d | 3 | DONE |
| M10 | Count-up numbers | 3 | DONE |
| M11 | Text scramble | 4 | DONE |
| M12 | Grain, grid, vignette | 4 | DONE |
| M13 | Command palette, scroll-spy, smart header | 2 + 4 | DONE |
| M14 | Theme toggle with VT reveal, no flash | 1 | DONE |
| M15 | Optional WebGL2 shader | 5 | DONE (default OFF) |

## Budgets (measured, not assumed)

| Budget | Target | Last measured |
|---|---|---|
| First-load JS on `/` (gz, excl. lazy hero and diagrams) | ≤ 170 KB | 156.1 KB (Stage 5); case studies 155.6 KB; M15 chunk 1.7 KB gz, loaded only when enabled |
| Mobile LCP | < 2.5 s | Stage 5 medians after the performance pass: `/` 2.11 s, Recruiter-Pro 2.27 s, SysPlex 2.45 s (pass); Eventora 2.79 s (over). Applied throttling, localhost |
| INP | < 200 ms | not measured in the field; lab TBT medians 695–989 ms after the performance pass (was 1,164–2,043 ms), against a 200 ms proxy target |
| CLS | < 0.05 | 0.001 on every page (Stage 5 medians) |
| `--break` pixels in viewport | ≤ 2% | — |
| Concurrently animating regions per viewport | ≤ 3 | — |

## Definition of done (whole project)

- [ ] `docs/UAT.md` signed off by the owner, no open High defects
- [ ] `docs/ISSUES.md`: every High issue Closed, or Decided with the owner's acceptance recorded

- [ ] `next build` passes; no TypeScript or lint errors; no unused data
- [ ] Every public claim traces to `FACTS-CHECK.md`; zero banned claims, including alt text and metadata
- [ ] Exactly one non-gray color in shipped CSS and assets (`--break`), within its usage budget
- [ ] Anti-slop list self-reviewed with pass/fail per rule
- [ ] Contrast check passes in both themes; reduced-motion, no-JS and mobile views checked
- [ ] `npm run check:launch` lists only personal items the owner still owes
