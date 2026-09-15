# Foundations · Sound — the eighth definition

> **For Hermes:** the Sound sheet completes the Foundations page (color, type, space, shape, motion, fx, contract → sound) and is the lab where the site's own voice is browsed, tuned and heard through the real pipeline.

**Goal:** Give sound the same standing as the other foundations: one sheet that shows every voice (procedural and file), plays them through the exact engine the site uses, draws the waveform that actually plays, and documents the consumption rules — so a future sound decision is browsed here first.

**Architecture:** `pane-sound.js` composes the sheet from four submodules (procedural grid, file palette, scope, usage guide) inside line-variant inner tabs, and `sound/board.js` mounts the interactivity: play buttons resolve `voice`/`file` through `playVoice`/`playFileId`, sliders write gain/ms/freq, test A/B and reset-ctx expose the raw audio context, and the scope canvas is painted from the same offline buffer that plays (`synth-render.js` → `scope-draw.js`).

**Tech Stack:** Vanilla JS + Vite, WebAudio (`OfflineAudioContext` → WAV blob) with the element engine, existing DS specimens/token CSS. No new deps.

**Tags:** Design System, Component, Function

---

## Phase 1 — Sound sheet: browse, play, prove {#phase-1}

*Tags: Design System*

*Provenance: authored in session `20260915_173350_c68528`, parked uncommitted with headers citing a plan that never existed (`2026-03-15_sound-foundation.md`). Adopted, re-pointed at this plan, re-verified and shipped.*

### Task 1: Pane composer ✓ done

**Objective:** One `label`/`html` pair the foundations page can mount, composing intro + Lab/File/Code tabs + scope.
**Files:** `src/ds/foundations/pane-sound.js`
**Verify:** `import { label, html }` used by `pages-foundations.js`; sheet renders after the Fx pane.

### Task 2: Procedural voice lab ✓ done

**Objective:** Every synth voice as a playable card — gain, ms, freq knobs and a status readout.
**Files:** `src/ds/foundations/sound/procedural.js`, `src/ds/foundations/sound/data.js`
**Verify:** Each card's ▶ plays that voice through `playVoice`; sliders update their outputs.

### Task 3: File palette ✓ done

**Objective:** The vendored `/sounds` files with size/length meta and their own play buttons.
**Files:** `src/ds/foundations/sound/files.js`
**Verify:** ▶ on a file plays `playFileId`; card shows the decode path.

### Task 4: Waveform scope ✓ done

**Objective:** Draw the wave that plays — offline render for voices, decode for files — with an idle/playing status bar.
**Files:** `src/ds/foundations/sound/scope-draw.js`, `src/ds/foundations/sound/scope.js`, `src/ds/foundations/sound/synth-render.js`
**Verify:** Playing any voice or file repaints the canvas and updates the status line.

### Task 5: Code tab — consumption guide ✓ done

**Objective:** Show how the site consumes sound (`playVoice`, `playFileId`, mute/toggle rules) in copy-paste form.
**Files:** `src/ds/foundations/sound/usage.js`
**Verify:** Code tab renders the guide with token-styled identifiers.

### Task 6: Board mount ✓ done

**Objective:** Wire the sheet — play buttons, master/voice knobs, test A (live osc), test B (file tone), reset ctx, cleanup on unmount.
**Files:** `src/ds/foundations/sound/board.js`
**Verify:** Mount returns a cleanup; leaving the page removes every listener.

### Task 7: Sound sheet styles ✓ done

**Objective:** Grid, voice cards, scope wrap, knobs — token-only rules in their own ≤100-line sheet.
**Files:** `src/ds/foundations-sound.css`, `ds/index.html`
**Verify:** `lint:tokens` clean; sheet linked after `foundations-color.css`.

### Task 8: Foundations wiring = eight definitions ✓ done

**Objective:** Sound becomes the eighth pane and the page copy says so; the inner tablist takes the line variant instead of vertical-tab styling.
**Files:** `src/ds/pages-foundations.js`, `src/ds/tabs.js`, `src/styles/tokens-overrides.css`
**Verify:** Foundations shows eight panes, Sound opens, nested tabs stay horizontal in both themes.

### Task 9: Scope the vertical-tab selectors ✓ done

**Objective:** `.ds-tabs.vert` rules target only the outer tablist's direct children so the nested sound tabs never inherit vertical chrome; add the sunken surface token the sheet needs.
**Files:** `src/ds/foundations.css`, `src/ds/foundations-color.css`, `src/ds/foundations/color/sections.js`
**Verify:** Vertical rail unchanged; nested tabs render as a line list; `--color-surface-sunken` resolves in light and dark.
