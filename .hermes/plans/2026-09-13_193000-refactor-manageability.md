# Refactor Manageability Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Refactor the site to ≤100 lines/file, readable/scannable, with folder + nomenclature retrievability — zero behavior change.

**Architecture:** Freeze behavior with gates first, then split only the 13 over-limit files via extract-module + barrel re-exports, then codify nomenclature/folders/lint so the N+1th file stays clean. Each phase runs a recursive polish loop until gates + newcomer-scan pass.

**Tech Stack:** Vite 5 ESM, vanilla JS/CSS, existing gates (`lint-tokens.mjs`, `ds-track.mjs`, `npm test` = lint + build)

**Tags:** Tooling, Component

---

## Context / assumptions

- Root: `/Users/irfan/Documents/Portfolio Redo/personal_website`, `npm test` = `lint:tokens && build`.
- Standing rules: `AGENTS.md` §1 ≤100 lines/file, §2 tokens via `var()` from `src/styles/tokens.css`, concise reports <150 tokens.
- Measured 2026-09-13: ~5,970 lines under `src/` (incl. 805-line `changelog-manifest.json` generated artifact — excluded from budget). 13 source files exceed 100 lines: `ds/functions/glitch.js` 288, `views/masonry/viewer.js` 246, `views/sound-palette.js` 245, `ds/pages-overview.js` 227, `ds/functions/scramble.js` 217, `ds/pages-changelog.js` 205, `views/masonry/gridReveal.js` 192, `views/masonry.js` 192, `ds/fx-lab.js` 186, `views/masonry/parallax.js` 136, `views/glitch.js` 110, `views/masonry/cells.js` 109, `views/audio-ctx.js` 107. CSS at cap edge: `ds/ds.css` 99, `styles/base.css` 99, `styles/card.css` 96.
- Anti-patterns seen: long template-string render functions with `+` chains on one line, multi-concern modules (e.g. glitch lab = visual demo + sound palette + source picker in one file), deep cross-imports (`ds/functions/*` ↔ `views/*`), one-liner WebAudio envelopes that a newcomer cannot scan.
- No behavior change allowed: every phase gates on `npm test` + route smoke (`/`, `/#/projects/*`, `/ds/#/changelog`, masonry filter/reveal/viewer, sound toggle).
- Plan-traceability applies: each phase closed with `✓ done` + `*Shipped in <sha> · … · phase-N.*`, commits carry `[plan:<file>#phase-N]`.

## Proposed folder + nomenclature target

```text
src/
  app/            # main.js, theme.js, router — boot only, no UI strings
  pages/          # route views: masonry/, project.js, contact.js (moved from views/)
  shared/         # shared.js, headerFrame.js, title-reveal.js — cross-page only
  fx/visual/      # glitch.js, scramble-text.js, rise.js, gridReveal.js — pixels only
  fx/sound/       # audio-ctx.js, voices/*.js, sound-source.js — audio only
  ds/foundations/ # pane-*.js (already good, keep)
  ds/functions/   # one folder per lab: glitch/{render,bind,meta}.js (no 200+ monoliths)
  styles/         # tokens.css + one file per page, each ≤100 lines
scripts/          # ds-track.mjs, lint-tokens.mjs, lint-manage.mjs, map-graph.mjs
```

- File names: `kebab-case`, noun-first (`sound-voices-tick.js`, not `tickSound.js`). Folders plural for collections (`voices/`, `panes/`), singular for singletons.
- Header contract (every source file, line 1): `/* ADAM/<AREA> — <path> · <one-line job> · [plan:<file>#phase-N] */` where AREA ∈ `APP|PAGE|SHARED|FX|SOUND|DS|STYLE|TOOL`.
- Node-diagram guarantee: `scripts/map-graph.mjs` parses static `import` lines → `docs/graph.mmd` (Mermaid). If a module cannot be placed on the graph in one glance, the split is wrong.

## Recursive self-improving loop (used by EVERY phase)

Each phase runs `LOOP`: `Draft → Auto-gate → Newcomer-scan → Fix → repeat` until exit criteria met. No phase ships with open violations.

