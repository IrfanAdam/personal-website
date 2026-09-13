/* ADAM/PAGE — parallax · attach + measure · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: attachParallax — chase in parallax-chase, math in calc/measure
import { syncBounds as calcBounds, progress as calcProgress } from './parallax-calc.js';
import { measureDeficits, gateOnImages } from './parallax-measure.js';
import { makeChase } from './parallax-chase.js';

export function attachParallax(grid) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.innerWidth <= 640) return () => {};
  const cols = [...grid.querySelectorAll('.col')];
  if (cols.length < 2) return () => {};
  let deficits = [];
  let maxScroll = 1;
  let gridStart = 0;
  const syncBounds = () => {
    const b = calcBounds(grid);
    maxScroll = b.maxScroll;
    gridStart = b.gridStart;
  };
  const progress = () => calcProgress(maxScroll, gridStart);
  const chase = makeChase(cols, () => deficits, progress);
  const kick = () => chase.kick();
  function measure() {
    if (window.innerWidth <= 640) {
      cols.forEach((c) => { c.style.transform = 'translate3d(0,0,0)'; });
      chase.reset();
      return;
    }
    syncBounds();
    deficits = measureDeficits(cols);
    cols.forEach((c, i) => (c.dataset.deficit = String(Math.round(deficits[i]))));
    chase.snapAtTop(gridStart);
    kick();
  }
  let measureRaf = 0;
  const onResize = () => {
    if (measureRaf) return;
    measureRaf = requestAnimationFrame(() => {
      measureRaf = 0;
      measure();
    });
  };
  gateOnImages(grid, measure);
  syncBounds();
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', onResize);
  const ro = new ResizeObserver(onResize);
  ro.observe(grid);
  requestAnimationFrame(measure);
  return () => {
    window.removeEventListener('scroll', kick);
    window.removeEventListener('resize', onResize);
    ro.disconnect();
    if (measureRaf) cancelAnimationFrame(measureRaf);
    chase.reset();
    cols.forEach((c) => { c.style.transform = ''; c.removeAttribute('data-deficit'); });
  };
}
