/* ADAM/PAGE — views/map/tips · legend pill hover tips through the shared stage tip
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import { nodeTipHTML } from './popover.js';
// Exports: bindLegendTips
const GAP = 8;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
export function bindLegendTips(root, map) {
  const stage = root.querySelector('#mapStage');
  const legends = root.querySelector('#mapLegends');
  const tipEl = root.querySelector('#mapTip');
  const place = (x, y) => {
    const w = map.view.W - GAP;
    tipEl.style.left = `${Math.max(GAP, Math.min(x, w - tipEl.offsetWidth))}px`;
    tipEl.style.top = `${Math.max(GAP, y)}px`;
  };
  const over = (e) => {
    const band = e.target.closest('.map-pill');
    if (!band) return;
    const r = band.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    tipEl.hidden = false;
    tipEl.innerHTML = `<strong>${esc(band.textContent.trim())}</strong><em>${esc(band.dataset.tip)}</em>`;
    place(r.left - s.left, r.top - s.top - tipEl.offsetHeight - GAP);
  };
  const out = (e) => {
    if (!e.target.closest('.map-pill')) return;
    const pinned = map.sel.node;
    if (pinned) {
      map.showTip(nodeTipHTML(pinned), pinned.x + pinned.w, pinned.y);
      return;
    }
    tipEl.hidden = true;
  };
  legends.addEventListener('pointerover', over);
  legends.addEventListener('pointerout', out);
  return () => {
    legends.removeEventListener('pointerover', over);
    legends.removeEventListener('pointerout', out);
  };
}
