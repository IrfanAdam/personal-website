/* ADAM/DS — overview/elements-map · Elements map section · [plan:2026-09-23_143400-ds-overview-elements-fold.md#phase-1] */
// Exports: elementsMapHtml — Elements index folded into Overview
import { note } from '../specimens.js';

// — Data —
const map = [
  ['Primitives', '9', '#/primitives',
    'Button · Tag · Kicker · Divider · Badge · Field · Toggle · Avatar · Logo',
    'Usage → What → When to use → Preview / Code / Tokens'],
  ['Library', '11', '#/library',
    'Header · Footer · Hero · Card · Work · Filters · Strip · Spec · Next · CTA · Contact',
    'page sections, production classes — header to footer'],
  ['Patterns', '4', '#/patterns',
    'Masonry · Viewer · Case 50/50 · A11y + Migration',
    'compositions + gates (contrast live, motion, focus)'],
  ['Motion', '8', '#/functions',
    'GridReveal · Shimmer · Rise · Viewer · Glimmer orb · Glitch · Scramble · Sound',
    'labs + token backlog — tune here, graduate via --fx-*'],
];

// — Section —
export function elementsMapHtml() {
  return [
    `<div class="ds-sec"><h2>Elements</h2>`,
    `<p class="sub">9 → 11 → 4 — primitives compose into library, `,
    `library into patterns. Motion lives next door in <a href="#/functions">Motion</a>. `,
    `Tokens live in <a href="#/foundations">Foundations</a>.</p>`,
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
    `<a href="#/functions">Motion</a> + <a href="#/patterns">Patterns</a>.</p>`,
    `</div>`,
  ].join('');
}
