# DS coherent — live Foundations, unified IA, consistent chrome

**Goal:** Make ADAM/DS read as one coherent system — Foundations scannable and live-tweakable (deep-linked panes + live token table), IA telling a consumer journey (Start → Elements → Motion), every page opening with unified chrome, and Foundations holding only material decisions.
**Architecture:** Keep token single-source (`src/styles/tokens.css` → `var()` only) and vertical `tabs` shell. Add inner tabs + live token playground to Foundations, regroup routes into Start / Elements / Motion / Atlas with map-first order, unify crumb+hero+lede and sheet contracts, and move Sound from material to Motion labs.
**Tech Stack:** Vanilla JS + Vite, `src/ds/tabs.js`, `src/ds/specimens.js` (`cssVar/probeTheme/refreshLive`), `src/ds/routes.js`/`ds.js`, page composers, `src/ds/foundations/*`, token-only CSS.
**Tags:** Design System, Component, Tooling, Layout

---

## Phase 1 — Foundations inner navigation + deep link {#phase-1}

*Tags: Design System, Component*

*Color (and later Type) stop being one long scroll — inner horizontal tabs expose Ramps / Pairs / Decor / Lab as one selectable panel, with URL state and keyboard.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Color inner tabs | `pane-color.js` renders 4 inner panes via `tabs({variant:'line'})` — Ramps, Pairs, Decor, Lab (mixer) — only selected pane visible |
| 2 | Deep link + keyboard | `?pane=color&tab=pairs` (or `#/foundations/color--pairs`) restores selection on load/hash change; `tabs.js` supports Arrow/Home/End roving focus |
| 3 | Preserve live behavior | Ramp hover tips, live pair `ratio/verdict` in both themes, mixer controls, and copy remain functional after tab switch and theme toggle |

### Task 1 ✓ done: Color inner tabs
**Objective:** Split the current Color sheet into four focused panels without changing data.
**Files:** `src/ds/foundations/pane-color.js`, `src/ds/foundations/color/sections.js`, `src/ds/foundations/color/tabs.js` (new)
**Verify:** Fresh `/ds/#/foundations` shows Color → 4 inner tabs, only selected pane content renders.

### Task 2 ✓ done: Deep link + keyboard
**Objective:** Make any Foundations sub-pane shareable and keyboard-operable.
**Files:** `src/ds/tabs.js`, `src/ds/pages-foundations.js`, `src/ds/routes.js` (hash/query sync)
**Verify:** Reload with `?pane=color&tab=lab` opens Lab; ArrowLeft/Right moves inner tabs, focus follows.

### Task 3 ✓ done: Preserve live behavior
**Objective:** Keep existing live probes and playgrounds mounted under new panel structure.
**Files:** `src/ds/pages-foundations.js`, `src/ds/foundations-handlers.js`, `src/ds/specimens.js`
**Verify:** Switching inner tabs + toggling theme leaves live contrast cells, ramp tips, and Lab mixer functional; `lint:tokens` + `build` green.

*Shipped in e47382e · Tasks 1–3 · phase-1.*

---

## Phase 2 — Live token table + playground {#phase-2}

*Tags: Design System, Tooling*

*One scannable table enumerates every semantic token with live swatch/value/copy; a paired playground lets you tweak spacing/color/type at runtime and see every specimen update.*

| # | Task | Done when |
|---|------|-----------|
| 4 | Token table | Single table lists `color.* / space.* / typography.* / radius.* / motion.*` with swatch, live `var()` value, usage, and copy — probed via `cssVar/probeTheme` |
| 5 | Live playground | Controls (range/color/select) write `document.documentElement.style.setProperty` for selected tokens; all DS specimens + Library playgrounds reflow live |
| 6 | Persist + export | Tweaks persist to `localStorage` (reset button), and `copy export` emits `tokens.css`-ready declarations; `DESIGN.md` sync noted |

### Task 4 ✓ done: Token table
**Objective:** Build the observability layer — one place to see what the system actually is.
**Files:** `src/ds/foundations/pane-contract.js` (or new `pane-tokens.js`), `src/ds/specimens/trace.js`, `src/ds/foundations/tokens-table.js`
**Verify:** Table shows every `--color-*`, `--space-*`, `--text-*`, `--radius-*`, `--dur-*` with live values in light+dark, click copies token.

