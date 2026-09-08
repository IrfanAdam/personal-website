// Paced port of rareui GridReveal — frame one is already half-subdivided,
// subdivision with eased split morphs (random split order), gutters
// recess as the mosaic refines, the photo fading in only at the very end.
import { buildTree, measureTree, orderRandom, clamp01, mix, easeOut, smoothstep, MORPH } from './cells.js';
const TARGET = 30, SAMPLE = 128, WAIT_CAP = 0.72, PHOTO_FROM = 0.93;
const COLOR_MS = 240, SPAN_S = 0.6;
// hero: denser + slower so the mosaic is unmistakable on detail page
const H_TARGET = 22, H_WAIT = 0.75, H_PHOTO = 0.88;
const H_COLOR = 360, H_SPAN = 0.78;
const darkNow = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; };
const greyOf = (tone, dark, clock) => (dark ? 30 : 228) + tone * 13 + Math.sin(clock * 1.5 + tone * 6.28) * 3;
const cellCount = (box) => {
  const r = box.getBoundingClientRect();
  if (!r.width || !r.height) return 120;
  return Math.min(180, Math.max(48, Math.round((r.width * r.height) / (TARGET * TARGET))));
};
const heroCellCount = (box) => {
  const r = box.getBoundingClientRect();
  if (!r.width || !r.height) return 220;
  return Math.min(380, Math.max(96, Math.round((r.width * r.height) / (H_TARGET * H_TARGET))));
};
function patch(ctx, p, W, H, gut, tint, dark, clock, white) {
  const x = Math.round(p.x), y = Math.round(p.y);
  const w = Math.round(p.x + p.w) - x, h = Math.round(p.y + p.h) - y;
  const l = x <= 0 ? 0 : gut, t = y <= 0 ? 0 : gut;
  const iw = w - l - (x + w >= W ? 0 : gut), ih = h - t - (y + h >= H ? 0 : gut);
  if (iw <= 0 || ih <= 0) return;
  if (white == null) {
    const g = greyOf(p.tone, dark, clock);
    ctx.fillStyle = `rgb(${Math.round(mix(g, p.r, tint))},${Math.round(mix(g, p.g, tint))},${Math.round(mix(g, p.b, tint))})`;
  } else ctx.fillStyle = `rgba(255,255,255,${white.toFixed(3)})`;
  ctx.fillRect(x + l, y + t, iw, ih);
}
function draw(ctx, root, W, H, s) {
  const tint = s.hasColors ? s.fade : 0;
  const base = greyOf(root.tone, s.dark, s.clock);
  ctx.fillStyle = `rgb(${Math.round(mix(base, root.r, tint) * 0.92)},${Math.round(mix(base, root.g, tint) * 0.92)},${Math.round(mix(base, root.b, tint) * 0.92)})`;
  ctx.fillRect(0, 0, W, H);
  const gut = s.gut * (1 - smoothstep(0.35, 0.75, s.split));
  const seed = { x: 0, y: 0, w: W, h: H, r: root.r, g: root.g, b: root.b, tone: root.tone };
  const walk = (c, p, gl) => {
    if (!c.kids || s.split < c.splitAt) {
      if (!gl) { patch(ctx, p, W, H, gut, tint, s.dark, s.clock); return; }
      const band = gl.pos - ((p.x + p.y) / (W + H)) * 0.9 - p.tone * 0.25;
      const a = Math.max(0, 1 - Math.abs(band) * 4) * gl.amp;
      if (a > 0.01) patch(ctx, p, W, H, 0, 0, false, 0, a);
      return;
    }
    const t = easeOut(clamp01((s.split - c.splitAt) / MORPH));
    for (const k of c.kids) walk(k, {
      x: mix(p.x, k.x * W, t), y: mix(p.y, k.y * H, t), w: mix(p.w, k.w * W, t), h: mix(p.h, k.h * H, t),
      r: mix(p.r, k.r, t), g: mix(p.g, k.g, t), b: mix(p.b, k.b, t), tone: mix(p.tone, k.tone, t),
    }, gl);
  };
  walk(root, seed);
  if (!s.done || s.now < s.t0) walk(root, seed, { pos: ((s.clock % 1.6) / 1.6) * 1.5, amp: 0.14 });
  if (s.sharp) {
    const pr = s.hasColors ? smoothstep(s.photoFrom, 1, s.split) : s.fade;
    const photo = pr * s.fade;
    if (photo > 0.002) { ctx.globalAlpha = Math.min(1, photo); ctx.drawImage(s.sharp, 0, 0); ctx.globalAlpha = 1; }
    if (s.done && pr > 0 && pr < 1) walk(root, seed, { pos: pr * 1.5, amp: 0.24 });
  }
}
export function attachGridReveal(box, img, delay = 0, hero = false) {
  const canvas = box.querySelector('canvas.gr'), ctx = canvas ? canvas.getContext('2d') : null;
  if (!canvas || !ctx) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const asp = (() => { const w = parseFloat(img.getAttribute('width') || ''), h = parseFloat(img.getAttribute('height') || ''); return w > 0 && h > 0 ? w / h : 0.75; })();
  const count = hero ? heroCellCount(box) : cellCount(box);
  const { root, branches } = buildTree(asp, count);
  const colorMs = hero ? H_COLOR : COLOR_MS;
  const span = hero ? H_SPAN : SPAN_S;
  const waitCap = hero ? H_WAIT : WAIT_CAP;
  const photoFrom = hero ? H_PHOTO : PHOTO_FROM;
  const s = { W: 0, H: 0, gut: 1, dark: darkNow(), clock: 0, split: 0, eased: 0, elapsed: 0, fade: 0, done: false, hasColors: false, loadedAt: -1, sharp: null, now: 0, t0: performance.now() + Math.max(0, delay), photoFrom, colorMs, hero };

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
  const decode = () => {
    const buf = document.createElement('canvas'); buf.width = SAMPLE; buf.height = SAMPLE;
    const btx = buf.getContext('2d', { willReadFrequently: true });
    if (btx && img.naturalWidth) {
      const sc = Math.max(SAMPLE / img.naturalWidth, SAMPLE / img.naturalHeight);
      btx.drawImage(img, (SAMPLE - img.naturalWidth * sc) / 2, (SAMPLE - img.naturalHeight * sc) / 2, img.naturalWidth * sc, img.naturalHeight * sc);
      try { measureTree(root, btx.getImageData(0, 0, SAMPLE, SAMPLE).data, SAMPLE); orderRandom(branches, s.split); s.hasColors = true; } catch {}
    }
    s.done = true; s.loadedAt = performance.now(); makeBuffers();
    if (reduce) { s.split = 1; s.eased = 1; s.fade = 1; render(s.loadedAt + s.colorMs); finish(); }
  };
  if (img.complete && img.naturalWidth) decode();
  else { img.addEventListener('load', decode, { once: true }); img.addEventListener('error', () => { s.done = true; s.loadedAt = performance.now(); if (reduce) { render(s.loadedAt); finish(); } }, { once: true }); }
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2), r = box.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
    s.dark = darkNow(); if (W === s.W && H === s.H) return;
    s.W = W; s.H = H; s.gut = dpr; canvas.width = W; canvas.height = H;
    if (s.done) makeBuffers(); render(performance.now());
  };
  resize(); const ro = new ResizeObserver(resize); ro.observe(box);
  if (reduce) { render(performance.now()); return () => { ro.disconnect(); }; }
  // RAF fallback for headless/hidden tabs where requestAnimationFrame is throttled
  const nextFrame = (cb) => {
    if (typeof requestAnimationFrame === 'function' && document.visibilityState === 'visible') return requestAnimationFrame(cb);
    return setTimeout(() => cb(performance.now()), 16);
  };
  const cancelFrame = (id) => {
    if (typeof cancelAnimationFrame === 'function' && document.visibilityState === 'visible') return cancelAnimationFrame(id);
    return clearTimeout(id);
  };
  let raf = 0, visible = true, stopped = false;
  const tick = (now) => {
    raf = nextFrame(tick);
    const dt = Math.min(((now - (s.now || now)) / 1000) || 0, 0.05);
    s.clock += dt; if (now > s.t0) s.elapsed += dt;
    const target = s.done ? 1 : 0.9 * (1 - Math.exp(-s.elapsed / span));
    const easeK = hero ? 7.0 : 8, splitK = hero ? 5.6 : 6;
    s.eased += (target - s.eased) * (1 - Math.exp(-dt * easeK));
    const wanted = Math.min(s.eased, s.done ? 1 : waitCap);
    s.split += (wanted - s.split) * (1 - Math.exp(-dt * splitK));
    render(now);
    if (s.done && s.eased > 0.99 && now - s.loadedAt > s.colorMs) {
      const pr = s.hasColors ? smoothstep(s.photoFrom, 1, s.split) : s.fade;
      if (pr > 0.99) { render(now); stopped = true; cancelFrame(raf); raf = 0; finish(); }
    }
  };
  const start = () => { if (!stopped && !raf) raf = nextFrame(tick); };
  const io = hero ? null : ('IntersectionObserver' in window ? new IntersectionObserver(([e]) => { if (e.isIntersecting === visible) return; visible = e.isIntersecting; if (visible) start(); else { cancelFrame(raf); raf = 0; } }, { rootMargin: '150px' }) : null);
  if (io) io.observe(box); start();
  return () => { cancelFrame(raf); ro.disconnect(); if (io) io.disconnect(); };
}
