# Changelog task folds — safepipe-structured detail renderer

**Goal:** Phases 3–4 of the changelog read as a wall of unformatted run-on text while every other surface folds tasks; port safepipe's block-aware detail renderer (fields, lists, fences, task folds, gate suffixes) into the personal drawer as a display-only layer, with zero parse/hash churn.

**Architecture:** Eight file-disjoint new modules under `src/ds/changelog/` plus a parent-wired `paint-detail.js` swap: raw section text (`sectionRaw` over `texts[file]`) feeds the new `renderSection(raw, {suffix})`; `split`/`norm`/`state` stay byte-identical so `ds-track` history never churns. Three parallel implementer lanes write new files only; the parent lands shared-file edits, CSS, probes, and commits.

**Tech Stack:** Vanilla ESM, no DOM in new modules, `texts` raw map already in paint ctx, tokens-only CSS.

**Tags:** Design System, Component, Function

---

## Phase 1 — Raw + text primitives {#phase-1}

*Tags: Function*

| # | Task | Done when |
|---|------|-----------|
| 1 | sec-raw.js raw acquisition | `sectionRaw`/`stripGateThread`/`stripInlineAnchors`/`DROP_LINE` ported, `node --check` clean, ≤100 lines |
| 2 | fmt-text.js inline text | `esc`/`escHtml`/`fmtInline`/`cleanHead`/`isTaskHead`/`LABEL_LINE`/`TASK_HEAD` ported, code-span-safe, ≤100 lines |
| 3 | task-shape.js task model | `fieldRank`/`isObjective`/`taskTitleOf`/`taskTick`/`splitItemContent` ported, ≤100 lines |

### Task 1: sec-raw.js raw acquisition ✓ done

**Objective:** Raw chunk lookup plus display strippers, so the renderer never touches normed bodies.

**Files:**
- Create: `src/ds/changelog/sec-raw.js`

**Verify:** `node --check` clean; probe `sectionRaw` returns the Phase 3 chunk verbatim minus gate thread.

### Task 2: fmt-text.js inline text ✓ done

**Objective:** Safepipe-identical text escaper plus inline spans (code spans immune to bold/em pairing).

**Files:**
- Create: `src/ds/changelog/fmt-text.js`

**Verify:** `node --check` clean; probe `` **a** `` inside backticks stays literal.

### Task 3: task-shape.js task model ✓ done

**Objective:** Field ranking, triple-shape task titles (colon / twin / smooth), checkbox tick, item splitter.

**Files:**
- Create: `src/ds/changelog/task-shape.js`

**Verify:** `node --check` clean; probe colon/twin/smooth titles parse to the same name.

---

## Phase 2 — Block + task renderers {#phase-2}

*Tags: Component*

| # | Task | Done when |
|---|------|-----------|
| 4 | render-blocks.js flow | `renderParts`/`renderFieldOpen`/`renderFieldsOpen`/`renderFlow` ported, authored order kept, ≤100 lines |
| 5 | render-task.js folds | `taskInner`/`renderTask` ported, task-is-the-fold, bare headers stay flat, ≤100 lines |
| 6 | sec-status.js verdicts | `suffixOf` adapter over personal `parseGates`, plus status-line builders and `finalizeSection`, ≤100 lines |

### Task 4: render-blocks.js flow ✓ done

**Objective:** Paragraph/list/pre blocks plus open field rows; `##` bodies keep authored order.

**Files:**
- Create: `src/ds/changelog/render-blocks.js`

**Verify:** `node --check` clean; probe a Files+Verify body keeps source order.

### Task 5: render-task.js folds ✓ done

**Objective:** One `<details>` per task (summary = tick + name + caret), content-less tasks stay bare.

**Files:**
- Create: `src/ds/changelog/render-task.js`

**Verify:** `node --check` clean; probe bare `### Task 1 ✓ done <sha>` renders header-only.

### Task 6: sec-status.js verdicts ✓ done

**Objective:** Gate suffix from personal `parseGates`, stamp rollup, phase fraction/DONE synthesis, lone-task promotion via `finalizeSection`.

**Files:**
- Create: `src/ds/changelog/sec-status.js`

**Verify:** `node --check` clean; probe open-gate phase reads `2/2 · GATE OPEN`, never `✓ DONE · GATE OPEN`.

