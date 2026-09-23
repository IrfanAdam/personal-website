/* ADAM/DS — Patterns composer · [plan:2026-09-23_145600-ds-elements-tabs.md#phase-1] */
// Exports: title, render, mount — hero + vertical section tabs
import { tabs } from './tabs.js';
import { layoutsHero, masonryHtml, viewerHtml, caseHtml } from './patterns-layouts.js';
import { a11yHtml, migrationHtml } from './patterns-quality.js';
import { a11yRows } from './patterns-data.js';

export const title = 'Patterns';
export function render() {
  const panes = [
    { label: 'Masonry', html: masonryHtml() },
    { label: 'Viewer', html: viewerHtml() },
    { label: 'Case 50/50', html: caseHtml() },
    { label: 'Accessibility', html: a11yHtml() },
    { label: 'Migration', html: migrationHtml() },
  ];
  return layoutsHero() + tabs({ vertical: true, panes });
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
