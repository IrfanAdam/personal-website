/* ADAM/DS — primitives/badge.js · Badge primitive · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: badgeSheet — Badge primitive sheet
// — Tokens · Render · Code · Knobs · Docs —

import { component } from '../component.js';

const badgeTokens = [
  '--color-accent',
  '--color-on-accent',
  '--color-ink',
  '--color-bg',
  '--font-mono',
  '--text-label',
  '--space-3',
  '--space-8',
  '--radius-none',
];

function badgeRender(s) {
  const m = s.variant === 'muted' ? ' badge--muted' : '';
  return `<span class="badge${m}">${s.label}</span>`;
}

function badgeCode(s) {
  const m = s.variant === 'muted' ? ' badge--muted' : '';
  return `<span class="badge${m}">${s.label}</span>`;
}

const badgeKnobs = [
  {
    key: 'variant',
    label: 'variant',
    type: 'select',
    default: 'accent',
    options: [
      { value: 'accent', label: 'accent · vermilion' },
      { value: 'muted', label: 'muted · ink' },
    ],
  },
  {
    key: 'label',
    label: 'label',
    type: 'select',
    default: 'New',
    options: [
      { value: 'New', label: 'New' },
      { value: 'Beta', label: 'Beta' },
      { value: 'Limited', label: 'Limited' },
    ],
  },
];

const badgeAnat = '<span class="tok">.badge</span> — vermilion <span class="tok">--color-accent</span> + '
  + '<span class="tok">--color-on-accent</span>; <span class="tok">--muted</span> is ink for body-safe AA.';
const badgeBehav = 'Static chip; no focus ring. Accent variant is large-text/graphics only (3.55/4.71:1). '
  + 'Dark proof via probe; muted passes AA body.';

export function badgeSheet() {
  return component({
    title: 'Badge',
    sub: 'Accent chip — <span class="tok">.badge</span> on <span class="tok">--color-accent</span> '
      + '(vermilion). A11y: large text only — muted is ink for body.',
    anatomy: badgeAnat,
    behaviour: badgeBehav,
    knobs: badgeKnobs,
    render: badgeRender,
    code: badgeCode,
    tokens: badgeTokens,
  });
}
