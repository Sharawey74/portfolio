# Deploying and releasing

How this site goes live, how a release is cut, and how to undo one. Steps marked **(owner)** are done by the repository owner; nothing here is automated beyond the GitHub workflows listed at the end.

## Hosting

- **Vercel, Git integration.** Production follows `main`; every pull request gets its own preview URL. No `vercel.json`: the Next.js preset needs no settings.
- `/` is prerendered and regenerated at most once a day (the open-source status refresh). The case studies are static.
- Nothing is deployed from a laptop. A merge to `main` is a deploy.

## First-time setup (owner)

The Vercel project is not imported yet (checked 2026-10-09: no deployments on the repo; homepage is a placeholder).

1. vercel.com → Add New → Project → import `Sharawey74/portfolio`. Framework preset: Next.js. Leave the build settings as they are.
2. Add the environment variables below (Production; also Preview if the contact form should work on previews).
3. Deploy. Open the production URL and check the home page and one case study.
4. Set the repository homepage:
   ```powershell
   Set-Location C:\Users\DELL\Desktop\portfolio-site; gh repo edit Sharawey74/portfolio --homepage https://<project>.vercel.app
   ```
5. Optional, if Deployment Protection is on for previews: Vercel → Settings → Deployment Protection → Protection Bypass for Automation → create a secret, then add it to the repository as `VERCEL_AUTOMATION_BYPASS_SECRET` (GitHub → Settings → Secrets and variables → Actions). The Lighthouse workflow uses it.
6. Optional, a custom domain: Vercel → Settings → Domains, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy.
7. Protect `main` (GitHub → Settings → Rules → Rulesets → New branch ruleset, target `main`): require a pull request, and require the status check **`Lint, typecheck, facts, build, smoke`** (the CI job name). Add **`Lighthouse on the preview`** as well once it has run green on a preview.

## Environment variables

Names only; values live in the Vercel dashboard (Project → Settings → Environment Variables). `.env.example` explains each one. Never commit a `.env` file.

| Variable | Needed for | Notes |
|---|---|---|
| `RESEND_API_KEY` | Contact form | Leave any of the three unset and the form is replaced by a "not connected" note |
| `CONTACT_TO_EMAIL` | Contact form | The inbox that receives messages |
| `CONTACT_FROM_EMAIL` | Contact form | A sender on a domain verified in Resend |
| `NEXT_PUBLIC_SITE_URL` | Metadata, sitemap, share images | Optional on Vercel (falls back to the production domain); set it for a custom domain |
| `GITHUB_TOKEN` | Open-source refresh | Optional; a fine-grained token with no scopes raises the API limit |
| `LAUNCH_STRICT` | Launch gate | `1` on Production makes the build fail while any `TODO(owner)` remains |
| `NEXT_PUBLIC_ENABLE_SHADER` | Optional hero shader | `0` (default) or `1` |

`/` is prerendered, so a change to these takes effect on the next deployment.

## Pre-release checklist

Run from the repository folder on the release branch, after `npm ci`:

```powershell
Set-Location C:\Users\DELL\Desktop\portfolio-site; npm run lint; npm run typecheck; npm run check; npm run build; npm run report:bundle; npm run test:smoke; npm run check:launch -- --strict
```

- `npm run check` includes the facts check. Run it **on this laptop**: the do-not-publish terms live in the git-ignored `scripts/private-terms.local.txt`, so CI cannot check them.
- `test:smoke` needs Playwright's browser once: `npx playwright install chromium`.
- `check:launch -- --strict` must print "no TODO(owner) items left". A personal field you decide not to publish is recorded as withheld, with the date, instead of a value: `phone: { value: null, withheld: "2026-10-09" }`.
- `docs/UAT.md` run on the preview URL; `docs/ISSUES.md` has no Open or Owner issue of High severity.

## Release steps

Versions follow `CHANGELOG.md` (MAJOR redesign, MINOR new section or case study, PATCH copy, fixes, performance).

1. On the release branch: set `"version"` in `package.json`, and turn `## [Unreleased]` in `CHANGELOG.md` into `## [X.Y.Z] - YYYY-MM-DD` (add a fresh empty `## [Unreleased]` above it and the compare link at the bottom).
2. Open the pull request and merge it to `main` **(owner)**. Vercel deploys production.
3. Tag the merge commit and push the tag **(owner)**:
   ```powershell
   Set-Location C:\Users\DELL\Desktop\portfolio-site; git checkout main; git pull; git tag -a vX.Y.Z -m "vX.Y.Z"; git push origin vX.Y.Z
   ```
4. The `Release` workflow creates the GitHub Release from that version's CHANGELOG section. It fails, on purpose, if the section is missing or `package.json` has another version.

## After a deploy: smoke checks

On the production URL, by hand, about two minutes:

- `/`, `/projects/eventora`, `/projects/recruiter-pro`, `/projects/sysplex` load; the browser console shows no errors.
- The header links jump to their sections; the theme toggle and "Pause animations" work.
- Open the command palette (Ctrl K) and jump to a project.
- The contact form sends a test message (if configured), and it arrives.
- `/sitemap.xml` and `/robots.txt` load; sharing the URL in a chat shows the share image.
- The Open source numbers match GitHub (8 merged across 6 projects, 3 under review as of 2026-10-08).

The same route, render, navigation, JavaScript-off and phone-width checks run automatically in CI against the production build (`tests/smoke.spec.ts`).

## Rollback

- **Fastest:** Vercel → Deployments → pick the last good production deployment → Promote to Production (instant rollback). No rebuild.
- **Through git:** revert the bad merge on a branch (`git revert -m 1 <merge-sha>`), open a pull request, merge it. Vercel deploys the reverted state.
- **To a tag:** redeploy the deployment built from that tag's commit in Vercel, or revert to it as above.

## Domain notes

- The `*.vercel.app` domain works without setup. A custom domain is added in Vercel (Settings → Domains), which shows the DNS records to create at the registrar.
- After a custom domain is live: set `NEXT_PUBLIC_SITE_URL`, redeploy, update the repository homepage, and check that canonical URLs and share images use the new domain.

## Workflows

| File | Runs on | Does |
|---|---|---|
| `.github/workflows/ci.yml` | every pull request and push to `main` | lint, typecheck, facts (without the private terms), contrast, build, colors, first-load JS budget, Playwright smoke tests |
| `.github/workflows/lighthouse.yml` | a successful Vercel preview deployment | Lighthouse CI, 3 runs on 4 pages; accessibility and CLS fail the job, LCP and TBT warn (`docs/ISSUES.md` ISS-01, ISS-02, ISS-36); reports kept as an artifact |
| `.github/workflows/release.yml` | a pushed `vX.Y.Z` tag | creates the GitHub Release from `CHANGELOG.md` |
| `.github/dependabot.yml` | weekly | dependency update pull requests, minor and patch grouped |

`lighthouse.yml` reacts to Vercel's deployment events, so it only starts once the Vercel project is imported and the workflow file is on `main`.
