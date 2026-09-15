/* ADAM/DS — fx-lab/cells · mosaic lab engine composer ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-1] */
// Exports: mountCells — lab-local renderer + controls (texture lives in cells-texture.js)
import { buildTree, orderRandom } from '../../views/masonry/cells.js';
import { css, tok, reduced } from './color.js';
import { makeDraw } from './cells-draw.js';
import { makeTexture } from './cells-texture.js';
import { playFileId } from '../../views/element-sound.js';

export function mountCells(scope) {
  const canvas = scope.querySelector('[data-fx-stage]');
  if (!canvas || !canvas.getContext) return () => {};
  const ctx = canvas.getContext('2d');
  const ctl = scope.querySelector('[data-fx-cells]');
  const P = { count: 120, morph: 0.04, gut: 1, span: 1.2, order: 'seq', image: 'none', sound: 'none' };
  let root = null, branches = [], split = 0, playing = false, raf = 0, last = 0;
  const tex = makeTexture({
    getRoot: () => root,
    rebuild: () => rebuild(),
    draw: () => draw(),
    play: () => play(),
    playing: () => playing,
  });
  const readPal = () => ({ bg: css('--color-surface', [255, 255, 255]),
      ink: css('--color-ink', [22, 19, 14]),
      accent: css('--color-accent', [232, 68, 46]) });
  let pal = readPal();
  const rebuild = () => {
    const r = buildTree(4 / 3, P.count); root = r.root; branches = r.branches;
    tex.clear();
    if (tex.img && tex.img.complete && tex.img.naturalWidth) tex.sampleTex();
    if (P.order === 'rnd') orderRandom(branches, split);
  };
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round((r.height || r.width * 0.75) * dpr));
  };
  const draw = makeDraw(ctx, canvas, () => ({ root, P, split, pal, hasTex: tex.has }));
  const stop = () => { playing = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    split = Math.min(1, split + dt / P.span);
    draw();
    if (split < 1 && playing) raf = requestAnimationFrame(tick);
    else { playing = false; raf = 0; }
  };
  const play = () => {
    if (playing || reduced()) return;
    playing = true; last = performance.now(); raf = requestAnimationFrame(tick);
  };
  const replay = () => {
    pal = readPal(); stop(); split = reduced() ? 1 : 0; draw(); play();
    if (P.sound && P.sound !== 'none') {
      try { playFileId(P.sound, 0.7); } catch {}
    }
  };
  const outs = {};
  if (ctl) ctl.querySelectorAll('[data-v]').forEach((o) => { outs[o.dataset.v] = o; });
  const show = () => {
    if (outs.count) outs.count.textContent = P.count;
    if (outs.morph) outs.morph.textContent = P.morph.toFixed(2);
    if (outs.gut) outs.gut.textContent = (P.gut % 1 ? P.gut.toFixed(1) : P.gut) + 'px';
    if (outs.span) outs.span.textContent = P.span.toFixed(1) + 's';
    if (outs.order) outs.order.textContent = P.order;
    if (outs.image) outs.image.textContent = P.image;
    if (outs.sound) outs.sound.textContent = P.sound;
  };
  const onCtl = (e) => {
    const k = e.target.dataset.k; if (!k) return;
    const v = e.target.value;
    if (k === 'count') { P.count = +v; rebuild(); }
    else if (k === 'morph') { P.morph = (+v) / 100; tok('--fx-morph', String(P.morph)); }
    else if (k === 'gut') P.gut = +v;
    else if (k === 'span') { P.span = (+v) / 10; tok('--dur-fx-span', P.span.toFixed(1) + 's'); }
    else if (k === 'order') { P.order = v; rebuild(); }
    else if (k === 'sound') { P.sound = v; }
    else if (k === 'image') { P.image = v; tex.loadImage(v); show(); return; }
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
