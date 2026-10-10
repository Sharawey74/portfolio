# Testing guide

Every kind of test and check this site has been through, what each one proves, how to run it, where its results are recorded, and what it does not cover. Written 2026-10-11 (v1.0.0). When a new kind of check is added, add it here.

## At a glance

| # | Check | Proves | Runs | Command or place | Results |
|---|---|---|---|---|---|
| 1 | Lint | Code follows the ESLint rules (Next, React hooks, TypeScript) | CI, every push and PR; locally | `npm run lint` | CI log |
| 2 | Type check | TypeScript compiles in strict mode | CI; locally | `npm run typecheck` | CI log |
| 3 | Facts check | Every public claim has a source and a date; no banned claims, words or private terms | CI (without private terms); locally (with them) | `npm run check:facts` | CI log |
| 4 | Contrast check | Every color pairing the design uses meets WCAG 2.2 ratios, both themes | CI; locally | `npm run check:contrast` | CI log |
| 5 | Launch check | No `TODO(owner)` item is left in the data | Before every build; strict before release | `npm run check:launch -- --strict` | CI log |
| 6 | Build | The site compiles and every page prerenders | CI; locally; Vercel | `npm run build` | CI and Vercel logs |
| 7 | One-color check | No color other than the gray ramp, the red accent family and the two edge lines, in source and built CSS | CI (after the build); locally | `npm run check:colors` | CI log |
| 8 | Bundle budget | First-load JavaScript on `/` is at most 170 KB gzipped | CI; locally | `npm run report:bundle` | CI log, `CLAUDE.md` per stage |
| 9 | Smoke tests | The built site works for a visitor (21 tests) | CI; locally | `npm run test:smoke` | CI log, traces on failure |
| 10 | Lighthouse CI | Accessibility, layout shift, blocking time and LCP on the deployed preview | Vercel preview of every PR push | `.github/workflows/lighthouse.yml` | Workflow artifact; `docs/reports/lighthouse-stage7-preview.md` |
| 11 | Speed Insights | Real visitors' experience on production | Continuously, production | Vercel dashboard | `docs/ISSUES.md` ISS-01, ISS-36 |
| 12 | Lighthouse, local | Performance and accessibility while building, before a preview exists | By hand | See below | `docs/reports/`, `docs/UX-REVIEW.md` |
| 13 | Browser probes | Layout widths, motion behavior, screenshots | By hand | `scripts/probe-hero-core.mjs` and ad-hoc scripts | `docs/UX-REVIEW.md` |
| 14 | Keyboard walk | Every interactive element is reachable with Tab and shows a focus ring | By hand | Headless browser | `docs/UX-REVIEW.md` (Stage 7.6) |
| 15 | Pixel measurements | What the eye sees: haze, contrast over glows, image fidelity | By hand | Headless screenshots, sampled | `docs/UX-REVIEW.md`, `docs/ISSUES.md` ISS-43, ISS-45 |
| 16 | Main-thread traces | Which work blocks the page (layout, style, script) | By hand | Chrome trace over DevTools | `CLAUDE.md` (Stage 5) |
| 17 | Commit hooks and commit lint | Commit size, message format, no AI attribution, safe pushes | Every commit and push; before a PR | `.git/hooks/*`, `gitflow.sh lint origin/main` | Terminal |
| 18 | Release dry run | The release workflow will find the CHANGELOG section and the right version | Before tagging | See below | PR description |
| 19 | UX audit | Each stage's UI against the UI UX Pro Max rules | End of each stage | Checklist | `docs/UX-REVIEW.md` |
| 20 | UAT | The owner, as a visitor, confirms each feature | Owner only, after v1.0.0 | `docs/UAT.md` | `docs/UAT.md` (owner fills it) |

Rows 1 to 9 are the required check `Lint, typecheck, facts, build, smoke` on `main`: a PR cannot merge unless they pass.

## 1. Automated checks in CI

