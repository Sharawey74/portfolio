# Lighthouse, review round 1 (mobile, applied throttling)

Lighthouse 12, `--throttling-method=devtools` (mobile emulation, 4x CPU slowdown, slow 4G), production build served locally by `npm start` (`portfolio-prod`), 3 runs per page, 2026-10-08, at the end of review round 1 (`feat/owner-review-1`), on mains power. Stage 5 medians for comparison: LCP `/` 2.11 s, Eventora 2.79 s, Recruiter-Pro 2.27 s, SysPlex 2.45 s; TBT 695–989 ms; CLS 0.001 (`lighthouse-stage5.md`). Median of the 3 runs per metric. Localhost has no CDN; Vercel numbers will differ.

| Page | Run | Perf | A11y | Best pr. | SEO | LCP | TBT | CLS | FCP | CPU bench |
|---|---|---|---|---|---|---|---|---|---|---|
| home | 1 | 66 | 100 | 100 | 100 | 2.43 s | 1421 ms | 0.001 | 2.43 s | 2908 |
| home | 2 | 66 | 100 | 100 | 100 | 2.42 s | 1508 ms | 0.001 | 2.42 s | 2507 |
| home | 3 | 63 | 100 | 100 | 100 | 2.64 s | 1700 ms | 0.001 | 2.64 s | 2586 |
| eventora | 1 | 65 | 100 | 100 | 100 | 2.91 s | 1224 ms | 0.001 | 2.39 s | 2408 |
| eventora | 2 | 64 | 100 | 100 | 100 | 2.86 s | 1412 ms | 0.001 | 2.51 s | 2655 |
| eventora | 3 | 67 | 100 | 100 | 100 | 2.88 s | 1100 ms | 0.001 | 2.43 s | 2650 |
| recruiter-pro | 1 | 65 | 100 | 100 | 100 | 3.13 s | 1120 ms | 0.001 | 2.45 s | 2354 |
| recruiter-pro | 2 | 61 | 100 | 100 | 100 | 3.28 s | 1358 ms | 0.001 | 2.56 s | 2570 |
| recruiter-pro | 3 | 62 | 100 | 100 | 100 | 3.41 s | 1104 ms | 0.001 | 2.49 s | 2558 |
| sysplex | 1 | 66 | 100 | 100 | 100 | 2.74 s | 1101 ms | 0.001 | 2.74 s | 2212 |
| sysplex | 2 | 69 | 100 | 100 | 100 | 2.51 s | 1034 ms | 0.001 | 2.51 s | 2277 |
| sysplex | 3 | 68 | 100 | 100 | 100 | 2.65 s | 1079 ms | 0.001 | 2.65 s | 2510 |

## Medians

| Page | Perf | A11y | Best pr. | SEO | LCP (< 2.5 s) | TBT (< 200 ms) | CLS (< 0.05) |
|---|---|---|---|---|---|---|---|
| home | 66 | 100 | 100 | 100 | 2.43 s (pass) | 1508 ms (over) | 0.001 (pass) |
| eventora | 65 | 100 | 100 | 100 | 2.88 s (over) | 1224 ms (over) | 0.001 (pass) |
| recruiter-pro | 62 | 100 | 100 | 100 | 3.28 s (over) | 1120 ms (over) | 0.001 (pass) |
| sysplex | 68 | 100 | 100 | 100 | 2.65 s (over) | 1079 ms (over) | 0.001 (pass) |

Full reports (the median-LCP run per page): `lighthouse-review1-<page>.json`; open one in https://googlechrome.github.io/lighthouse/viewer/.

## Validity and the image A/B

All 12 runs above read a CPU benchmark of 2,212–2,908 (Stage 5 valid runs: 1,500–2,400), with the laptop on mains power and the browser pane closed. A first set, taken while other work ran, read 872–2,919 and was discarded.

| Variant (case-study hero / carousel) | `/` LCP · TBT | Eventora | Recruiter-Pro | SysPlex |
|---|---|---|---|---|
| Stage 5 (q75 / q75 + grayscale filter) | 2.11 s · 989 ms | 2.79 s · 911 ms | 2.27 s · 717 ms (no screenshots, text LCP) | 2.45 s · 695 ms |
| q90 / originals (`unoptimized`) | 2.35 s · 1,925 ms | 3.24 s · 1,790 ms | 3.41 s · 1,427 ms | 2.37 s · 1,076 ms |
| **q75 / q90 resized (kept)** | **2.43 s · 1,508 ms** | **2.88 s · 1,224 ms** | **3.28 s · 1,120 ms** | **2.65 s · 1,079 ms** |

Kept: the case-study hero stays on the optimizer's default (it is the LCP element); carousel screenshots are resized at quality 90 with `sizes` matching the card column. Serving the 1440 px originals to phones cost up to 0.4 s of LCP and about 0.4–0.6 s of TBT on `/` (more bytes competing on slow 4G push "interactive" later, so more existing tasks count).

Still worse than Stage 5: TBT on every page (+300 to +500 ms) and Recruiter-Pro LCP (its case study now opens with a screenshot, as Eventora's does). Tracked as `docs/ISSUES.md` ISS-36; per the owner's option C for ISS-01 / ISS-02, re-measured on a Vercel preview in Stage 6.
