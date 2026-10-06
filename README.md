# portfolio

Personal portfolio for Sharawey74: backend systems first, with AI services and
open-source work as supporting material. Black and white, one accent color,
every public number traced to a source file and a date.

> Status: Stage 1 (foundation: tokens, fonts, motion kernel, theme, cursor).
> Sections marked _TBD_ are filled in as later stages land. Build order and
> progress: `PLAN.md`. Rules and context: `CLAUDE.md`.

## Stack

Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript strict,
Tailwind CSS v4 (CSS-first tokens in `src/styles/globals.css`), `motion`, Lenis,
Zod 4, `next/font/google` (Newsreader, Hanken Grotesk, JetBrains Mono). npm.
Node 22.18 or newer (the check scripts are plain `.ts` run by Node directly).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Lists open `TODO(owner)` items, then `next build` |
| `npm run lint` / `npm run typecheck` | ESLint 9 / `tsc --noEmit` |
| `npm run check` | Facts, contrast and one-color checks |
| `npm run check:facts` | Every claim has `source` + `asOf`; no banned claims |
| `npm run check:contrast` | WCAG ratios for every token pairing, both themes |
| `npm run check:colors` | Only grays plus the one `--break` color, in source and built CSS |
| `npm run check:launch` | Lists `TODO(owner)` items; `-- --strict` or `LAUNCH_STRICT=1` fails if any remain |
| `npm run report:bundle` | First-load JS per page after a build (budget for `/`: 170 KB gz) |

`/dev/type` is a type and component specimen for development. It is
`noindex` and returns 404 on the Vercel production deployment.

## Where the content lives

All copy and numbers live in typed data files. Components contain no copy.

| Section | File |
|---|---|
| Personal fields (name, email, photo, bio, resume) | `src/data/personal.ts` |
| Hero and site-wide copy | `src/data/profile.ts` |
| Projects and case studies | `src/data/projects.ts` |
| Open-source PRs | `src/data/oss.ts` (fallback snapshot `src/data/oss.json`) |
| Experience, education, certifications | `src/data/experience.ts` |
| Tech chips | `src/data/skills.ts` |
| Shared Zod schemas | `src/data/schema.ts` |

Every public claim carries a `source` (file:line or URL) and an `asOf` date.
The schemas reject a claim without them, so the build fails.
`FACTS-CHECK.md` maps each claim back to the evidence report.

## Updating

_TBD (Stage 4)_

## Environment variables

_TBD (Stage 4)_

## Deploying on Vercel

_TBD (Stage 4)_

## Launch checklist

See `PERSONAL-INFO-CHECKLIST.md`.

## License

Code: MIT (see `LICENSE`). Written content and photographs: all rights reserved.
