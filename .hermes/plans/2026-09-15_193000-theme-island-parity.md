# Theme islands — one theme, every token

> **For Hermes:** the DS pair cells and the site's manual theme toggle both build a themed island (`[data-theme="light"|"dark"]`) inside whatever the OS prefers. An island is honest only when it restates the whole themed set — the moment a token is missing there, the island silently borrows the other theme.

**Goal:** A light island inside a dark OS (and vice-versa) resolves every themed token — colour and the lifted shadow — to its own theme, and every token the DS advertises actually renders instead of being dropped by the parser.

**Architecture:** `tokens-overrides.css` holds the two dark blocks (OS preference + manual) and the light island; the light island now restates the surface-sunken alias and the lifted shadow, and the shadow declarations lost the stray `,;` that made the parser drop them (the two `Expected identifier but found "0"` warnings in every build).

**Tech Stack:** CSS custom properties across the token layers (`tokens-color`, `tokens-fx`, `tokens-overrides`), verified through computed styles in a real browser with the OS preference emulated.

**Tags:** Design System, Motion

---

## Phase 1 — Island parity + a shadow that renders {#phase-1}

*Tags: Design System*

*Found from a live read of `/ds/#/foundations`: the Sunken pair's light cell read `1.00 · Fail`, which exposed the missing island token.*

### Task 1: Sunken surface inside the light island ✓ done

**Objective:** The new `--color-surface-sunken` was defined in the light defaults and both dark blocks but never restated in `[data-theme="light"]`, so a light island under a dark OS inherited `stone-900` — dark ink on dark surface.
**Files:** `src/styles/tokens-overrides.css`
**Verify:** `/ds/#/foundations` → Canvas · ink on paper → Sunken · LIGHT reads `14.06 · AAA` (was `1.00 · Fail`); dark cell unchanged at `16.01 · AAA`.

### Task 2: The lifted shadow renders again ✓ done

**Objective:** `--shadow-viewer` carried a stray `,;` in the base layer and both dark blocks, so the declaration was invalid and the advertised token resolved to nothing — no viewer shadow anywhere, plus two CSS syntax warnings on every build.
**Files:** `src/styles/tokens-fx.css`, `src/styles/tokens-overrides.css`
**Verify:** `.fd-elev--viewer` and the site's `.viewer` compute a real `box-shadow`; `npm run build` no longer prints `Expected identifier but found "0"`.

### Task 3: Light island restates the shadow ✓ done

**Objective:** Dark blocks swap the lifted shadow for the heavier cut (`space-14/36`), so a light island has to restate the light cut or it inherits the dark one.
**Files:** `src/styles/tokens-overrides.css`
**Verify:** With the OS emulated dark — light island resolves `0 12px 32px …` (light cut), dark root `0 14px 36px …` (heavy cut).

### Task 4: Dark theme gets its own layer file ✓ done

**Objective:** Restating the island tokens pushed `tokens-overrides.css` to 103 lines (budget is 100). Instead of packing lines, the dark set moved to `src/styles/tokens-dark.css` — light defaults live in `tokens-color.css`, dark in `tokens-dark.css`, scope resets in `tokens-overrides.css` (linked last so the island out-ranks the dark blocks).
**Files:** `src/styles/tokens-dark.css`, `src/styles/tokens-overrides.css`, `index.html`, `ds/index.html`
**Verify:** Layer split resolves correctly under an emulated dark OS — root `#12151a / stone-900`, light island `#eceef2 / stone-200`, dark cell `#12151a / stone-900`, Sunken row `14.06 AAA · 16.01 AAA`; `lint:manage` clean (43 + 62 lines).
