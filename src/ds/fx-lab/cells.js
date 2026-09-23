/* ADAM/DS — fx-lab/cells · mosaic lab engine composer ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-1] */
// Exports: mountCells — lab-local renderer + controls (texture lives in cells-texture.js)
import { buildTree, orderRandom } from '../../views/masonry/cells.js';
import { css, reduced } from './color.js';
import { makeDraw } from './cells-draw.js';
import { makeTexture } from './cells-texture.js';
import { bindControls } from './cells-controls.js';
import { playFileId } from '../../views/element-sound.js';

export function mountCells(scope) {
  const canvas = scope.querySelector('[data-fx-stage]');
  if (!canvas || !canvas.getContext) return () => {};
  const ctx = canvas.getContext('2d');
  const P = { count: 120, morph: 0.04, gut: 1, span: 1.2, order: 'seq', image: 'helix', sound: 'window-open.mp3' };
  let root = null, branches = [], split = 0, playing = false, raf = 0, last = 0;
  const tex = makeTexture({
    getRoot: () => root,
    rebuild: () => rebuild(),
    draw: () => draw(),
    play: () => play(),
    playing: () => playing,
    onTextureReady: () => replay(),
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
  const draw = makeDraw(ctx, canvas, () => ({ root, P, split, pal, hasTex: tex.has, texImg: tex.img }));
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
    pal = readPal();
    stop();
    if (reduced()) {
      split = 1;
      draw();
      return;
    }
    split = 0;
    draw();
    play();
    if (P.sound && P.sound !== 'none') {
      try { playFileId(P.sound, 0.7); } catch {}
    }
  };
  const ctlApi = bindControls(scope, P, {
    rebuild: () => rebuild(),
    draw: () => draw(),
    replay: () => replay(),
    loadImage: (v) => tex.loadImage(v),
  });
  const ro = new ResizeObserver(() => { size(); draw(); });
  ro.observe(canvas);
  rebuild(); size(); ctlApi.show();
  if (P.image !== 'none') { split = 0; tex.loadImage(P.image); }
  else { split = reduced() ? 1 : 0; draw(); play(); }
  const pane = canvas.closest('[data-pane]');
  let mo = null;
  if (pane) {
    mo = new MutationObserver(() => {
      if (!pane.hasAttribute('hidden')) {
        if (P.image !== 'none' && !tex.has && !tex.img) tex.loadImage(P.image);
        else { draw(); replay(); }
      }
    });
    mo.observe(pane, { attributes: true, attributeFilter: ['hidden'] });
  }
  return () => {
    stop(); ro.disconnect();
    if (mo) mo.disconnect();
    ctlApi.off();
  };
}
