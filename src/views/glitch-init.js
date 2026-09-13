/* ADAM/FX — glitch-init · data-attr auto-init · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: initGlitch(root) — binds [data-glitch] descendants
import { attachGlitch } from './glitch.js';

// — Bind —
export function initGlitch(root = document) {
  if (!root || !root.querySelectorAll) return () => {};
  const nodes = [...root.querySelectorAll('[data-glitch]')];
  const stops = nodes.map((el) => {
    const v = (el.getAttribute('data-glitch') || 'auto').trim().toLowerCase();
    let trigger = 'auto';
    if (v === 'hover') trigger = 'hover';
    else if (v === 'once') trigger = 'once';
    return attachGlitch(el, { trigger });
  });
  return () => stops.forEach((fn) => { try { fn(); } catch {} });
}
