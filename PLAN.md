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

## Stage 3: Projects and case studies

- [ ] Load `dataviz` before any chart (M9d)
- [ ] Copy assets read-only from source repos into `public/` (Eventora screenshots; diagram sources)
- [ ] Flip `work` to `live: true` in profile.ts (nav link + "View My Work" CTA appear)
- [ ] Featured projects section; M6 sticky stacked cards (scale and dim as the next arrives), parallax on decoration only, pausable tech-chip marquee
- [ ] M7 project cards: cursor spotlight (radial mask), tilt ≤ 4°, clip-path image reveal, screenshot crossfade carousel (pauses on hover/focus, manual controls)
- [ ] `/projects/[slug]` for eventora, recruiter-pro, sysplex: problem → architecture → key decisions → evidence → stack → links; caveats shown
- [ ] M8 route transitions: React `<ViewTransition>` shared card image + title → case-study hero; `motion` fade fallback; focus moved to the new heading
- [ ] M9a Eventora request lifecycle (draw-on paths, packets, play/pause/step, scroll-scrub option)
- [ ] M9b Recruiter-Pro pipeline (parse → extract → score → explain)
- [ ] M9c SysPlex agents → dashboard flow
- [ ] M9d evidence charts from committed numbers only (660 vs 800 req/s; 200-VU ramp figures), axes, value labels, source line
- [ ] Every diagram: only nodes from `architecture[]`, static final state, `<figcaption>` "FIG. NN / …", visually hidden description, break color on the active packet only
- [ ] M10 count-ups: server-rendered final value, tabular figures, animate only after hydration and in view
- [ ] Recruiter-Pro and SysPlex screenshot slots render nothing public until the owner supplies real images
- [ ] Gates green

## Stage 4: Remaining sections, SEO, docs

- [ ] About bento + stack (chips from `skills.ts` with `usedIn`)
- [ ] Open source: timeline + cards; status by shape; ISR refresh from the GitHub API (`revalidate: 86400`), `oss.json` fallback, optional `GITHUB_TOKEN`
- [ ] Experience: scroll-triggered vertical timeline; certifications without dates
- [ ] Contact: Server Action, Zod, Resend, honeypot, simple rate limit; "not configured" state when `CONTACT_TO_EMAIL` is unset (preview and dev)
- [ ] Footer
- [ ] M13 command palette (Ctrl/Cmd+K): sections, projects, OSS items, open links, toggle theme, pause animations
- [ ] M11 text scramble on mono labels at hover/focus, ≤ 400 ms, `aria-label` keeps real text
- [ ] M12 surfaces: static pre-rendered grain, hairline grid fading with scroll, vignette
- [ ] SEO: metadata, `next/og` image (black and white), JSON-LD `Person`, sitemap, robots
- [ ] `.env.example` (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`, `GITHUB_TOKEN`, `LAUNCH_STRICT`, `NEXT_PUBLIC_ENABLE_SHADER`)
- [ ] README complete: what, stack, data-file table, how to update, env vars, Vercel dashboard steps, launch checklist
- [ ] Anti-slop self-review: pass/fail per rule
- [ ] Lighthouse (mobile) and `next build` bundle report with numbers

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
| M5 | Cursor dot + ring, magnetic, labels | 1 | DONE (base; card labels wired in Stage 3) |
| M6 | Scroll choreography, sticky stack, marquee | 3 | open |
| M7 | Project card interactions | 3 | open |
| M8 | Route transitions | 3 | open |
| M9 | Motion graphics a–d | 3 | open |
| M10 | Count-up numbers | 3 | open |
| M11 | Text scramble | 4 | open |
| M12 | Grain, grid, vignette | 4 | open |
| M13 | Command palette, scroll-spy, smart header | 2 + 4 | PARTIAL (scroll-spy + smart header done; palette in Stage 4) |
| M14 | Theme toggle with VT reveal, no flash | 1 | DONE |
| M15 | Optional WebGL2 shader | 5 | open |

## Budgets (measured, not assumed)

| Budget | Target | Last measured |
|---|---|---|
| First-load JS on `/` (gz, excl. lazy hero and diagrams) | ≤ 170 KB | 145.0 KB (Stage 2) |
| Mobile LCP | < 2.5 s | — |
| INP | < 200 ms | — |
| CLS | < 0.05 | — |
| `--break` pixels in viewport | ≤ 2% | — |
| Concurrently animating regions per viewport | ≤ 3 | — |

## Definition of done (whole project)

- [ ] `next build` passes; no TypeScript or lint errors; no unused data
- [ ] Every public claim traces to `FACTS-CHECK.md`; zero banned claims, including alt text and metadata
- [ ] Exactly one non-gray color in shipped CSS and assets (`--break`), within its usage budget
- [ ] Anti-slop list self-reviewed with pass/fail per rule
- [ ] Contrast check passes in both themes; reduced-motion, no-JS and mobile views checked
- [ ] `npm run check:launch` lists only personal items the owner still owes
