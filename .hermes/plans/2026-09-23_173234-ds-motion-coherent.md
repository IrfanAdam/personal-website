# Motion coherent — labs read like Elements, live, one screen

**Goal:** Make Motion read as one coherent story — the 8 labs share Elements' sheet chrome and live-tweakable tables so a first-timer can tune any model without re-learning the page.
**Architecture:** Keep each lab's model untouched; replace bespoke lab headers/sections with the shared `crumb + hero (H1 + job lede)` + sheet contract `What / When / Demo / Tokens / Contract`; where a lab has >1 knob, group its demos/tokens as `tabs({variant:'line'})` + `fx-table` rows with `data-live`/`data-copy-token` so one effect per screen, no scroll.
**Tech Stack:** Vanilla JS + Vite, `src/ds/routes.js`, `src/ds/pages-functions.js`, `src/ds/functions/*`, `src/ds/foundations/pane-motion.js` + `pane-fx.js` for cross-links, token-only CSS.
**Tags:** Design System, Motion, Component

<!-- changelog: hide -->

---

## Phase 1 — Motion map + unified lab chrome {#phase-1}
*Tags: Design System, Motion, Component*
*Motion starts with a map and every lab opens the same way — no bespoke headers.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Motion map as index | `#/functions` renders count-led map `Motion 8 labs` + table `Lab → Job → What it tunes` (mirrors Elements `9 → 11 → 4` map); route hashes unchanged |
| 2 | Unified lab header | Every lab renders `crumb = Motion · <Lab>` + `H1` + one-line lede stating job + where its tokens live (Foundations → Motion or tokens.css) |
| 3 | Sheet contract per lab | Each lab follows `What / When / Demo / Tokens / Contract` order; Do/Don't + Code stay but move after Demo; prev/next follows sidebar Motion order |

### Task 1: Motion map as index ✓ done
**Objective:** Motion index leads like Elements — counts first, then links.
**Files:** `src/ds/pages-functions.js`, `src/ds/routes.js`
**Verify:** Fresh `/ds/#/functions` shows `Motion 8` + table with 8 rows, each row links to its lab; sidebar Motion group unchanged.

### Task 2: Unified lab header ✓ done
**Objective:** Same opening rhythm on all 8 labs as on Elements sheets.
**Files:** `src/ds/functions/grid-reveal.js`, `src/ds/functions/shimmer.js`, `src/ds/functions/rise.js`, `src/ds/functions/viewer.js`, `src/ds/functions/glimmer-orb.js`, `src/ds/functions/glitch.js`, `src/ds/functions/scramble.js`, `src/ds/functions/sound.js`
**Verify:** Fresh load of each lab shows crumb + H1 + 1-line lede with no voice drift; hashes unchanged.

### Task 3: Sheet contract per lab ✓ done
**Objective:** One sheet shape across Motion labs.
**Files:** Lab composers + `src/ds/component.js` pattern
**Verify:** GridReveal, Shimmer, Rise, Viewer, etc. all read What / When / Demo / Tokens / Contract in order; footnav walks Motion order.

*Shipped in pending · Tasks 1–3 · phase-1.*

---

## Phase 2 — Labs as effect-first tables, one screen at a time {#phase-2}
*Tags: Design System, Motion*
*Where a lab has >1 token/knob, tables replace stacked cards — pill tabs keep one effect visible.*

| # | Task | Done when |
|---|------|-----------|
| 4 | Table rows for token labs | Labs with tokens (Shimmer, Rise, Viewer, Glitch) render `effect / token / what / live` rows via `fx-table` with `data-live` + row-click copy; live values probed via `cssVar` |
| 5 | Pill tabs per lab | Labs with ≥2 groups show them as `tabs({variant:'line'})` panes (e.g. Shimmer: Gradient vs Band vs Duration) — only selected pane visible, no scroll |
| 6 | Demo stays with its tokens | Each pane keeps its demo + controls beside the table; switching tabs preserves live values and copy behavior |

### Task 4: Table rows for token labs ✓ done
**Objective:** Tokens read as information, not scattered literals.
**Files:** `src/ds/functions/shimmer.js`, `src/ds/functions/rise.js`, `src/ds/functions/viewer.js`, `src/ds/functions/glitch.js`
**Verify:** Each row shows effect name, token, plain outcome, live value; click copies.

### Task 5: Pill tabs per lab ✓ done
**Objective:** One group visible at a time — same pattern as FX legible.
**Files:** Lab composers, `src/ds/tabs.js`
**Verify:** Tabs switch panes; all 3 Shimmer groups etc. reachable without scrolling the page.

### Task 6: Demo stays with its tokens ✓ done
**Objective:** Demos don't drift from their tokens.
**Files:** Lab composers
**Verify:** Switching tabs + theme toggle leaves demos functional; `lint:tokens` + `build` green.

*Shipped in pending · Tasks 4–6 · phase-2.*

---

## Phase 3 — Ownership wayfinding + verify {#phase-3}
*Tags: Design System, Motion*
*Motion labs, Foundations Motion, and FX state who owns what — one line each, no duplication.*

| # | Task | Done when |
|---|------|-----------|
| 7 | Ownership wayfinding | Motion index + Foundations Motion + Foundations FX each carry a one-line pointer to the other two (`Motion labs → tune`, `Foundations Motion → spec`, `FX → visible effect`); no pane duplicates a lab |
| 8 | Reduced-motion contract unified | Every lab's Contract section states `prefers-reduced-motion` behavior in one sentence + code block; provenance stays in Foundations Motion Contract tab |
| 9 | Verify Motion story | `npm run plan:names`, `npm run ds:track`, `npm test`, and fresh Motion + lab screenshots are green; `All` count + `Motion` chip counts reflect 1 purpose build |

### Task 7: Ownership wayfinding ✓ done
**Objective:** One owner per motion concept, stated in words.
**Files:** `src/ds/pages-functions.js`, `src/ds/foundations/pane-motion.js`, `src/ds/foundations/pane-fx.js`
**Verify:** Each of the three surfaces points at the other two; no duplicate token tables.

### Task 8: Reduced-motion contract unified ✓ done
**Objective:** Contract is consistent across labs.
**Files:** Lab composers, `src/ds/foundations/pane-motion.js`
**Verify:** Every lab's Contract reads identically; Foundations Motion remains single source.

### Task 9: Verify Motion story ✓ done
**Objective:** Ship only a rendered, linted, buildable Motion story.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** All required local gates pass and fresh screenshots show map + unified labs.

*Shipped in pending · Tasks 7–9 · phase-3.*
