/* ADAM/FX — views/strip-sound · header icon press snap · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
// Exports: initStripSound — one delegated listener on the header strip;
// a click on a strip icon or the list/grid switch plays the 'click' slot.
import { playSlot } from './slot-sound.js';

// — Tuning —
const SEL = 'a, .vtab';   // project/contact icons + list/grid buttons
const GAIN = 0.45;
const GAP_MS = 80;        // rapid repeat clicks still speak

// — Binding —
export function initStripSound() {   // [plan:2026-09-13_193000-refactor-manageability.md#phase-3]
  const strip = document.getElementById('stripbar');
  if (!strip) return () => {};
  const onClick = (e) => {
    const hit = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (!hit) return;
    try { playSlot('click', GAIN, { gap: GAP_MS }); } catch {}
  };
  strip.addEventListener('click', onClick);
  return () => strip.removeEventListener('click', onClick);
}
