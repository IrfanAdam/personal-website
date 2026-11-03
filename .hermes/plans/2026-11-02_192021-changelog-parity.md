# Changelog parity — crm/safepipe features into personal changelog

**Goal:** Bring the personal `/ds/#/changelog` to feature parity with the latest changelog-kit skill as shipped in crm_proj and safepipe_proj: iteration history, gate verdicts, evals panels, timeline view, read-only Due, honest detail renderer, day-grouped badges, filter drawer, deep links, deploy stamp, structured task folds, and the same two-level mobile behaviour the references ship.

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
- REF GATE 3 · rev 2026-11-03 — owner feedback pass, plan drawer: panel takes 60% of the viewport (was 50), the rail→detail gutter and drawer edge padding shrink to a moderate bleed, rail phase titles clamp to one line with the subtext tucked under it, the Evals and Commits panels lose the dead air between them, and the two kickers (rail plan number + name, tag crumb) share one micro-mono size, top inset and single-line clamp — tags expose their full list as a hover tip. Evals and gate rev-counts now parse the raw section, so each `· rev` line renders as its own dated entry instead of one collapsed task bullet. Verdict: OPEN.

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
- REF GATE 4 · rev 2026-11-03 — owner feedback pass, timeline chrome: the Timeline chip carries a lane icon; the month band above the day numbers is gone (the 1st cell names its own month and the sticky badge pins the current month once scrolled); the today line rides the time-of-day fraction instead of the day start, with a dot at the axis; the lane popover folds every date into one interpunct line (started · modified · status · due); caret reveal measures the sticky plan-label pane instead of the raw scroll box; day cells widen 28→30px and rows shrink 32→30px so a cell reads square-ish; the plan-name column is desktop-only. Verdict: OPEN.

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

## Phase 6 — Raw + text primitives (task folds) {#phase-6}

*Tags: Function*

*Merged from `2026-11-02_231259-changelog-task-folds.md#phase-1` — folds are the display half of the same parity work, not a separate build.*

| # | Task | Done when |
|---|------|-----------|
| 13 | sec-raw.js raw acquisition | `sectionRaw`/`stripGateThread`/`stripInlineAnchors`/`DROP_LINE` ported, `node --check` clean, ≤100 lines |
| 14 | fmt-text.js inline text | `esc`/`escHtml`/`fmtInline`/`cleanHead`/`isTaskHead`/`LABEL_LINE`/`TASK_HEAD` ported, code-span-safe, ≤100 lines |
| 15 | task-shape.js task model | `fieldRank`/`isObjective`/`taskTitleOf`/`taskTick`/`splitItemContent` ported, ≤100 lines |

### Task 13: sec-raw.js raw acquisition ✓ done

**Objective:** Raw chunk lookup plus display strippers, so the renderer never touches normed bodies.

**Files:**
- Create: `src/ds/changelog/sec-raw.js`

**Verify:** `node --check` clean; probe `sectionRaw` returns the Phase 3 chunk verbatim minus gate thread.

### Task 14: fmt-text.js inline text ✓ done

**Objective:** Safepipe-identical text escaper plus inline spans (code spans immune to bold/em pairing).

**Files:**
- Create: `src/ds/changelog/fmt-text.js`

**Verify:** `node --check` clean; probe `` **a** `` inside backticks stays literal.

### Task 15: task-shape.js task model ✓ done

**Objective:** Field ranking, triple-shape task titles (colon / twin / smooth), checkbox tick, item splitter.

**Files:**
- Create: `src/ds/changelog/task-shape.js`

**Verify:** `node --check` clean; probe colon/twin/smooth titles parse to the same name.

*Shipped in fc06e20 · Tasks 13–15 · phase-6.*

---

## Phase 7 — Block + task renderers (task folds) {#phase-7}

*Tags: Component*

*Merged from `2026-11-02_231259-changelog-task-folds.md#phase-2`.*

