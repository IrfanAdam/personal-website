// Cyberpunk expander viewer — cursor viewfinder + floating portal + tethers.
// Portal is position:fixed (collision-flip right→left); preview Y follows the
// cursor with the Framer clamped spring; two SVG lines tether cursor→preview.
// Perf: single rAF paints all (cursor transform + viewer spring + SVG lines);
// handlers only stash coords and schedule — no direct DOM writes.
// Show/hide is pure CSS (opacity + stroke-dashoffset) so hide is atomically
// coupled: viewer + lines share --dur-glide (380ms). Show uses
// --dur-viewer-line (780ms) for lines to stay noticeable; hide uses --dur-glide
// for both so lines never vanish before the window.
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const smoothstep = (t) => { const c = clamp01(t); return c * c * (3 - 2 * c); };
export const targetY = (y, rect, vh) => smoothstep((y - rect.top) / rect.height) * Math.max(0, rect.height - vh);
export function offsetPoint(f, t, inset) {
  const dx = t.x - f.x, dy = t.y - f.y, len = Math.hypot(dx, dy) || 1;
  return { x1: f.x + (dx / len) * inset, y1: f.y + (dy / len) * inset, x2: t.x - (dx / len) * inset, y2: t.y - (dy / len) * inset };
}
export const springStep = (pos, vel, tgt, k = 0.1, fr = 0.54) => {
  const v = (vel + (tgt - pos) * k) * fr; return { pos: pos + v, vel: v };
};
export function placeViewer(rect, w = 180, gap = 10, pad = 20) {
  const right = rect.right + gap + w + pad < window.innerWidth;
  const x = right ? rect.right + gap : rect.left - gap - w;
  return { x: Math.min(Math.max(x, pad), window.innerWidth - w - pad), side: right ? 'right' : 'left' };
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
  const x = side === 'right' ? Math.min(rect.right + gap, vw - w - pad) : Math.max(pad, rect.left - gap - w);
  return { x: Math.min(Math.max(x, pad), vw - w - pad), side };
}
const NS = 'http://www.w3.org/2000/svg';
const HALF = 16, OFF = 4;
const THRESHOLD = 12;
const IDLE_MS = 850;
const HIDE_DEBOUNCE = 70;
export function attachViewer(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.innerWidth <= 640 || matchMedia('(hover: none)').matches) return () => {};
  const cards = [...grid.querySelectorAll('.card')];
  if (!cards.length) return () => {};
  const cursorEl = document.createElement('div');
  cursorEl.className = 'viewer-cursor'; cursorEl.setAttribute('aria-hidden', 'true');
  const viewerEl = document.createElement('div');
  viewerEl.className = 'viewer'; viewerEl.setAttribute('aria-hidden', 'true');
  viewerEl.innerHTML = '<div class="viewer-glass" aria-hidden="true"><i></i><i></i><i></i></div><img alt="" /><div class="viewer-bar" aria-hidden="true"></div><div class="viewer-shimmer" aria-hidden="true"></div>';
  const vimg = viewerEl.querySelector('img');
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'viewer-lines'); svg.setAttribute('aria-hidden', 'true');
  const l1 = document.createElementNS(NS, 'line'), l2 = document.createElementNS(NS, 'line');
  l1.setAttribute('pathLength', '100'); l2.setAttribute('pathLength', '100');
  svg.append(l1, l2); document.body.append(cursorEl, viewerEl, svg);
  let card = null, rect = null, vx = 0, side = 'right', vh = 220;
  let cx = 0, cy = 0, tgt = 0, cur = 0, vel = 0, raf = 0;
  let hideTimer = 0, idleTimer = 0;
  let cursorOn = false, portalOn = false, enterX = 0, enterY = 0;
  let pendingRaf = 0;
  const setLine = (l, a, b) => {
    const p = offsetPoint(a, b, OFF);
    l.setAttribute('x1', p.x1); l.setAttribute('y1', p.y1);
    l.setAttribute('x2', p.x2); l.setAttribute('y2', p.y2);
  };
  const paint = () => {
    if (!card || !rect) {
      cursorEl.style.transform = `translate3d(${(cx - HALF).toFixed(1)}px,${(cy - HALF).toFixed(1)}px,0)`;
      return;
    }
    viewerEl.style.transform = `translate3d(${vx}px,${(rect.top + cur).toFixed(1)}px,0)`;
    cursorEl.style.transform = `translate3d(${(cx - HALF).toFixed(1)}px,${(cy - HALF).toFixed(1)}px,0)`;
    const vy2 = rect.top + cur, vw = 180;
    const cxSide = side === 'right' ? cx + HALF : cx - HALF;
    const vxSide = side === 'right' ? vx : vx + vw;
    setLine(l1, { x: cxSide, y: cy - HALF }, { x: vxSide, y: vy2 });
    setLine(l2, { x: cxSide, y: cy + HALF }, { x: vxSide, y: vy2 + vh });
  };
  const tick = () => {
    raf = 0;
    if (!card || !rect) { paint(); return; }
    const s = springStep(cur, vel, tgt, 0.1, 0.54);
    cur = s.pos; vel = s.vel; paint();
    if (Math.abs(tgt - cur) > 0.1 || Math.abs(vel) > 0.1) {
      raf = requestAnimationFrame(tick);
    }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const schedulePaint = () => {
    if (pendingRaf) return;
    pendingRaf = requestAnimationFrame(() => {
      pendingRaf = 0; paint(); kick();
    });
  };
  const clearIdle = () => { if (idleTimer) { clearTimeout(idleTimer); idleTimer = 0; } };
  const armIdle = () => {
    clearIdle();
    if (!portalOn) return;
    idleTimer = setTimeout(() => hidePortal(), IDLE_MS);
  };
  const showCursor = () => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; }
    if (cursorOn) return;
    cursorOn = true;
    cursorEl.classList.add('on');
    grid.style.cursor = 'none';
  };
  const showPortal = () => {
    if (portalOn || !card) return;
    portalOn = true;
    viewerEl.classList.add('on');
    svg.classList.add('on');
    armIdle();
  };
  const hidePortal = () => {
    if (!portalOn) return;
    portalOn = false;
    clearIdle();
    viewerEl.classList.remove('on');
    svg.classList.remove('on');
    enterX = cx; enterY = cy;
  };
  const hideAll = () => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; }
    clearIdle();
    const wasPortal = portalOn;
    portalOn = false; cursorOn = false;
    card = null; rect = null;
    cursorEl.classList.remove('on');
    // coupled hide: window + lines share the same 380ms glide — never lines first
    viewerEl.classList.remove('on');
    svg.classList.remove('on');
    grid.style.cursor = '';
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (pendingRaf) { cancelAnimationFrame(pendingRaf); pendingRaf = 0; }
    // keep last portal state for a11y? no-op
    void wasPortal;
  };
  const scheduleHide = () => { if (hideTimer) return; hideTimer = setTimeout(hideAll, HIDE_DEBOUNCE); };
  const cancelHide = () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; } };
  const checkThreshold = () => {
    if (portalOn || !card) return;
    const d = Math.hypot(cx - enterX, cy - enterY);
    if (d > THRESHOLD) showPortal();
  };
  const enter = (e) => {
    const next = e.currentTarget;
    cancelHide(); clearIdle();
    card = next; rect = card.getBoundingClientRect();
    const img = card.querySelector('img');
    const src = card.dataset.mock || (img && (img.currentSrc || img.src));
    if (src) { vimg.src = src; if (img) vimg.alt = img.alt; }
    vh = viewerEl.offsetHeight || 220;
    cx = e.clientX; cy = e.clientY;
    enterX = cx; enterY = cy; portalOn = false;
    viewerEl.classList.remove('on'); svg.classList.remove('on');
    const p = placeViewerNear(rect, cx, 180, 10, 20); vx = p.x; side = p.side;
    cur = tgt = targetY(cy, rect, vh); vel = 0;
    paint(); showCursor(); kick();
  };
  const move = (e) => {
    if (!card) return;
    cancelHide();
    cx = e.clientX; cy = e.clientY; tgt = targetY(cy, rect, vh);
    checkThreshold(); if (portalOn) armIdle();
    schedulePaint();
  };
  const leave = () => scheduleHide();
  const onGridMove = (e) => {
    if (!cursorOn) return;
    cx = e.clientX; cy = e.clientY;
    const overCard = !!e.target.closest('.card');
    if (card && rect) {
      tgt = targetY(cy, rect, vh);
      if (overCard) checkThreshold();
      if (portalOn) armIdle();
    }
    if (!overCard) scheduleHide(); else cancelHide();
    schedulePaint();
  };
  const onGridLeave = () => scheduleHide();
  let refreshRaf = 0;
  const refresh = () => {
    if (refreshRaf) return;
    refreshRaf = requestAnimationFrame(() => {
      refreshRaf = 0;
      if (!card) return;
      rect = card.getBoundingClientRect();
      const p = placeViewerNear(rect, cx, 180, 10, 20); vx = p.x; side = p.side;
      vh = viewerEl.offsetHeight || vh; tgt = targetY(cy, rect, vh);
      paint(); kick();
    });
  };
  const remeasure = () => {
    if (!card) return;
    vh = viewerEl.offsetHeight || vh; tgt = targetY(cy, rect, vh);
    paint(); kick();
  };
  vimg.addEventListener('error', () => {
    const fb = card && card.querySelector('img');
    const fsrc = fb && (fb.currentSrc || fb.src);
    if (fsrc && vimg.src !== fsrc) vimg.src = fsrc;
  });
  vimg.addEventListener('load', remeasure);
  cards.forEach((c) => {
    c.addEventListener('mouseenter', enter, { passive: true });
    c.addEventListener('mousemove', move, { passive: true });
    c.addEventListener('mouseleave', leave, { passive: true });
  });
  grid.addEventListener('mousemove', onGridMove, { passive: true });
  grid.addEventListener('mouseleave', onGridLeave, { passive: true });
  window.addEventListener('scroll', refresh, { passive: true });
  window.addEventListener('resize', refresh);
  return () => {
    cards.forEach((c) => {
      c.removeEventListener('mouseenter', enter); c.removeEventListener('mousemove', move); c.removeEventListener('mouseleave', leave);
    });
    grid.removeEventListener('mousemove', onGridMove);
    grid.removeEventListener('mouseleave', onGridLeave);
    window.removeEventListener('scroll', refresh); window.removeEventListener('resize', refresh);
    vimg.removeEventListener('load', remeasure);
    if (hideTimer) clearTimeout(hideTimer);
    if (idleTimer) clearTimeout(idleTimer);
    if (raf) cancelAnimationFrame(raf);
    if (pendingRaf) cancelAnimationFrame(pendingRaf);
    if (refreshRaf) cancelAnimationFrame(refreshRaf);
    cursorEl.remove(); viewerEl.remove(); svg.remove();
  };
}
