# Code syntax highlight — IDE-like, mono, one component

**Goal:** Every code snippet renders via one mono component with IDE-like syntax color — primitives Preview/Code, playground Code, and docs `code()` — readable at a glance, token-driven, no hard codes.
**Architecture:** New `src/ds/code-highlight.js` (`highlight` + `codeBlock`) + `src/ds/code-highlight.css` (`.ds-code` + `.hl-*` via `var(--color-code-*)`) + tokens in `tokens-color.css`/`tokens-dark.css`; `specimens/markup.js` (`code()`), `component.js`, and `playground.js` all consume the same highlight. Direct `ds-code` in `space/tables.js` migrates to `code()`.
**Tech Stack:** Vanilla JS regex highlight (strings·comments·tags·vars·keywords·numbers), `var(--color-code-*)` + `var(--font-mono)`/`--leading-mono`, `Chivo Mono 500`, `vite build`.
**Tags:** Design System, Component

<!-- changelog: hide -->

---

## Phase 1 — Tokens + highlight engine + chrome {#phase-1}
*Tags: Design System, Component*
*One source for all code: tokens define IDE palette, highlight turns raw source into escaped spans, CSS paints via `var()` only — no raw hex/rgb outside `tokens.css`.*

| # | Task | Done when |
|---|---|-----------|
| 1 | Syntax tokens (light + dark) | `tokens-color.css` adds `--color-code-bg/fg/comm/str/tag/attr/kw/var/num` via `var(--stone-*)`/`var(--accent* )`; `tokens-dark.css` remaps to `300` ramps for dark contrast; `lint:tokens` clean |
| 2 | Highlight utility | `src/ds/code-highlight.js` ≤100 lines, header + export map + Section banners, one-statement-per-line, exports `highlight(src)` + `codeBlock(src,lang)`; escapes then wraps strings·comments·tags·vars·keywords·numbers in `<span class="hl-*">`; no deps |
| 3 | Highlight stylesheet | `src/ds/code-highlight.css` ≤100 lines, header + banners, `.ds-code` mono block (font/var tokens) + `.hl-*` rules via `var(--color-code-*)`; imported in `ds/index.html`; `build` green |

### Task 1: Syntax tokens (light + dark) ✓ done
**Objective:** IDE palette lives in tokens, not hard codes — light + dark both var().
**Files:** `src/styles/tokens-color.css`, `src/styles/tokens-dark.css`
**Verify:** `npm run lint:tokens` var-only clean, colors derive from `--stone-*`/`--accent*`.

### Task 2: Highlight utility ✓ done
**Objective:** Single highlight turns raw source into escaped mono spans — no dep, readable.
**Files:** `src/ds/code-highlight.js`
**Verify:** ≤100 lines, banners, one-statement-per-line, `highlight` wraps str·comm·var·tag·kw·num in `hl-*`.

### Task 3: Highlight stylesheet ✓ done
**Objective:** `.ds-code` + `hl-*` paint via `var(--color-code-*)` only — mono, IDE-like, scrolls.
**Files:** `src/ds/code-highlight.css`, `ds/index.html`
**Verify:** ≤100 lines, `build` green, `ds-code` uses `--font-mono`/`--leading-mono`.

*Shipped in b09ab52 · Tasks 1–3 · phase-1.*

---

## Phase 2 — Adopt everywhere, prove readable {#phase-2}
*Tags: Design System, Component*
*Replace every scattered `esc()`/`textContent` path with the single highlight component so all code looks IDE-identical and is mono.*

| # | Task | Done when |
|---|---|-----------|
| 4 | `specimens/markup.js` adopts | `code(s,lang)` imports `highlight` and returns `<div class="ds-code" data-lang><pre><code class="hl">` + highlighted; all `foundations/*`, `functions/*`, `patterns*` via `code()` instantly highlighted; ≤100 lines, banners |
| 5 | `component.js` + `playground.js` adopt | `component.js` + `playground.js` import `highlight`; `codeHTML` uses `highlight(o.code(init))`; mounts set `innerHTML` not `textContent`; `playground/mount.js` likewise; copy still copies raw `cfg.code`; `lint:tokens` + `build` green |
| 6 | Tables + wiring + proof | `foundations/space/tables.js` convention migrates to `code()`; `ds/index.html` links `code-highlight.css`; gates `plan:names` + `ds:track` + `test` green; visual: `/ds/#/primitives` + `/ds/#/foundations` + `/ds/#/special` code blocks show mono + tag/attr/string/kw colors in light+dark, overflow scrolls |

### Task 4: `specimens/markup.js` adopts ✓ done
**Objective:** One `code()` for all docs — highlight once, everywhere IDE-identical and mono.
**Files:** `src/ds/specimens/markup.js`
**Verify:** `code(s,lang)` returns `data-lang` + `code.hl` with highlighted body; ≤100, banners.

### Task 5: `component.js` + `playground.js` adopt ✓ done
**Objective:** Primitives and playground share the same block — no `esc()`/`textContent` drift.
**Files:** `src/ds/component.js`, `src/ds/playground.js`, `src/ds/playground/mount.js`
**Verify:** `codeHTML` uses `highlight`, mounts set `innerHTML` on `code.hl`; copy still raw; gates green.

### Task 6: Tables + wiring + proof ✓ done
**Objective:** The one stray `ds-code` migrates; index wires CSS; proof gates + visual IDE parity.
**Files:** `src/ds/foundations/space/tables.js`, `ds/index.html`, `docs/graph.mmd`, `src/ds/arch-schema.json`
**Verify:** `convention()` uses `code()`; `ds/index.html` links `code-highlight.css`; `plan:names` + `ds:track` + `test` green; 9 tabs mono highlighted.

*Shipped in 1afa0c0 · Tasks 4–6 · phase-2.*
