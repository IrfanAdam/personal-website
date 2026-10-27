/* ADAM/PAGE — views/promo-video-poster · poster · [plan:2026-10-26_000000-lump-sum-builds.md#{#phase-2}] */
// Exports: ensurePoster(v)
// — Poster —
export function ensurePoster(v) {
  if (v.getAttribute('poster')) return;
  if (v.readyState < 2) return;
  if (isCrossOriginSrc(v)) return;
  try {
    const c = document.createElement('canvas');
    c.width = v.videoWidth || 1280;
    c.height = v.videoHeight || 720;
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
    v.setAttribute('poster', c.toDataURL('image/jpeg', 0.82));
  } catch {}
}
// — Guard —
function isCrossOriginSrc(v) {
  try {
    const src = v.currentSrc || v.src || '';
    return new URL(src, location.href).origin !== location.origin;
  } catch { return false; }
}
