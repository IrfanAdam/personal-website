---
version: alpha
name: Irfan Adam — Personal Website
description: Sharp editorial minimalism. Warm paper, deep ink, zero radius — every edge is a hard cut. No rounded corners anywhere.
colors:
  primary: "#16130e"
  bg: "#f4f2ee"
  ink: "#16130e"
  muted: "#7a756c"
  card: "#ffffff"
  surface: "#ffffff"
  on-media: "#f6f3ec"
  on-media-muted: "rgba(246, 243, 236, 0.82)"
  on-accent: "#f6f3ec"
  line: "rgba(22, 19, 14, 0.1)"
  accent: "#e8442e"
  chip: "rgba(20, 16, 10, 0.62)"
  chip-ink: "{colors.on-media}"
  divider-ink: "{colors.ink}"
  panel: "rgba(235, 235, 235, 0.32)"
  header-bg: "rgba(244, 242, 238, 0.75)"
typography:
  display:
    fontFamily: Inter Tight
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  h1:
    fontFamily: Inter Tight
    fontSize: 2.875rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: Inter Tight
    fontSize: 2.875rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  logo:
    fontFamily: Inter Tight
    fontSize: 22px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  h2:
    fontFamily: Inter Tight
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  h3:
    fontFamily: Inter Tight
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: Inter Tight
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  small:
    fontFamily: Inter Tight
    fontSize: 13.5px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  meta:
    fontFamily: Chivo Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.1em"
  mono:
    fontFamily: Chivo Mono
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.1em"
  label:
    fontFamily: Chivo Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.12em"
  micro:
    fontFamily: Chivo Mono
    fontSize: 10.5px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.1em"
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  pill: 0px
spacing:
  s1: 1px
  s2: 2px
  s3: 3px
  s4: 4px
  s5: 5px
  s6: 6px
  s7: 7px
  s8: 8px
  s9: 9px
  s10: 10px
  s11: 11px
  s12: 12px
  s14: 14px
  s16: 16px
  s18: 18px
  s22: 22px
  s26: 26px
  s28: 28px
  s30: 30px
  s42: 42px
  s46: 46px
  s60: 60px
  s70: 70px
  s90: 90px
components:
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 0px
  card-hover:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
  pill:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 6px
  pill-on:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg}"
  pill-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.none}"
    padding: 6px
  strip-thumb:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: 56px
  chip-badge:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.chip-ink}"
    rounded: "{rounded.none}"
    padding: 4px
  card-info:
    backgroundColor: "transparent"
    textColor: "{colors.on-media}"
    rounded: "{rounded.none}"
    padding: 18px
  card-info-sub:
    backgroundColor: "transparent"
    textColor: "{colors.on-media-muted}"
    rounded: "{rounded.none}"
    padding: 0px
  todo:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 14px
  divider-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: 1px
  panel-surface:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 14px
  header:
    backgroundColor: "{colors.header-bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 8px
  divider:
    backgroundColor: "{colors.line}"
    textColor: "{colors.card}"
    rounded: "{rounded.none}"
    padding: 1px
  brand-mark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.none}"
    padding: 0px
  next-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: 18px
---

## Overview

