/* ADAM/SHARED — views/strip-viewer-helpers · dom + place + hero + spring
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-17] */
// Exports: makeStripEl, placeStrip, HERO, slugFrom, createFollower
import { projects } from '../data/site.js';
import { fxNum } from './fx-tokens.js';
export const HERO = Object.fromEntries(
  projects.map((p) => [p[0], p[14] || p[13] || p[8]])
);
export const slugFrom = (a) =>
  (a.getAttribute('href') || '').split('/').pop() || '';
export function makeStripEl() {
  const el = document.createElement('div');
  el.className = 'viewer viewer--strip';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<img alt="" decoding="async" />';
  el.style.zIndex = '30';
  document.body.appendChild(el);
  return el;
}
export function placeStrip(cx, cy, vw, vh, pad, gap) {
  let x = cx + gap;
  let y = cy + gap;
  const sw = window.innerWidth;
  const sh = window.innerHeight;
  if (x + vw + pad > sw) x = cx - vw - gap;
  if (x < pad) x = pad;
  if (x + vw + pad > sw) x = Math.max(pad, sw - vw - pad);
  if (y + vh + pad > sh) y = cy - vh - gap;
  if (y < pad) y = pad;
  if (y + vh + pad > sh) y = Math.max(pad, sh - vh - pad);
  return { x, y };
}
export function placeWithOrigin(el, cx, cy, vw, vh, pad, gap) {
  const p = placeStrip(cx, cy, vw, vh, pad, gap);
  let ox = '100%';
  if (p.x > cx) ox = '0%';
  let oy = '100%';
  if (p.y > cy) oy = '0%';
  el.style.transformOrigin = `${ox} ${oy}`;
  return p;
}
// — Follower: position + scale ride one rAF; velocity carries weight —
export function createFollower(el) {
  const K = fxNum('--fx-viewer-k', 0.1);
  const FR = fxNum('--fx-viewer-fr', 0.54);
  const SK = fxNum('--fx-viewer-pop-k', 0.22);
  const SFR = fxNum('--fx-viewer-pop-fr', 0.62);
  const FROM = fxNum('--fx-viewer-pop', 0.88);
  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;
  let tx = 0;
  let ty = 0;
  let s = FROM;
  let vs = 0;
  let ts = FROM;
  let raf = 0;
  let live = false;
  const tick = () => {
    raf = 0;
    vx = (vx + (tx - x) * K) * FR;
    vy = (vy + (ty - y) * K) * FR;
    x += vx; y += vy;
    vs = (vs + (ts - s) * SK) * SFR;
    s += vs;
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    el.style.scale = s.toFixed(4);
    const posDone = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1;
    const velDone = Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1;
    const sclDone = Math.abs(ts - s) < 0.001 && Math.abs(vs) < 0.001;
    if (live || !posDone || !velDone || !sclDone) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  return {
    snap(nx, ny) {
      x = tx = nx; y = ty = ny; vx = vy = 0;
      el.style.transform = `translate3d(${nx}px,${ny}px,0)`;
      kick();
    },
    aim(nx, ny) { tx = nx; ty = ny; live = true; kick(); },
    pop() { s = FROM; vs = 0; ts = 1; live = true; kick(); },
    dip() { ts = FROM; live = true; kick(); },
    settle() { ts = 1; live = true; kick(); },
    idle() { live = false; ts = FROM; kick(); },
    stop() { if (raf) cancelAnimationFrame(raf); raf = 0; live = false; },
  };
}
