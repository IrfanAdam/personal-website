/* ADAM/DS — primitives/tag.js · Tag primitive · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: tagSheet — Tag primitive sheet
// — Tokens · Render · Code · Knobs · Docs —

import { component } from '../component.js';

const tagTokens = [
  '--color-chip',
  '--color-on-media',
  '--font-mono',
  '--text-label',
  '--space-3',
  '--space-7',
  '--radius-none',
];

function tagRender(s) {
  return `<span class="tags" style="position:static;opacity:1"><i>${s.label}</i></span>`;
}

function tagCode(s) {
  return `<span class="tags"><i>${s.label}</i></span>`;
}

const tagKnobs = [
  {
    key: 'label',
    label: 'label',
    type: 'select',
    default: 'Sales CRM',
    options: [
      { value: 'Sales CRM', label: 'Sales CRM' },
      { value: 'Product', label: 'Product' },
      { value: 'AI', label: 'AI' },
      { value: 'Case study', label: 'Case study' },
    ],
  },
];

const tagAnatomy = '<span class="tok">.tags &gt; i</span> — mono <span class="tok">11px</span> on '
  + '<span class="tok">--color-chip</span> (62% ink) over image.';
const tagBehav = 'Static chip; no focus ring (text only). Dark: chip lightens via '
  + '<span class="tok">--color-chip</span> probe; hover not applicable.';

export function tagSheet() {
  return component({
    title: 'Tag',
    sub: 'Chip inside <span class="tok">.tags &gt; i</span> — mono 11px on '
      + '<span class="tok">--color-chip</span> (62% ink) over image. Same class as masonry cards.',
    anatomy: tagAnatomy,
    behaviour: tagBehav,
    knobs: tagKnobs,
    render: tagRender,
    code: tagCode,
    tokens: tagTokens,
  });
}