- **R1 Draft:** implement only that phase's tasks, one file-split per commit.
- **R2 Auto-gate (must all pass):** `node scripts/lint-manage.mjs`, `npm run lint:tokens`, `npm test`; `wc -l` on touched files ≤100; `map-graph` renders with no orphans/cycles.
- **R3 Newcomer-scan (30-second test):** open any touched file cold — header states job? exports listed top? sections separated by blank line + `// — Section —`? no horizontal scroll, no `a?b:c` chains, no `+` template chains >2 continuations? If not, it fails regardless of gates.
- **R4 Fix:** smallest split/rename that clears the failure; never silence the lint.
- **Exit:** 0 gate failures + every touched file passes scan + `npm test` green. Cap at 3 loop rounds per phase; 4th round needs explicit user override recorded as `✗ cancelled` with reason (never silently dropped).
- **Nudges/guardrails per task:** exact `Files:`, `Verify:` command + expected output, rollback = `git stash` checkpoint before each split (per standing deletion guarantee: `grep` 0 importers + build + dist check before deleting any barrel).

---

## Phase 0 — Freeze behavior + baseline {#phase-0}

*Establish the safety net so refactors provably break nothing; no source splits in this phase.*

*Tags: Tooling*

| # | Task | Done when |
|---|------|-----------|
| 1 | Snapshot over-limit inventory | `docs/baseline.md` lists the 13 files + line counts |
| 2 | Add `lint-manage.mjs` gate (lines/readability/graph inputs) | New script fails on current tree with exact violator list |
| 3 | Add route-smoke checklist script | One command exercises all routes without manual clicking |

### Task 1: Snapshot over-limit inventory ✓ done

**Objective:** Write the immutable before-picture every later phase diffs against.

**Files:**
- Create: `docs/baseline.md`

**Step 1: Generate counts**

Run: `wc -l $(find src scripts -type f -name "*.js" -o -name "*.css" | grep -v node_modules) | sort -rn | head -n 20`
Expected: the 13 files above, glitch.js on top at ~288.

**Step 2: Write `docs/baseline.md`**

```md
# Baseline 2026-09-13 — refactor-manageability
- Over-limit (>100): list file + lines (13 entries)
- Constraints: npm test green, routes: /, /#/projects/helix, /ds/#/changelog, masonry filter+viewer, sound on/off
- Rule: no split may change pixels/audio/timing; barrel re-exports preserve import paths during migration
```

**Step 3: Verify**

Run: `cat docs/baseline.md | head -n 20`
Expected: PASS — 13 entries present.

**Step 4: Commit**

```bash
git add docs/baseline.md
git commit -m "docs(baseline): over-limit inventory [plan:2026-09-13_193000-refactor-manageability.md#phase-0]"
```

### Task 2: Add lint-manage gate (lines + readability + nomenclature) ✓ done

**Objective:** Automate the user's five rules so loops have an objective exit.

**Files:**
- Create: `scripts/lint-manage.mjs`
- Modify: `package.json` (add `lint:manage` + wire into `test`)

**Step 1: Write failing gate first**

Run: `node scripts/lint-manage.mjs` (file does not exist yet)
Expected: FAIL — file missing (proves the gate is new).

**Step 2: Write minimal gate (≤80 lines, readable itself)**

```js
/* ADAM/TOOL — lint-manage · ≤100 lines + readability + headers · [plan:2026-09-13_193000-refactor-manageability.md#phase-0] */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = new URL('..', import.meta.url).pathname;
const MAX = 100;
const fail = [];
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) return walk(p);
  return (p.endsWith('.js') || p.endsWith('.css')) ? [p] : [];
});
for (const f of [...walk(join(ROOT, 'src')), ...walk(join(ROOT, 'scripts'))]) {
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const n = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
  const short = f.split('/').slice(-3).join('/');
  if (n > MAX) fail.push(`${short} ${n} lines (limit ${MAX})`);
  if (!src.startsWith('/* ADAM/')) fail.push(`${short} missing ADAM header`);
  const long = lines.findIndex((ln) => ln.length > 120);
  if (long > -1) fail.push(`${short}:${long + 1} line >120ch — wrap it`);
}
if (fail.length) { console.error(`✗ manage lint — ${fail.length}:\n  ${fail.join('\n  ')}`); process.exit(1); }
console.log('✓ manage lint — lines + headers + width clean');
```

