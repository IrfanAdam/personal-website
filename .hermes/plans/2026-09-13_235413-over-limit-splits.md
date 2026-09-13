# Over-Limit Splits — 11 Files to ≤100 Lines

**Goal:** Bring the 11 files flagged by `lint-manage` under the 100-line budget by extraction, zero behavior change.
**Architecture:** One job per module; originals become thin composers re-exporting the old API; shared state via explicit getter channels.
**Tech Stack:** Vanilla JS ESM, Vite build, lint-manage + lint:tokens gates.
**Tags:** Component, Function

---

## Phase 1 — Glitch lab + cells {#phase-1}

*Split the sound-lab pair: resume the stashed source-panel cut, extract cells texture.*

*Tags: Component*

| # | Task | Done when |
|---|------|-----------|
| 1 | source-panel markup/bind split (stash resume) | source-panel.js + source-markup.js + source-bind.js each ≤100, build green |
| 2 | cells texture extraction | cells.js + cells-texture.js each ≤100, lab renders identical |

### Task 1: source-panel markup/bind split ✓ done

**Objective:** Complete the half-done cut in `stash@{phase3-close}`: render → source-markup.js, mount → source-bind.js, composer re-exports both.
**Files:** src/ds/functions/glitch/source-panel.js (bind composer), src/ds/functions/glitch/source/markup.js.
**Verify:** `wc -l` all ≤100; importer `glitch.js` untouched; `npm test` green.

### Task 2: cells texture extraction ✓ done

**Objective:** Move imgMap + sampleTex + loadImage into cells-texture.js via a state-getter factory; composer keeps mount orchestration.
**Files:** src/ds/fx-lab/cells.js, src/ds/fx-lab/cells-texture.js.
**Verify:** `wc -l` both ≤100; lab paints identical frames; `npm test` green.

*Shipped in 7490a89 · Tasks 1–2 · phase-1.*

---

## Phase 2 — DS pages {#phase-2}

*Split the three over-limit DS routes along render/data/handlers seams.*

*Tags: Component*

| # | Task | Done when |
|---|------|-----------|
| 3 | foundations handlers + mix extraction | pages-foundations.js + 2 new modules each ≤100 |
| 4 | patterns data + render extraction | pages-patterns.js + 2 new modules each ≤100 |
| 5 | changelog events extraction | pages-changelog.js + changelog-events.js each ≤100, drawer cycle intact |

### Task 3: foundations handlers + mix extraction ✓ done

**Objective:** Move mix block (refreshMix) → foundations-mix.js, demo handlers (onCopyVar/onType/onEase/onFx) → foundations-handlers.js verbatim; composer keeps render + sync + mount stitch.
**Files:** src/ds/pages-foundations.js, src/ds/foundations-mix.js, src/ds/foundations-handlers.js.
**Verify:** `wc -l` all ≤100; contrast probe + demos work; `npm test` green.

### Task 4: patterns data + render extraction ✓ done

**Objective:** Move PAIRS/MOTION/a11yRows → patterns-data.js, render() → patterns-render.js; composer keeps title + mount + re-exports.
**Files:** src/ds/pages-patterns.js (composer), src/ds/patterns-data.js, src/ds/patterns-layouts.js, src/ds/patterns-quality.js.
**Verify:** `wc -l` all ≤100; a11y table + motion matrix render; `npm test` green.

### Task 5: changelog events extraction ✓ done

**Objective:** Move onClick/onKey/move + listener wiring → changelog-events.js via state-channel factory; composer keeps glob derivation + render + thin mount. Glob import stays static.
**Files:** src/ds/pages-changelog.js, src/ds/changelog-events.js.
**Verify:** `wc -l` both ≤100; drawer open → rail switch → close cycle passes; `npm test` green.

*Shipped in ed0106c · Tasks 3–5 · phase-2.*

---

## Phase 3 — Views + renderer {#phase-3}

*Split the five over-limit views along config/painter/lifecycle seams.*

