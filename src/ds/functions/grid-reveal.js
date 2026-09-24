/* ADAM/DS — gridReveal · lab/code tabs · [plan:2026-09-24_140000-ds-docs-compact.md#phase-2] */
import { mountCells } from '../fx-lab.js';
import { labSection } from './grid-reveal-lab.js';
import { docsSections } from './grid-reveal-docs.js';
import { bindLineTabs } from './line-tabs.js';
export const title = 'GridReveal';
export function render(){
  return [
    `<div class="ds-hero ds-hero--lab">`,
    `<h1>Grid reveal — one function, two surfaces.</h1>`,
    `<p class="lede">Same <span class="tok">cells.js · buildTree</span> as the masonry; same <span `,
    `class="tok">gridReveal.js</span> as the hero. The lab below is a 280px window into that function — never `,
    `pushes controls below the fold.</p></div>`,
  ].join('')
+[
  `<div class="ds-tablist ds-tablist--line" role="tablist" data-grid-tabs>`,
  `<button class="ds-tab on" role="tab" aria-selected="true" data-tab="lab">Lab</button>`,
  `<button class="ds-tab" role="tab" aria-selected="false" data-tab="code">Code</button></div>`,
].join('')
+`<div data-tab-panel="lab">` + labSection() + `</div>`
+`<div data-tab-panel="code" hidden>` + docsSections() + `</div>`;
}
export function mount(root){
  const offCells = mountCells(root);
  const offTabs = bindLineTabs(root, '[data-grid-tabs]');
  return () => { try { offCells && offCells(); } catch {} offTabs(); };
}
