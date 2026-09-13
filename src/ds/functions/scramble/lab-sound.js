/* ADAM/DS — ds/scramble/lab-sound · sound controls · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { note } from '../../specimens.js';
export function labSound(o){return [
  `<div class="fx-btns" data-scramble-align-group><button class="pill on" data-scramble-align="left">left</button>`,
  `<button class="pill" data-scramble-align="center">center</button>`,
  `<button class="pill" data-scramble-align="right">right</button></div>`,
].join('')
+ [
  `<div class="fx-btns"><button class="pill on" data-scramble="sound" aria-pressed="true">sound: on</button>`,
  `<select data-scramble="kind" title="source kind" `,
  `style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color`,
  `-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8)">`,
  o.kindOpts,
  `</select>`,
  `<select data-scramble="voice" `,
  `style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color`,
  `-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8)">`,
  o.voiceOpts,
  `</select>`,
  `<select data-scramble="file" title="sound file" `,
  `style="font-family:var(--font-mono);font-size:var(--text-micro);background:var(--color-surface);color:var(--color`,
  `-ink);border:var(--border-hairline);padding:var(--space-4) var(--space-8)">`,
  o.fileOpts,
  `</select><button class="pill" data-scramble="play-load">▶ load</button>`,
  `<button class="pill" data-scramble="replay">↻ scramble</button>`,
  `<button class="pill" data-scramble="hover">hover: off</button></div>`,
].join('')
+ `<p class="fx-status" data-scramble-status>ready — type or hit scramble</p>`
+ `</div></div>`
+ [
  note('Do',
    ['Tune chars + speed + revealDelay here, then graduate via <span class="tok">--dur-scramble</span> / <span ',
    'class="tok">--fx-scramble-*</span>. Type styles are all <span class="tok">var(--text-*)</span> — no ',
    'literals.'].join('')),
].join('')
+ `</div></div>`;}
