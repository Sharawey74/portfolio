# Facts check

Every public number or claim on the site traces to a row here. Source of truth:
`Desktop/Career/portfolio-evidence/evidence-report.md` ("the report", generated
2026-10-06) and the owner's approved claims. **When they disagree, the report
wins** and the conflict is logged below.

Enforcement: `node scripts/check-facts.ts` (runs in CI). It parses every data
file through Zod (`source` and `asOf` required) and fails on any banned term
outside an explicit `facts:allow` region.

## Source conventions

| Prefix | Meaning |
|---|---|
| `Event-Ticketing-Platform/…`, `Recruiter-Pro/…`, `SysPlex/…` | File in the owner's local repo under `Desktop/`, read-only, at HEAD on 2026-10-06 |
| `Legal-Ai-Assistant@HEAD …` | LexIntelligence, read with `git show HEAD:` (working tree has uncommitted deletions) |
| `github.com/Sharawey74/PhishSniffer …` | PhishSniffer source is on GitHub only |
| `evidence-report.md:N` | Line in the report |
| `owner:approved-claims`, `owner:approved-copy` | Stated by the owner in the build brief (2026-10-06); not contradicted by the report |
| `curl probe` | Read-only HTTP status check on 2026-10-06 |

## Conflicts resolved (report or source file wins)

| # | Brief said | Evidence says | Used on site |
|---|---|---|---|
| 1 | Eventora "JaCoCo **line** coverage 84.1%" | README.md:254: "**Instruction** coverage (JaCoCo) 84.1% gate-scoped" | "JaCoCo instruction coverage 84.1%, gated packages, gate 80%" |
| 2 | Eventora 200-VU Railway ramp, no scope note | PERFORMANCE.md:272-276: run was read-only (browse and search only) | Qualifier "read path" on every ramp figure, plus a caveat |
| 3 | 2-replica p95 "9.0 ms" | PERFORMANCE.md:400 "9.0ms"; :416 "9ms" | 9.0 ms (table value) |
| 4 | PhishSniffer "about 43K **training** emails" | Model metadata: 34,284 train + 8,571 test = 42,855; README "43,868+" | "about 43K emails from public corpora (34,284 train, 8,571 held out)" |
| 5 | Recruiter-Pro screenshots: `frontend/Images/*.png` | The 4 PNGs are design mockups: "ResumeIntelligence" brand, "1,248 jobs in 1.42s" (corpus is 800), salary ranges, 2023 dates, stock persona | Not used. `TODO(owner): real app screenshots` |
| 6 | Recruiter-Pro "Next.js 16, React 19" (implied by shared stack) | frontend/package.json:15-16: next 16.3.0, react ^18.3.1 | Next.js 16.3.0, React 18.3.1 |
| 7 | Recruiter-Pro FastAPI | README badge 0.104.1; requirements.txt:32 `fastapi==0.111.0` | 0.111.0 (manifest) |
| 8 | Recruiter-Pro microcopy "LLM explainer runs locally" | README.md:187: Ollama "Live locally only"; unkeyed deploys serve rule-based (189) | Microcopy kept, plus a caveat naming the rule-based fallback |
| 9 | Recruiter-Pro "500+ tests" | README.md:36 "544", :433 "530 collected"; static count 425 `def test_` (excludes parametrize) | "500+", qualifier notes both README figures |
| 10 | Eventora "30+ endpoints" | README.md:55 "30"; code has 31 mapping annotations | "30+" |
| 11 | Eventora booking states | README.md:53,163 say 11; `BookingState.java` enum has 10 | 10 (code wins) |
| 12 | PhishSniffer live link | Probe returns 303 to Streamlit auth; report could not verify app status | Linked (owner confirms it is up), microcopy "May take a few seconds to wake." |
| 13 | LinkedIn URL "known and allowed" | Probe returns 999 (LinkedIn blocks non-browser clients) | Kept in `personal.ts` (personal info, owner-supplied). **Owner: open it in a browser once to confirm.** |
| 14 | LICENSE holder | Public name spelling is undecided (section 3) | "Sharawey74"; change when the name is set |

## Claim map

Section numbers refer to the report.

### Eventora (`src/data/projects.ts`, slug `eventora`)

