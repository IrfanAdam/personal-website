# Portfolio mobile optimisation — build plan

> **For Hermes:** implement task-by-task, portfolio scope only (no `src/ds`, no admin).

**Goal:** Make the portfolio site fully usable at 360–768px while moving theme + sound out of the header into a settings menu.

**Architecture:** Collapse `strip-meta` (theme pills + sound pill + count) into one in-flow gear button with an absolute dropdown; give the thumbnail strip full row width on mobile; then sweep masonry / case / works / contact / viewer / form breakpoints.

**Tech Stack:** Vanilla JS + Vite, existing CSS tokens (`src/styles/*`), no new deps.

**Tags:** Layout, Component

---

## Phase 1 — Settings menu (theme + sound off the bar) {#phase-1}

*Tags: Component*

### Task 1: Add gear button + dropdown markup in `main.js` ✓ done

**Objective:** Replace inline theme pills with one in-flow settings entry point.

**Files:**
- Modify: `src/main.js:16-28` (stripbar template)
- Modify: `src/theme.js` (keep `data-theme-btn` delegation working inside dropdown)
- Modify: `src/views/init-sound.js:44-67` (render sound toggle inside dropdown, not `.strip-meta`)

**Steps:**
1. In `main.js` replace `<div class="strip-meta">…theme-switch…count…</div>` with `<div class="smenu"><button id="settingsBtn" aria-haspopup="true" aria-expanded="false" title="Settings">⚙</button><div class="smenu-pop" hidden>…theme pills + sound slot + count…</div></div>` kept as last flex child of `#stripbar` (in-flow, `flex:none`).
2. Keep `data-theme-btn="system|light|dark"` and `data-sound-toggle` attributes unchanged so existing delegation keeps working.
3. Toggle `hidden` + `aria-expanded` on click; close on outside click and `Escape`; return focus to gear on close.

**Verify:** Desktop click gear → dropdown shows 3 theme pills + sound icon; selecting theme persists `adam-theme`; `npm run build` green.

### Task 2: Style gear + popover token-only ✓ done

**Objective:** Dropdown floats without stealing nav width.

**Files:**
- Modify: `src/styles/base.css` (`.smenu`, `.smenu-pop` rules)
- Modify: `src/styles/base-actions.css` (reuse `.pill`, `.snd-pill`)

**Steps:**
1. `.smenu { flex: none; position: relative; }` — in-flow, not `position:fixed`.
2. `.smenu-pop { position: absolute; right: 0; top: calc(100% + 8px); }` with surface bg, hairline border, token spacing only.
3. On `max-width:640px` pop opens upward (`bottom: calc(100% + 8px); top: auto`) since bar is bottom-docked.

**Verify:** No hex/rgb literals (`npm run lint:tokens`); bar width unchanged with menu closed.

*Shipped in 3f91b98 · Tasks 1–2 · phase-1.*

## Phase 2 — Mobile header in-flow fix {#phase-2}

*Tags: Layout*

### Task 3: Free the thumbnail strip on ≤640px ✓ done

**Objective:** Strip gets full row width; nothing fixed-positioned competes with it.

**Files:**
- Modify: `src/styles/base.css:33-55` (mobile `.top` / `.stripbar` block)
- Modify: `src/styles/pages.css:2-16` (`.strip` scroll rules)

**Steps:**
1. Keep `.top` bottom-docked (`position:fixed; bottom:0`) but make `#stripbar` a single row: `.strip { flex:1 1 auto; min-width:0; overflow-x:auto }` + `.smenu { flex:none }`; remove `gap:0`/`overflow:hidden` that crushes the strip.
2. Confirm gear is a flex child (in-flow), dropdown is the only `absolute` element; delete any `position:fixed` on header children if found.
3. Keep `.hint/#count` hidden on mobile (already) — move count text inside dropdown.

