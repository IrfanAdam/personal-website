/* ADAM/PAGE — views/masonry/list-viewer · rows ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-17] */
// Exports: attachListViewer — physics cursor-following hero popover over list rows
import { fxNum, fxMs } from '../fx-tokens.js';
import { makeStripEl, placeWithOrigin, createFollower } from '../strip-viewer-helpers.js';
export function attachListViewer(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (matchMedia('(hover: none)').matches) return () => {};
  const rows = [...grid.querySelectorAll('.work[data-card]')];
  if (!rows.length) return () => {};
  rows.forEach((r) => {
    const src = r.dataset.card;
    if (!src) return;
    const im = new Image();
    im.decoding = 'async';
    im.src = src;
  });
  const VW = fxNum('--size-viewer-w', 180), GAP = fxNum('--space-8', 8) * 0.1, PAD = fxNum('--space-12', 12);
  const HIDE = fxMs('--fx-viewer-debounce', 70);
  const el = makeStripEl();
  const img = el.querySelector('img');
  const fol = createFollower(el);
  let cur = '', hideT = 0, on = false;
  let cx = 0, cy = 0;
  const VH = 240;
  const titleOf = (row) => {
    const t = row.querySelector('.work-title');
    return t ? t.textContent : '';
  };
  const place = () => placeWithOrigin(el, cx, cy, VW, VH, PAD, GAP);
  const cancelH = () => { if (hideT) { clearTimeout(hideT); hideT = 0; } };
  const schedH = () => { cancelH(); hideT = setTimeout(hide, HIDE); };
  const hide = () => {
    if (!on) return;
    on = false; cur = '';
    fol.idle();
    el.classList.remove('on');
  };
  const showRow = (row, x, y) => {
    const src = row.dataset.card;
    if (!src) return;
    cx = x; cy = y;
    const p = place();
    if (src === cur && on) { fol.aim(p.x, p.y); return; }
    if (img.getAttribute('src') !== src) img.src = src;
    img.alt = titleOf(row);
    cancelH();
    if (!on) {
      cur = src; on = true;
      fol.snap(p.x, p.y);
      el.classList.add('on');
      requestAnimationFrame(() => fol.pop());
    } else {
      cur = src;
      fol.aim(p.x, p.y);
    }
  };
  const onEnter = (e) => showRow(e.currentTarget, e.clientX, e.clientY);
  let moveTick = false;
  const onMove = (e) => {
    if (!on) return;
    cx = e.clientX;
    cy = e.clientY;
    if (moveTick) return;
    moveTick = true;
    requestAnimationFrame(() => {
      moveTick = false;
      if (!on) return;
      const p = place();
      fol.aim(p.x, p.y);
    });
  };
  const onLeave = () => schedH();
  rows.forEach((r) => {
    r.addEventListener('mouseenter', onEnter);
    r.addEventListener('mousemove', onMove, { passive: true });
    r.addEventListener('mouseleave', onLeave);
  });
  const first = rows[0] && rows[0].dataset.card;
  if (first && !img.getAttribute('src')) img.src = first;
  return () => {
    cancelH(); fol.stop();
    rows.forEach((r) => {
      r.removeEventListener('mouseenter', onEnter);
      r.removeEventListener('mousemove', onMove);
      r.removeEventListener('mouseleave', onLeave);
    });
    el.remove();
  };
}