| Claim | Source | asOf |
|---|---|---|
| One Spring Boot deployable (modular monolith) + Next.js | README.md:7; pom.xml:11-12; report §2.1, §6 #2 | 2026-10-06 |
| 415 commits, 2026-03-21 to 2026-09-07 | report:29 | 2026-10-06 |
| 228 tests, 228 / 228 passing | README.md:253; static count 228 (report:124) | 2026-09-07 |
| JaCoCo 84.1%, gate 80% | README.md:254 | 2026-09-07 |
| 10-state Spring State Machine | BookingState.java | 2026-10-06 |
| 9 controllers, 30+ endpoints | README.md:55,240; report:122 | 2026-10-06 |
| 14 Flyway migrations | src/main/resources/db/migration | 2026-10-06 |
| Redis Lua atomic inventory guard (100 threads, 50 seats, 50 succeed) | README.md:159 | 2026-10-06 |
| Conditional `UPDATE … WHERE available_count >= :qty` | README.md:160 | 2026-10-06 |
| `@Version` optimistic locking, 409 not 500 | README.md:162 | 2026-10-06 |
| Stripe webhook dedupe by UNIQUE constraint; Idempotency-Key header | README.md:164,395 | 2026-10-06 |
| RabbitMQ with dead-letter queues for QR and email | README.md:52,170 | 2026-10-06 |
| JWT jti + Redis denylist; `@PreAuthorize` on 18 of 30 endpoints | README.md:392,396 | 2026-10-06 |
| Railway ramp 10→200 VUs / 16 min, 32,577 requests, 0.00% failed, p95 ~394 ms | PERFORMANCE.md:263-298 (283, 285, 288-291) | 2026-07-04 |
| Local, Docker Compose: 1 replica 660 req/s, p95 511 ms | PERFORMANCE.md:382,386,411 | 2026-10-06 |
| Local, Docker Compose: 2 replicas behind nginx 800 req/s, p95 9.0 ms | PERFORMANCE.md:400,416 | 2026-10-06 |
| Local, Docker Compose: 100-VU inventory burst, 0 oversell | PERFORMANCE.md:321 | 2026-10-06 |
| Stack versions | pom.xml:8,17,58,78-80,89,139-170; docker-compose.yml:12,29,41; docker-compose.scale.yml:75; frontend/package.json:19,20,33,35 | 2026-10-06 |
| CI: GitHub Actions, 3 jobs, green 2026-09-07 | .github/workflows/main.yml:13-70; report:119 | 2026-09-07 |
| Hosted API 404; frontend only linked as live | report:113 | 2026-10-06 |

### Recruiter-Pro (slug `recruiter-pro`)

| Claim | Source | asOf |
|---|---|---|
| CV screening: parse, extract, score, explain | README.md:5 | 2026-10-06 |
| 4 agents in one deployable, function calls | README.md:131-139,198-207 | 2026-10-06 |
| Providers: Ollama (HTTP), OpenRouter, rule-based | README.md:183-187; src/agents/explaining/__init__.py:30 | 2026-10-06 |
| 800 jobs, 679 canonical skills | jobs.json; README.md:36,49 | 2026-10-06 |
| ~4.5 s end to end | README.md:25,62 | 2026-08-18 |
| Branch coverage 84.07%, CI floor 81% | README.md:37; ci.yml:86 | 2026-08-18 |
| 500+ tests | README.md:36,433 | 2026-08-18 |
| CI: ruff, black, mypy, pytest floor, corpus validation, secrets check | ci.yml:43-102 | 2026-10-06 |
| 3 ADRs (titles) | docs/adr/001-003 line 1 | 2026-10-06 |
| `explanation_source` recorded and printed | README.md:189-193,245 | 2026-10-06 |

### SysPlex (slug `sysplex`)

| Claim | Source | asOf |
|---|---|---|
| Go agent, Bash agent + FastAPI, PowerShell collector, Flask dashboard | README.md:5,39-52,43,155; report:136 | 2026-10-06 |
| Dashboard polls every 2 s | server/static/js/dashboard.js:14 | 2026-10-06 |
| CPU warn 80% / critical 90%; other metrics have their own thresholds | README.md:271-278 | 2026-10-06 |
| Agents on host, dashboard in unprivileged container | README.md:58 | 2026-10-06 |
| Docker Hub `sharawey74/system-monitor`, 124 pulls | Docker Hub API | 2026-10-06 |
| 37 commits, 2025-12-03 to 2026-09-04 | report:31 | 2026-10-06 |
| 104 pytest + 3 Go tests | report:143 | 2026-10-06 |
| No CI, no license, no screenshots (shown as caveats) | report:142,145,146 | 2026-10-06 |

