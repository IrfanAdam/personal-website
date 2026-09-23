# DS refining — FX + Motion + Sound, one screen per effect

**Goal:** Motion and Sound stop living under Foundations/Motion labs — they read as Elements · Motion and Elements · Sound with vertical tabs like the screenshot (Masonry/Viewer/Case 50/50 pattern), one effect per screen.
**Architecture:** New `src/ds/pages-motion.js` + `src/ds/pages-sound.js` reuse `foundations/motion/data.js` + `foundations/motion/sections.js` and `foundations/sound/*` with `tabs({vertical:true})` already used by Foundations/Patterns; `src/ds/routes.js` groups both under Elements; `src/ds/pages-foundations.js` drops Motion pane; Sound board keeps `mountSoundBoard`; live `data-live`/`data-copy-token` preserved.
**Tech Stack:** Vanilla JS + Vite, `src/ds/tabs.js` (`vertical:true`), `src/ds/foundations/motion/*` + `foundations/sound/*`.
**Tags:** Design System

---

## Phase 1 — Motion as Elements, vertical tabs {#phase-1}
*Tags: Design System*
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
*Tags: Design System*
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
*Tags: Design System*
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

*Shipped in 7bce104 · Tasks 7–9 · phase-3.*

## Phase 4 — Files single player + Scope above Files + clear {#phase-4}
*Tags: Design System*
*Files stops doubling players — one Play on the right, Scope stays above Files, crowd cleared on demand.*

| # | Task | Done when |
|---|---|---|
| 10 | Files table single player | `src/ds/foundations/sound/files.js` drops Preview column → header 3 cols FILE·DESC·PLAY, no `<audio>` preview, only right `▶ Play` + gain per row |
| 11 | Scope above Files + clear | `src/ds/foundations/sound/scope.js` keeps canvas at top but `pages-sound.js` ensures it reads as above Files; `scope.js` adds `clear` pill at far right of bar, `board.js` handler clears canvas + resets status/info |
| 12 | Verify build + Files screenshot | `plan:names`, `ds:track`, `test` green + fresh `/ds/#/sound` Files tab shows 3-col table + Scope with clear at top |

### Task 10: Files table single player ✓ done
**Objective:** No double players — keep the right one.
**Files:** `src/ds/foundations/sound/files.js`
**Verify:** Files header 3 cols, no Preview/audio tag, Play on right.

### Task 11: Scope above Files + clear ✓ done
**Objective:** Scope reads as panel above Files, crowd gone on demand.
**Files:** `src/ds/foundations/sound/scope.js`, `src/ds/foundations/sound/board.js`, `src/ds/pages-sound.js`
**Verify:** Scope bar has `clear` at far right, clears canvas + resets `idle — hit ▶…` + `—`, Scope remains above vertical tabs (above Files when Files active).

### Task 12: Verify build + Files screenshot ✓ done
**Objective:** Ship only a rendered, linted, buildable single-player Files.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** All local gates pass and fresh `/ds/#/sound` Files tab shows 3-col table with clear at top.

*Shipped in 75cb968 · Tasks 10–12 · phase-4.*

## Phase 5 — Special tab for Motion labs, Elements Motion removed {#phase-5}
*Tags: Design System*
*Motion labs no longer under Motion — 8 routes (Motion index + 7 labs) move to Special; redundant Elements Motion (Durations etc.) deleted, Foundations untouched.*

| # | Task | Done when |
|---|---|---|
| 13 | Remove Elements Motion | `routes.js` drops `#/motion` import/route, `pages-motion.js` + `motion-panes.js` deleted, `ds.js` redirects `#/motion` → `#/functions`; `pages-functions.js` link updated |
| 14 | Motion labs → Special | `routes.js` groups `#/functions` + 7 labs under `Special` (was `Motion`); sidebar shows `Special` with Motion·GridReveal·Shimmer·Rise·Viewer·Glimmer orb·Glitch·Scramble; `Elements` stays Primitives·Library·Patterns·Sound |
| 15 | Verify build + nav | `plan:names`, `ds:track`, `test` green; `/ds/#/functions` under `Special`, no `#/motion` entry, `Foundations` 6 panes, graph/manifest updated |

### Task 13: Remove Elements Motion ✓ done
**Objective:** Redundant 5-pane Motion gone — no duplicate Durations/Easing table.
**Files:** `src/ds/routes.js`, `src/ds/ds.js`, `src/ds/pages-motion.js`, `src/ds/motion-panes.js`, `src/ds/pages-functions.js`
**Verify:** `routes.js` has no `#/motion`; grep 0 importers; `#/motion` redirects.

### Task 14: Motion labs → Special ✓ done
**Objective:** Labs read under Special, not Motion.
**Files:** `src/ds/routes.js`
**Verify:** 8 routes grouped `Special`; sidebar `Special` shows 8 entries, `Motion` group gone.

### Task 15: Verify build + nav ✓ done
**Objective:** Ship only a rendered, linted, buildable Special tab.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** All local gates pass and fresh screenshots of sidebar (`Special`) + `/ds/#/functions` (under Special) match.

