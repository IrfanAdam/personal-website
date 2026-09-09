# Hero Image Load Sequence — Project Details

> **Session:** 20260908_203238_918adf — `Fix project details hero image load sequence`
> **Source:** Desktop plan approved via `add this plan`
> **Goal:** Sequential CSS shimmer → grid reveal with viewport-gated trigger, lazy-load aware, no repeat on second visit.

## Spec (user)

- **Mobile:** layout@placeholder → continuous shimmer → resize done → shimmer OFF → cell grid reveal → unblur + final shimmer → no repeat on 2nd load
- **Desktop:** continuous shimmer @ aspect → image decoded → shimmer OFF → cell grid reveal → unblur + final shimmer → no repeat on 2nd load
- Must accommodate `loading="lazy"` if added later.

## Audit — `src/views/project.js` + `src/views/masonry/gridReveal.js` + `src/styles/case.css` (as of 7b1a383)

**Current:**
- Dedup via `sessionStorage#seenHeroes` + mem `lastHeroSrc` — OK, but early-return still leaves img `load` listener dangling if not `complete`.
- `!reduce` unified: placeholder `height` morph (860ms, `loading` CSS shimmer + `attachGridReveal(box,img,980,true)`) for **both** viewports. Desktop shouldn't morph — spec is image-gated, not layout-gated.
- Shimmer split: `case.css::after` (`loading` + `hero-shimmer`) + `gridReveal` canvas white band (`amp 0.14 while !s.done || now<t0` + final `amp 0.24 during pr`). Both run overlapping phase 1 — spec wants singular `continuous shimmer > stop > grid`.
- Grid start overlapped: `attachGridReveal` fires during shimmer with `t0=now+980` frozen (`elapsed` gated). `split` stays 0 but canvas still shimmers via `now<t0` band. Not strictly sequential.
- Height end: `transitionend@height` + `980` fallback clears `loading` and resets `aspectRatio`, but `offReveal` keeps running — if `img` not decoded yet, grid sits at `WAIT_CAP 0.75` with canvas shimmer still on (violates "shimmer stops").
- `ResizeObserver` tracks `box` during height tween → thrashes `canvas W/H` each frame.

## Target sequence

```
mobile:  layout@placeholder → CSS shimmer ──resize done──▶ shimmer OFF → grid random splits → photo fade + final white sweep → ready (+ mark seen, 2nd visit skip)
desktop: CSS shimmer@aspect ──image decoded──▶ shimmer OFF → same grid → fade → ready (+ dedup)
```

## Implementation Plan

### 1. `src/styles/case.css`
- Keep `loading::after` + `hero-shimmer` + `ready::after{display:none}`.
- Add `.hero-box.grid-active canvas{opacity:1}` state so canvas hidden during pure CSS shimmer, shown at grid start.
- No token change.

### 2. `src/views/project.js` — de-branch by viewport
- Early exits: `reduce → ready` ; `seen.has(currentSrc) → ready` (no shimmer/grid, instant img).
- `isMobile = matchMedia('(max-width:640px)').matches`
- **Mobile path:** compute `placeholderH/finalH` → `loading` + `height=placeholderH` → **defer** `attachGridReveal` until `finishHeight` (transitionend/fallback 980). On finish: `remove loading`, reset `height/aspectRatio`, `box.classList.add('grid-active')`, then `offReveal=attachGridReveal(box,img,0,true)`, `markSeen`.
- **Desktop path:** no height tween. `loading` at native `aspectRatio`. `grid-active` not yet. If `img.complete && naturalWidth` → immediate `remove loading → attachGridReveal`. Else `loading` persists, listen `img.load/error` (once) + `img.decode()` if available → on resolve: `remove loading → attachGridReveal`. Timeout 3s fallback to avoid stuck shimmer.
- Both paths cleanup: `clearTimeout`, `removeEventListener('transitionend')`, `remove load listener`, `offReveal()`.
- This accommodates `loading="lazy"` if added — desktop simply waits longer.

### 3. `src/views/masonry/gridReveal.js`
- No API change needed if we defer attach; optionally drop `hero` early-shimmer gate to `if (!s.done)` only (remove `|| now<t0`) since we no longer need frozen-shimmer during height.
- Keep `H_TARGET 22 / H_WAIT 0.75 / PHOTO 0.88 / COLOR 360 / SPAN 0.78`.
- Keep RAF fallback + `hero ? null : IO` as is. Ensure `finish()` adds `ready` and `offReveal` stops RAF/RO.

### 4. Verify
- `npm run build`
- Manual: `sessionStorage.clear()` → mobile 390px test height morph + desktop 1200px test network throttle Slow 3G → confirm shimmer stops at right trigger, grid runs once, second nav to same slug shows instant `ready` with no shimmer/grid.

## Tasks
- [ ] Task 1: `case.css` — add `grid-active` canvas state
- [ ] Task 2: `project.js` — split mobile/desktop triggers, defer grid attach
- [ ] Task 3: `gridReveal.js` — drop `|| now<t0` shimmer gate if deferred
- [ ] Task 4: Build + manual verify (mobile/desktop dedup + lazy)