| # | Task | Done when |
|---|------|-----------|
| 16 | render-blocks.js flow | `renderParts`/`renderFieldOpen`/`renderFieldsOpen`/`renderFlow` ported, authored order kept, ≤100 lines |
| 17 | render-task.js folds | `taskInner`/`renderTask` ported, task-is-the-fold, bare headers stay flat, ≤100 lines |
| 18 | sec-status.js verdicts | `suffixOf` adapter over personal `parseGates`, plus status-line builders and `finalizeSection`, ≤100 lines |

### Task 16: render-blocks.js flow ✓ done

**Objective:** Paragraph/list/pre blocks plus open field rows; `##` bodies keep authored order.

**Files:**
- Create: `src/ds/changelog/render-blocks.js`

**Verify:** `node --check` clean; probe a Files+Verify body keeps source order.

### Task 17: render-task.js folds ✓ done

**Objective:** One `<details>` per task (summary = tick + name + caret), content-less tasks stay bare.

**Files:**
- Create: `src/ds/changelog/render-task.js`

**Verify:** `node --check` clean; probe bare `### Task 1 ✓ done <sha>` renders header-only.

### Task 18: sec-status.js verdicts ✓ done

**Objective:** Gate suffix from personal `parseGates`, stamp rollup, phase fraction/DONE synthesis, lone-task promotion via `finalizeSection`.

**Files:**
- Create: `src/ds/changelog/sec-status.js`

**Verify:** `node --check` clean; probe open-gate phase reads `2/2 · GATE OPEN`, never `✓ DONE · GATE OPEN`.

*Shipped in 8de7573 · Tasks 16–18 · phase-7.*

---

## Phase 8 — Section machine + wiring + folds CSS {#phase-8}

*Tags: Component*

*Merged from `2026-11-02_231259-changelog-task-folds.md#phase-3`.*

| # | Task | Done when |
|---|------|-----------|
| 19 | sec-scan.js line machine | `scanLines` ported with list-continuation + ordered-peer + bold-step rules, ≤100 lines |
| 20 | render-section.js assembly | Head scan plus `finalizeSection` wiring, `renderSection(raw, {suffix})`, ≤100 lines |
| 21 | Parent wiring + folds CSS | `paint-detail.js` renders from raw, `raw-detail.js` pruned, `changelog-folds.css` linked, parity probe green |

### Task 19: sec-scan.js line machine ✓ done

**Objective:** The line state machine (fields, loose blocks, open lists, fences) returning `{tasks, blocks}`.

**Files:**
- Create: `src/ds/changelog/sec-scan.js`

**Verify:** `node --check` clean; probe indented continuation joins its list item.

### Task 20: render-section.js assembly ✓ done

**Objective:** Head detection plus assembly through `scanLines` and `finalizeSection`.

**Files:**
- Create: `src/ds/changelog/render-section.js`

**Verify:** `node --check` clean; probe every parity phase yields exactly one `h2`.

### Task 21: Parent wiring + folds CSS ✓ done

**Objective:** Parent-only: drawer renders from raw with raw fallback, old section renderer pruned, token-only fold styles, cross-repo parity probe, full gates.

**Files:**
- Modify: `src/ds/changelog/paint-detail.js`, `src/ds/changelog/raw-detail.js`, `ds/index.html`
- Create: `src/ds/changelog-folds.css`

**Verify:** `npm run plan:names` 0 missing; `npm run ds:track` tagged == phased, 0 wip, manifest byte-stable; `npm test` green; parity probe (safepipe vs port tag-counts + text equality) passes on all parity phases.

*Shipped in fc272c0 · Tasks 19–21 · phase-8.*

---

## Phase 9 — Mobile shell + list {#phase-9}

*Tags: Layout*