---

## Phase 3 — Section machine + wiring + folds CSS {#phase-3}

*Tags: Component*

| # | Task | Done when |
|---|------|-----------|
| 7 | sec-scan.js line machine | `scanLines` ported with list-continuation + ordered-peer + bold-step rules, ≤100 lines |
| 8 | render-section.js assembly | Head scan plus `finalizeSection` wiring, `renderSection(raw, {suffix})`, ≤100 lines |
| 9 | Parent wiring + folds CSS | `paint-detail.js` renders from raw, `raw-detail.js` pruned, `changelog-folds.css` linked, parity probe green |

### Task 7: sec-scan.js line machine

**Objective:** The line state machine (fields, loose blocks, open lists, fences) returning `{tasks, blocks}`.

**Files:**
- Create: `src/ds/changelog/sec-scan.js`

**Verify:** `node --check` clean; probe indented continuation joins its list item.

### Task 8: render-section.js assembly

**Objective:** Head detection plus assembly through `scanLines` and `finalizeSection`.

**Files:**
- Create: `src/ds/changelog/render-section.js`

**Verify:** `node --check` clean; probe every parity phase yields exactly one `h2`.

### Task 9: Parent wiring + folds CSS

**Objective:** Parent-only: drawer renders from raw with raw fallback, old section renderer pruned, token-only fold styles, cross-repo parity probe, full gates.

**Files:**
- Modify: `src/ds/changelog/paint-detail.js`, `src/ds/changelog/raw-detail.js`, `ds/index.html`
- Create: `src/ds/changelog-folds.css`

**Verify:** `npm run plan:names` 0 missing; `npm run ds:track` tagged == phased, 0 wip, manifest byte-stable; `npm test` green; parity probe (safepipe vs port tag-counts + text equality) passes on all parity phases.

---

## Execution map

| Phase | Mode | Depends on |
|-------|------|------------|
| 1 Primitives | 1 lane solo | — |
| 2 Renderers | 1 lane solo | Frozen contracts only (runs parallel with 1) |
| 3 Machine + wiring | 1 lane solo, then parent wires | Frozen contracts only (runs parallel with 1–2) |

*Phases dispatch as ONE parallel batch (file-disjoint new files; shared files parent-only). Parent wires after all lanes land.*

## Frozen contracts (parent-owned, pasted into every lane brief)

- Shapes: field `{label, inline[], parts[], idx, seq}`; para `{t:'para', text, seq}`; list `{t:'list', ordered, items[], home, seq}`; pre `{t:'pre', lang, code, seq}`; raw `{t:'raw', html}`; task `{title, done, cancelled, fields[], lead[], loose[], field}`.
- `scanLines(lines, start, seed)` → `{tasks, blocks}`; seed null or `{title, done, cancelled}` for `###`-led chunks.
- `finalizeSection({head, htextRaw, htag, real, tasks, blocks, suffix})` → `{head, body}` (rollup + synthesis + promotion + folds/flow).
- `renderSection(raw, opts)` with `opts = {suffix}` → `{head, body}`; `suffixOf(head, rawBody)` adapts personal `parseGates`.
- Budgets: ≤100 lines/file, ≤120 chars/line, one statement/line; header `/* ADAM/DS — <path> · <job> */` + 2-line export map + `// — Section —` banners; every export cites `[plan:2026-11-02_231259-changelog-task-folds.md#phase-N]`.
- Parse layer (`changelog-parse.js`, `ds-track.mjs`, history) is FROZEN — display-only port, no hash churn.
- Lanes never run git, trackers, installs, or builds; `node --check` only.

## Pitfalls (from the recon)

- `ds-track` hashes `head + body` from `split()` — any norm/state/split edit churns all 47 plans; this port touches none of it.
- Corpus has zero fenced checkboxes and zero non-digit Phase heads — no parse alignment needed.
- No Due lines in corpus — `dueOf` inputs stay normed; ghosts unchanged.
- Personal `esc` lacks `>` — the port ships safepipe-identical text esc in `fmt-text.js`; render-only, no churn.
- Open-gate phases will read `2/2 · GATE OPEN` (safepipe rule) instead of `✓ DONE · GATE OPEN` — intended, owner-visible.
- `marked` stays a dependency (site views use it); the drawer stops using it for sections.
