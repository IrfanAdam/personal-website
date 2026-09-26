/* ADAM/PAGE — parallax · attach + measure · [plan:2026-09-21_125642-lump-sum-builds.md#phase-8] */
// Exports: attachParallax — chase in parallax-chase, math in calc/measure
import { syncBounds as calcBounds, progress as calcProgress } from './parallax-calc.js';
import { measureDeficits, gateOnImages } from './parallax-measure.js';
import { makeChase } from './parallax-chase.js';

// — Analytic deficits —
// Cards reserve height via aspect-ratio, so column fills derive from layout
// data alone — correct on frame one, immune to image load timing.
function hintPx(hint, colW) {
  if (!hint || !hint.heights || !hint.buckets || !(colW > 0)) return null;
  const totals = hint.buckets.map((b) => b.reduce((a, i) => a + (hint.heights[i] || 0), 0));
  const tallest = Math.max(...totals, 0);
  if (!(tallest > 0)) return null;
  return totals.map((t) => Math.max(0, tallest - t) * colW);
}

export function attachParallax(grid, hint) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  if (window.innerWidth <= 640) return () => {};
  const cols = [...grid.querySelectorAll('.col')];
  if (cols.length < 2) return () => {};
  let deficits = [];
  let maxScroll = 1;
  let gridStart = 0;
  let idleT = 0;
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
      grid.classList.remove('is-scrolling');
      chase.reset();
      return;
    }
    syncBounds();
    const approx = hintPx(hint, cols[0].getBoundingClientRect().width);
    deficits = approx || measureDeficits(cols);
    cols.forEach((c, i) => { c.dataset.deficit = String(Math.round(deficits[i] || 0)); });
    chase.snapAtTop(gridStart);
    kick();
  }
  const refine = () => {
    if (window.innerWidth <= 640) return;
    syncBounds();
    deficits = measureDeficits(cols);
    kick();
  };
  let measureRaf = 0;
  const onResize = () => {
    if (measureRaf) return;
    measureRaf = requestAnimationFrame(() => {
      measureRaf = 0;
      refine();
    });
  };
  const onScroll = () => {
    grid.classList.add('is-scrolling');
    clearTimeout(idleT);
    idleT = setTimeout(() => grid.classList.remove('is-scrolling'), 320);
    kick();
  };
  gateOnImages(grid, refine);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refine).catch(() => {});
  syncBounds();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  const ro = new ResizeObserver(onResize);
  ro.observe(grid);
  requestAnimationFrame(measure);
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    ro.disconnect();
    clearTimeout(idleT);
    if (measureRaf) cancelAnimationFrame(measureRaf);
    chase.reset();
    grid.classList.remove('is-scrolling');
    cols.forEach((c) => { c.style.transform = ''; c.removeAttribute('data-deficit'); });
  };
}
