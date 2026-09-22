/* ADAM/PAGE — views/masonry/list-view · list rows + preview pane ·
   [plan:2026-09-15_183400-lump-sum-builds.md#phase-19] */
// Exports: listMarkup — rows + pane markup · attachListView — popover + pane
import { row } from './cards.js';
import { peekMarkup, attachWorkPeek } from './work-peek.js';
import { attachListViewer } from './list-viewer.js';
import { attachBrandTokens } from './brand-tokens.js';
import { attachWorkCursor } from './work-cursor.js';

// — Section: markup —
export function listMarkup(list) {
  const rows = list.map(row).join('');
  const pane = list.length ? peekMarkup(list[0]) : '';
  return `<div class="works-cols"><div class="works-rows"><h2>All of my works</h2>`
    + `${rows}</div>${pane}</div>`;
}

// — Section: behaviour —
export function attachListView(grid) {
  const offPopover = attachListViewer(grid);
  const offPeek = attachWorkPeek(grid);
  const offTokens = attachBrandTokens(grid);
  const offCursor = attachWorkCursor(grid);
  return () => {
    offPopover();
    offPeek();
    offTokens();
    offCursor();
  };
}
