# Issues register

Open issues, decisions taken, and the fixes on the table for each. This is the
one place to look for "what is still wrong and what are we doing about it".
Design-rule verdicts live in `docs/UX-REVIEW.md`, measurements in
`docs/reports/`, acceptance results in `docs/UAT.md`; entries here link to them.

| Field | Meaning |
|---|---|
| ID | `ISS-NN`, never reused. A closed issue keeps its ID and moves to "Closed" |
| Status | **Open** (no decision yet) · **Decided** (a decision is recorded, work may still follow) · **Owner** (only the owner can act) · **Closed** (resolved, with evidence) |
| Severity | **High** (blocks launch or breaks a budget in the brief) · **Medium** (visible or measurable, not blocking) · **Low** (polish) |

Last updated: 2026-10-08 (end of Stage 5; ISS-10 and ISS-11 from the owner's clean-install build log; ISS-12 to ISS-34 from the owner's review, round 1).

## At a glance

| ID | Issue | Severity | Status | Decision / next step | Revisit |
|---|---|---|---|---|---|
| ISS-01 | Eventora case study: mobile LCP 2.79 s (budget 2.5 s) | High | Decided | Option C: accept, re-measure on a Vercel preview | Stage 6 (Lighthouse on previews) |
| ISS-02 | Main-thread blocking: TBT 695–989 ms on every page (target 200 ms) | High | Decided | Option C: accept, re-measure on a Vercel preview | Stage 6 |
| ISS-03 | Phones and tablets show the still hero graph, not the live canvas | Medium | Owner | Kept for now; owner confirms or reverts after UAT-48 | Owner's UAT run |
| ISS-04 | INP is not measured with real visitors | Medium | Open | Needs a field-data source once the site is live | Stage 6 |
| ISS-05 | Open source shows up to four break-color dots at once | Low | Decided | Kept: the brief's open-status rule | When the PR list changes |
| ISS-06 | Some plain-CSS hover styles can stick after a tap on touch screens | Low | Open | Wrap them in `(hover: hover)` | Next UI change |
| ISS-07 | Vercel project not imported; repo homepage is a placeholder URL | High | Owner | Owner imports the project and sets the homepage | Before Stage 6 |
| ISS-08 | 13 `TODO(owner)` items (name, email, resume, screenshots and others) | High | Owner | Owner fills `src/data/personal.ts` and supplies files | Before v1.0.0 |
| ISS-09 | No owner UAT run recorded for Stages 3–5 | High | Owner | Owner runs `docs/UAT.md` (UAT-01 to UAT-48) | Before v1.0.0 |
| ISS-10 | `npm audit`: 5 high-severity advisories, all in the lint tooling (`braces` via `eslint-config-next`) | Medium | Decided | Accept for now: dev-only, nothing ships; never run `npm audit fix --force`; take the patched release when it exists | Weekly (Stage 6 Dependabot) |
| ISS-11 | `npm ci` warns that ESLint 9.39.5 is no longer supported | Low | Open | Move to ESLint 10 on its own branch, once the Next lint config is verified with it | Stage 6 or next maintenance branch |
| ISS-12 | Hero headline: owner wants a more professional, distinctive line for a software engineer | High | Owner | Owner picks or writes the new line (options in the detail); it replaces the approved hero copy | Review round 1, R0 |
| ISS-13 | Hero sub: remove "Software Engineering student at AASTMT (Jun 2027)" | Medium | Decided | Remove the sentence; keep the stack line. Education stays in About | Review round 1, R1 |
| ISS-14 | Public name: "Abdelrhman Mohamed" | High | Decided | Owner chose the spelling on 2026-10-08; set `personal.name`, the LICENSE holder, the share images and JSON-LD | Review round 1, R1 |
| ISS-15 | Contact email: abdelrhmanhamied004@gmail.com | High | Decided | Set `personal.email`; it appears in Contact, the footer and the palette | Review round 1, R1 |
| ISS-16 | Open source numbers are out of date: magefree/mage #16440 merged on 2026-10-07; simplesamlphp #2688 was retitled | High | Decided | Update the snapshot: 8 merged across 6 projects, 3 under review (the practice PR stays excluded unless the owner says otherwise) | Review round 1, R1 |
| ISS-17 | Show every issue the owner filed, open and closed (4), not only litestar #5020 | Medium | Decided | List all four with their state; owner confirms whether the elwahapumps issue belongs | Review round 1, R1 |
| ISS-18 | Owner reports some project metrics are out of date | High | Open | Re-verify every shown metric against each repo's README and code; owner names the ones they mean | Review round 1, R1 |
| ISS-19 | Add the Alstom internship | Medium | Owner (later) | Needs title, dates and what was done, from the owner | When the owner supplies it |
| ISS-20 | Add the Claude certificates as one entry | Low | Owner (later) | Needs the certificate names, from the owner | When the owner supplies it |
| ISS-21 | Add a heavy crimson secondary color and make the whole palette work together | High | Owner | Brief change: today the brief allows one accent (`--break`). Two directions in the detail; owner picks | Review round 1, R0 |
| ISS-22 | Round the buttons ("View My Work", "Download Resume", all CTAs) | Medium | Owner | Brief change (radius is 0–2 px today). Owner picks pill or a small radius | Review round 1, R0 |
| ISS-23 | Use Arial for the nav bar, the footer and the stack captions | Medium | Owner | Brief change (Arial is banned today). Recommend Hanken Grotesk, already loaded; owner decides | Review round 1, R0 |
| ISS-24 | GitHub and LinkedIn as icons in Contact (and the footer) | Medium | Decided | Brief change: monochrome brand marks as inline SVG next to their text labels | Review round 1, R2 |
| ISS-25 | Work and case studies: show screenshots in full color, several per project, from the projects' GitHub Pages | High | Decided | Brief change (screenshots are grayscale today). Eventora: the 15 dark screens; Recruiter-Pro: its 13 real screens (replaces the mockup TODO) | Review round 1, R3 |
| ISS-26 | Work card slides look blurred | High | Open | Find the cause (grayscale filter, image size picked, card scaling) and fix | Review round 1, R3 |
| ISS-27 | SysPlex diagram looks weak (card preview and case study) | Medium | Open | Redesign the layout inside the same sourced nodes and steps | Review round 1, R3 |
| ISS-28 | The page only looks right at 67–75% browser zoom on the owner's laptop | High | Open | Type, spacing and card heights are sized for larger viewports; rescale and test at common laptop sizes | Review round 1, R2 |
| ISS-29 | "Also built": project names overlap their descriptions | High | Open | Long names (LexIntelligence, PhishSniffer) overflow a 3-of-10 column; fix the layout | Review round 1, R2 |
| ISS-30 | "Stack, by where it was used" looks cramped and mixed | Medium | Open | Rebuild as an aligned grid (technology, where used) per lane | Review round 1, R2 |
| ISS-31 | Sticky project stack hides part of each card on a laptop screen | Medium | Open | Cards taller than the viewport get covered by the next card; fit or relax the stack | Review round 1, R2 |
| ISS-32 | Buttons and CTAs should feel more responsive and interactive | Medium | Owner | Hover, press and focus treatment per control, after ISS-21 and ISS-22 are decided | Review round 1, R2 |
| ISS-33 | The custom cursor shows an "ON" label everywhere | High | Open | Bug: the label lookup matches the page's own `data-cursor="on"`; fix the selector | Review round 1, R2 |
| ISS-34 | The header marks "05 Contact" as current while the hero is on screen | Medium | Open | Bug in the scroll-spy's update timing; reproduce and fix | Review round 1, R2 |

