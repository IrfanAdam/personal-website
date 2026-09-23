/* ADAM/DS — Functions · GridReveal (shared) · composer ·
   [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
import { mountCells } from '../fx-lab.js';
import { labSection } from './grid-reveal-lab.js';
import { docsSections } from './grid-reveal-docs.js';
export const title = 'GridReveal';
export function render(){
  return [
    `<p class="ds-crumb">Motion · GridReveal</p><div class="ds-hero">`,
    `<h1>Grid reveal — one function, two surfaces.</h1>`,
    `<p class="lede">Same <span class="tok">cells.js · buildTree</span> as the masonry; same <span `,
    `class="tok">gridReveal.js</span> as the hero. The lab below is a 280px window into that function — never `,
    `pushes controls below the fold.</p></div>`,
  ].join('')
  + labSection()
  + docsSections();
}
export function mount(root){ return mountCells(root); }
