/* ADAM/DS foundations · Shape pane — zero, normatively. Boxes show the var. */
import { tokenTrace, note, code } from '../specimens.js';
const SHAPES = [['None', '--radius-none'], ['Small', '--radius-sm'], ['Medium', '--radius-md'], ['Large', '--radius-lg'], ['Pill', '--radius-pill']];
export const label = 'Shape';
export function html() {
  return `<div class="ds-sec"><h2>Shape — zero, normatively</h2><p class="sub">Every radius token resolves to <span class="tok">0</span>. Consume via <span class="tok">var(--radius-*)</span>; lint rejects literals. Toggle theme — values hold <span class="tok">0</span> in both.</p>`
  + `<div class="fd-shapes">${SHAPES.map(([n, t]) => `<div class="fd-shape" data-copy="${t}" title="Click to copy ${t}" style="border-radius:var(${t});cursor:pointer">${n}</div>`).join('')}</div>`
  + tokenTrace({ rows: [['None', '--radius-none', 'cards · panels'], ['Small', '--radius-sm', 'chips · hairlines'], ['Medium', '--radius-md', 'buttons · inputs'], ['Large', '--radius-lg', 'sheets · modals'], ['Pill', '--radius-pill', 'pills (still 0)']] })
  + code('border-radius outside tokens.css must match: var(--radius-*)')
  + note('Do', 'Reach for borders and hairlines for structure — never a radius literal.')
  + `</div>`;
}
