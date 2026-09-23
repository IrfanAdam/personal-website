# DS sidebar pinned links above Start

**Goal:** Changelog + Components sit pinned above the Start group so the sidebar opens with the two most-used entries, no group label above them.
**Architecture:** Keep grouped-nav renderer untouched; reorder `src/ds/routes.js` so the two pinned entries carry an empty group and the Start / Elements / Motion groups follow unchanged.
**Tech Stack:** Vanilla JS + Vite, `src/ds/routes.js`.
**Tags:** Design System, Layout

---

## Phase 1 — Pin Changelog + Components above Start {#phase-1}
*Tags: Design System, Layout*
*Pinned entries first, group labels after.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Pin Changelog + Components above Start | Sidebar shows Changelog + Components with no label, then Start / Elements / Motion groups; hashes unchanged; footnav follows sidebar |

### Task 1: Pin Changelog + Components above Start ✓ done
**Objective:** Two most-used entries open the sidebar, groups tell the rest.
**Files:** `src/ds/routes.js`
**Verify:** Fresh `/ds/` load shows Changelog, Components, then Start label; prev/next walks the same order; `lint:tokens` + `build` green.

*Shipped in <sha> · Tasks 1–1 · phase-1.*
