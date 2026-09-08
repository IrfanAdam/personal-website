# Cyberpunk Grid Viewer — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Implement the Framer-style hover viewer as a cyberpunk-tuned "expander window" — cursor is replaced by a small viewfinder box inside the card, a larger preview (project mock) floats outside the card (right/left flip by proximity), two tether lines connect them, the preview follows Y with a spring clamped to card height.

**Architecture:** New isolated module `src/views/masonry/viewer.js` + `src/styles/viewer.css`; no changes to grid/masonry layout. Viewer is a `position:fixed` portal (collision-flip: right → left), lines are a full-viewport `<svg>` with two `<line>`s (dasharray/dashoffset draw), physics is the Framer `SPRING:.1/.24 + FRICTION:.54/.65` clamped-spring already reverse-engineered. Cyberpunk is expressed purely via tokens/CSS: hashed grid shimmer (existing) + neon ink/accent rim, 1px scanline lattice, subtle vertical sheen mask, glitch on enter — all `var()`-only, zero radius doctrine preserved.

**Tech Stack:** Vanilla JS (ESM), CSS via `src/styles/tokens.css`, `requestAnimationFrame`, `ResizeObserver`, `matchMedia`, Vite 5 — no new deps.

---

### Task 1: Extend tokens for viewer (no raw values elsewhere)

**Objective:** Add semantic viewer tokens so CSS never holds a hex/literal.

**Files:**
- Modify: `src/styles/tokens.css:70-82` (Motion/Z-index + new Viewer section)

**Step 1: Add tokens**
```css
/* — Viewer (cyberpunk expander) — */
--size-viewer: 186px; --size-viewer-w: 180px; --size-cursor: 32px;
--color-viewer-bg: var(--color-surface);
--color-viewer-line: var(--color-ink);
--color-viewer-neon: var(--color-accent); /* cyber rim tint */
--viewer-border: var(--size-hairline) solid var(--color-viewer-line);
--viewer-neon: 0 0 0 1px var(--color-viewer-line), 0 0 18px color-mix(in srgb, var(--color-viewer-neon) 18%, transparent);
--viewer-grid: repeating-linear-gradient(to right, color-mix(in srgb, var(--color-line) 35%, transparent) 0 1px, transparent 1px 14px),
              repeating-linear-gradient(to bottom, color-mix(in srgb, var(--color-line) 35%, transparent) 0 1px, transparent 1px 14px);
--viewer-scan: repeating-linear-gradient(to bottom, transparent 0 2px, color-mix(in srgb, var(--color-line) 12%, transparent) 2px 3px);
--dur-viewer-in: 300ms; --dur-viewer-line: 240ms;
--z-viewer: 15; --z-viewer-lines: 14;
```

**Step 2: Verify**
Run: `npm run lint:tokens` — Expected: PASS (no raw hex outside tokens.css)

**Step 3: Commit**
```bash
git add src/styles/tokens.css
git commit -m "feat(tokens): viewer semantic tokens (cyberpunk)"
```

### Task 2: Create `src/styles/viewer.css` (≤100 lines, var() only)

**Objective:** Visuals for cursor box, preview window, lines.

**Files:**
- Create: `src/styles/viewer.css`

**Step 1: Implement**
```css
/* Cursor viewfinder — small white box inside card */
.viewer-cursor {
  position: fixed; width: var(--size-cursor); height: var(--size-cursor);
  border: var(--viewer-border); background: color-mix(in srgb, var(--color-viewer-bg) 92%, transparent);
  pointer-events: none; z-index: var(--z-viewer); opacity: 0;
  will-change: transform; backdrop-filter: blur(2px);
  box-shadow: var(--viewer-neon);
}
.viewer-cursor.on { opacity: 1; transition: opacity var(--dur-viewer-in) var(--ease-standard); }

/* Preview portal — floats outside card */
.viewer {
  position: fixed; width: var(--size-viewer-w); /* height auto by mock ratio */
  background: var(--color-viewer-bg); border: var(--viewer-border);
  box-shadow: var(--viewer-neon); padding: var(--space-4);
  z-index: var(--z-viewer); opacity: 0; will-change: transform;
}
.viewer.on { opacity: 1; transition: opacity var(--dur-viewer-in) var(--ease-standard) 120ms; }
.viewer::before { content:""; position:absolute; inset:0; background: var(--viewer-grid); opacity:.35; pointer-events:none; }
.viewer::after  { content:""; position:absolute; inset:0; background: var(--viewer-scan); opacity:.18; pointer-events:none; }
.viewer img { display:block; width: 100%; height:auto; filter: contrast(1.02) saturate(.96); }
.viewer .viewer-grid-shimmer { position:absolute; inset:0; background: var(--shimmer-gradient); -webkit-mask-image: var(--shimmer-band); mask-image: var(--shimmer-band); animation: shimmer var(--dur-shimmer) infinite; }

/* Lines SVG */
.viewer-lines { position:fixed; inset:0; pointer-events:none; z-index: var(--z-viewer-lines); }
.viewer-lines line { stroke: var(--color-viewer-line); stroke-width:1; stroke-dasharray: 120; stroke-dashoffset: 120; transition: stroke-dashoffset var(--dur-viewer-line) var(--ease-standard); }
@media (prefers-reduced-motion: reduce) { .viewer-cursor,.viewer,.viewer-lines line { transition: none; } .viewer-grid-shimmer { animation:none; display:none; } }
```

