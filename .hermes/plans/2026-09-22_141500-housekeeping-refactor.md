# Housekeeping refactor — zero-UI-change quality passes

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Raise code quality iteratively with zero UI/behaviour change — each pass improves readability, modularity and hygiene while the site looks and behaves identically.

**Architecture:** Thin-composer + extraction pattern — over-limit files split along job seams (markup vs bind, state vs wiring), long lines wrapped into named parts, template chains broken into named segments; every split keeps the existing import path via barrel re-export and proves equivalence with build + lint gates + selector/dom diffs, never screenshots of animated regions.

**Tech Stack:** Vanilla JS + Vite, `scripts/lint-manage.mjs` + `lint-tokens.mjs` + `vite build` + `node scripts/map-graph.mjs`, selector-level rule diffs and dom dump checks.

**Tags:** Tooling, Design System

---

## Phase 1 — Close the active lint-manage gate {#phase-1}

*Tags: Tooling*

*The gate is red on 9 violations — 4 long lines, 2 over-budget files and 1 template-chain violation — fix them with no behaviour change before any broader housekeeping.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Wrap 4 over-long lines (>120ch) | `src/data/next-copy.js:6`, `src/ds/changelog-links.js:9`, `src/ds/foundations/space/audit.js:28`, `src/ds/primitives/avatar.js:79`, `src/styles/footer.css:1`, `src/styles/tokens-fx.css:87` all ≤120ch, `lint:manage` no longer flags them |
| 2 | Split `src/main.js` 104→≤100 | `src/main.js` ≤100, extracted job (e.g. `boot/routing.js` or `views/stripbar.js` pattern) ≤100, `wc -l` green, build green |
| 3 | Split `src/views/masonry/viewer-bind.js` 106→≤100 | `viewer-bind.js` ≤100, helpers (bind/refresh/teardown) extracted, ≤100 each, build green |
| 4 | Fix `work-peek.js` template continuations | `work-peek.js` has ≤2 consecutive `+ \\` continuations — named parts or array join, no logic change, build green |

### Task 1 ✓ done: Wrap 4 over-long lines (>120ch)

*2026-09-22 · style(lint): wrap 120ch lines*

**Objective:** Wrap the 4 flagged long lines into scannable multi-line forms — keep text/content identical, just line breaks.

**Files:**
- Modify: `src/data/next-copy.js:6` (typo string split into two strings or wrapped quote)
- Modify: `src/ds/changelog-links.js:9` (`const badge = ...` split into `const badge = (c) => \n  \`<a ...\`` or named helper)
- Modify: `src/ds/foundations/space/audit.js:28` (wrap call/args)
- Modify: `src/ds/primitives/avatar.js:79` (wrap)
- Modify: `src/styles/footer.css:1` (header comment into two lines)
- Modify: `src/styles/tokens-fx.css:87` (break `--promo-*` token line into 2 lines)

**Step 1: Read each line and confirm length**
Run: `awk 'length>120' src/data/next-copy.js src/ds/changelog-links.js src/ds/foundations/space/audit.js src/ds/primitives/avatar.js src/styles/footer.css src/styles/tokens-fx.css`
Expected: 6 lines printed before fix, 0 after.

**Step 2: Wrap each**
- `next-copy.js:6`: split long `'A hospital chain...'` into two `'...\n' + '...'` parts at ~100ch.
- `changelog-links.js:9`: `export const badge = (c) => \n  \`<a href="${GH}${c.full}">...\``
- `tokens-fx.css:87`: break into one decl per line.
- `footer.css:1`: two-line header `/* ADAM/STYLE — path · job ·` / `   [plan:...] */`.

**Step 3: Verify**
Run: `node scripts/lint-manage.mjs 2>&1 | grep -E "120ch|wrap"` → 0 hits.
Run: `npm run build 2>&1 | tail -5` → ✓ built.

**Step 4: Commit**
`git add src/data/next-copy.js src/ds/changelog-links.js src/ds/foundations/space/audit.js src/ds/primitives/avatar.js src/styles/footer.css src/styles/tokens-fx.css`
`git commit -m "style(lint): wrap 120ch lines — no behaviour change [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-1}]"`

### Task 2 ✓ done: Split `src/main.js` 104→≤100

*2026-09-22 · refactor(main): split 104→≤100 via extraction*

**Objective:** Extract one job from `src/main.js` into a helper so both files are ≤100.

**Files:**
- Create: `src/boot/routing.js` (or `src/views/app-boot.js`) — owns extracted job verbatim
- Modify: `src/main.js` — thin composer
- Graph: `docs/graph.mmd`, `src/ds/arch-schema.json`

