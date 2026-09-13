/* ADAM/DS — ds/foundations/type/playground · tester · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { code } from '../../specimens.js';
export function playground(){return [
    `<h3>③ Playground — type tester, live</h3>`,
    `<p class="sub">Editable proof of the scale above — pick size, leading, tracking and type.</p>`,
    `<div class="ds-spec block">`,
    `<div id="typeSample" contenteditable="true" `,
    `style="font-family:var(--font-sans);font-size:var(--text-body);line-height:var(--leading-body);letter-spacing:v`,
    `ar(--tracking-body);border:var(--border-hairline);padding:var(--space-12);background:var(--color-surface);min-h`,
    `eight:var(--space-60)">The quick brown fox — edit me. Inter Tight renders voice.</div>`,
    `<div class="fx-controls" id="typeCtrls"><label class="fx-row">size <select data-type="size">`,
    `<option value="var(--text-small)">small 13.5</option><option value="var(--text-body)" selected>body 14</option>`,
    `<option value="var(--text-h3)">h3 16</option><option value="var(--text-title)">title</option>`,
    `<option value="var(--text-display)">display</option></select></label>`,
    `<label class="fx-row">leading <select data-type="leading"><option value="var(--leading-body)">body 1.5</option>`,
    `<option value="var(--leading-snug)">snug 1.25</option><option value="var(--leading-prose)">prose 1.6</option>`,
    `<option value="var(--leading-display)">display 0.9</option></select></label>`,
    `<label class="fx-row">tracking <select data-type="tracking">`,
    `<option value="var(--tracking-body)" selected>body -.01</option>`,
    `<option value="var(--tracking-heading)">heading -.02</option>`,
    `<option value="var(--tracking-title)">title -.03</option>`,
    `<option value="var(--tracking-display)">display -.04</option>`,
    `<option value="var(--tracking-label)">label .12</option><option value="var(--tracking-mono)">mono .1</option>`,
    `</select></label></div></div>`,
  ].join('')
  + code('weight — regular 400 · medium 500 · semibold 600 · bold 700 (cap) · --weight-extrabold deprecated → bold');}