One further owner-only item is tracked in the git-ignored `CLAUDE.local.md`.

---

## ISS-01 Eventora case study: mobile LCP 2.79 s

**Severity** High (the brief's budget is LCP < 2.5 s on mobile). **Status** Decided, option C (owner, 2026-10-08).

**Evidence.** Lighthouse 12, mobile, applied throttling (4x CPU, slow 4G), local production build, median of 3 runs on mains power (CPU benchmark 2,732–3,182). `docs/reports/lighthouse-stage5.md` and `lighthouse-stage5-eventora.json`.

| Measured | Before the Stage 5 performance pass | After |
|---|---|---|
| Eventora LCP | 2.81 s | 2.79 s |
| Home / Recruiter-Pro / SysPlex LCP | 2.52 / 2.59 / 2.83 s | 2.11 / 2.27 / 2.45 s (all pass) |

**Cause.** The LCP element is the hero screenshot (`01-landing-hero-dark.webp`, 13.7 KB at 750 px wide). In the median run:

| Phase | Time | Why |
|---|---|---|
| Time to first byte | 13 ms | Local server |
| Load delay | 636 ms | The HTML (23.6 KB) takes ~0.7 s to arrive on slow 4G; the image is requested as soon as its preload is parsed |
| Load time | 951 ms | The image shares the connection with the CSS (11.4 KB) and three preloaded fonts (207 KB: Newsreader 132 KB, Hanken Grotesk 41 KB, JetBrains Mono 35 KB) |
| Render delay | 770 ms | The main thread is busy with the first style and layout pass and hydration (see ISS-02) |

The image already has `fetchPriority="high"`, `loading="eager"` and a preload link (Stage 4 fix S5).

**Options.**

| Option | What | Effect | Cost |
|---|---|---|---|
| A | Drop Newsreader's `opsz` axis in `src/styles/fonts.ts` (keep `wght`) | The largest preloaded file shrinks substantially, so the image gets more of the connection | Changes the brief's "variable opsz + wght": optical sizing at display sizes is lost. Re-check the hero and headings by eye |
| B | Defer client code that is not needed for first paint (see ISS-02 option B) | Shortens render delay | Engineering time; gain unproven until measured |
| C | Accept, re-measure on a Vercel preview | No change now | Risk that it stays over budget at launch |

**Decision.** C, chosen by the owner on 2026-10-08. Localhost has no CDN; on Vercel the HTML and the image are served from a CDN, which changes the load delay and load time phases that dominate here. The re-measurement decides whether more work is needed.

**Next step.** Stage 6.2 adds Lighthouse CI on every Vercel preview (3 runs, these budgets). If Eventora's median LCP is still over 2.5 s there, apply option A first (measurable, one file), then B.

## ISS-02 Main-thread blocking: TBT 695–989 ms

**Severity** High (TBT is the lab stand-in for the brief's INP < 200 ms). **Status** Decided, option C (owner, 2026-10-08).

**Evidence.** Same runs as ISS-01.

| Page | TBT before the pass | After |
|---|---|---|
| `/` | 1,164 ms | 989 ms |
| `/projects/eventora` | 2,043 ms | 911 ms |
| `/projects/recruiter-pro` | 1,518 ms | 717 ms |
| `/projects/sysplex` | 1,451 ms | 695 ms |

**Cause.** A Chrome trace of the home page at 4x CPU, broken down inside every task over 50 ms (three runs):

| Inside long tasks | Per run |
|---|---|
| Layout (first full pass, 1,727 layout objects) | ~310–450 ms |
| Style recalculation (~1,150 elements) | ~160–240 ms |
| React DOM evaluation and hydration | ~240 ms |
| Paint | ~50–110 ms |

None of the large layouts in the trace was forced by our JavaScript, and there are no third-party scripts.

**Already fixed in the Stage 5 performance pass** (each measured before it was kept; `docs/UX-REVIEW.md` → P1–P3):

1. Film grain drawn from a 16 KB pre-rendered grayscale PNG (`public/textures/grain.png`) instead of a live SVG `feTurbulence` filter. The brief asked for "static pre-rendered grain"; the filter was the second-largest source of long tasks.
2. The live hero canvas loads only with a fine pointer (see ISS-03); it cost about 0.9 s of main thread at 4x CPU.
3. Newsreader loads the normal style only. The unused italic face was a second ~140 KB variable font preloaded on every page.

**Tried and rejected.** `content-visibility: auto` on below-the-fold sections (layout still touched all 1,727 objects and took about twice as long, likely because of the scroll-linked animations); `text-wrap: wrap` instead of `pretty` / `balance` (no change).

**Options.**

| Option | What | Effect | Cost |
|---|---|---|---|
| B1 | Load the command palette dialog on first open (dynamic import), and start the cursor and the scramble host after idle | Less code evaluated and hydrated during load | Engineering time; the palette's first open gets a short delay; gain unproven |
| B2 | Fewer scroll-linked CSS animations on `/` (each `view()` timeline adds style work) | Smaller style and layout passes | Removes some of the brief's motion (M3 title settle, M6 recede, M12 grid fade); owner decision |
| B3 | Split `/` so below-the-fold sections render after first paint | Shorter first layout | Larger change to page structure; risks the no-JS and anchor-link behaviour |
| C | Accept, re-measure on a Vercel preview and with field data (ISS-04) | No change now | Risk that it stays over target at launch |

**Decision.** C, chosen by the owner on 2026-10-08. The 200 ms target is a lab proxy at 4x CPU; field INP from real visitors is the actual budget, and 200 ms may not be reachable with React hydration and smooth scrolling at this throttling.

**Next step.** Re-measure on a Vercel preview in Stage 6. If TBT is still far over, apply B1 first (no visible change), then revisit B2 with the owner.

## ISS-03 Phones and tablets show the still hero graph

**Severity** Medium (visible design change). **Status** Owner: kept for now, the owner confirms or reverts.

**Context.** M4 is the hero's node graph: a static SVG rendered on the server, swapped on idle for a live canvas that drifts, leans toward the pointer and moves one red packet along the edges. Since the Stage 5 performance pass (commit `perf(hero): keep the static graph on coarse pointers`), `HeroGraph` loads the live layer only when `finePointer` is true (`(pointer: fine) and (hover: hover)`). Phones and tablets keep the static graph: same nodes and edges, no motion, no packet.

**Why.** The canvas loop cost about 0.9 s of main-thread time at 4x CPU, the class of device phones represent, and its main interaction, leaning toward the pointer, needs a pointer phones do not have. The brief already turns off the custom cursor, tilt and magnet on coarse pointers.

**Options.**

| Option | What | Cost |
|---|---|---|
| Keep (current) | Still graph on touch devices | Phones lose the moving packet |
| Revert | One-line change in `src/components/hero/hero-graph.tsx` (`wanted` without `finePointer`) | About 0.9 s more main-thread work on phones; TBT rises again on mobile |
| Lighter canvas on touch | Live canvas at 30 fps with fewer nodes, no pointer lean | Engineering time; still costs main thread; needs re-measuring |

**Next step.** Owner runs UAT-48 (phone and desktop) and records the choice here.

## ISS-04 INP is not measured with real visitors

**Severity** Medium. **Status** Open.

**Context.** The brief's budget is INP < 200 ms. INP needs real interactions, so the lab only gives TBT (ISS-02). Nothing on the site collects field data today, and adding a collector is a new service and a privacy decision.

**Options.**

| Option | What | Cost |
|---|---|---|
| Vercel Speed Insights | Vercel's field Core Web Vitals (INP, LCP, CLS) per route | A small client script and a Vercel dashboard setting; check its plan limits and what it collects before enabling |
| `web-vitals` + own endpoint | Report INP from the browser to a Route Handler and log it | Code, a storage choice, and a privacy note |
| Lab only | Keep TBT as the proxy | INP stays unproven |

**Next step.** Decide in Stage 6 once the Vercel project exists (ISS-07).

## ISS-05 Up to four break-color dots in Open source

**Severity** Low. **Status** Decided: kept (Brief).

**Context.** The brief limits `--break` to one use per section in view, and also requires the open-PR status to be "outline pill + ○ + break dot". With 4 PRs under review, Open source can show 4 dots at once. Recorded as **Brief** in `docs/UX-REVIEW.md` (Stage 4).

**Fix if wanted.** Show the dot on the "under review" headline number only and drop it from the individual pills (the pills keep the outline + ○ + text, so status is still not color-only). That changes the brief's pill rule; owner decision.

## ISS-06 Plain-CSS hover styles can stick after a tap

**Severity** Low. **Status** Open.

**Context.** Tailwind's `hover:` variants only apply on hover-capable devices, but a few hand-written `:hover` rules in `src/styles/globals.css` (`.flow-btn`, `.carousel-btn`, `.contact-link`, `.footer-link`, `.spy-link`) apply everywhere, so on a touch screen the hover look can remain after a tap until the next tap elsewhere. Harmless, cosmetic.

**Fix.** Wrap those rules in `@media (hover: hover) { … }`. One commit, no visual change on desktop.

## ISS-07 Vercel project not imported; repo homepage placeholder

**Severity** High (blocks previews, the Stage 6 Lighthouse workflow, and launch). **Status** Owner.

**Context.** Checked 2026-10-07: no deployments on the repo; the repo homepage is `https://YOUR-PROJECT.vercel.app`, which returns 404. Steps: `README.md` → "Deploying on Vercel" (and `DEPLOY.md` in Stage 6).

## ISS-08 `TODO(owner)` items

**Severity** High (launch requires `npm run check:launch -- --strict` to pass). **Status** Owner.

`npm run check:launch` lists 13 on 2026-10-08:

| File | Item |
|---|---|
| `src/data/personal.ts` | Public name and its spelling, email, phone (only if public), portrait, location, bio, availability, GPA (only if public), resume PDF at `/public/resume.pdf` |
| `src/data/projects.ts` | Whether the Eventora Railway API is down on purpose; real Recruiter-Pro app screenshots; a SysPlex dashboard screenshot |
| `src/data/experience.ts` | The final-year capstone description (hidden until set) |

Details and where each field appears: `PERSONAL-INFO-CHECKLIST.md`.

## ISS-09 No owner UAT run recorded for Stages 3–5

**Severity** High (the Definition of done requires a signed-off `docs/UAT.md` with no open High defects). **Status** Owner.

**Context.** PRs #3 and #4 were merged without a recorded UAT run. `docs/UAT.md` now holds UAT-01 to UAT-48; only the owner records results there.

---

## ISS-10 `npm audit`: 5 high-severity advisories in the lint tooling

**Severity** Medium (dev dependency only; nothing in the shipped site). **Status** Decided: accept until a patched release exists.

**Evidence.** The owner's clean install (`npm ci`, 2026-10-08) printed "5 high severity vulnerabilities". `npm audit --json` on the same lockfile:

| Package | Severity | How it gets in |
|---|---|---|
| `braces` 3.0.3 | High | Advisory GHSA-vfj7-8cjw-p6xm: stack-exhaustion denial of service through deeply nested patterns; affected range `<=3.0.3` |
| `micromatch` 4.0.8 | High | Depends on `braces` |
| `fast-glob` 3.3.1 | High | Depends on `micromatch` |
| `@next/eslint-plugin-next` 16.4.0 | High | Depends on `fast-glob` |
| `eslint-config-next` 16.4.0 | High | Direct dev dependency; depends on `@next/eslint-plugin-next` |

One root cause, counted five times along the dependency chain. `npm audit --omit=dev` reports 0 vulnerabilities: none of these packages is part of the site's runtime or bundle. They run only when `npm run lint` runs, on patterns written in this repo's own config.

**Why not `npm audit fix --force`.** npm's suggested fix installs `eslint-config-next@14.2.35`, a downgrade of two major versions that does not match Next 16 and would break the ESLint 9 flat config. `braces` 3.0.3 is already the latest release (published 2024), so no version inside the advisory's range is fixed yet.

**Options.**

| Option | What | Cost |
|---|---|---|
| Accept (chosen) | Leave as is; the vulnerable code only parses glob patterns we write ourselves, during lint | `npm ci` keeps printing the warning |
| `overrides` in `package.json` | Pin a patched `braces` for the whole tree once one is published | Needs a published fix first |
| Drop `eslint-config-next` | Use `typescript-eslint` and `eslint-plugin-react-hooks` directly | Loses Next's own lint rules (`@next/next/*`); more config to maintain |

**Next step.** Stage 6 adds Dependabot (npm, weekly, grouped minor and patch). When a fixed `braces` (or a `fast-glob` / `@next/eslint-plugin-next` release that avoids it) appears, take that update, re-run `npm audit`, and close this issue with the output.

## ISS-11 ESLint 9.39.5 is no longer supported

**Severity** Low. **Status** Open.

**Evidence.** `npm ci` printed: "npm warn deprecated eslint@9.39.5: This version is no longer supported." On 2026-10-08 the npm registry tags `9.39.5` as `maintenance` and `10.12.0` as `latest`.

**Context.** ESLint only runs in development and CI; the site is unaffected. `eslint-config-next@16.4.0` declares `eslint >=9.0.0` as its peer, so ESLint 10 is allowed on paper, but the plugins it bundles (React, React Hooks, TypeScript, import) have not been checked against ESLint 10 here.

**Fix.** On its own branch: install `eslint@10`, run `npm run lint` on the whole repo, fix or document any rule changes, and confirm CI is green. If a bundled plugin rejects ESLint 10, stay on 9.39.5 and re-check when `eslint-config-next` lists 10 as tested.

---

# Owner review, round 1 (2026-10-08)

The owner reviewed a local production build (`npm ci; npm run build; npm start`) in a desktop browser at 100% zoom and sent 21 notes with six screenshots. Each note is an issue below, sorted by the `docs/UAT.md` section it belongs to; the "UAT" line names the case it fails or the new case it needs. Nothing here is implemented yet: `PLAN.md` → "Review round 1" holds the order of work, and R0 (owner decisions) comes first because several notes change rules the brief fixed.

Two issues (ISS-33, ISS-34) were not in the notes; they are visible in the owner's screenshots.

Verified read-only on 2026-10-08 while writing this round: live PR and issue states (`gh pr view`, `gh search issues`), the owner's `Desktop/oss/CONTRIBUTIONS-LOG.md`, the source repos' heads against the pinned evidence commits (no new commits in Eventora, Recruiter-Pro or SysPlex), their GitHub Pages screenshot folders, and the cursor and scroll-spy code.

## Content and honesty

### ISS-12 Hero headline

**UAT** UAT-01 (content), new case UAT-49. **Severity** High. **Status** Owner: pick a line.

**Note.** "Title has to be more creative, enhanced and optimized to show SE in a professional way, not as a normal sentence."

**Context.** The H1 is the brief's approved copy, "Backend systems that stay correct under load.", with the final period as the one text use of `--break`. Replacing it changes the approved copy in `CLAUDE.md`, `profile.ts`, the share images and `FACTS-CHECK.md`. The honesty rules still apply: no unqualified adjectives, no banned words, every number sourced.

**Options** (proposals only; the owner may write their own):

| # | Line | Note |
|---|---|---|
| A | Correct under load. | Two words of claim, then the proof sits right below in the numbers |
| B | 100 concurrent requests, 50 seats, exactly 50 bookings. | The Eventora oversell test as the headline (sourced: Event-Ticketing-Platform/README.md:159); the most specific, most backend option |
| C | Backend engineering, measured. | Positions the whole site: every number links to its source |
| D | I build backend systems that hold under concurrency. | First person, plain; still a claim without a number |

**Recommendation.** B or C. B is unusual and verifiable; C sets up the evidence-led layout. Either way the final period keeps the break mark.

### ISS-13 Hero sub without "Software Engineering student at AASTMT (Jun 2027)"

**UAT** UAT-01. **Severity** Medium. **Status** Decided (owner note).

**Change.** The sub becomes "Java and Spring Boot, Redis, RabbitMQ, plus Python AI services and open-source work." (or the owner's rewrite to match ISS-12). The education fact stays in About's Education cell, so nothing true is lost. Update the approved copy in `CLAUDE.md` and `profile.ts`.

### ISS-14 Public name "Abdelrhman Mohamed"

**UAT** UAT-01. **Severity** High. **Status** Decided by the owner on 2026-10-08.

**Context.** The spelling was an open decision ("Abdelrahman" vs "Abdelrhman"; `CLAUDE.md` said never to choose). The owner chose **Abdelrhman Mohamed**.

**Change.** `personal.name` → "Abdelrhman Mohamed"; LICENSE holder; header wordmark, footer, page title template, share image kicker, JSON-LD `Person.name` (handle stays as `alternateName`); `CLAUDE.md` "Decisions already made"; `FACTS-CHECK.md`; closes that line of ISS-08.

### ISS-15 Contact email

**UAT** UAT-30, UAT-32, UAT-39. **Severity** High. **Status** Decided (owner note).

**Change.** `personal.email` → abdelrhmanhamied004@gmail.com. It then renders in Contact ("Or reach me directly"), the footer and the command palette, and as JSON-LD `email`. Closes that line of ISS-08. It is a public address, so expect spam; the contact form (Resend) is the alternative path.

### ISS-16 Open source numbers out of date

**UAT** UAT-28, UAT-29. **Severity** High. **Status** Decided.

**Evidence** (`gh pr view`, 2026-10-08):

| PR | Snapshot (`oss.json`, 2026-10-06) | Live |
|---|---|---|
| magefree/mage #16440 | open | **merged 2026-10-07** |
| simplesamlphp/simplesamlphp #2688 | open, "Remove deprecated Twig includes from the release autoloader" | open, retitled "Document the Twig conflict when an application loads its own Twig" (now a documentation change, going by the new title) |
| the other 9 | as recorded | unchanged |

The live site already re-reads PR state daily (ISR), so a deployed `/` would show mage as merged; the committed snapshot, the headline stated in `CLAUDE.md` ("7 merged PRs across 5 projects, 4 under review"), the facts-check asserts and `FACTS-CHECK.md` are what is stale.

**Counting.** The owner's log says 8 merged (9 with mage). It counts `firstcontributions/first-contributions` #123531, a practice repository whose purpose is adding a name to a list; the site excludes it by an earlier decision (`FACTS-CHECK.md` → Open source). Excluding it, the numbers become **8 merged across 6 projects, 3 under review, 2026-08 to 2026-10**. Recommendation: keep it excluded. If the owner wants it counted, say so and the headline becomes 9 across 7.

**Change.** `oss.json` (mage merged with date and the new #2688 title and note), `scripts/check-facts.ts` asserts, `CLAUDE.md` headline line, `FACTS-CHECK.md`.

### ISS-17 List every issue filed, open and closed

**UAT** UAT-29. **Severity** Medium. **Status** Decided (owner note), one question.

**Evidence** (`gh search issues --author Sharawey74`, outside the owner's own repos, 2026-10-08):

| Issue | State | Note |
|---|---|---|
| litestar-org/litestar #5020 | closed 2026-09-05 | Reported a CI break from `click` 8.5.0 via rich-click; fixed upstream in rich-click 1.9.9. Shown on the site today |
| conorbronsdon/avoid-ai-writing #333 | closed 2026-09-23 | Fixed by the owner's own PR #342 |
| litestar-org/litestar #5018 | open | The bug that PR #5019 fixes |
| Ahmedtamer-1/elwahapumps #1 | open | The owner's own log calls it a small personal project, not OSS |

**Change.** `oss.json → issues` gets all four with state and a one-line note each; the section lists them under "Issues reported" with open/closed shown by shape and text, like the PRs. **Question for the owner:** include elwahapumps #1? Recommendation: leave it out, for the reason the owner's log gives.

### ISS-18 Some metrics are out of date

**UAT** UAT-03. **Severity** High. **Status** Open: the owner names the metrics they mean.

**Evidence.** Eventora, Recruiter-Pro and SysPlex have no commits after the evidence commits the site is pinned to (`ef96703`, `daf160b`, `9f3cce9`; checked with `git rev-list` on 2026-10-08). So the code has not moved; any mismatch is between what the site shows and what a README says. Known README inconsistencies, all already decided in `FACTS-CHECK.md`:

| Repo | README says | Site shows | Why |
|---|---|---|---|
| Eventora | "11 states" (README:85) | 10 booking states | The enum has 10; the report wins |
| Recruiter-Pro | 530 tests and 83.7% (README:433), 544 elsewhere, 84.07% (README:37, 81) | 500+ tests, 84.07% branch coverage | Two README sections disagree |

**Plan.** A metrics audit table: every metric on the site, its current source line, the README line that states it today, and match / mismatch. The owner marks the ones they consider outdated; a newer number must come from the repo (README, test report or CI run), and the evidence report is updated with it.

### ISS-19 Alstom internship (later)

**UAT** new case when added. **Severity** Medium. **Status** Owner, later.

**Needs from the owner.** Role title, start and end month, the work done (2–3 specific points), any project produced, and a source (offer letter, certificate or the newest resume line). Goes into `experience.ts → roles` like the other two internships; About's internship count derives from the list.

### ISS-20 Claude certificates as one entry (later)

**UAT** UAT-28 ("no dates on certificates"). **Severity** Low. **Status** Owner, later.

**Needs from the owner.** The exact certificate names and the issuer as printed. One entry, e.g. "Claude courses (Anthropic): <names>", without dates (brief rule).

## Visual system (changes to the brief)

The brief's visual system in `CLAUDE.md` overrides any skill; these notes change it, so each needs the owner's explicit choice (R0) before code, and `CLAUDE.md`, `scripts/check-colors.ts` and `scripts/check-contrast.ts` change with it.

### ISS-21 Heavy crimson secondary color, one harmonized palette

**UAT** UAT-24 (both themes), new case UAT-50. **Severity** High. **Status** Owner: pick a direction.

**Note.** "Add heavy crimson as a secondary color so it does not look fully dark, or another color if more suitable with black and white; make all the colors suitable with each other."

**Context.** Today: a 12-step neutral gray ramp, all text gray, and one accent `--break` (#FF3B4E dark / #C4152A light) limited to small marks (≤ 2% of the viewport). `frontend-design` lists "near-black background with a single bright vermilion accent" as a common generated look, so a second, deeper tone can make the palette feel owned rather than default.

| Direction | What | Where it shows |
|---|---|---|
| A, crimson ramp (recommended) | Keep the grays; turn the one accent into a 3-step crimson ramp: deep (about #3A0810, fills and tints), mid (about #8E1428, borders, hover fills, active states), bright (today's `--break`, marks and focus) | Hover and active fills on buttons, the active nav item, section index numbers, card hover edge, chart highlight, selected palette option |
| B, warm neutrals + crimson | Shift the grays slightly warm (R > G = B by a few points) and add the deep crimson for surfaces | Everything above plus a faint warmth on all surfaces |
| C, keep one accent | Only enlarge where `--break` may appear | Least change, least color |

Exact values come from a contrast pass in both themes (text ≥ 4.5:1, graphics ≥ 3:1). Text stays gray except where the owner allows crimson text.

### ISS-22 Rounded buttons

**UAT** UAT-45, new case UAT-50. **Severity** Medium. **Status** Owner: pick a radius.

**Context.** Radius is 0–2 px everywhere today (brief). Options: full pill (`9999px`) for buttons and CTAs only, cards stay square (recommended: clear contrast between actions and content); or a small radius (6–8 px) for buttons, chips and inputs.

### ISS-23 Arial for the nav bar, the footer and the stack captions

**UAT** new case UAT-50. **Severity** Medium. **Status** Owner: confirm Arial or accept the alternative.

**Context.** Those labels are JetBrains Mono, uppercase, letter-spaced. The brief bans Arial by name; Arial is also not installed on Linux and many Android phones, so they would fall back to another face. **Recommendation:** Hanken Grotesk (the site's text face, already loaded, no extra download) in sentence case for the nav, footer and stack captions; mono stays for numbers and source lines. If the owner still prefers Arial, it is a one-line font stack change.

### ISS-24 GitHub and LinkedIn icons

**UAT** UAT-32, UAT-39. **Severity** Medium. **Status** Decided (owner note).

**Change.** Monochrome GitHub and LinkedIn marks as inline SVG (`currentColor`, `aria-hidden`), always next to their text label, in Contact and the footer. The brief allows "a custom SVG only where unavoidable"; brand marks are that case. No other icon set comes in.

### ISS-25 Full-color screenshots, several per project

**UAT** UAT-13, UAT-20, UAT-42. **Severity** High. **Status** Decided (owner note), assets to confirm.

**Context.** The brief renders screenshots grayscale until hover (`.shot` filter). The owner wants them in color. Sources found (read-only, 2026-10-08):

| Project | GitHub Pages | Screenshots in the repo | On the site today |
|---|---|---|---|
| Eventora | sharawey74.github.io/Event-Ticketing-Platform | `site/assets/img/screenshots/`: 15 screens, most with a `-dark` variant | 9 dark screens, grayscale |
| Recruiter-Pro | sharawey74.github.io/Recruiter-Pro | `site/assets/img/screenshots/`: 13 screens (landing, jobs, upload, results, score breakdown, shortlist, history, dashboard, job detail, mobile) | none (only mockups existed before, and they are banned) |
| SysPlex | none | none | none (still a TODO) |

**Change.** Drop the grayscale filter (or keep it only as an option the owner can turn back on); Eventora uses its dark screens; Recruiter-Pro gets a carousel of its real screens, which also closes the Recruiter-Pro screenshot TODO, after each image is viewed and checked for placeholder or private data; the case-study galleries use the same sets. Copy rule unchanged: files are copied from the repos read-only.

### ISS-26 Work card slides look blurred

**UAT** UAT-20. **Severity** High. **Status** Open: cause to confirm.

**Likely causes**, to check one by one: the grayscale + contrast filter softening small text; the `sizes` attribute making the browser pick a smaller `srcset` width than the box needs on a 125% scaled screen; `next/image` quality 75 on screenshots full of small UI text; and the sticky stack's `scale` transform on cards. **Fix** after measuring: correct `sizes`, quality 85–90 for screenshots, no filter (ISS-25), and no scaling of the image layer while it is readable.

### ISS-27 SysPlex diagram

**UAT** UAT-22, UAT-42. **Severity** Medium. **Status** Open.

**Context.** Three agents on the left, one Flask server, one dashboard, plain lines: it reads as sparse. **Plan.** Same five nodes and four steps (diagrams show only sourced components), better composition: group the agents as "on the host" and the server + dashboard as "in Docker" (README: agents run natively, the dashboard runs in an unprivileged container), label the edges with the transport (HTTP :8889, FastAPI :8888, file) and the 2 s poll, tighter spacing. Then the same for the card preview.

## Layout

### ISS-28 Correct only at 67–75% zoom

**UAT** UAT-09 (zoom), UAT-26, new case UAT-51. **Severity** High. **Status** Open.

**Context.** Captures and checks so far used 1280×800 and 1920×1080 at 1x. A laptop at 1920×1080 with Windows scaling at 125% or 150% gives the browser a 1536×864 or 1280×720 CSS viewport: the hero headline (display XL, up to 200 px) fills the screen, section padding is large, and cards are taller than the viewport, which also causes ISS-31. At 67–75% zoom the browser has more CSS pixels, which is why it looks right there.

**Plan.** Test at 1366×768, 1440×900, 1536×864 and 1280×720 (plus the existing sizes); cap display sizes by viewport height as well as width (`min(…vw, …vh)` inside the clamp), reduce section padding at these heights, and make sure a project card fits in one viewport at 1536×864.

### ISS-29 "Also built" overlap

**UAT** UAT-26, UAT-09. **Severity** High. **Status** Open.

**Evidence.** Owner screenshot: "LexIntelligence" and "PhishSniffer" run into the description column. **Cause.** The names are `text-h2` in the display face inside a 3-of-10 column, with no wrapping point and no `min-width: 0`. **Fix.** Name above the description at widths where it does not fit (or a wider name column), `min-w-0`, and a size that fits the longest name.

### ISS-30 Stack section looks cramped and mixed

**UAT** UAT-28, UAT-42. **Severity** Medium. **Status** Open.

**Evidence.** Owner screenshot: chips of different widths wrap at uneven points, and each "used in" caption hangs under its chip at a different width, so the rows read as a jumble. **Plan.** One aligned grid per lane: technology in the first column, where used in the second (a row per technology), or fixed-width chip columns with the caption on one line. Caption font follows ISS-23.

### ISS-31 Sticky stack hides part of each card on a laptop screen

**UAT** UAT-21, UAT-26. **Severity** Medium. **Status** Open.

**Evidence.** Owner screenshot: the SysPlex card covers Recruiter-Pro's numbers. **Cause.** Each card sticks below the header and the next one slides over it; when a card is taller than the viewport, its lower part is covered before it was readable. **Fix** with ISS-28: cards that fit the viewport, and the stack switched off (plain list) when the viewport is too short for a card.

## Motion and interaction

### ISS-32 More responsive buttons and CTAs

**UAT** UAT-45, UAT-19. **Severity** Medium. **Status** Owner (after ISS-21 and ISS-22).

**Context.** Today: hover steps a color or border, press drops 1 px, focus shows the ring, primary CTAs lean toward the pointer (magnet). **Plan.** One treatment per control type, inside the motion rules (transform and opacity only, 200 ms, one easing): primary button fills with the accent on hover, its arrow moves 4 px; secondary button gets the accent border; text links get an underline that draws in; palette and nav items get the active marker on hover. Final values after the palette and radius decisions.

### ISS-33 Custom cursor shows "ON" everywhere

**UAT** UAT-19. **Severity** High (on every page, desktop). **Status** Open. Found in the owner's screenshots.

**Cause** (confirmed in code). `src/components/motion/cursor.tsx` marks the page with `document.documentElement.dataset.cursor = "on"`, and its hover lookup is `closest("a[href], button:not(:disabled), [data-cursor], [role='button']")`. Over plain content the nearest match is `<html>` itself, so its value "on" becomes the cursor label. **Fix.** Store the "cursor active" flag under another attribute (e.g. `data-cursor-active`) or exclude the root from the lookup; add a UAT step.

### ISS-34 Scroll-spy marks "05 Contact" at the top of the page

**UAT** UAT-15. **Severity** Medium. **Status** Open. Found in the owner's screenshots.

**Evidence.** All six screenshots, including one with the hero on screen, show "05 Contact" as current; the URL was `/#open-source`. **Suspected cause.** `ScrollSpyNav` recomputes only when a heading crosses the 45% line; a load with a hash, or a fast smooth-scroll jump, can leave the last computed section in place. **Fix.** Reproduce, then also recompute on load, on `hashchange` and when Lenis' scroll settles.

---

# Closed

| ID | Issue | Closed | Evidence |
|---|---|---|---|
| — | Stage 5 design critique D1–D9 (header overflow at 768 px, duplicated stack, card title wrap, tiny previews on phones, case-study heading sizes, redundant eyebrows, repeated numerals, diagram scroll hint, split code token) | 2026-10-07 | `docs/UX-REVIEW.md` → Stage 5, 5.2; after captures in `docs/screens/stage5-after/` |
| — | CLS 0.188 from the display font swap | 2026-10-07 | `docs/UX-REVIEW.md` → Stage 4, S2; CLS 0.001 since |

New issues found from here on get the next `ISS-NN` ID and a row in the table at the top.