*Shipped in 2dff01e · Tasks 13–15 · phase-5.*

## Phase 6 — Motion returns to Foundations {#phase-6}
*Tags: Design System*
*Foundations reclaims Motion — 7 panes, Durations etc. live inside Foundations where the system defines them.*

| # | Task | Done when |
|---|---|---|
| 16 | Re-add Motion pane to Foundations | `src/ds/pages-foundations.js` imports `pane-motion` as `mL/mH`, inserts `Motion` at index 4 → panes = Color·Type·Space·Shape·Motion·FX·Contract (7), lede says Seven definitions, `outerInitial` maps `motion`→4 and `fx`→5 |
| 17 | Redirect legacy Motion hash | `src/ds/ds.js` maps `#/motion` → `#/foundations` (not `#/functions`) so old links land on Foundations Motion pane |
| 18 | Verify Foundations Motion | `plan:names`, `ds:track`, `test` green; `/ds/#/foundations` shows 7 tabs with Motion at 5th, inner Durations/Easing/Interaction/Depth/Contract tabs work |

### Task 16: Re-add Motion pane to Foundations ✓ done
**Objective:** Motion lives where tokens live — Foundations.
**Files:** `src/ds/pages-foundations.js`, `src/ds/foundations/pane-motion.js`
**Verify:** Foundations has 7 panes.

### Task 17: Redirect legacy Motion hash ✓ done
**Objective:** Old `#/motion` links still work — now to Foundations.
**Files:** `src/ds/ds.js`
**Verify:** `#/motion` redirects to `#/foundations`.

### Task 18: Verify Foundations Motion ✓ done
**Objective:** Ship only a rendered, linted, buildable Foundations with Motion.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** Screenshot of `/ds/#/foundations` shows Motion pane.

*Shipped in 0494908 · Tasks 16–18 · phase-6.*

## Phase 7 — Special as Library-style vertical tabs {#phase-7}
*Tags: Design System*
*Special stops being 8 flat sidebar routes — one Special page with 8 vertical tabs, like Library (Header · Footer · …).*

| # | Task | Done when |
|---|---|---|
| 19 | Collapse Special labs into one page | `src/ds/pages-functions.js` (or `pages-special.js`) renders `tabs({vertical:true})` with 8 panes: Motion index + GridReveal · Shimmer · Rise · Viewer · Glimmer orb · Glitch · Scramble — each pane calls its lab `render()`; mount calls each lab mount |
| 20 | Routes → single Special entry | `src/ds/routes.js` keeps single `Special` entry (`#/special` canonical, `#/functions` alias via `ds.js`), drops 7 per-lab routes; `ds.js` redirects `#/functions/*` → `#/special`; sidebar shows `Special` once under group `Special` |
| 21 | Verify build + Special screenshot | `plan:names`, `ds:track`, `test` green; sidebar has `Special` once, `/ds/#/special` shows vertical tabs like Library, each lab live |

### Task 19: Collapse Special labs into one page ✓ done
**Objective:** Special reads like Library — one tab, many sheets.
**Files:** `src/ds/pages-functions.js`, `src/ds/pages-special.js` (if new), `src/ds/functions/*`
**Verify:** Vertical tabs switch without page change.

### Task 20: Routes → single Special entry ✓ done
**Objective:** Sidebar not fragmented — one Special entry.
**Files:** `src/ds/routes.js`, `src/ds/ds.js`
**Verify:** `routes.js` has 1 Special entry; 7 lab routes removed; grep 0 orphan.

### Task 21: Verify build + Special screenshot ✓ done
**Objective:** Ship only a rendered, linted, buildable Special tab.
**Files:** plan and names metadata plus generated graph/manifest as required by the repo gates.
**Verify:** Screenshot of `/ds/#/special` matches Library chrome.

*Shipped in df1318a · Tasks 19–21 · phase-7.*

## Phase 8 — Special under Elements, labs live + in-budget {#phase-8}
*Tags: Design System, Layout*
*Special drops the Overview sheet (7 labs), moves into the Elements group with a changelog divider; lab heroes unify on `.ds-hero--lab`, Viewer demos the real card physics, cells finish texture-first with shared visibility/controls modules, all inside line + token budgets.*

| # | Task | Done when |
|---|---|---|
| 22 | Special 7 labs under Elements | no Overview sheet, `routes.js` lists Special under Elements + changelog last, `ds.js` renders `hr.ds-nav-div` before changelog; graph regen committed |
| 23 | Labs live: hero, viewer, texture | all 7 labs on `.ds-hero--lab`; viewer mounts real `attachViewer` card; cells default helix + photo crossfade + replay-on-ready; glimmer defers start to unhide |
| 24 | Budgets hold + verify + push | `cells-controls.js` + `fx-lab/pane-visible.js` extractions, no new lint-manage/token violations, `test` green, screenshots, clubbed commits pushed |

### Task 22: Special 7 labs under Elements ✓ done
**Objective:** Special reads as Elements sheets — 7 labs, no index page; changelog sits apart in the nav.
**Files:** `src/ds/pages-special.js`, `src/ds/routes.js`, `src/ds/ds.js`, `src/ds/ds.css`, `docs/graph.mmd`, `src/ds/arch-schema.json`
**Verify:** Sidebar Elements ends …Patterns·Special·Sound, changelog divided below; no `pages-functions` importers.

