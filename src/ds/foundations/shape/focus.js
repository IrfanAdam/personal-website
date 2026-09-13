/* ADAM/DS — ds/foundations/shape/focus · focus ring · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { tokenTrace, code } from '../../specimens.js';
export function focusSpec(){return [
    `<h3>Focus ring — live</h3>`,
    `<p class="sub">Ring is <span class="tok">var(--border-focus)</span> (<span `,
    `data-live="--color-focus">ink</span> · <span data-live="--size-frame">3px</span> solid) + offset <span `,
    `data-live="--focus-offset">2px</span>. Tab to the button — ring is ink on paper and paper on ink. Mirrored in `,
    `Color → State.</p>`,
  ].join('')
    + tokenTrace({ plain: true,
        rows: [['Focus border', '--border-focus', 'var(--size-frame) solid var(--color-focus)'],
          ['Focus offset', '--focus-offset', 'var(--space-2) — 2px air'],
          ['Size frame', '--size-frame', '3px · shared with border-frame']] })
    + [
      `<div class="ds-spec block" style="display:grid;gap:var(--space-12)">`,
      `<style>.fd-focus-demo:focus-visible{outline:var(--border-focus);outline-offset:var(--focus-offset)} `,
      `.fd-focus-demo{font-family:var(--font-mono);font-size:var(--text-meta);background:var(--color-ink);color:var(`,
      `--color-bg);border:var(--border-hairline);padding:var(--space-8) var(--space-16);cursor:pointer}</style>`,
      `<div style="display:flex;gap:var(--space-12);flex-wrap:wrap;align-items:center">`,
      `<button class="fd-focus-demo">Tab to focus — ring 3px + 2px offset</button>`,
      `<span style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted)">Focus `,
      `via keyboard (Tab), not click — <span class="tok">:focus-visible</span></span></div>`,
      `<div style="display:flex;gap:var(--space-12);flex-wrap:wrap">`,
      `<div data-theme="dark" `,
      `style="background:var(--color-bg);padding:var(--space-12);border:var(--border-hairline)">`,
      `<button class="fd-focus-demo">Dark — same ring (paper on ink)</button></div>`,
      `<span `,
      `style="font-family:var(--font-mono);font-size:var(--text-micro);color:var(--color-ink-muted);align-self:cente`,
      `r">Both themes — <span data-live="--color-focus">ink</span> holds 0 radius, no shadow</span></div></div>`,
    ].join('')
    + code([
      '/* focus — always var, never a literal */\n:focus-visible { outline: var(--border-focus); outline-offset: '
      ,
      'var(--focus-offset); }\n/* tokens: --color-focus → --color-ink, --border-focus → 3px solid, --focus-offset ',
      '→ 2px */'].join(''));}
