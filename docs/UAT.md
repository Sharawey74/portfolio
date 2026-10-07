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
| Scope | Stages covered (e.g. 1–5) |

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
| UAT-23 | Header "Pause animations" | Canvas, carousel and diagram stop; button reads "Play animations"; setting survives a reload | | |
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

### Stage 4: sections, palette, contact, SEO

| ID | Steps | Expected | Result | Notes |
|---|---|---|---|---|
| UAT-28 | Read About, Open source and Experience | Every number matches what you would say (7 merged across 5 projects, 4 under review, 2 internships, 228 tests); hover a number on desktop to see its source; no dates on certificates | | |
| UAT-29 | Open source: click three PR links and two "Fixes #n" links | Each opens the right PR or issue on GitHub; merged/open status matches GitHub today; the line under the numbers says "refreshed daily" (or the snapshot date if GitHub was unreachable at build) | | |
| UAT-30 | Press Ctrl+K (⌘K on a Mac), type "litestar", press Enter; reopen, type "experience", Enter; reopen, run "Switch theme" and "Pause animations" | Palette opens with the cursor in the search field; ↑ ↓ move the highlighted row; Enter opens the PR, jumps to Experience (heading not under the header), switches theme, pauses animations; Esc and a click outside close it; focus returns to where you were | | |
| UAT-31 | Phone (E4): tap "Menu" in the header, pick each section; also scroll the whole home page and tap things | Menu opens the palette with sections first; each choice lands on its section; scrolling and taps feel immediate (note any delay over a blink, with the phone model) | | |
| UAT-32 | Contact without the Resend variables (local build or a preview without them) | The form is replaced by "The form is not connected on this deployment …"; GitHub and LinkedIn links work | | |
| UAT-33 | Contact with the variables set (Vercel): submit empty, then a bad email and a 5-letter message, then a real message to yourself | Empty: the browser points at the first field; bad values: fields get a dashed underline, the status says "Check the highlighted fields.", typed text stays; real message: "Sent. I will reply by email." and the email arrives with Reply-To set to the address you typed | | |
| UAT-34 | Keyboard only (E8) through the contact form and the palette | Labels read with each field; "(required)" announced; errors announced by the status line; nothing reachable that is invisible (the hidden honeypot field is never focused) | | |
| UAT-35 | Hover or Tab onto header and footer links (fine pointer, motion on) | Mono labels scramble briefly (under half a second) and settle on the real text; the screen reader reads the real text only; no jitter in width | | |
| UAT-36 | Scroll slowly from the top of `/` | A faint hairline grid behind the hero fades out over the first screen; a very light film grain over everything; neither makes text harder to read in either theme | | |
| UAT-37 | Paste the production URL and a case-study URL into a link preview (LinkedIn post composer, Slack or opengraph.xyz) | Black card with the headline (red final period) or the project summary; title and description correct; no placeholder text | | |
| UAT-38 | Open `/sitemap.xml` and `/robots.txt` on the production URL | Sitemap lists `/` and the three case studies on the real domain; robots disallows `/dev/` and points at the sitemap | | |
| UAT-39 | Footer: every link, plus "Back to top" | Section links work from a case-study page too; GitHub and LinkedIn open; "Search and commands" opens the palette; "Back to top" returns to the top | | |
| UAT-40 | Fill one personal field (e.g. `location`) locally, rebuild | It appears in the About bento and nowhere it should not; removing it removes the cell (no empty box) | | |

### Stage 5: polish and motion

| ID | Steps | Expected | Result | Notes |
|---|---|---|---|---|
| UAT-41 | Resize a desktop window from wide to about 800 px, or use a tablet | From 1024 px up the header shows the five section links on one row; below that it shows "Menu", which opens the palette with sections first; the header never grows a second row | | |
| UAT-42 | On `/`, scroll through Work at desktop and phone width | Card titles stay on one line ("Recruiter-Pro" included); no tech-chip strip under the cards (the stack is in About only); on a phone the two diagram-only cards show no tiny diagram | | |
| UAT-43 | Open each case study | One heading size for every section (Problem, Architecture, Key decisions, Evidence, Screenshots, Stack, Limits); only the project name is huge | | |
| UAT-44 | Case study on a phone or a window under 1024 px | Under the diagram a line reads "Scroll sideways for the full diagram."; the step list reads cleanly, with "(availableCount -= n)" on one line | | |
| UAT-45 | Press and hold any button, palette option, contact link or "Case study" link | It drops by about 1 px while pressed and returns on release; disabled controls (Resume before the PDF exists) do not move and show a not-allowed cursor | | |
| UAT-46 | First visit in a private window (motion on) | The intro counts 000→100, holds briefly, then lifts, in about 1.5 s; numbers count up in under a second; mono labels scramble for under half a second | | |
| UAT-47 | Optional, only if you want to try M15: build with `NEXT_PUBLIC_ENABLE_SHADER=1` on a desktop with a dedicated or recent GPU | Gray contour lines drift slowly behind the headline instead of the node graph; Pause stops them; theme switch recolors them; with the flag unset (default) the node graph shows as before | | |
| UAT-48 | Open `/` on a phone, then on a desktop with a mouse | Phone: the node graph behind the headline is still (no moving red packet); desktop: the graph drifts, leans toward the mouse and the packet moves. Decide whether the still graph on phones is acceptable (it saves about 0.9 s of main-thread work there) | | |

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
