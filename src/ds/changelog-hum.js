/* ADAM/DS — ds/changelog-hum · hum hotspot · [plan:2026-09-22_141500-housekeeping-refactor.md#{#phase-2}] */
// Exports: bindHum
import { playVoice } from '../views/element-sound.js';
import { untilGlitch } from '../views/glitch-sound/timing.js';

const TODAY_SEL = '.ds-day.is-today';
const NEAR_R = 260;
const NEAR_FLOOR = 1500;
const isReduced = () => {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch { return false; }
};

export function bindHum(root) {
  let lastNear = 0, pending = 0, px = 0, py = 0;
  const fire = () => {
    pending = 0;
    const el = root.querySelector(TODAY_SEL);
    if (!el) return;
    const b = el.getBoundingClientRect();
    const ox = Math.max(b.left - px, 0, px - b.right);
    const oy = Math.max(b.top - py, 0, py - b.bottom);
    const inside = Math.hypot(ox, oy) === 0;
    const gain = inside ? 0.55 : 0.06 + 0.2 * (1 - Math.hypot(ox, oy) / NEAR_R);
    try { playVoice('hum', { ms: inside ? 320 : 480, gain }); } catch {}
  };
  const humNear = (e) => {
    if (isReduced() || pending) return;
    const t = root.querySelector(TODAY_SEL);
    if (!t) return;
    const r = t.getBoundingClientRect();
    const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
    const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
    if (Math.hypot(dx, dy) >= NEAR_R) return;
    const now = Date.now();
    if (now - lastNear < NEAR_FLOOR) return;
    lastNear = now;
    px = e.clientX;
    py = e.clientY;
    const wait = untilGlitch(t);
    if (wait > 24 && wait < 3000) pending = setTimeout(fire, wait);
    else fire();
  };
  root.addEventListener('pointermove', humNear);
  return () => {
    if (pending) clearTimeout(pending);
    root.removeEventListener('pointermove', humNear);
  };
}
