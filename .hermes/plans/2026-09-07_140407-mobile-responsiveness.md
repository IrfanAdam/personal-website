# Mobile Responsiveness Implementation Plan

**Tags:** Layout

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Make the entire personal_website fully responsive on mobile (320px–900px) with a fixed, horizontally-scrollable header; audit and polish every breakpoint, interaction, and page without desktop regression.

**Architecture:** Pure CSS responsive layering (mobile-first refinement over existing desktop CSS) + minimal JS adjustments for header fixed offset, strip scroll snap, and parallax disable on narrow viewports. No framework, no new dependencies. DRY via `tokens.css`/CSS custom properties.

**Tech Stack:** Vite 5, vanilla JS (ESM), CSS (base.css / masonry.css / pages.css / tokens.css), `marked` for prose. Verification via `npm run build` + manual viewport testing (Chrome DevTools + real device via `vite --host`).

---

## 0) Current Context & Assumptions

### Repo
- Root: `personal_website/` — `index.html` → `src/main.js` → `#hash` router (`#/masonry`, `#/projects/:slug`, `#/contact`)
- Styles: `src/styles/tokens.css`, `base.css`, `masonry.css`, `pages.css` (all <120 LOC each — line-limit 100 rule applies; refactor via extraction if expanded)
- Views: `src/views/masonry.js` (grid 4 cols / list), `project.js` (case-grid 50/50 since last change), `contact.js` (same case-grid), `shared.js` (footer, strip thumb strip), `headerFrame.js` (gliding `tab-frame`, `centerActiveThumb()`)
- Header: `index.html:<header class="top"><div id="stripbar">` — `.top` is `position:sticky; top:0` with hide-on-scroll (`header.classList.toggle('hide')` when `y>120 && y>lastY`). `stripbar` is flex row, `.strip` is `overflow-x:auto` thumb row.
- Masonry: `.cols { --cols:4 }` → `@media (max-width:900) 2 cols`, `.col: will-change:transform` parallax via `masonry/parallax.js`. Cards: absolute overlay tags/scrim/info (hover-only today).
- Case layout (just updated): `.case-grid {1fr 1fr; gap:0}` desktop, `1fr` at `≤800px`. `.wrap:has(> .case){padding-right:0}` desktop, restored at `≤800`.
- Tokens: only color tokens; no spacing/breakpoint tokens yet. Radii are all `0`.
- No test suite. Verify via `npm run build` and visual QA.

### Interpretation of ambiguous ask
> "i will need the header o be fixed and scrollable at the bottom no change in mobile"

Assumed meaning (confirmed in Open Questions):
- **A: Header `position:fixed`** (not `sticky`) — stays pinned to viewport top on scroll, no hide-on-scroll disappearance on mobile (or hide only on desktop). Content gets `padding-top` equal to header height.
- **B: Header strip is horizontally scrollable** (already `overflow-x:auto` but needs polish: `-webkit-overflow-scrolling:touch`, snap, fade edges, no scrollbar, keyboard/drag).
- **C: "at the bottom"** — possibly user means *the scrollable strip sits at the bottom edge of the fixed header*. Not a bottom-fixed navigation bar.
- **D: "no change in mobile"** — interpreted as: *don't restyle header visually for mobile beyond responsiveness* (same pill/strip design, just fits). Alternative interpretation (header fixed to bottom on mobile) is listed as variant B and needs user choice before Task 2.

