# CLAUDE.md

Context and standing rules for anyone (human or agent) working in this repo.
Read this first, then `PLAN.md` for where the work stands. `PLAN.md`, `FACTS-CHECK.md`, `PERSONAL-INFO-CHECKLIST.md` and `DEPLOY.md` are local only since 2026-10-08 (git-ignored on every branch, owner's request): keep them up to date on this machine as before, but they are never committed, and a fresh clone does not have them. `docs/UX-REVIEW.md` is the UI UX Pro Max audit (rule by rule); `docs/UAT.md` is the owner's manual acceptance script; `docs/ISSUES.md` is the register of open issues, decisions and proposed fixes; `docs/reports/` holds measurements. Private details that
must not be in a public repo live in `CLAUDE.local.md` (git-ignored); read it
too if it exists on this machine.

## What this is

A portfolio site for the owner (GitHub `Sharawey74`): a software engineering
student whose positioning is **backend systems first**, with AI services and
open-source work as supporting material. Cinematic, black and white, rich gray
shades, one restrained "break" color. Every public number is traced to a source
file and a date.

- Repo: `C:\Users\DELL\Desktop\portfolio-site`, remote `Sharawey74/portfolio`, default branch `main`.
- Hosting: Vercel Git integration (production = `main`, every PR gets a preview). No `vercel.json` unless required. Never run `vercel` commands and never deploy.
- Work is staged (0 to 6, plus "Review round 1" between 5 and 6). Finish a stage, stop, wait for the owner to type "continue". See `PLAN.md`.
- **Brief changes from review round 1** (owner, 2026-10-08, `docs/ISSUES.md` ISS-12 to ISS-25) are applied below: the hero copy, a three-step accent ramp instead of one accent, pill buttons, Hanken Grotesk for interface labels, brand icons, color screenshots. A later change to these rules follows the same path: decision recorded in `docs/ISSUES.md` first, then this file in the same branch as the code.

## Source of truth and honesty rules (highest priority)

1. Facts come only from `C:\Users\DELL\Desktop\Career\portfolio-evidence\evidence-report.md` ("the report", generated 2026-10-06) and the owner's approved claims. If they disagree, **the report wins**; log the conflict in `FACTS-CHECK.md`.
2. Never invent metrics, dates, links, PRs, logos, testimonials or technologies. Missing → `TODO(owner): <what>` in the data file, and nothing public renders for it.
3. Every public number or claim carries `source` (file:line or URL) and `asOf` (ISO date). The Zod schemas in `src/data/schema.ts` enforce it; the build fails without them. Personal fields are exempt.
4. A tech chip exists only if the report's §3 shows it in a repo, or it is on the allowed list; each chip carries `usedIn`.
5. No unqualified adjectives ("production-grade", "scalable", "expert"). Numbers, qualifiers, dates.
6. Never open or print `.env` files or any secret. Other repos are **read-only**: copy images or diagram sources from them into this project, nothing else.
7. Motion graphics are claims: an animated diagram shows only components that exist in the source repo (`architecture[]` in `projects.ts`, each with a source).
8. Do not publish the items listed in `CLAUDE.local.md` (personal details and private projects). Do not name them in tracked files either; the facts check reads them from the git-ignored `scripts/private-terms.local.txt`.

### Banned claims (enforced by `scripts/check-facts.ts`)

- No repo evidence: Microservices, CQRS, Event Sourcing, Kubernetes, Terraform, Kafka, gRPC, GraphQL, TimescaleDB, Node.js backend, OAuth 2.0, MySQL.
- Eventora: "11-state" (enum has 10), "194 tests", "83%", "700 VUs", "live API" (Railway backend 404s; link only the frontend as live).
- Recruiter-Pro: LangChain (removed 2026-08-17), RAG, "30-resume corpus".
- PhishSniffer: XGBoost, "50+ features", "10,000+ samples".
- SysPlex: "5 s refresh" (code is 2 s), "3 agents", "130+ tests".
- Litestar #5019 and Eclipse Collections #1965 are **open**; never "merged" or "accepted".
- No dates on certificates, anywhere.
- Banned copy words: passionate, cutting-edge, seamless, leverage, robust, delve, unlock, elevate, innovative, journey, crafting. No exclamation marks, no emoji.

LexIntelligence genuinely uses RAG, LangChain and ChromaDB. Those terms are allowed only inside `// facts:allow <Term,...>` … `// facts:end` regions that name them.

### Decisions already made (do not re-litigate)

All in `FACTS-CHECK.md` → "Conflicts resolved". The ones that shape copy:
- Eventora coverage is JaCoCo **instruction** coverage 84.1% (gate 80%), not line coverage.
- Eventora Railway ramp figures always carry "read path" (browse + search only).
- Local Eventora figures always carry "local, Docker Compose".
- PhishSniffer: "about 43K emails from public corpora (34,284 train, 8,571 held out)", 97.7% test accuracy.
- Recruiter-Pro `frontend/Images/*.png` are design mockups with placeholder data. Never use them.
- Recruiter-Pro: "500+ tests" (README says 544 and 530).
- Public name: **"Abdelrhman Mohamed"** (owner, 2026-10-08, `docs/ISSUES.md` ISS-14): `personal.name`, the hero H1, the LICENSE holder and JSON-LD `Person.name`; "Sharawey74" stays as the handle (`alternateName`). The facts check bans the other spelling and asserts the H1 equals the name plus a period.
- Headline OSS stat is derived, not typed (`ossSummary()`): 8 merged across 6 projects, 3 under review, 2026-08 to 2026-10 (snapshot 2026-10-08; magefree/mage #16440 merged 2026-10-07). The first-contributions practice PR stays excluded (ISS-16). "Issues reported" lists litestar #5020 and #5018 and avoid-ai-writing #333 (ISS-17).
- Eventora card highlights: 0 oversold seats, 569,066 requests with 0 failed across five capacity runs (A, B, C, G, H; summed and checked), 660 req/s per 1-CPU replica, all "local, Docker Compose" (ISS-18).

## Content model

All copy lives in typed data files. Components contain no copy. Updating the site = editing data and pushing.

| File | Holds |
|---|---|
| `src/data/schema.ts` | Shared Zod schemas: `claim`, `metric`, `link` (status 200, or 303 for Streamlit), `stackItem`, `asset`, `todo` |
| `src/data/personal.ts` | Every personal field; `value: null` + `todo` until the owner fills it. Empty field = element omitted (no placeholder), except the Resume button, which renders disabled |
| `src/data/profile.ts` | Approved hero copy, section indices, site meta |
| `src/data/projects.ts` | Five projects: eventora (flagship), recruiter-pro, sysplex (case studies), lexintelligence, phishsniffer (secondary grid) |
| `src/data/oss.json` + `oss.ts` | PR snapshot (fallback for the ISR refresh) and `ossSummary()` |
| `src/data/experience.ts` | Two internships, AASTMT, four undated certifications, hidden capstone TODO |
| `src/data/skills.ts` | Tech chips by lane with `usedIn` validated against project slugs |

Data files import each other with explicit `.ts` extensions (`import { claim } from "./schema.ts"`) so Node can run the check scripts with native type stripping. `tsconfig.json` sets `allowImportingTsExtensions`; keep it.

## Approved hero copy

Owner's own description, reframed to pass the copy rules and approved on 2026-10-08 (`docs/ISSUES.md` ISS-12, ISS-13). The 2026-10-06 headline and the student sentence are retired; education stays in About.

- Label (mono, above the H1): "Software engineer"
- H1: "Abdelrhman Mohamed." (the final period is the one text use of `--break`)
- Lead: "Software Engineer focused on designing and building systems that keep working as load grows, with a strong emphasis on correctness, maintainability and real-world engineering constraints."
- Second paragraph: "Interested in software architecture, distributed systems, performance, security, and the engineering practices that turn complex requirements into tested, deployable software."
- CTAs: "View My Work", "Download Resume".

## Visual system (overrides any skill's defaults)

**Color.** Text is black or white (gray steps), with two exceptions in `--break`: the H1's final period and the section index numbers ("01"). Dark is default; light is the exact mirror. Surfaces come from a neutral 12-step ramp (R=G=B), applied by role:

| Token | Dark | Light | Role |
|---|---|---|---|
| `--g0` | #050505 | #FAFAFA | page |
| `--g1` | #0A0A0A | #F5F5F5 | raised |
| `--g2` | #111111 | #EEEEEE | card |
| `--g3` | #181818 | #E7E7E7 | hover |
| `--g4` | #212121 | #DEDEDE | hairline |
| `--g5` | #2E2E2E | #D1D1D1 | border |
| `--g6` | #444444 | #BBBBBB | strong border |
| `--g7` | #666666 | #999999 | decoration only |
| `--g8` | #8F8F8F | see `globals.css` | text-3 |
| `--g9` | #B3B3B3 | #4C4C4C | text-2 |
| `--g10` | #E0E0E0 | #1F1F1F | text-soft |
| `--g11` | #FAFAFA | #050505 | text |

`globals.css` is the source of truth for the exact values; any value changed to pass contrast is logged in its header comment.

**Accent ramp** (owner decision 2026-10-08, ISS-21 direction A): three crimson steps, each with one job. Nothing else is colored.

| Token | Dark | Light | Job |
|---|---|---|---|
| `--c1` deep | #3A0810 | #F6E2E5 | Fills: the Contact band (the one large accent surface), outline-button and header-control hover, the active nav pill, the selected palette option |
| `--c2` mid | #8E1428 | #A3142A | Filled-button hover (text `--on-c2` #FAFAFA), `::selection`, project-card hover edge, hairlines inside the Contact band |
| `--break` bright | #FF3B4E | #C4152A | Marks: live/open status dot, active nav dot, focus ring, the single active packet/node in motion graphics, one highlighted value per chart, the H1 final period, section index numbers, the cursor-ring hover state |

- Forbidden: colored body or heading text (beyond the two `--break` text uses above), gradients, glows, shadows, accent fills on cards or content blocks other than the Contact band, `--break` as a fill larger than a chip.
- `scripts/check-contrast.ts` checks every pairing in both themes: text ≥ 4.5:1 (including all text roles on `--c1` and `--on-c2` on `--c2`), graphics ≥ 3:1. Light `--c1` was lightened from #F3DADD to #F6E2E5 to keep text-3 at 4.63:1.
- `scripts/check-colors.ts` fails on any non-gray color literal other than the `--c1`, `--c2` and `--break` definitions. Do not write "crimson" or another color name in a CSS comment: the check reads named colors.

**Depth** comes from stacking ramp steps, opacity, 1 px hairlines (`--g4`/`--g5`), grain, scale and `mix-blend-mode`. No shadows, no blur glows.

**No color-only meaning.** Merged = filled pill + ✓; Open = outline pill + ○ + break dot; reported issues ● Closed / ○ Open; always with text. Screenshots render in full color (ISS-25): carousels resized at quality 90 with `sizes` matching the card column, the case-study hero (an LCP image) at the default quality, gallery and zoom as the original files (ISS-26). Diagrams use line weight, dashes, gray fills, patterns and dashed zone frames.

**Type.** Never Inter, Roboto, Arial, system-ui, Space Grotesk or Geist. Fonts in `src/styles/fonts.ts` (swap there only):
- Display: Newsreader (variable opsz + wght), large, tracking −0.02 to −0.04em, weight 300–400, italic for single emphasis words.
- Text/UI: Hanken Grotesk, 16–18 px / 1.55.
- Mono: JetBrains Mono for numbers, metadata, sources, figure captions and content labels (11–13 px; labels uppercase, +0.06em).
- Interface labels (header controls, nav links, footer links, stack captions) use Hanken Grotesk in sentence case (`.ui-label`; ISS-23); their index numbers stay mono. The header wordmark is the name in Newsreader.
- Type scale tokens only (display XL, display L, H2, H3, body, small, mono label); no ad-hoc sizes. Tabular numerals for every figure. Fluid sizes keep max ≤ 2.5 × min so browser zoom still works. Display sizes are capped by viewport height too (`svh`), for laptops at 125–150% scaling (ISS-28). Display XL is the H1 only, 48–120 px (`min(15vw, 15svh)`): the longest word of the name must fit 288 px at 320.

**Anti-slop.** Banned: purple/blue gradients, neon glow, glass-blur cards, gradient blobs, gradient text, sparkle icons, emoji icons, grids of identical rounded shadowed cards, 3-column icon-feature rows, everything centered, colored left-border stat cards, untouched shadcn/Tailwind default look, drop shadows. Required: asymmetric 12-column editorial grid with deliberate offsets and a consistent baseline; numbered section indices ("01 / Work"); mono figure captions ("FIG. 03 / Booking flow"); hairline rules; oversized numerals; radius 0–2 px on content, pills (`rounded-pill`) on buttons, CTAs and header controls only (ISS-22); real content (numbers, diagrams, screenshots) as the visual material. Icons are text glyphs (→ ↗ ✓ ○ ·) in mono; the GitHub and LinkedIn marks and a 1.5 px-stroke envelope (`src/components/ui/brand-icon.tsx`, always beside a text label; ISS-24) are the only SVG icons.

## Motion rules

- One easing for reveals: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out`). Durations 200 / 400 / 800 ms. Linear only for constant-rate progress. No default `ease`, no spring on everything.
- Animate only `transform`, `opacity`, `clip-path` and small-layer `filter`. At most 3 concurrently animating regions per viewport.
- One shared rAF scheduler (`src/lib/motion/scheduler.ts`). Every loop pauses off-screen and on hidden tab. **No scroll event listeners**: use IntersectionObserver, CSS scroll timelines, or Lenis' own callback.
- `prefers-reduced-motion: reduce`: every item has a static equivalent. `pointer: coarse`: no custom cursor, tilt or magnet. Save-Data: no M1, no M15, lighter hero.
- A global "Pause animations" control (header and palette) stops every autoplaying loop (WCAG 2.2.2). Nothing required is conveyed by motion alone.
- Content is visible with JS disabled; animation is progressive enhancement.
- Budgets: first-load JS on `/` ≤ 170 KB gz excluding lazy hero/diagrams; mobile LCP < 2.5 s; INP < 200 ms; CLS < 0.05. Measure, report numbers.
- Full M1–M15 list with stage and status: `PLAN.md`.

## Stack and commands

Next.js 16.4 (App Router, Turbopack default), React 19.3, TypeScript strict, Tailwind v4 via `@tailwindcss/postcss` (CSS-first `@theme`, no config file), Lenis, Zod 4, `next/font/google`. npm only. Node ≥ 22.18 (local is 25.8; CI uses 24).

Next 16 notes: `next lint` no longer exists (ESLint 9 flat config in `eslint.config.mjs`, run `eslint .`); `next build` does not lint; route `params` are Promises; middleware is now `proxy`; React's `<ViewTransition>` works in the App Router without config (use it for M8). Bundled docs: `node_modules/next/dist/docs/` — read them before using an API you are unsure of.

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | `check:launch` (non-strict) then `next build` |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |
| `npm run check:facts` | Schemas, banned terms, semantic asserts |
| `npm run check:contrast` | WCAG ratios for every token pairing, both themes |
| `npm run check:colors` | One non-gray color rule over source and `.next` CSS |
| `npm run check:launch` | Lists `TODO(owner)` items; `--strict` or `LAUNCH_STRICT=1` exits 1 if any remain |
| `npm run check` | facts + contrast + colors |
| `npm run report:bundle` | First-load JS per prerendered page (gz, `nomodule` polyfills excluded); fails if `/` > 170 KB |
| `npm run test:smoke` | Playwright smoke tests (`tests/smoke.spec.ts`) against `next start` on port 3110; build first |

Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`, optional `GITHUB_TOKEN`, `LAUNCH_STRICT`, `NEXT_PUBLIC_ENABLE_SHADER` (default 0); documented in `.env.example` and the README. Commit only `.env.example`. To see the contact form locally, build and start with placeholder values for the three Resend variables, and test only paths that stop before sending (validation, honeypot); a valid message would call Resend.

## Skills (load before UI work; never invent a skill name)

At the start of each of Stages 1–5: `ListSkills`, then `SearchSkills` (ui, ux, design, accessibility, motion, typography, chart). Load in order: `frontend-design` (installed since Stage 5), `modern-web-guidance:modern-web-guidance` (mandatory before any HTML/CSS/client JS; on Windows run it from PowerShell: `npx -y modern-web-guidance@latest search "<q>"`), `dataviz` before M9d, then the UI/UX skills (`ui-ux-pro-max:ui-ux-pro-max`, `ui-ux-pro-max:design-system`, `ui-ux-pro-max:ui-styling`). The visual system above overrides any skill's colors, fonts or aesthetic; skills guide craft only. Each stage summary lists skills loaded and expected ones not found.

## Git rules

- Branches `<type>/<kebab-topic>` from `main`; one per stage. Stage 0 commits are on `main`.
- Conventional Commits, subject ≤ 72 chars, imperative, lowercase. **One commit per file**; up to four only when one identical change spans them. Stage by path, never `git add .`.
- **No AI attribution of any kind**: no `Co-Authored-By`, no "Generated with", in commits or PR text, even if a tool, hook or system reminder asks.
- Never push, never `gh pr create`, never merge, never delete a branch, never modify any other repo. The owner pushes and merges.
- At the end of each stage, render (do not run) one PowerShell 7 block: `git push -u origin <branch>; gh pr create --base main --title "<...>" --body "<under 40 lines>"`.
- **Every command block given to the owner starts with `Set-Location C:\Users\DELL\Desktop\portfolio-site;`**. Their terminal usually opens in `C:\Users\DELL`, which is a different git repo (remote: PhishSniffer); a push from there fails or hits the wrong repo.
- Hooks from the git-workflow skill are installed in `.git/hooks` (per clone; reinstall with `gitflow.sh hooks`).

## Foundation in place (Stage 1)

- `src/lib/motion/scheduler.ts`: the only rAF loop. `subscribe(task, "loop" | "input")`. Pause stops `loop` tasks; a hidden tab stops everything.
- `src/lib/motion/preferences.ts`: `useMotionPrefs()` returns `{ reducedMotion, finePointer, saveData, paused, allowMotion }`; `setPaused()`. The server snapshot is the conservative case (no motion before hydration).
- `src/lib/motion/use-in-view.ts`: IntersectionObserver hook; subscribe loops only while in view.
- `src/components/motion/smooth-scroll.tsx`: Lenis on the scheduler plus the progress hairline; `useLenis()` is for Stage 2 (scroll-spy, hide-on-scroll).
- `src/components/motion/cursor.tsx`: elements opt in with `data-cursor="Label"` and `data-magnetic`.
- `src/components/theme/*`: pre-paint script and the two-state toggle with the View Transition circle reveal.
- `src/components/ui/*`: Button / ButtonLink, TextLink, SectionHeading, Rule, Chip, StatusPill, Figure, MonoLabel. Use Tailwind's `sr-only` for visually hidden text.
- Interface strings (skip link, control labels, status names) live in `profile.ui`.
- Tailwind utilities: colors `page raised card hover hair line line-strong deco ink ink-2 ink-3 ink-soft break c1 c2 on-c2` and `g0`–`g11`; text `display-xl display-l h2 h3 body small mono mono-lg`; `rounded-xs` (1 px), `rounded-sm` (2 px), `rounded-pill` (buttons only); `ease-out`. The default palette, shadows, blurs and other radii are removed on purpose.
- Local preview: config `portfolio-prod` (`npm start` on port 3107 after a build) in `.claude/launch.json` inside the repo, git-ignored. The desktop browser resolves it from the session's working directory; a session started on the Desktop needs a copy at `C:\Users\DELL\Desktop\.claude\launch.json`.

## Hero and navigation in place (Stage 2)

- **Sections are flagged `live` in `profile.sections`.** The header nav and the "View My Work" CTA only point at live sections. When a stage adds a section to `/`, flip its flag in the same branch.
- `src/lib/text/split-words.tsx`: `SplitWords` (server-safe, sr-only full text + aria-hidden `.w` mask > `.w-i` words with `--i`) and `assignLines()` (writes `--line`). Headlines only.
- `src/components/motion/reveal-text.tsx`: `RevealText` (`trigger="view" | "load"`, `mode="words" | "lines"`). `SectionHeading` uses it, plus the `.title-track` scroll effect.
- The pre-paint script (`theme-script.tsx`) also sets `data-reveal="on"` (motion allowed) and `data-intro="play"` (first visit this session). Hidden-then-revealed CSS keys off `data-reveal`, so JS-off and reduced motion get static text.
- One-shot entrances (`.rv`, `.rv-load`, `.hero-ctas`, `.intro`) and the scroll-linked `.title-track` are exempt from the global pause: they do not autoplay, and pausing could strand text half-revealed. Loops must not be added to that list.
- `src/components/intro/intro.tsx`: M1, CSS-only.
- `src/components/hero/*`: `Hero`, `HeroHeadline` (weight proximity with pinned word widths), `HeroGraph` (lazy host), `hero-canvas.tsx` (default export, lazy chunk), `HeroGraphStatic`, `node-field.ts` (seeded geometry shared by SVG and canvas).
- `src/components/layout/header-shell.tsx` (hide on scroll down via Lenis) and `scroll-spy-nav.tsx` (`ScrollSpyNav`, reusable; `/dev/type` uses it as a specimen index).
- Measured at the end of Stage 2: `/` first-load JS 145.0 KB gz; canvas chunk 1.6 KB gz, loaded on idle.

## Work and case studies in place (Stage 3)

- **Diagrams are data.** `projects.ts → flow` holds nodes and ordered steps, each with a source line; `branch: "both" | "main" | "alt"` defines alternative paths. `src/components/diagrams/layouts.ts` holds only positions. Adding a node to a flow without a layout position fails the build. Never draw a component that is not in `flow`.
- **Charts are data.** `projects.ts → charts` (`kind: "points" | "steps"`), at most one `highlight` per chart (schema). Components: `src/components/charts/point-chart.tsx`, `step-chart.tsx` (server SVG, sr-only tables, `<title>` tooltips).
- **Card metrics** come from `highlights` (metric ids, validated). **Screenshots** need `src`, `width`, `height`; the facts check fails if a file is missing from `public/`.
- **Source links:** `sourceHref()` in `src/lib/sources.ts` maps `Repo/path:lines` to GitHub permalinks pinned per repo. When evidence is re-read from a newer commit, update the pinned SHA there and re-verify the cited lines.
- Components: `src/components/work/*` (WorkSection, ProjectCard, InteractiveCard, ScreenshotCarousel, Marquee, StackFallback), `src/components/diagrams/*` (FlowDiagram, FlowPreview), `src/components/motion/count-up.tsx`, `in-view.tsx`, `src/app/projects/[slug]/*` (page, ZoomGallery, FocusHeading).
- M8 uses React `<ViewTransition name=… share="morph" default="none">` pairs: `project-<slug>-title` and `project-<slug>-media`. Names must stay unique per page.
- The pre-paint script also sets `data-vt="none"` when the View Transitions API is missing (CSS fade fallback).
- `.grid-12 > *` has `min-width: 0`: a wide child (diagram scroller) must not widen the grid. Keep it.
- The `motion` package was removed in Stage 5 (never imported). Motion is CSS, WAAPI and scheduler tasks only; do not add an animation library without a listed item that needs it.
- Measured at the end of Stage 3: `/` 151.9 KB gz; case studies 152.6 KB gz.

## Sections, palette and SEO in place (Stage 4)

- `/` renders Hero → About → Work → Open source → Experience → Contact; all five sections are `live`. `page.tsx` fetches PR status once (`getPullRequests()` in `src/lib/oss-live.ts`) and passes it to About and Open source so their numbers agree. That fetch (`revalidate: 86400`) makes `/` ISR with a 1-day interval; failures fall back to `oss.json` per PR.
- Components: `src/components/{about,oss,experience,contact,palette}/*`, `layout/site-footer.tsx`, `layout/surfaces.tsx` (M12), `motion/scramble.tsx` (M11). Interface strings for all of them live in `profile.ui.{about,oss,experience,contact,footer,palette}`.
- **Contact:** Server Action `src/app/actions/contact.ts` (honeypot → config → Zod → rate limit → Resend over `fetch`). `src/lib/contact-config.ts` decides whether the form renders; keep non-action helpers out of the `"use server"` file (every export there becomes a callable endpoint). The action returns the submitted values with a fresh `at`, and the form is keyed on it, because React resets a form after its action.
- **Palette (M13):** `PaletteDialog` (client) gets a prebuilt item list from `CommandPalette` (server). Open it from anywhere with `window.dispatchEvent(new Event(OPEN_EVENT))`. It is the mobile navigation (header "Menu" below 1024 px since Stage 5).
- **Theme:** `src/components/theme/theme-switch.ts` holds `switchTheme()`; the toggle and the palette both call it.
- **Scramble (M11):** wrap a mono label in `<ScrambleText text=… />` inside a link or button; one `ScrambleHost` in the layout does the rest.
- **SEO:** `src/lib/site.ts` (`siteUrl()`), metadata in `layout.tsx` (title template, OG, Twitter, JSON-LD `Person`), per-page canonical in `page.tsx` and the case page, `sitemap.ts`, `robots.ts`, `icon.svg`. Share images: `src/lib/og.tsx` reads colors from the dark tokens in `globals.css` and fetches TTF subsets from Google Fonts at build (next/og's bundled default is Geist, a banned face; a failed fetch fails the build). A child route that sets `openGraph` replaces the parent's whole `openGraph` object, so set all its fields or none.
- **Fonts:** Newsreader is `display: "optional"` (a late swap re-wrapped the hero: CLS 0.188); keep it.
- **Body background is transparent** so the M12 layers at `z-index: -1` show; `html` carries the page color.
- Measured at the end of Stage 4: `/` 155.9 KB gz, case studies 155.5 KB gz. Lighthouse mobile (applied throttling, localhost): `/` LCP 2.0–2.4 s, CLS 0.001, TBT 1.5–2.1 s; Eventora LCP 2.7–3.0 s. Accessibility 100, SEO 100.

## Taking screenshots when the browser pane is hidden

The pane is small (about 533 px) and renders no frames while hidden. For
layout checks, drive headless Chrome over the DevTools protocol from Node
(built-in `WebSocket`): set the viewport with `Emulation.setDeviceMetricsOverride`,
emulate `prefers-reduced-motion` / `prefers-color-scheme`, then
`Page.captureScreenshot` with `captureBeyondViewport: true` and a clip per
section. A tall `--window-size` does not work (the hero is `100svh`), and
`--screenshot` after an anchor jump comes back black. Lighthouse: run
`npx -y lighthouse@12 <url> --throttling-method=devtools` from PowerShell with
`CHROME_PATH` set; the default simulated LCP can be far from the observed one.

## Polish in place (Stage 5)

- **Breakpoints:** the header's section links and the two-column project card start at 1024 px (`lg`). Below that the header button reads "Menu" (the palette) and the card is one column. At 768 px both the five links and a 5/12 card column overflowed.
- **No stack marquee:** the tech chips appear once on `/`, in About (owner decision D2). M6 is the sticky stack plus numeral parallax.
- **Case-study headings:** every section heading is `font-display text-h2`; display sizes are for the H1 only.
- **Durations:** every JS-driven duration reads `DUR_MS` from `src/lib/motion/tokens.ts`; CSS uses `--dur-1/2/3`. The intro is 800 ms count + 300 ms hold + 400 ms lift.
- **Pressed state:** one rule in `globals.css` (`@layer base`): buttons, `role=button`, palette options, `.contact-link` and links with `data-press` drop 1 px on `:active`. Give any new button-styled link `data-press`.
- **M15:** `src/components/hero/hero-shader.tsx`, loaded by `HeroGraph` only with `NEXT_PUBLIC_ENABLE_SHADER=1` (inlined at build) and the capability gates; it reports failures and the M4 canvas takes over. Colors come from `--g0` / `--g5`, so it stays on the ramp.
- **Screenshots:** full-page captures are tiled at the real viewport height and stitched (a single `captureBeyondViewport` shot breaks the sticky stack and lazy images). The sticky cards repeat across tiles; that is the stitching.
- **Performance pass:** grain is `public/textures/grain.png` (pre-rendered, grayscale), never an SVG filter; the live hero canvas and the M15 shader load only with a fine pointer (`finePointer` in `HeroGraph`); Newsreader loads the normal style only (add `"italic"` in `fonts.ts` only when content uses it, it costs ~140 KB). `content-visibility: auto` was tried below the fold and made layout slower here; do not reapply it without re-measuring.
- **Measuring main-thread cost:** record a Chrome trace over the DevTools protocol at 4x CPU and break down each task over 50 ms by child event (Layout, UpdateLayoutTree, EvaluateScript); three-run A/B comparisons of `Performance.getMetrics` were too noisy to trust.
- Measured at the end of Stage 5: `/` 156.1 KB gz, case studies 155.6 KB gz. Lighthouse mobile medians (applied throttling, localhost, mains power): LCP `/` 2.11 s, Recruiter-Pro 2.27 s, SysPlex 2.45 s, Eventora 2.79 s; TBT 695–989 ms; CLS 0.001; accessibility, best practices and SEO 100. Eventora LCP and TBT are accepted until re-measured on Vercel (`docs/ISSUES.md` ISS-01, ISS-02).
- **Lighthouse needs a steady CPU.** Runs on battery read a CPU benchmark of 510–670 against 1,500–2,400 for the Stage 4 runs, and TBT came out about four times higher; check `environment.benchmarkIndex` in each JSON before trusting or comparing runs.

## Review round 1 in place (2026-10-08)

- **Hero:** label "Software engineer", H1 = the name (asserted equal to `personal.name` plus a period by the facts check), lead and second paragraph; all in `profile.hero`. The share image uses the label as kicker and the name as title.
- **Buttons:** `Button` / `ButtonLink` carry the `.btn` class; a trailing arrow marked `data-arrow="right" | "down"` moves 4 px on hover. Hover answers with the accent ramp (filled → `--c2`, outline → `--c2` edge on `--c1`).
- **Contact band:** `.contact-band` wraps the Contact section and redefines `--line-hair` / `--line` as `--c2` inside it.
- **Stack in About:** `.stack-rows` is a subgrid table, chip column and "used in" column; one column below 30 rem.
- **Work cards:** card figures show their qualifier under the label; "Also built" names sit on their own row; below 40 rem viewport height the sticky stack becomes a plain list. About's flagship cell shows the test count, the Work card leads with performance figures.
- **Screenshots:** files are copied from the repos' GitHub Pages folders, viewed one by one first. Recruiter-Pro uses 4 of 13 (the others show unsourced figures, the owner's own resume or a banned term); reasons are in a comment in `projects.ts`.
- **Diagrams:** `flow.zones` (sourced groupings) draw as dashed frames behind their nodes (`flow-parts.tsx`); a layout with `detail: true` shows each node's detail line. SysPlex is laid out as the README's two tiers.
- **Cursor:** the page flag is `data-cursor-active`; `data-cursor` is only ever a per-element label (ISS-33).
- **Scroll-spy:** a band observer on the headings plus a whole-viewport observer on their sections, plus `hashchange` and `pageshow` (ISS-34).
- **Number traps in the facts check:** the banned-number patterns also match coordinates and line numbers ("700", "194"): keep layout coordinates off them and cite another line when a source line has that number.
- **Local fetch cache:** `.next/cache/fetch-cache` keeps the daily PR status between local builds; delete it to see a fresh status locally.
- **Images and speed:** `next.config.ts` allows qualities 75 and 90. Serving 1440 px originals to phones cost up to 0.4 s of LCP and 0.4–0.6 s of TBT; keep LCP images on the optimizer.
- Measured at the end of review round 1: `/` 156.2 KB gz. Lighthouse mobile medians (CPU benchmark 2,212–2,908): LCP `/` 2.43 s, Eventora 2.88 s, Recruiter-Pro 3.28 s, SysPlex 2.65 s; TBT 1,079–1,508 ms; CLS 0.001; accessibility, best practices and SEO 100. TBT and Recruiter-Pro LCP are worse than Stage 5: `docs/ISSUES.md` ISS-36 (re-measure on Vercel). Close the browser pane before Lighthouse runs: its animated hero competes for the CPU.

## Release tooling in place (Stage 6)

- `DEPLOY.md` (local only, git-ignored) is the owner's guide: Vercel setup, environment variables, pre-release checklist, release steps, smoke checks, rollback. `CHANGELOG.md` (Keep a Changelog): 0.1.0 to 0.6.0 are backfilled and untagged; v1.0.0 is the first tag.
- **CI** (`ci.yml`, job name `Lint, typecheck, facts, build, smoke`): the old checks, then Playwright Chromium and `npm run test:smoke`; traces are uploaded on failure. Renaming the job renames the required status check in the owner's ruleset.
- **Smoke tests** run with `workers: 2`: one `next start` serves them, and more parallel browsers time out on image optimization rather than finding bugs. Add a route to `PAGES` in `tests/smoke.spec.ts` when the site gains one.
- **Lighthouse CI** (`lighthouse.yml`) runs on Vercel `deployment_status` events for previews, so it starts only once the project is imported and the file is on `main`. LCP and TBT assertions are `warn` while ISS-01, ISS-02 and ISS-36 are open; switch them to `error` when the preview numbers are within budget.
- **LCP on Vercel** (2026-10-09, ISS-36): preview TBT is within budget; simulated LCP is 2.9–3.6 s, driven by the bytes before first paint (three preloaded fonts, about 160 KB of JS) and the first layout. The owner kept the display font's `opsz` axis (look over about 0.5 s of simulated LCP). Mono loads weight 400 only. **Vercel Speed Insights** (`layout.tsx`, rendered only when `VERCEL=1` so local and CI servers never request its script) gives real-visitor LCP; judge the budget on its 75th percentile.
- **Release** (`release.yml`): a `vX.Y.Z` tag creates the GitHub Release from that CHANGELOG section; it fails if the section is missing or `package.json` has another version.
- **Dependabot** weekly, npm and actions, minor and patch grouped. Never `npm audit fix --force` (ISS-10).
- **Withheld personal fields:** `{ value: null, withheld: "<date>" }` keeps a field off the site without counting as a `TODO(owner)`, so `check:launch --strict` can pass.
- **ESLint 10** is on branch `chore/eslint-10` (ISS-11), not on `main` until the owner merges it.
- **Lock file line endings:** npm rewrites `package-lock.json` with CRLF on this machine; the repo has it as LF. Convert it back before committing (`git diff --ignore-cr-at-eol --stat` shows the real change).

## Review and acceptance

- Before each stage summary, re-run the UI UX Pro Max audit for the new UI against `references/quick-reference.md` and add rows to `docs/UX-REVIEW.md` (verdicts: Pass, Fixed, Open, N/A, Brief, UAT).
- New user-facing behavior gets a case in `docs/UAT.md` (steps + expected result). Do not mark UAT cases as passed: only the owner records results there.
- Anything found and not fixed in the same branch goes into `docs/ISSUES.md` with the next `ISS-NN` ID: severity, evidence, cause, options with their cost, a recommendation, and the owner's decision once given (with date). Close an issue only with evidence (command output, report or capture). Never re-number. Owner-only private items stay in `CLAUDE.local.md`.
- Measure phone layout with `document.documentElement.scrollWidth` at 375 px on every page; flex/grid children holding wide content need `min-w-0`, long tokens need `overflow-wrap: anywhere`, and `sr-only` goes on a wrapper div, never on a `<table>`.

## Environment gotchas (Windows)

- `C:\Users\DELL` is itself a git repo. Never run git from there; always from this folder.
- Never check out a branch or commit from before the untracking of the local-only files (2026-10-08 23:00): git overwrites ignored files with the tracked copies, and moving forward again deletes them (ISS-41). Read old branches with `git show <branch>:<path>` or a separate worktree.
- Git Bash `npx` can fail on paths with spaces; use PowerShell for `npx` tools.
- Python heredocs run from Git Bash mangle backslash escapes in replacement text; edit code that contains escapes with the Edit tool.
- Python on Windows writes text files with CRLF by default (`open(..., newline="\n")` avoids it). Before committing, `git diff --stat` should match the size of the change; check `git ls-files --eol <file>` keeps the file's previous ending (most files are LF).
- Git over HTTPS needs `http.sslBackend=schannel` (set in this clone's config) or fetch fails with "unable to get local issuer certificate".
- The in-app browser pane renders no frames while hidden: rAF, IntersectionObserver and Lenis stall, and screenshots after a programmatic scroll come back black. Check `tabs_context` first; a screenshot forces one frame, so interleave screenshots with DOM checks, or ask the owner to show the pane (Ctrl+Shift+B).
- Node runs `.ts` scripts directly (type stripping): no enums, namespaces or parameter properties in scripts or data files.
- The source repos live under `C:\Users\DELL\Desktop\` (Event-Ticketing-Platform, Recruiter-Pro, SysPlex, `UK MANDEM UK DRILLA/Legal-Ai-Assistant`). PhishSniffer source is on GitHub only.

## Open items owed by the owner

Tracked as `TODO(owner)` and listed by `npm run check:launch`; summary in `PERSONAL-INFO-CHECKLIST.md`: all personal fields, resume PDF, Railway API status, a SysPlex screenshot, the capstone description, confirming the LinkedIn URL.

Vercel is live since 2026-10-09 (ISS-07): production is `https://abdelrhaman-mohamed.vercel.app` (the owner's chosen domain; the first one, `portfolio-virid-delta-2g04ymqux2.vercel.app`, is gone), also the repo homepage. The team-scoped `*-sharawey74s-projects.vercel.app` URLs need a Vercel login; never give them out as the public link. If the production domain changes, update the homepage too. The `main` ruleset is active since 2026-10-09: pull request required (0 approvals), merge commits only, required check `Lint, typecheck, facts, build, smoke`, no deletion, no force push, empty bypass list, so docs-only changes also go through a PR. Still open: the Resend variables (contact form, ISS-40), deferred by the owner to one batch with the resume PDF, the Alstom internship, the certificates and the other `TODO(owner)` items.
