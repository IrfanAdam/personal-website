# Color — Cool Synthetics + Swap-Slot Layer

**Goal:** Cooler neutral palette with a sci-fi synthetic material story; color consumed through a 3-hop chain (ramp → swap slot → semantic) so accents and messaging roles rebind without touching components. Pre-wires the future DS-as-configurator.

**Architecture:** `material ramp` (raw values, never consumed) → `swap slot` (one active pick of N) → `--color-*` semantic (what components consume). Example: `--accent-500` → `--signal: var(--accent-500)` → `--color-accent: var(--signal)`. The future configurator writes to the middle layer only. Same shape planned for type.

**Tech Stack:** Vanilla JS modules, `tokens.css` single source, `npm run test` (lint:tokens + vite build) as gate per phase. Commits cite `[plan:2026-09-10_153555-color-cool-synthetic.md#phase-N]`.

**Reference:** Update 4 plan structure (phase → task table → Objective/Files/Verify per task); 3-tier token doctrine (core → semantic → component); standing conventions in `README.md § DS conventions`.

---

## Current context / assumptions

- Token truth: `src/styles/tokens.css` v1.1.0 — warm stone ramp (`#faf8f4 → #141210`) + vermilion/amber/teal accent ramps → `--color-*` semantics; dark theme is a hand-tuned inversion with some raw hex literals.
- Color pane today: ① primitives (labeled ramps) → ② grouped semantics → ③ mixer playground → ④ live AA matrix, both themes. Every row already renders a live swatch via `tokenTrace`.
- Constraints: token names stable (no renames); raw values only in `tokens.css`; every stylesheet ≤100 lines; `npm run test` green per phase. Only Phase 5 changes live-site pixels.

---

## Phase 1 — Cooler neutrals

*Shipped in 5fcbdac · Tasks 1–4 · phase-1.*

*Stone goes blue-gray; dark inversion follows; matrix stays all-AA.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Candidate cool ramps | 2–3 blue-gray stone candidates as DS specimens, one picked |
| 2 | Stone retune | ramp values cool, names unchanged, zero renames |
| 3 | Dark inversion retune | hand-tuned dark values re-balanced to the new ramp |
| 4 | AA re-proof | full matrix green in both themes |

### Task 1: Candidate cool ramps ✓ done
**Objective:** Render 2–3 blue-gray stone candidates side-by-side in the Color pane (temp specimens, removed after pick) so the choice is eyeballed, not guessed.
**Files:** `pane-color.js` (temp specimens only).
**Verify:** Candidates visible in DS; docs-only; `npm run test` PASS.

### Task 2: Stone retune ✓ done
**Objective:** Winning candidate values land in `--stone-*`; token names and step count unchanged.
**Files:** `tokens.css` (values only).
**Verify:** Ramp renders cool in both themes; `npm run test` PASS.

### Task 3: Dark inversion retune ✓ done
**Objective:** Hand-tuned `[data-theme="dark"]` + `prefers-color-scheme` values re-balanced against the new ramp (no pure ramp swap).
**Files:** `tokens.css` (dark blocks only).
**Verify:** Dark DS eyeball pass; `npm run test` PASS.

### Task 4: AA re-proof ✓ done
**Objective:** Full contrast matrix re-probed live in both themes; any regressed pair re-tuned at the ramp level.
**Files:** `tokens.css` (tints only if needed), `pane-color.js` (no structural change).
**Verify:** Matrix all-AA both themes; `npm run test` PASS.

## Phase 2 — Synthetic material story

*Shipped in 5fcbdac · Tasks 5–6 · phase-2.*

*Every ramp gets a material identity; values derive from imagined reflectance, never real-world matter.*

| # | Task | Done when |
|---|------|-----------|
| 5 | Material mapping in-pane | each ramp carries material name + story |
| 6 | Overview STYLE line | one material-story line in the overview card |

### Task 5: Material mapping in-pane ✓ done
**Objective:** Mapping table in the Color pane: ramp → synthetic material (e.g. hull alloy / frost glass / signal phosphor — names TBD) → what the material means for usage. Names TBD by owner before values derive.
**Files:** `pane-color.js` (docs only).
**Verify:** Every ramp mapped; `npm run test` PASS.

### Task 6: Overview STYLE line ✓ done
**Objective:** One material-story line in the overview STYLE card so the theme reads from the top.
**Files:** `pages-overview.js` (copy only).
**Verify:** Copy-only; `npm run test` PASS.

## Phase 3 — Swap-slot layer

*Shipped in f12ea02 · Tasks 7–8 · phase-3.*

*The middle tier: components keep consuming `--color-*`; slots repoint beneath them.*

| # | Task | Done when |
|---|------|-----------|
| 7 | Signal slot tokens | `--signal-*` slots feed `--color-accent`, alts on amber/teal |
| 8 | Playground swap demo | rebind slot live, matrix stays AA |

### Task 7: Signal slot tokens ✓ done
**Objective:** Additive `--signal` slot tier: `--color-accent: var(--signal)` with `--signal` defaulting to vermilion; amber/teal alts defined. Success/error/warning/info stay as the messaging layer over the ramps.
**Files:** `tokens.css` (additive only).
**Verify:** Default render pixel-identical; `npm run test` PASS.

### Task 8: Playground swap demo ✓ done
**Objective:** Mixer-area control repoints the slot live across the DS; contrast matrix re-proves on swap.
**Files:** `pane-color.js` (demo + docs).
**Verify:** Slot swap re-themes DS live, matrix AA; components untouched; `npm run test` PASS.

## Phase 4 — Grouped token list audit

*Shipped in 0d54de5 · Tasks 9 · phase-4.*

*The list you asked for: every color token grouped, every row with its tiny swatch.*

| # | Task | Done when |
|---|------|-----------|
| 9 | Swatch audit | zero color rows without a live swatch + hex |

### Task 9: Swatch audit ✓ done
**Objective:** Every `--color-*` under exactly one group with live swatch + hex via `tokenTrace`; fix any `plain:true` gaps or rows missing live values.
**Files:** `pane-color.js`.
**Verify:** Zero swatch-less color rows; `npm run test` PASS.

## Phase 5 — Site adoption

*Shipped in a48f9b4 · Tasks 10 · phase-5.*

*The one pixel-changing step, deliberate and eyeballed.*

| # | Task | Done when |
|---|------|-----------|
| 10 | Live adoption + visual pass | site + DS read the new palette, light + dark |

### Task 10: Live adoption + visual pass ✓ done
**Objective:** Adopt the new values live (they already ship via `tokens.css`); fix any specimen that drifts; light + dark eyeball pass over site and DS.
**Files:** Adoption fixes only if drift found.
**Verify:** Full `npm test` PASS + eyeball pass.
