# Changelog parity — crm/safepipe features into personal changelog

**Goal:** Bring the personal `/ds/#/changelog` to feature parity with the latest changelog-kit skill as shipped in crm_proj and safepipe_proj: iteration history, gate verdicts, evals panels, timeline view, read-only Due, honest detail renderer, day-grouped badges, filter drawer, deep links, deploy stamp.

**Architecture:** Four parallel file-disjoint implementer lanes write new modules plus patch specs for shared files; the parent lands every shared-file edit centrally, then runs gates, screenshots, and per-phase commits. No lane runs git, trackers, or builds.

**Tech Stack:** Vanilla ESM, `import.meta.glob` plan raws, ds-track manifest, tokens-only CSS.

**Tags:** Design System, Component, Function, Layout, Tooling

---

## Phase 1 — Tracker: history + deploy stamp {#phase-1}

*Tags: Tooling*

*Status: 2/2 tasks · GATE OPEN (by owner: history + stamp green on landed tree)*

| # | Task | Done when |
|---|------|-----------|
| 1 | plan-history hist block in ds-track.mjs | `design-system`-style per-plan section-hash history generates at `src/ds/plan-history.json`, rerun adds 0 |
| 2 | version.json deploy stamp | `public/version.json` carries head:count, byte-stable on rerun |

### Task 1: plan-history hist block in ds-track.mjs ✓ done

**Objective:** Mirror the crm/safepipe hist block: per plan file, array of `{sha, date, hash, sections: [{head, hash, state}]}` using the existing `split`/`state`/`hash` imports.

**Files:**
- Modify: `scripts/ds-track.mjs` (append hist block before the final log line; single-writer lane file)

**Verify:** `node --check` clean; parent runs `npm run ds:track` twice, second run byte-stable; `src/ds/plan-history.json` exists with 46 keys.

### Task 2: version.json deploy stamp ✓ done

**Objective:** Stamp `public/version.json` as `{"sha":"<head>:<count>"}` on every track run; skip write when unchanged.

**Files:**
- Modify: `scripts/ds-track.mjs` (stamp block; same lane file as Task 1)

**Verify:** `node --check` clean; parent confirms stamp flips after a content commit, stable on rerun.

*Shipped in 0e553d6 · Tasks 1–2 · phase-1.*

- REF GATE 1 (ship, OPEN, by owner): history covers all 46 plans, rerun adds 0, stamp flips only on content change. Owed: owner confirms gate evidence on landed tree.

---

## Phase 2 — Parse core: gates + due + anchors {#phase-2}

*Tags: Function*

*Status: 3/3 tasks · GATE OPEN (by owner: gates/due/anchors proven on corpus)*

| # | Task | Done when |
|---|------|-----------|
| 3 | gates.js verdict parser | `REF GATE N (STATUS)` + rev counting per skill §Gate verdict inline |
| 4 | due.js Due parser | `*Due: YYYY-MM-DD*` under head, incomplete-only, invalid→null |
| 5 | Anchor hardening patch spec | Case-insensitive digit-boundary `anchorHit` + `{#task-N}` tokens; triage parity |

### Task 3: gates.js verdict parser ✓ done

**Objective:** New pure module parsing `REF GATE N (STATUS)` lines: status passed/failed/open, rev-count from `· rev` lines, ship marker; ownership by heading number.

**Files:**
- Create: `src/ds/changelog/gates.js` (≤100 lines, no DOM)

**Verify:** Node probe over 3 real plan files prints expected verdicts; `node --check` clean.

### Task 4: due.js Due parser ✓ done

**Objective:** New pure module: `parseDue`/`dueOf` per the frozen contract; invalid dates → null; shipped/done sections → null.

**Files:**
- Create: `src/ds/changelog/due.js` (≤100 lines, no DOM)

**Verify:** Node probe on safepipe-shaped Due lines + personal plans; `node --check` clean.

### Task 5: Anchor hardening patch spec ✓ done

