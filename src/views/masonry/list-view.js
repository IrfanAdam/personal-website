/* ADAM/PAGE — views/masonry/list-view · list rows + preview pane ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-19] */
// Exports: listMarkup — rows + pane markup · attachListView — pane only (popover removed, single frame)
import { row } from './cards.js';
import { aboutBlock } from '../shared.js';
import { peekMarkup, attachWorkPeek } from './work-peek.js';
import { attachBrandTokens } from './brand-tokens.js';

// — Section: markup —
export function listMarkup(list) {
  const rows = list.map(row).join('');
  const pane = list.length ? peekMarkup(list[0]) : '';
  return `<div class="works-cols"><div class="works-rows"><h2>All of my works</h2>`
    + `${rows}</div>${pane}</div>${aboutBlock()}`;
}

// — Section: behaviour —
// Single-frame list: peek pane is the only preview (floating popover removed per desktop single-frame fix)
export function attachListView(grid) {
  const offPeek = attachWorkPeek(grid);
  const offTokens = attachBrandTokens(grid);
  return () => {
    offPeek();
    offTokens();
  };
}
