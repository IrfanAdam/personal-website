/* ADAM/PAGE — views/map/focus · pin neighbourhood → keep-set + dim predicates
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import { EDGES } from './store.js';
// Exports: focus, dimmed, touched
export function focus(selected, selEdge) {
  const keep = new Set();
  if (selected) {
    keep.add(selected.id);
    keep.add(selected.group);
    EDGES.forEach((e) => {
      if (e.from === selected.id) keep.add(e.to);
      if (e.to === selected.id) keep.add(e.from);
    });
  }
  if (selEdge) {
    keep.add(selEdge.from);
    keep.add(selEdge.to);
  }
  return { active: keep.size > 0, keep };
}
export const dimmed = (f, node) => f.active && !f.keep.has(node.id) && !f.keep.has(node.group);
export const touched = (f, e) => f.active && !f.keep.has(e.from) && !f.keep.has(e.to);