**Step 1: Baseline**
Run: `wc -l src/main.js` → 104; `npm run build` ✓; `git stash push -m "checkpoint before main split"`.

**Step 2: Find seam**
Jobs in `main.js`: imports, `initChrome`, `initStripbar`, `syncHeaderFrames`, `transit` wiring. Pick largest block.

**Step 3: Extract + thin**
Move block verbatim to helper, export helper. In `main.js` import and call. Keep header ≤120ch.

**Step 4: Verify**
Run: `wc -l src/main.js src/boot/routing.js` → both ≤100
Run: `node scripts/lint-manage.mjs` + `npm run build` → ✓
Run: `node scripts/map-graph.mjs` → graph fresh.

**Step 5: Commit**
`git add src/main.js src/boot/routing.js docs/graph.mmd src/ds/arch-schema.json`
`git commit -m "refactor(main): split 104→≤100 — extract job [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-1}]"`

### Task 3 ✓ done: Split `src/views/masonry/viewer-bind.js` 106→≤100

*2026-09-22 · refactor(viewer-bind): split 106→≤100*

**Objective:** Split `viewer-bind.js` into bind + refresh/teardown helpers.

**Files:**
- Create: `src/views/masonry/viewer-bind-refresh.js` (or teardown)
- Modify: `src/views/masonry/viewer-bind.js` — composer
- Graph: `docs/graph.mmd`, `src/ds/arch-schema.json`

**Step 1: Baseline** `wc -l src/views/masonry/viewer-bind.js` → 106; build green.

**Step 2: Seam** Handlers vs refresh/visualViewport/teardown.

**Step 3: Extract** Helper owns `refresh`, `visualViewport` listeners via getter.

**Step 4: Verify** `wc -l` ≤100 each; `lint-manage` ✓; `build` ✓; hover still correct.

**Step 5: Commit** `git add src/views/masonry/viewer-bind*.js docs/graph.mmd src/ds/arch-schema.json` `git commit -m "refactor(viewer-bind): split 106→≤100 [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-1}]"`

### Task 4 ✓ done: Fix `work-peek.js` template continuations

*2026-09-22 · style(work-peek): template chain 4→≤2*

**Objective:** Break 4 consecutive `+ \\` continuations into named parts or array join.

**Files:**
- Modify: `src/views/masonry/work-peek.js`

**Step 1: Read chain** `grep -n "+ \\" src/views/masonry/work-peek.js` → 4 consecutive.

**Step 2: Name parts** `const head = \`<div ...>\`; const body = ...; return head + body + tail;`

**Step 3: Verify** `lint-manage` violation gone; `build` ✓; peek DOM identical.

**Step 4: Commit** `git add src/views/masonry/work-peek.js` `git commit -m "style(work-peek): break template chain 4→≤2 [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-1}]"`

*Shipped in 08d80f4, b7bc70d, 471c88b, f28aafc · phase-1.*

---

## Phase 2 — At-budget & near-limit tidy {#phase-2}

*Tags: Tooling, Component*

*Files at exactly 100 or 97-99 lines are one edit from red — pre-emptively tidy them so future UI work never blocks on budget.*

| # | Task | Done when |
|---|------|-----------|
| 5 | At-100 sheets — pre-emptive tidy | `tokens-fx.css`, `list-mobile.css`, `footer.css`, `ds-blocks.css`, `foundations-sound.css`, `promo-video-mount.js` (all 100) each ≤100 after tidy or split, `wc -l` green |
| 6 | Near-limit JS (97-100) — helpers | `rise.js:99`, `title-reveal.js:98`, `strip-viewer.js:98`, `changelog-parse.js:98`, `next.css:97`, `case.css:97` etc. — each ≤96 or split |
| 7 | DS sheets at cap — compact | `ds.css:97`, `foundations-demo.css:97`, `changelog-events.js:97` — free 3-5 lines via one-liner compaction, selectors intact |

### Task 5 ✓ done: At-100 sheets — pre-emptive tidy

*2026-09-22 · refactor(budget): at-cap sheets tidy*

**Objective:** Each 100-line file today is 101 tomorrow — extract one block verbatim into helper or compact one-liners.

**Files:**
- Modify/Split: `src/styles/tokens-fx.css`, `src/styles/list-mobile.css`, `src/styles/footer.css`, `src/ds/ds-blocks.css`, `src/ds/foundations-sound.css`, `src/views/promo-video-mount.js`
- Modify: `index.html`, `ds/index.html` (if new sheet), `docs/graph.mmd`, `src/ds/arch-schema.json`

