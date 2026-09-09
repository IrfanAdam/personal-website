# Design System Update 4 — Foundations → Evo Parity

**Goal:** Close the structural gaps between ADAM/DS Foundations (7 tabs) and eBay Evo/Skin conventions — feedback color roles, paired type scale, breakpoint + composition tokens, focus-ring + reduced-motion contracts, and a third component-token tier — one phase per tab, without touching live-site pixels unless a new token is deliberately adopted.

**Architecture:** Docs-only work in `src/ds/foundations/pane-*.js` + `src/styles/tokens.css` (additive tokens only); `src/ds/ds.js` untouched. Evo is the yardstick for *structure* (3-tier tokens, per-pair AA matrices, MIND-style gates), never for values — stone + vermilion + zero-radius doctrine stays.

**Tech Stack:** Vanilla JS modules, `tokens.css` single source, `npm run test` (lint:tokens + vite build) as gate per phase.

**Reference:** eBay Playbook / Skin token tiers (core → semantic → component), `@ebay/design-tokens` value types (color, spacing, typography, motion, radius, shadow, breakpoints…), 8px base scale, paired type steps (size/line-height), MIND accessibility patterns. Third-party value snapshots treated as illustrative, not canonical — we adopt shapes, not numbers.

---

## Current context / assumptions

- Tabs today: Color | Type | Space · Layout | Shape | Motion · Depth | FX | Tokens (contract index).
- Token truth: `src/styles/tokens.css` v1.1.0 — primitives → semantic → legacy aliases. No component tier, no breakpoint tokens (breakpoints are the sole raw-literal exception), no feedback roles (success/error/warning/info), no focus-ring token, no reduced-motion contract.
- Demos already read live `var()` (our answer to Evo's Figma-sourced Playbook: docs can't go stale on values).
- Constraints: every stylesheet ≤100 lines, no raw hex outside `tokens.css`, `npm run test` green per phase. New *hues* (feedback greens/reds) are a design decision — flagged, not snuck in.

## Gap map (Evo structure → our tab)

- Color: missing feedback roles + on-colors, disabled + focus-ring tokens, full AA pair matrix (we sample 4 pairs), dark-mode contrast proof.
- Type: sizes and leadings listed separately, never as paired steps; fluid `clamp()` undocumented; no min-size / resize guidance.
- Space · Layout: no `--break-*` tokens; no composition (stack/cluster) patterns; touch-target token exists but unaudited.
- Shape: zero doctrine undefended; no focus-ring shape spec.
- Motion · Depth: no `prefers-reduced-motion` story; no duration→use pairing; elevation doctrine (line+frost, no shadow) implicit.
- FX: no graduation rule for token-vs-lab-local knobs (identity tab, keep it, formalize it).
- Tokens: no component-token tier, no naming/versioning/deprecation policy, no a11y contract checklist.

## Phase 1 — Color: primitives → semantic → story (revised)

*Shipped in dba2975 · Tasks 1–6 · Task 7 deferred · Phase-1-2.*

*Neutral ramp stays, labeled in-swatch. Accent becomes its own ramp with room for future hues. Semantic rows regrouped by site purpose. Explorer tells ramp → meaning → play → proof. Feedback roles deferred to Task 7.*

| # | Task | Done when |
|---|------|-----------|
| 1 | Baseline inventory | counts logged, test green |
| 2 | Labeled ramps: neutral + accent | every step labeled in-swatch, both themes |
| 3 | Semantic regroup | each token under one plain-language heading |
| 4 | Disabled + focus tokens | live ring specimen, test pass |
| 5 | Explorer story | tab reads ramp → meaning → play → proof |
| 6 | AA matrix | all pairs × both themes |
| 7 | Feedback roles (deferred) | only after hue sign-off |

### Task 1: Baseline inventory ✓ done
**Objective:** Count today's semantic tokens vs traced rows, plus contrast-pair count and dark-mode coverage.
**Files:** None (read-only).
**Verify:** Numbers in thread; `npm run test` green.

### Task 2: Labeled ramps — neutral + accent ✓ done
**Objective:** Stone ramp rendered as full swatches with name + value inside each; accent promoted from one step to its own `--accent-100…900` ramp (values kept); `--accent2-*` / `--accent3-*` slots documented with no values until approved.
**Files:** `tokens.css` (additive), `pane-color.js` (ramp renderer).
**Verify:** All steps labeled in-swatch, both themes; zero new hues; `npm run test` PASS.

