# Atlas canvas fullscreen stage

**Goal:** Give the `/ds/#/atlas` canvas a fullscreen toggle — the 68vh embedded stage expands to a viewport overlay, with an explicit close (✕) plus Escape, and the camera re-fits to the new aspect.

**Architecture:** The stage (`#atlasStage` → `.atlas-stage`) gains an `is-full` class that switches it to a fixed viewport overlay; a new chip in the existing dock (`#atlasFull`) toggles it and an overlay close button (`#atlasClose`) exits. Both live in the atlas shell markup and are wired by a new single-job module `ds/atlas/fullscreen.js`, which calls the same `onResize` handler the route already binds to `window.resize` so the refit path is shared, never duplicated. Styles go to a NEW stylesheet (`ds/atlas-full.css`) — `atlas.css` is at 91/100 lines.

**Tech Stack:** ES modules (Vite), SVG atlas canvas, CSS class toggle + one z-index token.

**Tags:** Component, Layout

---

## Phase 1 — Fullscreen stage overlay {#phase-1}

*Expand the atlas stage to the viewport, close explicitly (✕ / chip / Escape), and keep the camera honest.*

*Tags: Component, Layout*

| # | Task | Done when |
|---|------|-----------|
| 1 | Markup: dock chip + overlay close | `#atlasFull` sits in the dock; `#atlasClose` (hidden) sits in the stage |
| 2 | Wiring: fullscreen.js | Chip/✕/Escape toggle `is-full`, `body.atlas-full` locks scroll, refit runs after layout |
| 3 | Styles: atlas-full.css | Overlay covers the viewport in all three themes; `atlas.css` stays ≤100 lines |

**Files:** modify `src/ds/atlas/shell.js`, `src/ds/atlas/dock.js`, `src/ds/pages-atlas.js`, `src/ds/ds.css` (one z token), `ds/index.html` (one `<link>`); create `src/ds/atlas/fullscreen.js`, `src/ds/atlas-full.css`.

### Task 1: Markup — dock chip + overlay close ✓ done

**Objective:** Controls exist in the shell markup, inert until wired.

**Files:** `src/ds/atlas/dock.js` (`dockHTML` gains the `#atlasFull` chip), `src/ds/atlas/shell.js` (`#atlasClose` in the stage).

**Verify:** Fresh load of `#/atlas` renders both nodes; no console errors.

Verified: fresh load of `#/atlas` renders `#atlasFull` in the dock (aria-pressed="false") and the hidden `#atlasClose` in the stage, zero console errors; `bindDock` ignores `[data-full]` so the chip never fires the layer/kind `apply()` path.

### Task 2: Wiring — fullscreen.js ✓ done

**Objective:** One module owns the toggle: class + body lock + aria state + refit.

**Files:** create `src/ds/atlas/fullscreen.js`; wire it in `src/ds/pages-atlas.js` (mount + cleanup).

**Verify:** Chip enters fullscreen (`is-full` + pressed aria), ✕ and Escape exit, Escape in fullscreen must NOT clear the atlas selection, refit runs on both transitions, unbind on route leave.

Verified by clicking the real controls: chip → stage goes `946x432` embedded → `1280x633` fixed overlay (canvas 430 → 599 px) with `body.atlas-full` set, chip pressed, ✕ shown, and the camera refits for the new aspect (`55% → 58%`); ✕ and Escape both restore the embedded state exactly (`946x432`, canvas 430, `55%`); with a node pinned, Escape exits fullscreen and keeps the inspector, and only the second Escape clears the selection; 3 open/close cycles clean; leaving the route while fullscreen removes `body.atlas-full`.

### Task 3: Styles — atlas-full.css ✓ done

**Objective:** The overlay reads as a fullscreen canvas in system/light/dark; tokens only.

**Files:** create `src/ds/atlas-full.css`, add `--z-ds-full` to the `src/ds/ds.css` token block, one `<link>` in `ds/index.html`.

**Verify:** `npm run lint:tokens` clean; overlay covers the viewport, dock/legend stay in-viewport, `atlas.css` still ≤100 lines.

Verified: `lint:tokens` clean (36 stylesheets); the overlay is `position: fixed` covering the viewport in system/light/dark with the stage background swapping per theme (`rgb(236,238,242)` light / `rgb(18,21,26)` dark) and the ✕ readable in both; `atlas.css` untouched at 91/100 lines.

*Shipped in 48787ef · Tasks 1–3 · phase-1.*

---

## Phase 2 — Verify + ship {#phase-2}

*The toggle joins the standing atlas gate; every route stays err-free.*

*Tags: Tooling*

| # | Task | Done when |
|---|------|-----------|
| 4 | Gate + browser sweep | lint-manage + lint:tokens + build + smoke green; `#/atlas` fullscreen cycle verified on a fresh load ×3, 16 ds routes + public map err-free |
| 5 | Close-out | Tasks marked, shipped line cites the code commit, `ds:track` 0 unlinked, manifest refreshed |

**Files:** none (verification) + plan doc marks.

### Task 4: Gate + browser sweep ✓ done

**Objective:** Prove the toggle on a fresh load (HMR state lies) and prove no other route regressed.

**Verify:** open → ✕ → re-open → Escape ×3 cycles clean; refit changes the camera on both transitions; widget count and readout unchanged; all 16 ds routes + `/#/lab/architecture` zero console errors.

Verified: `lint:manage` clean (regenerated graph + schema committed), `lint:tokens` ✓, `npm run build` ✓, `smoke` on 5199 ✓; freshly-loaded sweep with zero console errors on all 16 ds routes (incl. `#/atlas`) plus `/#/lab/architecture` and the main page; fullscreen cycle re-proved on a fresh load (chip/✕/Esc ×3).

### Task 5: Close-out ✓ done

**Objective:** Archive the scope like every DS phase.

**Verify:** `npm run plan:names` 0 missing; `npm run ds:track` tagged == phased, 0 unlinked; tasks marked `✓ done` with the code sha in `*Shipped in*`; commits: feat `[plan:2026-09-14_192124-atlas-fullscreen.md#phase-1]`, chore close-out, `chore(ds): track refresh`.

Verified: `plan:names` 22 names · 0 missing (`18/18 tagged` in `ds:track`); tasks marked `✓ done` with the code sha in the shipped lines; commits `48787ef` (feat) + close-out + `chore(ds): track refresh`, all carrying the `atlas-fullscreen` trailer.

*Shipped in 48787ef · Tasks 4–5 · phase-2.*
