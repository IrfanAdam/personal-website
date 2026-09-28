# Code cleanup & perf — lint, bundle, runtime (no images)

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Cut bundle waste and lint violations without any visual change — lint green, warnings gone, first-paint JS smaller, no new requests, images untouched per request.

**Architecture:** Phase 1 closes the 10 `lint:manage` failures + Vite CSS/JS warnings (wrapping, splits, extraction). Phase 2 introduces real code-splitting (`routing` dynamic imports + `manualChunks`) and consolidates the 32 blocking stylesheet links to a single prod-equivalent bundle order. Phase 3 removes runtime waste (`preloadHeroes` eager fetch, font display, unused `FILES` entries) and proves zero regression via build + viewport smoke.

**Tech Stack:** Vite 5 (`vite.config.js` rollupOptions), vanilla route hash router (`src/boot/routing.js`), `scripts/lint-manage.mjs` / `lint-tokens.mjs`, `src/views/sound-files.js` + `FILES_META`, `src/views/strip-viewer-helpers.js`.

**Tags:** Tooling, Layout, Component

<!-- changelog: hide -->

---

## Phase 1 — Lint gate + build warnings clean {#phase-1}
*Tags: Tooling*

*Shipped in d3fd5b8 · Tasks 1–4 · phase-1.*

*`npm test` does not gate manage lint, but `lint:manage` fails (10) and `vite build` warns (`repeating-linear-gradient` CSS + `sound-palette.js` dual import). This phase makes both clean with zero visual diff, keeping every file ≤100 lines one-statement-per-line.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Wrap 7 long lines ≤120ch | `src/ds/foundations/fx/elev.js:10`, `pane-motion.js:36`, `functions/glimmer-orb.js:37`, `functions/shimmer.js:32`, `functions/viewer.js:31`, `overview/elements-map.js:1`, `pages-special.js:28` wrapped, `lint:manage` no longer reports them |
| 2 | Extract over-limit files to ≤100 | `src/ds/foundations/sound/board.js 106→≤100` + `src/ds/pages-foundations.js 105→≤100` via extract-module + barrel re-export, no packed lines |
| 3 | Branch nested ternary | `src/ds/functions/glimmer-orb.js:78` ternary replaced with `if/else`, `lint:manage` ternary rule clean |
| 4 | Silence Vite warnings | `tokens-color.css` repeating-linear-gradient wrapped in `/* css-syntax */` comment or split syntax so Vite minify warning gone; `sound-palette.js` kept static only (remove dynamic `import()` in `src/views/audio-test.js` or vice-versa, verify `ds-CRRpEWaK.js` hash stable) |

### Task 1: Wrap 7 long lines ✓ done
**Objective:** No line >120ch in the 7 files.
**Files:**
- Modify: `src/ds/foundations/fx/elev.js:10`
- Modify: `src/ds/foundations/pane-motion.js:36`
- Modify: `src/ds/functions/glimmer-orb.js:37`
- Modify: `src/ds/functions/shimmer.js:32`
- Modify: `src/ds/functions/viewer.js:31`
- Modify: `src/ds/overview/elements-map.js:1`
- Modify: `src/ds/pages-special.js:28`
**Verify:** `npm run lint:manage 2>&1 | grep -c "line >120ch"` → `0`; `npm run build` still greens.

### Task 2: Extract over-limit files ✓ done
**Objective:** Both over-limit files ≤100 lines, headers + `// — Section —` banners retained, behavior unchanged.
**Files:**
- Modify: `src/ds/foundations/sound/board.js` → extract e.g. `board-helpers.js` or `board-data.js`, re-export
- Modify: `src/ds/pages-foundations.js` → extract e.g. `pages-foundations-core.js`, re-export
- Verify barrel has `export * from './board-helpers.js'` and consumers untouched
**Verify:** `wc -l src/ds/foundations/sound/board.js src/ds/pages-foundations.js` both ≤100; `npm run build` + `node scripts/map-graph.mjs` no orphans.

### Task 3: Branch nested ternary ✓ done
**Objective:** `glimmer-orb.js:78` readable branch.
**Files:**
- Modify: `src/ds/functions/glimmer-orb.js:78`
**Verify:** `lint:manage` no `nested ternary` report; rancher viewport of that DS panel still renders.

### Task 4: Silence Vite warnings ✓ done
**Objective:** `vite build` warnings list empty (no CSS syntax warning, no `sound-palette.js` dynamic+static warning).
**Files:**
- Modify: `src/styles/tokens-color.css:41-44` (split `repeating-linear-gradient` decls, one per line, or add expected comment)
- Modify: `src/views/audio-test.js` or `src/ds/foundations/sound/synth-render.js` + `src/views/element-sound.js` + `src/views/glitch-sound.js` + `src/views/glitch-sound/parse.js` (resolve dual import)
**Verify:** `npm run build 2>&1 | grep -E "WARNING|dynamically imported"` → empty; `lint:tokens` clean.