### Current Gaps (audit)
1. **Header:** `sticky` hides on scroll down (jarring on mobile). `strip` scroll has no snap, no fade, no safe-area handling. `.stripbar` padding 8x16 may be too tight on 320px. `touch` target thumb is `56px` but spacing is cramped with `gap:8`.
2. **Breakpoints are inconsistent:** `900px` (masonry 4→2), `800px` (case 50/50→stack), `640px` (hide hint). No `480px` or `360px` tweaks. Tablet 768–900 awkward.
3. **Masonry mobile:** 2 cols at `≤900` persists down to `≤640`; then `gap:10` only. At 375px, 2 cols are too narrow; cards overlay text is 13.5px, hover-only info is invisible on touch (user must tap, but `:hover` never fires). Parallax `translate3d` runs on mobile where columns are 2 — causes jank and misalignment.
4. **List view:** `.work` is `display:flex; flex-wrap:wrap` — no mobile stacking, small tap target (`padding 12x4`), meta wraps awkwardly.
5. **Case/contact pages:** 50/50 desktop OK; at `≤800` stack is `1fr` but image stays top-biased. Copy has `padding-right:28` only; mobile restores wrap padding but copy has no horizontal rhythm. Headlines `clamp(26-46)` may overflow at 320. `.spec {1fr 1fr}` becomes cramped at 360. Prose images not optimized.
6. **Typography:** `body 14px/1.5` base is fine but hero `clamp(28-54)` + contact `clamp(32-54)` heavy at 320. No `text-wrap:balance` outside cards. No fluid scale for `work-meta`/`kicker`.
7. **Footer:** `padding 22x4x60` generous, but `nav {flex-wrap:wrap gap14}` links are low-contrast border style, tiny on mobile.
8. **Filters:** `.filters {flex gap8}` no wrap, no scroll; at 320 may overflow.
9. **Touch/a11y:** hover-only card info fails on touch; no `:active` feedback on mobile. Tap targets `<44px` for pill/filter. No `env(safe-area-inset)` for notch.
10. **Viewport:** `width=device-width,initial-scale=1.0` OK, but no `viewport-fit=cover`, no `dvh` handling, no `overscroll-behavior`.

---

## 1) Proposed Approach

**Phase 0 — Audit & Baseline** (read-only, no code): catalog every breakpoint, measure real device.

**Phase 1 — Header Fixed + Scroll Polish** (critical path per user ask): convert `sticky→fixed`, add body offset, disable hide-on-scroll on mobile, polish strip scroll (snap, fade, iOS momentum).

**Phase 2 — Global Responsive Foundation:** introduce spacing/breakpoint tokens, `wrap`/`hero` fluid padding, safe-area, `dvh`, base typography scale.

**Phase 3 — Masonry & List (hardest):** 4→2→1 column cascade, parallax disable, touch reveal for cards, gap/tap fixes.

**Phase 4 — Case/Contact/Prose (50/50 stacking):** refined stack order (media first on mobile? keep copy first), spec grid, prose media, next card.

**Phase 5 — Footer/Filters/Misc:** wrapping, sizing, reduced-motion.

**Phase 6 — QA Hardening:** device matrix, build, regression.

**Design principle:** Mobile-first overrides appended after desktop rules; existing desktop selectors untouched unless clarified. DRY: new tokens for breakpoints/spacing, no duplicate markup (CSS + `matchMedia` only, per memory). Every change verified with `npm run build` + viewport screenshots.

---

## 2) Step-by-Step Plan

### Phase 0: Baseline Audit (no files changed)

#### Task 0.1 — Capture current mobile state
**Objective:** Document what breaks at 320, 375, 414, 768, 900 before touching code.

**Files:** Read-only — `src/styles/*.css`, `src/main.js`, `src/views/*.js`, `index.html`

**Step 1:** Run dev server: `npm run dev -- --host 0.0.0.0 --port 5173` and open on same-WiFi mobile + Chrome DevTools Device Toolbar. Screenshot each route at 320 / 375 / 768 / 900 / 1400.

**Step 2:** Checklist to fill in plan appendix:
- [ ] Header thumb row overflows? Frame tracked correctly?
- [ ] Masonry cols at each width?
- [ ] Card overlay visible?
- [ ] Case 50/50 → stack correct?
- [ ] Horizontal scroll / overflow-x anywhere?
- [ ] Tap targets ≥44px?

**Verification:** Screenshots saved to `/.hermes/plans/screens/`; no code change.

---

### Phase 1: Header — Fixed + Scrollable (user priority)

#### Task 1.1 — Convert header from sticky + hide to fixed
**Objective:** Header pins to viewport; header hide-on-scroll disabled on mobile or entirely per user choice.