### Secondary grid

| Claim | Source | asOf |
|---|---|---|
| LexIntelligence: dual-model RAG assistant for legal documents | README.md:1-2 (HEAD) | 2026-10-06 |
| LexIntelligence: FastAPI, ChromaDB, LangChain clients (committed at HEAD) | vector_store.py:11, embedder.py:11, llm_client.py:17,35 (HEAD); report:207 | 2026-10-06 |
| LexIntelligence: 10/10 scenarios, faithfulness 0.956, self-run small manual sample | evaluation.md:16,19 | 2026-05-10 |
| LexIntelligence: 26 commits, 2026-05-09 to 05-10; no tests | report:33,209 | 2026-10-06 |
| PhishSniffer: RF, GB, LogReg; TF-IDF + handcrafted features | model/training.py:12-13; model/features.py:38 | 2026-10-06 |
| PhishSniffer: 97.7% test accuracy on 8,571 held-out samples | trained_models/random_forest_20250817_035020_metadata.json | 2025-08-17 |
| PhishSniffer: Telecom Egypt internship deliverable | owner:approved-claims | 2026-10-06 |

### Open source (`src/data/oss.json`)

Titles, states and dates fetched read-only with `gh pr view` on 2026-10-06 and
cross-checked with report §4.2-4.4.

| PR | State | Note |
|---|---|---|
| python/typeshed#16443 | merged 2026-09-25 | |
| FreshRSS/FreshRSS#9369 | merged 2026-10-02 | |
| FreshRSS/FreshRSS#9388 | merged 2026-10-04 | |
| neomjs/neo#19365 | merged 2026-10-02 | |
| vshulcz/deja-vu#4123 | merged 2026-09-29 | shipped in v0.21.4, credited (report:353) |
| conorbronsdon/avoid-ai-writing#332 | merged 2026-09-22 | live +54/−38 (log said +49) |
| conorbronsdon/avoid-ai-writing#342 | merged 2026-09-23 | |
| litestar-org/litestar#5019 | **open** | fix for #5018; never "merged" or "accepted" |
| eclipse-collections/eclipse-collections#1965 | **open** | has a merge conflict |
| simplesamlphp/simplesamlphp#2688 | **open** | maintainer prefers a docs route (2026-10-05, report:363) |
| magefree/mage#16440 | **open** | |
| litestar-org/litestar#5020 (issue) | closed | reported only; fixed upstream, fix not claimed |

Headline (derived in `ossSummary()`, asserted by the check): **7 merged PRs
across 5 projects, 4 under review, 2026-08 to 2026-10.**

Excluded: firstcontributions#123531 (onboarding PR); Micrometer #7625 and #7886
(comment-only, no PR).

### Experience (`src/data/experience.ts`)

| Claim | Source |
|---|---|
| Orascom IT Infrastructure Intern, Jul-Aug 2026; role details | report:408 (role and dates); owner:approved-claims (details) |
| Telecom Egypt AI/ML Intern, Jul-Sep 2025; 2 prototypes, one was PhishSniffer | report:408; owner:approved-claims |
| AASTMT B.Sc. Software Engineering, Sep 2023 to Jun 2027 | owner:approved-claims |
| 4 certifications, no dates | report:408 (names) |

Not attached to Telecom Egypt: the Docker CI/CD and prompt-engineering resume bullets.

### Tech chips (`src/data/skills.ts`)

Every chip names the project(s) it was used in and a source in report §3 or a
manifest line. ChromaDB + LangChain appear only for LexIntelligence. PyTorch is
labelled "notebook" (`~/Downloads/PlantVillageFinal.ipynb`, report:284).

### Diagrams and charts (Stage 3, verified 2026-10-07)

Every animated diagram node and step is data in `projects.ts → flow`, each with
its own source line; the schema rejects a step between undeclared nodes.

