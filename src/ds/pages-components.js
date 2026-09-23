/* ADAM/DS — Components map · [plan:2026-09-23_130000-ds-understandable-mutable.md#phase-3] */
import { note } from './specimens.js';
const map = [
  ['Primitives', '9', '#/primitives',
    'Button · Tag · Kicker · Divider · Badge · Field · Toggle · Avatar · Logo',
    'Usage → Anatomy → Behaviour → Preview / Code / Tokens'],
  ['Library', '11', '#/library',
    'Header · Footer · Hero · Card · Work · Filters · Strip · Spec · Next · CTA · Contact',
    'landing playgrounds dogfood real .top/.card/.cols'],
  ['Patterns', '4', '#/patterns',
    'Masonry · Viewer · Case 50/50 · A11y + Migration',
    'compositions + gates (contrast live, motion, focus)'],
  ['Functions', '7', '#/functions',
    'GridReveal · Shimmer · Rise · Viewer · Glimmer orb · Glitch · Scramble',
    'labs + token backlog — tune here, graduate via --fx-*'],
];
export const title = 'Components';
export function render() {
  return [
    `<p class="ds-crumb">Components · map</p><div class="ds-hero"><h1>One Components section.</h1>`,
    `<p class="lede">No dead-end index — every specimen lives on a sheet. `,
    `This map is the only entry point for <span class="tok">#/components</span>.</p></div>`,
    `<div class="ds-sec"><h2>Where things live</h2>`,
    `<p class="sub">9 → 11 → 4 → 7 — primitives compose into library, `,
    `library into patterns, motion into functions.</p>`,
    `<div class="ds-grid c2" style="gap:var(--space-12)">`,
    map.map(([name, n, href, holds, desc]) => [
      `<a href="${href}" style="text-decoration:none;display:block;`,
      `border:var(--border-hairline);padding:var(--space-14);`,
      `background:var(--color-surface)">`,
      `<div style="display:flex;justify-content:space-between;`,
      `align-items:baseline;gap:var(--space-8)">`,
      `<b style="font-size:var(--text-h3)">${name}</b>`,
      `<span class="tok">${n}</span></div>`,
      `<div style="font-family:var(--font-mono);font-size:var(--text-micro);`,
      `color:var(--color-ink-muted);margin-top:var(--space-6)">${holds}</div>`,
      `<div style="font-size:var(--text-meta);color:var(--color-ink-muted);`,
      `margin-top:var(--space-8)">${desc}</div>`,
      `<span class="kicker" style="margin-top:var(--space-10);`,
      `display:inline-block">Open ${name} →</span></a>`,
    ].join('')).join(''),
    `</div>`,
    note('Do',
      ['Build from <span class="tok">#/primitives</span> + <span class="tok">#/library</span> — ',
        'behaviour + tokens live on each sheet.'].join(''), 'do'),
    `</div>`,
    `<div class="ds-sec"><h2>Migrated</h2>`,
    `<p class="sub">Pill → <a href="#/library">Filters</a> · Card → `,
    `<a href="#/library">Card</a> · Strip → <a href="#/library">Strip</a> · Viewer → `,
    `<a href="#/functions">Functions</a> + <a href="#/patterns">Patterns</a>.</p>`,
    `</div>`,
  ].join('');
}
