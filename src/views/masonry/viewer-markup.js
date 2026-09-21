/* ADAM/PAGE — views/masonry/viewer-markup · markup · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: geometry helpers + DOM factory for single-frame portal
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
// Single-frame factory — only the portal remains (cursor + tether removed per single-frame fix)
export function createViewerDom() {
  const viewerEl = document.createElement('div');
  viewerEl.className = 'viewer';
  viewerEl.setAttribute('aria-hidden', 'true');
  viewerEl.innerHTML = '<img alt="" />';
  const vimg = viewerEl.querySelector('img');
  // Back-compat stubs so callers destructuring {cursorEl, svg, l1, l2} do not break
  const cursorEl = document.createElement('div');
  cursorEl.style.display = 'none';
  const svg = document.createElementNS(NS, 'svg');
  svg.style.display = 'none';
  const l1 = document.createElementNS(NS, 'line');
  const l2 = document.createElementNS(NS, 'line');
  document.body.append(viewerEl);
  return { cursorEl, viewerEl, vimg, svg, l1, l2 };
}
export function makePaint(state, els, cfg) {
  return () => {
    const { viewerEl } = els;
    if (!state.card || !state.rect) return;
    viewerEl.style.transform = `translate3d(${state.vx}px,${(state.rect.top + state.cur).toFixed(1)}px,0)`;
  };
}
