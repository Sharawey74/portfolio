# Lighthouse, Stage 5 (mobile, applied throttling)

Lighthouse 12, `--throttling-method=devtools` (mobile emulation, 4x CPU slowdown, slow 4G), production build served locally by `npm start` (`portfolio-prod`), 3 runs per page, 2026-10-07. Median of the 3 runs per metric. Localhost has no CDN; Vercel numbers will differ.

| Page | Run | Perf | A11y | Best pr. | SEO | LCP | TBT | CLS | FCP |
|---|---|---|---|---|---|---|---|---|---|
| home | 1 | 69 | 100 | 100 | 100 | 2.23 s | 1164 ms | 0.001 | 2.23 s |
| home | 2 | 68 | 100 | 100 | 100 | 2.52 s | 1070 ms | 0.001 | 2.52 s |
| home | 3 | 52 | 100 | 100 | 100 | 3.68 s | 3319 ms | 0.001 | 2.46 s |
| eventora | 1 | 59 | 100 | 100 | 100 | 2.81 s | 2135 ms | 0.001 | 2.81 s |
| eventora | 2 | 50 | 100 | 100 | 100 | 4.00 s | 2043 ms | 0.001 | 2.82 s |
| eventora | 3 | 69 | 100 | 100 | 100 | 2.58 s | 1097 ms | 0.001 | 2.35 s |
| recruiter-pro | 1 | 65 | 100 | 100 | 100 | 2.59 s | 1518 ms | 0.001 | 2.59 s |
| recruiter-pro | 2 | 65 | 100 | 100 | 100 | 2.56 s | 1456 ms | 0.001 | 2.56 s |
| recruiter-pro | 3 | 64 | 100 | 100 | 100 | 2.60 s | 1588 ms | 0.001 | 2.60 s |
| sysplex | 1 | 62 | 100 | 100 | 100 | 2.87 s | 1451 ms | 0.001 | 2.87 s |
| sysplex | 2 | 64 | 100 | 100 | 100 | 2.83 s | 1235 ms | 0.001 | 2.83 s |
| sysplex | 3 | 62 | 100 | 100 | 100 | 2.76 s | 1606 ms | 0.001 | 2.76 s |

## Medians

| Page | Perf | A11y | Best pr. | SEO | LCP (< 2.5 s) | TBT (< 200 ms) | CLS (< 0.05) |
|---|---|---|---|---|---|---|---|
| home | 68 | 100 | 100 | 100 | 2.52 s (over) | 1164 ms (over) | 0.001 (pass) |
| eventora | 59 | 100 | 100 | 100 | 2.81 s (over) | 2043 ms (over) | 0.001 (pass) |
| recruiter-pro | 65 | 100 | 100 | 100 | 2.59 s (over) | 1518 ms (over) | 0.001 (pass) |
| sysplex | 62 | 100 | 100 | 100 | 2.83 s (over) | 1451 ms (over) | 0.001 (pass) |

Full reports (the median-LCP run per page): `lighthouse-stage5-<page>.json`; open one in https://googlechrome.github.io/lighthouse/viewer/.

## Validity

Every run recorded Lighthouse's CPU benchmark (`environment.benchmarkIndex`): 2,099–3,325, on mains power. An earlier set of 12 runs on battery (benchmark 512–671) was discarded.

## What blocks the main thread (home, run 1)

| Cost | Time |
|---|---|
| Script evaluation | 2,825 ms, of which the layout's client code (Lenis, palette, scramble host, cursor; one 14 KB chunk) 2,055 ms and React DOM 583 ms |
| Style and layout | 1,819 ms |
| Rendering | 727 ms |
| Long tasks over 50 ms | 10; the two largest (609 ms, 582 ms) run during hydration, 1.6–2.9 s after navigation start |

No third-party scripts. CLS is 0.001 on every page, and accessibility, best practices and SEO are 100 on every run.
