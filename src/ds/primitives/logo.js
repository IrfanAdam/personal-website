/* ADAM/DS — primitives/logo.js · Brand mark primitive · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: logoSheet — Brand mark primitive sheet
// — Tokens · Render · Code · Knobs · Docs —

import { component } from '../component.js';

function logoRender(s) {
  const note = s.case === 'lower' ? 'irfan — lower?' : 'Irfan — as authored';
  const mark = '<span class="logo">Irfan<small>Adam M</small></span>';
  const meta = `<span style="font-family:var(--font-mono);font-size:var(--text-meta);`
    + `color:var(--color-ink-muted);margin-left:var(--space-14)">${note}</span>`;
  const inner = `${mark}${meta}`;
  if (s.onDark) {
    return `<div data-theme="dark" style="background:var(--color-bg);padding:var(--space-16);`
      + `border:var(--border-hairline)">${inner}</div>`;
  }
  return `<div>${inner}</div>`;
}

function logoCode() {
  return '<span class="logo">Irfan<small>Adam M</small></span>';
}

const logoKnobs = [
  {
    key: 'case',
    label: 'case',
    type: 'select',
    default: 'default',
    options: [
      { value: 'default', label: 'as authored' },
      { value: 'lower', label: 'lower (probe)' },
    ],
  },
  { key: 'onDark', label: 'on dark', type: 'boolean', default: false },
];

const logoTokens = [
  '--font-sans',
  '--weight-bold',
  '--tracking-display',
  '--leading-display',
  '--text-logo',
];

const logoAnat = '<span class="tok">.logo</span> — 700 weight, <span class="tok">--tracking-display</span>, '
  + '<span class="tok">--text-logo</span>. As authored; no variants ship.';
const logoBehav = 'Static wordmark; no focus. Dark: ink brightens via probe. '
  + 'Lowercase probe is docs-only — never ship.';

export function logoSheet() {
  return component({
    title: 'Brand mark',
    sub: 'Wordmark — <span class="tok">.logo</span> (700, '
      + '<span class="tok">--tracking-display</span>, <span class="tok">--text-logo</span>). Shown as authored.',
    anatomy: logoAnat,
    behaviour: logoBehav,
    knobs: logoKnobs,
    render: logoRender,
    code: logoCode,
    tokens: logoTokens,
  });
}
