# User acceptance test (UAT): manual review by the owner

This is the checklist **you** run by hand before each merge or launch. It covers
what automated checks and screenshots cannot prove: how the site feels, reads and
behaves with real devices, settings and assistive technology. Fill in the
**Result** column (Pass / Fail / Blocked) and the **Notes**; log every Fail in
the defect table at the end.

Automated gates (`npm run lint`, `typecheck`, `check`, `build`, `report:bundle`)
are not repeated here. The design-rule audit this script follows up on is
`docs/UX-REVIEW.md`; its "UAT" rows map to cases below.

## 1. Session record

| Field | Value |
|---|---|
| Tester | |
| Date | |
| Build | branch / commit (`git log -1 --oneline`) or Vercel preview URL |
| Scope | Stages covered (e.g. 1–3) |

## 2. How to run the site

Production build on your machine (closest to Vercel):

```powershell
Set-Location C:\Users\DELL\Desktop\portfolio-site; npm ci; npm run build; npm start
```

Open `http://localhost:3000`. To test on your phone over Wi-Fi, run
`npm start -- -H 0.0.0.0` instead and open `http://<your PC's IP>:3000` on the
phone (find the IP with `ipconfig`). Once Vercel is connected, every PR has a
preview URL; use that instead.

Start each run in a **private window** so the first-visit intro plays and no
saved theme or pause setting carries over.

## 3. Environments

Tick what you covered. A full launch review covers every row at least once.

| # | Environment | How to set it up | Covered |
|---|---|---|---|
| E1 | Desktop Chrome or Edge, 1280 px+ | normal window | [ ] |
| E2 | Desktop Firefox | normal window (exercises the CSS-fallback paths) | [ ] |
| E3 | Safari (Mac or iPhone) | if available | [ ] |
| E4 | Phone, portrait | real Android/iPhone, or DevTools device mode 375 × 812 | [ ] |
| E5 | Phone, landscape | rotate the phone, or DevTools 812 × 375 | [ ] |
| E6 | Light theme | header ○/● toggle, or OS light mode | [ ] |
| E7 | Reduced motion | Windows: Settings → Accessibility → Visual effects → Animation effects **Off**. Mac: Accessibility → Display → Reduce motion. Or DevTools → Rendering → `prefers-reduced-motion: reduce` | [ ] |
| E8 | Keyboard only | unplug or ignore the mouse; Tab, Shift+Tab, Enter, Space, Esc | [ ] |
| E9 | Screen reader | Windows: NVDA (free, nvaccess.org) with Chrome/Edge. Mac/iPhone: VoiceOver | [ ] |
| E10 | 200 % zoom | Ctrl + `+` to 200 % on desktop | [ ] |
| E11 | JavaScript off | DevTools → Ctrl+Shift+P → "Disable JavaScript", reload | [ ] |

## 4. Test cases

### Content and honesty (highest priority)

| ID | Steps | Expected | Result | Notes |
|---|---|---|---|---|
| UAT-01 | Read every visible sentence on `/` and the three case studies | Nothing you would not say in an interview. No banned words, no exclamation marks, no emoji. Nothing private (see `CLAUDE.local.md`) | | |
| UAT-02 | On a case study, click 5 different "Source · … ↗" links | Each opens GitHub at the cited file and lines, and those lines support the claim | | |
| UAT-03 | Check the numbers you know best (tests, coverage, VUs, latency) | Match what you would quote; qualifiers present ("local, Docker Compose", "read path", "self-run") | | |
| UAT-13 | Look at the Eventora screenshots in the gallery | They are your app, current, and nothing in them should not be public | | |

### Navigation

| ID | Steps | Expected | Result | Notes |
|---|---|---|---|---|
| UAT-04 | On `/`, open a case study from its card, then press the browser **Back** button | Returns to `/` at the Work section (not the top), page works normally | | |
| UAT-14 | On a case study, click "02 Work" in the header, then "← 02 / All work" | Both go to the Work section on `/` | | |
| UAT-15 | On `/`, scroll down slowly, then up | Header hides on the way down, returns on the way up; scroll-spy dot marks "Work" while it is on screen | | |
| UAT-16 | Click "View My Work" in the hero | Glides to the Work section; heading not hidden under the header | | |

