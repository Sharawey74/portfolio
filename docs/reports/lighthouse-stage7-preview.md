# Lighthouse, Stage 7 preview (Vercel, simulated throttling)

Lighthouse CI (`lighthouse.yml`) on the Vercel preview of pull request #20 (`feat/stage7-redesign` at `88ff24e`, the Stage 7 redesign up to 7.6), 3 runs per page, 2026-10-10 18:22 UTC. Mobile emulation with Lighthouse's default simulated throttling. Reports: the workflow artifact `lighthouse-88ff24e…` (HTML and JSON per run). Before Stage 7 (2026-10-09 preview): LCP medians 2.87–3.63 s, TBT 81–138 ms, CLS 0.001 (`docs/ISSUES.md` ISS-36).

SEO reads 58–61 on every preview: Vercel serves preview deployments with `x-robots-tag: noindex`, so the "page is blocked from indexing" audit fails by design. Production is indexable.

| Page | Run | Perf | A11y | Best pr. | SEO | LCP | TBT | CLS | FCP | CPU bench |
|---|---|---|---|---|---|---|---|---|---|---|
| home | 1 | 75 | 100 | 100 | 61 | 3.24 s | 613 ms | 0.002 | 1.73 s | 2766 |
| home | 2 | 94 | 100 | 100 | 61 | 3.00 s | 78 ms | 0.002 | 1.11 s | 3494 |
| home | 3 | 93 | 100 | 100 | 61 | 3.14 s | 62 ms | 0.002 | 1.57 s | 3590 |
| eventora | 1 | 84 | 100 | 100 | 61 | 4.08 s | 62 ms | 0.004 | 1.43 s | 3474 |
| eventora | 2 | 94 | 100 | 100 | 61 | 2.93 s | 30 ms | 0.002 | 1.46 s | 3613 |
| eventora | 3 | 95 | 100 | 100 | 61 | 2.84 s | 25 ms | 0.002 | 1.13 s | 3454 |
| recruiter-pro | 1 | 85 | 100 | 100 | 61 | 3.97 s | 31 ms | 0.004 | 1.46 s | 3430 |
| recruiter-pro | 2 | 95 | 100 | 100 | 61 | 2.88 s | 40 ms | 0.002 | 1.09 s | 3479 |
| recruiter-pro | 3 | 93 | 100 | 100 | 61 | 3.03 s | 26 ms | 0.002 | 1.50 s | 3444 |
| sysplex | 1 | 86 | 100 | 100 | 58 | 3.85 s | 43 ms | 0.011 | 1.41 s | 3486 |
| sysplex | 2 | 86 | 100 | 100 | 58 | 3.79 s | 68 ms | 0.002 | 1.44 s | 3220 |
| sysplex | 3 | 97 | 100 | 100 | 58 | 2.52 s | 46 ms | 0.005 | 1.06 s | 3640 |

## Medians

| Page | Perf | A11y | Best pr. | LCP (< 2.5 s) | TBT (< 200 ms) | CLS (< 0.05) |
|---|---|---|---|---|---|---|
| home | 93 | 100 | 100 | 3.14 s (over) | 78 ms (pass) | 0.002 (pass) |
| eventora | 94 | 100 | 100 | 2.93 s (over) | 30 ms (pass) | 0.002 (pass) |
| recruiter-pro | 93 | 100 | 100 | 3.03 s (over) | 31 ms (pass) | 0.002 (pass) |
| sysplex | 86 | 100 | 100 | 3.79 s (over) | 46 ms (pass) | 0.005 (pass) |

Reading: the redesign kept TBT and CLS within budget (TBT down from 81–138 ms) and LCP in the same band as before (simulated, driven by the bytes before first paint, ISS-36). The late-font layout shift seen once locally (ISS-44) did not appear in 12 preview runs (worst 0.011). LCP is judged on Speed Insights' field p75 (ISS-36).