### Task 5 ✓ done: Live playground
**Objective:** Make the DS mutable without editing files.
**Files:** `src/ds/foundations/tokens-playground.js`, `src/ds/foundations/tokens.css`
**Verify:** Dragging `--space-14` slider or picking `--color-accent` instantly updates Foundations ramps, pair cells, and Library card/pill specimens; `refreshLive()` fires.

### Task 6 ✓ done: Persist + export
**Objective:** Keep tweaks durable and committable.
**Files:** `src/ds/foundations/tokens-playground.js`, `src/ds/specimens/copy.js`
**Verify:** Reload restores tweaks; Reset clears `localStorage`; Export copies valid CSS declarations for `tokens.css`.

*Shipped in 6fd7cb2 · Tasks 4–6 · phase-2.*

---

## Phase 3 — IA clarity + coverage {#phase-3}

*Tags: Design System, Layout*

*Remove the dead-end index, surface the mental model, and make coverage explicit — the DS reads top-to-bottom without guessing where things live.*

| # | Task | Done when |
|---|------|-----------|
| 7 | Prune Components stub | `#/components` redirect removed or turned into visual map: Primitives 9 → Library 11 → Patterns 4 → Functions 7 with links |
| 8 | Coverage checklist | Overview shows `Token foundations / Core components / Feedback states / Pattern library / Audit checklist` with live check state |
| 9 | Atlas regroup + polish | Atlas moves out of `Start` into its own group or footer link; Foundations vertical rail + inner tabs handle narrow screens via overflow |

### Task 7 ✓ done: Prune Components stub
**Objective:** Eliminate the one-release redirect that now confuses first scan.
**Files:** `src/ds/routes.js`, `src/ds/pages-components.js`, `src/ds/ds.css`
**Verify:** `/ds/#/components` resolves to map or redirects to `#/primitives`; no dead-end table remains.

### Task 8 ✓ done: Coverage checklist
**Objective:** Make system completeness visible.
**Files:** `src/ds/pages-overview.js`, `src/ds/overview-sections.js`
**Verify:** Overview footer lists 5 checklist items with check/ gap state derived from existing sheets; no hardcoded claims.

### Task 9 ✓ done: Atlas regroup + polish
**Objective:** Keep tooling from crowding Foundations narrative.
**Files:** `src/ds/routes.js`, `src/ds/sidebar.js`, `src/ds/ds-responsive.css`
**Verify:** Atlas no longer in `Start` group; narrow-screen Foundations rail collapses or inner tabs overflow without clipping; `build` green.

*Shipped in 659fb4b · Tasks 7–9 · phase-3.*

## Phase 4 — Nav + IA coherence {#phase-4}
*Tags: Design System, Layout*
*Nav tells the story top-to-bottom: start here, build with this, move with this, map the rest.*
*2026-09-23 13:45 · originally 2026-09-23_134500-ds-coherent-consumable.md Phase 1 · subset, ordered by first execution.*

| # | Task | Done when |
|---|------|-----------|
| 10 | Regroup + reorder routes | Groups read Start / Elements / Motion / Atlas; map pages lead their group; single-item Atlas group folds into Start footer link |
| 11 | Rename labels | Labels use plain nouns (no `·` stacking): Foundations, Elements, Patterns, Motion; route hashes unchanged |
| 12 | Prev/next follows story | Footnav order matches sidebar order; Changelog stays entry 1 with Overview entry 2 |

### Task 10 ✓ done: Regroup + reorder routes
**Objective:** Sidebar reads as consumer journey, not file list.
**Files:** `src/ds/routes.js`, `src/ds/ds.js`
**Verify:** Sidebar groups in order with map/index first per group; Atlas not a lone group.

### Task 11 ✓ done: Rename labels
**Objective:** One noun per page; remove mid-dot stacking.
**Files:** `src/ds/routes.js`
**Verify:** Every sidebar label is 1–2 plain words; hashes unchanged so deep links survive.

