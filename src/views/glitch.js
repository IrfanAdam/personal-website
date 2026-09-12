/* ADAM/FX — Glitch · generic container function. Any element, no assumptions.
   Token-driven (var(--dur-glitch) + --fx-glitch-*), reduced-motion safe, zero deps.
   CSS provides the animation; this module is the ergonomic JS wrapper.

   Usage — CSS only:
     <div class="fx-glitch">glitches forever</div>
     <div class="fx-glitch--hover">glitches on hover</div>
     <div class="fx-glitch--once">one burst</div>

   Usage — JS (any container):
     import { attachGlitch, detachGlitch, glitchOnce } from '../views/glitch.js'
     const stop = attachGlitch(el)                 // infinite
     const stop2 = attachGlitch(el, { trigger: 'hover' })
     glitchOnce(el)                                // single burst
     detachGlitch(el)                              // remove

   Data-attr auto-init (optional):
     <div data-glitch> or <div data-glitch="hover"> or <div data-glitch="once">
     call initGlitch(root) once after mount.

   Tokens (tokens.css): --dur-glitch (2.4s) · --fx-glitch-x (--space-1)
                        --fx-glitch-skew (-12deg) · --fx-glitch-opacity (0.5)
*/
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

/** Auto-init any [data-glitch] descendants. Returns cleanup. */
export function initGlitch(root = document) {
  if (!root || !root.querySelectorAll) return () => {};
  const nodes = [...root.querySelectorAll('[data-glitch]')];
  const stops = nodes.map((el) => {
    const v = (el.getAttribute('data-glitch') || 'auto').trim().toLowerCase();
    const trigger = v === '' ? 'auto' : v === 'hover' ? 'hover' : v === 'once' ? 'once' : 'auto';
    return attachGlitch(el, { trigger });
  });
  return () => stops.forEach((fn) => { try { fn(); } catch {} });
}
