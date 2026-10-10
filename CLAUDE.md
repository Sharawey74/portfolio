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
- **Stage 7 redesign decided** (owner, 2026-10-10, `docs/ISSUES.md` ISS-42): a Resend-style system (black, gradient headings, translucent borders, rounded cards, a code-block section) with GetLayers-style motion, own assets, free fonts (Inter allowed for body, Commit Mono for code) and a red accent, before v1.0.0. Nothing is copied from either site. The mock-up was approved on 2026-10-10 and the visual system below was rewritten in the Stage 7 foundation step (7.2); the hero (7.3) and the sections and case studies (7.4) are restyled. All of Stage 7 is on one branch, `feat/stage7-redesign`, and lands as one pull request after 7.6.

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

**Stage 7 system** (owner decisions 2026-10-10, `docs/ISSUES.md` ISS-42; approved mock-up v3). Resend-style structure with GetLayers-style motion, built here: no fonts, videos, images or code copied from either site.

**Color.** A black page, a neutral gray ramp for surfaces and text, two translucent blue-white edge colors for lines, and one red accent family for marks. Text is the gray ramp, with two `--break` text uses: the H1's final period (and the wordmark's) and the section index numbers ("01"). Dark is default; light mirrors it.

| Token | Dark | Light | Role |
|---|---|---|---|
| `--g0` | #000000 | #FFFFFF | page |
| `--g1` | #050505 | #FAFAFA | raised |
| `--g2` | #0A0A0A | #F5F5F5 | card |
| `--g3` | #121212 | #EDEDED | hover |
| `--g4` | #1C1C1C | #E3E3E3 | (hairline fallback) |
| `--g5` | #262626 | #D4D4D4 | border fallback |
| `--g6` | #3D3D3D | #B8B8B8 | strong border, switch track |
| `--g7` | #5E5E5E | #999999 | decoration only, never text |
| `--g8` | #949494 | #5C5C5C | text-3 |
| `--g9` | #B8B8B8 | #404040 | text-2 |
| `--g10` | #D4D4D4 | #262626 | text-soft, filled-button hover |
| `--g11` | #F0F0F0 | #111111 | text |
| `--edge` | rgba(214,235,253,.22) | rgba(18,30,45,.18) | `--line`: borders, a card's top edge |
| `--edge-soft` | rgba(217,237,254,.14) | rgba(18,30,45,.11) | `--line-hair`: dividers, a card's other edges |

`globals.css` is the source of truth for the exact values; any value changed to pass contrast is logged in its header comment.

**Accent** (red; `#FF3B4E` approved 2026-10-10, ISS-42). `--break` is the one bright red; `--c2` remains for `::selection` and `--c1` for the palette's selected option.

| Token | Dark | Light | Job |
|---|---|---|---|
| `--break` | #FF3B4E | #C4152A | Marks: live/open status dot, active nav dot, focus ring, the switch track when on, the single active node in motion graphics, one highlighted value per chart, the H1 and wordmark periods, section index numbers, brand icons on hover, the hero glow and the announcement pill's moving edge |
| `--c2` | #8E1428 | #A3142A | `::selection` (text `--on-c2`) |
| `--c1` | #3A0810 | #F6E2E5 | The palette's selected option (the Contact band is retired since 7.4) |

- Allowed since Stage 7: gradient text on the H1 and section H2s only (`.text-gradient`: the full text color to 45 %, fading to 75 %; 50 % read as grey, ISS-43), soft red glows in the hero and behind the closing line only, translucent edge lines. Still forbidden: colored body or heading text beyond the `--break` uses above, purple or blue gradients, glass-blur cards, drop shadows, accent fills on cards, `--break` as a fill larger than a chip (the switch track is a chip).
- `scripts/check-contrast.ts` checks every pairing in both themes: text ≥ 4.5:1, graphics ≥ 3:1.
- `scripts/check-colors.ts` fails on any non-gray color literal other than the `--c1`, `--c2`, `--break` and `--edge` / `--edge-soft` definitions (the compiler writes the edges as 8-digit hex in the built CSS; both forms are accepted only in those declarations). Do not write "crimson" or another color name in a CSS comment: the check reads named colors.

**Depth** comes from stacking ramp steps, translucent edges (the top edge of a card stronger than the rest), a faint raised fill on cards, grain, scale and `mix-blend-mode`. No drop shadows.

