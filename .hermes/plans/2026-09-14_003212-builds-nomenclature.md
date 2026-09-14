# Plan — Changelog keeps its name; every entry in it is a build

**Goal:** One vocabulary across ADAM/DS: the page — and the pipeline behind it — is the *changelog*, and every entry it lists (a plan, its phases, its commits) is a *build*. No "iteration" wording survives in code, copy, or the standing convention files.
**Architecture:** Page identity returns to `Changelog` (`src/ds/routes.js` label + hash, crumb in `src/ds/pages-changelog.js`), with the abandoned `#/builds` URL kept alive as a redirect alias in `src/ds/ds.js`. The unit vocabulary is renamed where it is defined (`changelog-parse.js` → `buildState`) and where it is consumed (`changelog/paint-plan.js`, `changelog-tasks.css` comments, empty-state noun). The card-name layer (`src/ds/changelog-names.json`) and the standing convention files (`README.md`, `AGENTS.md`, `.cursorrules`) carry the same word.
**Tech Stack:** Vite · vanilla ESM renderer · marked · node ds-track
**Tags:** Design System, Tooling

<!-- changelog: hide -->

---

## Phase 1 — Changelog page + build vocabulary {#phase-1}

*The page is called its own name again, and the thing it lists is a build everywhere it is named.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Restore the Changelog page identity | sidebar + route read `Changelog`, crumb `Start · Changelog`, `#/builds` redirects, drawer reads "Build detail" |
| 2 | Rename the entry vocabulary to build | no `iteration`/`iterState` left under `src/ds`; `Build N` in README/AGENTS/.cursorrules; names JSON title updated |
| 3 | Gates + browser proof | `plan:names` 0 missing · `ds:track` N/N tagged · `npm test` green · :5199 changelog + drawer cycle pass |

### Task 1: Restore the Changelog page identity ✓ done

**Objective:** Undo the page rename from the interrupted session: nav label, route hash and crumb go back to `Changelog`; the abandoned `#/builds` URL keeps working as a redirect.
**Files:** src/ds/routes.js, src/ds/ds.js, src/ds/pages-changelog.js, src/ds/foundations/pane-contract.js.
**Verify:** `#/builds` lands on `#/changelog`; sidebar shows `Changelog`; docs pane copy reads "Announced in the changelog."

### Task 2: Rename the entry vocabulary to build ✓ done

**Objective:** Every place that names the unit calls it a build: `iterState` → `buildState`, paint/CSS comments, the empty-state noun, the curated card title, and the `Iter N` line in the standing convention files.
**Files:** src/ds/changelog-parse.js, src/ds/changelog/paint-plan.js, src/ds/changelog-tasks.css, src/ds/changelog-names.json, README.md, AGENTS.md, .cursorrules.
**Verify:** no `iteration`/`Iter N` left in `src/ds`, README, AGENTS.md or .cursorrules outside git history and the manifest; `npm run plan:names` still 0 missing.

### Task 3: Gates + browser proof ✓ done

**Objective:** Full gate plus a real-browser pass on 5199: changelog renders, chips filter, a card opens the drawer, Escape and scrim close it.
**Files:** .hermes/plans/2026-09-14_003212-builds-nomenclature.md, src/ds/changelog-manifest.json.
**Verify:** `npm run lint:tokens` clean · `npm run build` green · :5199 pass.

*Shipped in 28e2e3b · Tasks 1–3 · phase-1.*
