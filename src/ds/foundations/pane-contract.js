/* ADAM/DS foundations · Tokens pane
   [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-2] */
import { note } from '../specimens.js';
import { tableHtml } from './tokens/table.js';
import { playgroundHtml } from './tokens/playground.js';
import { index } from './tokens/contract-index.js';
import { tierHtml, versionHtml, a11yHtml, auditHtml } from './tokens/contract-sections.js';
export const label = 'Tokens';
export function html() {
  return [
    `<div class="ds-sec"><h2>Contract index</h2><p class="sub">`,
    `<span class="tok">src/styles/tokens.css</span> holds every raw value. `,
    `UI consumes <span class="tok">var()</span> only. Each row names the tab `,
    `holding its live trace.</p><table class="ds-table"><tr>`,
    `<th>Foundation</th><th>Tokens</th><th>Used by</th></tr>`,
  ].join('')
  + index.map(([f, t, u]) => `<tr><td>${f}</td><td>${t}</td><td>${u}</td></tr>`).join('')
  + `</table>`
  + note('Do', [
    'Add a token for every new value. ',
    'Odd px (3/5/7/9/11) gets an explicit slot — never round silently. ',
    'Convention: <span class="tok">--space-N</span> = raw step · ',
    '<span class="tok">--size-*</span> = named object · ',
    '<span class="tok">--measure-*</span> = ch · ',
    '<span class="tok">--rhythm/--gutter</span> = purpose aliases (prefer) · ',
    '<span class="tok">--break-*</span> = viewport (640/800/900 — see Space).',
  ].join(''))
  + note('Don’t', [
    'No <span class="tok">#hex</span> / <span class="tok">rgba()</span> / raw ',
    '<span class="tok">px</span> outside <span class="tok">tokens.css</span>. ',
    'Breakpoints live as <span class="tok">--break-sm/md/lg</span> ',
    '(640/800/900) — <span class="tok">var()</span> is invalid in ',
    '<span class="tok">@media</span> so queries keep the raw px in sync by value, ',
    'commented with the token (<span class="tok">/* --break-* */</span>).',
  ].join(''), 'dont')
  + [
    `</div><div class="ds-sec"><h2>Live token table</h2>`,
    `<p class="sub">Every semantic token — swatch, live `,
    `<span class="tok">var()</span> value (light+dark probed), and click to copy.</p>`,
    tableHtml(),
    `</div>`,
  ].join('')
  + [playgroundHtml()].join('')
  + tierHtml()
  + versionHtml()
  + a11yHtml()
  + auditHtml();
}
