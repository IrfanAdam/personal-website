/* ADAM/DS — tokens table · [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-2] */
// Exports: tableHtml — grouped token table with swatch + live + copy
import { cssVar } from '../../specimens/color.js';
const G = [
  { h: 'Color · semantic', rows: [
    ['Page', '--color-bg', 'page + cards'],
    ['Surface', '--color-surface', 'cards + cells'],
    ['Sunken', '--color-surface-sunken', 'wells'],
    ['Ink', '--color-ink', 'headlines'],
    ['Muted', '--color-ink-muted', 'meta'],
    ['Line', '--color-line', 'hairlines'],
    ['Accent', '--color-accent', 'CTA/bade'],
    ['On accent', '--color-on-accent', 'on accent'],
    ['Panel', '--color-panel', 'doc hover'],
    ['Header', '--color-header', 'sticky veil'],
    ['Overlay', '--color-overlay', 'viewer/modal'],
    ['Success', '--color-success', 'ok fill'],
    ['Error', '--color-error', 'error fill'],
    ['Warning', '--color-warning', 'caution fill'],
    ['Info', '--color-info', 'notice fill'],
  ], sw: true },
  { h: 'Space · rhythm', rows: [
    ['1', '--space-1', 'hairline'], ['2', '--space-2', 'frame'],
    ['4', '--space-4', 'tight'], ['8', '--space-8', 'xs'],
    ['12', '--space-12', 'sm'], ['14', '--space-14', 'rhythm'],
    ['16', '--space-16', 'gutter'], ['22', '--space-22', 'md'],
    ['30', '--space-30', 'lg'], ['42', '--space-42', 'xl'],
  ] },
  { h: 'Typography · scale', rows: [
    ['Display', '--text-display', '28→54'], ['Title', '--text-title', '26→46'],
    ['H2', '--text-h2', '20px'], ['H3', '--text-h3', '16px'],
    ['Body', '--text-body', '14px'], ['Meta', '--text-meta', '12px'],
    ['Label', '--text-label', '11px'], ['Micro', '--text-micro', '10.5px'],
  ] },
  { h: 'Radius · shape', rows: [
    ['None', '--radius-none', '0'], ['Sm', '--radius-sm', '0'],
    ['Lg', '--radius-lg', '0'], ['Pill', '--radius-pill', '0'],
  ] },
  { h: 'Motion · depth', rows: [
    ['Fast', '--dur-fast', '150ms'], ['Base', '--dur-base', '200ms'],
    ['Slow', '--dur-slow', '280ms'],
    ['Signature', '--ease-signature', '0.32,0.72,0,1'],
  ] },
];
function rowHtml([name, tok, use], sw) {
  const swatch = sw ? [
    `<i style="display:inline-block;width:18px;height:18px;`,
    `border:var(--border-hairline);background:var(${tok});`,
    `vertical-align:middle" aria-hidden="true"></i>`,
  ].join('') : '';
  return [
    `<tr data-copy-token="${tok}" title="Click to copy live value" style="cursor:pointer">`,
    `<td><span class="tok">${tok}</span><div class="cl-use">${use}</div></td>`,
    `<td>${swatch}</td>`,
    `<td style="font-family:var(--font-mono);font-size:var(--text-micro)">`,
    `<span data-live="${tok}">${cssVar(tok) || '—'}</span></td>`,
    `<td>${name}</td>`,
    `</tr>`,
  ].join('');
}
export function tableHtml() {
  return G.map((g) => [
    `<h3>${g.h}</h3><div style="overflow-x:auto"><table class="ds-table">`,
    `<tr><th>Token</th><th>Swatch</th><th>Live</th><th>Role</th></tr>`,
    g.rows.map((r) => rowHtml(r, g.sw)).join(''),
    `</table></div>`,
  ].join(''));
}
