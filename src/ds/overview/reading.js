/* ADAM/DS — overview/reading.js · reading guide · [plan:2026-09-23_134500-ds-coherent-consumable.md#phase-3] */
import { code } from '../specimens.js';

export function readingHtml() {
  return [
    `<div class="ds-sec"><h2>How to read this site</h2>`,
    `<p class="sub">Three steps: <a href="#/foundations">1 · Read Foundations</a> (the material) → `,
    `<a href="#/components">2 · Compose Elements</a> (the parts) → `,
    `<a href="#/functions">3 · Tune Motion</a> (the behaviour).</p>`,
    code(['tokens.css (primitives → semantic → aliases)\\n    ▲ single source — stone + accent-500\\nbase.css · ',
      'pages.css · masonry.css (consume var() only)\\n    ▲ live specimens render these exact classes · no ',
      'invented styles'].join('')),
    `</div>`,
  ].join('');
}
