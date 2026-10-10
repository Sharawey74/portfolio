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

### Review round 1: new cases

| ID | Steps | Expected | Result | Notes |
|---|---|---|---|---|
| UAT-49 | Read the hero as a recruiter would | Label "Software engineer", your name as the headline (the final period in crimson), then your two paragraphs exactly as approved on 2026-10-08; nothing you would not defend in an interview | | |
| UAT-50 | Look at the whole site in both themes after the palette, radius and font changes (ISS-21 to ISS-23) | Colors feel like one family (black, white, grays and the crimson tones); buttons have the chosen rounding; nav, footer and stack captions use the chosen face; text stays readable everywhere | | |
| UAT-51 | Open `/` and a case study at 100% browser zoom on your laptop (and at 1366×768, 1536×864 if you can) | Everything fits without zooming out: the hero headline and buttons are visible on the first screen, a project card fits on one screen, no text overlaps | | |
| UAT-52 | With a mouse, move the pointer over plain text, then over a project card's "Case study" link | Over plain text: a small dot and ring, no word next to it (the old "ON" label is gone). Over the case-study link: the ring grows and reads "View" | | |
| UAT-53 | Reload `/` at the top; press End (or drag the scrollbar to the bottom); press Home; then open `/#open-source` in a new tab | Header: nothing marked at the top; "05 Contact" marked at the bottom; nothing marked again at the top; "03 Open source" marked in the new tab | | |
| UAT-54 | Look at the Work cards and case-study galleries for Eventora and Recruiter-Pro; step through each carousel; open one screenshot full size | Screenshots in full color and sharp (small UI text readable); Recruiter-Pro shows 4 real app screens (dashboard, job market, job detail, upload), none with your own resume | | |
| UAT-55 | Look at Contact, the footer and the header controls in both themes | Contact sits on a deep crimson band (pale rose in light); email, GitHub and LinkedIn show their icons next to the text; header "Search"/"Menu", pause and theme controls get a crimson pill on hover | | Superseded by UAT-56 to UAT-58 (Stage 7) for the header and footer |
| UAT-56 | Stage 7 foundation. Load `/` in dark, then light; scroll a little | Black page (white in light). The header is not a bar: the page fades in behind it. Wordmark "Abdelrhman Mohamed." in the serif, period red. Right side: Search, the pause switch, the theme button and a white "Contact →" pill (black in light) that lifts on hover and jumps to Contact | | |
| UAT-57 | Click "Pause animations"; click it again. Click the theme button twice | The switch knob slides right and the track turns red; looping motion stops; clicking again restores both. The theme button's half-filled disc turns half a circle each time, and the theme changes | | |
| UAT-58 | Scroll to the footer; hover GitHub, LinkedIn and Email; scroll through the sections and watch the header links | Footer: name with a red period and the license line; "Sections" and "Elsewhere" columns; each icon lifts and turns red on hover, arrows nudge. The current section's header link shows a red dot on a neutral pill with a thin edge (no crimson fill). Section titles ("About", "Work"…) are in the new sans with a soft white-to-grey fade | | |
| UAT-59 | Stage 7 hero. Open `/` in a new tab (first visit plays the counter intro; reload for the hero alone). Watch the first two seconds on a laptop | A pill "8 merged pull requests across 6 open-source projects →" with a red dot and a red arc circling its edge; "Software engineer"; the name's two words blur into focus one after the other, with a red period; the paragraphs and buttons fade up; on the right (1024 px and wider) a red light with rays and two slow rings; below, four figures count up: 0, 569,066, 660 req/s, 228, each with its label and "Eventora · local, Docker Compose…" line | | |
| UAT-60 | Click the pill. Then turn "Pause animations" on and reload; then turn reduced motion on in the OS and reload | The pill jumps to Open source, whose merged count matches the pill. With pause on, the arc and the light stand still but the name and text still appear. With reduced motion, nothing moves and all text and numbers show at once | | |
| UAT-61 | Resize the window from 1600 px down to 1024 px | Header stays on one line: from 1536 px the links show their numbers and the switch its label; at 1280 px the links remain, without numbers; below 1280 px they give way to "Menu" | | |

## 5. Defect log

Entries 1 to 23 are the owner's review, round 1 (2026-10-08), transcribed from the owner's notes and screenshots. Results in the case tables above are still the owner's to record.

