/* ADAM/DS — overview/reading.js · reading guide · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { note, code } from '../specimens.js';

export function readingHtml() {
  return [
    `<div class="ds-sec"><h2>How to read this site</h2>`,
    `<p class="sub">Foundations first · Tokens are the contract · Everything else is composition.</p>`,
    code(['tokens.css (primitives → semantic → aliases)\\n    ▲ single source — stone + accent-500\\nbase.css · ',
      'pages.css · masonry.css (consume var() only)\\n    ▲ live specimens render these exact classes · no ',
      'invented styles'].join('')),
    `</div>`,
  ].join('');
}