**Verify:** At 360px wide the strip scrolls 14 thumbs + contact + 2 vtabs; gear stays visible right; no horizontal page overflow (`document.documentElement.scrollWidth === innerWidth`).

### Task 4: Bottom-bar polish ✓ done

**Objective:** Safe-area + hide-on-scroll correct when docked bottom.

**Files:**
- Modify: `src/boot-chrome.js` (already flips `.hide` to `translateY(100%)` on mobile — keep)
- Modify: `src/styles/base.css`

**Steps:**
1. Keep `padding-bottom: env(safe-area-inset-bottom)` on `.top`; body padding-bottom = header height.
2. Verify `ResizeObserver` updates `--header-h` when dropdown opens/closes (dropdown is absolute so it must not grow header — assert `header.offsetHeight` unchanged).

**Verify:** Scroll down hides bar, scroll up reveals; no content hidden behind bar at page end (footer padding ok).

*Shipped in cfb55a7 · Tasks 3–4 · phase-2.*

## Phase 3 — Portfolio mobile sweep {#phase-3}

*Tags: Layout*

### Task 5: Grids + cards (masonry / works / about)

**Objective:** Single column, readable type, no overflow at 360px.

**Files:**
- Modify: `src/styles/masonry.css:26-30` (already 1-col ≤640px — verify gap + padding)
- Modify: `src/styles/card.css` (disable hover-zoom transform on touch, keep tap)
- Modify: `src/styles/pages-sections.css` (`.work` rows stack; `.cta-band` padding down; `.about` full width)

**Steps:**
1. Confirm `.cols { grid-template-columns:1fr }` ≤640px; card image aspect preserved.
2. Guard `.card:hover img { transform }` behind `@media (hover:hover)`.
3. `.work { flex-direction:column; gap:4px }` on mobile; `.cta-actions .btn { width:100% }` optional.

### Task 6: Case detail + contact + viewer + form

**Objective:** 56/44 split stacks cleanly; hero media first (already `order:-1` ≤640px — verify); contact `h1` wraps; viewer/form fit.

**Files:**
- Modify: `src/styles/case.css:9-21` (stack ≤800px — verify copy padding, media order)
- Modify: `src/styles/pages-sections.css:46-58` (`.contact-hero h1` font clamps: `font-size:clamp(...)` or keep `--text-title` if it fits 360px)
- Modify: `src/styles/viewer.css`, `src/styles/form.css`, `src/styles/form-controls.css` (inputs `max-width:100%`, viewer close target ≥44px)

**Steps:**
1. Test one long case, contact page, one viewer open, one form at 360px; fix only overflowers.
2. Tap targets for strip thumbs/vtabs/gear ≥40px.

*Shipped in TBD · Tasks 5–6 · phase-3.*

## Phase 4 — Verify + ship {#phase-4}

*Tags: Tooling*

### Task 7: Gates + device pass

**Objective:** Zero regressions, доказано on real widths.

**Files:** none (verification only)

**Steps:**
1. Run `npm run lint:tokens && npm run build` — both green.
2. Serve `vite --port 5174` (never `:5173`, user tests there in Safari) and check 360 / 390 / 768 + desktop: header strip scrolls, settings dropdown works, no x-overflow, case/contact/viewer clean.
3. Keyboard: Tab to gear, Enter opens, Esc closes, theme/sound reachable; `aria-expanded` correct.

*Shipped in TBD · Tasks 7–7 · phase-4.*

---

## Risks / open questions

- Sound toggle is injected by `init-sound.js` MutationObserver — moving its mount point into the dropdown needs the observer edit in Task 1, else a duplicate pill reappears in `.strip-meta`.
- If you want the gear visible on desktop too (recommended: one header on all sizes), say so — default in this plan is gear on all sizes, pills removed everywhere.
- Portfolio-only scope: no `src/ds` changes, so no `[plan:…]` commit trailer or `changelog-names.json` entry required; normal commits.