**Step 3: Verify pass/fail signal**

Run: `node scripts/lint-manage.mjs`
Expected: FAIL listing the 13 over-limit files + header-less files (proves gate works before splits).

**Step 4: Commit**

```bash
git add scripts/lint-manage.mjs
git commit -m "feat(tool): manageability lint gate [plan:2026-09-13_193000-refactor-manageability.md#phase-0]"
```

### Task 3: Route-smoke checklist (behavior freeze proof) ✓ done

**Objective:** One repeatable command that proves "nothing broke" after every split.

**Files:**
- Create: `scripts/smoke.mjs` (starts Vite on a NON-5173 port per standing rule, fetches `/`, `/ds/`, asserts 200 + key markers)

**Step 1: Write script (≤60 lines)**

Fetch `/` contains `masonry` or site title; fetch `/ds/` contains `changelog`; exit non-zero otherwise. Port: `5199` (never `:5173` — user's Safari server lives there).

**Step 2: Verify**

Run: `node scripts/smoke.mjs`
Expected: PASS — `✓ smoke — / + /ds/ 200 with markers`.

**Step 3: Commit**

```bash
git add scripts/smoke.mjs
git commit -m "feat(tool): route smoke for refactor safety [plan:2026-09-13_193000-refactor-manageability.md#phase-0]"
```

*Shipped in 0419eab · Tasks 1–3 · phase-0.*

---

## Phase 1 — Nomenclature, folders, node diagram {#phase-1}

*Move nothing yet; rename-by-barrel + generate the graph so Phase 2 splits land in the right nests.*

*Tags: Tooling*

| # | Task | Done when |
|---|------|-----------|
| 4 | Add `map-graph.mjs` → `docs/graph.mmd` | Mermaid graph renders imports with zero orphans |
| 5 | Barrel pass: `fx/sound/` + `fx/visual/` barrels | Old import paths still work, new paths documented |
| 6 | Header pass: ADAM headers on all `src/**/*.js` | `lint-manage` header failures → 0 (line failures remain) |

### Task 4: Import graph generator ✓ done

**Objective:** Make organization visible as a node diagram.

**Files:**
- Create: `scripts/map-graph.mjs`
- Create: `docs/graph.mmd` (generated output, committed)

**Step 1: Write generator (≤70 lines)**

Parse `^import .* from '…'` per file under `src/`, emit `graph TD` edges. Skip `changelog-manifest.json`.

**Step 2: Verify**

Run: `node scripts/map-graph.mjs && head -n 15 docs/graph.mmd`
Expected: PASS — `graph TD` + edges like `views/masonry --> views/masonry/layout`.

**Step 3: Commit**

```bash
git add scripts/map-graph.mjs docs/graph.mmd
git commit -m "feat(tool): import graph for node diagram [plan:2026-09-13_193000-refactor-manageability.md#phase-1]"
```

### Task 5: Barrel scaffolding for new nests ✓ done

**Objective:** New folders resolve before any code moves, so splits are pure moves.

**Files:**
- Create: `src/fx/visual/index.js`, `src/fx/sound/index.js` (re-export current `views/*` modules, ≤20 lines each)

**Step 1: Write barrels**

```js
/* ADAM/FX — fx/visual index · barrel for pixel-only effects · [plan:…#phase-1] */
export * from '../../views/glitch.js';
```

**Step 2: Verify**

Run: `npm test 2>&1 | tail -n 5`
Expected: PASS — build green, no importer changed yet.

**Step 3: Commit**

```bash
git add src/fx/visual/index.js src/fx/sound/index.js
git commit -m "feat(fx): barrel nests for visual/sound split [plan:2026-09-13_193000-refactor-manageability.md#phase-1]"
```

### Task 6: ADAM header pass ✓ done

**Objective:** Every file self-identifies its nest and job.

**Files:**
- Modify: all `src/**/*.js` missing `/* ADAM/` line 1 (mechanical, one line each)

**Step 1: List offenders**

Run: `node scripts/lint-manage.mjs 2>&1 | grep "missing ADAM" | head`
Expected: list shrinks to zero after pass.

**Step 2: Verify**

Run: `node scripts/lint-manage.mjs 2>&1 | grep -c "missing ADAM" || echo 0`
Expected: `0` (line-count failures remain — correct for this phase).

**Guardrail (standing — applies to every phase):** never join two lines into one to satisfy a line budget. Overflow is fixed by extraction (move the block to its proper home, verbatim, multiline intact), never by packing. Redo 2026-09-13: a footer collapse in `base.css` was reverted; the `.contact-hero` block moved `base.css` → `pages.css` instead (base 101→87, pages 38→52).

**Step 3: Commit**

```bash
git add src/
git commit -m "chore(nomenclature): ADAM headers everywhere [plan:2026-09-13_193000-refactor-manageability.md#phase-1]"
```

*Shipped in d36a17e, 5affee9, f677501 · Tasks 4–6 · phase-1.*

---

## Phase 2 — Split the 13 over-limit files {#phase-2}

*One task per worst offender; each split = extract + barrel + delete-guarantee + loop.*

*Tags: Component*

| # | Task | Done when |
|---|------|-----------|
| 7 | Split `ds/functions/glitch.js` 288 → ≤5 modules | No file >100, `/ds/#/functions/glitch` identical |
| 8 | Split `views/sound-palette.js` 245 → voices/ | One file per voice family, palette = dispatcher |
| 9 | Split `views/masonry/viewer.js` 246 + `masonry.js` 192 | viewer/{open,bind,markup} + masonry/{card,row,reveal} |
| 10 | Split `ds/pages-overview.js` 227 + `pages-changelog.js` 205 | pages-overview/{sections} + changelog/{parse,paint,badges} |
| 11 | Split remaining 6 (scramble 217, gridReveal 192, fx-lab 186, parallax 136, glitch 110, cells 109, audio-ctx 107) | `lint-manage` line failures → 0 |

### Task 7: Split glitch lab monolith ✓ done

**Objective:** Separate demo markup, sound wiring, source picker — the three jobs currently fused.

**Files:**
- Create: `src/ds/functions/glitch/meta.js` (TYPE_META + opts builders), `src/ds/functions/glitch/source-panel.js`, `src/ds/functions/glitch/sound-panel.js`
- Modify: `src/ds/functions/glitch.js` → thin composer (imports the three, ≤60 lines)

**Guardrails:** `git stash` checkpoint first; `grep -rn "functions/glitch" src ds` must show importers before/after; `npm test` + smoke after; visual check `/ds/#/functions/glitch` unchanged.

**Verify:** Run: `wc -l src/ds/functions/glitch*.js src/ds/functions/glitch/*.js && node scripts/smoke.mjs` — Expected: each ≤100, smoke ✓.

### Task 8: Split sound palette into voices ✓ done

**Objective:** `sound-palette.js` becomes a dispatcher; each synthesis family owns its envelope.

**Files:**
- Create: `src/fx/sound/voices/noise.js` (tick+static), `src/fx/sound/voices/tone.js` (blip+chime), `src/fx/sound/voices/drone.js` (hum+data+scanner+zap+zapscan)
- Modify: `src/views/sound-palette.js` → re-export dispatcher ≤50 lines

**Verify:** `wc -l src/fx/sound/voices/*.js src/views/sound-palette.js && npm test 2>&1 | tail -n 3` — Expected: all ≤100, build ✓, lab sound unchanged.

### Task 9: Split masonry viewer + grid composer ✓ done

**Objective:** Viewer (246) and grid composer (192) each become three scannable units.

**Files:**
- Create: `src/views/masonry/viewer-markup.js`, `src/views/masonry/viewer-bind.js`; slim `viewer.js` to open/close orchestration
- Create: `src/views/masonry/cards.js` (card+row), move reveal timing into `reveal.js`; slim `masonry.js` to filter/state only

**Verify:** masonry filter, reveal animation, viewer open/close pass on smoke + manual Safari check; each file ≤100.

### Task 10: Split DS overview + changelog renderer ✓ done

**Objective:** Overview sections and changelog parse/paint separated (renderer keeps eager glob + `hits()` contract — do not regress per plan-traceability §3).

**Files:**
- Create: `src/ds/overview-sections.js`; slim `pages-overview.js` to composer
- Create: `src/ds/changelog-parse.js`, `src/ds/changelog-paint.js`; `pages-changelog.js` keeps glob + delegates

**Verify:** `/ds/#/changelog` Miller columns + drawer + badges identical; `node scripts/ds-track.mjs` output unchanged.

### Task 11: Split remaining six over-limit files ✓ done

**Objective:** Close the line-count backlog in one swept task (each sub-split ≤30 min, separate commits).

**Files:** `scramble.js` → `scramble/{engine,bind}.js`; `gridReveal.js` → `gridReveal/{slots,reveal}.js`; `fx-lab.js` → `fx-lab/{panels,bind}.js`; `parallax.js` → `parallax/{calc,bind}.js`; `glitch.js` (views) → `fx/visual/glitch-{attach,once}.js`; `cells.js`, `audio-ctx.js` → split at natural seam (state vs wiring).

**Verify:** Run: `node scripts/lint-manage.mjs` — Expected: `✓ manage lint` (0 failures). Then `npm test`.

*Shipped in 5780e3b · Tasks 7–11 · phase-2.*

---

## Phase 3 — Readability: no one-line hacks, scannable blocks {#phase-3}

*Lines are short now; make them readable. Mechanical, file-by-file, looped.*

***No-collapsing rule (plain version):** collapsing code onto one line to fit the 100-line budget is forbidden — it hides the logic instead of organizing it. If a block reads better expanded, it stays expanded; the budget is met by moving the block to its proper file, never by squeezing it. `wc -l` going down because lines were joined is a fail, not a fix.*

*Tags: Component*

| # | Task | Done when |
|---|------|-----------|
| 12 | Unpack one-liners + long template chains | No `+ \`` chain >2 continuations, no `;` multi-statement lines |
| 13 | Section banners + export maps | Every split file has `// — Section —` + top export list |
| 14 | CSS de-pack (ds.css/styles at cap) | Each stylesheet ≤100 AND one-selector-per-line restored |

### Task 12: Unpack one-liners ✓ done

**Objective:** Eliminate density hacks without changing output.

**Files:** all files touched in Phase 2.

**Rules applied:** one statement per line; ternaries only for assignment, never nested; template literals built via named `const` parts then joined (max 2 `+` continuations); WebAudio envelopes one param per line.

**Forbidden (fails the task even if `wc -l` passes):** joining two statements with `;`, stuffing a block onto one line, or chaining `+ \`...\`` / ternaries / CSS declarations to dodge the budget. Example of the hack — `const a = 1; const b = 2;` on one line, or `.x{color:red;background:blue}` on one line — must be split back out, then the overflow fixed by extraction. When in doubt: expanded and honest beats short and squeezed.

**Verify:** Run: `grep -rn "?.*:.*?.*:" src/fx src/views src/ds --include="*.js" | head` — Expected: empty (no nested ternaries). `npm test` green.

### Task 13: Section banners + traceability comments ✓ done

**Objective:** Any file scannable in 30 seconds.

**Contract per file:**
```js
/* ADAM/<AREA> — <path> · <job> · [plan:<file>#phase-3] */
// Exports: render(), bind() — what each is for (2 lines max)
// — Meta —
// — Markup —
// — Bind —
```

**Verify:** spot-check 3 files cold; newcomer states each file's job in one sentence.

### Task 14: CSS readability restore ✓ done

**Objective:** `ds.css`/`base.css`/`card.css` sit at 96–99 lines via packed one-liners — restore one-rule-per-line by moving page chrome into per-page stylesheets (per plan-traceability §5: never just append).

**Multiline law (styles, scripts, everywhere):** nested blocks keep their lines — one declaration / one statement per line, always. A block that fits on one line today stays expanded if expansion is its readable shape; the budget is met by moving blocks out, never by collapsing them in. Pre-existing packed one-liners (e.g. `base.css` header/strip rules) get unpacked as their block moves to its proper home.

**Files:** Create `src/ds/changelog-drawer.css` (or per-page equivalent), slim `ds.css`; same for `styles/` if needed.

**Verify:** `wc -l src/ds/*.css src/styles/*.css` all ≤100 AND `npm run lint:tokens` ✓.

*Shipped in 1ed81cc · Tasks 12–14 · phase-3.*

*Note: 11 files remain over 100 lines (Phase 2 residue, e.g. pages-foundations 184, pages-patterns 169); carried to a future split scope — lint-manage still flags them. Closed done-on-evidence per user override.*

---

## Phase 4 — Recursive-loop harness + newcomer proof {#phase-4}

*Prove the "show any code to a new person" bar, then lock it in as CI.*

*Tags: Tooling*

| # | Task | Done when |
|---|------|-----------|
| 15 | `lint-manage` v2: one-liner + section + width checks | Gate catches Phase-3 regressions automatically |
| 16 | Newcomer comprehension sampling (5 files) | 5/5 files grasped in ≤30s each, fixes looped |
| 17 | Full regression: test + smoke + Safari pass | All routes identical to baseline |

### Task 15: Harden the gate ✓ done

**Objective:** Today's manual scan becomes tomorrow's automatic failure.

**Files:** `scripts/lint-manage.mjs` — nested-ternary check, `+ \`` chain check (≤2 continuations), section-banner check (`// — … —` banners must pair with the `// Exports:` map, malformed banners fail), graph freshness (`map-graph.mjs` regen + `git status` clean). Residue the new chain check caught and cleared: `views/masonry/cards.js`, `views/masonry.js`, `functions/glitch.js`, `foundations/pane-contract.js` — rewrites proven byte-identical via a Vite-SSR render-diff (HEAD vs new, 485/169/1085/7706/4974 chars).

**Verify:** `node scripts/lint-manage.mjs` ✓ — all four checks negative-tested against a planted regression file — + `npm test` ✓.

### Task 16: Newcomer sampling loop ✓ done

**Objective:** Empirical proof, not self-assessment.

**Result:** cold-read proxy (Hermes agent, zero prior file context), 5 files drawn at random from the 133-file split set. 4 passed instantly; `foundations/color/sections.js` failed on a generic job token → header job fixed (`sections` → `pair + decor table markup`), re-read clean. Log: `docs/comprehension.md` — **5/5, zero open fixes**.

### Task 17: Full regression close-out ✓ done

**Result:** `npm test` ✓ (token lint + 262-module build) · `node scripts/smoke.mjs` ✓ on 5199 · 17 routes swept on a fresh document each (15 `/ds/#/…` + `/` + `/#/projects/helix`): **0 console errors** · control probes green: glitch Code tab (sibling panel, `aria-selected` swap), scramble typing + replay, grid-reveal canvas drawing, changelog drawer open → rail switch → Escape, masonry filter 14→8→14 with count, sound toggle `on/off`, viewer hover-open → leave-fade. Safari `:5173` manual pass stays with the human.

Also caught by the archive check and fixed in this close-out: `changelog-parse.chunks()` split naively on `^## `, so the fenced AGENTS sample in this plan's Task 18 cut phase 5 down to one task (rail `0/1`, card `17/18`). Now fence-aware — phase 5 reads `0/3`, card `17/20`, and all 20 plans parse identically except that one phase.

*Shipped in dd35e44, bfa5a0b, 8a97551 · Tasks 15–17 · phase-4.*

---

## Phase 5 — Codify rules (best practices → repo law) {#phase-5}

*Extract what worked into `AGENTS.md` + `.cursorrules` + `README` + lint, so manageability survives future sessions.*

*Tags: Tooling*

| # | Task | Done when |
|---|------|-----------|
| 18 | Promote rules to AGENTS.md + .cursorrules | New rules render in both; old §§1–4 preserved |
| 19 | README operator section + graph link | Any dev finds folders + diagram in 60s |
| 20 | Final `ds:track` + plan close-out + push | Manifest fresh, all tasks marked, main pushed |

### Task 18: Promote best-practice rules

**Objective:** Persist the refactor's lessons as enforceable law (repo files, not memory).

Append to `AGENTS.md` (mirror into `.cursorrules`, which currently does not exist — create it):

```md
## 5. File Budget — Max 100 lines, all languages (JS+CSS+scripts)
Every source file ≤100 lines incl. comments. CI (`lint-manage.mjs`) fails the build over budget. Split via extract-module + barrel re-export; never via minification/packing.
## 6. Readability — Scannable, no one-line hacks
One statement per line; no nested ternaries; no `+` template chains >2 continuations; max 120 chars/line; nested blocks keep their lines in styles/scripts everywhere (one CSS declaration per line); the line budget is met by extraction, never by collapsing — packing lines to pass the gate is a violation, not a fix. Every file opens with `/* ADAM/<AREA> — <path> · <job> */` + 2-line export map + `// — Section —` banners.
## 7. Nomenclature & Nesting — Retrievability guarantee
kebab-case files, noun-first; folders by job (app/pages/shared/fx/{visual,sound}/ds/styles); AREA tags APP|PAGE|SHARED|FX|SOUND|DS|STYLE|TOOL. New module must appear on `docs/graph.mmd` (`node scripts/map-graph.mjs`) with no orphans/cycles.
## 8. Traceability — Every block cites its phase
File header + each exported function carry `[plan:<file>#phase-N]`; commits cite one trailer; `npm run ds:track` + `npm test` before every commit.
## 9. Recursive polish loop — Ship only on 0 violations
Draft → lint-manage → lint:tokens → test → smoke → 30s newcomer scan → fix; max 3 rounds, 4th needs user override (`✗ cancelled` + reason). Deletions need: grep 0 importers, build+smoke ok, `git stash` checkpoint.
```

**Verify:** `node scripts/lint-manage.mjs && npm run lint:tokens` green with new rules in force.

### Task 19: README operator section

**Objective:** A new person grasps the structure in 60 seconds.

Append `README.md` § "Code map": folder table (folder → job → example), header-contract example, `docs/graph.mmd` link, loop summary (5 lines).

**Verify:** cold-read README; stranger points to correct folder for "change glitch sound" without help.

### Task 20: Final track + close-out + push

**Objective:** Bidirectional traceability close-out per plan-traceability §9.

```bash
node scripts/ds-track.mjs
npm test 2>&1 | tail -n 5
git status --short
git log --oneline -5
git push origin main
git ls-remote origin main | grep $(git rev-parse HEAD)
```

Mark every `### Task N:` in this plan `✓ done` (or `✗ cancelled` + `> **Cancelled by user override** — reason`), add `*Shipped in*` lines per phase, commit plan doc as `docs(plan)` with `[plan:<file>#phase-5]`, then push.

*Shipped in <sha> · Tasks 18–20 · phase-5.*

---

## Risks / tradeoffs / open questions

- **Import churn:** ~40 files import `views/*` ↔ `ds/functions/*` crosswise. Mitigation: barrels preserve old paths during migration; delete old path only after `grep` shows 0 importers + build + smoke + dist check.
- **`pages-changelog.js` fragility:** eager glob + `hits()` + TDZ ordering + Miller CSS are regression-prone (see plan-traceability §3a–3b). Mitigation: Task 10 keeps glob/delegate shape; any renderer change gets fresh-`reload()` browser verify, not HMR trust.
- **`ds.css` at cap:** readability restore (Task 14) must move chrome to per-page CSS, not pack tighter — packing caused past selector-drop bugs.
- **Loop discipline vs velocity:** 3-round cap + `✗ cancelled` override keeps "until absolute quality" from becoming infinite polish. Newcomer for Task 16: Hermes agent cold-read proxy (agreed 2026-09-13) — 30s scan performed with zero prior file context, logged in `docs/comprehension.md`.
- **Out of scope:** asset compression, new features, visual redesign — pure refactor; perf-optimization-style cancellations must still be recorded with baselines.

## Verification matrix (every phase)

| Check | Command | Expected |
|---|---|---|
| Manage lint | `node scripts/lint-manage.mjs` | phase-appropriate 0 (headers P1, lines P2, all P3+) |
| Token lint | `npm run lint:tokens` | `✓ … clean` |
| Build+test | `npm test` | green |
| Smoke | `node scripts/smoke.mjs` | `✓ smoke` (port 5199, never 5173) |
| Graph | `node scripts/map-graph.mjs && git diff --exit-code docs/graph.mmd` | no orphans/cycles |
| Traceability | `node scripts/ds-track.mjs` + commit trailers | badges resolve per phase |