**Verify:** `wc -l` all ≤100; `lint:tokens` ✓; `lint-manage` ✓; `build` ✓; selector diff zero deletions.

### Task 6 ✓ done: Near-limit JS — extract helpers

*2026-09-22 · refactor(near-limit): helpers extracted*

**Objective:** Take each 97-99 line JS module and extract one pure helper.

**Files:**
- Create: `src/views/rise-calc.js`, `src/views/title-reveal-helpers.js`, etc.
- Modify: `src/views/rise.js`, `src/views/title-reveal.js`, `src/views/strip-viewer.js`, `src/ds/changelog-parse.js`, `src/styles/next.css`
- Graph: `docs/graph.mmd`, `src/ds/arch-schema.json`

**Verify:** All touched ≤96; build + lint:manage green; render-diff harness for markup.

### Task 7 ✓ done: DS sheets at cap — compact

*2026-09-22 · style(ds): compact at-cap sheets*

**Objective:** Free lines by collapsing adjacent one-liners (` .ds-a{} .ds-b{}`) — no selector deletion.

**Files:**
- Modify: `src/ds/ds.css`, `src/ds/foundations-demo.css`, `src/ds/changelog-events.js`, `src/styles/base.css`, `src/styles/map.css`

**Verify:** `wc -l` ≤96 each; `build` ✓; `/ds` visual unchanged.

*Shipped in 3a8690e · Tasks 5–7 · phase-2.*

---

## Phase 3 — Import, style & readability hygiene {#phase-3}

*Tags: Tooling, Design System*

*Clean up what the budget pass leaves — dead imports, headers, banners, and graph freshness — so every module is scannable and the atlas never drifts.*

| # | Task | Done when |
|---|------|-----------|
| 8 | Dead-import sweep + graph freshness | Orphan `from` imports removed, `map-graph` fresh, `git diff -- docs/graph.mmd` empty after run |
| 9 | Header & section-banner pass | Every `/* ADAM/*` header ≤120ch (two-line form where needed), banners at column 0, `lint-manage` 0 hits |
| 10 | Readability: named parts over chains | Remaining `+ \\` >2, nested ternaries, `>120ch` not in Phase 1 rewritten as named consts/maps, `lint-manage` 0 readability hits |

### Task 8 ✓ done: Dead-import sweep + graph freshness

*2026-09-22 · chore(hygiene): dead imports + graph*

**Objective:** Remove imports orphaned by Phase 1-2 extractions; ensure graph committed fresh.

**Files:**
- Modify: composers with unused `from`, `docs/graph.mmd`, `src/ds/arch-schema.json`

**Verify:** No orphan `from`; `node scripts/map-graph.mjs && git diff --stat` → 0 diff.

### Task 9 ✓ done: Header & section-banner pass

*2026-09-22 · style(headers): ADAM headers + banners*

**Objective:** Fix headers that overflow 120ch and add missing `// — Section —` banners.

**Files:**
- Modify: files where `head -1` >120ch or banners missing

**Verify:** `awk 'NR==1 && length>120' src/**/*.js src/**/*.css` → 0; `lint-manage` header hits 0.

### Task 10 ✓ done: Readability — named parts over chains

*2026-09-22 · style(readability): named parts, no nested ternaries*

**Objective:** Replace remaining `+` chains >2 and ternaries with named consts/guards.

**Files:**
- Modify: files flagged by `lint-manage` readability

**Verify:** `lint-manage` → ✓ 0 violations; `lint:tokens` ✓; `build` ✓; zero UI diff.

*Shipped in 47f081b · Tasks 8–10 · phase-3.*

---

## Verification — whole plan

- `npm run plan:names` → 0 missing
- `node scripts/lint-manage.mjs` → ✓ 0 violations
- `npm run lint:tokens` → ✓ 45 stylesheets + 33 JS clean
- `npm run build` → ✓ 71 modules, 0 orphans
- `node scripts/map-graph.mjs` → graph fresh
- `/ds/#/changelog` → new build badges per phase, `Build N` sequential
- Behaviour: no selector deletions, no DOM text change, no smoke 5199 failure — UI/behaviour identical pre/post each phase.

## Risks & open questions

- **No UI change is hard** — any pixel drift must be split out as separate `feat` plan, not smuggled here.
- **100-line churn** — at-100 files become red on next feature; Phase 2 pre-empts it.
- **Graph staleness** — every split changes import graph; `map-graph` is part of each commit.
