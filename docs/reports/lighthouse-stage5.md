# Lighthouse, Stage 5 (mobile, applied throttling)

Lighthouse 12, `--throttling-method=devtools` (mobile emulation, 4x CPU slowdown, slow 4G), production build served locally by `npm start` (`portfolio-prod`), 3 runs per page, 2026-10-08, after the performance pass. Median of the 3 runs per metric. Localhost has no CDN; Vercel numbers will differ.

| Page | Run | Perf | A11y | Best pr. | SEO | LCP | TBT | CLS | FCP |
|---|---|---|---|---|---|---|---|---|---|
| home | 1 | 71 | 100 | 100 | 100 | 2.40 s | 989 ms | 0.001 | 2.40 s |
| home | 2 | 68 | 100 | 100 | 100 | 1.90 s | 1433 ms | 0.079 | 1.90 s |
| home | 3 | 74 | 100 | 100 | 100 | 2.11 s | 903 ms | 0.001 | 2.11 s |
| eventora | 1 | 71 | 100 | 100 | 100 | 2.37 s | 956 ms | 0.001 | 2.37 s |
| eventora | 2 | 71 | 100 | 100 | 100 | 2.88 s | 781 ms | 0.001 | 2.42 s |
| eventora | 3 | 70 | 100 | 100 | 100 | 2.79 s | 911 ms | 0.001 | 2.27 s |
| recruiter-pro | 1 | 77 | 100 | 100 | 100 | 2.21 s | 717 ms | 0.001 | 2.21 s |
| recruiter-pro | 2 | 73 | 100 | 100 | 100 | 2.43 s | 800 ms | 0.001 | 2.43 s |
| recruiter-pro | 3 | 78 | 100 | 100 | 100 | 2.27 s | 671 ms | 0.001 | 2.27 s |
| sysplex | 1 | 80 | 100 | 100 | 100 | 2.35 s | 548 ms | 0.001 | 2.35 s |
| sysplex | 2 | 73 | 100 | 100 | 100 | 2.46 s | 844 ms | 0.001 | 2.46 s |
| sysplex | 3 | 76 | 100 | 100 | 100 | 2.45 s | 695 ms | 0.001 | 2.45 s |

## Medians

| Page | Perf | A11y | Best pr. | SEO | LCP (< 2.5 s) | TBT (< 200 ms) | CLS (< 0.05) |
|---|---|---|---|---|---|---|---|
| home | 71 | 100 | 100 | 100 | 2.11 s (pass) | 989 ms (over) | 0.001 (pass) |
| eventora | 71 | 100 | 100 | 100 | 2.79 s (over) | 911 ms (over) | 0.001 (pass) |
| recruiter-pro | 77 | 100 | 100 | 100 | 2.27 s (pass) | 717 ms (over) | 0.001 (pass) |
| sysplex | 76 | 100 | 100 | 100 | 2.45 s (pass) | 695 ms (over) | 0.001 (pass) |

Full reports (the median-LCP run per page): `lighthouse-stage5-<page>.json`; open one in https://googlechrome.github.io/lighthouse/viewer/.

## Validity

Every run recorded Lighthouse's CPU benchmark (`environment.benchmarkIndex`): 2,732–3,182, on mains power. An earlier set on battery (benchmark 512–671) was discarded.

## Performance pass (2026-10-08)

Medians before the pass (2026-10-07, same method, benchmark 2,099–3,325) and after:

| Page | LCP before → after | TBT before → after | Perf before → after |
|---|---|---|---|
| `/` | 2.52 → 2.11 s | 1,164 → 989 ms | 68 → 71 |
| `/projects/eventora` | 2.81 → 2.79 s | 2,043 → 911 ms | 59 → 71 |
| `/projects/recruiter-pro` | 2.59 → 2.27 s | 1,518 → 717 ms | 65 → 77 |
| `/projects/sysplex` | 2.83 → 2.45 s | 1,451 → 695 ms | 62 → 76 |

What changed, each measured before it was kept:

1. Film grain drawn from a 16 KB pre-rendered grayscale PNG tile instead of an SVG `feTurbulence` filter (the filter version was the second-largest source of long tasks).
2. On coarse pointers the hero keeps its static graph; the live canvas (about 0.9 s of main thread at 4x CPU) loads only with a fine pointer.
3. Newsreader loads the normal style only: the unused italic face was a second variable font file (about 140 KB) preloaded ahead of the LCP image.

Tried and rejected: `content-visibility: auto` on below-the-fold sections (layout still touched all 1,727 objects and took about twice as long, likely because of the scroll-linked animations), and `text-wrap: wrap` instead of `pretty` / `balance` (no change).

Still over: Eventora LCP 2.79 s (the HTML takes 0.7 s on slow 4G, the hero image then shares the connection with 207 KB of fonts, 132 KB of it Newsreader with its `opsz` axis, and waits about 0.8 s for the main thread), and TBT 695–989 ms on every page (the browser's first style and layout pass over the page, about 0.45 s at 4x CPU, plus React hydration).