**Files:**
- Modify: `src/styles/base.css:10-18` (`.top` rule)
- Modify: `src/main.js:18-31` (scroll hide handler)

**Step 1: CSS**
```css
/* src/styles/base.css */
.top {
  position: fixed; top: 0; left: 0; right: 0; z-index: 20;
  background: var(--header-bg);
  -webkit-backdrop-filter: blur(18px) saturate(1.6);
  backdrop-filter: blur(18px) saturate(1.6);
  border-bottom: 1px solid var(--line);
  /* add safe-area */
  padding-top: env(safe-area-inset-top, 0px);
  transition: transform 0.3s ease;
}
.top.hide { transform: translateY(-100%); }
/* compensate fixed header so content isn't underlapped */
body { padding-top: var(--header-h, 64px); }
.stripbar { min-height: 56px; }
@media (max-width: 640px) {
  .top.hide { transform: none; } /* never hide on mobile Variant A */
}
```

**Step 2: JS — make header height dynamic and disable hide on mobile**
```js
// src/main.js — replace scroll handler
const mqMobile = matchMedia('(max-width: 640px)');
function setHeaderH() {
  document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
}
setHeaderH(); window.addEventListener('resize', setHeaderH);
// only hide on desktop if desired; on mobile keep fixed visible
let hideEnabled = !mqMobile.matches;
mqMobile.addEventListener('change', e => hideEnabled = !e.matches);
// gate existing scroll listener with hideEnabled
```

**Step 3:** Need `env(safe-area-inset)` support and `header.offsetHeight` measure after fonts load (`document.fonts.ready.then(setHeaderH)`).

**Verification:**
- Run `npm run build` — expect CSS gzip ~2.9kB, JS ~21kB.
- Dev: scroll page — header stays fixed; at ≤640 header never hides; content not underlapped; notch inset respected on iOS simulator.

**Commit:** `fix(header): fixed positioning with dynamic body offset and mobile hide gate`

#### Task 1.2 — Polish strip scrollability
**Objective:** Thumb strip feels native on touch: momentum, snap, fade edges, accessible.

**Files:**
- Modify: `src/styles/pages.css:1-17` (`.strip`, `.tab-frame`)
- Modify: `src/views/headerFrame.js` (optional snap helper)

**Step 1: CSS**
```css
.strip {
  position: relative; display: flex; gap: 8px; align-items: center;
  overflow-x: auto; overflow-y: hidden;
  padding: 6px 4px;
  scrollbar-width: none; -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  scroll-padding-inline: 16px;
  mask-image: linear-gradient(to right, transparent 0, black 12px, black calc(100% - 12px), transparent 100%);
}
.strip::-webkit-scrollbar { display: none; }
.strip a, .strip .vtab { scroll-snap-align: start; }
```
**Step 2:** Ensure `.stripbar` allows shrink: `.stripbar .strip { flex:1 1 auto; min-width:0; }` already ok. Add `gap:12` stays, but on ≤480 reduce to 8.

**Step 3:** Add drag-to-scroll for desktop (optional `pointerdown` → `scrollLeft`), or rely on native wheel shift.

**Verification:** On mobile, swipe strip — momentum scroll, snap, fade edges, frame still glides.

#### Task 1.3 — Bottom-edge nuance + "no change in mobile" lock
**Objective:** Confirm header visual stays identical on mobile (no redesign), only technical fixes.

**Files:** No new CSS except 480 tweak:
```css
@media (max-width: 480px) {
  .stripbar { padding: 6px 12px; gap: 8px; }
  .strip { gap: 6px; }
  .strip a { flex: 0 0 52px; }
  .strip img { height: 52px; }
  .strip .vtab { flex: 0 0 52px; height: 54px; font-size: 16px; }
  .pill { padding: 6px 9px; font-size: 13px; }
  .hint { display: none; } /* already at 640, keep */
}
```
**Verification:** Desktop header untouched at ≥641; mobile header is same design, just tighter.

**Decision needed before Task 1.1 (see Risks):** If user wants bottom-fixed nav on mobile (Variant B), replace `top:0` with `bottom:0` at `≤640` and `body {padding-top:0; padding-bottom:var(--header-h)}`. Keep as open question; default implements Variant A (top-fixed).

