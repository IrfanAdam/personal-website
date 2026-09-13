/* ADAM/FX — Title reveal · default page-title entrance: decoder scramble
   synced with the load-slot sound (loading.* when kind=file).
   Anti-stutter: height locked to final, line lengths never change (word mode
   or per-line spans + tweenLength:false), reduced-motion passes through. */
import { scrambleText } from './scramble-text.js';
import { playSlot } from './slot-sound.js';
const SEL = '.hero h1, .case-copy h1';
const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch { return false;
  } };
function lock(el) { try { const h = el.offsetHeight; if (h > 0) el.style.minHeight = h + 'px'; } catch {} }
function unlock(el) { try { el.style.minHeight = ''; } catch {} }
function reveal(el, idx) {
  const lines = [...el.children];
  if (lines.length) {
    const hs = lines.map((ln) => {
      try {
        const multi = /\s/.test(ln.textContent || '');
        return scrambleText(ln,
          { chars: 'upperAndLowerCase',
            duration: 0.7,
            speed: 1,
            delimiter: multi ? ' ' : '',
            revealDelay: idx * 0.05 + 0.09 * lines.indexOf(ln),
            tweenLength: false });
      } catch { return { kill() {}, promise: Promise.resolve() }; }
    });
    return { done: Promise.all(hs.map((h) => h.promise)),
      kill() { hs.forEach((h) => { try { h.kill(); } catch {} }); } };
  }
  try { return scrambleText(el,
      { chars: 'upperAndLowerCase', duration: 0.9, speed: 1, delimiter: ' ', tweenLength: false }); }
  catch { return { kill() {}, promise: Promise.resolve() }; }
}
export function mountTitleReveal(root, opts) {
  const o = opts || {};
  const els = [...(root || document).querySelectorAll(SEL)];
  if (!els.length || reduced()) return () => {};
  const offs = [];
  els.forEach((el, i) => {
    lock(el);
    const r = reveal(el, i);
    let released = false;
    const free = () => { if (!released) { released = true; unlock(el); } };
    try { Promise.resolve(r.done || r.promise).then(free).catch(free); } catch { free(); }
    setTimeout(free, 2400);
    offs.push(() => { try { r.kill && r.kill(); } catch {} free(); });
  });
  if (o.sound !== false) { try { playSlot('load', 0.5); } catch {} }
  return () => offs.forEach((fn) => { try { fn(); } catch {} });
}