**No color-only meaning.** Merged = filled pill + ✓; Open = outline pill + ○ + break dot; reported issues ● Closed / ○ Open; always with text. Screenshots render in full color (ISS-25): carousels resized at quality 90 with `sizes` matching the card column, the case-study hero (an LCP image) at the default quality, gallery and zoom as the original files (ISS-26). Diagrams use line weight, dashes, gray fills, patterns and dashed zone frames.

**Type.** Four free faces in `src/styles/fonts.ts` (swap there only). Still banned: Roboto, Arial, system-ui, Space Grotesk, Geist.
- Display: Newsreader (variable opsz + wght, normal style only), for the H1, the wordmark and display lines; weight 300–400, tracking −0.02 to −0.04em. `display: optional`, preloaded.
- Headings: Instrument Sans for section H2s (`text-section`, 40–56 px, tracking −0.05em, gradient text), H3s and large figures. Not preloaded.
- Text/UI: Inter, 16–18 px / 1.55, and `.ui-label` (header controls, nav links, footer links) in sentence case. Preloaded (the LCP paragraph).
- Mono: Commit Mono (self-hosted from `@fontsource/commit-mono`, 400, latin) for numbers, metadata, sources, figure captions and content labels (11–13 px; labels uppercase, +0.06em). Not preloaded.
- `font-size-adjust: from-font` is set on the body and recomputed on every element in another face (H1–H3, code, kbd, `.font-display`, `.font-heading`, `.font-mono`, `.mono-label`): its computed value inherits as a number, and Inter's x-height once scaled the H1 by about 20 % until it clipped at 375 px.
- Type scale tokens only (display XL, display L, section, H2, H3, body, small, mono label); no ad-hoc sizes. Tabular numerals for every figure. Fluid sizes keep max ≤ 2.5 × min so browser zoom still works. Display sizes are capped by viewport height too (`svh`), for laptops at 125–150% scaling (ISS-28). Display XL is the H1 only, 48–120 px (`min(15vw, 15svh)`): the longest word of the name must fit 288 px at 320.

**Shape.** Pills (`rounded-pill`) for buttons, badges, tabs, filters, chips and header controls; `rounded-card` (24 px) for section cards (`.surface-card`); `rounded-inner` (14 px) for media and panels inside a card. The header is a fade, not a bar (`.header-fade`), with a white pill "Contact" link.

**Anti-slop.** Banned: purple/blue gradients, neon glow, glass-blur cards, gradient blobs, sparkle icons, emoji icons, drop shadows, colored left-border stat cards, untouched shadcn/Tailwind default look. Required: numbered section indices ("01 / Work"); mono figure captions ("FIG. 03 / Booking flow"); real content (numbers, diagrams, screenshots) as the visual material; every figure with its qualifier and source. Icons are text glyphs (→ ↗ ✓ ○ ·) plus the GitHub and LinkedIn marks and a 1.5 px-stroke envelope (`src/components/ui/brand-icon.tsx`, always beside a text label; ISS-24), which lift and take `--break` on hover (`.icon-link`). Arrows nudge toward where they point (`.nudge` with `data-arrow="right" | "out"`).

## Motion rules

- One easing for reveals: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out`). Durations 200 / 400 / 800 ms. Linear only for constant-rate progress. No default `ease`, no spring on everything.
- Animate only `transform`, `opacity`, `clip-path` and small-layer `filter`. At most 3 concurrently animating regions per viewport.
- One shared rAF scheduler (`src/lib/motion/scheduler.ts`). Every loop pauses off-screen and on hidden tab. **No scroll event listeners**: use IntersectionObserver, CSS scroll timelines, or Lenis' own callback.
- `prefers-reduced-motion: reduce`: every item has a static equivalent. `pointer: coarse`: no custom cursor, tilt or magnet. Save-Data: no M1 intro.
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

Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`, optional `GITHUB_TOKEN`, `LAUNCH_STRICT`; documented in `.env.example` and the README. Commit only `.env.example`. To see the contact form locally, build and start with placeholder values for the three Resend variables, and test only paths that stop before sending (validation, honeypot); a valid message would call Resend.

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
- `src/components/hero/*`: `Hero`, `HeroHeadline` (weight proximity with pinned word widths; since Stage 7.3 gradient text and a blur-in per word), `HeroLight` (CSS-only light, Stage 7.3), `HeroFigures` (metric ids from `profile.hero.figures`, CountUp). The M4 node-graph canvas and the M15 WebGL shader were retired in 7.3 and their files removed in 7.6 (git history has them).
- The hero's announcement pill fills `profile.hero.announce.template` from `ossSummary()` over the page's PR list (passed from `page.tsx`), like About and Open source.
- `src/components/layout/header-shell.tsx` (hide on scroll down via Lenis) and `scroll-spy-nav.tsx` (`ScrollSpyNav`, reusable; `/dev/type` uses it as a specimen index).
- Measured at the end of Stage 2: `/` first-load JS 145.0 KB gz; canvas chunk 1.6 KB gz, loaded on idle.

