# FX elevation + Motion as tabbed tables

**Goal:** Every token that still scrolls — Elevation inside FX and the whole Motion pane — reads as a tabbed table like FX tokens, with one pill per logical group and plain-language outcomes.
**Architecture:** Reuse the pill `tabs()` + `fx-table` pattern from FX cards; keep live `data-live`/`data-copy-token` behavior and existing demos inside their tab, only the token presentation changes to rows with effect/token/what/live.
**Tech Stack:** Vanilla JS + Vite, `src/ds/tabs.js`, `src/ds/foundations-fx.css` (`fx-table`), token-only CSS.
**Tags:** Design System, Component

<!-- changelog: hide -->

---

## Phase 1 — Elevation tables behind tabs {#phase-1}
*Tags: Design System, Component*
*Elevation stops stacking — three pills, one table at a time.*

| # | Task | Done when |
|---|---|---|
| 1 | Render elevation tokens as tables | Shadow and opacity tokens read as fx-table rows with live values + row-click copy |
| 2 | Show levels + token tables as pill tabs | Levels · Shadows · Opacity switch in place via tabs() |
| 3 | Verify FX pane still builds | plan:names, ds:track, test green + fresh FX screenshot |

### Task 1: Render elevation tokens as tables ✓ done
**Objective:** Elevation tokens read as information, not card grids.
**Files:** `src/ds/foundations/fx/elev.js`, `src/ds/foundations-fx.css`
**Verify:** Shadow/opacity rows show effect, token, plain outcome, live value.

### Task 2: Show levels + token tables as pill tabs ✓ done
**Objective:** One elevation group visible at a time — no scroll to compare.
**Files:** `src/ds/foundations/fx/elev.js`
**Verify:** Tabs switch panes; visual levels demo stays in its tab; copy still works.

### Task 3: Verify FX pane still builds ✓ done
**Objective:** Ship only a rendered, linted, buildable pane.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** All required local gates pass and the fresh screenshot shows tabbed elevation.

*Shipped in 28309a4 · Tasks 1–3 · phase-1.*

## Phase 2 — Motion tables behind tabs {#phase-2}
*Tags: Design System, Component, Motion*
*Motion stops scrolling — durations/easing/interaction/depth behind pills.*

| # | Task | Done when |
|---|---|---|
| 4 | Render motion tokens as tables | Duration/ease/press/depth rows become fx-table with live values + row-click copy |
| 5 | Show motion groups as pill tabs | Durations · Easing · Interaction · Depth · Contract switch via tabs() |
| 6 | Verify Foundations Motion pane | plan:names, ds:track, test green + fresh Motion screenshot |

### Task 4: Render motion tokens as tables ✓ done
**Objective:** Motion tokens read as tables with outcomes.
**Files:** `src/ds/foundations/motion/sections.js`, `src/ds/foundations/pane-motion.js`, `src/ds/foundations/motion/data.js`
**Verify:** Each motion row shows name, token, sanctioned use / outcome, live value.

### Task 5: Show motion groups as pill tabs ✓ done
**Objective:** One motion group visible at a time — no long scroll.
**Files:** `src/ds/foundations/pane-motion.js`
**Verify:** Tabs switch panes; bars/stage/press demos stay with their group; copy intact.

### Task 6: Verify Foundations Motion pane ✓ done
**Objective:** Ship only a rendered, linted, buildable pane.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** All required local gates pass and the fresh screenshot shows tabbed motion.

*Shipped in 28309a4 · Tasks 4–6 · phase-2.*
