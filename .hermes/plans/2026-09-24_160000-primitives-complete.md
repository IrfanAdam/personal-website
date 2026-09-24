# Primitives complete — readable sheets, honest tokens, one story per sheet

**Goal:** Every primitive reads as one uniform story — scannable source (no packed lines), honest token list (every `var()` exists in the token family), anatomy/behaviour a newcomer can act on, Preview/Code tabs with live knobs. Pages/Primitives composes 9 vertical sheets, component chrome owns tokens+copy, lint + build green.
**Architecture:** Phase 1 rewrites all 9 primitive sheets from packed joins into readable functions with `// — Section —` banners, audited tokens, normalized anatomy/behaviour strings, and `/**/` headers. Phase 2 polishes the composer (`pages-primitives` hero, vertical tabs), `component.js` shared chrome, and `playground` split so each file is ≤100 lines one-statement-per-line. Phase 3 proves it — token lint, manage lint, build, viewport screenshots of each tab.
**Tech Stack:** Vanilla JS (`component.js` + `tabs.js` + `specimens.js`), `src/ds/primitives/*` (9 sheets) + `src/ds/component.js` + `src/ds/pages-primitives.js`, token family `src/styles/tokens*.css`, `scripts/lint-manage.mjs` + `scripts/lint-tokens.mjs`, `vite build`.
**Tags:** Design System, Component

<!-- changelog: hide -->

---

## Phase 1 — 9 sheets readable, token-audited {#phase-1}
*Tags: Design System, Component*
*Packed `.join('')` + split `s\n    .kind` hacks pass the 100-line gate by collapsing, not by extraction — violates one-statement-per-line and readability. Each sheet still needs: header + export map + section banners, render/code functions that read at a glance, anatomy/behaviour in plain words, knobs with sensible defaults, token array where every entry greps in `tokens*.css` + `ds.css` via `var()`.*

| # | Task | Done when |
|---|---|-----------|
| 1 | Button sheet readable | `src/ds/primitives/btn.js` ≤100 lines, one statement per line, no nested ternary, header + export map + section banners, `var(--token)` list audited (exists), `btnSheet()` renders primary/secondary/ghost + sm/md + disabled + dark probe, `build` green |
| 2 | Tag + Kicker sheets readable | `tag.js` + `kicker.js` same: ≤100, readable, tokens audited, anatomy/behaviour plain, `build` green, lint clean |
| 3 | Divider + Badge sheets readable | `divider.js` + `badge.js` same: readable, tokens audited, no raw px, `build` green |
| 4 | Field sheets readable (field + helpers) | `field.js` + `field-meta.js` + `field-code.js` each ≤100, no packing, tokens audited (`--color-input-*`, `--size-frame` etc), control/state/disabled/hint/error + dark probe, `build` green |
| 5 | Toggle + Avatar + Logo sheets readable | `toggle.js` + `avatar.js` + `logo.js` same: ≤100 readable, tokens audited, Toggle checkbox semantics, Avatar square doctrine + fallback, Logo wordmark authored case, `build` green |

### Task 1: Button sheet readable ✓ done
**Objective:** Button is the canonical anchor — primary/secondary/ghost × sm/md + disabled + dark.
**Files:** `src/ds/primitives/btn.js`
**Verify:** ≤100 lines, one-statement-per-line, `lint:tokens` var-only, `build` green.

### Task 2: Tag + Kicker sheets readable ✓ done
**Objective:** Chip + eyebrow — minimal static sheets but honest tokens/anatomy.
**Files:** `src/ds/primitives/tag.js`, `src/ds/primitives/kicker.js`
**Verify:** Same gate.

### Task 3: Divider + Badge sheets readable ✓ done
**Objective:** Rule + chip — hairline and accent vs muted AA.
**Files:** `src/ds/primitives/divider.js`, `src/ds/primitives/badge.js`
**Verify:** Same.

