/* ADAM/PAGE — views/masonry/viewer-markup · markup · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: geometry helpers + DOM factory for cursor / portal / tethers
const NS = 'http://www.w3.org/2000/svg';
export const HALF = 16;
export const OFF = 4;
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const smoothstep = (t) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
export const targetY = (y, rect, vh) =>
  smoothstep((y - rect.top) / rect.height)
  * Math.max(0, rect.height - vh);
export function offsetPoint(f, t, inset) {
  const dx = t.x - f.x;
  const dy = t.y - f.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x1: f.x + (dx / len) * inset,
    y1: f.y + (dy / len) * inset,
    x2: t.x - (dx / len) * inset,
    y2: t.y - (dy / len) * inset,
  };
}
export const springStep = (pos, vel, tgt, k = 0.1, fr = 0.54) => {
  const v = (vel + (tgt - pos) * k) * fr;
  return { pos: pos + v, vel: v };
};
export function placeViewer(rect, w = 180, gap = 10, pad = 20) {
  const right = rect.right + gap + w + pad < window.innerWidth;
  const x = right ? rect.right + gap : rect.left - gap - w;
  return {
    x: Math.min(Math.max(x, pad), window.innerWidth - w - pad),
    side: right ? 'right' : 'left',
  };
}
export function placeViewerNear(rect, cx, w = 180, gap = 10, pad = 20) {
  const vw = window.innerWidth;
  const canRight = rect.right + gap + w + pad < vw;
  const canLeft = rect.left - gap - w >= pad;
  if (typeof cx !== 'number' || isNaN(cx)) return placeViewer(rect, w, gap, pad);
  if (canRight && canLeft) {
    const gapRight = (rect.right + gap) - cx;
    const gapLeft = cx - (rect.left - gap);
    const side = gapLeft < gapRight ? 'left' : 'right';
    const x = side === 'right' ? rect.right + gap : rect.left - gap - w;
    return { x: Math.min(Math.max(x, pad), vw - w - pad), side };
  }
  if (canRight) return { x: Math.min(rect.right + gap, vw - w - pad), side: 'right' };
  if (canLeft) return { x: Math.max(rect.left - gap - w, pad), side: 'left' };
  const spaceRight = vw - rect.right - pad;
  const spaceLeft = rect.left - pad;
  const side = spaceRight > spaceLeft ? 'right' : 'left';
  const x = side === 'right'
    ? Math.min(rect.right + gap, vw - w - pad)
    : Math.max(pad, rect.left - gap - w);
  return { x: Math.min(Math.max(x, pad), vw - w - pad), side };
}
export function createViewerDom() {
  const cursorEl = document.createElement('div');
  cursorEl.className = 'viewer-cursor';
  cursorEl.setAttribute('aria-hidden', 'true');
  const viewerEl = document.createElement('div');
  viewerEl.className = 'viewer';
  viewerEl.setAttribute('aria-hidden', 'true');
  viewerEl.innerHTML = '<img alt="" />';
  const vimg = viewerEl.querySelector('img');
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'viewer-lines');
  svg.setAttribute('aria-hidden', 'true');
  const l1 = document.createElementNS(NS, 'line');
  const l2 = document.createElementNS(NS, 'line');
  l1.setAttribute('pathLength', '100');
  l2.setAttribute('pathLength', '100');
  svg.append(l1, l2);
  document.body.append(cursorEl, viewerEl, svg);
  return { cursorEl, viewerEl, vimg, svg, l1, l2 };
}
export function makePaint(state, els, cfg) {
  return () => {
    const { cursorEl, viewerEl, l1, l2 } = els;
    if (!state.card || !state.rect) {
      cursorEl.style.transform = `translate3d(${(state.cx - HALF).toFixed(1)}px,${(state.cy - HALF).toFixed(1)}px,0)`;
      return;
    }
    viewerEl.style.transform = `translate3d(${state.vx}px,${(state.rect.top + state.cur).toFixed(1)}px,0)`;
    cursorEl.style.transform = `translate3d(${(state.cx - HALF).toFixed(1)}px,${(state.cy - HALF).toFixed(1)}px,0)`;
    const vy2 = state.rect.top + state.cur;
    const cxSide = state.side === 'right' ? state.cx + HALF : state.cx - HALF;
    const vxSide = state.side === 'right' ? state.vx : state.vx + cfg.VW;
    const a1 = { x: cxSide, y: state.cy - HALF }, b1 = { x: vxSide, y: vy2 };
    const a2 = { x: cxSide, y: state.cy + HALF }, b2 = { x: vxSide, y: vy2 + state.vh };
    const p1 = offsetPoint(a1, b1, OFF), p2 = offsetPoint(a2, b2, OFF);
    l1.setAttribute('x1', p1.x1); l1.setAttribute('y1', p1.y1);
    l1.setAttribute('x2', p1.x2); l1.setAttribute('y2', p1.y2);
    l2.setAttribute('x1', p2.x1); l2.setAttribute('y1', p2.y1);
    l2.setAttribute('x2', p2.x2); l2.setAttribute('y2', p2.y2);
  };
}