`.github/workflows/ci.yml` runs on every push to `main` and every pull request, in this order, on Ubuntu with Node 24. A failure at any step stops the job.

1. **Lint** (`eslint .`, ESLint 10 flat config in `eslint.config.mjs`).
2. **Type check** (`tsc --noEmit`, strict).
3. **Facts check** (`scripts/check-facts.ts`):
   - imports every data file, so each Zod schema parses (a public number without `source` or `asOf` fails);
   - scans the text that ships (`src/`, `public/`) for the banned claims and banned words listed in `CLAUDE.md`, except inside `// facts:allow` regions that name the term;
   - runs semantic asserts a regex cannot, such as: the H1 equals the public name plus a period; the open-source summary is derived (8 merged across 6 projects); certificates carry no dates.
   - **Locally only:** it also reads the do-not-publish terms from the git-ignored `scripts/private-terms.local.txt`. CI does not have that file, so run `npm run check:facts` on this machine before every push.
4. **Contrast check** (`scripts/check-contrast.ts`): reads the token blocks in `globals.css` and checks every pairing the design uses, in both themes:
   - text on surfaces at least 4.5:1;
   - the accent as graphics at least 3:1;
   - it also asserts that the no-JS light theme equals the scripted one.
5. **Build** (`npm run build`): runs the launch check (non-strict: it lists open items without failing), then `next build`.
6. **One-color check** (`scripts/check-colors.ts`), after the build so it also reads the compiled CSS:
   - scans `.css` and `.svg` files and color literals in `.ts`/`.tsx` files;
   - fails on any non-gray color except the declarations of `--break`, `--c1`, `--c2`, `--edge` and `--edge-soft`;
   - it also reads color names, so do not write a color name in a CSS comment.
7. **Bundle budget** (`scripts/report-bundle.ts`):
   - sums the gzipped size of every script each prerendered page loads, without the legacy `nomodule` scripts;
   - fails if `/` is over 170 KB;
   - lazily loaded code is not counted, by construction: the hero sphere and the diagrams are not in the page HTML.
   - Latest result: `/` 158.6 KB (2026-10-11).
8. **Smoke tests** (Playwright, Chromium):
   - they run against `next start` on port 3110 serving the build above, not the dev server;
   - CI uploads traces when one fails.

### The 21 smoke tests (`tests/smoke.spec.ts`)

They answer "does the built site work for a visitor", not "is every detail right" (that is UAT).

| Group | Tests | Checks |
|---|---|---|
| Routes | 9 | `/`, the three case studies, `/sitemap.xml`, `/robots.txt`, `/opengraph-image` and `/icon.svg` return 200; an unknown path returns 404 |
| Pages render | 4 | Each page has exactly one visible H1 and no console errors or uncaught exceptions once the network is idle |
| Header navigation | 1 | At 1280 × 800, clicking "Work" changes the URL to `#work`, scrolls the section into view and marks the link current |
| Work tabs and filter | 1 | The Recruiter-Pro tab shows its card and hides Eventora's; the Open filter shows fewer rows than All, at least one, and no "Merged" row |
| Reduced motion | 1 | With reduced motion, the H1 and the five section titles are present |
| JavaScript off | 1 | Without JavaScript, the H1 and the three project cards render, and a case study renders |
| Phone width | 4 | At 375 px, no page scrolls sideways |

Run them locally: `npm run build`, then `npm run test:smoke` (once per machine: `npx playwright install chromium`). Two workers on purpose: one server serves every test, and more parallel browsers time out on image optimization rather than finding bugs. When the site gains a page, add it to `PAGES`.

## 2. Measurements on the deployed site

### Lighthouse CI on every preview

`.github/workflows/lighthouse.yml` runs when Vercel reports a successful **preview** deployment.
- **Pages and runs:** the four pages, three runs each, mobile emulation with Lighthouse's simulated throttling.
- **Budgets,** on the median of the three runs:

