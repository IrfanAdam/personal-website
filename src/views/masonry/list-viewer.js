/* ADAM/PAGE — views/masonry/list-viewer · rows ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-17] */
// Exports: attachListViewer — single popover, grid follow + throttled swaps
import { fxNum, fxMs } from '../fx-tokens.js';
import { makeStripEl, placeWithOrigin, createListFollower } from '../strip-viewer-helpers.js';
export function attachListViewer(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (matchMedia('(hover: none)').matches) return () => {};
  const rows = [...grid.querySelectorAll('.work[data-card]')];
  if (!rows.length) return () => {};
  rows.forEach((r) => {
    const s = r.dataset.card; if (!s) return;
    const im = new Image(); im.decoding = 'async'; im.src = s;
    if (im.decode) im.decode().catch(() => {});
  });
  const VW = fxNum('--size-viewer-w', 180), GAP = fxNum('--space-8', 8) * 0.1, PAD = fxNum('--space-12', 12);
  const HIDE = fxMs('--fx-viewer-debounce', 70), VH = 240;
  const el = makeStripEl(), img = el.querySelector('img'), fol = createListFollower(el);
  img.decoding = 'async';
  let cur = '', hideT = 0, swapRaf = 0, on = false, cx = 0, cy = 0, pending = '', pendingAlt = '';
  const titleOf = (row) => (row.querySelector('.work-title') || {}).textContent || '';
  const place = () => placeWithOrigin(el, cx, cy, VW, VH, PAD, GAP);
  const cancelH = () => { if (hideT) { clearTimeout(hideT); hideT = 0; } };
  const schedH = () => { cancelH(); hideT = setTimeout(hide, HIDE); };
  const hide = () => {
    if (!on) return; on = false; cur = '';
    if (swapRaf) { cancelAnimationFrame(swapRaf); swapRaf = 0; pending = ''; }
    fol.idle(); el.classList.remove('on');
  };
  const flushSwap = () => {
    swapRaf = 0; if (!pending || pending === cur) { pending = ''; return; }
    cur = pending; pending = '';
    if (img.getAttribute('src') !== cur) { img.src = cur; if (img.decode) img.decode().catch(() => {}); }
    img.alt = pendingAlt;
  };
  const scheduleSwap = (src, alt) => {
    if (src === cur) return; pending = src; pendingAlt = alt;
    if (!swapRaf) swapRaf = requestAnimationFrame(flushSwap);
  };
  const showRow = (row, x, y) => {
    const src = row.dataset.card; if (!src) return;
    cx = x; cy = y; const p = place();
    if (!on) {
      cancelH(); cur = src; pending = ''; img.src = src; img.alt = titleOf(row);
      if (img.decode) img.decode().catch(() => {}); on = true;
      fol.snap(p.x, p.y); el.classList.add('on'); requestAnimationFrame(() => fol.pop()); return;
    }
    cancelH(); scheduleSwap(src, titleOf(row)); fol.aim(p.x, p.y);
  };
  const onEnter = (e) => showRow(e.currentTarget, e.clientX, e.clientY);
  const onLeave = () => schedH();
  const onGridMove = (e) => { if (!on) return; cx = e.clientX; cy = e.clientY; const p = place(); fol.aim(p.x, p.y); };
  rows.forEach((r) => { r.addEventListener('mouseenter', onEnter); r.addEventListener('mouseleave', onLeave); });
  grid.addEventListener('mousemove', onGridMove, { passive: true });
  grid.addEventListener('mouseleave', schedH);
  const first = rows[0] && rows[0].dataset.card;
  if (first && !img.getAttribute('src')) { img.src = first; cur = first; }
  return () => {
    cancelH(); if (swapRaf) cancelAnimationFrame(swapRaf); fol.stop();
    grid.removeEventListener('mousemove', onGridMove); grid.removeEventListener('mouseleave', schedH);
    rows.forEach((r) => {
      r.removeEventListener('mouseenter', onEnter);
      r.removeEventListener('mouseleave', onLeave);
    });
    el.remove();
  };
}
