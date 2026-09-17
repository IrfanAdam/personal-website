/* ADAM/PAGE — views/masonry/list-viewer · rows ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-17] */
// Exports: attachListViewer — physics cursor-following hero popover over list rows
import { fxNum, fxMs } from '../fx-tokens.js';
import { makeStripEl, placeWithOrigin, createFollower } from '../strip-viewer-helpers.js';
export function attachListViewer(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (matchMedia('(hover: none)').matches) return () => {};
  const rows = [...grid.querySelectorAll('.work[data-hero]')];
  if (!rows.length) return () => {};
  const VW = fxNum('--size-viewer-w', 180), GAP = fxNum('--space-8', 8) * 0.1, PAD = fxNum('--space-12', 12);
  const HIDE = fxMs('--fx-viewer-debounce', 70), SWAP = fxMs('--dur-viewer-swap', 110);
  const el = makeStripEl();
  const img = el.querySelector('img');
  const fol = createFollower(el);
  let cur = '', hideT = 0, popT = 0, on = false;
  let cx = 0, cy = 0, vh = 240;
  const titleOf = (row) => {
    const t = row.querySelector('.work-title');
    return t ? t.textContent : '';
  };
  const place = () => placeWithOrigin(el, cx, cy, VW, vh, PAD, GAP);
  const cancelH = () => { if (hideT) { clearTimeout(hideT); hideT = 0; } };
  const clearPop = () => { if (popT) { clearTimeout(popT); popT = 0; } };
  const schedH = () => { cancelH(); hideT = setTimeout(hide, HIDE); };
  const hide = () => {
    if (!on) return;
    on = false; cur = '';
    clearPop(); fol.idle();
    el.classList.remove('on');
  };
  const showRow = (row, x, y) => {
    const src = row.dataset.hero;
    if (!src) return;
    cx = x; cy = y;
    const p = place();
    if (src === cur && on) { fol.aim(p.x, p.y); return; }
    if (img.getAttribute('src') !== src) img.src = src;
    img.alt = titleOf(row);
    vh = el.offsetHeight || vh;
    cancelH(); clearPop();
    if (!on) {
      cur = src; on = true;
      fol.snap(p.x, p.y);
      el.classList.add('on');
      requestAnimationFrame(() => fol.pop());
    } else {
      cur = src;
      fol.dip();
      fol.aim(p.x, p.y);
      popT = setTimeout(() => { popT = 0; fol.settle(); }, SWAP);
    }
  };
  const onEnter = (e) => showRow(e.currentTarget, e.clientX, e.clientY);
  const onMove = (e) => {
    if (!on) return;
    cx = e.clientX; cy = e.clientY;
    const p = place();
    fol.aim(p.x, p.y);
  };
  const onLeave = () => schedH();
  const onImgLoad = () => { vh = el.offsetHeight || vh; const p = place(); fol.aim(p.x, p.y); };
  img.addEventListener('load', onImgLoad);
  img.addEventListener('error', onImgLoad);
  rows.forEach((r) => {
    r.addEventListener('mouseenter', onEnter);
    r.addEventListener('mousemove', onMove);
    r.addEventListener('mouseleave', onLeave);
  });
  const first = rows[0] && rows[0].dataset.hero;
  if (first && !img.getAttribute('src')) img.src = first;
  return () => {
    cancelH(); clearPop(); fol.stop();
    img.removeEventListener('load', onImgLoad);
    img.removeEventListener('error', onImgLoad);
    rows.forEach((r) => {
      r.removeEventListener('mouseenter', onEnter);
      r.removeEventListener('mousemove', onMove);
      r.removeEventListener('mouseleave', onLeave);
    });
    el.remove();
  };
}