*Shipped in <sha> · Tasks 1–4 · phase-1.*

---

## Phase 2 — Route code-split + chunk hygiene {#phase-2}
*Tags: Tooling, Layout*

*Shipped in aef3a76 · Tasks 5–7 · phase-2.*

*Current `src/boot/routing.js` eagerly imports 5 routes + `src/main.js` imports chrome; prod `main` 111.9 kB / `ds` 967 kB is one chunk per entry with no `manualChunks`. 32 `<link rel=stylesheet>` are render-blocking in dev (prod bundles to 1 CSS but dev waterfall remains). This phase keeps token order and visuals identical while splitting code.*

| # | Task | Done when |
|---|------|-----------|
| 5 | Route-level dynamic import | `src/boot/routing.js` uses `() => import('../views/masonry.js')` etc for `Project`, `Contact`, `Map`, `MinimalLab`; hashchange `await`s and caches; first-paint JS drops ≥20k gz, `main-Dw_7G1AO.js` smaller |
| 6 | Vite `manualChunks` | `vite.config.js` adds `build.rollupOptions.output.manualChunks` splitting `ds` vs `vendor` vs `main`, `build.chunkSizeWarningLimit` tuned; `ds-CRRpEWaK.js` no longer warns >500k without reason |
| 7 | Stylesheet consolidation | `index.html` 32 links reduced to prod-equivalent order via single barrel (`src/styles/app.css` importing in source order) or JS `import` chain in `src/main.js`; `dist/assets/main-Dm30KPgn.css` hash stable, no FOUC, `lint:tokens` clean |

### Task 5: Route-level dynamic import ✓ done
**Objective:** No eager route code in initial chunk.
**Files:**
- Modify: `src/boot/routing.js:2-6` → `const loadMasonry = () => import('../views/masonry.js')` etc, `async route()` with cache map
- Test: navigate hash `#/`, `#/projects/helix`, `#/contact`, `#/lab/architecture`, back to `#/masonry` in smoke
**Verify:** `npm run build` shows new chunks (e.g. `assets/masonry-*.js`, `assets/project-*.js`); `main-*.js` gzip <37k or measurably smaller; all routes render.

### Task 6: Vite manualChunks ✓ done
**Objective:** DS bulk isolated, vendor deduped, warnings actionable.
**Files:**
- Modify: `vite.config.js` — add `output.manualChunks: { vendor: id => id.includes('node_modules'), ds: id => id.includes('/src/ds/') }` or similar, keep `input: { main, ds }`
**Verify:** `npm run build` chunk list includes `ds-*.js`, `vendor-*.js`, `main-*.js`; `dist/ds-CRRpEWaK.js` equivalent not 967k in one blob; `ds-track` still 0 wip.

### Task 7: Stylesheet consolidation ✓ done
**Objective:** Dev waterfall reduced without changing prod semantics.
**Files:**
- Create: `src/styles/app.css` (if barrel approach) importing token layers + feature sheets in index.html order
- Modify: `index.html` (32 links → 1 link to barrel) or keep links but move to `src/main.js` imports and let Vite bundle; verify order matches previous
- Modify: `src/main.js` (add `import '../styles/app.css'` if JS-import approach)
**Verify:** Prod `dist/assets/main-*.css` byte-identical order (diff `cat` before/after); Lighthouse dev `link` count drops; no visual regression in masonry/project/map.

*Shipped in <sha> · Tasks 5–7 · phase-2.*

---

## Phase 3 — Runtime waste cut + no-regression prove {#phase-3}
*Tags: Tooling, Component*

*Shipped in ff0b77f · Tasks 8–11 · phase-3.*

*Even with smaller bundles, runtime still fetches all heroes eagerly and holds a micro-tick sound fetch. Fonts block without `display=swap`, and 16 `FILES` ship sounds never used beyond DS demos. All are invisible changes — verified by network + build + screenshots.*

| # | Task | Done when |
|---|------|-----------|
| 8 | Remove eager `preloadHeroes` | `src/views/strip-viewer-helpers.js:18` + `src/views/strip-viewer.js:14` no longer preload `HERO` on mount; hover still `decode()`s on demand; Network panel shows 0 hero fetches before first hover |
| 9 | Fonts `display=swap` + preload | `index.html:14` Google Fonts URL gains `&display=swap`, add `font-display: swap` verified in `tokens-type.css`; optional `rel=preload as=style` without blocking |
| 10 | Sound FILES hygiene (no deletion without proof) | Verify `public/sounds/scifi-weapon.wav 153K` + `weapon_scifi_laser.wav 223K` + `window-open.mp3 65K` usage: if no importer beyond DS demos, mark for deletion per Rule 10 (grep 0 importers + `build`+`smoke` + `git stash` checkpoint); else document retention reason; `hover.wav` vs `hover` mp3 dedup note |
| 11 | Final verification | `npm run lint:tokens && npm run ds:track && npm run build` green, `npm run smoke` passes on `/#`, `#/projects/fluxx`, `#/contact`, `#/lab/architecture`; 30s newcomer scan of masonry/project/map clean |