**Objective:** Deluxe `anchorHit` (case-insensitive, digit boundaries) + synthesized `{#task-N}` tokens in section bodies and the triage texts map, so triage matches the way `hits()` matches. Shared file stays parent-owned: lane returns a file:line patch spec only.

**Files:**
- Patch spec against: `src/ds/changelog-links.js` (parent lands it)

**Verify:** Parent applies spec; orphan count on landed tree does not grow vs baseline; no new false orphans.

*Shipped in a20169d · Tasks 3–5 · phase-2.*

- REF GATE 2 (ship, OPEN, by owner): gate tags render on a gated plan, Due dots read from real Due lines, orphan count ≤ baseline. Owed: owner confirms on landed tree.

---

## Phase 3 — Detail + evals panels {#phase-3}

*Tags: Component*

*Status: 2/2 tasks · GATE OPEN (by owner: drawer reads honest on gated + cancelled plans)*

| # | Task | Done when |
|---|------|-----------|
| 6 | raw-detail.js honest renderer | Honest DONE, stamp rollup, title-note split, folds, gate suffix, cancelled propagation |
| 7 | panels.js evals + commits | Day-grouped collapsible Evals/Commits panels mirroring each other |

### Task 6: raw-detail.js honest renderer ✓ done

**Objective:** New view-layer module owning section-body render: honest DONE only when head carries ✓, bare `### Task N ✓` stamp seals without nested render, trailing paren → body note, lone-task promotion, per-phase gate suffix, `planStatus()` shared helper (cancelled > done > incomplete), Further-commits orphan rail per section with first-section ownership dedupe.

**Files:**
- Create: `src/ds/changelog/raw-detail.js` (split by extraction if over budget)
- Patch spec against: `src/ds/changelog/paint-detail.js` (parent lands wiring)

**Verify:** `node --check` clean; parent screenshots gated + cancelled + stamped plans read honest.

### Task 7: panels.js evals + commits ✓ done

**Objective:** New module painting `Evals · N` (gate `· rev` notes + history revs scoped to open phase, threaded parent→iteration per date, newest first) and `Commits · N` (day-grouped badges with dates) as collapsible `<details class="ds-panel">` pairs; `- REF GATE` thread stripped from prose before markdown.

**Files:**
- Create: `src/ds/changelog/panels.js` (≤100 lines or split)
- Patch spec against: `src/ds/changelog/paint-detail.js` (parent lands wiring)

**Verify:** `node --check` clean; parent confirms eval/commit pairing on a plan with revs.

*Shipped in 4e1a4fa · Tasks 6–7 · phase-3.*

- REF GATE 3 (ship, OPEN, by owner): drawer on a gated plan shows verdict + evals + commits with Day threading; cancelled plan reads cancelled everywhere. Owed: owner confirms on landed tree.

---

## Phase 4 — Timeline + chrome {#phase-4}

*Tags: Layout*

*Status: 3/3 tasks · GATE OPEN (by owner: timeline + filters + deep links live)*

| # | Task | Done when |
|---|------|-----------|
| 8 | Timeline model + paint + CSS | Tracks view with bouts, ghost bars, edge carets, month badge, popovers, today line |
| 9 | Filter drawer + status | Tags/Status tabbed drawer, status radio with counts, active-count badge |
| 10 | Deep links + version poll | `?day= ?sha= ?view=timeline`, version.json poll with reload guards |

### Task 8: Timeline model + paint + CSS ✓ done

**Objective:** New modules: pure model (`activeDates`, gap-merge bouts MERGE_GAP=3, ghost = earliest Due among incomplete from max(lastActive,today)), paint (1 row per plan, plan name inside bar, dashed ghost, daily ticks, today line, sticky month badge, edge carets, structured popovers), token-only CSS. Parent wires view state + events.

**Files:**
- Create: `src/ds/changelog/timeline.js`, `src/ds/changelog/timeline-paint.js`, `src/ds/changelog-timeline.css`
- Patch spec against: `src/ds/pages-changelog.js`, `src/ds/changelog/paint-chips.js`, `src/ds/changelog-events.js` (parent lands)

