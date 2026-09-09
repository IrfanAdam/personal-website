# Functions Section + FX Audit Plan

> **For Hermes:** implement task-by-task, verify with `npm test` after each.

**Goal:** Add a distinct `Functions` section to `/ds` housing the cell-grid + skeletal shimmer (+ viewer portal) as tweakable, token-driven functions, with the audit's dead code and perf issues fixed.

**Architecture:** New `src/ds/pages-functions.js` route rendering live specimens with controls bound to CSS vars; FX constants migrate from JS literals into `tokens.css` (new Functions layer) + a small `fx.js` reader; duplications and dead layers removed. No visual change until the user tweaks.

**Tech Stack:** Vanilla JS + CSS vars, existing token lint, `vite build`.

**Scope update (DS-first):** Build the Functions labs in `/ds` only — no site changes. Optimise there, graduate to tokens later.

---

## Audit (grounded, 2026-09-08)

**Function inventory — where things actually live:**
- Cell grid: `src/views/masonry/cells.js` (`buildTree`, `MORPH=0.04`, `LAST_SPLIT=0.92`) + `gridReveal.js` canvas (`TARGET=30`, `SAMPLE=128`, `WAIT_CAP=0.72`, `PHOTO_FROM=0.93`, `COLOR_MS=240`, `SPAN_S=0.6`, grey `30/228`, `tone*13`, amps `0.14/0.24`, `easeK=8/splitK=6`) + `tokens.css:38` `--reveal-grid` (used once, `case.css:31` loading state only).
- Skeletal shimmer: tokens `--shimmer-gradient / --shimmer-band / --dur-shimmer` (tokens.css:36-37,71) → live in `case.css:43-51` (`hero-shimmer` infinite); **dead** in `card.css:9-17` (`display:none`, `@keyframes shimmer` never animated).
- Viewer portal (cyberpunk): `viewer.js` (241 lines) + `viewer.css` + ~20 viewer tokens; decoration layers **dead** — `.viewer-glass/.viewer-bar/.viewer-shimmer` are `display:none !important`, yet `viewer.js:59` still injects them and DS pages still document "grid + scan + shimmer" and `--viewer-neon`.
- Mobile hero height-morph: **duplicated ~40 lines** in `project.js:43-91` ≈ `contact.js:34-81` (magic `420/300/0.82/28/220/80/24/180`, inline `860ms cubic-bezier(0.32,0.72,1)` — not tokens).

**Not tweakable today (all JS literals):** cell size/count, sample res, wait cap, photo-from, color ms, span, morph, split window, grey tones, gutter, sheen amps, easing lambdas, `SKELETON_MS=120` (masonry.js:44), placeholder heights, viewer `HALF/OFF/THRESHOLD=12/IDLE_MS=850/HIDE_DEBOUNCE=70/spring k=0.1 fr=0.54/180/10/20`.

**Unused tokens (defined, never consumed):** `--viewer-grid`, `--viewer-scan`, `--viewer-neon`, `--color-viewer-neon`, `--blur-viewer-2/3`, `--color-viewer-shade`, `--viewer-mask-1/2/3`, `--size-viewer-gap/pad` (only `1` used in `@supports`), `--dur-viewer-in`, `--z-viewer-lines` (vs `--z-viewer-lines`? verify). Unused JS: `buildSquare`, `orderByDetail` (cells.js).

**Perf notes:** per-card RAF loop (14 cards = 14 loops + 14 ResizeObservers + 14 IOs) + separate parallax RAF; full-res canvas at DPR≤2 with per-frame `fillRect` per cell (~48–180 cells); 128×128 `getImageData` per card; two near-identical shimmer keyframes (`shimmer` dead vs `hero-shimmer` live).

---

### Task 1: Functions token layer in tokens.css
**Files:** Modify `src/styles/tokens.css` (~+15 lines, stay ≤100 — compact one-line groups, prune dead viewer tokens per Task 3).
**Do:** Add `/* — Functions · cell-grid / shimmer / hero — */`: `--fx-cell:30px; --fx-cells-min:48; --fx-cells-max:180; --fx-sample:128; --fx-wait:0.72; --fx-photo-from:0.93; --dur-fx-color:240ms; --dur-fx-span:0.6s; --fx-morph:0.04; --fx-split-end:0.92; --fx-skeleton:120ms; --fx-sheen:0.14; --fx-sheen-photo:0.24; --dur-hero-rise:860ms; --fx-placeholder-min:300px; --fx-placeholder-max:420px;` + reuse `--ease-signature`. JS reads via `getComputedStyle` helper.
**Verify:** `npm run lint:tokens` passes; `vite build` passes.

