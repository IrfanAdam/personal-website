/* ADAM/DS — ds/foundations/pane-type · composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { scale } from './type/scale.js';
import { voice } from './type/voice.js';
import { playground } from './type/playground.js';
export const label = 'Type';
export function html() {
  return [
    `<div class="ds-sec"><h2>Typography</h2>`,
    `<p class="sub">Inter Tight for voice · Chivo Mono for metadata. Title parity: contact hero and case h1 share `,
    `<span class="tok">--text-title</span>. Every sample is live <span class="tok">var()</span> type. Weight caps `,
    `at <span class="tok">700</span> — no heavier step ships.</p>`,
  ].join('')
  + scale()
  + voice()
  + playground()
  + `</div>`;
}