**Verify:** `node --check` clean on both js files; parent screenshots timeline with ≥1 bout + ghost.

### Task 9: Filter drawer + status ✓ done

**Objective:** New module: single Tags/Status tabbed drawer (`role=dialog`), status radio Done/Incomplete/Cancelled fed by shared `planStatus()`, active-count badge on trigger, mobile two-level behavior hooks. Parent wires trigger + events.

**Files:**
- Create: `src/ds/changelog/filter-drawer.js`
- Patch spec against: `src/ds/changelog/paint-chips.js`, `src/ds/changelog-events.js` (parent lands)

**Verify:** `node --check` clean; parent confirms status filter empties/fills list correctly.

### Task 10: Deep links + version poll ✓ done

**Objective:** New modules: boot-time `?day= ?sha= ?view=timeline&plan=&bout=` handling, and a version.json sha poll (once per sha, never mid-interaction, neutral view only). Parent wires boot + guards.

**Files:**
- Create: `src/ds/changelog/deep-links.js`, `src/ds/changelog/version-poll.js`
- Patch spec against: `src/ds/pages-changelog.js` (parent lands)

**Verify:** `node --check` clean; parent curls deep link rendering + poll silence on same sha.

*Shipped in 4d1cf5b · Tasks 8–10 · phase-4.*

- REF GATE 4 (ship, OPEN, by owner): timeline opens with named bars + ghost, status filter + deep links work, no reload during drawer interaction. Owed: owner confirms on landed tree.
- REF GATE 4 · rev 2026-11-02 — structural pass against crm/safepipe references: status filter is multi-select (was radio), funnel trigger icon-only + first in the chips row, drawer ships its own host chrome, timeline uses the day-unit grid with month padding, today wash + fractional line, caret sync, ghost rules, return-view scroll restore. Verdict: OPEN.
- REF GATE 4 · rev 2026-11-02b — UI/UX pass, behaviour not just placement: timeline is a fixed side panel over the shared scrim with sticky plan-label column, day gridlines, integer-day today marker and a seven-line lane popover (title → goal → scope → status → stats → due → range); plan drawer reborn as crumb → one title → status → due → prose with rail subtext (`fraction · commits · gate`) and styled evals/commits panels; list cards use list ordinals and a date/state meta line; one dismissal order (filter → drawer → timeline) shared by scrim, ✕ and Escape. Verdict: OPEN.

---

## Phase 5 — Integration + skill update {#phase-5}

*Tags: Tooling*

*Status: 2/2 tasks · GATE OPEN (by owner: full suite + screenshots + deployed parity)*

| # | Task | Done when |
|---|------|-----------|
| 11 | Parent integration + verify | All patch specs landed, `npm test` green, screenshots per phase, per-phase commits |
| 12 | Global changelog-kit skill update | Parity lessons recorded in `~/.hermes/skills/changelog-kit/SKILL.md` |

### Task 11: Parent integration + verify ✓ done

**Objective:** Parent-only: apply lane patch specs to shared files, wire new modules, run `npm run ds:track` + `npm test`, screenshot every touched surface, commit path-limited per phase with `[plan:2026-11-02_192021-changelog-parity.md#{#phase-N}]` trailers, close each phase with `✓ done` + sha.

**Files:** Shared files only — `src/ds/pages-changelog.js`, `src/ds/changelog-links.js`, `src/ds/changelog/paint-*.js`, `src/ds/changelog-events.js`, styles, manifest/history/version generated files in separate `chore(sync)` commits.

**Verify:** `npm run plan:names` 0 missing; `npm run ds:track` tagged == phased, 0 wip; `npm test` green; `/ds/#/changelog` Miller + drawer + timeline resolve per phase.

### Task 12: Global changelog-kit skill update ✓ done

**Files (landed):** `~/.hermes/skills/changelog-kit/references/parity-port.md` (new reference; SKILL.md body is over the 100k skill limit so the section patch was refused — body split recorded as an owner decision, not re-probed).

