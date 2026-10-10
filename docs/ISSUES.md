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

Last updated: 2026-10-08 (end of review round 1 on `feat/owner-review-1`: ISS-12 to ISS-18 and ISS-21 to ISS-34 closed with evidence; ISS-35 added).

## At a glance

| ID | Issue | Severity | Status | Decision / next step | Revisit |
|---|---|---|---|---|---|
| ISS-01 | Eventora case study: mobile LCP 2.79 s (budget 2.5 s) | High | Decided | Option C: accept, re-measure on a Vercel preview | Stage 6 (Lighthouse on previews) |
| ISS-02 | Main-thread blocking: TBT 695–989 ms on every page (target 200 ms) | High | Decided | Option C: accept, re-measure on a Vercel preview | Stage 6 |
| ISS-03 | Phones and tablets show the still hero graph, not the live canvas | Medium | Closed | Owner decision 2026-10-08: keep the still graph on touch devices | — |
| ISS-04 | INP is not measured with real visitors | Medium | Open | Needs a field-data source once the site is live | Stage 6 |
| ISS-05 | Open source shows up to four break-color dots at once | Low | Decided | Kept: the brief's open-status rule | When the PR list changes |
| ISS-06 | Some plain-CSS hover styles can stick after a tap on touch screens | Low | Open | Wrap them in `(hover: hover)` | Next UI change |
| ISS-07 | Vercel project not imported; repo homepage is a placeholder URL | High | Closed | Imported 2026-10-09; production `abdelrhaman-mohamed.vercel.app`, also the repo homepage (detail below) | — |
| ISS-08 | 10 `TODO(owner)` items (13 before round 1) (name, email, resume, screenshots and others) | High | Owner | Name, email and the Recruiter-Pro screenshots are done (round 1); the rest is the owner's (`npm run check:launch` lists them) | Before v1.0.0 |
| ISS-09 | No owner UAT run recorded for Stages 3–5 | High | Owner | Owner runs `docs/UAT.md` (UAT-01 to UAT-48) | Before v1.0.0 |
| ISS-10 | `npm audit`: 5 high-severity advisories, all in the lint tooling (`braces` via `eslint-config-next`) | Medium | Decided | Accept for now: dev-only; Dependabot (weekly, Stage 6) proposes the patched release; never `npm audit fix --force` | Dependabot pull requests |
| ISS-11 | `npm ci` warns that ESLint 9.39.5 is no longer supported | Low | Decided | Trial done on branch `chore/eslint-10`: ESLint 10.12 installs with `npm ci`, every plugin's rules fire, lint clean. Three bundled plugins still declare ESLint ≤ 9. Recommendation: merge after its CI is green | When the owner merges `chore/eslint-10` |
| ISS-12 | Hero headline: owner wants a more professional, distinctive line for a software engineer | High | Closed | Applied: label, name as H1, the owner's two paragraphs (`profile.hero`); facts check asserts H1 = name | — |
| ISS-13 | Hero sub: remove "Software Engineering student at AASTMT (Jun 2027)" | Medium | Closed | Applied with ISS-12; education stays in About | — |
| ISS-14 | Public name: "Abdelrhman Mohamed" | High | Closed | Applied: `personal.name`, LICENSE, header, footer, intro, titles, JSON-LD; other spelling banned by the facts check | — |
| ISS-15 | Contact email: abdelrhmanhamied004@gmail.com | High | Closed | Applied: Contact (with icon), footer, palette, JSON-LD | — |
| ISS-16 | Open source numbers are out of date: magefree/mage #16440 merged on 2026-10-07; simplesamlphp #2688 was retitled | High | Closed | Applied: snapshot 2026-10-08, 8 merged across 6 projects, 3 under review; asserted by the facts check | — |
| ISS-17 | Show every issue the owner filed, open and closed, not only litestar #5020 | Medium | Closed | Applied: litestar #5020, #5018 and avoid-ai-writing #333 with ● / ○ and text | — |
| ISS-18 | Owner reports some project metrics are out of date | High | Closed | Applied: card leads with 0 oversold, 569,066 requests / 0 failed, 660 req/s; case study adds 2.40 ms, 870 req/s, 1.32×, 55.4 ms, CPU-bound finding | — |
| ISS-19 | Add the Alstom internship | Medium | Owner (later) | Needs title, dates and what was done, from the owner | When the owner supplies it |
| ISS-20 | Add the Claude certificates as one entry | Low | Owner (later) | Needs the certificate names, from the owner | When the owner supplies it |
| ISS-21 | Add a heavy crimson secondary color and make the whole palette work together | High | Closed | Applied: `--c1` / `--c2` / `--break`, Contact band, checks extended; owner confirms in UAT-50 | UAT-50 |
| ISS-22 | Round the buttons ("View My Work", "Download Resume", all CTAs) | Medium | Closed | Applied: `rounded-pill` on buttons, CTAs and header controls | UAT-50 |
| ISS-23 | Use Arial for the nav bar, the footer and the stack captions | Medium | Closed | Applied: `.ui-label` (Hanken Grotesk, sentence case) on nav, footer, header controls; stack captions in the text face | UAT-50 |
| ISS-24 | GitHub and LinkedIn as icons in Contact (and the footer) | Medium | Closed | Applied: `BrandIcon` (GitHub, LinkedIn, envelope) beside the labels in Contact and the footer | — |
| ISS-25 | Work and case studies: show screenshots in full color, several per project, from the projects' GitHub Pages | High | Closed | Applied: full color; Recruiter-Pro gets 4 of its 13 screens (the rest are unusable, ISS-35); Eventora keeps its 9 | — |
| ISS-26 | Work card slides look blurred | High | Closed | Cause measured: double resampling at quality 75 + grayscale filter, not resolution; carousel now quality 90 with matching `sizes`, no filter | UAT-20 |
| ISS-27 | SysPlex diagram looks weak (card preview and case study) | Medium | Closed | Applied: the README's two tiers as sourced zones, node detail lines, card preview matches | UAT-22 |
| ISS-28 | The page only looks right at 67–75% browser zoom on the owner's laptop | High | Closed | Display sizes capped by `svh`, H1 48–120 px; hero fits one screen at 1280×720 to 1920×1080; no overflow at 320 and 375 | UAT-51 |
| ISS-29 | "Also built": project names overlap their descriptions | High | Closed | Names on their own row | — |
| ISS-30 | "Stack, by where it was used" looks cramped and mixed | Medium | Closed | Aligned table per lane (`.stack-rows`), one column on narrow phones | — |
| ISS-31 | Sticky project stack hides part of each card on a laptop screen | Medium | Closed | Cards fit at 1536×864 and 1280×720; stack becomes a list below 40 rem height | UAT-51 |
| ISS-32 | Buttons and CTAs should feel more responsive and interactive | Medium | Closed | Accent hover per control type, arrow nudge, pill hover on header controls and nav | UAT-45 |
| ISS-33 | The custom cursor shows an "ON" label everywhere | High | Closed | Flag renamed to `data-cursor-active`; probe shows no label over plain text | — |
| ISS-34 | The header marks "05 Contact" as current while the hero is on screen | Medium | Closed | Section-level viewport observer plus `hashchange` / `pageshow`; probe passes all five jump cases | — |
| ISS-35 | Recruiter-Pro's scoring screens (results, score breakdown, shortlist, history) show the owner's own resume under another spelling of the name, so the site cannot use them | Low | Owner | Re-capture those screens with a sample resume (and no search term on the jobs page), then add the best two to `projects.ts` | When the owner re-captures |
| ISS-36 | After round 1, TBT is 300–500 ms higher than Stage 5 on every page, and Recruiter-Pro's case-study LCP is 3.28 s (its page now opens with a screenshot). On Vercel (2026-10-09): TBT within budget, simulated LCP 2.9–3.0 s; Speed Insights live, waiting for field data | High | Decided | Option C, as for ISS-01 / ISS-02: accept for now, re-measure on a Vercel preview; if it holds there, trace the first layout pass (more DOM in About's stack table, the Contact band, diagram zones) | Stage 6 |
| ISS-37 | Smoke tests timed out when about 8 browsers ran in parallel against one local `next start` | Medium | Closed | Fixed in Stage 6: 2 workers, 60 s per test, 1 retry in CI; 20/20 on three later runs | — |
| ISS-38 | Commands that reach the npm registry or GitHub can fail for network reasons (`ECONNRESET`), not because of the project | Low | Decided | Retry; nothing in the repo to fix. How to tell a network failure from a real one is in the detail | When it recurs |
| ISS-39 | Work card numerals (01–03) fail contrast in the light theme: 2.45:1, large text needs 3:1; first Lighthouse CI run on a preview scored accessibility 97 on `/` | High | Closed | Numerals use `--text-3` instead of `--deco` (#18); the preview Lighthouse run on #18 passed accessibility on all four pages | — |
| ISS-40 | Contact form not connected on production: the three Resend variables are unset, so the form shows "not connected" | Medium | Closed | Connected 2026-10-10: the three variables set on Production, redeployed, the form renders on `/`, and the owner's test message arrived | — |
| ISS-41 | Switching to a branch that still tracks the local-only files overwrote them, and pulling past the untracking commit deleted them | Medium | Closed | Restored 2026-10-09 from the last commit that held them; nothing was lost. Prevention in the detail and in `CLAUDE.md` | — |
| ISS-42 | Redesign before launch: a Resend-style visual system (black, gray type, gradient headings, translucent borders, rounded cards, a code-block section) with GetLayers-style motion, own assets, free fonts and a red accent | High | Decided | Owner decisions 2026-10-10 in the detail; planned as Stage 7 (`PLAN.md`), approved through an HTML mock-up before any code; replaces the visual system in `CLAUDE.md` in the same branch as the code | Before v1.0.0 |

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

**Severity** Medium (visible design change). **Status** Closed: kept (owner, 2026-10-08).

**Context.** M4 is the hero's node graph: a static SVG rendered on the server, swapped on idle for a live canvas that drifts, leans toward the pointer and moves one red packet along the edges. Since the Stage 5 performance pass (commit `perf(hero): keep the static graph on coarse pointers`), `HeroGraph` loads the live layer only when `finePointer` is true (`(pointer: fine) and (hover: hover)`). Phones and tablets keep the static graph: same nodes and edges, no motion, no packet.

**Why.** The canvas loop cost about 0.9 s of main-thread time at 4x CPU, the class of device phones represent, and its main interaction, leaning toward the pointer, needs a pointer phones do not have. The brief already turns off the custom cursor, tilt and magnet on coarse pointers.

**Options.**

| Option | What | Cost |
|---|---|---|
| Keep (current) | Still graph on touch devices | Phones lose the moving packet |
| Revert | One-line change in `src/components/hero/hero-graph.tsx` (`wanted` without `finePointer`) | About 0.9 s more main-thread work on phones; TBT rises again on mobile |
| Lighter canvas on touch | Live canvas at 30 fps with fewer nodes, no pointer lean | Engineering time; still costs main thread; needs re-measuring |

**Decision (owner, 2026-10-08).** Keep: touch devices show the still graph. Closed.

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

**Severity** High (blocks previews, the Stage 6 Lighthouse workflow, and launch). **Status** Closed 2026-10-09.

**Context.** Checked 2026-10-07: no deployments on the repo; the repo homepage is `https://YOUR-PROJECT.vercel.app`, which returns 404. Steps: `README.md` → "Deploying on Vercel" (and `DEPLOY.md` in Stage 6).

**Resolution (2026-10-09).** The owner imported the project. Evidence: GitHub deployment 6960554515 (Production, `0b36553`, the merge of #13); `https://portfolio-virid-delta-2g04ymqux2.vercel.app` returns 200 for `/`, `/projects/eventora`, `/sitemap.xml` and `/robots.txt`, and its canonical and share-image URLs use that domain. The repo homepage now points there. `VERCEL_AUTOMATION_BYPASS_SECRET` is set as an Actions secret. The Lighthouse workflow ran on the production deployment and was skipped, as designed (previews only).

Still open, outside this issue: the contact form shows "not connected" until the three Resend variables are set; the team-scoped URL `portfolio-sharawey74s-projects.vercel.app` sits behind Vercel Authentication (302 to the Vercel login), so only the production domain above is public. Later the same day the owner replaced the generated domain with `https://abdelrhaman-mohamed.vercel.app` (`/` and `/projects/eventora` return 200; the old domain now returns 404), and the repo homepage follows it. The `main` ruleset was saved later the same day (active; pull request, merge commits only, required check `Lint, typecheck, facts, build, smoke`, no deletion or force push).

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

**Trial (2026-10-08, Stage 6, branch `chore/eslint-10`, one commit).** `npm install -D eslint@10` → 10.12.0; a clean `npm ci` succeeds; `npm run lint` is clean on the whole repo. Probe files with planted violations confirmed every rule family still fires: `react-hooks/rules-of-hooks`, `react/jsx-key`, `@typescript-eslint/no-unused-vars`, `@next/next/no-img-element`, `jsx-a11y/alt-text`, `jsx-a11y/click-events-have-key-events`, `import/no-anonymous-default-export`. `npm ls eslint` marks the peer as invalid for `eslint-plugin-react` 7.37.5 (declares up to `^9.7`), `eslint-plugin-jsx-a11y` and `eslint-plugin-import` (up to `^9`): they work but are not declared compatible.

**Options.** A: merge `chore/eslint-10` now (supported ESLint; a future plugin bug would show as a lint failure in CI, never on the site). B: stay on 9.39.5 until `eslint-config-next` ships plugins that declare 10. **Recommendation:** A, after its CI run is green; Dependabot will keep both moving.

---

# Owner review, round 1 (2026-10-08)

The owner reviewed a local production build (`npm ci; npm run build; npm start`) in a desktop browser at 100% zoom and sent 21 notes with six screenshots. Each note is an issue below, sorted by the `docs/UAT.md` section it belongs to; the "UAT" line names the case it fails or the new case it needs. Nothing here is implemented yet: `PLAN.md` → "Review round 1" holds the order of work, and R0 (owner decisions) comes first because several notes change rules the brief fixed.

Two issues (ISS-33, ISS-34) were not in the notes; they are visible in the owner's screenshots.

Verified read-only on 2026-10-08 while writing this round: live PR and issue states (`gh pr view`, `gh search issues`), the owner's `Desktop/oss/CONTRIBUTIONS-LOG.md`, the source repos' heads against the pinned evidence commits (no new commits in Eventora, Recruiter-Pro or SysPlex), their GitHub Pages screenshot folders, and the cursor and scroll-spy code.

## Content and honesty

### ISS-12 Hero headline

**UAT** UAT-01 (content), new case UAT-49. **Severity** High. **Status** Decided (2026-10-08).

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

**Decision (owner, 2026-10-08), second round.** The owner rejected a slogan about software ("Software that holds up under load, review and test.") and asked for a professional description of *them* as a software engineer. From four directions offered, the owner chose "name + role + focus":

| Element | Text |
|---|---|
| Label above the H1 (mono, uppercase like the section indices) | Abdelrhman Mohamed / Software engineer |
| H1 (final period in `--break`) | Software engineer building systems that stay correct under concurrency. |
| Sub (ISS-13) | Java and Spring Boot, Redis, RabbitMQ, plus Python AI services and open-source work. |

Evidence behind the H1: Eventora's oversell tests (0 oversold seats with 100 VUs against 8 seats; exactly 50 of 100 threads get 50 seats) and the reservation flow diagram on the case study. The label uses the name decided in ISS-14. Directions not chosen: a three-pillar focus statement, "end to end" range, and "problems I solve". Changes `profile.ts` (hero) and the approved copy in `CLAUDE.md` in round 1.

**Decision (owner, 2026-10-08), final.** The owner then supplied their own description and asked for it with their name. Their wording used "robust" (on the banned-words list, enforced by the facts check), "reliable", "scalable" and "production-ready" (unqualified adjectives under honesty rule 5; "scalable" is also undercut by Eventora's measured 1.32x sub-linear scaling, and "production-ready" by the Railway API returning 404). The owner asked why, accepted the reframed version below ("done"), and the copy rules stay unchanged.

| Element | Text |
|---|---|
| Label above the H1 (mono, uppercase) | Software engineer |
| H1, display size, final period in `--break` | Abdelrhman Mohamed. |
| Lead paragraph | Software Engineer focused on designing and building systems that keep working as load grows, with a strong emphasis on correctness, maintainability and real-world engineering constraints. |
| Second paragraph | Interested in software architecture, distributed systems, performance, security, and the engineering practices that turn complex requirements into tested, deployable software. |
| CTAs | View My Work, Download Resume (unchanged) |

Reframing, phrase by phrase: "reliable, scalable systems" → "systems that keep working as load grows" (backed by 569,066 requests with 0 failures and the 10→200-VU Railway ramp); "robust production-ready software" → "tested, deployable software" (228 / 500+ / 104 automated tests; Docker images, the published SysPlex image). "Interested in … distributed systems" states an interest, not a built system, so it stays. Earlier proposals (the four directions, the "under concurrency" line) are superseded.

**Effects.** `profile.hero` gains a label and a second paragraph; the H1 becomes the name (so `personal.name` and the hero agree, ISS-14); `CLAUDE.md` "Approved hero copy" is rewritten; share images use the same lines; the H1 is short, which also helps ISS-28 at laptop sizes.

**Resolution (2026-10-08, round 1).** `profile.hero` holds `label`, `headline` ("Abdelrhman Mohamed."), `lead` and `more`; `Hero` renders them; the share image uses the label as kicker and the name as title. `scripts/check-facts.ts` asserts the H1 equals `personal.name` plus a period. Captures: `docs/screens/review-1/`.

### ISS-13 Hero sub without "Software Engineering student at AASTMT (Jun 2027)"

**UAT** UAT-01. **Severity** Medium. **Status** Decided (owner note).

**Change.** The sub becomes "Java and Spring Boot, Redis, RabbitMQ, plus Python AI services and open-source work." (or the owner's rewrite to match ISS-12). The education fact stays in About's Education cell, so nothing true is lost. Update the approved copy in `CLAUDE.md` and `profile.ts`.

**Resolution (2026-10-08).** Applied with ISS-12; `CLAUDE.md` "Approved hero copy" rewritten.

### ISS-14 Public name "Abdelrhman Mohamed"

**UAT** UAT-01. **Severity** High. **Status** Decided by the owner on 2026-10-08.

**Context.** The spelling was an open decision ("Abdelrahman" vs "Abdelrhman"; `CLAUDE.md` said never to choose). The owner chose **Abdelrhman Mohamed**.

**Change.** `personal.name` → "Abdelrhman Mohamed"; LICENSE holder; header wordmark, footer, page title template, share image kicker, JSON-LD `Person.name` (handle stays as `alternateName`); `CLAUDE.md` "Decisions already made"; `FACTS-CHECK.md`; closes that line of ISS-08.

**Resolution (2026-10-08).** `personal.name`, LICENSE, header wordmark, footer, intro, page titles, JSON-LD `Person.name` (handle as `alternateName`). The facts check bans the other spelling in shipped text.

### ISS-15 Contact email

**UAT** UAT-30, UAT-32, UAT-39. **Severity** High. **Status** Decided (owner note).

**Change.** `personal.email` → abdelrhmanhamied004@gmail.com. It then renders in Contact ("Or reach me directly"), the footer and the command palette, and as JSON-LD `email`. Closes that line of ISS-08. It is a public address, so expect spam; the contact form (Resend) is the alternative path.

**Resolution (2026-10-08).** `personal.email` set; renders in Contact with an envelope icon, the footer, the palette and JSON-LD.

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

**Decision (owner, 2026-10-08).** Excluded: 8 merged across 6 projects, 3 under review.

**Change.** `oss.json` (mage merged with date and the new #2688 title and note), `scripts/check-facts.ts` asserts, `CLAUDE.md` headline line, `FACTS-CHECK.md`.

**Resolution (2026-10-08).** `oss.json` re-fetched for all 11 PRs (snapshot 2026-10-08); facts check asserts 8 / 6 / 3 and prints it. A local build showed 7 / 5 / 4 until `.next/cache/fetch-cache` was cleared: Next keeps the daily PR fetch between local builds; deployments refresh within a day.

### ISS-17 List every issue filed, open and closed

**UAT** UAT-29. **Severity** Medium. **Status** Decided (owner note), one question.

**Evidence** (`gh search issues --author Sharawey74`, outside the owner's own repos, 2026-10-08):

| Issue | State | Note |
|---|---|---|
| litestar-org/litestar #5020 | closed 2026-09-05 | Reported a CI break from `click` 8.5.0 via rich-click; fixed upstream in rich-click 1.9.9. Shown on the site today |
| conorbronsdon/avoid-ai-writing #333 | closed 2026-09-23 | Fixed by the owner's own PR #342 |
| litestar-org/litestar #5018 | open | The bug that PR #5019 fixes |
| Ahmedtamer-1/elwahapumps #1 | open | The owner's own log calls it a small personal project, not OSS |

**Change.** `oss.json → issues` gets litestar #5020, avoid-ai-writing #333 and litestar #5018 with state and a one-line note each; the section lists them under "Issues reported" with open/closed shown by shape and text, like the PRs.

**Decision (owner, 2026-10-08).** elwahapumps #1 is left out.

**Resolution (2026-10-08).** Three issues in `oss.json → issues`, each with ● Closed / ○ Open and text.

### ISS-18 Some metrics are out of date

**UAT** UAT-03. **Severity** High. **Status** Decided: Eventora performance figures (2026-10-08).

**Evidence.** Eventora, Recruiter-Pro and SysPlex have no commits after the evidence commits the site is pinned to (`ef96703`, `daf160b`, `9f3cce9`; checked with `git rev-list` on 2026-10-08). So the code has not moved; any mismatch is between what the site shows and what a README says. Known README inconsistencies, all already decided in `FACTS-CHECK.md`:

| Repo | README says | Site shows | Why |
|---|---|---|---|
| Eventora | "11 states" (README:85) | 10 booking states | The enum has 10; the report wins |
| Recruiter-Pro | 530 tests and 83.7% (README:433), 544 elsewhere, 84.07% (README:37, 81) | 500+ tests, 84.07% branch coverage | Two README sections disagree |

**Plan.** A metrics audit table: every metric on the site, its current source line, the README line that states it today, and match / mismatch. The owner marks the ones they consider outdated; a newer number must come from the repo (README, test report or CI run), and the evidence report is updated with it.

**Decision (owner, 2026-10-08).** Review Eventora's README "Performance" section and use its most valuable figures. Read on 2026-10-08 at the pinned commit `ef96703` (README.md:331-375, PERFORMANCE.md):

| Figure | Source | Qualifier that must stay with it | On the site today |
|---|---|---|---|
| **569,066 requests, 0 failed, 0 server errors** across five capacity runs | README.md:349 | local, Docker Compose; 1 CPU, 512 MB, `prod` profile | No. Verify the sum against the five runs in PERFORMANCE.md before use |
| **0 oversold seats**: 100 VUs against an 8-seat tier, 99.9%+ rejected with 409, zero 5xx | README.md:355; PERFORMANCE.md:321 | local | Yes (`burst-oversell`), case study only |
| **Exactly 50 of 100 threads** get the 50 seats, every run | README.md:357; PERFORMANCE.md:334 | full reservation path | As a key decision, not as a figure |
| **660 req/s per 1-CPU instance**, median **2.40 ms**, 0 errors | README.md:344; PERFORMANCE.md:382 | read path; local, Docker Compose; 1 CPU, 5-connection pool | 660 and p95 511 ms yes; the 2.40 ms median no |
| **870 req/s** across 2 replicas, 0 errors | README.md:345; PERFORMANCE.md:318,401 | read path; local | Only in the chart footnote |
| **1.32×** horizontal scaling factor | README.md:346; PERFORMANCE.md:414 | local, 1 → 2 replicas | No |
| **800 req/s at p95 9.0 ms** on 2 replicas | README.md:347; PERFORMANCE.md:400 | read path; local | Yes |
| **CPU-bound, not database-bound**: both replicas at 105% of their 1-CPU budget while Postgres, Redis and the pool kept headroom | README.md:348; PERFORMANCE.md:433 | local | No |
| Booking creation under contention: p95 **55.4 ms**, 0 server errors | README.md:356; PERFORMANCE.md:194,320 | 20 VUs, local | No |
| Railway ramp: 32,577 requests, 0 failed, p95 394 ms at 200 VUs | README.md:362; PERFORMANCE.md:283-291 | read path, live Railway, single replica | Yes (card highlight) |

**Selection.**
- Card highlights (three numbers on the Work card): **0 oversold seats**, **569,066 requests / 0 failed**, **660 req/s per 1-CPU instance**. The 228 tests and 84.1% coverage stay on the case study and in About's flagship cell.
- Case study "Evidence": add 569,066 / 0 failed, the 2.40 ms median, 870 req/s, 1.32×, the CPU-bound finding (as a claim with its source) and the 55.4 ms booking p95; keep the rest.
- Not used: README "11 states" (the enum has 10; decided earlier); p99 (not captured, README:374).
- Every figure keeps its qualifier on screen, per `FACTS-CHECK.md` ("read path", "local, Docker Compose").

Recruiter-Pro and SysPlex: no outdated figure named; the audit table still covers them.

**Resolution (2026-10-08).** The five-run sum was checked against PERFORMANCE.md:381-383 and 400-401 (94,332 + 107,839 + 92,964 + 140,548 + 133,383 = 569,066). New metrics `local-requests`, `local-1-median`, `local-2-ceiling`, `local-scaling`, `local-booking-p95`, the CPU-bound finding as a fact; card highlights changed; every card figure now shows its qualifier. About's flagship cell keeps the test count. Logged in `FACTS-CHECK.md`.

### ISS-19 Alstom internship (later)

**UAT** new case when added. **Severity** Medium. **Status** Owner, later.

**Needs from the owner.** Role title, start and end month, the work done (2–3 specific points), any project produced, and a source (offer letter, certificate or the newest resume line). Goes into `experience.ts → roles` like the other two internships; About's internship count derives from the list.

### ISS-20 Claude certificates as one entry (later)

**UAT** UAT-28 ("no dates on certificates"). **Severity** Low. **Status** Owner, later.

**Needs from the owner.** The exact certificate names and the issuer as printed. One entry, e.g. "Claude courses (Anthropic): <names>", without dates (brief rule).

## Visual system (changes to the brief)

The brief's visual system in `CLAUDE.md` overrides any skill; these notes change it, so each needs the owner's explicit choice (R0) before code, and `CLAUDE.md`, `scripts/check-colors.ts` and `scripts/check-contrast.ts` change with it.

### ISS-21 Heavy crimson secondary color, one harmonized palette

**UAT** UAT-24 (both themes), new case UAT-50. **Severity** High. **Status** Decided: direction A (2026-10-08).

**Note.** "Add heavy crimson as a secondary color so it does not look fully dark, or another color if more suitable with black and white; make all the colors suitable with each other."

**Context.** Today: a 12-step neutral gray ramp, all text gray, and one accent `--break` (#FF3B4E dark / #C4152A light) limited to small marks (≤ 2% of the viewport). `frontend-design` lists "near-black background with a single bright vermilion accent" as a common generated look, so a second, deeper tone can make the palette feel owned rather than default.

| Direction | What | Where it shows |
|---|---|---|
| A, crimson ramp (recommended) | Keep the grays; turn the one accent into a 3-step crimson ramp: deep (about #3A0810, fills and tints), mid (about #8E1428, borders, hover fills, active states), bright (today's `--break`, marks and focus) | Hover and active fills on buttons, the active nav item, section index numbers, card hover edge, chart highlight, selected palette option |
| B, warm neutrals + crimson | Shift the grays slightly warm (R > G = B by a few points) and add the deep crimson for surfaces | Everything above plus a faint warmth on all surfaces |
| C, keep one accent | Only enlarge where `--break` may appear | Least change, least color |

Exact values come from a contrast pass in both themes (text ≥ 4.5:1, graphics ≥ 3:1). Text stays gray except where the owner allows crimson text.

**Decision (owner, 2026-10-08).** Direction A: a three-step crimson ramp on the existing grays. `frontend-design` critiques the result in round 1 before it is kept.

**Resolution (2026-10-08).** Tokens `--c1` (#3A0810 / #F6E2E5), `--c2` (#8E1428 / #A3142A), `--on-c2`, plus the existing `--break`. Uses: Contact band, button and control hovers, active nav pill, selected palette option, card hover edge, selection, section index numbers. `check-colors.ts` allows exactly these definitions; `check-contrast.ts` adds the ramp pairings (light `--c1` lightened from #F3DADD to pass text-3 at 4.63:1). `frontend-design` critique in `docs/UX-REVIEW.md` → Review round 1.

### ISS-22 Rounded buttons

**UAT** UAT-45, new case UAT-50. **Severity** Medium. **Status** Decided: pill on buttons (2026-10-08).

**Context.** Radius is 0–2 px everywhere today (brief). Options: full pill (`9999px`) for buttons and CTAs only, cards stay square (recommended: clear contrast between actions and content); or a small radius (6–8 px) for buttons, chips and inputs.

**Decision (owner, 2026-10-08).** Pill on buttons and CTAs only.

**Resolution (2026-10-08).** `--radius-pill` / `rounded-pill` on `Button`, `ButtonLink`, the card's case-study link, the contact submit, header controls and nav links. Cards, figures and chips stay 0–2 px.

### ISS-23 Arial for the nav bar, the footer and the stack captions

**UAT** new case UAT-50. **Severity** Medium. **Status** Decided: Hanken Grotesk (2026-10-08).

**Context.** Those labels are JetBrains Mono, uppercase, letter-spaced. The brief bans Arial by name; Arial is also not installed on Linux and many Android phones, so they would fall back to another face. **Recommendation:** Hanken Grotesk (the site's text face, already loaded, no extra download) in sentence case for the nav, footer and stack captions; mono stays for numbers and source lines. If the owner still prefers Arial, it is a one-line font stack change.

**Decision (owner, 2026-10-08).** Hanken Grotesk, sentence case.

**Resolution (2026-10-08).** `.ui-label` (Hanken Grotesk 14 px, weight 500, sentence case) on header controls, nav and footer links; stack captions in the text face; index numbers stay mono.

### ISS-24 GitHub and LinkedIn icons

**UAT** UAT-32, UAT-39. **Severity** Medium. **Status** Decided (owner note).

**Change.** Monochrome GitHub and LinkedIn marks as inline SVG (`currentColor`, `aria-hidden`), always next to their text label, in Contact and the footer. The brief allows "a custom SVG only where unavoidable"; brand marks are that case. No other icon set comes in.

**Resolution (2026-10-08).** `src/components/ui/brand-icon.tsx` (GitHub mark, LinkedIn mark, 1.5 px envelope), `aria-hidden`, beside text labels in Contact and the footer.

### ISS-25 Full-color screenshots, several per project

**UAT** UAT-13, UAT-20, UAT-42. **Severity** High. **Status** Decided (owner note), assets to confirm.

**Context.** The brief renders screenshots grayscale until hover (`.shot` filter). The owner wants them in color. Sources found (read-only, 2026-10-08):

| Project | GitHub Pages | Screenshots in the repo | On the site today |
|---|---|---|---|
| Eventora | sharawey74.github.io/Event-Ticketing-Platform | `site/assets/img/screenshots/`: 15 screens, most with a `-dark` variant | 9 dark screens, grayscale |
| Recruiter-Pro | sharawey74.github.io/Recruiter-Pro | `site/assets/img/screenshots/`: 13 screens (landing, jobs, upload, results, score breakdown, shortlist, history, dashboard, job detail, mobile) | none (only mockups existed before, and they are banned) |
| SysPlex | none | none | none (still a TODO) |

**Change.** Drop the grayscale filter (or keep it only as an option the owner can turn back on); Eventora uses its dark screens; Recruiter-Pro gets a carousel of its real screens, which also closes the Recruiter-Pro screenshot TODO, after each image is viewed and checked for placeholder or private data; the case-study galleries use the same sets. Copy rule unchanged: files are copied from the repos read-only.

**Resolution (2026-10-08).** The `.shot` grayscale filter is gone. Every Recruiter-Pro screen was viewed first: 4 used (dashboard, job market, job detail, empty upload); left out the landing page (unsourced "22x", "654 skills", "0.74s"), results, score breakdown, shortlist and history (the owner's own resume under another spelling; see ISS-35), and the job search (a banned term typed in the box). Eventora keeps its 9 screens, now in color. Closes the Recruiter-Pro screenshot `TODO(owner)`.

### ISS-26 Work card slides look blurred

**UAT** UAT-20. **Severity** High. **Status** Open: cause to confirm.

**Likely causes**, to check one by one: the grayscale + contrast filter softening small text; the `sizes` attribute making the browser pick a smaller `srcset` width than the box needs on a 125% scaled screen; `next/image` quality 75 on screenshots full of small UI text; and the sticky stack's `scale` transform on cards. **Fix** after measuring: correct `sizes`, quality 85–90 for screenshots, no filter (ISS-25), and no scaling of the image layer while it is readable.

**Resolution (2026-10-08).** Measured at 1536×864, 1.25x: the card image is 808 CSS px and the browser picked the 1080 w file, so resolution was enough (1,010 device px). The blur came from resampling twice (1440 → 1080 at quality 75 by the optimizer, then 1080 → 1010 by the browser) on small UI text, plus the grayscale and contrast filter. Fix, after a Lighthouse A/B (`docs/reports/lighthouse-review1.md`): no filter; carousel screenshots resized at quality 90 with `sizes` matching the 7-of-12 card column; galleries and the zoom view serve the original files; the case-study hero (the LCP image) stays at the default quality. Serving originals everywhere was sharpest but cost up to 0.4 s of LCP and 0.4–0.6 s of TBT on phones. The owner confirms sharpness in UAT-20 / UAT-54.

### ISS-27 SysPlex diagram

**UAT** UAT-22, UAT-42. **Severity** Medium. **Status** Open.

**Context.** Three agents on the left, one Flask server, one dashboard, plain lines: it reads as sparse. **Plan.** Same five nodes and four steps (diagrams show only sourced components), better composition: group the agents as "on the host" and the server + dashboard as "in Docker" (README: agents run natively, the dashboard runs in an unprivileged container), label the edges with the transport (HTTP :8889, FastAPI :8888, file) and the 2 s poll, tighter spacing. Then the same for the card preview.

**Resolution (2026-10-08).** New `flow.zones` (sourced: README.md:69-70 and 90-91) drawn as dashed frames with a label and note (`flow-parts.tsx`); boxes show each node's detail line (`detail: true` layouts); SysPlex laid out as Tier 1 (three agents) and Tier 2 (server above dashboard). Same five nodes and four steps. The card preview uses the same parts.

## Layout

### ISS-28 Correct only at 67–75% zoom

**UAT** UAT-09 (zoom), UAT-26, new case UAT-51. **Severity** High. **Status** Open.

**Context.** Captures and checks so far used 1280×800 and 1920×1080 at 1x. A laptop at 1920×1080 with Windows scaling at 125% or 150% gives the browser a 1536×864 or 1280×720 CSS viewport: the hero headline (display XL, up to 200 px) fills the screen, section padding is large, and cards are taller than the viewport, which also causes ISS-31. At 67–75% zoom the browser has more CSS pixels, which is why it looks right there.

**Plan.** Test at 1366×768, 1440×900, 1536×864 and 1280×720 (plus the existing sizes); cap display sizes by viewport height as well as width (`min(…vw, …vh)` inside the clamp), reduce section padding at these heights, and make sure a project card fits in one viewport at 1536×864.

**Resolution (2026-10-08).** Display XL is `clamp(3rem, min(15vw, 15svh), 7.5rem)` and display L is capped at `11svh`; hero spacing scales with height. Captured at 1280×720, 1366×768, 1536×864 and 1920×1080: name, both paragraphs and both CTAs fit the first screen. `scrollWidth` equals the viewport at 320 and 375 on all four pages (`r1/scrollwidth.txt` in the round-1 notes; summary in `docs/UX-REVIEW.md`). Two follow-ups found and fixed on the way: the name clipped at 375 (the longest word is about 5.85em) and the header controls overflowed at 320.

### ISS-29 "Also built" overlap

**UAT** UAT-26, UAT-09. **Severity** High. **Status** Open.

**Evidence.** Owner screenshot: "LexIntelligence" and "PhishSniffer" run into the description column. **Cause.** The names are `text-h2` in the display face inside a 3-of-10 column, with no wrapping point and no `min-width: 0`. **Fix.** Name above the description at widths where it does not fit (or a wider name column), `min-w-0`, and a size that fits the longest name.

**Resolution (2026-10-08).** Name on its own row across all 10 columns, `overflow-wrap: anywhere`; description and figures below it.

### ISS-30 Stack section looks cramped and mixed

**UAT** UAT-28, UAT-42. **Severity** Medium. **Status** Open.

**Evidence.** Owner screenshot: chips of different widths wrap at uneven points, and each "used in" caption hangs under its chip at a different width, so the rows read as a jumble. **Plan.** One aligned grid per lane: technology in the first column, where used in the second (a row per technology), or fixed-width chip columns with the caption on one line. Caption font follows ISS-23.

**Resolution (2026-10-08).** `.stack-rows`: a subgrid table, chip column (13 rem) and "used in" column, hairline per row; one column below 30 rem.

### ISS-31 Sticky stack hides part of each card on a laptop screen

**UAT** UAT-21, UAT-26. **Severity** Medium. **Status** Open.

**Evidence.** Owner screenshot: the SysPlex card covers Recruiter-Pro's numbers. **Cause.** Each card sticks below the header and the next one slides over it; when a card is taller than the viewport, its lower part is covered before it was readable. **Fix** with ISS-28: cards that fit the viewport, and the stack switched off (plain list) when the viewport is too short for a card.

**Resolution (2026-10-08).** With the new type scale a card is about 630 px tall at 1536×864, under the 784 px left below the header; card padding reduced; below 40 rem viewport height the stack is a plain list (no sticky, no recede).

## Motion and interaction

### ISS-32 More responsive buttons and CTAs

**UAT** UAT-45, UAT-19. **Severity** Medium. **Status** Decided (follows ISS-21, ISS-22).

**Context.** Today: hover steps a color or border, press drops 1 px, focus shows the ring, primary CTAs lean toward the pointer (magnet). **Plan.** One treatment per control type, inside the motion rules (transform and opacity only, 200 ms, one easing): primary button fills with the accent on hover, its arrow moves 4 px; secondary button gets the accent border; text links get an underline that draws in; palette and nav items get the active marker on hover. Final values after the palette and radius decisions.

**Resolution (2026-10-08).** Filled button → `--c2` with `--on-c2` text; outline → `--c2` edge on `--c1`; trailing arrow moves 4 px toward where it points; header controls and nav links get a `--c1` pill on hover; card edge turns `--c2`. All 200 ms, one easing, colors and transform only.

### ISS-33 Custom cursor shows "ON" everywhere

**UAT** UAT-19. **Severity** High (on every page, desktop). **Status** Open. Found in the owner's screenshots.

**Cause** (confirmed in code). `src/components/motion/cursor.tsx` marks the page with `document.documentElement.dataset.cursor = "on"`, and its hover lookup is `closest("a[href], button:not(:disabled), [data-cursor], [role='button']")`. Over plain content the nearest match is `<html>` itself, so its value "on" becomes the cursor label. **Fix.** Store the "cursor active" flag under another attribute (e.g. `data-cursor-active`) or exclude the root from the lookup; add a UAT step.

**Resolution (2026-10-08).** The page flag is now `data-cursor-active`; `data-cursor` is only a per-element label. Probe (headless Chrome, fine pointer, motion on): over the hero paragraph the ring is `idle` with no label; over the CTA it is `hover`.

### ISS-34 Scroll-spy marks "05 Contact" at the top of the page

**UAT** UAT-15. **Severity** Medium. **Status** Open. Found in the owner's screenshots.

**Evidence.** All six screenshots, including one with the hero on screen, show "05 Contact" as current; the URL was `/#open-source`. **Suspected cause.** `ScrollSpyNav` recomputes only when a heading crosses the 45% line; a load with a hash, or a fast smooth-scroll jump, can leave the last computed section in place. **Fix.** Reproduce, then also recompute on load, on `hashchange` and when Lenis' scroll settles.

**Cause (confirmed).** The observer watched only a band at the top 45% of the viewport. A jump (hash link, scroll restoration, "Back to top") can move a heading from above the band to below it, or past the viewport entirely, with no crossing, so the last result stayed. **Resolution (2026-10-08).** A second observer watches each heading's whole section over the full viewport (a jump always changes which section is on screen), plus `hashchange` and `pageshow`. Probe: load at top → none; instant jump to bottom → Contact; jump back to top → none; load `/#open-source` → Open source; hash change to `#experience` → Experience.

## Added in round 1

### ISS-35 Recruiter-Pro scoring screens show the owner's own resume

**UAT** UAT-20, UAT-42. **Severity** Low. **Status** Owner.

**Evidence.** Viewed on 2026-10-08: `06-results`, `07-results-full`, `08-score-breakdown`, `09-shortlist` and `10-history` in Recruiter-Pro's `site/assets/img/screenshots/` show the owner's own resume file and name under a different spelling; `08` is also a broken stitched capture; `03-jobs-search` has a banned technology typed in the search box. The scoring view is the most interesting screen of the app, and the site cannot show it.

**Fix (owner).** Re-capture results and score breakdown with a sample resume (a made-up candidate), and the jobs page without a search term; commit them to Recruiter-Pro; then they are copied here like the others. Cost: about 15 minutes in the running app.

### ISS-36 TBT up after round 1; Recruiter-Pro LCP over budget

**UAT** none (measurement). **Severity** High. **Status** Decided (option C, like ISS-01 / ISS-02).

**Evidence** (`docs/reports/lighthouse-review1.md`, 3 runs per page, CPU benchmark 2,212–2,908, mains power): medians `/` LCP 2.43 s, TBT 1,508 ms; Eventora 2.88 s, 1,224 ms; Recruiter-Pro 3.28 s, 1,120 ms; SysPlex 2.65 s, 1,079 ms. Stage 5: LCP 2.11–2.79 s, TBT 695–989 ms. CLS 0.001 and accessibility, best practices and SEO 100 everywhere.

**What was measured.** Serving original screenshots cost up to 0.4 s of LCP and 0.4–0.6 s of TBT; that was reverted (carousels resized at quality 90, hero image at the default). A Chrome trace of `/` at 4x CPU still shows the cost in the first style and layout pass plus hydration, as in Stage 5; a subgrid A/B on About's stack table did not change it beyond the noise.

**Options.** A: trace and trim the first layout (fewer nodes in the stack table, lighter Contact band, lazy diagram zones). B: accept and re-measure on Vercel (CDN, real HTTP/2), as decided for ISS-01 / ISS-02. **Recommendation:** B now, A in Stage 6 if the preview numbers confirm it.

**Vercel preview, 2026-10-09** (first `lighthouse.yml` runs, numbers in ISS-39): TBT 81–138 ms, within budget, so the TBT half of this issue is answered. LCP medians 2.87–3.63 s on all four pages, still over.

**Diagnosis, 2026-10-09** (`perf/lcp-vercel`, local Lighthouse 12 plus Chrome traces at 4x CPU):
- On the text pages the LCP element is body text (`/` the hero's second paragraph, SysPlex the summary), and the whole cost is "render delay". The intro is not the cause: a build without it measured the same.
- Lighthouse CI uses simulated throttling, which charges every request started before the observed paint. Before first paint each page requests the HTML, 11.5 KB of CSS, three preloaded fonts (203 KB: Newsreader 129 KB, JetBrains Mono 39.5 KB, Hanken 34 KB) and about 160 KB of JavaScript. On the slow-4G profile the fonts delay the CSS (it arrives at about 1.5 s with applied throttling), and the first style and layout pass then takes 0.5–1.3 s at 4x CPU for 429 elements. Ablating CSS features by injected overrides was too noisy to single one out (the same wall as in Stage 5).
- Not preloading Hanken and JetBrains made it worse (FCP later, CLS 0.043 on Recruiter-Pro): reverted.
- Done: JetBrains Mono at weight 400 only (the only weight used), 39.5 KB to 20.7 KB, no visible change.
- Measured, needs an owner decision because it changes the look: Newsreader without the `opsz` axis, 129 KB to 57 KB. Best local runs: SysPlex 3.62 to 3.12 s, `/` 3.78 to 3.25 s (noisy, CPU benchmark 1,341–2,930). The headline is drawn from the text master instead of the display master: heavier hairlines, slightly wider. Not enough on its own to reach 2.5 s.
- Real visitors: with applied throttling the text paints at 2.4–2.9 s, and unthrottled at 0.26–1.3 s; simulated lab numbers sit above both. Field data (Vercel Speed Insights) would show the visitors' actual LCP.

**Owner decision, 2026-10-09.** Keep the display font as it is (the `opsz` axis stays; the look wins over about 0.5 s of simulated LCP). Add Vercel Speed Insights (`@vercel/speed-insights`, rendered only when `VERCEL=1`, +1.2 KB gz on `/`, 157.4 KB of 170) and judge LCP on real visitors' 75th percentile once it has data; the Lighthouse LCP assertion stays `warn` until then. If the field LCP is over 2.5 s, reopen option A (first layout and JavaScript). The owner switches Speed Insights on in Vercel (project → Speed Insights → Enable); it sends anonymous performance numbers, no personal data.

**After the merge (#19, production `0a306d9`, 2026-10-09).** Preview Lighthouse run on #19 (Actions run 37944429794, CPU benchmark 2,106–2,592, slower than the first run's 2,854–3,081): median LCP `/` 2.98 s, Eventora 3.03 s, Recruiter-Pro 3.03 s, SysPlex 2.89 s (first run 2.88 / 3.63 / 3.03 / 2.87); median TBT 301 / 223 / 153 / 201 ms; CLS 0.001; accessibility 100 on every page. The mono saving is within run-to-run noise. Speed Insights checked on production in a browser: its script loads from a first-party path (`/<id>/script.js`, `window.si` defined), no console errors. The Vercel page shows "Get Started" until the first visits are recorded. **Next:** read the Mobile LCP at the 75th percentile after a day or two of visits; under 2.5 s closes ISS-01, ISS-02 and this issue (and switches the Lighthouse LCP assertion to `error` only if the lab numbers also fit, otherwise it stays `warn` with the field number as the budget of record); over 2.5 s reopens option A.

### ISS-37 Smoke tests timed out under parallel load

**Severity** Medium (a flaky check in CI is worse than none: people learn to ignore red). **Status** Closed (2026-10-08, Stage 6).

**Evidence.** First full run of `npm run test:smoke`: 8 failed, 12 passed in 2.0 min, every failure a 30 s timeout ("page.evaluate: Test timeout of 30000ms exceeded"). The same tests run one at a time passed in under a second each (`npx playwright test -g "has one h1" --workers=1`: 4 passed in 6.9 s).

**Cause.** Playwright defaults to one worker per CPU core (about 8 here), and each worker is a full Chromium. All of them hit one local `next start`, which resizes screenshots on first request; the server and the browsers competed for the same CPU, pages took longer than 30 s, and the tests timed out. Nothing in the site was broken. A later run straight after `next build` (CPU still busy) had 2 timeouts in 49 s; the next two runs passed 20/20 in 9–12 s.

**Fix.** `playwright.config.ts`: `workers: 2`, `timeout: 60_000`, `retries: 1` in CI. Evidence: 20/20 on three runs, including one with the image cache deleted. If a smoke test fails again, rerun it alone (`npx playwright test -g "<name>" --workers=1`): passes alone means load, fails alone means a real bug; the trace in `test-results/` (or the CI artifact) shows which.

### ISS-38 Network failures look like command failures

**Severity** Low. **Status** Decided: retry, no repo change.

**Evidence.** In Stage 6, `npm view eslint-config-next@latest version peerDependencies --json` failed with `npm error code ECONNRESET … read ECONNRESET … This is a problem related to network connectivity`, while the `npm view eslint …` call a second earlier in the same command succeeded. The same query retried a minute later returned the peer ranges. Earlier rounds saw the same class of failure from GitHub (`git push` "Internal Server Error", Stage 5).

**Cause.** The connection to the registry was reset mid-response (Wi-Fi, ISP, a proxy or antivirus inspecting HTTPS, or the registry itself). Nothing in the project.

**How to tell.** A network failure names the network: `ECONNRESET`, `ETIMEDOUT`, `ENOTFOUND`, `EAI_AGAIN`, "Internal Server Error" or 5xx from GitHub, "unable to get local issuer certificate" (this clone needs `http.sslBackend=schannel`). A project failure names a file, a rule or a test. **Action:** wait a minute and rerun the same command; if it keeps failing, check the connection or `npm config get proxy`. The owner's local guide (`PORTFOLIO-GUIDE.local.md`, not in git) explains each command and its failures.

### ISS-39 Card numerals fail contrast in the light theme

**Severity** High (the Lighthouse workflow fails on accessibility below 100; WCAG 1.4.3). **Status** Closed 2026-10-09: the Lighthouse run on #18's preview (Actions run 37935559731) reported only LCP warnings, no accessibility failure, on `/` and the three case studies; #18 is merged.

**Evidence.** First `lighthouse.yml` run, 2026-10-09, on the preview of `docs/vercel-live` (3 mobile runs per page): `/` accessibility 0.97 on all three runs, the only failing audit `color-contrast`, on `li.stack-item … span.card-numeral` ("01", "02", "03"): foreground #999999 on #EEEEEE, 2.45:1, 48.6 px normal weight, expected 3:1. The three case studies scored 100.

**Cause.** The numeral used `--deco` (`--g7`), the "decoration only" step. In dark it happens to pass (#666666 on #111111, about 3.3:1); in light it does not. Lighthouse's Chrome reports `prefers-color-scheme: light`, so CI tests the light theme, while the local runs so far ran the dark one. `aria-hidden` does not exempt visible text from the contrast audit. `check:contrast` did not catch it because it checks text roles, and this text used a decoration token.

**Fix.** `.card-numeral` uses `--text-3` (`--g8`): light #666666 on #EEEEEE about 4.9:1, dark #8F8F8F on #111111 about 5.9:1, both above 4.5:1. Rule for later: anything rendered as text uses a text role, never `--deco`. Close with the next preview's Lighthouse accessibility 100 on `/`.

**Same run, performance** (for ISS-01, ISS-02, ISS-36; Vercel preview, CPU benchmark 2,854–3,081): median LCP `/` 2.88 s, Eventora 3.63 s, Recruiter-Pro 3.03 s, SysPlex 2.87 s; median TBT `/` 138 ms, Eventora 131 ms, Recruiter-Pro 90 ms, SysPlex 81 ms; CLS 0.001. TBT is within the 200 ms budget on Vercel; LCP is still over 2.5 s on every page.

### ISS-40 Contact form not connected on production

**Severity** Medium (visitors still reach the owner through the email, GitHub and LinkedIn links). **Status** Closed 2026-10-10.

**Resolution.** The owner set `RESEND_API_KEY` (secret), `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (`onboarding@resend.dev`) on Production only and redeployed. Evidence: the production `/` serves the `contact-form` element with its fields (checked 2026-10-10 12:05 UTC), and the owner's test message arrived in the inbox. Previews keep the "not connected" note by design. With the shared sender, delivery works only to the Resend account's own address; a verified own domain lifts that (`DEPLOY.md` → Contact form, step 5).

**Context.** `contactConfigured()` (`src/lib/contact-config.ts`) renders the form only when `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set; production has none of them, so `/#contact` shows the "not connected" note.

**Decision (owner, 2026-10-09).** Do it later, in one batch with the resume PDF, the Alstom internship (ISS-19), the certificates (ISS-20) and the remaining `TODO(owner)` items (ISS-08).

**Steps when the time comes** (`DEPLOY.md` → Contact form): a Resend account and a sending-only API key; in Vercel, Production only, `RESEND_API_KEY` as a secret, `CONTACT_TO_EMAIL` = the Resend account's email, `CONTACT_FROM_EMAIL` = `Portfolio <onboarding@resend.dev>` (no verified domain yet, and Resend's shared sender delivers only to the account's own address); redeploy; send one test message. Close with the test message received.

### ISS-41 Local-only files lost on a branch switch

**Severity** Medium (the plan, facts log and checklist exist only on this machine). **Status** Closed 2026-10-09.

**What happened.** The local `main` branch still pointed at a commit from before the untracking (067492d), where the three files were tracked. `git switch main` replaced the ignored working copies with the committed ones (git treats ignored files as expendable), and `git pull` then fast-forwarded across the untracking commit, which deleted them. `DEPLOY.md` survived because it was never tracked there.

**Recovery.** Each file restored from the parent of its newest untracking commit (`ed8de71~1`, 2026-10-08 22:55, for `PLAN.md` and `PERSONAL-INFO-CHECKLIST.md`; `FACTS-CHECK.md` was the same in both). The session logs show no edit to these files after that commit, so nothing was lost.

**Prevention.** Never check out a commit or branch from before 2026-10-08 23:00 in this folder (the old `feat/*` branches, `chore/eslint-10` before its untracking commit). To read an old branch, use `git show <branch>:<path>` or a separate worktree. Local `main` is now current. Keep a copy of the local-only files outside the repo.

### ISS-42 Redesign before launch (Stage 7)

**Severity** High (it changes every page and the brief). **Status** Decided (owner, 2026-10-10); planned, not started.

**Request.** The owner wants the site to look like resend.com (black background, structure, type, components, borders, accents, gradients) with the motion and transitions of the GetLayers templates (getlayers.ai/templates, "Stride" in particular).

**What the references use** (observed in a browser on 2026-10-10):
- *resend.com:* background `#000`; sticky transparent header, 58 px. Fonts: Domaine Display (Klim, commercial) for the H1 at 96 px weight 400; ABC Favorit (Dinamo, commercial) for section headings at 56 px, tracking −2.8 px; Inter for body and nav; Commit Mono (free, OFL) for code. Headings use gradient text (white 30 % to 50 % white). Text `#F0F0F0`, secondary `#A1A4A5`; borders `rgba(214,235,253,0.19)` and `0.145`; section cards 24 px radius with a top border, buttons and badges as pills. Accents are small and per product (mint `#A1FCEA`, faint colored glows, a 30 s rotating gradient border on the announcement pill, a 6 s color pulse). The 3D objects are pre-rendered videos (`cube.mp4`, `3d-react.mp4` and others), not live WebGL. Logo marquees run at 180 s per loop and pause on hover; hover transitions are 200–300 ms ease-out. Page order: hero, a code block with language tabs, feature grids, an editor demo, a 3×3 grid, a closing headline, footer.
- *GetLayers "Stride":* a Premium template with a commercial licence; only a 7.3 s preview video is public, the prompt and code are paid. A deep-blue gradient hero with a three.js light filament, headline words that blur into focus, count-up stats, then bento cards, a carousel and a chrome 3D object.

**Constraints that shaped the decision.** Resend's display and heading fonts are commercial licences, its 3D videos and brand are its own, and Stride's code is paid: a literal copy is not possible without licences, and a recognisable clone of a developer tool's homepage would undercut a portfolio built on sourced evidence. A live WebGL hero adds weight right after the LCP work (ISS-36), so it must load after the first paint.

**Owner decisions, 2026-10-10.**
1. Resend-style with own assets: the structure, black look, type hierarchy, gradient headings, translucent borders, rounded cards, pill buttons and a code-block section, built here; GetLayers-style motion implemented here; no copied files, fonts, videos or code.
2. Free lookalike fonts: a free display serif near Domaine (candidates: Instrument Serif, or keep Newsreader), a free grotesk near Favorit for section headings (candidates chosen in the mock-up), Inter for body (the current ban is lifted by this decision), Commit Mono for code (the same free font Resend uses; self-hosted).
3. Accent: mostly monochrome like Resend, with red where Resend uses mint: live dots, focus rings, one highlight per chart, the hero glow.
4. Timing: before v1.0.0, so the owner's content batch (ISS-40, ISS-08, ISS-19, ISS-20) and the UAT (ISS-09) happen once, on the new design.
5. Plan and document first; no code until the mock-up is approved.

**What stays.** All content and data files, the facts and honesty rules, the banned claims, the content model, accessibility (contrast checks, reduced motion, pause control, JS-off content), the budgets (`/` ≤ 170 KB JS, CLS < 0.05), CI and the smoke tests.

**Rules this replaces** (in `CLAUDE.md`, rewritten in the Stage 7 branch together with the code, as the brief requires): no gradients or gradient text; content radius 0–2 px; Inter banned; the crimson ramp; the editorial 12-column offsets as the main layout; Newsreader, Hanken Grotesk and JetBrains Mono as the only faces.

**Mock-up v1, 2026-10-10** (7.1, a private design canvas the owner opens from the link in the session): the home page in dark and light (header, hero with gradient H1, red announcement pill, CSS stand-in for the hero light, four sourced figures, the Eventora card plus two compact cards, a tabbed code block with three real excerpts pinned to commits, a 3×3 grid of sourced figures, a closing line, footer) and a board of choices (two display serifs, three heading grotesks, color tokens, motion list). Tweaks switch theme, fonts and the red. Two pieces of new copy are left as bracketed placeholders for the owner: the code section's intro line and the grid's heading. Awaiting the owner's choices and approval.

**Owner choices on v1, 2026-10-10.** Display serif: Newsreader (kept, with its `opsz` axis). Heading grotesk: Instrument Sans. Red: `#FF3B4E`. The "From the source" code section is dropped. Every component interactive and animated, including a screenshot slider for the work.

**Mock-up v2, same day.** Project tabs (Eventora, Recruiter-Pro, SysPlex) swap the work card with a blur-and-rise; each card has a screenshot slider (progress bars that fill and advance, pause on hover or focus, arrows, dots, arrow keys; SysPlex shows its owed-screenshot placeholder); figures count up on load and when the grid enters the viewport; an Open source list with an All / Merged / Under review filter (11 / 8 / 3, snapshot 2026-10-08); a pause-animations switch and an animated theme toggle in the header; a pointer-following red spotlight on cards; arrow and outward-link icons nudge on hover; sections rise as they scroll in. Grid heading drafted as "Every figure has a source." (alternatives in the session). Reduced motion turns every animation off; the pause switch stops all loops.

**Approved by the owner, 2026-10-10 (mock-up v3).** Grid heading A, "Every figure has a source." Additions in v3, all to carry into the site: brand icons (GitHub mark, LinkedIn mark, a line envelope for email; the Gmail logo is not used) on a row of pill links under the closing line and in the footer, with a lift and red tint on hover; the Eventora screenshots become search results (`02-search-results-dark.webp`, new, copied from the Eventora repo's `site/assets/img/screenshots/` after viewing it: seed data only), ticket tier selection, organizer dashboard, attendee check-in and refund request, and the landing-page screenshot is removed. Owner follow-up the same day: the search slide uses the light-theme file (`02-search-results.webp`), and the dark booking confirmation (`06-booking-confirmation-dark.webp`, demo event and demo tickets from the repo's showcase site) is added after ticket selection, both viewed first and copied from the same folder (on the site it is the case-study hero today, so 7.4 picks a new hero); an "Also built" row with PhishSniffer (97.7 % test accuracy on 8,571 held-out samples; live demo and source) and LexIntelligence (10/10 self-run scenarios; "No automated tests." kept as its caveat).

**Plan.** Stage 7 in `PLAN.md`: 7.0 brief and tokens, 7.1 HTML mock-up for approval, 7.2 foundation, 7.3 hero, 7.4 sections and case studies, 7.5 motion, 7.6 QA and measurements. Ships as one minor bump inside 0.x; v1.0.0 launches with it.

---

# Closed

| ID | Issue | Closed | Evidence |
|---|---|---|---|
| — | Stage 5 design critique D1–D9 (header overflow at 768 px, duplicated stack, card title wrap, tiny previews on phones, case-study heading sizes, redundant eyebrows, repeated numerals, diagram scroll hint, split code token) | 2026-10-07 | `docs/UX-REVIEW.md` → Stage 5, 5.2; after captures in `docs/screens/stage5-after/` |
| — | CLS 0.188 from the display font swap | 2026-10-07 | `docs/UX-REVIEW.md` → Stage 4, S2; CLS 0.001 since |
| ISS-12, ISS-13, ISS-14, ISS-15 | Hero copy, name and email | 2026-10-08 | `profile.ts`, `personal.ts`; facts check asserts H1 = name; captures in `docs/screens/review-1/` |
| ISS-16, ISS-17 | Open source numbers and reported issues | 2026-10-08 | `oss.json` snapshot 2026-10-08; facts check prints 8 / 6 / 3 |
| ISS-18 | Eventora figures from the README performance section | 2026-10-08 | `projects.ts`; `FACTS-CHECK.md` Eventora rows (sum checked) |
| ISS-21 to ISS-24, ISS-32 | Accent ramp, pills, interface face, brand icons, control feedback | 2026-10-08 | `npm run check` (contrast and colors over the ramp); `docs/UX-REVIEW.md` → Review round 1 |
| ISS-25, ISS-26 | Color screenshots, blur | 2026-10-08 | Measured image sizes and the fix in the detail above; owner confirms in UAT-20 |
| ISS-27 | SysPlex diagram | 2026-10-08 | Two-tier zones from README.md:69-70, 90-91; captures in `docs/screens/review-1/` |
| ISS-28 to ISS-31 | Laptop sizing, "Also built" overlap, stack table, sticky stack | 2026-10-08 | Captures at 1280×720 to 1920×1080; `scrollWidth` = viewport at 320 and 375 on all pages |
| ISS-33, ISS-34 | Cursor label, scroll-spy after jumps | 2026-10-08 | Headless Chrome probe, results in the details above |

New issues found from here on get the next `ISS-NN` ID and a row in the table at the top.
