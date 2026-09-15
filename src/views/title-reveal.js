/* ADAM/FX — Title reveal · page-title entrance: 200ms decoder scramble
   synced with the load-slot sound (loading.* when kind=file). First visit
   per page per session only — a route you already opened renders instantly.
   Anti-stutter: height locked to final, line lengths never change (word mode
   or per-line spans + tweenLength:false), reduced-motion passes through. */
// Exports: mountTitleReveal(root, opts) — returns a cleanup
import { scrambleText } from './scramble-text.js';
import { playSlot } from './slot-sound.js';

// — Tuning —
const SEL = '.hero h1, .case-copy h1';
const DUR = 0.2;          // seconds — total scramble, deliberately fast
const LINE_STAGGER = 0.03; // seconds per extra headline line
const GAIN = 0.5;
const SEEN_KEY = 'adam-title-seen';
const seen = new Set();
const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch { return false;
  } };

// — First visit gate —
function isFirstVisit() {
  const key = `${SEEN_KEY}:${location.hash || '#/'}`;
  if (seen.has(key)) return false;
  seen.add(key);
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
  } catch {}
  return true;
}

// — Scramble —
function lock(el) { try { const h = el.offsetHeight; if (h > 0) el.style.minHeight = h + 'px'; } catch {} }
function unlock(el) { try { el.style.minHeight = ''; } catch {} }
const dead = () => ({ kill() {}, promise: Promise.resolve() });
function reveal(el, idx) {
  const lines = [...el.children];
  if (lines.length) {
    const hs = lines.map((ln) => {
      try {
        const multi = /\s/.test(ln.textContent || '');
        return scrambleText(ln, { chars: 'upperAndLowerCase',
          duration: DUR,
          speed: 1,
          delimiter: multi ? ' ' : '',
          revealDelay: idx * LINE_STAGGER + LINE_STAGGER * lines.indexOf(ln),
          tweenLength: false });
      } catch { return dead(); }
    });
    return { done: Promise.all(hs.map((h) => h.promise)),
      kill() { hs.forEach((h) => { try { h.kill(); } catch {} }); } };
  }
  try { return scrambleText(el, { chars: 'upperAndLowerCase',
    duration: DUR, speed: 1, delimiter: ' ', tweenLength: false }); }
  catch { return dead(); }
}

// — Mount —
export function mountTitleReveal(root, opts) {   // [plan:2026-09-13_193000-refactor-manageability.md#phase-3]
  const o = opts || {};
  const els = [...(root || document).querySelectorAll(SEL)];
  if (!els.length || reduced() || !isFirstVisit()) return () => {};
  const offs = [];
  els.forEach((el, i) => {
    lock(el);
    const r = reveal(el, i);
    let released = false;
    const free = () => { if (!released) { released = true; unlock(el); } };
    try { Promise.resolve(r.done || r.promise).then(free).catch(free); } catch { free(); }
    setTimeout(free, 900);
    offs.push(() => { try { r.kill && r.kill(); } catch {} free(); });
  });
  if (o.sound !== false) { try { playSlot('load', GAIN, { gap: 400 }); } catch {} }
  return () => offs.forEach((fn) => { try { fn(); } catch {} });
}