### Task 3: Semantic regroup ✓ done
**Objective:** Rows grouped under Canvas · Ink · Division · Action (CTA bg, on-accent, chip, input focus) · Media · State. Grouping only, no renames without alias.
**Files:** `pane-color.js`.
**Verify:** Each `--color-*` under exactly one heading; `npm run test` PASS.

### Task 4: Disabled + focus tokens ✓ done
**Objective:** `--color-disabled-*` + `--color-focus` land in the State group, ring spec shared with Shape phase.
**Files:** `tokens.css`, `pane-color.js`.
**Verify:** Live ring specimen; `npm run test` PASS.

### Task 5: Explorer story ✓ done
**Objective:** Sections reordered ① Primitives (ref-only) → ② Semantic (light/dark) → ③ Playground (mixer demoted) → ④ Proof (matrix + toggle).
**Files:** `pane-color.js` (order + headings + sub copy).
**Verify:** Docs-only; `npm run test` PASS.

### Task 6: AA matrix ✓ done
**Objective:** Generated verdict matrix for every text/background pairing, light and dark via `probeTheme`.
**Files:** `pane-color.js`, `pages-foundations.js`.
**Verify:** Full `--color-ink*` × canvas coverage × both themes; `npm run test` PASS.

### Task 7 (deferred): Feedback roles
**Objective:** Success / error / warning / info + on-colors, only after hue sign-off with proposed derivations.
**Files:** `tokens.css` (additive), `pane-color.js`.
**Verify:** Both themes via live probe; no existing value changed; `npm run test` PASS.

## Phase 2 — Type: capped scale + live samples + story

*Shipped in dba2975 · Tasks 8–11 · Phase-1-2.*

*Weight caps at 700 and ramps down — no 800 anywhere. Leading/tracking rows get real type specimens instead of empty color swatches. Tester reframed as scale → voice → playground with hierarchy shown.*

| # | Task | Done when |
|---|------|-----------|
| 8 | Paired scale + 700 cap | every `--text-*` with partners, max weight 700 |
| 9 | Fluid + floors note | clamp behavior + zoom expectations documented |
| 10 | Sample fix: non-color rows | leading/tracking render type specimens, zero blank cards |
| 11 | Tester story | hierarchy + voice shown, tester reads as playground |

### Task 8: Paired size/leading steps + 700 cap ✓ done
**Objective:** Scale table pairing each `--text-*` with its `--leading-*` + tracking; cap weight at 700 — Display and Logo drop from 800, `--weight-extrabold` deprecated, ramp runs 700 → 600 → 500 → 400.
**Files:** `pane-type.js`, `tokens.css` (weight tokens), `index.html` (font URL drops 800), site-wide 800 audit.
**Verify:** No 800/extrabold in pane, font URL, or site type; every `--text-*` appears once with partners; `npm run test` PASS.

### Task 9: Fluid + floors note ✓ done
**Objective:** Document `clamp()` behavior (display/title), minimum sizes, 200% zoom expectations.
**Files:** `pane-type.js` (code block + notes).
**Verify:** Docs-only; `npm run test` PASS.

