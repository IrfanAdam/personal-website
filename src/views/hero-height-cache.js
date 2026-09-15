/* ADAM/PAGE — views/hero-height-cache · per-tab memo · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
// Exports: hasHeroSeen, markHeroSeen, heroKey — session seen + height
const BK = 'adam-hero-seen';
const HK = 'adam-hero-h';
const seen = new Set();
try {
  const raw = sessionStorage.getItem(BK);
  if (raw) JSON.parse(raw).forEach((k) => seen.add(k));
} catch {}
function persist() {
  try {
    sessionStorage.setItem(BK, JSON.stringify([...seen]));
  } catch {}
}
export function heroKey() {
  return `${location.hash || '#/'}`;
}
export function hasHeroSeen(k) {
  const key = k || heroKey();
  if (seen.has(key)) return true;
  try {
    if (sessionStorage.getItem(`${BK}:${key}`)) return true;
  } catch {}
  return false;
}
export function markHeroSeen(k, h) {
  const key = k || heroKey();
  seen.add(key);
  persist();
  try {
    sessionStorage.setItem(`${BK}:${key}`, '1');
    if (Number.isFinite(h)) sessionStorage.setItem(`${HK}:${key}`, String(Math.round(h)));
  } catch {}
}
export function getCachedH(k) {
  const key = k || heroKey();
  try {
    const v = sessionStorage.getItem(`${HK}:${key}`);
    return v ? parseFloat(v) : 0;
  } catch { return 0; }
}
