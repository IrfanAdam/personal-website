/* ADAM/DS — ds/functions/scramble/panel · composer · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { buildOpts } from './opts.js';
import { labText } from './lab-text.js';
import { labSound } from './lab-sound.js';
import { codeTab } from './code-tab.js';
export function render(){
  const o = buildOpts();
  return [
    `<div class="ds-hero ds-hero--lab"><h1>Scramble — decoding text.</h1>`,
    `<p class="lede">GSAP <span class="tok">ScrambleTextPlugin</span>-like decoder: randomized chars refreshing at `,
    `<span class="tok">speed</span>, revealing left→right over <span class="tok">--dur-scramble</span>. Change font `,
    `+ fire sound — all <span class="tok">var()</span> type, sound renders offline and plays through audio `,
    `elements.</p></div>`,
  ].join('')
+ [
  `<div class="ds-tablist ds-tablist--line" role="tablist" data-scramble-tabs>`,
  `<button class="ds-tab on" role="tab" aria-selected="true" data-tab="lab">Lab</button>`,
  `<button class="ds-tab" role="tab" aria-selected="false" data-tab="code">Code</button></div>`,
].join('')
+ [
  `<div data-tab-panel="lab"><div class="ds-sec">`,
  `<p class="sub">Type a sentence, pick chars + font + alignment. Sound is a random decoded blip synced to the `,
  `reveal — plus the page-load scanner (~520ms sweep) that fires once per session on page load. Pick <span `,
  `class="tok">scanner</span> as voice to hear it with scramble.</p>`,
].join('')
+ `<div class="ds-spec block" data-scramble-lab>`
  + labText(o)
  + labSound(o)
  + codeTab();
}