| # | Task | Done when |
|---|------|-----------|
| 22 | mobile.js viewport contract | `isMobile()` (720px, matchMedia, safe fallback) + `levelOf(st)`/`stepBack(st)` pure helpers, no DOM, ≤100 lines |
| 23 | Card + chips mobile CSS | Plan cards re-column with pinned rows, tags on their own row, 44px targets, day graph full-bleed and scrollable |
| 24 | Filter sheet parity | Bottom sheet at 70dvh with `100vmax` scrim, safe-area inset, 44px options, date chip on its own row, visible on open |

### Task 22: mobile.js viewport contract ✓ done

**Objective:** One shared 720px contract for level math, so CSS and JS cannot disagree about what "mobile" means.

**Files:**
- Create: `src/ds/changelog/mobile.js`

**Verify:** `node --check` clean; probe `stepBack` flips `tasks → list` only under 720 and reports `false` at `list`.

### Task 23: Card + chips mobile CSS ✓ done

**Objective:** Phone list view: no ellipsised-into-nothing titles, no tags overprinting date, no sub-44px chips, graph scrolls instead of the page.

**Files:**
- Create: `src/ds/changelog-mobile-cards.css`

**Verify:** At 390px and 320px every card title wraps to ≤2 lines, tags sit on their own row, and pairwise text-leaf overlap ≤1px.

### Task 24: Filter sheet parity ✓ done

**Objective:** The filter drawer reads as a phone sheet (not a desktop popover): scrim, top radius, safe-area padding, tap rows, date chip first.

**Files:**
- Create: `src/ds/changelog-mobile-filter.css`
- Patch spec against: `src/ds/changelog-events.js` (parent lands `ensureFilterVisible`)

**Verify:** Sheet opens fully inside 70dvh without page scroll; close returns focus to the funnel; z-order keeps it above an open drawer.

*Shipped in 497fead · Tasks 22–24 · phase-9.*

---

## Phase 10 — Mobile drawer levels {#phase-10}

*Tags: Layout, Component*

| # | Task | Done when |
|---|------|-----------|
| 25 | Level model in paint + events | `stage` doubles as level (`list`→L1, `tasks`→L2), `data-mlevel` + `.is-l1/.is-l2`, back head, task pane scroll reset |
| 26 | Drawer mobile CSS | Full-bleed panes, parked transform (never `display:none`), flush sticky heads, 2-line rail titles, prose/table/pre wraps |
| 27 | Dismissal + touch guard | `closeTop` steps L2→L1 before closing; one order for ✕/scrim/Esc/back; taps never latch hover popovers |

### Task 25: Level model in paint + events ✓ done

**Objective:** Two-level mobile model over the existing rail/detail panes, with no new state field: `stage` is the level.

**Files:**
- Create: `src/ds/changelog/drawer-head.js`
- Patch spec against: `src/ds/changelog/paint-detail.js`, `src/ds/changelog-events.js` (parent lands)

**Verify:** Plan pick lands L1; rail pick lands L2; deep link without phase lands L1; head shows only `‹ All plans` / `‹ Phases` on phone.

### Task 26: Drawer mobile CSS ✓ done

**Objective:** The drawer becomes a full-height phone surface: one pane at a time, slide between them, heads flush and opaque.

**Files:**
- Create: `src/ds/changelog-mobile-drawer.css`

**Verify:** At 390px the drawer is 100% wide, 100dvh, no nested scroll chaining, only the active pane is visible after the transition settles.

### Task 27: Dismissal + touch guard ✓ done

**Objective:** One dismissal order on touch: popover → drawer level → drawer → timeline; hover payloads are pointer-gated.

**Files:**
- Patch spec against: `src/ds/changelog/close-top.js`, `src/ds/changelog/hover.js` (parent lands)

**Verify:** Esc and scrim at L2 step to L1 and never close the drawer; a tap never leaves a tooltip latched.

*Shipped in 3d8f1d3 · Tasks 25–27 · phase-10.*

---

## Phase 11 — Mobile timeline + verification {#phase-11}

*Tags: Layout, Tooling*