---

### Phase 2: Global Responsive Foundation

#### Task 2.1 — Add breakpoint/spacing tokens
**Objective:** Centralize responsive scales; avoid magic numbers.

**Files:**
- Modify: `src/styles/tokens.css`

**Code:**
```css
:root {
  /* existing colors + radii */
  --break-sm: 480px;
  --break-md: 640px;
  --break-lg: 800px;
  --break-xl: 900px;
  --space-xs: 8px; --space-sm: 12px; --space-md: 16px; --space-lg: 24px; --space-xl: 32px;
  --header-h: 64px;
  --wrap-pad: 16px;
}
@media (max-width: 640px) { :root { --wrap-pad: 14px; } }
@media (max-width: 480px) { :root { --wrap-pad: 12px; } }
```

**Verification:** No visual change yet; `npm run build` passes.

#### Task 2.2 — Fluid wrapper / hero / base type
**Objective:** Consistent rhythm across widths, safe-area, dvh correctness.

**Files:**
- Modify: `src/styles/base.css:35,37-49`

**Code:**
```css
.wrap { max-width: 1400px; margin: 0 auto; padding: var(--wrap-pad); padding-left: max(var(--wrap-pad), env(safe-area-inset-left)); padding-right: max(var(--wrap-pad), env(safe-area-inset-right)); }
.hero { padding: 20px 4px 8px; }
.hero h1 { font-size: clamp(26px, 6vw, 54px); line-height: 0.95; text-wrap: balance; }
.hero p { font-size: clamp(13px, 2.8vw, 15px); }
@media (max-width: 640px) { .hero { padding: 14px 2px 8px; } .hero h1 { font-size: clamp(24px, 7vw, 32px); } }
@media (max-width: 480px) { .hero p { max-width: none; } }
html { scrollbar-gutter: stable; }
body { overscroll-behavior-y: none; }
```

**Verification:** Hero never overflows 320px; wrap padding scales down smoothly.

---

### Phase 3: Masonry & List

#### Task 3.1 — Masonry column cascade 4→2→1
**Objective:** No narrow 2-col at 375px; 1 col is readable.

**Files:**
- Modify: `src/styles/masonry.css:106-113`
- Modify: `src/views/masonry/parallax.js:7` (gate)
- Review: `src/views/masonry.js:55-58` (cols constant)

**Code:**
```css
.cols { grid-template-columns: repeat(var(--cols, 4), minmax(0,1fr)); gap: 14px; }
@media (max-width: 900px) { .cols { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 640px) { .cols { grid-template-columns: 1fr; gap: 12px; } }
@media (max-width: 480px) { .cols { gap: 10px; } }
/* disable parallax transform causing offset on stacked single col */
@media (max-width: 640px) { .col { transform: none !important; } }
```
**JS gate:**
```js
// masonry/parallax.js — early return
if (window.innerWidth <= 640) return () => {};
// or check getComputedStyle(grid).gridTemplateColumns
```
Optionally in `masonry.js` set `cols` responsive: read `window.innerWidth` to not distribute into 4 when 1-col (avoids empty buckets).

**Verification:** At 900→641 show 2 cols; at ≤640 show single col, no parallax drift, no horizontal overflow.

#### Task 3.2 — Card touch interaction (hover→tap)
**Objective:** Mobile users see title/meta without hover; desktop hover retained.

**Files:**
- Modify: `src/styles/masonry.css:45-96`