| Metric | Budget | Level |
|---|---|---|
| Accessibility score | 100 | Error (fails the check) |
| Cumulative layout shift | ≤ 0.05 | Error |
| Total blocking time | ≤ 200 ms | Error (since 2026-10-10, ISS-02) |
| Largest contentful paint | ≤ 2.5 s | Warning (ISS-01, ISS-36 accepted for v1.0.0) |

- **Production:** on `main` the check reads "Skipped" by design, because it runs for previews only.
- **SEO:** preview SEO reads about 60 by design, because Vercel marks previews `noindex`.
- **Reports:** HTML and JSON for each run are a workflow artifact for 30 days (`gh run download <run id>`).
- **Record of the Stage 7 preview:** `docs/reports/lighthouse-stage7-preview.md`:
  - LCP medians 2.93–3.79 s;
  - TBT medians 30–78 ms;
  - CLS 0.002–0.005;
  - accessibility and best practices 100.

### Speed Insights (real visitors)

- **What it shows:** Vercel Speed Insights runs on production only (it loads only when `VERCEL=1`). On the Hobby plan it shows one Real Experience Score; per-metric LCP, INP and CLS need the Plus plan.
- **Reading (2026-10-10):** 100 at the 75th percentile, desktop, 43 data points on `/`.
- **What it settled:** ISS-01 and ISS-36 are accepted for v1.0.0 on this score.
- **When to reopen:** if the score drops below 90 or mobile data disagrees.

## 3. Hand-run measurements

These are not in CI. Their results are recorded with the date, the conditions and the numbers in `docs/UX-REVIEW.md`, `docs/ISSUES.md` or `docs/reports/`.

### Lighthouse, local

```
$env:CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
npx -y lighthouse@12 http://localhost:3107/ --throttling-method=devtools --output=json --output-path=<file>
```

Run it in PowerShell, against `npm start` after a build (never the dev server). Add `--preset=desktop` for desktop.

**Validity rules,** learned the hard way:
- **Check the CPU first.** Read `environment.benchmarkIndex` in each JSON before comparing runs. Runs on battery read 510–670 against 1,500–2,400 on mains power, and their TBT came out about four times higher.
- **Close the browser pane.** Its animated hero competes for the CPU.
- **Use devtools throttling.** The default simulated throttling can report an LCP far from the observed one.
- **Compare like with like.** Local numbers are not comparable with the preview's, and the budgets are judged on the preview and Speed Insights.
- **Measure a change against its baseline.** Build the commit before it and measure both under the same conditions, as was done for ISS-51. Local mobile TBT varies between about 2 and 4.3 s from run to run on this machine, so one run proves nothing.

**Recorded results:**

| File or section | What it holds |
|---|---|
| `docs/reports/lighthouse-stage5.md` | Stage 5 local runs |
| `docs/reports/lighthouse-review1.md` | Review round 1 local runs |
| `docs/UX-REVIEW.md`, "Hero core" sections | ISS-51 runs, with the before-and-after comparison |

### Browser probes (headless Chromium)

The browser pane inside the desktop app is about 533–800 px wide and draws no frames while hidden, so layout and motion are checked in a headless browser.

- **Hero core** (`scripts/probe-hero-core.mjs`, in the repo, ISS-51):
  - **Run it:** start the built site on port 3107, then `node scripts/probe-hero-core.mjs [outDir]`.
  - **Movement:** the canvas changes between two reads 300 ms apart, stops while "Pause animations" is on, moves again after, and stops when scrolled away.
  - **Loading:** its code loads after the page (one extra chunk).
  - **Reduced motion:** the sphere is drawn once and stays still.
  - **Widths:** at 320 to 1280 px, where the core shows (1280 px and up), that there is no horizontal scroll, and that the name never breaks inside a word.
  - **Last run:** 2026-10-11, every check passed in both themes.