### Task 4: Field sheets readable ✓ done
**Objective:** Field is the largest primitive — controls split across three files for budget by extraction.
**Files:** `src/ds/primitives/field.js`, `src/ds/primitives/field-meta.js`, `src/ds/primitives/field-code.js`
**Verify:** Each ≤100, readable sections, tokens audited, `build` green.

### Task 5: Toggle + Avatar + Logo sheets readable ✓ done
**Objective:** Switch, square avatar, wordmark — close the 9.
**Files:** `src/ds/primitives/toggle.js`, `src/ds/primitives/avatar.js`, `src/ds/primitives/logo.js`
**Verify:** Same.

*Shipped in ae132a8 · Tasks 1–5 · phase-1.*

---

## Phase 2 — Composer + shared chrome, ≤100 lines {#phase-2}
*Tags: Design System, Component*
*Composer still carries a >120ch lede line, component.js line 27 over budget, playground/mount missing export map, and pages-primitives hero copy lags the sheet template. One phase to bring page + chrome to the same scannable standard — extraction not packing.*

| # | Task | Done when |
|---|---|-----------|
| 6 | `pages-primitives` composure | `src/ds/pages-primitives.js` ≤100, one-statement-per-line, header + export map + banners, hero `<h1>` + lede ≤120ch, 9-pane vertical tabs, `mount` delegates to `mountComponent`, `build` green |
| 7 | `component.js` + `playground` chrome | `src/ds/component.js` ≤100 readable (extract `tokHTML`/`tabsHTML` helpers, no >120ch), `src/ds/playground/mount.js` gains export map + banners, `src/ds/playground.js` ≤100 + map + banners, `lint-manage` + `lint:tokens` green |

### Task 6: `pages-primitives` composure ✓ done
**Objective:** Elements → Primitives reads like Foundations — one story per tab, no overflow.
**Files:** `src/ds/pages-primitives.js`
**Verify:** ≤100, hero lede wrapped, 9 panes vertical, `build` green, no >120ch.

### Task 7: `component.js` + `playground` chrome ✓ done
**Objective:** Shared sheet chrome is scannable — tokens + copy + tabs own their lines.
**Files:** `src/ds/component.js`, `src/ds/playground.js`, `src/ds/playground/mount.js`
**Verify:** Each ≤100 or split, banners + export map, `lint-manage` + `lint:tokens` + `build` green.

*Shipped in 569aa24 · Tasks 6–7 · phase-2.*

---

## Phase 3 — Proof, graph, gates green {#phase-3}
*Tags: Design System, Component*
*Exercise is only complete when gates prove it and pixels match intent — lint-manage 0, lint:tokens var-only, build ok, primitives tabs render at 1280 and 640, graph shows primitives 9 sheets.*

| # | Task | Done when |
|---|---|-----------|
| 8 | Lint + build + graph | `npm run lint:tokens` var-only clean, `node scripts/lint-manage.mjs` 0 (or only unrelated pre-existing), `npm run build` green, `node scripts/map-graph.mjs` + `docs/graph.mmd` + `arch-schema.json` fresh |
| 9 | Visual proof — 9 tabs | Screenshots `/ds/#/primitives` Button·Tag·Kicker·Divider·Badge·Field·Toggle·Avatar·Logo at 1280 and 640 show Preview/Code tabs, knobs below, tokens as `.tok` chips, no overflow |

### Task 8: Lint + build + graph ✓ done
**Objective:** Gates are the evidence — not a manual claim.
**Files:** `scripts/*`, `docs/graph.mmd`, `src/ds/arch-schema.json`
**Verify:** `lint:tokens` clean, `lint-manage` 0 new, `build` green, `graph` committed.

### Task 9: Visual proof — 9 tabs ✓ done
**Objective:** Pixels prove the exercise — every sheet looks like the same template.
**Files:** (screenshots)
**Verify:** 9 screenshots attached, knobs live, Code reflects knobs, dark probe where applicable.

*Shipped in c7d3c4d · Tasks 8–9 · phase-3.*