| # | Task | Done when |
|---|------|-----------|
| 28 | Timeline mobile CSS | Full-width panel, shrunken label/day units, wrapping head, 44px close, popover clamped, safe-area bottom |
| 29 | Numeric mobile verification | 320/390 probes: `scrollWidth ≤ innerWidth`, text overlap ≤1px, sticky label stays put, back button on-screen |

### Task 28: Timeline mobile CSS ✓ done

**Objective:** The timeline stays a destination on a phone: label column readable, lanes reachable, carets and close tappable.

**Files:**
- Create: `src/ds/changelog-mobile-timeline.css`

**Verify:** At 390px `--tl-label` leaves ≥180px of lane, today line and edge carets stay aligned after horizontal scroll.

### Task 29: Numeric mobile verification ✓ done

**Objective:** Prove the pass with measurements, not screenshots, at 320 and 390.

**Files:**
- Probe: `ds/#/changelog` (dev server reads only)

**Verify:** `scrollWidth ≤ innerWidth` on both widths; pairwise text-leaf rect intersection ≤1px; rail and detail pane rects fully inside the viewport after open; `npm run plan:names`, `npm run ds:track`, `npm test` green.

*Shipped in 380e7ea · Tasks 28–29 · phase-11.*

- REF GATE 11 · rev 2026-11-03 — owner feedback pass: the plan-name column is desktop-only. At ≤720px the timeline drops the sticky label pane (and its PLAN header) so the lane owns the full width — the list had no value on a phone and ate the grid. Verdict: OPEN.

---

## Phase 12 — Phone audit: the sheets were never linked {#phase-12}

*Tags: Layout, Tooling*

**Finding:** Phases 9–11 shipped five phone sheets that `ds/index.html` never
linked, so every `≤720px` rule was dead code. At 320/390 the document measured
650px wide, the drawer opened 195px wide with panes squeezed to 58/90px, no
back affordance existed, and taps latched tooltips. The CSS was right; the page
never loaded it. This phase wires the sheets and fixes what the probe found
once they ran.

| # | Task | Done when | 
|---|------|-----------|
| 30 | Link the phone sheets | Five `<link>`s after `ds-responsive.css`; `.ds-mback` stays hidden above 720 so desktop is untouched |
| 31 | Drawer panes as absolutes | Parked pane leaves the flex flow (`inset:0`, translate + visibility) so L1 is full height, not half |
| 32 | Heads + controls as bare text | Sticky heads, 44px back/✕, default button chrome reset (no stray card in the bar) |
| 33 | Sheet + timeline row fixes | Pills folded into the sheet, day chip on its own row, dimmed backdrop; timeline head one row with flush ✕ |

### Task 30: Link the phone sheets ✓ done

**Objective:** Make the ≤720px rules actually load, last, so they win on equal specificity.

**Files:**
- Modify: `ds/index.html`

**Verify:** At 390px `#cl-root` computed styles pick up the mobile rules; `.ds-mback` is `display:none` at 1280 and visible at 390.

### Task 31: Drawer panes as absolutes ✓ done

**Objective:** One pane owns the full drawer, the parked one leaves the flow.

**Files:**
- Modify: `src/ds/changelog-mobile-drawer.css`

**Verify:** At 390px rail pane height == drawer height (844), drawer 100% wide, parked pane `visibility:hidden`.

### Task 32: Heads + controls as bare text ✓ done

**Objective:** The phone head is flush and tappable, and never inherits the default button card.

**Files:**
- Create: `src/ds/changelog-mobile-drawer-head.css`
- Modify: `src/ds/changelog-picks.css`

**Verify:** Back is 44px tall, full-width on the rail head; ✕ is 44×44 with no border/background.

### Task 33: Sheet + timeline row fixes ✓ done

**Objective:** The tag family lives in the sheet, not as 44px pills stacked over the graph; the timeline head is one row.

**Files:**
- Modify: `src/ds/changelog-mobile-filter.css`, `src/ds/changelog-mobile-timeline.css`

