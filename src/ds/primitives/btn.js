/* ADAM/DS — primitives/btn.js · Button primitive · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: btnSheet — Button primitive sheet
// — Tokens · Render · Code · Knobs · Docs —

import { component } from '../component.js';

const btnTokens = [
  '--color-ink', '--color-bg', '--color-surface', '--color-panel',
  '--space-8', '--space-14', '--size-tap',
  '--border-hairline', '--radius-none', '--dur-soft',
];

function btnRender(s) {
  const cls = `btn btn--${s.variant} btn--${s.size}`;
  const dis = s.disabled ? ' disabled' : '';
  const inner = `<button class="${cls}"${dis}>${s.label}</button> <a class="${cls}" href="javascript:void(0)">Link</a>`;
  if (s.onDark) {
    return [
      `<div data-theme="dark" ` +
      `style="background:var(--color-bg);padding:var(--space-16);border:var(--border-hairline)">`,
      inner,
      `</div>`,
    ].join('');
  }
  return inner;
}

function btnCode(s) {
  const cls = `btn btn--${s.variant} btn--${s.size}`;
  const dis = s.disabled ? ' disabled' : '';
  return `<button class="${cls}"${dis}>${s.label}</button>`;
}

const btnKnobs = [
  {
    key: 'variant',
    label: 'variant',
    type: 'select',
    default: 'primary',
    options: [
      { value: 'primary', label: 'primary' },
      { value: 'secondary', label: 'secondary' },
      { value: 'ghost', label: 'ghost' },
    ],
  },
  {
    key: 'size',
    label: 'size',
    type: 'select',
    default: 'md',
    options: [
      { value: 'sm', label: 'sm · 32' },
      { value: 'md', label: 'md · 44' },
    ],
  },
  {
    key: 'label',
    label: 'label',
    type: 'select',
    default: 'Button',
    options: [
      { value: 'Button', label: 'Button' },
      { value: 'Save', label: 'Save' },
      { value: 'View project', label: 'View project' },
      { value: 'Contact', label: 'Contact' },
    ],
  },
  { key: 'disabled', label: 'disabled', type: 'boolean', default: false },
  { key: 'onDark', label: 'on dark', type: 'boolean', default: false },
];

const btnAnatomy = '<span class="tok">.btn</span> + <span class="tok">.btn--primary</span> (ink fill) / '
  + '<span class="tok">--secondary</span> (hairline) / <span class="tok">--ghost</span> (text); '
  + 'size <span class="tok">--sm</span> 32 / <span class="tok">--md</span> 44 via <span class="tok">--size-tap</span>.';
const btnBehav = 'Hover: ink fill darkens; focus: <span class="tok">3px</span> ink ring offset '
  + '<span class="tok">2px</span> (<span class="tok">--size-frame</span>); disabled: '
  + '<span class="tok">opacity + disabled</span>; dark: <span class="tok">[data-theme=dark]</span> proof. Try Tab.';

export function btnSheet() {
  return component({
    title: 'Button',
    sub: [
      'Canonical action primitive — <span class="tok">.btn</span> with ',
      '<span class="tok">--primary</span> (ink fill), <span class="tok">--secondary</span> (hairline), ',
      '<span class="tok">--ghost</span> (text-only). Sizes sm/md via <span class="tok">--size-tap</span> (44px).',
    ].join(''),
    anatomy: btnAnatomy,
    behaviour: btnBehav,
    knobs: btnKnobs,
    render: btnRender,
    code: btnCode,
    tokens: btnTokens,
  });
}
