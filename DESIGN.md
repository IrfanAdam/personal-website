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
  line: "rgba(22, 19, 14, 0.1)"
  accent: "#e8442e"
  chip: "rgba(20, 16, 10, 0.62)"
  chip-ink: "#f6f3ec"
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
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  h2:
    fontFamily: Inter Tight
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: Inter Tight
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  mono:
    fontFamily: Chivo Mono
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.1em"
  label:
    fontFamily: Chivo Mono
    fontSize: 0.6875rem
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  pill: 0px
spacing:
  xs: 4px
  sm: 8px
  md: 14px
  lg: 16px
  xl: 28px
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
    textColor: "{colors.chip-ink}"
    rounded: "{rounded.none}"
    padding: 6px
  strip-thumb:
    backgroundColor: "{colors.card}"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    size: 56px
  chip-badge:
    backgroundColor: "{colors.chip}"
    textColor: "{colors.chip-ink}"
    rounded: "{rounded.none}"
    padding: 4px
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
    textColor: "{colors.muted}"
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
- **Accent (#e8442e):** Reserved, not used for UI chrome — only editorial callouts.
- **Chip (rgba 62% ink) + Chip-ink (#f6f3ec):** Overlay labels on media (deprecated in masonry — now scrim instead).

Rule: never introduce a new hex outside `tokens.css` / `colors` above. Dark mode is a single `@media (prefers-color-scheme: dark)` swap in `tokens.css`.

## Typography

Inter Tight for all UI and display (800 for logo, 700 for h1, 600 for card titles). Chivo Mono for all meta/labels (small caps, 10.5–12px, 0.1–0.12em tracking). Hero h1 uses `clamp(28px,5vw,54px)` with `-0.04em` tracking. Prose is 14px/1.6. No other type scale exists.

## Layout & Spacing

- **Wrap:** `max-width: 1400px`, centered. Case grid is `56fr / 44fr` (text left / media right), collapses to 1fr at 800px.
- **Masonry cols:** `repeat(4,1fr)` gap 14px → 2 cols at 900px, gap 10px at 640px. Cols use `will-change: transform` for parallax.
- **Spacing unit is 14px** (cards, cols) and 16px (page wrap). Do not introduce 12px/24px ad-hoc.

## Elevation & Depth

No shadows. Elevation is conveyed by 1px `var(--line)` borders + `backdrop-filter: blur(18px) saturate(1.6)` on sticky header and masonry scrim. Shimmer placeholder on masonry image via linear gradient animation.

## Shapes

**Radius is zero everywhere.** This is normative:

- `rounded.none / sm / md / lg / pill` are all `0px`.
- `--radius-none / --radius-sm / --radius-md / --radius-lg / --radius-pill` in `tokens.css` are all `0`.
- Consume only via `var(--radius-*)`. No `border-radius: 6px/4px/8px` literals exist. The linter enforces `var()` only outside `tokens.css`.

If a future component needs softness, add a new token — do not hard-code a pixel radius.

## Components

- **card:** Masonry item — `border:1px solid var(--line)`, `border-radius:var(--radius-none)`, overflow hidden, image zoom on hover is `scale(1.015) 0.65s cubic-bezier(0.32,0.72,0,1)`. Progressive blur scrim at bottom (`backdrop-filter: blur(18px)`, mask fade) holds title + slug·date. Tags deprecated.
- **pill:** Filter — transparent with `var(--line)` border, radius 0. Hover/on state fills `var(--ink)`.
- **strip-thumb / vtab / tab-frame:** 56×56 or 56×58, border `var(--line)` or 3px `var(--ink)` for frame, radius 0. Tab frame slides with `0.38s cubic-bezier(0.32,0.72,0,1)`.
- **case-media / hero-img / prose img:** Full-width media with `1px var(--line)` stroke, radius `var(--radius-sm)` (=0).
- **next:** Next-project link, bordered card, radius `var(--radius-sm)` (=0).

## Do's and Don'ts

- **Do** use `var(--radius-none)` / `var(--radius-sm)` for every `border-radius`. They are zero by design — that is the system.
- **Don't** add `border-radius: 6px`, `8px`, `999px`, or any literal radius. It will fail the token lint.
- **Don't** reintroduce tags (`.tags`) — hidden by design in masonry.
- **Do** keep `@media` breakpoints as raw px (`800px`, `900px`, `640px`) — `var()` is invalid there.
- **Do** run `npx @google/design.md lint DESIGN.md` before PR and `grep -rn border-radius src --include="*.css" | grep -v tokens.css` should show only `var(--radius-*`.
