/* ADAM/SHARED — views/strip-viewer-helpers · dom + place + hero + spring
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-17] */
// Exports: makeStripEl, placeStrip, HERO, slugFrom, createFollower, preloadHeroes
import { projects } from '../data/site.js';
import { fxNum } from './fx-tokens.js';
export const HERO = Object.fromEntries(projects.map((p) => [p[0], p[14] || p[13] || p[8]]));
export const slugFrom = (a) => (a.getAttribute('href') || '').split('/').pop() || '';
export function makeStripEl() {
  const el = document.createElement('div');
  el.className = 'viewer viewer--strip';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<img alt="" decoding="async" fetchpriority="low" />';
  el.style.zIndex = '30';
  document.body.appendChild(el);
  return el;
}
export function preloadHeroes() {
  Object.values(HERO).forEach((src) => {
    if (!src) return;
    const im = new Image(); im.decoding = 'async'; im.src = src;
    if (im.decode) im.decode().catch(() => {});
  });
}
export function placeStrip(cx, cy, vw, vh, pad, gap) {
  let x = cx + gap; let y = cy + gap;
  const sw = window.innerWidth; const sh = window.innerHeight;
  if (x + vw + pad > sw) x = cx - vw - gap;
  if (x < pad) x = pad;
  if (x + vw + pad > sw) x = Math.max(pad, sw - vw - pad);
  if (y + vh + pad > sh) y = cy - vh - gap;
  if (y < pad) y = pad;
  if (y + vh + pad > sh) y = Math.max(pad, sh - vh - pad);
  return { x, y };
}
const _orig = new WeakMap();
export function placeWithOrigin(el, cx, cy, vw, vh, pad, gap) {
  const p = placeStrip(cx, cy, vw, vh, pad, gap);
  let ox = '100%'; if (p.x > cx) ox = '0%';
  let oy = '100%'; if (p.y > cy) oy = '0%';
  const o = `${ox} ${oy}`;
  if (_orig.get(el) !== o) { el.style.transformOrigin = o; _orig.set(el, o); }
  return p;
}
// — Follower: x immediate · y inertia spring with dead zone + scale spring on one rAF —
export function createFollower(el) {
  const SK = fxNum('--fx-viewer-pop-k', 0.28);
  const SFR = fxNum('--fx-viewer-pop-fr', 0.55);
  const FROM = fxNum('--fx-viewer-pop', 0.985);
  const YK = fxNum('--fx-viewer-y-k', 0.22);
  const YFR = fxNum('--fx-viewer-y-fr', 0.68);
  const DEAD = fxNum('--fx-viewer-y-dead', 4);
  let x = 0, y = 0, tx = 0, ty = 0, vy = 0, s = FROM, vs = 0, ts = FROM, raf = 0, live = false;
  const apply = () => {
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
  };
  const tick = () => {
    raf = 0; x = tx;
    vy = (vy + (ty - y) * YK) * YFR; y += vy;
    vs = (vs + (ts - s) * SK) * SFR; s += vs;
    apply();
    const yDone = Math.abs(ty - y) < 0.5 && Math.abs(vy) < 0.05;
    const sclDone = Math.abs(ts - s) < 0.001 && Math.abs(vs) < 0.001;
    if (live || !sclDone || !yDone) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  return {
    snap(nx, ny) { x = tx = nx; y = ty = ny; vy = 0; apply(); kick(); },
    aim(nx, ny) { tx = nx; if (Math.abs(ny - y) >= DEAD) ty = ny; live = true; kick(); },
    pop() { s = FROM; vs = 0; ts = 1; live = true; kick(); },
    dip() { ts = FROM; live = true; kick(); },
    settle() { ts = 1; live = true; kick(); },
    idle() { live = false; ts = FROM; kick(); },
    stop() { if (raf) cancelAnimationFrame(raf); raf = 0; live = false; },
  };
}
// — List follower —
export function createListFollower(el) {
  const SK = fxNum('--fx-viewer-pop-k', 0.28);
  const SFR = fxNum('--fx-viewer-pop-fr', 0.55);
  const FROM = fxNum('--fx-viewer-pop', 0.985);
  let x = 0, y = 0, s = FROM, vs = 0, ts = FROM, raf = 0, live = false;
  const apply = () => {
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
  };
  const tick = () => {
    raf = 0;
    vs = (vs + (ts - s) * SK) * SFR; s += vs;
    apply();
    const sclDone = Math.abs(ts - s) < 0.001 && Math.abs(vs) < 0.001;
    if (live || !sclDone) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  return {
    snap(nx, ny) { x = nx; y = ny; apply(); kick(); },
    aim(nx, ny) { x = nx; y = ny; apply(); live = true; kick(); },
    pop() { s = FROM; vs = 0; ts = 1; live = true; kick(); },
    idle() { live = false; ts = FROM; kick(); },
    stop() { if (raf) cancelAnimationFrame(raf); raf = 0; live = false; },
  };
}