**Code:**
```css
/* keep desktop hover */
.card:hover .tags, .card:focus-within .tags { opacity: 0; }
.card:hover .scrim, .card:focus-within .scrim { opacity: 1; }
.card:hover .card-info, .card:focus-within .card-info { opacity: 1; translate:0 0; }

/* touch: always show subtle scrim + info OR show on tap via :active */
@media (hover: none) and (pointer: coarse) {
  .tags { opacity: 1; } /* keep tags visible until tap? choose one */
  /* Option A: persistent info on mobile (recommended for portfolio) */
  .card .scrim { opacity: 1; }
  .card-info { opacity: 1; translate: 0 0; }
  /* reduce intensity on mobile so image not too dark */
  .card .scrim { height: 38%; background: linear-gradient(to top, rgba(16,12,8,0.48) 0%, rgba(16,12,8,0.18) 42%, transparent 100%); }
  .card-info { padding: 14px 10px 10px; }
  .card-info b { font-size: 14px; }
}
/* tap feedback */
.card:active img { transform: scale(1.01); }
```
Alternative if user prefers tap-to-reveal instead of persistent: JS add `card.addEventListener('click')` toggle `.is-open`, CSS `.card.is-open ...`.

**Verification:** On iOS/Android, cards show title; tap doesn't require hover; desktop hover still swaps tags→info.

#### Task 3.3 — List view mobile polish
**Objective:** Work rows become thumb-friendly stacked items.

**Files:**
- Modify: `src/styles/pages.css:24-29`

**Code:**
```css
.works { display: grid; gap: 2px; margin: 10px 0 20px; }
.work { display:flex; flex-wrap:wrap; gap:4px 14px; align-items:baseline; padding:12px 4px; border-top:1px solid var(--line); }
@media (max-width: 640px) {
  .work { flex-direction: column; align-items: stretch; gap:4px; padding:14px 2px; }
  .work-title { font-size: 16px; line-height:1.25; }
  .work-meta { font-size: 11px; opacity:0.9; }
}
@media (max-width: 480px) {
  .works h2 { font-size: 11px; }
}
```
Ensure `.work` has `min-height:44px` tap row (add `min-height`).

**Verification:** List rows full-width, easy tap, no wrapping glitches at 320.

---

### Phase 4: Case / Contact / Prose (50/50 → stack)

#### Task 4.1 — Refine case stacking & rhythm
**Objective:** Preserve desktop 50/50 with no padding (already done) while mobile stacks gracefully; typographic rhythm retained.

**Files:**
- Modify: `src/styles/pages.css:32-42,43-61` (existing case rules)
- No JS needed

**Code (extends existing 800 breakpoint to 640+480):**
```css
.case-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; align-items:start; }
.case-copy { min-width:0; padding: 18px 28px 18px 4px; }
.case-media { padding:0; line-height:0; }
.case-media img { width:100%; height:auto; display:block; }
.wrap:has(> .case) { padding-right:0; padding-top:0; padding-bottom:0; }

@media (max-width: 800px) {
  .case-grid { grid-template-columns:1fr; }
  .case-copy { padding: 16px 0 18px; }
  .case-media { order: -1; } /* image on top on mobile — decide; alternative keep copy first */
  .wrap:has(> .case) { padding-right: var(--wrap-pad); padding-top: var(--wrap-pad); padding-bottom: var(--wrap-pad); }
  .case h1 { font-size: clamp(24px, 7vw, 34px); }
}
@media (max-width: 480px) {
  .case .kicker { font-size: 10.5px; }
  .case h1 { font-size: clamp(22px, 8vw, 30px); line-height:0.95; }
  .case-copy { padding: 12px 0 14px; }
  .prose { font-size: 14px; }
}
```
**Decision:** `order:-1` puts image above text on mobile (common, better first impression). If user prefers text-first, omit.

**Also:** `.spec` at narrow:
```css
.spec { display:grid; grid-template-columns:1fr 1fr; gap:14px 10px; }
@media (max-width: 480px) { .spec { grid-template-columns:1fr; gap:10px; } .spec dd { font-size: 14px; } }
.next { /* ensure tap */ min-height: 64px; }
@media (max-width: 480px) { .next { padding:14px; } .next b{font-size:17px;} }
```

**Verification:** Project and Contact pages at 375 show image flush-top (if ordered), text readable, spec not squashed.

#### Task 4.2 — Contact hero special case
**Objective:** Large contact title wraps nicely at narrow.

**Files:** `src/styles/base.css:40-52`

