/* ADAM/DS — ds/sound-panes · vertical Sound panes ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-2] */
// Exports: panes — 4 vertical tabs (Voices→Usage)
import { proceduralHtml } from './foundations/sound/procedural.js';
import { filesHtml } from './foundations/sound/files.js';
import { scopeHtml } from './foundations/sound/scope.js';
import { usageHtml } from './foundations/sound/usage.js';

// — Panes —
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
    label: 'Scope',
    html: [
      scopeHtml(),
    ].join(''),
  },
  {
    label: 'Usage',
    html: [
      usageHtml(),
    ].join(''),
  },
];
