/* ADAM/DS — ds/foundations/pane-sound · Sound foundation composer ·
   [plan:2026-09-15_190000-foundations-sound-pane.md#phase-1] */
// Exports: label, html — procedural + file + scope
// — Composer —
import { proceduralHtml } from './sound/procedural.js';
import { filesHtml } from './sound/files.js';
import { scopeHtml } from './sound/scope.js';
import { usageHtml } from './sound/usage.js';
import { tabs } from '../tabs.js';

export const label = 'Sound';

export function html() {
  const intro = [
    `<div class="ds-sec" data-sound-foundations>`,
    `<h2>Sound board</h2>`,
    `<p class="sub">Sound is behaviour, not material: ` +
      `<b>procedural</b> (WebAudio <span class="tok">synth</span> → WAV) for elastic feedback, ` +
      `<b>file</b> (vendored <span class="tok">/sounds</span>) for authored beds. ` +
      `Every voice here is the site voice — tweak, play, and hear the real pipeline.</p>`,
    `</div>`,
  ].join('');
  const inner = tabs({
    variant: 'line',
    panes: [
      { label: 'Lab', html: proceduralHtml() },
      { label: 'File', html: filesHtml() },
      { label: 'Code', html: usageHtml() },
    ],
  });
  const scope = `<div class="ds-sec">` + scopeHtml() + `</div>`;
  return intro + scope + inner;
}
