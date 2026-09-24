/* ADAM/DS — primitives/kicker.js · Kicker primitive · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: kickerSheet — Kicker primitive sheet
// — Tokens · Render · Code · Knobs · Docs —

import { component } from '../component.js';

const kickerTokens = [
  '--font-mono',
  '--color-ink-muted',
  '--text-meta',
  '--tracking-label',
];

function kickerRender(s) {
  return `<p class="kicker">${s.text}</p>`;
}

function kickerCode(s) {
  return `<p class="kicker">${s.text}</p>`;
}

const kickerKnobs = [
  {
    key: 'text',
    label: 'text',
    type: 'select',
    default: 'Sales CRM · 2024',
    options: [
      { value: 'Sales CRM · 2024', label: 'Sales CRM · 2024' },
      { value: 'Case study', label: 'Case study' },
      { value: 'View project · 2024', label: 'View project · 2024' },
    ],
  },
];

const kickerAnat = '<span class="tok">.kicker</span> (also <span class="tok">.case .kicker</span>) — mono '
  + '<span class="tok">12px</span> muted, uppercase <span class="tok">--tracking-label</span>.';
const kickerBehav = 'Static eyebrow; no focus. Dark: <span class="tok">--color-ink-muted</span> recomputes; '
  + 'letter-spacing stays <span class="tok">--tracking-label</span>.';

export function kickerSheet() {
  return component({
    title: 'Kicker',
    sub: 'Eyebrow via <span class="tok">.kicker</span> — mono 12px muted, uppercase '
      + '<span class="tok">--tracking-label</span>.',
    anatomy: kickerAnat,
    behaviour: kickerBehav,
    knobs: kickerKnobs,
    render: kickerRender,
    code: kickerCode,
    tokens: kickerTokens,
  });
}