### Task 23: Labs live — hero, viewer, texture ✓ done
**Objective:** Labs look like sheets and run production geometry — hero compact, viewer interactive, cells texture-first.
**Files:** `src/ds/ds-content.css`, `src/ds/functions/glimmer-orb.js`, `src/ds/functions/glitch.js`, `src/ds/functions/grid-reveal.js`, `src/ds/functions/grid-reveal-lab.js`, `src/ds/functions/rise.js`, `src/ds/functions/scramble/panel.js`, `src/ds/functions/shimmer.js`, `src/ds/functions/viewer.js`, `src/ds/fx-lab/cells.js`, `src/ds/fx-lab/cells-draw.js`, `src/ds/fx-lab/cells-texture.js`
**Verify:** Build green; Special screenshots show live grid texture + viewer card + glimmer orb.

### Task 24: Budgets hold + verify + push ✓ done
**Objective:** No new violations ship — extractions keep every file ≤100 lines, token lint clean.
**Files:** `src/ds/fx-lab/cells-controls.js`, `src/ds/fx-lab/pane-visible.js`, `src/ds/ds-lab.css`, plan + generated manifest/graph as required by the repo gates.
**Verify:** `plan:names`, `ds:track`, `test` green; lint-manage shows only pre-existing violations; clubbed commits pushed.

*Shipped in d2abaea, 09aac3c · Tasks 22–24 · phase-8.*

## Phase 9 — Vert sheets fit the viewport {#phase-9}
*Tags: Design System, Layout*
*Long `<pre>` lines in visible lab sheets (Glimmer orb's usage snippet) propagated min-content up through the block chain, and panes are direct flex items with `min-width: auto` — the sheet stretched to ~1480px with page-wide horizontal scroll. One shell rule lets panes shrink; code scrolls inside `.ds-code`.*

| # | Task | Done when |
|---|---|---|
| 25 | Panes shrink, code scrolls inside | `.ds-tabs.vert > .ds-pane { min-width: 0 }` in `ds-tabs.css`; all 7 Special sheets `docScrollW` = viewport, Glimmer screenshot clean |

### Task 25: Panes shrink, code scrolls inside ✓ done
**Objective:** No Special sheet ever widens the page — long code lines scroll in their own block.
**Files:** `src/ds/ds-tabs.css`, plan + generated manifest as required by the repo gates.
**Verify:** Playwright across all 7 sheets reports `docScrollW` 1500/1500; Glimmer orb visible, controls uncovered; `test` green.

*Shipped in d4031c6 · Task 25 · phase-9.*

## Phase 10 — Viewer comma fix, folded in {#phase10}
*Tags: Design System*
*One stray comma in the Viewer lab's render collapsed its whole pane and spilled Graduation onto every Special tab — folded here as part of this build.*

| # | Task | Done when |
|---|---|---|
| 26 | Viewer render comma — pane restored | `viewer.js` figure line loses its trailing comma; render NaN-free/div-balanced, Graduation back inside the Viewer pane, gates green |

### Task 26: Viewer render comma — pane restored ✓ done
**Objective:** Remove the expression-level comma that discarded hero/Params/Specimen, unary-plussed the next literal to `NaN`, and closed the pane early.
**Files:** `src/ds/functions/viewer.js`
**Verify:** Node render check + headless Chromium (no stray pane child, Viewer whole); `plan:names`, `ds:track`, `test` green.

*Shipped in 5cc8405 · Tasks 26 · phase-10.*

## Phase 11 — Glitch lab split, folded in {#phase11}
*Tags: Design System, Layout*
*2026-09-23 21:25–21:28 · originally 2026-09-23_212500-glitch-lab-split.md Phase 1 · subset, ordered by first execution.*
*The Glitch lab reads as a narrow demo card left with a sound panel right that wraps inside its own width — folded here as part of this build.*

| # | Task | Done when |
|---|---|---|
| 27 | Rebalance `.fx-split` tracks | card track `minmax(200px, 0.8fr)`, panel track `minmax(0, 1.5fr)` — image visibly narrower |
| 28 | Panel children wrap in-width | `.fx-row` middle uses `minmax(0, 1fr)`, 2-child rows span full width, buttons/tokens/selects wrap, no edge clipping |

### Task 27: Rebalance `.fx-split` tracks ✓ done
**Objective:** Card image takes less width; sound panel fills the rest.
**Files:** `src/ds/ds-lab.css`
**Verify:** Glitch lab screenshot — card narrower, panel wider, no horizontal clip.

### Task 28: Panel children wrap in-width ✓ done
**Objective:** Voice/pitch/length rows, pill buttons and Attr-API token text wrap inside the panel.
**Files:** `src/ds/ds-lab.css`
**Verify:** `plan:names`, `ds:track`, `npm test` green + screenshot shows wrapped rows.

*Shipped in 32f2bc7 · Tasks 1–2 · phase-1.*