**Step 2: Lint**
Run: `npm run lint:tokens` — PASS

### Task 3: Create `src/views/masonry/viewer.js` — core state & math (no DOM side-effects yet)

**Objective:** Pure helpers testable in isolation: clamp, smoothstep, offsetPoint, targetY, spring tick.

**Files:**
- Create: `src/views/masonry/viewer.js` (first 60 lines)
- Test: `src/views/masonry/viewer.test.js` (optional, manual verify via build)

**Step 1: Write helpers**
```js
export const clamp01 = (v)=> Math.min(1,Math.max(0,v));
export const smoothstep = (t)=> t*t*(3-2*t);
export function targetY(cursorY, cardRect, viewerH){
  const c = clamp01((cursorY - cardRect.top)/cardRect.height);
  return smoothstep(c) * (cardRect.height - viewerH);
}
export function offsetPoint(from,to,inset){
  const dx=to.x-from.x, dy=to.y-from.y, len=Math.hypot(dx,dy)||1;
  return { start:{x:from.x+dx/len*inset, y:from.y+dy/len*inset},
           end:{x:to.x-dx/len*inset, y:to.y-dy/len*inset} };
}
export function springStep(pos, vel, target, {SPRING=.1,FRICTION=.54}){
  vel += (target-pos)*SPRING; vel *= FRICTION; return { pos: pos+vel, vel };
}
```

**Step 2: Commit**
```bash
git add src/views/masonry/viewer.js src/styles/viewer.css
git commit -m "feat(viewer): helpers + styles scaffold"
```

### Task 4: Implement full `attachViewer(grid)` lifecycle

**Objective:** One export `attachViewer(grid)` mirroring Framer's `B/je/st/C/y/ht` contract.

**Files:**
- Modify: `src/views/masonry/viewer.js:60-200` (append lifecycle)

**Step 1: Scaffold `attachViewer`**
```js
export function attachViewer(grid){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return ()=>{};
  if(innerWidth <= 640) return ()=>{};
  const cards = [...grid.querySelectorAll('.card')];
  // state mirrors Framer's d={doms:{card,overlay,lines}, positions:{cursor,curPos,cardRect,overRect}, triggers, timers}
  let cardEl=null, viewerEl=null, cursorEl=null, svgEl=null, lineTop=null, lineBot=null;
  let raf=0, cur={y:0, vel:0}, cursor={x:0,y:0}, cardRect=null, viewerRect=null;
  let timers={idle: null}, isActive=false;

  // create DOM once
  // init SvgLines (position:fixed SVG, two lines)
  // create viewerEl (.viewer) + cursorEl (.viewer-cursor) appended to body
  // handlers: mouseenter→setCardBounds, mousemove→cursor+startAnimation, mouseleave→stop, scroll→refresh rects
  // applySpringPhysics → targetY() → springStep() → translate3d(0,cur.y,0) on viewerEl
  // updateLines → choose viewer edge (cursor.x < viewerRect.left ? left : right), offset 24, set line x1/y1/x2/y2 + dasharray
  // startAnimation/end with C pattern, idle 800ms close
  // return cleanup
}
```

**Pseudocode follows Framer exactly** (`B.updateLines` chooses edge `s = cursor.x < overRect.left ? left : left+width`, `m=12,d=24`, `calculateOffsetPoint`, `redrawLine` with dashoffset animation).

**Step 2: Verify**
Run: `npm run build` — Expected: bundle includes viewer chunk, no errors.

### Task 5: Proximity flip (right → left) + horizontal placement

**Objective:** Viewer must avoid overflow — replicate Framer `placement:"right" collisionDetection`.

**Files:**
- Modify: `src/views/masonry/viewer.js` inside `updateViewerRect`

**Step 1: Logic**
```js
function placeViewer(cardRect, viewerW=180, gap=10, pad=20){
  const wantRight = cardRect.right + gap + viewerW + pad < innerWidth;
  const x = wantRight ? cardRect.right + gap : cardRect.left - gap - viewerW;
  // also clamp x to pad
  return { x: clamp(x, pad, innerWidth - viewerW - pad), side: wantRight? 'right':'left' };
}
```
Store `viewerEdge = side==='right'? viewerRect.left : viewerRect.left+viewerRect.width` for line target.

**Step 2: Visual check**
Hover left column → viewer on right; hover right column → viewer on left.

### Task 6: Wire to `masonry.js` + constrain to card height + micro-jitter

**Objective:** Mount viewer when grid renders, teardown on filter/view switch.

