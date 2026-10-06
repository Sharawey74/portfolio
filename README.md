# portfolio

Personal portfolio for Sharawey74: backend systems first, with AI services and
open-source work as supporting material. Black and white, one accent color,
every public number traced to a source file and a date.

> Status: Stage 0 (facts and repo bootstrap). The site itself is scaffolded in
> Stage 1. Sections marked _TBD_ are filled in as later stages land.

## Stack

_TBD (Stage 1)_: Next.js App Router, TypeScript strict, Tailwind v4, `motion`,
Lenis, Zod, `next/font`.

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