**Code already has flex-wrap hero; add:**
```css
@media (max-width: 640px) {
  .contact-hero h1 { font-size: clamp(28px, 9vw, 38px); line-height:0.9; column-gap:0.2em; }
  .contact-about { padding: 12px 0 0; font-size: 14px; }
}
@media (max-width: 360px) {
  .contact-hero h1 { font-size: clamp(24px, 10vw, 32px); }
}
```

**Verification:** No overflow at 320; two-tone ink/muted spans wrap cleanly.

#### Task 4.3 — Prose content (markdown bodies)
**Files:** `src/styles/pages.css:47-54`

**Code:**
```css
.prose { line-height:1.6; overflow-wrap: break-word; }
.prose img, .prose video, .prose iframe { max-width:100%; height:auto; }
@media (max-width: 640px) {
  .prose h2 { font-size: 18px; margin:14px 0 6px; }
  .prose h3 { font-size: 15px; }
  .prose ul, .prose ol { padding-left: 16px; }
}
```

---

### Phase 5: Footer / Filters / Misc

#### Task 5.1 — Footer mobile
**Files:** `src/styles/base.css:53-58`

```css
footer { border-top:1px solid var(--line); margin-top:30px; padding:22px 4px 60px; display:grid; gap:14px; }
@media (max-width: 640px) { footer { padding:18px 2px 40px; margin-top:20px; gap:10px; font-size:13px; } footer nav{ gap:10px; } }
@media (max-width: 480px) { footer { padding-bottom: calc(24px + env(safe-area-inset-bottom)); } }
```

#### Task 5.2 — Filters & pills wrapping
**Files:** `src/styles/base.css:36,26-32` + `masonry.js` filter markup

```css
.filters { display:flex; gap:8px; align-items:center; margin:6px 0 14px; flex-wrap:wrap; }
@media (max-width: 480px) { .filters { gap:6px; } .pill{ font-size:13px; padding:5px 9px; min-height:32px; } }
```
Ensure each `.pill` meets 44px outer tap with padding + line box or explicit `min-height:44px` on mobile for a11y (if strict, set `min-height:36` at least).

#### Task 5.3 — Motion & a11y
- Respect `prefers-reduced-motion` already for `.top` and `.card`; add `@media (hover:none)` guard for parallax: `parallax.js` returns noop if `prefers-reduced-motion`.
- Ensure `:focus-visible` outlines not clipped by `overflow:hidden`.
- Add `@media (prefers-reduced-motion:reduce){ .top{transition:none} .tab-frame{transition:none} }` already present — verify covers new fixed transform.

---

### Phase 6: QA & Verification

#### Task 6.1 — Build & regression
**Run:** `npm run build` must pass. Check `dist/assets/*.css` gzip delta <1kB growth expected.

#### Task 6.2 — Device matrix (manual)
Routes × widths:
- `/masonry` grid, `/masonry` list, `/projects/<any>` (e.g. `apparel...`), `/contact`
- Widths: 320 (SE), 375 (iPhone), 414 (Pro Max), 768 (iPad), 900, 1024, 1400
- Checklist per width: no horizontal scroll (`document.documentElement.scrollWidth === clientWidth`), header fixed correct, strip fade not clipped, card info visible, tap targets ≥44, fonts balanced.

#### Task 6.3 — Real-device via Vite host
`npm run dev -- --host 0.0.0.0 --port 5173` → open Network URL on phone. Test momentum, safe-area (notch), `dvh`.

#### Task 6.4 — Lighthouse mobile (optional)
Run Chrome Lighthouse mobile preset; target: no CLS from fixed header shift, no layout overflow.

---

## 3) Files Likely to Change

| File | Change |
|------|--------|
| `src/styles/base.css` | `.top: sticky→fixed`, `body padding-top`, `.wrap` safe-area & fluid pad, `.hero`/`footer`/`filters` responsive |
| `src/styles/pages.css` | `.strip` scroll-snap/fade, `.case-*` already 50/50 but extend 800→640/480, `.work`/`.spec`/`.prose`/`.next` |
| `src/styles/masonry.css` | `.cols` 1-col at ≤640, `.col` transform kill, card touch mode (`@media (hover:none)`) |
| `src/styles/tokens.css` | Add spacing/breakpoint vars |
| `src/main.js` | Dynamic `--header-h`, `matchMedia` hide gate, `ResizeObserver`/`fonts.ready` |
| `src/views/masonry/parallax.js` | Disable at ≤640 / reduced-motion |
| `index.html` | Optional `meta viewport` → add `viewport-fit=cover` |
| New | `.hermes/plans/screens/` screenshots (not shipped) |

