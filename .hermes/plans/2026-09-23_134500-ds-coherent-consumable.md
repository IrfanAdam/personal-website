# DS coherent + consumable — IA, chrome, foundations focus

**Goal:** Make ADAM/DS read as one system for first-time consumers — nav groups tell the story, every page opens the same way, Foundations holds only material decisions.
**Architecture:** Keep token single-source and vertical-tabs shell. Regroup routes into Start / Elements / Motion / Atlas order, unify crumb+hero+lede contract per page, trim Foundations to material panes and relocate Sound/Contract out of the rail.
**Tech Stack:** Vanilla JS + Vite, `src/ds/routes.js`, `src/ds/ds.js`, page composers, `src/ds/foundations/*`, token-only CSS.
**Tags:** Design System, Layout, Component

<!-- changelog: hide -->

---

## Phase 1 — Nav + IA coherence {#phase-1}
*Tags: Design System, Layout*
*Nav tells the story top-to-bottom: start here, build with this, move with this, map the rest.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Regroup + reorder routes | Groups read Start / Elements / Motion / Atlas; map pages lead their group; single-item Atlas group folds into Start footer link |
| 2 | Rename labels | Labels use plain nouns (no `·` stacking): Foundations, Elements, Patterns, Motion; route hashes unchanged |
| 3 | Prev/next follows story | Footnav order matches sidebar order; Changelog stays entry 1 with Overview entry 2 |

### Task 1 ✓ done: Regroup + reorder routes
**Objective:** Sidebar reads as consumer journey, not file list.
**Files:** `src/ds/routes.js`, `src/ds/ds.js`
**Verify:** Sidebar groups in order with map/index first per group; Atlas not a lone group.

### Task 2 ✓ done: Rename labels
**Objective:** One noun per page; remove mid-dot stacking.
**Files:** `src/ds/routes.js`
**Verify:** Every sidebar label is 1–2 plain words; hashes unchanged so deep links survive.

### Task 3 ✓ done: Prev/next follows story
**Objective:** Footnav walks the same story as sidebar.
**Files:** `src/ds/ds.js`
**Verify:** Prev/Next on any page matches sidebar neighbours.

*Shipped in d58d1e4 · Tasks 1–3 · phase-1.*

---

## Phase 2 — Page chrome + sheet contract unity {#phase-2}
*Tags: Design System, Component*
*Every page opens identically: crumb, one-line job statement, then uniform sheets — consumers never re-learn the layout.*

| # | Task | Done when |
|---|------|-----------|
| 4 | Unified page header | Every page renders `crumb = ADAM/DS · <Section>` + H1 + one-line lede stating job + what lives here |
| 5 | Sheet contract | Primitives/Library/Patterns sheets share order: What / When / Preview / Tokens; Do-note + Code stay but move after preview |
| 6 | Components map as index | `#/components` becomes the Elements landing (not 3rd item): 9 → 11 → 4 counts with links; Primitives/Library/Patterns link back to it |

### Task 4 ✓ done: Unified page header
**Objective:** Same opening rhythm on all 7 top pages.
**Files:** `src/ds/pages-*.js`, `src/ds/overview-sections.js`
**Verify:** Fresh load of each page shows crumb + H1 + 1-line lede with no voice drift.

### Task 5 ✓ done: Sheet contract
**Objective:** One sheet shape across Elements pages.
**Files:** `src/ds/primitives/*`, `src/ds/library/*`, `src/ds/component.js`
**Verify:** Button, Card, Masonry sheets all read What / When / Preview / Tokens in order.

### Task 6 ✓ done: Components map as index
**Objective:** Map leads, sheets follow.
**Files:** `src/ds/routes.js`, `src/ds/pages-components.js`
**Verify:** Elements group order is Map → Primitives → Library → Patterns; sheets link back to map.

*Shipped in b103c8d · Tasks 4–6 · phase-2.*

---

## Phase 3 — Foundations focus for consumers {#phase-3}
*Tags: Design System*
*Foundations holds material only — color, type, space, shape, motion, elevation, tokens. Sound is behavior so it moves to a Motion lab; wayfinding lines state who owns what.*

| # | Task | Done when |
|---|------|-----------|
| 7 | Sound leaves the rail | New `#/functions/sound` Motion lab renders the sound board (`pane-sound` + `mountSoundBoard`); Foundations rail drops Sound (8 → 7 panes); Tokens stays as the material contract with an Elements-map cross-link |
| 8 | Ownership wayfinding | Rail labels drop `·` stacking (`Motion · Depth` → `Motion`); Motion / FX / Motion-index each carry a one-line pointer to the other two — no pane duplicates a lab |
| 9 | Consumer how-to-read | Overview Reading block becomes 3-step consumer path (1 read Foundations → 2 compose Elements → 3 tune Motion) with links; narrow-rail overflow preserved |

### Task 7 ✓ done: Sound leaves the rail
**Objective:** Sound reads as behavior alongside motion labs, not material.
**Files:** `src/ds/functions/sound.js` (new), `src/ds/routes.js`, `src/ds/pages-foundations.js`, `src/ds/pages-components.js`
**Verify:** Rail shows 7 material panes; `#/functions/sound` plays + renders scope; Elements map links Tokens to `#/foundations`.

### Task 8 ✓ done: Ownership wayfinding
**Objective:** One owner per motion concept, stated in words.
**Files:** `src/ds/foundations/pane-motion.js`, `src/ds/foundations/pane-fx.js`, `src/ds/pages-functions.js`
**Verify:** No `·`-stacked rail label; each of the three surfaces points at the other two.

### Task 9 ✓ done: Consumer how-to-read
**Objective:** Overview tells a first-timer where to go next.
**Files:** `src/ds/overview/reading.js`
**Verify:** Reading block lists 3 linked steps; `build` green.

*Shipped in 17a8366 · Tasks 7–9 · phase-3.*
