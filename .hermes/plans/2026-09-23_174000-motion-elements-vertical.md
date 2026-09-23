# Motion + Sound as Elements — vertical tabs, one screen per effect

**Goal:** Motion and Sound stop living under Foundations/Motion labs — they read as Elements · Motion and Elements · Sound with vertical tabs like the screenshot (Masonry/Viewer/Case 50/50 pattern), one effect per screen.
**Architecture:** New `src/ds/pages-motion.js` + `src/ds/pages-sound.js` reuse `foundations/motion/data.js` + `foundations/motion/sections.js` and `foundations/sound/*` with `tabs({vertical:true})` already used by Foundations/Patterns; `src/ds/routes.js` groups both under Elements; `src/ds/pages-foundations.js` drops Motion pane; Sound board keeps `mountSoundBoard`; live `data-live`/`data-copy-token` preserved.
**Tech Stack:** Vanilla JS + Vite, `src/ds/tabs.js` (`vertical:true`), `src/ds/foundations/motion/*` + `foundations/sound/*`.
**Tags:** Design System, Motion, Component

---

## Phase 1 — Motion as Elements, vertical tabs {#phase-1}
*Tags: Design System, Motion, Component*
*Motion leaves Foundations — 5 vertical tabs, same content, no pills.*

| # | Task | Done when |
|---|---|---|
| 1 | Create Elements Motion page | `src/ds/pages-motion.js` renders crumb `Elements · Motion`, hero + `tabs({vertical:true})` panes Durations · Easing · Interaction · Depth · Contract; each pane keeps its bars/stage/blurs + fx-table with data-live/copy |
| 2 | Route Motion under Elements, drop from Foundations | `routes.js` adds `#/motion` under group Elements (after Patterns), `pages-foundations.js` removes Motion import/pane; `#/foundations?pane=motion` fallback maps to motion |
| 3 | Verify build + Motion screenshot | `plan:names`, `ds:track`, `test` green + fresh `/ds/#/motion` shows vertical tabs like Patterns (see screenshot) |

### Task 1: Create Elements Motion page ✓ done
**Objective:** Motion reads like Elements sheets — vertical nav left, detail right, one screen per effect.
**Files:** `src/ds/pages-motion.js`, `src/ds/motion-panes.js`, `src/ds/foundations/motion/data.js`, `src/ds/foundations/motion/sections.js`
**Verify:** Tabs switch without scroll; Durations shows bars + USES, Easing shows stage, Depth shows blurs.

### Task 2: Route Motion under Elements, drop from Foundations ✓ done
**Objective:** Sidebar shows Motion under Elements; Foundations no longer hosts motion.
**Files:** `src/ds/routes.js`, `src/ds/pages-foundations.js`, `src/ds/foundations/pane-motion.js`
**Verify:** Sidebar Elements group = Primitives·Library·Patterns·Motion; Foundations has 6 panes.

### Task 3: Verify build + Motion screenshot ✓ done
**Objective:** Ship only a rendered, linted, buildable Motion.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** All local gates pass and fresh screenshot of `/ds/#/motion` matches vertical-tab chrome.

*Shipped in fd4e9b7 · Tasks 1–3 · phase-1.*

## Phase 2 — Sound as Elements, vertical tabs {#phase-2}
*Tags: Design System, Component*
*Sound leaves Motion labs — 4 vertical tabs, same board, no line pills.*

| # | Task | Done when |
|---|---|---|
| 4 | Create Elements Sound page | `src/ds/pages-sound.js` renders crumb `Elements · Sound`, hero + `tabs({vertical:true})` panes Voices · Files · Scope · Usage; each pane keeps its procedural/files/scope/usage html |
| 5 | Route Sound under Elements | `routes.js` adds `#/sound` under group Elements (after Motion), keeps `#/functions/sound` as redirect alias; sidebar Elements = Primitives·Library·Patterns·Motion·Sound |
| 6 | Verify build + Sound screenshot | `plan:names`, `ds:track`, `test` green + fresh `/ds/#/sound` shows vertical tabs like Motion/Patterns |

### Task 4: Create Elements Sound page ✓ done
**Objective:** Sound reads like Elements sheets — vertical nav left, detail right, one screen per voice set.
**Files:** `src/ds/pages-sound.js`, `src/ds/sound-panes.js`, `src/ds/foundations/sound/*`
**Verify:** Tabs switch without scroll; Voices shows 9 voices grid, Files shows table, Scope shows canvas.

### Task 5: Route Sound under Elements ✓ done
**Objective:** Sidebar shows Sound under Elements; old Motion Sound hash still resolves.
**Files:** `src/ds/routes.js`, `src/ds/ds.js`
**Verify:** Sidebar Elements group has Sound; `#/functions/sound` redirects to `#/sound`.

### Task 6: Verify build + Sound screenshot ✓ done
**Objective:** Ship only a rendered, linted, buildable Sound.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** All local gates pass and fresh screenshot of `/ds/#/sound` matches vertical-tab chrome.

*Shipped in 5268f4c · Tasks 4–6 · phase-2.*

## Phase 3 — Sound scope at top, always live {#phase-3}
*Tags: Design System, Component*
*Scope stays visible — Voices/Files play into the same canvas at the top.*

| # | Task | Done when |
|---|---|---|
| 7 | Move Scope out of tabs | `src/ds/sound-panes.js` drops Scope pane → 3 panes (Voices · Files · Usage); Scope lives elsewhere |
| 8 | Render Scope persistently above tabs | `src/ds/pages-sound.js` renders `scopeHtml()` in a sticky/persistent `ds-sec` above `tabs({vertical:true})`; `mountSoundBoard` still finds `#sndScope` regardless of active tab |
| 9 | Verify scope updates from any tab | Playing any Voice or File updates the top Scope canvas + status; `plan:names`, `ds:track`, `test` green + fresh `/ds/#/sound` shows Scope at top |

### Task 7: Move Scope out of tabs ✓ done
**Objective:** Scope is not a hidden tab — it is the shared readout.
**Files:** `src/ds/sound-panes.js`
**Verify:** Panes length = 3; no Scope entry.

### Task 8: Render Scope persistently above tabs ✓ done
**Objective:** Scope visible on every Sound tab, updates live.
**Files:** `src/ds/pages-sound.js`, `src/ds/foundations/sound/scope.js`
**Verify:** `/ds/#/sound` shows Scope canvas + status bar at top, then vertical tabs below.

### Task 9: Verify scope updates from any tab ✓ done
**Objective:** Ship only a rendered, linted, buildable Sound with live Scope.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** All local gates pass and fresh screenshot shows Scope at top with Voices active; playing a file updates same canvas.

*Shipped in pending · Tasks 7–9 · phase-3.*
