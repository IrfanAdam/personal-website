/* ADAM/PAGE — views/map/sound · one soft tick per hover change (site sound only)
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import { playVoice } from '../element-sound.js';
// Exports: makeHoverTick
const FLOOR = 140;
const MS = 60;
const GAIN = 0.16;
const reduced = () => {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return true; }
};
const optedIn = () => {
  try { return localStorage.getItem('adam-sound') === 'on' && !reduced(); } catch { return false; }
};
const keyOf = (t) => {
  if (!t) return '';
  return t.id || `${t.from}>${t.to}`;
};
export function makeHoverTick() {
  let at = 0;
  let key = '';
  return (target) => {
    const next = keyOf(target);
    if (!next || next === key) return;
    key = next;
    const now = Date.now();
    if (now - at < FLOOR) return;
    at = now;
    if (!optedIn()) return;
    try { playVoice('tick', { ms: MS, gain: GAIN }); } catch {}
  };
}
