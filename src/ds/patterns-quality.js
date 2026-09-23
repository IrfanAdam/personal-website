/* ADAM/DS — ds/patterns-quality · a11y/migration section markup ·
   [plan:2026-09-23_145600-ds-elements-tabs.md#phase-1] */
// Exports: a11yHtml, migrationHtml — one export per tab pane
import { note, code } from './specimens.js';
import { MOTION } from './patterns-data.js';

// — Accessibility —
export function a11yHtml() {
  return [
    `<div class="ds-sec"><h2>Accessibility — computed contrast</h2>`,
    `<p class="sub">Every ratio is computed live from <span class="tok">var()</span> in BOTH themes via a `,
    `synchronous <span class="tok">[data-theme]</span> probe (no flash, user theme restored). Gates: AA ≥ 4.5 · AAA `,
    `≥ 7. Toggle top-right to proof.</p>
`,
    `<table class="ds-table"><tr><th>Pair</th><th>Light</th><th>Dark</th><th>Verdicts</th><th>Use</th></tr>`,
    `<tbody id="a11yBody"></tbody></table>
`,
    `<h3>Motion × reduced-motion — verified in source</h3>`,
    `<p class="sub">Each behavior below names the guard that implements it. Lab cells also freeze (<span `,
    `class="tok">fx-lab.js</span> paints one static frame).</p>
`,
    `<table class="ds-table"><tr><th>Model</th><th>Reduced-motion behavior</th><th>Proven in</th></tr>
`,
    MOTION.map(([m, b, p]) => `<tr><td>${m}</td><td>${b}</td><td>${p}</td></tr>`).join(''),
    `</table>
`,
    `<h3>Focus ring — live demo</h3>`,
    `<p class="sub">One rule everywhere: <span class="tok">3px</span> ink (<span class="tok">--size-frame</span>), `,
    `offset <span class="tok">2px</span> (<span class="tok">--space-2</span>). Error fields swap the color to `,
    `accent. Tab into this row, or press Focus:</p>
`,
    `<div class="ds-spec block"><div class="field" style="max-width:var(--measure-copy)">`,
    `<label for="a11yField">Email</label><input id="a11yField" type="email" value="you@studio.com"/></div>
`,
    `<div class="fx-controls"><div class="fx-btns">`,
    `<button class="btn btn--primary" data-focus-demo="#a11yField">Focus the field</button> <button class="pill" `,
    `data-focus-demo="#a11yGhost">Focus ghost</button> <button class="btn btn--ghost" id="a11yGhost">Ghost `,
    `target</button></div></div>
`,
    `<figure><figcaption>real .field + .btn classes — the ring you see is the shipping rule</figcaption></figure>`,
    `</div>
`,
    code(['.btn / .card / .field input / .toggle:focus-visible {\\n  outline: var(--size-frame) solid ',
      'var(--color-ink);  /* 3px */\\n  outline-offset: var(--space-2);                  /* 2px ',
      '*/\\n}\\n.field--error :focus-visible { outline-color: var(--color-accent); }'].join('')),
    `
`,
    note('Do', ['Rings are <span class="tok">3px ink, offset 2px</span>. Motion dies under <span ',
      'class="tok">prefers-reduced-motion</span> — every model above no-ops by guard, never by promise.'].join('')),
    `</div>`,
  ].join('');
}

// — Migration —
export function migrationHtml() {
  return [
    `<div class="ds-sec"><h2>Migration — making the site adherent</h2>`,
    `<p class="sub">Completed, zero visual change throughout. Every step was a token-alias swap with identical `,
    `pixels.</p>
`,
    code(['1 · tokens.css ✓ DONE — canonical space live, legacy aliases keep pixels identical\\n2 · masonry.css ✓ ',
      'DONE — consumes --scrim-gradient / --color-on-media, card split to card.css\\n3 · base / pages / card / ',
      'masonry ✓ DONE — 100% var() consumption, every file ≤ 100 lines\\n4 · DESIGN.md ✓ DONE — v1.1.0 spec ',
      'matches this DS\\n5 · verify ✓ DONE — npm test (lint:tokens + vite build) green'].join('')),
    `
`,
    note('Don’t',
      'No step restyles anything. Diffs must be token-alias swaps with byte-identical screenshots.',
      'dont'),
    `</div>`,
  ].join('');
}