**Objective:** Record what this parity build taught (personal-shape deltas, honest-renderer gotchas, timeline wiring order) as imperative rules in the global skill via `skill_manage` patch ops — lessons only, no logs.

**Files:** `~/.hermes/skills/changelog-kit/SKILL.md` via skill_manage.

**Verify:** Skill re-reads clean; new rules cited by topic.

*Shipped in b70c155 · Tasks 11–12 · phase-5.*

- REF GATE 5 (ship, OPEN, by owner): suite green, screenshots attached, skill updated. Owed: owner sign-off on parity screenshots.
- REF GATE 5 · rev 2026-11-02 — SKILL.md had outgrown its 100k limit (body patches refused), so the timeline/filter depth moved to two style-agnostic references (`timeline-panel.md`, `filter-drawer.md`) and the body bullets became pointers; body now 96,989 chars. Verdict: OPEN.

---

## Execution map

| Phase | Mode | Depends on |
|-------|------|------------|
| 1 Tracker | lane A solo, then parent runs track | — |
| 2 Parse core | lane B solo | 1 (history shape frozen below, no code dep) |
| 3 Detail + evals | lane C solo | Frozen contracts only (runs parallel with 1, 2, 4) |
| 4 Timeline + chrome | lane D solo | Frozen contracts only (runs parallel with 1, 2, 3) |
| 5 Integration | parent | 1–4 |

*Phases 1–4 dispatch as ONE parallel batch (file-disjoint new files; shared files parent-only). Phase 5 parent-side after all lanes land.*

## Frozen contracts (parent-owned, pasted into every lane brief)

- History shape: `src/ds/plan-history.json` maps plan file → array of `{sha, date, hash, sections: [{head, hash, state}]}`; `hash` = existing `hash()` from `changelog-parse.js`; `state` = existing `state()`.
- `planStatus()`: cancelled > done > incomplete; one helper in `raw-detail.js`, every surface imports it, never duplicates the expression.
- Gate line grammar: `REF GATE N (STATUS)` with verdict tokens PASSED/FAILED/OPEN, uppercase explicit; iterations append `· rev YYYY-MM-DD …` lines, never replace.
- Due grammar: `*Due: YYYY-MM-DD*` under the section head, incomplete sections only; invalid → null. Write path (POST/API/Supabase) OUT OF SCOPE — read-only render; blocked on owner secrets, recorded here not re-probed.
- Budgets: every file ≤100 lines incl. comments; one statement per line; tokens via `var(--token)` only; file header `/* ADAM/DS — <path> · <job> */` + export map + section banners; phase citations `[plan:2026-11-02_192021-changelog-parity.md#phase-N]` on file headers + exported functions.

## File map (new modules)

- `src/ds/changelog/gates.js` (lane B) · `src/ds/changelog/due.js` (lane B)
- `src/ds/changelog/raw-detail.js` (lane C) · `src/ds/changelog/panels.js` (lane C)
- `src/ds/changelog/timeline.js` + `timeline-paint.js` (lane D) · `src/ds/changelog/filter-drawer.js` (lane D) · `src/ds/changelog/deep-links.js` + `version-poll.js` (lane D)
- `src/ds/changelog-timeline.css` (lane D) · `src/ds/plan-history.json` + `public/version.json` (generated, lane A script + parent runs)

## Pitfalls (from the recon)

- Lanes never run git, trackers, installs, or builds; never bind 5173–5176 (owner dev server on 5176 serves this repo — reuse for reads only via curl, never start/kill).
- `scripts/ds-track.mjs` is lane A single-writer; every other shared file is parent-only — lanes return file:line patch specs, never edits.
- Keep the parse layer hash-stable: display policy lives in view helpers, never in `state()`/`split()` semantics.
- Second `ds-track` run must be byte-stable; timestamp-only churn gets reverted, not committed.
- Commit path-limited per phase with the phase anchor trailer; generated files ride separate `chore(sync)` commits.