### Task 2: Extract shared mobile hero placeholder
**Files:** Create `src/views/masonry/heroPlaceholder.js`; Modify `src/views/project.js`, `src/views/contact.js` (delete ~35 lines each, call helper).
**Do:** Move placeholder/morph/finish logic into `attachHeroPlaceholder(box, {w,h})` consuming Task-1 tokens; keep behavior identical.
**Verify:** `npm test` green; mobile case + contact show same placeholder→rise→reveal.

### Task 3: Dead-code sweep (decide revive-vs-delete with user at execution)
**Files:** `src/styles/card.css`, `src/styles/viewer.css`, `src/views/masonry/viewer.js`, `src/views/masonry/cells.js`, `src/styles/tokens.css`, `src/ds/pages-components.js`, `src/ds/pages-patterns.js`.
**Do:** (a) card `::before` shimmer + `@keyframes shimmer` — delete (canvas owns it) or re-enable deliberately; (b) viewer glass/bar/shimmer DOM+CSS — delete injection + rules AND fix DS copy, or revive overlays as the cyberpunk look; (c) delete `buildSquare`/`orderByDetail` if unreferenced; (d) delete still-unused viewer tokens after (b); unify `hero-shimmer`/`shimmer` into one keyframe.
**Verify:** `grep -rn "viewer-shimmer\|viewer-glass\|buildSquare\|orderByDetail" src` empty (or revived + documented); `npm test` green.

### Task 4: Perf pass (measure, then cut)
**Files:** `src/views/masonry/gridReveal.js`, `src/views/masonry/parallax.js`.
**Do:** Single shared rAF clock for all cards (or one loop per grid); DPR cap ≤1.5 for mosaic canvas; skip `measureTree` when image fails; keep IO `rootMargin:150px` as `--fx-io-margin`. No behavior change, just fewer loops.
**Verify:** Before/after: count RAF loops (should be 1/grid), DevTools frame check on scroll; `npm test` green.

### Task 5: New DS Functions section (tweakable values)
**Files:** Create `src/ds/pages-functions.js`; Modify `src/ds/ds.js` (add `{ hash:'#/functions', label:'Functions', group:'Library' }`), `src/ds/specimens.js` (`refreshLive` for `data-live`), DESIGN.md (Functions chapter).
**Do:** Sections: Cell-grid (live canvas specimen + sliders: cell size, wait cap, photo-from, morph, sheen), Skeletal shimmer (gradient/band/duration controls), Hero rise (duration/easing), Viewer portal (threshold/idle/debounce/spring — enabled only if Task 3 revives it). Controls write to `:root` vars + `fx.js` params live; note dark-mode + reduced-motion + mobile gates.
**Verify:** `/ds#/functions` loads, every control visibly changes its specimen; theme toggle refreshes `data-live` labels; `npm test` green (new files ≤100 lines CSS, JS paint-clean).

### Task 6: Docs + spec truthfulness
**Files:** `DESIGN.md`, `src/ds/pages-patterns.js`, `src/ds/pages-components.js`.
**Do:** Document Functions tokens + cyberpunk direction (grid density, gutter recess, tint, scan, neon — with dark values); fix stale "grid + scan + shimmer / --viewer-neon" claims to match Task-3 outcome; correct wrap spec (`--size-wrap` is 1600px, not 1400px).
**Verify:** `grep -n "TODO\|FIXME\|1400px" DESIGN.md` clean; DS copy matches shipped CSS.

## Risks / open questions
- Viewer overlays: revive (cyberpunk needs them) vs delete (current shipped look hides them) — needs your call in Task 3.
- `tokens.css` 100-line budget: Tasks 1+5 must prune dead tokens first or the lint fails.
- `var()` invalid in `@media` — breakpoints stay raw px by design.