**Files:**
- Modify: `src/views/masonry.js:1-10` (import), `126-148` (draw), `160-179` (mount/ cleanup)
- Modify: `src/main.js` (import `viewer.css` once)

**Step 1: Import**
```js
import { attachViewer } from './masonry/viewer.js';
let viewerOff=null;
```

**Step 2: Hook in `draw`**
```js
if(viewerOff){ viewerOff(); viewerOff=null; }
if(view !== 'list' && innerWidth>640) viewerOff = attachViewer(grid);
```

**Step 3: Cleanup in `mountMasonry` return and `setView`**

**Step 4: CSS import**
In `src/main.js` add: `import './styles/viewer.css'`

### Task 7: Cyberpunk polish pass (distinct from Viewer)

**Objective:** Make the two tethers and viewer feel cyberpunk while keeping editorial minimalism.

**Files:**
- Modify: `src/styles/viewer.css` (add glitch, grid intensity on hover, neon pulse)

Additions:
```css
.viewer.on { animation: viewerIn 320ms var(--ease-signature); }
@keyframes viewerIn { from{ filter: hue-rotate(-6deg) saturate(1.2) } to{ filter:none } }
.viewer-cursor.on { box-shadow: var(--viewer-neon), inset 0 0 0 1px color-mix(in srgb, var(--color-viewer-neon) 22%, transparent); }
.viewer-lines line { opacity:.9; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--color-viewer-neon) 24%, transparent)); }
```
Reuse existing hashed grid `var(--viewer-grid)` and shimmer band already defined — keep **subtle vertical sheen via mask** as requested (mask on `.viewer::before`), not a harsh line.

Keep `will-change: transform` + `translate3d` to preserve fluid parallax already fixed (λ=11).

### Task 8: Reduced motion + mobile + a11y

**Objective:** No viewer on mobile/touch, keyboard, or `prefers-reduced-motion`.

**Files:**
- Modify: `src/views/masonry/viewer.js` guards

Guards:
- Early return if `matchMedia('(prefers-reduced-motion: reduce)')` or `innerWidth<=640` or `ontouchstart` + no hover.
- Viewer DOM: `aria-hidden="true"` + `pointer-events:none`, card keeps native `<a href>` semantics.
- On `focus-visible`/`focusin` on card: show static preview inset (no follower) instead of portal.

### Task 9: DS docs + specimens

**Objective:** Document variant so DS stays truthful.

**Files:**
- Modify: `src/ds/pages-patterns.js` (add "Viewer" pattern description)
- Modify: `src/ds/pages-components.js` (specimen for `.viewer` + `.viewer-cursor`)

Add note: “Viewer: portal preview, 180×~220, Y-spring clamped, 1px tether lines, flip on collision, cyberpunk grid/scan.”

### Task 10: Validate & ship

**Steps:**
```bash
npm run lint:tokens   # var() only
npm run build         # gzip sizes, viewer chunk ~1.2k gzip
# Manual: hover left card → viewer right; right card → viewer left; drag Y → viewer follows clamped; lines tether correctly; scroll → parallax stays butter (λ=11); mobile 1-col → no viewer (linger only); reduced-motion → static
git add src/views/masonry/viewer.js src/styles/viewer.css src/styles/tokens.css src/views/masonry.js src/main.js src/ds/pages-*.js
git commit -m "feat(viewer): cyberpunk expander (cursor+portal+spring tether, proximity flip, clamped)"
git push
```

---

## Files Likely to Change
- `src/styles/tokens.css` — new viewer tokens (≤10 lines)
- `src/styles/viewer.css` — new (≤90 lines)
- `src/views/masonry/viewer.js` — new (≤180 lines)
- `src/views/masonry.js` — import + attachViewer lifecycle
- `src/main.js` — import viewer.css
- `src/ds/pages-*.js` — docs

## Tests / Validation
- `lint:tokens` must pass (token-only CSS/JS)
- `vite build` must succeed; dist/viewer chunk gzipped
- Manual hover matrix: left/right flip, Y clamp, line draw, idle close 800ms, Safari vs Chrome spring parity, mobile fallback, reduced-motion no-op.

## Risks, Tradeoffs, Open Questions
- **Risk:** Fixed-position portal + full-viewport SVG lines can fight layout containment — mitigate with `contain: layout style` on grid parent already used for parallax.
- **Tradeoff:** Viewer `width:180px` vs `200px` (Framer) — chosen to stay inside 1400px wrap without overlap on 4-col; if mocks are dense, bump token to `200px` and adjust `placeViewer` pad.
- **Open:** Neon intensity — currently `18% accent` mix. If too cyber for editorial minimalism, drop to `10%` or limit to `box-shadow` only (no hue shift).
- **Open:** Mock source — viewer currently reuses card `<img>` at 1.5× (cover) inside `.viewer`; if you want distinct per-project high-res mocks (phones collage like recording), extend `site.js` to provide `mockImg` and pass to viewer.
