/* ADAM/FX — Title reveal gate · first-visit + reduced · [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-2}] */
// Exports: isFirstVisit, isReduced

const SEEN_KEY = 'adam-title-seen';
const seen = new Set();

export function isFirstVisit() {
  const key = `${SEEN_KEY}:${location.hash || '#/'}`;
  if (seen.has(key)) return false;
  seen.add(key);
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
  } catch {}
  return true;
}

export const isReduced = () => {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch { return false; }
};
