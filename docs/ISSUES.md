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

Last updated: 2026-10-08 (end of Stage 5).

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

## Closed

| ID | Issue | Closed | Evidence |
|---|---|---|---|
| — | Stage 5 design critique D1–D9 (header overflow at 768 px, duplicated stack, card title wrap, tiny previews on phones, case-study heading sizes, redundant eyebrows, repeated numerals, diagram scroll hint, split code token) | 2026-10-07 | `docs/UX-REVIEW.md` → Stage 5, 5.2; after captures in `docs/screens/stage5-after/` |
| — | CLS 0.188 from the display font swap | 2026-10-07 | `docs/UX-REVIEW.md` → Stage 4, S2; CLS 0.001 since |

New issues found from here on get the next `ISS-NN` ID and a row in the table at the top.
