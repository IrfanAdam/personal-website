/* ADAM/DS — ds/foundations/shape/radius · radius rows · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { tokenTrace } from '../../specimens.js';
export function radii(){return tokenTrace({ plain: true, rows: [
    ['None', '--radius-none', 'cards · panels · default'],
    ['Small', '--radius-sm', 'chips · hairlines'],
    ['Medium', '--radius-md', 'buttons · inputs'],
    ['Large', '--radius-lg', 'sheets · modals'],
    ['Pill', '--radius-pill', 'pills (still 0) — hard cut, not capsule'],
  ] });}
export function liveRadii(){return `<div class="ds-spec" style="flex-wrap:wrap">`
    + [
      `<figure style="margin:0">`,
      `<div `,
      `style="width:var(--space-90);height:var(--space-60);background:var(--color-surface);border:var(--border-hairl`,
      `ine);border-radius:var(--radius-none);display:grid;place-items:center;font-family:var(--font-mono);font-size:`,
      `var(--text-micro)">radius-none</div><figcaption>card — <span class="tok">var(--radius-none)</span>`,
      `</figcaption></figure>`,
    ].join('')
    + [
      `<figure style="margin:0"><span class="pill" style="border-radius:var(--radius-pill)">pill — 0</span>`,
      `<figcaption>pill — <span class="tok">var(--radius-pill)</span></figcaption></figure>`,
    ].join('')
    + [
      `<figure style="margin:0">`,
      `<button class="btn btn--primary" style="border-radius:var(--radius-md)">Button</button>`,
      `<figcaption>button — <span class="tok">var(--radius-md)</span></figcaption></figure>`,
    ].join('')
    + [
      `<figure style="margin:0"><div class="field" style="width:160px">`,
      `<input placeholder="input" style="border-radius:var(--radius-md)"/></div>`,
      `<figcaption>input — <span class="tok">var(--radius-md)</span></figcaption></figure>`,
    ].join('')
    + `</div>`;}
