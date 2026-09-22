/* ADAM/DS — ds/foundations/pane-shape · shape composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { note } from '../specimens.js';
import { doctrine } from './shape/doctrine.js';
import { radii, liveRadii } from './shape/radius.js';
import { borders, liveBorders } from './shape/borders.js';
import { focusSpec } from './shape/focus.js';
export const label = 'Shape';
export function html() {
  return [
    `<div class="ds-sec"><h2>Shape — zero, normatively</h2>`,
    `<p class="sub">Every radius token resolves to <span class="tok">0</span>. Consume via <span `,
    `class="tok">var(--radius-*)</span>; lint rejects literals. Toggle theme — values hold <span `,
    `class="tok">0</span> in both.</p>`,
  ].join('')
    + doctrine() + [
      `<h3>Radius → component mapping</h3>`,
      `<p class="sub">All five map to the same value by doctrine — the mapping is where each is allowed to land. `,
      `Specimens are real site classes sized by <span class="tok">var(--radius-*)</span>.</p>`,
    ].join('') + radii() + liveRadii()
    + [
      `<h3>Border — the structure system</h3>`,
      `<p class="sub">Radius is zero, so borders do the structure. Three tokens, three purposes.</p>`,
    ].join('') + borders() + liveBorders()
    + focusSpec()
    + note('Do',
      ['Reach for borders and hairlines for structure — never a radius literal. Chamfer via <span ',
        'class="tok">clip-path</span> when you need erosion (overview moodboard), not via <span ',
        'class="tok">border-radius</span>.'].join(''))
    + note('Don’t',
      ['No <span class="tok">border-radius: 8px</span> / <span class="tok">999px</span> anywhere — zero is the ',
        'geometry. The 8px card in the proof is the only literal in the DS and it exists to show what we don’t ',
        'do.'].join(''),
      'dont')
    + `</div>`;
}