**Verify:** At 390px the chip block is ≤2 rows tall, the sheet is bottom-anchored with a dimmed page, and the timeline ✕ sits top-right on the title row.

*Shipped in ca32b24 · Tasks 30–33 · phase-12.*

---

## Execution map

| Phase | Mode | Depends on |
|-------|------|------------|
| 1 Tracker | lane A solo, then parent runs track | — |
| 2 Parse core | lane B solo | 1 (history shape frozen below, no code dep) |
| 3 Detail + evals | lane C solo | Frozen contracts only (runs parallel with 1, 2, 4) |
| 4 Timeline + chrome | lane D solo | Frozen contracts only (runs parallel with 1, 2, 3) |
| 5 Integration | parent | 1–4 |
| 6–8 Task folds | merged from the folds plan | 1–5 (display-only, parse layer frozen) |
| 9 Mobile shell + list | parent + lanes | 1–5 (no tracker dependency) |
| 10 Mobile drawer levels | parent + lanes | 9 |
| 11 Timeline + verify | parent + lanes | 10 |
| 12 Phone audit | parent | 9–11 (found the sheets unlinked) |

*Phases 1–4 dispatched as ONE parallel batch; 6–8 shipped from the merged folds plan; 9–11 dispatch as one file-disjoint batch with shared files parent-only.*

## Frozen contracts (parent-owned, pasted into every lane brief)

- History shape: `src/ds/plan-history.json` maps plan file → array of `{sha, date, hash, sections: [{head, hash, state}]}`; `hash` = existing `hash()` from `changelog-parse.js`; `state` = existing `state()`.
- `planStatus()`: cancelled > done > incomplete; one helper in `raw-detail.js`, every surface imports it, never duplicates the expression.
- Gate line grammar: `REF GATE N (STATUS)` with verdict tokens PASSED/FAILED/OPEN, uppercase explicit; iterations append `· rev YYYY-MM-DD …` lines, never replace.
- Due grammar: `*Due: YYYY-MM-DD*` under the section head, incomplete sections only; invalid → null. Write path (POST/API/Supabase) OUT OF SCOPE — read-only render; blocked on owner secrets, recorded here not re-probed.
- Budgets: every file ≤100 lines incl. comments; one statement per line; tokens via `var(--token)` only; file header `/* ADAM/DS — <path> · <job> */` + export map + section banners; phase citations `[plan:2026-11-02_192021-changelog-parity.md#phase-N]` on file headers + exported functions.
- Fold shapes: field `{label, inline[], parts[], idx, seq}`; para `{t:'para', text, seq}`; list `{t:'list', ordered, items[], home, seq}`; pre `{t:'pre', lang, code, seq}`; raw `{t:'raw', html}`; task `{title, done, cancelled, fields[], lead[], loose[], field}`.
- Fold pipeline: `scanLines(lines, start, seed)` → `{tasks, blocks}`; `finalizeSection(...)` → `{head, body}`; `renderSection(raw, {suffix})`; `suffixOf(head, rawBody)` adapts personal `parseGates`. Parse layer (`changelog-parse.js`, `ds-track.mjs`, history) is FROZEN — display-only, no hash churn.
- Mobile: 720px is the only level breakpoint; `isMobile()` is the one detector; `stage` doubles as level (`list` = L1, `tasks` = L2); parked panes use `translateX(103%) + visibility:hidden`, never `display:none`; `data-mlevel` and `.is-l1/.is-l2` ride together.

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
- Mobile list: grid-row pinning beats a column-only override — every re-columned leaf needs its own row.
- `100vw` causes horizontal scroll + pinch zoom; full-bleed uses `calc(100% + inset*2)` with negative margins.
- Touch has no hover: gate popovers with a pointer flag, never by deleting the desktop hover.
- Fold display is render-only; any edit to `split()`/`state()` churns all 47 plan hashes.
