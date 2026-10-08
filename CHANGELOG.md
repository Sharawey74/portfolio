# Changelog

All notable changes to this site. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning follows [Semantic Versioning](https://semver.org/), applied to a website:

- **MAJOR**: a redesign or a new information architecture
- **MINOR**: a new section or case study
- **PATCH**: copy, fixes, performance

Versions 0.1.0 to 0.6.0 were assigned on 2026-10-08, after the fact, one per finished stage, from `PLAN.md`, the merged pull request titles and `git log` dates. No git tags or GitHub Releases exist for them; `package.json` stayed at 0.1.0. The first tagged release will be v1.0.0.

## [Unreleased]

### Added
- `DEPLOY.md`: hosting, the owner's Vercel import steps, environment variables, the pre-release checklist, release and rollback steps.
- Playwright smoke tests in CI: every route returns 200, no console errors, header navigation, reduced-motion and JavaScript-off rendering, no horizontal scroll at 375 px.
- `lighthouse.yml`: Lighthouse on every Vercel preview deployment, 3 runs, against the budgets.
- `release.yml`: a `v*.*.*` tag creates the GitHub Release from this file's section for that version.
- Dependabot for npm and GitHub Actions, weekly, minor and patch updates grouped.

## [0.6.0] - 2026-10-08

Owner review, round 1 (pull request #8; `docs/ISSUES.md` ISS-12 to ISS-34).

### Changed
- Hero: "Software engineer" label, the owner's name as the headline, and the owner's own two-paragraph description.
- Public name and contact email set everywhere (header, footer, contact, page titles, share image, structured data, license).
- Open source snapshot of 2026-10-08: 8 merged pull requests across 6 projects, 3 under review, plus the three reported issues.
- Eventora card leads with 0 oversold seats, 569,066 requests with 0 failed, and 660 req/s per 1-CPU replica, each with its "local, Docker Compose" qualifier.
- Visual system: a three-step crimson ramp on the gray ramp (Contact band, hover and active states), pill-shaped buttons, Hanken Grotesk for interface labels, GitHub, LinkedIn and email icons.
- Display sizes capped by viewport height, so laptops at 125–150% scaling show the hero on one screen.
- Screenshots in full color and full contrast; Recruiter-Pro shows four real app screens; SysPlex diagram drawn as the README's two tiers.
- "Stack, by where it was used" is an aligned table; "Also built" names sit on their own row.

### Fixed
- The custom cursor no longer shows an "ON" label over plain content.
- The header marks the right section after jumps (hash links, Home and End, "Back to top").
- No horizontal scroll at 320 px.

## [0.5.0] - 2026-10-08

Design polish, motion completion, performance pass (pull request #6).

### Added
- Optional WebGL2 hero shader, off by default.
- Issues register (`docs/ISSUES.md`) and the owner's acceptance script (`docs/UAT.md`).

### Changed
- Header links and the two-column project card start at 1024 px; below that the header button opens the command palette as the menu.
- Grain is a pre-rendered texture; the live hero canvas loads only with a fine pointer; the display font loads its normal style only. Mobile LCP 2.11–2.79 s, TBT 695–989 ms (was 1,164–2,043 ms).
- The stack marquee was retired; tech chips appear once, in About.

## [0.4.0] - 2026-10-07

Remaining sections, SEO and docs (pull request #4).

### Added
- About, Open source (daily status refresh from GitHub), Experience and Contact (form over Resend, with a honeypot and rate limit).
- Command palette (Ctrl K), text scramble on labels, grain, grid and vignette surfaces.
- Metadata, share images, structured data, sitemap and robots.

## [0.3.0] - 2026-10-07

Projects and case studies (pull request #3).

### Added
- Work section as a sticky stack of three featured projects, plus two secondary projects.
- Case-study pages for Eventora, Recruiter-Pro and SysPlex, each with a sourced architecture diagram that animates step by step, evidence charts and cited source lines.
- Screenshot carousel, zoom gallery, count-up figures and shared-element route transitions.

## [0.2.0] - 2026-10-07

Hero and navigation (pull request #2).

### Added
- Intro sequence, kinetic hero headline and the node-graph canvas.
- Header with scroll-spy navigation that hides on scroll down.

## [0.1.0] - 2026-10-06

Facts, bootstrap and foundation (Stage 0 on `main`; pull request #1).

### Added
- Data files with Zod schemas that require a source and a date on every public claim; the facts, contrast and color checks.
- Design tokens (12-step gray ramp, one accent), fonts, type scale, theme switch without a flash.
- Motion foundation: one animation loop, smooth scrolling, custom cursor, a global "Pause animations" control.
- CI: lint, typecheck, facts, contrast, build, colors and the first-load JavaScript budget.

[Unreleased]: https://github.com/Sharawey74/portfolio/compare/067492d...HEAD
[0.6.0]: https://github.com/Sharawey74/portfolio/pull/8
[0.5.0]: https://github.com/Sharawey74/portfolio/pull/6
[0.4.0]: https://github.com/Sharawey74/portfolio/pull/4
[0.3.0]: https://github.com/Sharawey74/portfolio/pull/3
[0.2.0]: https://github.com/Sharawey74/portfolio/pull/2
[0.1.0]: https://github.com/Sharawey74/portfolio/pull/1