### Motion and interaction (E1, then repeat key rows in E7)

| ID | Steps | Expected | Result | Notes |
|---|---|---|---|---|
| UAT-17 | First visit in a private window | Intro: counter 000→100, panel lifts within ~2 s. Reload: no intro | | |
| UAT-18 | Move the mouse over the hero headline | Words nearest the cursor get slightly bolder; the line never jumps or rewraps | | |
| UAT-19 | Hover a project card | Faint grid spotlight follows the cursor; card tilts slightly (≤ 4°); cursor ring shows "View" | | |
| UAT-20 | Eventora card: wait, then hover the screenshot, then use ← → | Auto-advances every ~4.5 s; stops while hovered; arrows change slides; counter updates | | |
| UAT-21 | Scroll through the three featured cards | Each card sticks, then shrinks and dims as the next slides over it | | |
| UAT-11 | Click "Case study" on a card (Chrome/Edge/Safari) | Title (and Eventora image) morph into the case-study page; focus lands on the title | | |
| UAT-22 | Eventora diagram: watch, then Pause, Step, Restart, "Sold out", "Follow scroll" | Red dot travels the steps in order; the → marker tracks the step list; Pause stops it; Step advances one; Sold out shows the 409 path; Follow scroll ties progress to scrolling | | |
| UAT-23 | Header "Pause animations" | Canvas, carousel, marquee and diagram stop; button reads "Play animations"; setting survives a reload | | |
| UAT-12 | In the Work section, count things moving at once without you scrolling | No more than 3 moving regions in view; nothing feels busy or distracting | | |
| UAT-24 | Theme toggle in both directions | Circle reveal from the button; all text readable in light mode; charts and diagrams visible in both | | |
| UAT-05 | Repeat UAT-17 to UAT-23 with reduced motion on (E7) | No intro, no tilt, no autoplay, no custom cursor; headings static; diagram shows the full static state; everything still readable and usable | | |

### Accessibility

| ID | Steps | Expected | Result | Notes |
|---|---|---|---|---|
| UAT-07 | Keyboard only (E8): Tab from page load through `/`, then a case study | First Tab shows "Skip to content". Every control reachable in visual order; focus ring always visible and never hidden under the header or another card; Esc closes the zoom view | | |
| UAT-08 | Screen reader (E9): headings list (NVDA: Insert+F7) and a read-through of a case study | One H1 per page; section headings in order; split headings read as whole sentences; charts announced with their caption; diagram steps read as a list | | |
| UAT-09 | 200 % zoom (E10) | No text cut off or overlapping; no sideways scrolling of the page (diagram and charts may scroll in their own boxes) | | |
| UAT-25 | JavaScript off (E11) | All text, numbers, links and the static diagram visible; nothing stuck hidden | | |

### Layout

| ID | Steps | Expected | Result | Notes |
|---|---|---|---|---|
| UAT-26 | Phone portrait (E4): every page | No sideways scrolling; text readable without zoom; buttons easy to tap | | |
| UAT-10 | Phone landscape (E5): `/` and one case study | Hero, cards and diagram usable; nothing hidden behind the header | | |
| UAT-27 | Firefox (E2): `/` | Stack cards still recede on scroll (fallback path); nothing broken | | |

## 5. Defect log

| # | Case | Environment | What happened | Severity (High / Med / Low) | Screenshot | Status |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |

Severity guide: **High** = wrong or private content, broken navigation,
something unusable by keyboard or screen reader. **Med** = visible layout or
motion problem. **Low** = polish.

## 6. Sign-off

| | |
|---|---|
| All High defects fixed and re-tested | [ ] |
| Medium defects fixed or accepted (list) | |
| Approved for merge / launch | [ ] yes · [ ] no |
| Signature / date | |

## 7. History

| Date | Build | Tester | Result | Notes |
|---|---|---|---|---|
| | | | | |
