/* ADAM/DS — ds/playground/mount · mount · [plan:2026-09-24_160000-primitives-complete.md#phase-2] */
// Exports: mountPlayground — binds playground knobs + live code
// — Mount —

import { copy } from '../specimens.js';

// — Mount —
const reg = (window.__pgReg = window.__pgReg || {});

export function mountPlayground(root) {
  const offs = [];
  root.querySelectorAll('[data-pg-root]').forEach((sec) => {
    const id = sec.getAttribute('data-pg-root');
    const cfg = reg[id];
    if (!cfg) return;
    const preview = sec.querySelector(`[data-pg-preview="${id}"]`);
    const codeEl = sec.querySelector(`[data-pg-code="${id}"] pre`);
    const ctrls = sec.querySelector(`[data-pg-ctrl="${id}"]`);
    if (!preview || !ctrls) return;
    const outs = {};
    ctrls.querySelectorAll('[data-v]').forEach((o) => outs[o.dataset.v] = o);
    const state = Object.fromEntries(cfg.knobs.map((k) => [k.key, k.default]));
    const refresh = () => {
      preview.innerHTML = cfg.render(state);
      Object.entries(state).forEach(([k, v]) => {
        if (k.startsWith('--') && preview.firstElementChild) {
          preview.firstElementChild.style.setProperty(k, String(v));
        }
      });
      if (codeEl) codeEl.textContent = cfg.code(state);
      Object.entries(outs).forEach(([k, el]) => {
        const kn = cfg.knobs.find((x) => x.key === k);
        const v = state[k];
        el.textContent = typeof v === 'boolean' ? (v ? 'on' : 'off') : String(v) + (kn && kn.unit || '');
      });
    };
    const onInput = (e) => {
      const k = e.target.dataset.k;
      if (!k || e.target.dataset.pg !== id) return;
      const kn = cfg.knobs.find((x) => x.key === k);
      let v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      if (kn && kn.type === 'range') v = Number(v);
      state[k] = v;
      refresh();
    };
    const btn = sec.querySelector(`[data-pg-copy="${id}"]`);
    const onCopy = () => copy(cfg.code(state), btn);
    ctrls.addEventListener('input', onInput);
    ctrls.addEventListener('change', onInput);
    if (btn) btn.addEventListener('click', onCopy);
    offs.push(() => {
      ctrls.removeEventListener('input', onInput);
      ctrls.removeEventListener('change', onInput);
      if (btn) btn.removeEventListener('click', onCopy);
    });
  });
  return () => offs.forEach((fn) => fn());
}
