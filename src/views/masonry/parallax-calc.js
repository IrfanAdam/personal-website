/* ADAM/PAGE — parallax-calc · bounds + progress · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: syncBounds, progress — pure scroll math, no DOM writes
// Gate: parallax stays 0 until grid top reaches header edge.

// — Bounds —
export function syncBounds(grid) {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const topEl = document.querySelector('.top');
  const hdr = topEl ? topEl.offsetHeight : 0;
  const rectTop = grid.getBoundingClientRect().top + window.scrollY;
  const gridStart = Math.max(0, rectTop - hdr);
  return { maxScroll, gridStart };
}

// — Progress 0..1 —
export function progress(maxScroll, gridStart) {
  if (maxScroll <= 40) return 0;
  const range = maxScroll - gridStart;
  if (range <= 40) return 0;
  return Math.min(1, Math.max(0, (window.scrollY - gridStart) / range));
}
