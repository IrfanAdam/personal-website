# DS Overview absorbs Elements map; Components tab goes

**Goal:** Overview carries the Elements map as a section after Principles, so the standalone Components tab can be deleted and the sidebar loses a stop.
**Architecture:** New `src/ds/overview/elements-map.js` section wired into the Overview composer; `src/ds/routes.js` drops the Components entry; the four `#/components` backlinks repoint to Overview; tracked `pages-components.js` deleted after a stash checkpoint.
**Tech Stack:** Vanilla JS + Vite, `src/ds/overview/*`, `src/ds/routes.js`, `src/ds/pages-*.js`.
**Tags:** Design System, Layout

---

## Phase 1 — Fold Elements map into Overview {#phase-1}
*Tags: Design System, Layout*
*Map becomes a section, tab disappears.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Elements map section in Overview | `elementsMapHtml()` renders the 9 → 11 → 4 cards + Migrated after Principles; Overview order hero → principles → elements → reading → checklist → mood |
| 2 | Drop Components tab, repoint links | No `#/components` route or link survives (`grep` 0 outside `dist/`); `pages-components.js` deleted; backlinks point at Overview; `lint:tokens` + `build` + `smoke` green |

### Task 1: Elements map section in Overview ✓ done
**Objective:** One fewer tab, same map.
**Files:** `src/ds/overview/elements-map.js`, `src/ds/overview-sections.js`, `src/ds/pages-overview.js`
**Verify:** Fresh `/ds/` Overview shows Elements cards + Migrated between Principles and How-to-read; card links walk to live sheets.

### Task 2: Drop Components tab, repoint links ✓ done
**Objective:** No dead route, no orphan pointer.
**Files:** `src/ds/routes.js`, `src/ds/pages-primitives.js`, `src/ds/pages-library.js`, `src/ds/patterns-layouts.js`, `src/ds/overview/reading.js`, delete `src/ds/pages-components.js`
**Verify:** `grep -rn "#/components" src` empty; sidebar has no Components entry; prev/next skips it; build + smoke green.

*Shipped in <sha> · Tasks 1–2 · phase-1.*
