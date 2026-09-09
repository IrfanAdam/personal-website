/* ADAM/DS Functions lab engine — DS-only. Imports the REAL cell-tree builder
   (../views/masonry/cells.js) as reference: identical geometry + split pacing,
   lab-local renderer + controls. The site is never touched from here. */
import { buildTree, measureTree, orderRandom, mix, clamp01, easeOut } from '../views/masonry/cells.js';
import { cssVar } from './specimens.js';

const toRGB = (s) => {
  s = String(s).trim();
  let m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1]; if (h.length === 3) h = [...h].map((c) => c + c).join('');
    const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  m = s.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(',').map(Number); return [p[0] || 0, p[1] || 0, p[2] || 0]; }
  return [128, 128, 128];
};
const css = (n, fb) => { try { const v = cssVar(n); if (v) return toRGB(v); } catch (_) {} return fb; };
/* Graduation bridge (5.1): graduable knobs write through to the same tokens
   the site reads. count/gut/order stay lab-local (count ≠ TARGET semantics). */
const tok = (n, val) => { try { document.documentElement.style.setProperty(n, val); } catch {} };
const rgb = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
const mix3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const SAMPLE = 64;

function mountCells(scope) {
  const canvas = scope.querySelector('[data-fx-stage]');
  if (!canvas || !canvas.getContext) return () => {};
  const ctx = canvas.getContext('2d');
  const ctl = scope.querySelector('[data-fx-cells]');
  const P = { count: 120, morph: 0.04, gut: 1, span: 1.2, order: 'seq', image: 'none' };
  let root = null, branches = [], split = 0, playing = false, raf = 0, last = 0;
  let texImg = null, hasTex = false;
  const readPal = () => ({ bg: css('--color-surface', [255, 255, 255]), ink: css('--color-ink', [22, 19, 14]), accent: css('--color-accent', [232, 68, 46]) });
  let pal = readPal();
  const imgMap = { helix: '/images/helix.png', fluxx: '/images/fluxx.jpg', 'tas-35': '/images/tas-35.jpg' };
  const sampleTex = () => {
    if (!texImg || !texImg.complete || !texImg.naturalWidth || !root) return;
    const c = document.createElement('canvas'); c.width = SAMPLE; c.height = SAMPLE;
    const x = c.getContext('2d', { willReadFrequently: true }); if (!x) return;
    const sc = Math.max(SAMPLE / texImg.naturalWidth, SAMPLE / texImg.naturalHeight);
    x.drawImage(texImg, (SAMPLE - texImg.naturalWidth * sc) / 2, (SAMPLE - texImg.naturalHeight * sc) / 2, texImg.naturalWidth * sc, texImg.naturalHeight * sc);
    try { measureTree(root, x.getImageData(0, 0, SAMPLE, SAMPLE).data, SAMPLE); hasTex = true; } catch {}
  };
  const rebuild = () => {
    const r = buildTree(4 / 3, P.count); root = r.root; branches = r.branches;
    hasTex = false;
    if (texImg && texImg.complete && texImg.naturalWidth) sampleTex();
    if (P.order === 'rnd') orderRandom(branches, split);
  };
  const loadImage = (key) => {
    hasTex = false; texImg = null;
    const src = imgMap[key];
    if (!src) { rebuild(); draw(); return; }
    const im = new Image(); im.crossOrigin = 'anonymous'; im.src = src;
    im.onload = () => { texImg = im; hasTex = false; rebuild(); draw(); if (playing) play(); else draw(); };
    im.onerror = () => { texImg = null; hasTex = false; rebuild(); draw(); };
  };
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round((r.height || r.width * 0.75) * dpr));
  };
  const draw = () => {
    const W = canvas.width, H = canvas.height;
    if (!W || !H || !root) return;
    ctx.fillStyle = rgb(pal.bg); ctx.fillRect(0, 0, W, H);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const gut = P.gut * dpr * (1 - clamp01((split - 0.35) / 0.4));
    const walk = (c, px, py, pw, ph) => {
      if (!c.kids || split < c.splitAt) {
        const g = gut / 2, frontier = split - c.splitAt;
        let col;
        if (hasTex) col = [c.r, c.g, c.b];
        else col = mix3(pal.bg, pal.ink, 0.1 + c.tone * 0.45);
        if (!hasTex && c.splitAt > -1 && frontier >= 0 && frontier < 0.09) col = mix3(col, pal.accent, 0.55);
        else if (hasTex && c.splitAt > -1 && frontier >= 0 && frontier < 0.09) col = mix3(col, pal.accent, 0.35);
        ctx.fillStyle = rgb(col);
        ctx.fillRect(px + g, py + g, Math.max(0, pw - gut), Math.max(0, ph - gut));
        return;
      }
      const t = easeOut(clamp01((split - c.splitAt) / P.morph));
      for (const k of c.kids) walk(k, mix(px, k.x * W, t), mix(py, k.y * H, t), mix(pw, k.w * W, t), mix(ph, k.h * H, t));
    };
    walk(root, 0, 0, W, H);
  };
  const stop = () => { playing = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    split = Math.min(1, split + dt / P.span);
    draw();
    if (split < 1 && playing) raf = requestAnimationFrame(tick);
    else { playing = false; raf = 0; }
  };
  const play = () => { if (playing || reduced()) return; playing = true; last = performance.now(); raf = requestAnimationFrame(tick); };
  const replay = () => { pal = readPal(); stop(); split = reduced() ? 1 : 0; draw(); play(); };
  const outs = {};
  if (ctl) ctl.querySelectorAll('[data-v]').forEach((o) => { outs[o.dataset.v] = o; });
  const show = () => {
    if (outs.count) outs.count.textContent = P.count;
    if (outs.morph) outs.morph.textContent = P.morph.toFixed(2);
    if (outs.gut) outs.gut.textContent = (P.gut % 1 ? P.gut.toFixed(1) : P.gut) + 'px';
    if (outs.span) outs.span.textContent = P.span.toFixed(1) + 's';
    if (outs.order) outs.order.textContent = P.order;
    if (outs.image) outs.image.textContent = P.image;
  };
  const onCtl = (e) => {
    const k = e.target.dataset.k; if (!k) return;
    const v = e.target.value;
    if (k === 'count') { P.count = +v; rebuild(); }
    else if (k === 'morph') { P.morph = (+v) / 100; tok('--fx-morph', String(P.morph)); }
    else if (k === 'gut') P.gut = +v;
    else if (k === 'span') { P.span = (+v) / 10; tok('--dur-fx-span', P.span.toFixed(1) + 's'); }
    else if (k === 'order') { P.order = v; rebuild(); }
    else if (k === 'image') { P.image = v; loadImage(v); show(); return; }
    show(); draw();
  };
  const replayBtn = scope.querySelector('[data-fx-replay]');
  const shuffleBtn = scope.querySelector('[data-fx-shuffle]');
  const onReplay = () => replay();
  const onShuffle = () => { rebuild(); replay(); };
  if (ctl) { ctl.addEventListener('input', onCtl); ctl.addEventListener('change', onCtl); }
  if (replayBtn) replayBtn.addEventListener('click', onReplay);
  if (shuffleBtn) shuffleBtn.addEventListener('click', onShuffle);
  const ro = new ResizeObserver(() => { size(); draw(); });
  ro.observe(canvas);
  rebuild(); size(); show();
  split = reduced() ? 1 : 0; draw(); play();
  return () => {
    stop(); ro.disconnect();
    if (ctl) { ctl.removeEventListener('input', onCtl); ctl.removeEventListener('change', onCtl); }
    if (replayBtn) replayBtn.removeEventListener('click', onReplay);
    if (shuffleBtn) shuffleBtn.removeEventListener('click', onShuffle);
  };
}