Editorial, warm-minimal portfolio for Irfan Adam. Framer masonry clone rebuilt as code — self-maintainable. Paper background (#f4f2ee), deep ink (#16130e), single accent (#e8442e). No soft UI anywhere: every card, image, pill, and thumbnail is a hard 90° cut. Radius is intentionally zero — the geometry is the brand.

## Colors

- **Bg (#f4f2ee / #141210 dark):** Warm paper, not pure white. Dark mode flips to near-black ink.
- **Ink (#16130e / #f2ede4 dark):** Headlines, pills-on state, tab frame. High contrast on bg (~15:1).
- **Muted (#7a756c):** Meta text, hints, labels. Stays muted in both themes.
- **Line (rgba 10% ink):** Hairline borders on every card/thumb — no shadows, just stroke.
- **Card (#fff / #1e1b17 dark):** Card and panel surface.
- **Accent (#e8442e):** Reserved, not used for UI chrome — only editorial callouts. Contrast on accent is ~3.6:1, so accent grounds are large-text / graphics only (documented exception to AA).
- **Chip (rgba 62% ink) + Chip-ink (#f6f3ec):** Overlay labels on media — tags rest on the image by default and fade out when the blur scrim + title fade in on hover. On-media-muted (#f6f3ec at 82%) is the secondary line under the title.

Rule: never introduce a new hex outside `tokens.css` / `colors` above. Dark mode is a single `@media (prefers-color-scheme: dark)` swap in `tokens.css`, plus a manual `[data-theme="light"|"dark"]` override (used by the `/ds` docs theme toggle) that re-declares the same semantic tokens for its subtree.

**Adoption:** the live site is now 100% token-adherent. `base.css`, `pages.css`, `masonry.css`, and `card.css` consume `var()` only — no raw color, radius, or font stack survives anywhere outside `tokens.css`. Verified by `npm run lint:tokens` (wired into `npm test`).

## Typography

Inter Tight for all UI and display (800 for logo at 22px, 700 for titles at clamp(26px,4.5vw,46px), 600 for card titles at 13.5px). Chivo Mono for all meta/labels (12px meta, 11px labels, 10.5px micro, 0.1–0.12em tracking). Hero display uses `clamp(28px,5vw,54px)` with `-0.04em` tracking. Prose is 14px/1.6. Title parity: contact hero and case h1 share `--text-title`.

## Layout & Spacing

- **Wrap:** `max-width: 1400px`, centered. Case grid is `1fr / 1fr` (text left / media right, gap 0), collapses to 1fr at 800px.
- **Masonry cols:** `repeat(4,1fr)` gap 14px → 2 cols at 900px, 1 col at 640px. Cols use `will-change: transform` for parallax.
- **Spacing is a px-named scale** (`--space-1`…`--space-90`, see tokens above): 14px is the grid rhythm (cards, cols), 16px the page gutter. Odd px (1/3/5/7/9/11) and large docs steps (42/46/70/90) have explicit slots — use the token, never round silently.

## Elevation & Depth

No box shadows. Elevation is conveyed by 1px `var(--line)` borders + `backdrop-filter: blur(18px) saturate(1.6)` on sticky header and masonry scrim. The sole shadows in the system are on-media text shadows (`--shadow-on-media`) keeping overlay titles legible. Shimmer placeholder on masonry image via linear gradient animation.

## Shapes

**Radius is zero everywhere.** This is normative:

- `rounded.none / sm / md / lg / pill` are all `0px`.
- `--radius-none / --radius-sm / --radius-md / --radius-lg / --radius-pill` in `tokens.css` are all `0`.
- Consume only via `var(--radius-*)`. No `border-radius: 6px/4px/8px` literals exist. `scripts/lint-tokens.mjs` enforces `var()` only outside `tokens.css`.

If a future component needs softness, add a new token — do not hard-code a pixel radius.

## Components

- **card:** Masonry item — `border:1px solid var(--line)`, `border-radius:var(--radius-none)`, overflow hidden, image zoom on hover is `scale(1.015) 0.65s cubic-bezier(0.32,0.72,0,1)`. Tags rest on the image by default; hover swaps to a progressive blur scrim at bottom (`backdrop-filter: blur(18px)`, mask fade) holding title + slug·date. Keep `.tags` in DOM (they seed the mobile linger state); hide via opacity, never removal.
- **pill:** Filter — transparent with `var(--line)` border, radius 0. Hover/on state fills `var(--ink)`.
- **strip-thumb / vtab / tab-frame:** 56×56 or 56×58, border `var(--line)` or 3px `var(--ink)` for frame, radius 0. Tab frame slides with `0.38s cubic-bezier(0.32,0.72,0,1)`.
- **case-media / hero-img / prose img:** Full-width media with `1px var(--line)` stroke, radius `var(--radius-sm)` (=0).
- **next:** Next-project link, bordered card, radius `var(--radius-sm)` (=0).

## Do's and Don'ts

- **Do** use `var(--radius-none)` / `var(--radius-sm)` for every `border-radius`. They are zero by design — that is the system.
- **Don't** add `border-radius: 6px`, `8px`, `999px`, or any literal radius. It will fail the token lint.
- **Do** keep `@media` breakpoints as raw px (`800px`, `900px`, `640px`) — `var()` is invalid there.
- **Do** run `npm test` before PR — it runs `lint:tokens` (raw color / raw px / literal radius / literal font-family / JS paint literals / 100-line limit over `src/styles` + `src/ds`) then `vite build`.
- **Do** document every new component in `/ds` (`src/ds/pages-*.js`) — the DS dogfoods real site classes, so specimens stay pixel-true by construction.

## Files

| File | Role | Lines |
| --- | --- | --- |
| `src/styles/tokens.css` | primitives → semantic → legacy aliases (only raw values) | ≤100 |
| `src/styles/base.css` | reset, header, wrap, pill, footer | ≤100 |
| `src/styles/pages.css` | strip/tab-frame, work rows, case grid, prose, spec, next | ≤100 |
| `src/styles/masonry.css` | grid + column parallax only | ≤100 |
| `src/styles/card.css` | card, scrim, tags, card-info, mobile linger | ≤100 |
| `src/ds/ds.css` | docs chrome (sidebar, tables, notes) — same token space | ≤100 |
| `src/ds/specimens.css` | specimen framing over real site classes | ≤100 |
| `src/ds/*` | docs site at `/ds` — foundations, tokens, components, patterns | — |
