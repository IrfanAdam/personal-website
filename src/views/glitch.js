/* ADAM/FX — glitch · generic container fn · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: attachGlitch, detachGlitch, glitchOnce, pauseGlitch, resumeGlitch
// Auto-init lives in glitch-init.js — import from there, not here.
export { initGlitch } from './glitch-init.js';
const REDUCED = () => {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

function normalizeDuration(v) {
  if (v == null) return null;
  if (typeof v === 'number') return `${v}ms`;
  return String(v);
}

/** Attach glitch to any container. Returns cleanup. */
export function attachGlitch(el, opts = {}) {
  if (!el || !(el instanceof Element)) return () => {};
  if (REDUCED()) return () => {};
  const { trigger = 'auto', duration = null } = opts;
  const dur = normalizeDuration(duration);
  if (dur) el.style.setProperty('--dur-glitch', dur);
  el.classList.remove('fx-glitch', 'fx-glitch--once', 'fx-glitch--hover');
  // force reflow if toggling
  void el.offsetWidth;
  if (trigger === 'hover') el.classList.add('fx-glitch--hover');
  else if (trigger === 'once') el.classList.add('fx-glitch--once');
  else el.classList.add('fx-glitch');
  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    detachGlitch(el, { keepDuration: false });
  };
}

/** Remove glitch from element. */
export function detachGlitch(el, { keepDuration = false } = {}) {
  if (!el || !(el instanceof Element)) return;
  el.classList.remove('fx-glitch', 'fx-glitch--once', 'fx-glitch--hover');
  if (!keepDuration) el.style.removeProperty('--dur-glitch');
}

/** One-shot glitch — fires once, then cleans. */
export function glitchOnce(el, duration = null) {
  if (!el || !(el instanceof Element)) return () => {};
  if (REDUCED()) return () => {};
  const dur = normalizeDuration(duration);
  if (dur) el.style.setProperty('--dur-glitch', dur);
  el.classList.remove('fx-glitch', 'fx-glitch--hover');
  el.classList.remove('fx-glitch--once');
  void el.offsetWidth;
  el.classList.add('fx-glitch--once');
  const ms = (() => {
    const raw = dur || getComputedStyle(el).getPropertyValue('--dur-glitch') || '2.4s';
    const s = raw.trim();
    if (s.endsWith('ms')) return parseFloat(s) || 2400;
    if (s.endsWith('s')) return (parseFloat(s) || 2.4) * 1000;
    return 2400;
  })();
  const t = setTimeout(() => {
    el.classList.remove('fx-glitch--once');
    if (dur) el.style.removeProperty('--dur-glitch');
  }, ms);
  return () => {
    clearTimeout(t);
    el.classList.remove('fx-glitch--once');
    if (dur) el.style.removeProperty('--dur-glitch');
  };
}

/** Pause / resume (keeps class, toggles play-state). */
export function pauseGlitch(el) {
  if (!el) return;
  el.classList.add('fx-glitch--paused');
}
export function resumeGlitch(el) {
  if (!el) return;
  el.classList.remove('fx-glitch--paused');
}
