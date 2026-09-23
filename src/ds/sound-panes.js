/* ADAM/DS — ds/sound-panes · vertical Sound panes ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-3] */
// Exports: panes — 3 vertical tabs (Voices→Usage), Scope persistent at top
import { proceduralHtml } from './foundations/sound/procedural.js';
import { filesHtml } from './foundations/sound/files.js';
import { usageHtml } from './foundations/sound/usage.js';

// — Panes (Scope lives outside tabs, at page top) —
export const panes = [
  {
    label: 'Voices',
    html: [
      proceduralHtml(),
    ].join(''),
  },
  {
    label: 'Files',
    html: [
      filesHtml(),
    ].join(''),
  },
  {
    label: 'Usage',
    html: [
      usageHtml(),
    ].join(''),
  },
];