## Work and case studies in place (Stage 3)

- **Diagrams are data.** `projects.ts → flow` holds nodes and ordered steps, each with a source line; `branch: "both" | "main" | "alt"` defines alternative paths. `src/components/diagrams/layouts.ts` holds only positions. Adding a node to a flow without a layout position fails the build. Never draw a component that is not in `flow`.
- **Charts are data.** `projects.ts → charts` (`kind: "points" | "steps"`), at most one `highlight` per chart (schema). Components: `src/components/charts/point-chart.tsx`, `step-chart.tsx` (server SVG, sr-only tables, `<title>` tooltips).
- **Card metrics** come from `highlights` (metric ids, validated). **Screenshots** need `src`, `width`, `height`; the facts check fails if a file is missing from `public/`.
- **Source links:** `sourceHref()` in `src/lib/sources.ts` maps `Repo/path:lines` to GitHub permalinks pinned per repo. When evidence is re-read from a newer commit, update the pinned SHA there and re-verify the cited lines.
- Components: `src/components/work/*` (WorkSection, WorkTabs, ProjectCard, InteractiveCard, ScreenshotCarousel; the M6 sticky stack and StackFallback were retired in Stage 7.4), `src/components/diagrams/*` (FlowDiagram, FlowPreview), `src/components/motion/count-up.tsx`, `in-view.tsx`, `src/app/projects/[slug]/*` (page, ZoomGallery, FocusHeading).
- M8 uses React `<ViewTransition name=… share="morph" default="none">` pairs: `project-<slug>-title` and `project-<slug>-media`. Names must stay unique per page.
- The pre-paint script also sets `data-vt="none"` when the View Transitions API is missing (CSS fade fallback).
- `.grid-12 > *` has `min-width: 0`: a wide child (diagram scroller) must not widen the grid. Keep it.
- The `motion` package was removed in Stage 5 (never imported). Motion is CSS, WAAPI and scheduler tasks only; do not add an animation library without a listed item that needs it.
- Measured at the end of Stage 3: `/` 151.9 KB gz; case studies 152.6 KB gz.

## Sections, palette and SEO in place (Stage 4)

- `/` renders Hero → About → Work → Open source → Experience → figure grid → closing line → Contact; all five numbered sections are `live` (the figure grid and the closing line are unnumbered, Stage 7.4). `page.tsx` fetches PR status once (`getPullRequests()` in `src/lib/oss-live.ts`) and passes it to the hero pill, About, Open source and the figure grid so their numbers agree. That fetch (`revalidate: 86400`) makes `/` ISR with a 1-day interval; failures fall back to `oss.json` per PR.
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

