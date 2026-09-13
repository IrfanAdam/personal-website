# Baseline 2026-09-13 — refactor-manageability

> Freeze point before any file splits. Every later phase diffs against this. No behavior change allowed: pixels, audio, timing identical.

## Over-limit (>100 lines) — 13 files (2026-09-13, `wc -l src/**/*.js` + `src/**/*.css`)

| # | File | Lines |
|---|------|------:|
| 1 | `src/ds/functions/glitch.js` | 288 |
| 2 | `src/views/masonry/viewer.js` | 246 |
| 3 | `src/views/sound-palette.js` | 245 |
| 4 | `src/ds/pages-overview.js` | 227 |
| 5 | `src/ds/functions/scramble.js` | 217 |
| 6 | `src/ds/pages-changelog.js` | 205 |
| 7 | `src/views/masonry/gridReveal.js` | 192 |
| 8 | `src/views/masonry.js` | 192 |
| 9 | `src/ds/fx-lab.js` | 186 |
| 10 | `src/views/masonry/parallax.js` | 136 |
| 11 | `src/views/glitch.js` | 110 |
| 12 | `src/views/masonry/cells.js` | 109 |
| 13 | `src/views/audio-ctx.js` | 107 |

**CSS at cap (≤100 but packed):** `src/ds/ds.css` 99, `src/styles/base.css` 99, `src/styles/card.css` 96 — excluded from >100 count but flagged for Phase 3 readability restore.

**Total under `src/`: ~5,165 lines** (excl. generated `src/ds/changelog-manifest.json` ~805 lines, excluded from budget).

## Constraints (behavior freeze)

- `npm test` green: `npm run lint:tokens` + `vite build` (via `node scripts/ds-track.mjs && vite build`).
- Routes: `/`, `/#/projects/*` (e.g. `/#/projects/helix`), `/ds/#/changelog` Miller columns, masonry filter (`All / Concept / System / Motion`), reveal animation, viewer open/close + tethers, sound toggle `on/off` (hover proxy + hard off).
- `npm run ds:track` → `16 plans (12/12 tagged) · 88 DS commits · 0 wip · cont 20260909_145218_9888b1` at baseline.
- `npm run plan:names` → 0 missing.

## Rules for splits

- No split may change pixels/audio/timing; barrel re-exports preserve import paths during migration.
- Deletions need: `grep` 0 importers, `npm test` green, `dist/` check, `git stash` checkpoint (per AGENTS §5).
- Each phase runs `Draft → lint-manage → lint:tokens → test → smoke → 30s scan → fix` loop; max 3 rounds, 4th needs user override (`✗ cancelled` + blockquote reason).
- Commit trailer: `[plan:2026-09-13_193000-refactor-manageability.md#phase-0]` for this phase; port `5199` for smoke (never `:5173` — user's Safari server).

## Verification

```bash
wc -l $(find src scripts -type f -name "*.js" -o -name "*.css" | grep -v node_modules) | sort -rn | head -n 20
cat docs/baseline.md | head -n 20
npm test 2>&1 | tail -n 5
node scripts/smoke.mjs  # after Task 3
```
