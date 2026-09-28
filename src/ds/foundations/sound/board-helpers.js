/* ADAM/DS — ds/foundations/sound/board-helpers · listener helpers ·
   [plan:2026-09-28_130000-code-cleanup-perf.md#phase-1] */
// Exports: makeOn, syncOut

// — Helpers —
export const makeOn = (offs) => (el, ev, fn) => {
  if (!el) return;
  el.addEventListener(ev, fn);
  offs.push(() => el.removeEventListener(ev, fn));
};
export const syncOut = (e) => {
  const inp = e.target.closest('input[data-snd]');
  if (!inp) return;
  const k = inp.getAttribute('data-snd');
  const out = inp.parentElement && inp.parentElement.querySelector('[data-snd-v]');
  if (!out) return;
  const v = inp.value;
  if (k === 'gain' || k === 'master' || k === 'fgain') out.textContent = v + '%';
  else if (k === 'ms') out.textContent = v + 'ms';
  else if (k === 'freq') out.textContent = v + 'Hz';
};