### Task 8: Remove eager preloadHeroes ✓ done
**Objective:** No speculative hero network until hover.
**Files:**
- Modify: `src/views/strip-viewer.js:14` — remove `preloadHeroes()` call
- Modify: `src/views/strip-viewer-helpers.js:18` — keep `preloadHeroes` exported for DS lab but not auto-invoked, or remove export if `grep -r preloadHeroes` shows only this call
**Verify:** Fresh load + Network idle → filter `heroes` shows 0 before hover, 1 after hovering strip link; `strip-viewer` pop still shows within 100ms after `decode()`.

### Task 9: Fonts display swap ✓ done
**Outcome 2026-09-28:** verify-only — `&display=swap` already on the Google Fonts URL, no local
`@font-face` in `src/styles/`. Nothing changed.
**Objective:** Text visible during font load.
**Files:**
- Modify: `index.html:14` — append `&display=swap` to Google Fonts URL, ensure `rel=preconnect` stays
- Verify: `src/styles/tokens-type.css` already has `font-display` tokens if any `@font-face`; no layout shift
**Verify:** Throttle Fast 3G, reload — system font shows then swaps, no FOIT.

### Task 10: Sound FILES hygiene ✓ done
**Outcome 2026-09-28:** retained all three — `window-open.mp3` plays on hero pull (`rise-sound.js`),
`scifi-weapon.wav` is the scramble default (`sound-source.js`), `weapon_scifi_laser.wav` stays as a DS lab
option (FILES lists + lab dropdowns reference it; deletion would 404 local-first). No deletion made.
**Objective:** No unused 376K sounds shipped without justification.
**Files:**
- Read: `src/views/sound-files.js` (FILES), `src/ds/foundations/sound/data.js` (FILES_META), `src/ds/functions/grid-reveal-lab.js` sound options
- Action: `grep -r "scifi-weapon\|weapon_scifi\|window-open" src --include="*.js" | grep -v "FILES"` to prove usage; if only DS demo strings, keep but note; if truly 0 importers, `git stash` checkpoint then delete files + FILES entry + dist check
**Verify:** `npm run build` still serves `audio-test` demo (if retained); `dist/assets` no longer references deleted ids; deletion follows Rule 10.

### Task 11: Final verification ✓ done
**Objective:** Prove no breakage.
**Files:**
- Run: `npm run lint:tokens` → clean
- Run: `npm run ds:track` → `0 wip · cont 20260909_145218_9888b1`
- Run: `npm run build` → warnings empty, chunks expected from Phase 2
- Run: `npm run smoke` (or manual hash smoke per AGENTS.md)
- Visual: screenshots of masonry grid + list, project detail, map — no pixel diff vs. pre-plan baseline
**Verify:** All 4 checks logged in commit trailer `build` run; checker would open `/ds/#/changelog` Miller columns — no new wip.

*Shipped in <sha> · Tasks 8–11 · phase-3.*

---

## Risks & mitigations
- **Dynamic import hash routing:** Keep `location.hash` sync, handle rapid hashchange races with cancellation token; fallback to eager import if `import()` fails.
- **CSS barrel order sensitivity:** Token layers (`tokens.css` → `tokens-color` → `tokens-type` → `tokens-fx` → `tokens-promo` → `tokens-dark` → `tokens-overrides`) must stay source order — barrel `@import` order or JS import order must mirror `index.html` exactly.
- **Sound deletion false positive:** Rule 10 requires `grep 0 importers` across `src/`; `FILES_META` demo strings are not importers — but deleting breaks DS sound labs; default is retain unless truly orphaned, with `git stash` checkpoint.

## Out of scope (explicit)
- **Images** — `public/images` 57M + `dist` 79M, variants/AVIF, `next-preview` etc are excluded per 2026-09-28 user request; no image compression or payload changes in this plan.

## Validation checklist
- [ ] `npm run plan:names` → 0 missing (add `2026-09-28_130000-code-cleanup-perf.md` entry before first phase commit)
- [ ] `npm run ds:track` → 43+1 plans tagged, 0 wip after each phase shipped (1 wip expected only between plan file creation and first trailer commit)
- [ ] `npm run lint:tokens` clean, `npm run lint:manage` clean (was 10, becomes 0), `npm run build` warnings 0
- [ ] Visual smoke on `/`, `/#/projects/*`, `/#/contact`, `/#/lab/architecture`
