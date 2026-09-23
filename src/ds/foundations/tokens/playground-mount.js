/* ADAM/DS — tokens playground mount · [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-2] */
// Exports: mountPlayground — input + reset/export + persist
import { TOKS, KEY, hexOf, load, save } from './playground-data.js';
export function mountPlayground(root) {
  const box = root.querySelector('[data-playground]');
  if (!box) return () => {};
  const msg = box.querySelector('[data-pg-msg]');
  const syncOut = (tok, val) => {
    const o = box.querySelector(`[data-out="${tok}"]`);
    if (o) o.textContent = val;
  };
  const onInput = (e) => {
    const inp = e.target.closest('[data-token]');
    if (!inp) return;
    const k = inp.dataset.token;
    const v = inp.type === 'color' ? inp.value : inp.value + (TOKS.find((x) => x.k === k)?.unit || '');
    document.documentElement.style.setProperty(k, v);
    const m = load(); m[k] = v; save(m);
    syncOut(k, v);
    if (msg) {
      msg.textContent = `${k} → ${v}`;
      setTimeout(() => { if (msg.textContent.startsWith(k)) msg.textContent = ''; }, 1200);
    }
  };
  const onClick = async (e) => {
    const b = e.target.closest('[data-pg]');
    if (!b) return;
    if (b.dataset.pg === 'reset') {
      const m = load();
      Object.keys(m).forEach((k) => document.documentElement.style.removeProperty(k));
      localStorage.removeItem(KEY);
      if (msg) msg.textContent = 'reset — reload to see defaults';
      TOKS.forEach((t) => {
        const inp = box.querySelector(`[data-token="${t.k}"]`);
        if (!inp) return;
        const live = getComputedStyle(document.documentElement).getPropertyValue(t.k).trim();
        if (t.type === 'color') inp.value = hexOf(live);
        else { inp.value = parseFloat(live) || inp.value; syncOut(t.k, live); }
      });
    }
    if (b.dataset.pg === 'export') {
      const m = load();
      const lines = Object.entries(m).map(([k, v]) => `${k}: ${v};`).join('\n');
      const txt = lines || '/* no overrides — tweak a token first */';
      try { await navigator.clipboard.writeText(txt); if (msg) msg.textContent = 'export copied'; }
      catch { if (msg) msg.textContent = txt; }
    }
  };
  TOKS.forEach((t) => {
    if (t.type !== 'color') {
      const inp = box.querySelector(`[data-token="${t.k}"]`);
      const live = getComputedStyle(document.documentElement).getPropertyValue(t.k).trim();
      if (inp && live) {
        const n = parseFloat(live);
        if (!Number.isNaN(n)) inp.value = String(n);
        syncOut(t.k, live);
      }
    }
  });
  box.addEventListener('input', onInput);
  box.addEventListener('click', onClick);
  return () => { box.removeEventListener('input', onInput); box.removeEventListener('click', onClick); };
}