*Tags: Function*

| # | Task | Done when |
|---|------|-----------|
| 6 | glimmer color utils extraction | glimmer-orb.js + glimmer-color.js each ≤100 |
| 7 | init-sound load-scanner extraction | init-sound.js + init-sound-load.js each ≤100 |
| 8 | gridReveal config extraction | gridReveal.js + gridReveal-config.js each ≤100 |
| 9 | viewer visibility extraction | viewer.js + viewer-visibility.js each ≤100 |
| 10 | ds grid-reveal section split | grid-reveal.js + 2 section modules each ≤100 |

### Task 6: glimmer color utils extraction ✓ done

**Objective:** Move parseColor + tokenColor → views/glimmer-color.js; importer chain (pages-overview, ds lab, fx/visual barrel) untouched.
**Files:** src/views/glimmer-orb.js, src/views/glimmer-color.js.
**Verify:** `wc -l` both ≤100; orb renders; `npm test` green.

### Task 7: init-sound load-scanner extraction ✓ done

**Objective:** Move page-load scanner block → views/init-sound-load.js via `{ isOn, markPlayed }` channel; composer keeps toggle + observer wiring.
**Files:** src/views/init-sound.js, src/views/init-sound-load.js.
**Verify:** `wc -l` both ≤100; side-effect import order unchanged; `npm test` green.

### Task 8: gridReveal config extraction ✓ done

**Objective:** Move fx() token reader + darkNow + cellCount → views/masonry/gridReveal-config.js; painter path verbatim.
**Files:** src/views/masonry/gridReveal.js, src/views/masonry/gridReveal-config.js.
**Verify:** `wc -l` both ≤100; hero + card reveals identical; `npm test` green.

### Task 9: viewer visibility extraction ✓ done

**Objective:** Move show/hide cursor+portal cluster → views/masonry/viewer-visibility.js as makeVisibility factory; composer keeps guards/cfg/paint/tick/bind.
**Files:** src/views/masonry/viewer.js, src/views/masonry/viewer-visibility.js.
**Verify:** `wc -l` both ≤100; hover portal + idle hide intact; `npm test` green.

### Task 10: ds grid-reveal section split ✓ done

**Objective:** Move Lab section → functions/grid-reveal-lab.js, Single-source + Usage sections → functions/grid-reveal-docs.js; composer keeps hero + stitch + mount.
**Files:** src/ds/functions/grid-reveal.js, src/ds/functions/grid-reveal-lab.js, src/ds/functions/grid-reveal-docs.js.
**Verify:** `wc -l` all ≤100; lab controls + docs tables render; `npm test` green.

*Shipped in 9244672 · Tasks 6–10 · phase-3.*

---

## Phase 4 — App boot + close-out {#phase-4}

*Split main.js chrome, then full regression and archive close.*

*Tags: Tooling*

| # | Task | Done when |
|---|------|-----------|
| 11 | main chrome extraction | main.js + boot-chrome.js each ≤100, boot order identical |
| 12 | Full regression close-out + push | lint-manage 0, npm test green, phases marked, pushed |

### Task 11: main chrome extraction ✓ done

**Objective:** Move setHeaderH + fonts/resize wiring + hide-on-scroll → boot-chrome.js exporting initChrome(header); entry order unchanged.
**Files:** src/main.js, src/boot-chrome.js.
**Verify:** `wc -l` both ≤100; header height var + hide-on-scroll work; `npm test` green.

### Task 12: Full regression close-out + push ✓ done

**Objective:** lint-manage reports 0, npm test green, all tasks marked ✓ done with Shipped lines, manifest refreshed, pushed to origin/main.
**Files:** .hermes/plans/2026-09-13_235413-over-limit-splits.md, src/ds/changelog-manifest.json.
**Verify:** `node scripts/lint-manage.mjs` clean; `npm test` green; `git ls-remote origin main` matches HEAD.

*Shipped in 46cadca · Tasks 11–12 · phase-4.*