- **Breakpoints:** the two-column project card starts at 1024 px (`lg`); the header's section links start at 1280 px (`xl`, since Stage 7.3: with the Contact pill and the pause switch they wrapped to two lines at 1024 and, with their numbers, at 1440). Below that the header button reads "Menu" (the palette). The links' index numbers and the pause switch's text label show from 1536 px (`2xl`). At 768 px both the five links and a 5/12 card column overflowed.
- **No stack marquee:** the tech chips appear once on `/`, in About (owner decision D2). M6 was the sticky stack plus numeral parallax, retired in Stage 7.4 for the project tabs.
- **Case-study headings:** every section heading is `font-display text-h2`; display sizes are for the H1 only.
- **Durations:** every JS-driven duration reads `DUR_MS` from `src/lib/motion/tokens.ts`; CSS uses `--dur-1/2/3`. The intro is 800 ms count + 300 ms hold + 400 ms lift.
- **Pressed state:** one rule in `globals.css` (`@layer base`): buttons, `role=button`, palette options, `.contact-link` and links with `data-press` drop 1 px on `:active`. Give any new button-styled link `data-press`.
- **M15:** the optional WebGL2 shader (default off) was retired with the M4 canvas in Stage 7.3 and removed in 7.6, with its `NEXT_PUBLIC_ENABLE_SHADER` variable.
- **Screenshots:** full-page captures are tiled at the real viewport height and stitched (a single `captureBeyondViewport` shot breaks the sticky stack and lazy images). The sticky cards repeat across tiles; that is the stitching.
- **Performance pass:** grain is `public/textures/grain.png` (pre-rendered, grayscale), never an SVG filter; Newsreader loads the normal style only (add `"italic"` in `fonts.ts` only when content uses it, it costs ~140 KB). `content-visibility: auto` was tried below the fold and made layout slower here; do not reapply it without re-measuring.
- **Measuring main-thread cost:** record a Chrome trace over the DevTools protocol at 4x CPU and break down each task over 50 ms by child event (Layout, UpdateLayoutTree, EvaluateScript); three-run A/B comparisons of `Performance.getMetrics` were too noisy to trust.
- Measured at the end of Stage 5: `/` 156.1 KB gz, case studies 155.6 KB gz. Lighthouse mobile medians (applied throttling, localhost, mains power): LCP `/` 2.11 s, Recruiter-Pro 2.27 s, SysPlex 2.45 s, Eventora 2.79 s; TBT 695–989 ms; CLS 0.001; accessibility, best practices and SEO 100. Eventora LCP and TBT are accepted until re-measured on Vercel (`docs/ISSUES.md` ISS-01, ISS-02).
- **Lighthouse needs a steady CPU.** Runs on battery read a CPU benchmark of 510–670 against 1,500–2,400 for the Stage 4 runs, and TBT came out about four times higher; check `environment.benchmarkIndex` in each JSON before trusting or comparing runs.

## Review round 1 in place (2026-10-08)

- **Hero:** label "Software engineer", H1 = the name (asserted equal to `personal.name` plus a period by the facts check), lead and second paragraph; all in `profile.hero`. The share image uses the label as kicker and the name as title.
- **Buttons:** `Button` / `ButtonLink` carry the `.btn` class; a trailing arrow marked `data-arrow="right" | "down"` moves 4 px on hover. Hover answered with the accent ramp until Stage 7.2; since then it stays on the neutral ramp (see `button.tsx`).
- **Contact band:** retired in Stage 7.4 (the form sits on a section card; the direct links are pills under the closing line).
- **Stack in About:** `.stack-rows` is a subgrid table, chip column and "used in" column; one column below 30 rem.
- **Work cards:** card figures show their qualifier under the label; "Also built" names sit on their own row; (the sticky stack and its short-viewport list are retired since Stage 7.4). About's flagship cell shows the test count, the Work card leads with performance figures.
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

## Sections in place (Stage 7.4)

