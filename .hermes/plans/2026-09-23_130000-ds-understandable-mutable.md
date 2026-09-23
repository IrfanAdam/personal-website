# DS understandable + mutable — foundations, tokens, IA

**Goal:** Make ADAM/DS scannable at a glance and live-tweakable — deep-linkable Foundations with focused panes, a single token table that reflects `tokens.css`, and a cleaner IA with coverage visible.

**Architecture:** Keep the existing token single-source (`src/styles/tokens.css` → `var()` only, docs tokens in `src/ds/ds.css`) and vertical `tabs` shell. Add inner horizontal tabs inside heavy Foundations panes, a token-trace table + live playground that writes `documentElement.style.setProperty`, and IA pruning (remove redirect stub, surface checklist). No new primitives, no raw colors.

**Tech Stack:** Vanilla JS + Vite, `src/ds/tabs.js`, `src/ds/specimens.js` (`cssVar/probeTheme/refreshLive/copy`), token-only CSS, existing `DESIGN.md` spec.

**Tags:** Design System, Component, Tooling

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

### Task 7: Prune Components stub
**Objective:** Eliminate the one-release redirect that now confuses first scan.
**Files:** `src/ds/routes.js`, `src/ds/pages-components.js`, `src/ds/ds.css`
**Verify:** `/ds/#/components` resolves to map or redirects to `#/primitives`; no dead-end table remains.

### Task 8: Coverage checklist
**Objective:** Make system completeness visible.
**Files:** `src/ds/pages-overview.js`, `src/ds/overview-sections.js`
**Verify:** Overview footer lists 5 checklist items with check/ gap state derived from existing sheets; no hardcoded claims.

### Task 9: Atlas regroup + polish
**Objective:** Keep tooling from crowding Foundations narrative.
**Files:** `src/ds/routes.js`, `src/ds/sidebar.js`, `src/ds/ds-responsive.css`
**Verify:** Atlas no longer in `Start` group; narrow-screen Foundations rail collapses or inner tabs overflow without clipping; `build` green.
