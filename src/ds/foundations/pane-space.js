/* ADAM/DS foundations · Space + Layout pane — bars are live var() widths. */
import { tokenTrace, note, code } from '../specimens.js';
const SPACES = [['--space-1', '1px'], ['--space-2', '2px'], ['--space-3', '3px'], ['--space-4', '4px'], ['--space-5', '5px'], ['--space-6', '6px'], ['--space-7', '7px'], ['--space-8', '8px'], ['--space-9', '9px'], ['--space-10', '10px'], ['--space-11', '11px'], ['--space-12', '12px'], ['--space-14', '14px · rhythm', 1], ['--space-16', '16px · gutter', 1], ['--space-18', '18px'], ['--space-22', '22px'], ['--space-26', '26px'], ['--space-28', '28px'], ['--space-30', '30px'], ['--space-42', '42px'], ['--space-46', '46px'], ['--space-60', '60px'], ['--space-70', '70px'], ['--space-90', '90px']];
const LAY = [['Wrap', '--size-wrap', '1600px · page max', '100%'], ['Header', '--size-header', '64px · sticky', '32%'], ['Strip thumb', '--size-strip', '56px · media row', '28%'], ['Strip tab', '--size-strip-tab', '58px · tab row', '29%'], ['Tap target', '--size-tap', '44px · min hit', '22%'], ['Hairline', '--size-hairline', '1px · borders', '8%'], ['Frame', '--size-frame', '3px · focus frame', '12%']];
export const label = 'Space · Layout';
export function html() {
  const scale = `<div class="ds-scale">${SPACES.map(([t, v, hot]) => `<div class="ds-scale-row" data-copy="${t}" title="Click to copy ${t}" style="cursor:pointer"><b>${t}</b><div class="ds-bar${hot ? ' accent' : ''}" style="width:var(${t})"></div><span>${v}</span></div>`).join('')}</div>`;
  const lay = `<div class="fd-lay">${LAY.map(([n, t, v, w]) => `<div class="fd-layrow" data-copy="${t}" title="Click to copy ${t}" style="cursor:pointer"><b>${n}</b><div class="fd-laybar" style="width:${w}"></div><span data-live="${t}">${v}</span></div>`).join('')}</div>`;
  return `<div class="ds-sec"><h2>Spacing &amp; layout</h2><p class="sub">Grid rhythm <span class="tok">--rhythm → --space-14</span> (cards, cols) · page gutter <span class="tok">--gutter → --space-16</span> · wrap <span class="tok">--size-wrap 1600px</span>. Bars are live widths — <span class="tok">width:var(--space-*)</span>. Click any row to copy.</p>`
  + scale
  + `<h3>Layout — live tokens</h3><p class="sub">Bars scaled to wrap; values read live <span class="tok">var()</span> via <span class="tok">data-live</span>.</p>` + lay
  + tokenTrace({ rows: [['Copy measure', '--measure-copy', '60ch · narrow'], ['Prose measure', '--measure-prose', '68ch · long read']] })
  + `<div class="ds-spec block"><p style="max-width:var(--measure-copy);font-size:var(--text-body);line-height:var(--leading-prose);margin:0">Copy measure — this paragraph is capped at <span class="tok">var(--measure-copy)</span>. Narrow columns hold attention; prose gets the wider <span class="tok">var(--measure-prose)</span>.</p></div>`
  + code('--rhythm: --space-14 · --gutter: --space-16 · --size-wrap: 1600px · --size-header: 64px\ncols 4 → 2 @900px → 1 @640px · case 1fr 1fr → 1fr @800px')
  + note('Do', 'Odd px (3/5/7/9/11) have explicit slots — use the token, never round silently.')
  + `</div>`;
}
