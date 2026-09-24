# Sound returns to Foundations

**Goal:** Sound reads where it is defined — inside Foundations as an eighth pane, not as a standalone Elements tab.
**Architecture:** `src/ds/pages-foundations.js` imports `foundations/pane-sound.js` as the eighth vertical pane; `src/ds/routes.js` drops the Elements Sound route; `src/ds/ds.js` redirects legacy `#/sound` and `#/functions/sound` to `#/foundations`; `mountSoundBoard` wires inside the Foundations mount.
**Tech Stack:** Vanilla JS + Vite, `tabs({vertical:true})`, `foundations/sound/*` + `pane-sound.js` + `board.js`.
**Tags:** Design System

<!-- changelog: hide -->

---

## Phase 1 — Sound inside Foundations {#phase-1}
*Tags: Design System*
*Elements Sound becomes the eighth Foundations subtab; the Foundations copy says eight definitions, the sidebar no longer lists Sound separately, and old hashes still land.*

| # | Task | Done when |
|---|---|-----------|
| 1 | Foundations adds Sound pane | `pages-foundations.js` imports `pane-sound` as eighth pane (after FX, before Tokens), lede says Eight definitions, `outerInitial` maps `sound→7`, tabs count 8 |
| 2 | Routes + redirect | `routes.js` removes `#/sound` Elements entry; `ds.js` maps `#/sound` and `#/functions/sound` → `#/foundations` (Sound pane), sidebar no longer shows Sound under Elements |
| 3 | Mount wiring + verify | `pages-foundations.js` mount calls `mountSoundBoard(root)` and cleans up; `plan:names`, `ds:track`, `test` green; `/ds/#/foundations` shows 8 vertical tabs with Sound active and playable |

### Task 1: Foundations adds Sound pane ✓ done
**Objective:** Sound is the eighth definition alongside Color·Type·Space·Shape·Motion·FX·Tokens.
**Files:** `src/ds/pages-foundations.js`, `src/ds/foundations/pane-sound.js`
**Verify:** `/ds/#/foundations` vertical tabs = 8, Sound pane renders intro + Lab/File/Code line tabs + scope.

### Task 2: Routes + redirect ✓ done
**Objective:** No Elements Sound entry; legacy hashes land on Foundations.
**Files:** `src/ds/routes.js`, `src/ds/ds.js`
**Verify:** Sidebar Elements = Primitives·Library·Special·Patterns (no Sound); `#/sound` redirects to `#/foundations`.

### Task 3: Mount wiring + verify ✓ done
**Objective:** Sound board is playable inside Foundations.
**Files:** `src/ds/pages-foundations.js`, `src/ds/foundations/sound/board.js`
**Verify:** Playing a voice/file on Foundations Sound tab repaints scope; gates green.

*Shipped in c7dd23c · Tasks 1–3 · phase-1.*
