/* ADAM/DS — ds/atlas/tooltip · cursor-follow tip + pinned panel + route link
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-6] */
import { renderPanel } from './panel.js';
// Exports: makeTip
const GAP = 14;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const routeLine = (n) => {
  if (!n.route) return '';
  return `<a class="atlas-route tok" href="${n.route}">${esc(n.route)}</a>`;
};
const headHTML = (n) => [
  `<div class="atlas-phead"><strong>${esc(n.title)}</strong><small class="atlas-kind">${esc(n.layer)}</small></div>`,
  `<span class="atlas-path tok">${esc(n.path)}</span>`,
  routeLine(n),
  '<span class="atlas-hint">click to focus · shift-click to link · esc to clear</span>',
].join('');
export function makeTip(el, stage) {
  let pinned = false;
  const place = (x, y) => {
    const r = stage.getBoundingClientRect();
    let left = x - r.left + GAP;
    let top = y - r.top + GAP;
    if (left + el.offsetWidth > r.width) left = x - r.left - el.offsetWidth - GAP;
    if (top + el.offsetHeight > r.height) top = r.height - el.offsetHeight - GAP;
    el.style.left = `${Math.max(0, left)}px`;
    el.style.top = `${Math.max(0, top)}px`;
  };
  return {
    isPinned: () => pinned,
    follow(node, x, y) {
      if (pinned || !node) return;
      el.hidden = false;
      el.classList.remove('is-pinned');
      el.innerHTML = headHTML(node);
      place(x, y);
    },
    hide() {
      if (pinned) return;
      el.hidden = true;
    },
    pin(node, x, y, pathInfo) {
      if (!node) return;
      pinned = true;
      el.hidden = false;
      el.classList.add('is-pinned');
      el.innerHTML = renderPanel(node, pathInfo);
      place(x, y);
    },
    unpin() {
      pinned = false;
      el.hidden = true;
      el.classList.remove('is-pinned');
    },
  };
}
