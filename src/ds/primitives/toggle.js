/* ADAM/DS — primitives/toggle.js · Toggle primitive · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: toggleSheet — Toggle primitive sheet
// — Tokens · Render · Code · Knobs · Docs —

import { component } from '../component.js';

const toggleTokens = [
  '--color-ink',
  '--color-bg',
  '--color-surface',
  '--space-42',
  '--space-22',
  '--space-18',
  '--space-2',
  '--space-8',
  '--border-hairline',
  '--radius-none',
  '--dur-soft',
  '--size-frame',
];

function toggleRender(s) {
  const chk = s.checked ? ' checked' : '';
  const dis = s.disabled ? ' disabled' : '';
  const wrapStart = s.onDark
    ? '<div data-theme="dark" style="background:var(--color-bg);padding:var(--space-16);border:var(--border-hairline)">'
    : '<div>';
  return `${wrapStart}<label class="toggle"><input type="checkbox"${chk}${dis}><span>${s.label}</span></label></div>`;
}

function toggleCode(s) {
  const chk = s.checked ? ' checked' : '';
  return `<label class="toggle"><input type="checkbox"${chk}> ${s.label}</label>`;
}

const toggleKnobs = [
  { key: 'checked', label: 'checked', type: 'boolean', default: false },
  { key: 'disabled', label: 'disabled', type: 'boolean', default: false },
  {
    key: 'label',
    label: 'label',
    type: 'select',
    default: 'Notifications',
    options: [
      { value: 'Notifications', label: 'Notifications' },
      { value: 'Dark mode', label: 'Dark mode' },
      { value: 'Auto-save', label: 'Auto-save' },
    ],
  },
  { key: 'onDark', label: 'on dark', type: 'boolean', default: false },
];

const toggleAnat = '<span class="tok">.toggle &gt; input[type=checkbox]</span> — track '
  + '<span class="tok">42×22</span> ink, knob <span class="tok">18px</span> (<span class="tok">--space-18</span>).';
const toggleBehav = 'Checked moves knob; focus ring <span class="tok">3px</span> ink offset '
  + '<span class="tok">2px</span>; disabled mutes track; dark: ink/track invert via probe.';

export function toggleSheet() {
  return component({
    title: 'Toggle',
    sub: 'Switch — <span class="tok">.toggle &gt; input[type=checkbox]</span> ink track 42×22, '
      + 'knob <span class="tok">--space-18</span>. Focus ring <span class="tok">--size-frame</span> '
      + 'offset <span class="tok">--space-2</span>.',
    anatomy: toggleAnat,
    behaviour: toggleBehav,
    knobs: toggleKnobs,
    render: toggleRender,
    code: toggleCode,
    tokens: toggleTokens,
  });
}