function mountShimmer(scope) {
  const box = scope.querySelector('[data-fx-shimmer]');
  if (!box) return () => {};
  const dur = scope.querySelector('[data-fx-dur]');
  const out = scope.querySelector('[data-fx-dur-v]');
  const dirB = scope.querySelector('[data-fx-dir]');
  const pauseB = scope.querySelector('[data-fx-pause]');
  const onDur = () => { const s = (+dur.value / 10).toFixed(1); box.style.setProperty('--fx-dur', s + 's'); if (out) out.textContent = s + 's'; };
  const onDir = () => { if (dirB) dirB.textContent = box.classList.toggle('rev') ? 'forward' : 'reverse'; };
  const onPause = () => { if (pauseB) pauseB.textContent = box.classList.toggle('off') ? 'play' : 'pause'; };
  if (dur) dur.addEventListener('input', onDur);
  if (dirB) dirB.addEventListener('click', onDir);
  if (pauseB) pauseB.addEventListener('click', onPause);
  if (dur) onDur();
  return () => {
    if (dur) dur.removeEventListener('input', onDur);
    if (dirB) dirB.removeEventListener('click', onDir);
    if (pauseB) pauseB.removeEventListener('click', onPause);
  };
}

function mountRise(scope) {
  const box = scope.querySelector('[data-fx-rise]');
  if (!box) return () => {};
  const dur = scope.querySelector('[data-fx-rise-dur]');
  const out = scope.querySelector('[data-fx-rise-v]');
  const btn = scope.querySelector('[data-fx-rise-replay]');
  const onDur = () => { if (dur && out) { box.style.setProperty('--fx-rise-dur', dur.value + 'ms'); out.textContent = dur.value + 'ms'; } };
  const onReplay = () => {
    if (reduced()) return;
    box.classList.add('rest');
    void box.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.remove('rest')));
  };
  if (dur) dur.addEventListener('input', onDur);
  if (btn) btn.addEventListener('click', onReplay);
  if (dur) onDur();
  return () => {
    if (dur) dur.removeEventListener('input', onDur);
    if (btn) btn.removeEventListener('click', onReplay);
  };
}

export function mountFx(root) {
  const offs = [mountCells(root), mountShimmer(root), mountRise(root)];
  return () => offs.forEach((fn) => fn());
}
export { mountCells, mountShimmer, mountRise };
