/* ADAM/FX — gridReveal · attach lifecycle · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: attachGridReveal — painter lives in gridReveal-draw.js
// Paced port of rareui GridReveal — frame one is already half-subdivided,
// subdivision with eased split morphs (random split order), gutters
// recess as the mosaic refines, the photo fading in only at the very end.
import { buildTree } from './cells.js';
import { draw } from './gridReveal-draw.js';
import { makeTicker } from './gridReveal-tick.js';
import { makeDecode, gateLoad } from './gridReveal-load.js';
import { smoothstep } from './cells.js';
import { fxNum, fxMs } from '../fx-tokens.js';
/* Graduated motion tokens — getComputedStyle with shipped-literal fallback,
   so first paint is pixel-identical with or without the token. Read once per
   attach (never per-frame): getComputedStyle per cell costs. */
const fx = () => ({
  target: fxNum('--fx-cell', 30),
  waitCap: fxNum('--fx-wait', 0.72),
  photoFrom: fxNum('--fx-photo-from', 0.93),
  colorMs: fxMs('--dur-fx-color', 240),
  spanS: fxMs('--dur-fx-span', 600) / 1000,
  morph: fxNum('--fx-morph', 0.04),
  splitEnd: fxNum('--fx-split-end', 0.92),
  sheen: fxNum('--fx-sheen', 0.14),
});
const darkNow = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; };
// URLs decoded at least once this session — revisits skip the reveal
// (grid rebuilds its <img> nodes per visit, so complete-at-attach misses).
const cellCount = (box, target) => {
  const r = box.getBoundingClientRect();
  if (!r.width || !r.height) return 120;
  return Math.min(180, Math.max(48, Math.round((r.width * r.height) / (target * target))));
};
export function attachGridReveal(box, img, delay = 0, hero = false, holdMs = 0) {
  const canvas = box.querySelector('canvas.gr'), ctx = canvas ? canvas.getContext('2d') : null;
  if (!canvas || !ctx) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const asp = (() => { const w = parseFloat(img.getAttribute('width') || ''), h = parseFloat(img.getAttribute('height') || ''); return w > 0 && h > 0 ? w / h : 0.75; })();
  const t = fx();
  const count = cellCount(box, t.target);
  const { root, branches } = buildTree(asp, count, t.morph, t.splitEnd);
  const s = { W: 0, H: 0, gut: 1, dark: darkNow(), clock: 0, split: 0, eased: 0, elapsed: 0, fade: 0, done: false, hasColors: false, loadedAt: -1, sharp: null, now: 0, t0: performance.now() + Math.max(0, delay), holdMs: Math.max(0, holdMs), photoFrom: t.photoFrom, colorMs: t.colorMs, morph: t.morph, sheen: t.sheen, waitCap: t.waitCap, spanS: t.spanS };

  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    const el = box.closest('.card, .hero-box');
    if (el && el.isConnected) el.classList.add('ready');
    else if (box.isConnected) box.classList.add('ready');
  };
  const render = (now) => {
    s.now = now;
    s.fade = s.loadedAt < 0 ? 0 : smoothstep(0, s.colorMs, now - s.loadedAt);
    if (s.W > 0) draw(ctx, root, s.W, s.H, s);
  };
  const makeBuffers = () => {
    if (!img.naturalWidth || !s.W) return;
    const c = document.createElement('canvas'); c.width = s.W; c.height = s.H;
    const x = c.getContext('2d'); if (!x) return;
    const sc = Math.max(s.W / img.naturalWidth, s.H / img.naturalHeight);
    x.drawImage(img, (s.W - img.naturalWidth * sc) / 2, (s.H - img.naturalHeight * sc) / 2, img.naturalWidth * sc, img.naturalHeight * sc);
    s.sharp = c;
  };
  const decode = makeDecode(img, root, branches, s, makeBuffers, render, finish, reduce);
  if (gateLoad(img, hero, reduce, s, decode, render, finish)) return () => {};
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2), r = box.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
    s.dark = darkNow(); if (W === s.W && H === s.H) return;
    s.W = W; s.H = H; s.gut = dpr; canvas.width = W; canvas.height = H;
    if (s.done) makeBuffers(); render(performance.now());
  };
  resize(); const ro = new ResizeObserver(resize); ro.observe(box);
  if (reduce) { render(performance.now()); return () => { ro.disconnect(); }; }
  const ticker = makeTicker(s, render, finish);
  const start = () => ticker.start();
  const io = hero ? null : ('IntersectionObserver' in window ? new IntersectionObserver(([e]) => ticker.setVisible(e.isIntersecting), { rootMargin: '150px' }) : null);
  if (io) io.observe(box); start();
  return () => { ticker.stop(); ro.disconnect(); if (io) io.disconnect(); };
}
