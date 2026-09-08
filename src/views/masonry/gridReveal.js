// Maxed-grid slow reveal — stripped port of rareui GridReveal.
// Always shows the full subdivision from frame 1; no split morph.
// Grey shimmer until decode, then per-cell blur→sharp stagger (busy first).
import { buildTree, measureTree, clamp01 } from './cells.js';

const CELLS = 180, SAMPLE = 128, COLOR_MS = 700, STAGGER_MS = 900, BLUR_DUR = 620, BLUR_PX = 20;

const darkNow = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
};
const greyOf = (tone, dark, clock) => (dark ? 30 : 228) + tone * 13 + Math.sin(clock * 1.5 + tone * 6.28) * 3;
const collect = (c, o) => { if (!c.kids) o.push(c); else for (const k of c.kids) collect(k, o); };

function draw(ctx, root, leaves, W, H, fade, dark, clock, colors, gut, s) {
  const hasBuffers = !!(s && s.sharp && s.blur);
  if (!hasBuffers) {
    const tint = colors ? fade : 0, shade = (v, t) => Math.round(v + (t - v) * tint);
    const base = greyOf(root.tone, dark, clock);
    ctx.fillStyle = `rgb(${Math.round(shade(base, root.r) * 0.94)},${Math.round(shade(base, root.g) * 0.94)},${Math.round(shade(base, root.b) * 0.94)})`;
    ctx.fillRect(0, 0, W, H);
    for (const c of leaves) {
      const x = Math.round(c.x * W), y = Math.round(c.y * H);
      const w = Math.round((c.x + c.w) * W) - x, h = Math.round((c.y + c.h) * H) - y;
      if (w <= gut || h <= gut) continue;
      const grey = greyOf(c.tone, dark, clock);
      ctx.fillStyle = `rgb(${shade(grey, c.r)},${shade(grey, c.g)},${shade(grey, c.b)})`;
      ctx.fillRect(x + gut / 2, y + gut / 2, w - gut, h - gut);
    }
    return;
  }
  const now = s.now;
  for (const c of leaves) {
    const x = Math.round(c.x * W), y = Math.round(c.y * H);
    const w = Math.round((c.x + c.w) * W) - x, h = Math.round((c.y + c.h) * H) - y;
    if (w <= 0 || h <= 0) continue;
    const p = clamp01((now - s.at - (c.revealAt || 0)) / BLUR_DUR);
    if (p < 1) ctx.drawImage(s.blur, x, y, w, h, x, y, w, h);
    else { ctx.drawImage(s.sharp, x, y, w, h, x, y, w, h); continue; }
    if (p > 0.001) { ctx.globalAlpha = p; ctx.drawImage(s.sharp, x, y, w, h, x, y, w, h); ctx.globalAlpha = 1; }
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
}

export function attachGridReveal(box, img) {
  const canvas = box.querySelector('canvas.gr');
  const ctx = canvas ? canvas.getContext('2d') : null;
  if (!canvas || !ctx) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const asp = (() => { const w = parseFloat(img.getAttribute('width') || ''), h = parseFloat(img.getAttribute('height') || ''); return w > 0 && h > 0 ? w / h : 0.75; })();
  const { root } = buildTree(asp, CELLS);
  const leaves = []; collect(root, leaves);
  const s = { W: 0, H: 0, gut: 1, dark: darkNow(), clock: 0, fade: 0, at: -1, done: false, colors: false, leaves, sharp: null, blur: null, now: 0 };
  const render = (now) => { s.now = now; s.fade = s.at < 0 ? 0 : clamp01((now - s.at) / COLOR_MS); if (s.W > 0) draw(ctx, root, leaves, s.W, s.H, s.fade, s.dark, s.clock, s.colors, s.gut, s); };
  const makeBuffers = () => {
    if (!s.done || !img.naturalWidth || !s.W) return;
    const mk = (doBlur) => {
      const c = document.createElement('canvas'); c.width = s.W; c.height = s.H;
      const x = c.getContext('2d'); if (!x) return c;
      if (doBlur) x.filter = `blur(${BLUR_PX}px)`;
      const sc = Math.max(s.W / img.naturalWidth, s.H / img.naturalHeight), dw = img.naturalWidth * sc, dh = img.naturalHeight * sc;
      x.drawImage(img, (s.W - dw) / 2, (s.H - dh) / 2, dw, dh); if (doBlur) x.filter = 'none'; return c;
    };
    s.sharp = mk(false); s.blur = mk(true);
  };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), r = box.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
    s.dark = darkNow(); if (W === s.W && H === s.H) return;
    s.W = W; s.H = H; s.gut = dpr; canvas.width = W; canvas.height = H;
    if (s.done) makeBuffers(); render(performance.now());
  };
  const decode = () => {
    const buf = document.createElement('canvas'); buf.width = SAMPLE; buf.height = SAMPLE;
    const btx = buf.getContext('2d', { willReadFrequently: true });
    if (btx && img.naturalWidth) {
      const sc = Math.max(SAMPLE / img.naturalWidth, SAMPLE / img.naturalHeight);
      btx.drawImage(img, (SAMPLE - img.naturalWidth * sc) / 2, (SAMPLE - img.naturalHeight * sc) / 2, img.naturalWidth * sc, img.naturalHeight * sc);
      try { measureTree(root, btx.getImageData(0, 0, SAMPLE, SAMPLE).data, SAMPLE); s.colors = true; } catch { /* CORS: stay grey */ }
    }
    leaves.sort((a, b) => b.detail - a.detail);
    leaves.forEach((c, i) => { c.revealAt = (i / leaves.length) * STAGGER_MS; });
    s.done = true; s.at = performance.now(); makeBuffers();
    if (reduce) render(s.at + COLOR_MS);
  };
  if (img.complete && img.naturalWidth) decode();
  else {
    img.addEventListener('load', decode, { once: true });
    img.addEventListener('error', () => { leaves.forEach((c, i) => { c.revealAt = (i / leaves.length) * STAGGER_MS * 0.5; }); s.done = true; s.at = performance.now(); if (reduce) render(s.at); }, { once: true });
  }
  resize(); const ro = new ResizeObserver(resize); ro.observe(box);
  if (reduce) { render(performance.now()); return () => ro.disconnect(); }
  let raf = 0, last = 0, elapsed = 0, visible = true, stopped = false;
  const tick = (now) => {
    raf = requestAnimationFrame(tick); if (!last) last = now;
    const dt = Math.min((now - last) / 1000, 0.05); last = now; elapsed += dt; s.clock = elapsed;
    render(now);
    if (s.done && now - s.at > STAGGER_MS + BLUR_DUR + 40) { render(now); stopped = true; cancelAnimationFrame(raf); raf = 0; }
  };
  const start = () => { if (!stopped && !raf) { last = 0; raf = requestAnimationFrame(tick); } };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => {
    if (e.isIntersecting === visible) return; visible = e.isIntersecting;
    if (visible) start(); else { cancelAnimationFrame(raf); raf = 0; }
  }, { rootMargin: '150px' }) : null;
  if (io) io.observe(box); start();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect(); };
}
