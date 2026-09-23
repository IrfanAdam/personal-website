/* ADAM/DS — ds/foundations/pane-space · space composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { note } from '../specimens.js';
import { groups, aliases } from './space/scale.js';
import { layout } from './space/layout.js';
import { measures, convention, breaks, recipe } from './space/tables.js';
import { audit } from './space/audit.js';
export const label = 'Space';
export function html() {
  return [
    `<div class="ds-sec"><h2>Spacing &amp; layout</h2>`,
    `<p class="sub">Every step grouped by purpose — not bare px bars. Click any row to copy. Bars are live <span `,
    `class="tok">width:var(--space-*)</span>. Alias first where it fits.</p>`,
  ].join('')
    + groups() + aliases() + layout() + measures() + convention() + breaks() + recipe() + audit()
    + note('Do', 'Odd px (3/5/7/9/11) have explicit slots — use the token, never round silently.')
    + `</div>`;
}