### Task 10: Non-color sample fix ✓ done
**Objective:** Leading/tracking rows currently render empty `.ds-sw` color swatches (unitless values aren't colors) — give them type specimens (e.g. set sample lines) or a trace variant without swatches.
**Files:** `pane-type.js`, `specimens.js` (renderer variant).
**Verify:** Zero blank cards in Type tab; `npm run test` PASS.

### Task 11: Tester story + hierarchy ✓ done
**Objective:** Tester reframed: ① scale (what steps exist) → ② voice (Inter Tight vs Chivo Mono, where each speaks incl. hierarchy map: hero → h1 → section → card → meta) → ③ playground (editable tester demoted to last).
**Files:** `pane-type.js` (order + headings + sub copy).
**Verify:** Tab reads as hierarchy first, tester last; docs-only; `npm run test` PASS.

## Phase 3 — Space · Layout: usage-anchored scale + honest specimens + naming

*Shipped in 7d3bcea · Tasks 12–16 · Phase-3-4.*

*Every space step shows what it's for, grouped by purpose — not bare px bars. Layout specimens go true-scale with live values. Token naming gets a plain-language convention (space vs size vs measure, alias discipline) in-pane; full policy stays Phase 7.*

| # | Task | Done when |
|---|------|-----------|
| 12 | Usage-anchored scale | every `--space-*` grouped by purpose with where-used |
| 13 | Honest layout specimens | true-scale bars, live values, fixed measure rows |
| 14 | Naming convention guide | space/size/measure/alias rule documented in-pane |
| 15 | Breakpoint tokens | queries tokenized, zero pixel change |
| 16 | Touch-target audit | pass/fail per specimen |

### Task 12: Usage-anchored scale ✓ done
**Objective:** Regroup the scale by purpose — Micro 1–4 (hairlines, insets) · Gaps 5–18 (component gaps, card padding) · Sections 22–90 (stacks, page rhythm) — each row keeping its live bar plus where-used; `--rhythm`/`--gutter` shown as "prefer the alias" for their purposes.
**Files:** `pane-space.js`.
**Verify:** Every `--space-*` under exactly one purpose group with a use case; `npm run test` PASS.

### Task 13: Honest layout specimens ✓ done
**Objective:** Layout bars use hardcoded illustrative widths today (Header 32%, Strip 28%…) that match nothing — make them true-scale to wrap or explicitly labeled schematics with live values; measure copy/prose rows reuse the color-swatch renderer (blank swatches) — fix per Task 10; breakpoint code string becomes a readable recipe list.
**Files:** `pane-space.js`, `specimens.js` (shared with Task 10 fix).
**Verify:** No fake-proportioned bars, zero blank cards; `npm run test` PASS.

### Task 14: Naming convention guide ✓ done
**Objective:** In-pane convention box: `--space-N` = raw px steps (pick by size) · `--size-*` = named objects (wrap, header, strip, tap, hairline, frame) · `--measure-*` = line length · `--rhythm`/`--gutter` = purpose aliases (prefer over raw numbers). No renames — anything confusing (e.g. strip vs strip-tab) is documented, renames flow through Phase 7 deprecation.
**Files:** `pane-space.js` (convention note), `tokens.css` (convention comment).
**Verify:** Convention visible in-pane; zero token renames; `npm run test` PASS.

### Task 15: Breakpoint tokens ✓ done
**Objective:** Introduce `--break-*` tokens (or documented scale) and migrate DS media queries to them, ending the raw-literal exception era.
**Files:** `tokens.css`, `ds.css`, `foundations.css` (media queries only).
**Verify:** `lint:tokens` extended or exception note removed from contract; zero pixel change; `npm run test` PASS.

### Task 16: Touch-target audit ✓ done
**Objective:** Audit `--size-tap` 44px against all interactive DS specimens; record pass/fail per specimen.
**Files:** `pane-space.js` (audit note/table).
**Verify:** Docs-only; `npm run test` PASS.

## Phase 4 — Shape: doctrine + proof + mapping + ring

*Shipped in 7d3bcea · Tasks 17–19 · Phase-3-4.*

*Five identical squares prove nothing — the tab needs its argument (why zero), its proof (zero vs rounded), its map (which radius lands where), and its ring.*

| # | Task | Done when |
|---|------|-----------|
| 17 | Zero doctrine + proof | why-zero stated, zero-vs-rounded specimen |
| 18 | Radius→component mapping | every radius + border token mapped with live specimens |
| 19 | Focus ring | live ring specimen, both themes |

### Task 17: Zero doctrine + proof ✓ done
**Objective:** One-line doctrine defense (why zero vs rounded paradigms) plus a zero-vs-rounded comparison specimen so the page argues visually instead of asserting.
**Files:** `pane-shape.js`.
**Verify:** Doctrine + comparison visible; docs-only; `npm run test` PASS.

### Task 18: Radius→component mapping ✓ done
**Objective:** Every `--radius-*` mapped to its components with live specimens on real elements; border tokens (hairline/frame/dashed) presented as the structure system with specimens; blank-swatch trace rows fixed per Task 10.
**Files:** `pane-shape.js`, `specimens.js` (shared fix).
**Verify:** Each radius + border token has a live specimen showing where it lands; `npm run test` PASS.

### Task 19: Focus ring spec ✓ done
**Objective:** `--border-focus` width/offset/color spec with live keyboard-triggerable ring specimen, mirrored in the Task 4 State group.
**Files:** `tokens.css` (focus tokens if missing), `pane-shape.js`.
**Verify:** Ring specimen visible in both themes; `npm run test` PASS.

## Phase 5 — Motion · Depth: story + prescription + honest illustration

*Durations read as a menu with decorative bars. Each duration gets its sanctioned uses, bars go true-scale, easing gets its story, depth gets its ladder.*

| # | Task | Done when |
|---|------|-----------|
| 20 | Reduced-motion contract | OS setting honored in demo |
| 21 | Duration→use pairing + true-scale bars | every `--dur-*` prescribed, bars proportional |
| 22 | Easing + press story | signature curve shown where used, live specimens not code |
| 23 | Depth ladder | line+frost scale with specimens + helper text |

### Task 20: Reduced-motion contract
**Objective:** `prefers-reduced-motion` behavior spec (what collapses to instant, what survives) + live toggle or media-query demo.
**Files:** `pane-motion.js`, `foundations.css` (media query only).
**Verify:** Demo honors OS reduced-motion setting; `npm run test` PASS.

### Task 21: Duration→use pairing + honest bars
**Objective:** Table mapping each `--dur-*` to its sanctioned uses (frame, zoom, reveal, ambient) so durations read as prescription, not menu; bars computed true-scale to the longest duration instead of hardcoded widths.
**Files:** `pane-motion.js`.
**Verify:** Every `--dur-*` mapped; bars proportional to values; `npm run test` PASS.

### Task 22: Easing + press story
**Objective:** Signature easing presented as story — what it feels like, the three places it runs (frame + zoom + reveal) — replay stage kept as proof; scale-press / opacity-hover graduate from the code string to live specimens.
**Files:** `pane-motion.js`.
**Verify:** No token behavior left in code strings; `npm run test` PASS.

### Task 23: Depth doctrine + ladder
**Objective:** Line+frost-not-shadow doctrine with a blur ladder specimen (header → scrim → placeholder), each step labeled with where-used; saturation tokens folded into the same story.
**Files:** `pane-motion.js` (note + ladder specimen).
**Verify:** Docs-only; `npm run test` PASS.

## Phase 6 — FX: graduation story + connected demos

*The token wall is numbers in color-swatch cards — meaningless. The tab leads with its concept (lab → token → site), then every demo names the tokens it runs on in plain language.*

| # | Task | Done when |
|---|------|-----------|
| 24 | Graduation story + connected demos | concept stated, demos name tokens, zero blank cards |

### Task 24: Graduation story + connected demos
**Objective:** Lead with the graduation concept (lab-local knobs vs graduated `--fx-*` tokens vs site consumption); number-valued rows move off the color-swatch renderer (shared Task 10 variant); each demo (grid, shimmer, rise, press, viewer spring) labels the exact tokens it runs on with plain-language meaning (wait = stagger pause, k/fr = spring stiffness/friction); viewer code string becomes labeled specimens.
**Files:** `pane-fx.js`, `pane-contract.js` (one index line), `specimens.js` (shared fix).
**Verify:** Concept + per-demo token labels + zero blank cards; `npm run test` PASS.

## Phase 7 — Tokens: third tier + policy + a11y gate

### Task 25: Component-token tier
**Objective:** Introduce the Evo third tier (`--<component>-*` overrides, e.g. viewer already implies `--viewer-border`) with naming convention + one worked example; forbid new semantic sprawl where a component token fits.
**Files:** Modify: `src/styles/tokens.css` (convention comment), `src/ds/foundations/pane-contract.js` (index + Do/Don't).
**Verify:** Convention documented with example; `npm run test` PASS.

### Task 26: Versioning + deprecation policy
**Objective:** Short policy: token rename/deprecate flow (alias → sunset), version bump rule, where it gets announced (changelog).
**Files:** Modify: `src/ds/foundations/pane-contract.js`.
**Verify:** Docs-only; `npm run test` PASS.

### Task 27: A11y contract checklist + verification
**Objective:** Contract-level checklist (contrast AA per matrix, visible focus, reduced motion, 44px targets, theme parity) with pass state per item; full `npm run test` + theme-toggle + keyboard walkthrough as the release gate (our MIND-gate equivalent).
**Files:** Modify: `src/ds/foundations/pane-contract.js`.
**Verify:** All items pass or are marked open with owner phase; `npm run test` PASS.
