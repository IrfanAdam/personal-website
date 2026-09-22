/* ADAM/PAGE — views/promo-video-format · helpers · [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-2}] */
// Exports: fmt, nudgeFrame
export function fmt(s) {
  if (!Number.isFinite(s) || s <= 0) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export const nudgeFrame = (el) => { try { el.currentTime = 0.15; } catch {} };
