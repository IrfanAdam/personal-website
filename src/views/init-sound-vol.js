/* ADAM/FX — init-sound-vol · volume slider helper · gated by audio-ctx */
import { getVolume } from './audio-ctx.js';
export const volHTML = (v) => `<input type="range" min="0" max="1" step="0.05" value="${v}"`
  + ` data-volume-slider aria-label="volume ${Math.round(v * 100)}%"`
  + ` style="width:72px;accent-color:var(--accent)">`;
export function syncVolume() {
  const v = getVolume();
  document.querySelectorAll('[data-volume-slider]').forEach((s) => {
    if (String(s.value) !== String(v)) s.value = String(v);
    s.setAttribute('aria-label', `volume ${Math.round(v * 100)}%`);
  });
}