### Task 12 ✓ done: Prev/next follows story
**Objective:** Footnav walks the same story as sidebar.
**Files:** `src/ds/ds.js`
**Verify:** Prev/Next on any page matches sidebar neighbours.

*Shipped in d58d1e4 · Tasks 10–12 · phase-4.*

---

## Phase 5 — Page chrome + sheet contract unity {#phase-5}
*Tags: Design System, Component*
*Every page opens identically: crumb, one-line job statement, then uniform sheets — consumers never re-learn the layout.*
*2026-09-23 13:57 · originally 2026-09-23_134500-ds-coherent-consumable.md Phase 2 · subset, ordered by first execution.*

| # | Task | Done when |
|---|------|-----------|
| 13 | Unified page header | Every page renders `crumb = ADAM/DS · <Section>` + H1 + one-line lede stating job + what lives here |
| 14 | Sheet contract | Primitives/Library/Patterns sheets share order: What / When / Preview / Tokens; Do-note + Code stay but move after preview |
| 15 | Components map as index | `#/components` becomes the Elements landing (not 3rd item): 9 → 11 → 4 counts with links; Primitives/Library/Patterns link back to it |

### Task 13 ✓ done: Unified page header
**Objective:** Same opening rhythm on all 7 top pages.
**Files:** `src/ds/pages-*.js`, `src/ds/overview-sections.js`
**Verify:** Fresh load of each page shows crumb + H1 + 1-line lede with no voice drift.

### Task 14 ✓ done: Sheet contract
**Objective:** One sheet shape across Elements pages.
**Files:** `src/ds/primitives/*`, `src/ds/library/*`, `src/ds/component.js`
**Verify:** Button, Card, Masonry sheets all read What / When / Preview / Tokens in order.

### Task 15 ✓ done: Components map as index
**Objective:** Map leads, sheets follow.
**Files:** `src/ds/routes.js`, `src/ds/pages-components.js`
**Verify:** Elements group order is Map → Primitives → Library → Patterns; sheets link back to map.

*Shipped in b103c8d · Tasks 13–15 · phase-5.*

---

## Phase 6 — Foundations focus for consumers {#phase-6}
*Tags: Design System*
*Foundations holds material only — color, type, space, shape, motion, elevation, tokens. Sound is behavior so it moves to a Motion lab; wayfinding lines state who owns what.*
*2026-09-23 13:57 · originally 2026-09-23_134500-ds-coherent-consumable.md Phase 3 · subset, ordered by first execution.*

| # | Task | Done when |
|---|------|-----------|
| 16 | Sound leaves the rail | New `#/functions/sound` Motion lab renders the sound board (`pane-sound` + `mountSoundBoard`); Foundations rail drops Sound (8 → 7 panes); Tokens stays as the material contract with an Elements-map cross-link |
| 17 | Ownership wayfinding | Rail labels drop `·` stacking (`Motion · Depth` → `Motion`); Motion / FX / Motion-index each carry a one-line pointer to the other two — no pane duplicates a lab |
| 18 | Consumer how-to-read | Overview Reading block becomes 3-step consumer path (1 read Foundations → 2 compose Elements → 3 tune Motion) with links; narrow-rail overflow preserved |

### Task 16 ✓ done: Sound leaves the rail
**Objective:** Sound reads as behavior alongside motion labs, not material.
**Files:** `src/ds/functions/sound.js` (new), `src/ds/routes.js`, `src/ds/pages-foundations.js`, `src/ds/pages-components.js`
**Verify:** Rail shows 7 material panes; `#/functions/sound` plays + renders scope; Elements map links Tokens to `#/foundations`.

### Task 17 ✓ done: Ownership wayfinding
**Objective:** One owner per motion concept, stated in words.
**Files:** `src/ds/foundations/pane-motion.js`, `src/ds/foundations/pane-fx.js`, `src/ds/pages-functions.js`
**Verify:** No `·`-stacked rail label; each of the three surfaces points at the other two.

### Task 18 ✓ done: Consumer how-to-read
**Objective:** Overview tells a first-timer where to go next.
**Files:** `src/ds/overview/reading.js`
**Verify:** Reading block lists 3 linked steps; `build` green.

*Shipped in 17a8366 · Tasks 16–18 · phase-6.*