- **Ad-hoc probes during the stages:** written for one check, run, and recorded; the scripts were not kept in the repo:
  - phone width (`document.documentElement.scrollWidth` equals the viewport at 320 and 375 px on every page, both themes);
  - hero opening frame by frame (ISS-50: captures at 250 to 2,600 ms);
  - work tabs, slider and filter interactions (Stage 7.4);
  - scroll-spy after jumps (ISS-34).

  The checklist for re-running them is the matching UAT case.
- **Screenshots:** set the viewport over the DevTools protocol, emulate reduced motion or color scheme, and capture per section. A tall window does not work, because the hero is `100svh`. The steps are in `CLAUDE.md`, "Taking screenshots when the browser pane is hidden".

### Keyboard walk

At the end of Stage 7, every Tab stop on `/` at 1440 px was walked in a headless browser:
- 139 stops: skip link, header, hero, tabs, slider, filter, rows, figure sources, contact pills, form, footer;
- each stop had a visible focus ring, and none was hidden under the header.

Repeat it after any change to interactive elements.

### Pixel measurements

Some problems show only in pixels:
- **Grey haze (ISS-43):** found by sampling black areas with each background layer on and off; the grain had lifted black to (6, 6, 6).
- **Closing glow (ISS-45):** text over it measured 5.84:1 (light) and about 10:1 (dark).
- **Screenshots:** checked against their source files to within 2/255 through the image optimizer.

### Main-thread traces

For blocking time, record a Chrome trace over the DevTools protocol at 4× CPU and break each task over 50 ms into Layout, style recalculation and script (Stage 5). Three-run comparisons of `Performance.getMetrics` were too noisy to use.

## 4. Process checks

- **Git hooks** (installed per clone in `.git/hooks`; reinstall with `gitflow.sh hooks`):
  - `pre-commit`: one file per commit (up to four for one identical change);
  - `commit-msg`: a Conventional Commits subject of at most 72 characters, with no AI attribution;
  - `pre-push`: never deletes a remote branch; only docs go directly to `main`.
- **Commit lint before a PR:** `gitflow.sh lint origin/main` checks every commit on the branch against the same rules; the PR description quotes its result.
- **Release dry run:** before tagging, run the `awk` from `release.yml` on `CHANGELOG.md` to confirm it extracts the `## [x.y.z]` section, and confirm `package.json` has the same version. The release workflow fails otherwise.

## 5. Reviews by a person

- **UX audit** (`docs/UX-REVIEW.md`): at the end of each stage, the new UI is checked rule by rule against the UI UX Pro Max quick reference. Verdicts:
  - Pass;
  - Fixed (found and fixed in the same branch);
  - Open (logged in `docs/ISSUES.md`);
  - N/A;
  - Brief (the brief decides);
  - UAT (needs the owner).
- **User acceptance test** (`docs/UAT.md`): 79 cases, UAT-01 to UAT-80, each with steps and the expected result. There is no UAT-06: the number was never used, and IDs are not renumbered.
  - **Who records results:** only the owner. Nobody else marks a case passed.
  - **Status:** no run has been recorded yet; the run is planned after v1.0.0 (ISS-09).
  - **Superseded cases:** some cases are replaced by newer ones and are marked so.
  - **Defects:** they go in the defect log at the end of that file, and into `docs/ISSUES.md`.

## 6. What is not tested

Stated so nobody assumes otherwise:
- **No unit tests:** the logic is small, and the data is checked by schemas and the facts check.
- **One browser engine:** automated tests run in Chromium only. Firefox and Safari are covered only by the owner's UAT.
- **No real phones:** phones are emulated (375 px, touch off). Real devices are in UAT.
- **No automated accessibility engine beyond Lighthouse** (no axe). The keyboard walk and the contrast check cover part of the rest.
- **Contact form:** only the paths that stop before sending are tested (validation, honeypot). A valid message would call Resend. Delivery was confirmed once by the owner on production (ISS-40).
- **No visual regression testing:** changes are compared by screenshots by hand.
- **Lighthouse CI runs on previews only,** never on production; production is watched through Speed Insights.