| # | Case | Environment | What happened | Severity (High / Med / Low) | Screenshot | Status |
|---|---|---|---|---|---|---|
| 1 | UAT-01, UAT-49 | E1, owner's laptop, 100% zoom, 2026-10-08 | Hero headline reads as a plain sentence; should present a software engineer more professionally | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-12 |
| 2 | UAT-01 | E1, owner's laptop, 100% zoom, 2026-10-08 | Remove "Software Engineering student at AASTMT (Jun 2027)" from the hero | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-13 |
| 3 | UAT-01 | E1, owner's laptop, 100% zoom, 2026-10-08 | Name should read "Abdelrhman Mohamed" | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-14 |
| 4 | UAT-32, UAT-39 | E1, owner's laptop, 100% zoom, 2026-10-08 | Contact has no email; add abdelrhmanhamied004@gmail.com | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-15 |
| 5 | UAT-28, UAT-29 | E1, owner's laptop, 100% zoom, 2026-10-08 | Open source: mage #16440 is merged now; the merged count is out of date | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-16 |
| 6 | UAT-29 | E1, owner's laptop, 100% zoom, 2026-10-08 | Show every issue filed, open and closed | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-17 |
| 7 | UAT-03 | E1, owner's laptop, 100% zoom, 2026-10-08 | Some project metrics are out of date against the repos' READMEs | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-18 |
| 8 | UAT-28 | E1, owner's laptop, 100% zoom, 2026-10-08 | Alstom internship missing (to add later) | Med | owner's review screenshots | Open, `docs/ISSUES.md` ISS-19 |
| 9 | UAT-28 | E1, owner's laptop, 100% zoom, 2026-10-08 | Claude certificates missing, as one entry (to add later) | Low | owner's review screenshots | Open, `docs/ISSUES.md` ISS-20 |
| 10 | UAT-24, UAT-50 | E1, owner's laptop, 100% zoom, 2026-10-08 | Too uniformly dark; wants a heavy crimson secondary color and one harmonized palette | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-21 |
| 11 | UAT-45, UAT-50 | E1, owner's laptop, 100% zoom, 2026-10-08 | Buttons should be rounded | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-22 |
| 12 | UAT-50 | E1, owner's laptop, 100% zoom, 2026-10-08 | Nav bar, footer and stack captions should use Arial | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-23 |
| 13 | UAT-32, UAT-39 | E1, owner's laptop, 100% zoom, 2026-10-08 | GitHub and LinkedIn should show as icons | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-24 |
| 14 | UAT-13, UAT-20 | E1, owner's laptop, 100% zoom, 2026-10-08 | Work screenshots should be in color, several per project (Eventora, Recruiter-Pro from their GitHub Pages) | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-25 |
| 15 | UAT-20 | E1, owner's laptop, 100% zoom, 2026-10-08 | Work card slides look blurred | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-26 |
| 16 | UAT-22, UAT-42 | E1, owner's laptop, 100% zoom, 2026-10-08 | SysPlex diagram looks weak | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-27 |
| 17 | UAT-09, UAT-26, UAT-51 | E1, owner's laptop, 100% zoom, 2026-10-08 | Looks right only at 67-75% browser zoom | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-28 |
| 18 | UAT-26 | E1, owner's laptop, 100% zoom, 2026-10-08 | "Also built": project names overlap their descriptions | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-29 |
| 19 | UAT-28, UAT-42 | E1, owner's laptop, 100% zoom, 2026-10-08 | "Stack, by where it was used" looks cramped and mixed | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-30 |
| 20 | UAT-21, UAT-26 | E1, owner's laptop, 100% zoom, 2026-10-08 | Next stacked card covers the previous card's numbers | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-31 |
| 21 | UAT-45, UAT-19 | E1, owner's laptop, 100% zoom, 2026-10-08 | Buttons and CTAs should feel more responsive | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-32 |
| 22 | UAT-19 | E1, owner's laptop, 100% zoom, 2026-10-08 | Cursor shows an "ON" label everywhere (seen in the screenshots) | High | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-33 |
| 23 | UAT-15 | E1, owner's laptop, 100% zoom, 2026-10-08 | Header marks "05 Contact" as current at the top of the page (seen in the screenshots) | Med | owner's review screenshots | Fixed on `feat/owner-review-1` (2026-10-08), owner to retest; `docs/ISSUES.md` ISS-34 |
| 24 | | | | | | |

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