- **`data-js`:** the pre-paint script sets it whenever scripts run. Controls that only work with JS (`.js-only`, the Work tablist) show, and inactive panels (`.work-panel`) hide, only under it, so JS-off visitors get every project and row and the server HTML equals the first client render. Use the same pattern for any new tab or filter.
- **Client components get nodes, not data:** `WorkTabs` and `OssFilter` receive server-rendered panels and rows. Importing `profile.ts` or `projects.ts` in a client component would ship Zod and the data files to the browser.
- **Work:** `WorkTabs` (tablist, arrow keys, Home and End) over one `ProjectCard` per case study; the card shows the first six screenshots (`SLIDES` in `project-card.tsx`), so the order in `projects.ts` is the slider's order and the first is the case-study hero (M8 pair). "Also built" lists every non-commit metric, the stack, facts and caveats of the secondary projects.
- **Slider:** autoplay is a scheduler `loop` task that also writes `--p` on the active progress bar; the wipe direction follows `data-dir`. Dots are 24 px targets; inactive dots use `--text-3` for 3:1.
- **Open source:** rows in one `.surface-card`, filter All / Merged / Open with counts and a polite "Showing n of m". Reported issues are a second card.
- **Figure grid:** `profile.figures.items` (metric ids, or `{ oss: "merged" }`); a missing id fails the build. **Closing line:** `profile.closing`; the glow is the one `--break` glow outside the hero.
- **Gradient text and overlapping glyphs:** Chrome draws a seam where clipped gradient glyphs overlap (the case-study H1's "Ev" at −0.04em). That H1 stays solid; check new gradient headings at their real size.
- Measured at the end of 7.4: `/` 157.5 KB gz; smoke 21/21; `scrollWidth` = viewport at 320 and 375 on every page.

## Contrast and clarity (Stage 7.4.1, ISS-43)

- **Measure haze from pixels, not CSS.** The owner saw a grey veil; no overlay sat on the text or screenshots. Four shared settings added up: the grain lifted black to (6, 6, 6), translucent cards carried it inside, secondary text was one step too dim, and heading gradients ended at 50 %. Sample a black area with each M12 layer on and off before blaming a component.
- **Grain** is 0.02 (was 0.045; black now averages (3, 3, 3)). **Cards** (`.surface-card`, `.bento-cell`) fill with the text color mixed into the page color, opaque, so the grain stays outside them. Do not make a card fill translucent again.
- **The M12 grid** is an absolute layer on the first screen (`100svh`) and scrolls away with it. As a fixed layer it relied on a scroll-timeline fade, and under reduced motion it stayed over every screen.
- Screenshots were checked against their files (within 2/255 through the image optimizer): never add a filter or overlay above them.

## Motion in place (Stage 7.5)

- **Section rises** (`.rise`, `.rise-group > *` with `--i` from `:nth-child`): a scroll-linked `view()` animation of `translate` only. Never add opacity or scale to a scroll-linked entrance: mid-entry text failed contrast once (Stage 4), and a 0.97 scale shrank the slider dots below the fold to 23.3 px, failing Lighthouse `target-size` (Stage 7.6). Static without scroll-timeline support and under reduced motion; exempt from the pause (not autoplay). Do not put `.rise` on the cells of a gap-seamed grid (`.figure-grid`): moving cells open the seams; rise the whole grid.
- **User-triggered entries use `@starting-style`:** the newly shown Work panel and the open-source rows that return after a filter fade and rise (400 ms; rows 30 ms apart). Gated on `data-reveal`, so reduced motion and JS-off get no transition.
- **Section titles** blur into focus as their words rise (`.rv`; the 4 s safety animation also clears the blur).
- **Cards:** `.lift` lifts 2 px and brightens the top edge on hover (fine pointer); `InteractiveCard` is a spotlight only (soft light plus the hairline grid under the pointer). The 4° tilt was removed: the approved mock-up has a lift.
- **CSS loops pause off-screen through `LoopGate`** (`src/components/motion/loop-gate.tsx`, one IntersectionObserver setting `data-visible`): the closing glow breathes only while visible, stops with the pause and is still under reduced motion. The hero light still relies on the browser's off-screen throttling; give it a gate if it ever grows.

## QA in place (Stage 7.6)

- `/dev/type` shows the Stage 7 tokens (including the two edge lines) and components (pill group, section card with lift, nudge and brand-icon links).
- Measured at the end of Stage 7 (local, CPU benchmark 1,537–1,718, not comparable to earlier runs): accessibility, best practices and SEO 100 on all four pages; CLS 0.002 in 6 of 7 runs, one home run 0.182 from a late Inter swap re-wrapping the hero lead (ISS-44); `/` 157.4 KB gz; smoke 21/21; keyboard walk of `/` 139 stops, every one with a visible ring; `scrollWidth` = viewport at 320 and 375 on every page, both themes. LCP and TBT are judged on the Vercel preview and Speed Insights.

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

Vercel is live since 2026-10-09 (ISS-07): production is `https://abdelrhaman-mohamed.vercel.app` (the owner's chosen domain; the first one, `portfolio-virid-delta-2g04ymqux2.vercel.app`, is gone), also the repo homepage. The team-scoped `*-sharawey74s-projects.vercel.app` URLs need a Vercel login; never give them out as the public link. If the production domain changes, update the homepage too. The `main` ruleset is active since 2026-10-09: pull request required (0 approvals), merge commits only, required check `Lint, typecheck, facts, build, smoke`, no deletion, no force push, empty bypass list, so docs-only changes also go through a PR. The contact form is connected on Production since 2026-10-10 (ISS-40: Resend's shared sender `onboarding@resend.dev`, which delivers only to the Resend account's own address; previews show "not connected" by design). Still open for the owner: the resume PDF, the Alstom internship, the certificates and the other `TODO(owner)` items.