Line-limit note: `base.css` 58 lines + new rules will breach 100 — extract `src/styles/header.css` or `responsive.css` if needed and import in `index.html`.

---

## 4) Tests / Validation

No unit tests in repo. Validation is:
1. `npm run build` (must pass, exact expected output: `✓ built in XXms`, CSS/JS gzip sizes).
2. Visual regression — before/after screenshots at each breakpoint (manual).
3. `grep -R "scrollWidth"` check no overflow, `check: document.documentElement.scrollWidth <= window.innerWidth` at every route/width via console.
4. Touch target audit: DevTools → Performance → check no jank from parallax on mobile (disable verified).

---

## 5) Risks, Tradeoffs & Open Questions

**Risks:**
- `position:fixed` header requires compensating `body padding-top`; if height is dynamic (fonts load), FOUC jump. Mitigated with `--header-h` + `ResizeObserver` on header.
- `wrap:has(> .case)` with fixed header + `--header-h` may double offset; verify case pages not double-padded.
- `mask-image` fade on `.strip` is unsupported on old browsers; falls back to no fade (acceptable).
- Parallax disabled on mobile changes desktop-mimic feel; verify at 641 threshold.
- Touch persistent card info darkens image; may compete with tags design.

**Tradeoffs:**
- Mobile persistent card info (always visible) vs tap-to-reveal (cleaner but hidden). Recommended: persistent with light scrim (plan provides both; choose one).
- Fixed header hides content vs always-visible nav; hiding shows more content but hurts discoverability. Gate hide only on desktop keeps mobile nav always reachable.

**Open Questions for user (need answer before Phase 1):**
1. **Header position:** Confirm Variant A (header fixed at *top* always) vs Variant B (header fixed at *bottom* on mobile, top on desktop) — your phrasing "at the bottom" ambiguous. Default plan implements Variant A; if B, change `top:0`→`bottom:0` at `≤640` + body bottom padding.
2. **"no change in mobile" — clarify:** Do you mean *"keep mobile header design identical, only make it fixed/scrollable"* (interpreted) — or *"don't touch mobile at all, only desktop"*? Plan assumes former.
3. **Card overlay on mobile:** Persist info+scrim always (easiest), or require tap to reveal? Persistent recommended for portfolio scanning.
4. **Case image order on mobile:** Image first (`order:-1`) or text first? Plan currently puts image first; confirm preference.
5. **Hide-on-scroll:** Should desktop still hide header on scroll-down (current behavior) or stay fixed always? Plan disables hide on mobile only; desktop keeps hide — confirm.

---

## 6) Execution Order & Estimates

| Phase | Duration | Depends |
|-------|----------|---------|
| 0 Audit | 15 min | — |
| 1 Header fixed+scroll | 45 min | 0 |
| 2 Global foundation | 20 min | 1 |
| 3 Masonry/List | 40 min | 2 |
| 4 Case/Contact | 30 min | 2 |
| 5 Footer/Filters | 15 min | 2 |
| 6 QA | 30 min | 3,4,5 |
**Total ~3h** single pass, iterative verification after each task.

---

## 7) Rollback / No-Regret

All changes are CSS-first and reversible. If fixed header causes regression, revert `base.css:10-18` + `main.js` header logic to current `sticky` + hide. Keep per-task commits for bisect.

---

## Appendix: Immediate Next Action

Await user confirmation on 5 open questions above; then proceed task-by-task with `subagent-driven-development` (fresh subagent per task, two-stage review). If user says "go with defaults, execute," start at Task 1.1 with Variant A top-fixed persistent card info image-first.