| Figure | Drawn from |
|---|---|
| Eventora reservation flow (9 steps, sold-out branch of 2) | Event-Ticketing-Platform/README.md:118-148 (steps 124-148) |
| Recruiter-Pro request path (client → API → 4 agents) | Recruiter-Pro/README.md:209-240 |
| SysPlex collection → Flask → dashboard | SysPlex/README.md:66-106, :185, :258-259; server/static/js/dashboard.js:14 |
| Operating points: 1 replica 660 req/s at p95 511 ms; 2 replicas 800 req/s at p95 9.0 ms | PERFORMANCE.md:382, 386, 400 |
| Footnote: 2-replica ceiling 870 req/s, p95 568 ms | PERFORMANCE.md:401, 412 |
| Ramp schedule 0→10→25→50→100→200→0 over 16 min | `src/test/k6/capacity-ramp.js` at commit d103b56, lines 16-23 |
| Ramp outcomes 32,577 requests, 0.00% failed, p95 394 ms | PERFORMANCE.md:271, 283-291 |

Decisions:
- **Chart form.** The brief asked for "660 vs 800 req/s". Those are different
  measures (660 is one replica's ceiling; 800 is a rate two replicas held), so
  side-by-side bars would imply a like-for-like comparison. The chart plots each
  configuration as an operating point on shared throughput / p95 axes instead,
  with a footnote stating the difference and the 2-replica ceiling.
- **Ramp schedule from the run-time script.** Today's `capacity-ramp.js` also has
  500 and 1000 VU stages, added on 2026-07-15 (commit 5aac1ea), after the
  2026-07-04 run. The chart uses the script as of d103b56 (the commit before
  them), whose 2+3+3+3+3+2 = 16 minutes matches PERFORMANCE.md's "16m00s". The
  line is labelled as configured targets, not measured VUs.
- **Screenshot alt text** was written after viewing the images; `04-ticket-selection-cart-dark.webp` shows the event page with ticket tiers, not a cart, and is described that way.

### Source links (Stage 3)

Case-study sources link to GitHub permalinks pinned to the commit the evidence
was read from (`src/lib/sources.ts`). On 2026-10-07 each pinned commit existed on
GitHub, and all 38 linked files resolved at their commit.

| Repo | Pinned commit | Note |
|---|---|---|
| Event-Ticketing-Platform | ef96703 | equals GitHub `main` |
| Recruiter-Pro | daf160b | equals GitHub `main` |
| SysPlex | 9f3cce9 | equals GitHub `main` |
| LexIntelligence | 6dbd97a | local HEAD; GitHub `main` is 2 README-only commits ahead |
| PhishSniffer | e62bd85 | GitHub `main` (2026-03-03) |

Sources that are not public (`evidence-report.md`, owner statements, probes)
render as plain text.

### Stage 4 sections (verified 2026-10-07)

No new facts were introduced; About, Open source and Experience render data
already mapped above. Numbers shown there are derived, never typed:

| Shown | Derived from | Source carried |
|---|---|---|
| About: "7 merged pull requests across 5 projects, 4 under review" | `ossSummary(prs)`, the same list the Open source section renders | evidence-report.md:309-364, as of the snapshot date |
| About: "2 internships" | `experience.roles.length` (both roles are internships) | evidence-report.md:408 per role |
| About: flagship card | Eventora `summary` and its first `highlights` metric (228 tests) | the claim's own source |
| Open source: dates, line counts, "Fixes #n" | `oss.json` fields | `gh pr view`, 2026-10-06 |

- **Live PR status.** `/` regenerates at most once a day (ISR) and re-reads
  each PR's state from the public GitHub API (`src/lib/oss-live.ts`). Titles,
  line counts and notes stay as committed. A PR merged upstream shows as merged;
  a PR closed without merging is dropped (it is neither merged nor under
  review). Any API failure keeps that PR's snapshot values, and the section
  says which applies ("refreshed daily" vs "as of the last snapshot"). The
  banned-claim asserts on Litestar #5019 and Eclipse Collections #1965 still
  run against the committed snapshot; if either merges upstream, update
  `oss.json` and those asserts together.
- **Sourcing line.** The footer and meta description say every number *names*
  its source (home-page figures carry it as a tooltip; case studies link to the
  pinned lines). Earlier copy said "links to", which was true only on the case
  studies; corrected in Stage 4.
- **Share images** (`/opengraph-image`, `/projects/<slug>/opengraph-image`)
  render the approved headline and each case study's `summary`, plus stack
  names from `projects.ts`. No other text.
- **JSON-LD `Person`** uses the GitHub handle as `name` until the owner sets a
  public name (the spelling decision stays with the owner), `sameAs` GitHub and
  LinkedIn, `alumniOf` AASTMT, and `knowsAbout` from the backend and data chips.

## Banned claims (enforced by `scripts/check-facts.ts`)

- Technology with no repo evidence: Microservices, CQRS, Event Sourcing, Kubernetes, Terraform, Kafka, gRPC, GraphQL, TimescaleDB, Node.js backend, OAuth 2.0, MySQL
- Eventora: "11-state", "194 tests", "83%", "700 VUs", "live API"
- Recruiter-Pro: LangChain (removed 2026-08-17, commit 332471f), RAG, "30-resume corpus"
- PhishSniffer: XGBoost, "50+ features", "10,000+ samples"
- SysPlex: "5 s refresh", "3 agents", "130+ tests"
- Litestar / Eclipse Collections as merged or accepted
- Any certificate date
- Unqualified adjectives (production-grade, scalable, expert) and the banned copy words
- Not published: phone (unless set), date of birth, height, graduation-project idea details, private projects and infrastructure (terms kept in the git-ignored `scripts/private-terms.local.txt`), job-search statistics, third-party resumes

## Link probes (2026-10-06)

| URL | Status | Decision |
|---|---|---|
| github.com/Sharawey74 | 200 | linked |
| linkedin.com/in/abdelrhman-mohamed-abdelhamied-6a59a1368 | 999 | kept (see conflict 13) |
| github.com/Sharawey74/Event-Ticketing-Platform | 200 | linked |
| event-ticketing-platform-nu.vercel.app | 200 | linked as "Frontend" |
| sharawey74.github.io/Event-Ticketing-Platform/ | 200 | linked |
| backend-production-8daea.up.railway.app | 404 (report:113) | not linked |
| github.com/Sharawey74/Recruiter-Pro | 200 | linked |
| sharawey74.github.io/Recruiter-Pro/ | 200 | linked |
| recruiter-pro-nine.vercel.app | 200 | linked |
| github.com/Sharawey74/SysPlex | 200 | linked |
| hub.docker.com/r/sharawey74/system-monitor | 200 | linked |
| github.com/Sharawey74/LexIntelligence | 200 | linked |
| github.com/Sharawey74/PhishSniffer | 200 | linked |
| phishsniffer.streamlit.app | 303 | linked (Streamlit wake redirect accepted) |

## Owner review, round 1 (2026-10-08)

Recorded here so the next data update starts from verified facts; applied in `PLAN.md` → Review round 1.

| Fact | Evidence | Applies to |
|---|---|---|
| Public name is "Abdelrhman Mohamed" | Owner decision, 2026-10-08 | `personal.name`, LICENSE (ISS-14) |
| Public email abdelrhmanhamied004@gmail.com | Owner, 2026-10-08 | `personal.email` (ISS-15) |
| magefree/mage #16440 merged 2026-10-07T19:34Z | `gh pr view 16440 -R magefree/mage`, 2026-10-08 | `oss.json`; headline becomes 8 merged across 6 projects, 3 under review (ISS-16) |
| simplesamlphp/simplesamlphp #2688 retitled "Document the Twig conflict when an application loads its own Twig", still open | `gh pr view 2688`, 2026-10-08 | `oss.json` title and note (ISS-16) |
| Issues filed outside own repos: litestar #5020 (closed), avoid-ai-writing #333 (closed), litestar #5018 (open), elwahapumps #1 (open) | `gh search issues --author Sharawey74`, 2026-10-08 | `oss.json → issues` (ISS-17) |
| Eventora, Recruiter-Pro and SysPlex have no commits after the pinned evidence commits | `git rev-list --count <pin>..origin/main` = 0 for all three, 2026-10-08 | Metrics audit (ISS-18) |
| Recruiter-Pro now has 13 app screenshots in `site/assets/img/screenshots/` | `git ls-files`, 2026-10-08; to be viewed before use | ISS-25; may close the Recruiter-Pro screenshot TODO |

## Open questions for the owner

1. Is the Railway API intentionally down? (report §7 q3)
2. Recruiter-Pro needs real screenshots of the shipped app.
3. SysPlex needs one dashboard screenshot.
4. Confirm the LinkedIn URL opens in a browser.
5. simplesamlphp#2688 may be closed in favor of a docs change; update `oss.json` if so.
