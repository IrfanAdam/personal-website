// Cyberpunk expander viewer — cursor viewfinder + floating portal + tethers.
// Portal is position:fixed (collision-flip right→left); preview Y follows the
// cursor with the Framer clamped spring; two SVG lines tether cursor→preview.
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
const NS = 'http://www.w3.org/2000/svg';
const HALF = 16, OFF = 24, IDLE_MS = 800;
export function attachViewer(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.innerWidth <= 640 || matchMedia('(hover: none)').matches) return () => {};
  const cards = [...grid.querySelectorAll('.card')];
  if (!cards.length) return () => {};
  const cursorEl = document.createElement('div');
  cursorEl.className = 'viewer-cursor'; cursorEl.setAttribute('aria-hidden', 'true');
  const viewerEl = document.createElement('div');
  viewerEl.className = 'viewer'; viewerEl.setAttribute('aria-hidden', 'true');
  viewerEl.innerHTML = '<div class="viewer-shimmer" aria-hidden="true"></div><img alt="" />';
  const vimg = viewerEl.querySelector('img');
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'viewer-lines'); svg.setAttribute('aria-hidden', 'true');
  const l1 = document.createElementNS(NS, 'line'), l2 = document.createElementNS(NS, 'line');
  svg.append(l1, l2); document.body.append(cursorEl, viewerEl, svg);
  let card = null, rect = null, vx = 0, side = 'right', vh = 220;
  let cx = 0, cy = 0, tgt = 0, cur = 0, vel = 0, raf = 0, idle = 0, on = false;
  const setLine = (l, a, b) => {
    const p = offsetPoint(a, b, OFF);
    l.setAttribute('x1', p.x1); l.setAttribute('y1', p.y1); l.setAttribute('x2', p.x2); l.setAttribute('y2', p.y2);
  };
  const paint = () => {
    viewerEl.style.transform = `translate3d(${vx}px,${(rect.top + cur).toFixed(1)}px,0)`;
    cursorEl.style.transform = `translate3d(${(cx - HALF).toFixed(1)}px,${(cy - HALF).toFixed(1)}px,0)`;
    const vy = rect.top + cur, vw = 180;
    const ex = side === 'right' ? vx : vx + vw;
    setLine(l1, { x: cx, y: cy - HALF }, { x: ex, y: vy });
    setLine(l2, { x: cx, y: cy + HALF }, { x: ex, y: vy + vh });
  };
  const tick = () => {
    const s = springStep(cur, vel, tgt, 0.1, 0.54);
    cur = s.pos; vel = s.vel; paint();
    if (Math.abs(tgt - cur) < 0.1 && Math.abs(vel) < 0.1) { raf = 0; return; }
    raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const show = () => {
    if (idle) { clearTimeout(idle); idle = 0; }
    if (!on) { on = true; cursorEl.classList.add('on'); viewerEl.classList.add('on'); svg.classList.add('on'); }
  };
  const hide = () => {
    on = false; card = null; rect = null;
    cursorEl.classList.remove('on'); viewerEl.classList.remove('on'); svg.classList.remove('on');
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  const enter = (e) => {
    card = e.currentTarget; rect = card.getBoundingClientRect();
    const img = card.querySelector('img');
    if (img && img.currentSrc) { vimg.src = img.currentSrc; vimg.alt = img.alt; }
    vh = viewerEl.offsetHeight || 220;
    const p = placeViewer(rect, 180, 10, 20); vx = p.x; side = p.side;
    cx = e.clientX; cy = e.clientY;
    cur = tgt = targetY(cy, rect, vh); vel = 0;
    show(); paint(); kick();
  };
  const move = (e) => {
    if (!card) return;
    cx = e.clientX; cy = e.clientY; tgt = targetY(cy, rect, vh); kick();
  };
  const leave = () => { if (idle) clearTimeout(idle); idle = setTimeout(hide, IDLE_MS); };
  const refresh = () => {
    if (!card) return;
    rect = card.getBoundingClientRect();
    const p = placeViewer(rect, 180, 10, 20); vx = p.x; side = p.side;
    vh = viewerEl.offsetHeight || vh; tgt = targetY(cy, rect, vh); paint(); kick();
  };
  const remeasure = () => { if (card) { vh = viewerEl.offsetHeight || vh; tgt = targetY(cy, rect, vh); paint(); kick(); } };
  vimg.addEventListener('load', remeasure);
  cards.forEach((c) => {
    c.addEventListener('mouseenter', enter); c.addEventListener('mousemove', move); c.addEventListener('mouseleave', leave);
  });
  window.addEventListener('scroll', refresh, { passive: true });
  window.addEventListener('resize', refresh);
  return () => {
    cards.forEach((c) => { c.removeEventListener('mouseenter', enter); c.removeEventListener('mousemove', move); c.removeEventListener('mouseleave', leave); });
    window.removeEventListener('scroll', refresh); window.removeEventListener('resize', refresh);
    vimg.removeEventListener('load', remeasure);
    if (idle) clearTimeout(idle); if (raf) cancelAnimationFrame(raf);
    cursorEl.remove(); viewerEl.remove(); svg.remove();
  };
}
