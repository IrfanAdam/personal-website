/* ADAM/DS — Patterns composer · accessibility · migration.
   Contrast matrix is live in BOTH themes (probed, not claimed). */
// Exports: title, render, mount — stitches layouts + quality sections
import { renderLayouts } from './patterns-layouts.js';
import { renderQuality } from './patterns-quality.js';
import { a11yRows } from './patterns-data.js';

export const title = 'Patterns';
export function render() {
  return [renderLayouts(), renderQuality()].join('');
}
export function mount(root) {
  const body = root.querySelector('#a11yBody');
  const obs = new MutationObserver(() => refresh());
  /* Probing flips [data-theme] — disconnect first or the observer re-fires forever. */
  const refresh = () => { obs.disconnect(); if (body) body.innerHTML = a11yRows(); obs.observe(document.documentElement,
      { attributes: true, attributeFilter: ['data-theme'] }); };
  const mm = matchMedia('(prefers-color-scheme: dark)');
  const onSys = () => refresh();
  const onDemo = (e) => { const b = e.target.closest('[data-focus-demo]');
    if (!b) return;
    const t = root
      .querySelector(b.dataset.focusDemo);
    if (t) t
      .focus({ preventScroll: true });
  };
  refresh();
  if (mm.addEventListener) mm.addEventListener('change', onSys);
  root.addEventListener('click', onDemo);
  return () => { obs.disconnect(); if (mm.removeEventListener) mm.removeEventListener('change',
      onSys); root.removeEventListener('click',
      onDemo); };
}
