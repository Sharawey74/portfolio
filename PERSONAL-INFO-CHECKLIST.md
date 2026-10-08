# Personal info checklist

Everything personal lives in one file: `src/data/personal.ts`. Each field below
starts as `{ value: null, todo: "TODO(owner): …" }`. To fill one, set `value`
and delete the `todo` key. An empty field renders nothing (no placeholder), so
the site looks finished either way.

`npm run check:launch` lists what is still open (added in Stage 1). It exits
non-zero only with `--strict`, or when `LAUNCH_STRICT=1` is set on the Vercel
production build.

Supplied by the owner on 2026-10-08, applied in review round 1 (`docs/ISSUES.md`): **name** "Abdelrhman Mohamed" (ISS-14), **email** abdelrhmanhamied004@gmail.com (ISS-15). Still to come later: the Alstom internship (ISS-19) and the Claude certificates (ISS-20).

| Field | Where it appears | File | Notes |
|---|---|---|---|
| `name` | Header wordmark, hero, intro sequence (M1), footer, page titles, OG image, JSON-LD `Person.name` | `src/data/personal.ts` | Spelling differs across your files ("Abdelrahman" vs "Abdelrhman"). Also update the holder in `LICENSE`. |
| `email` | Contact section, footer, command palette "Email" action | `src/data/personal.ts` | Separate from `CONTACT_TO_EMAIL`, which is where the form delivers. |
| `phone` | Contact section only | `src/data/personal.ts` | Never rendered unless set. |
| `portrait` | About bento | `src/data/personal.ts` + file under `/public` | Rendered grayscale like screenshots. |
| `location` | About bento, JSON-LD `Person.address` | `src/data/personal.ts` | |
| `bio` | About bento | `src/data/personal.ts` | Plain, specific, verb-led; the facts check scans it for banned words. |
| `availability` | Hero meta line, contact section | `src/data/personal.ts` | |
| `gpa` | Experience, education entry | `src/data/personal.ts` | |
| `resumePdf` | Hero "Download Resume" CTA, command palette | `src/data/personal.ts` + `/public/resume.pdf` | Button renders disabled (outline) until both are set. Do not reuse an older resume PDF: they contain claims the evidence report contradicts (Node.js, 11-state, 194 tests, 700 VUs, LangChain, XGBoost, MySQL, OAuth 2.0, Microservices, CQRS, Event Sourcing). |
| `github` | Header, footer, contact, JSON-LD `sameAs` | `src/data/personal.ts` | Set: `github.com/Sharawey74`. |
| `linkedin` | Footer, contact, JSON-LD `sameAs` | `src/data/personal.ts` | Set. The probe got LinkedIn's bot wall (999); open it once in a browser to confirm. |

## Other items you owe (not personal, tracked as `TODO(owner)` in data files)

| Item | File |
|---|---|
| Is the Eventora Railway API intentionally down? | `src/data/projects.ts` |
| Real Recruiter-Pro app screenshots (the PNGs in the repo are mockups) | `src/data/projects.ts` |
| One SysPlex dashboard screenshot | `src/data/projects.ts` |
| Final-year FinTech capstone description (hidden until set) | `src/data/experience.ts` |

## Environment variables (Vercel)

Set in the Vercel dashboard, never committed. Full list with notes in `.env.example`;
setup steps in `README.md` → "Deploying on Vercel":
`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`,
optional `GITHUB_TOKEN`, and `LAUNCH_STRICT=1` on Production when you are ready to launch.
