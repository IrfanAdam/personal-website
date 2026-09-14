/* ADAM/DS — ds/atlas/insight · find/focus/path state + emphasis overlay
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-6] */
import { pathBetween } from './schema.js';
// Exports: makeInsight, setFind, hitAt, pickNode, clearOverlay, clearInsight, overlayOf
export const makeInsight = () => ({ hits: null, focus: null, path: null });
export function setFind(ins, matches) {
  const ids = matches.map((m) => m.id);
  ins.hits = ids.length ? new Set(ids) : null;
}
export const hitAt = (matches, sel) => {
  if (!matches.length) return null;
  const i = matches.findIndex((m) => m.id === sel);
  return matches[(i + 1) % matches.length];
};
export function pickNode(ins, id, shift, sel) {
  if (shift && sel && sel !== id) {
    ins.focus = null;
    const chain = pathBetween(sel, id);
    const ids = chain ? chain.ids : [];
    const hops = chain ? chain.hops : -1;
    ins.path = { ids, hops, from: sel, to: id };
    return { focus: false, path: true };
  }
  ins.path = null;
  ins.focus = ins.focus === id ? null : id;
  return { focus: !!ins.focus, path: false };
}
export function clearOverlay(ins) {
  ins.focus = null;
  ins.path = null;
}
export function clearInsight(ins) {
  clearOverlay(ins);
  ins.hits = null;
}
export function overlayOf(ins) {
  const ids = ins.path && ins.path.ids.length ? ins.path.ids : null;
  const pathEdges = new Set();
  (ids || []).forEach((id, i) => {
    if (ids[i + 1]) pathEdges.add(`${id}>${ids[i + 1]}`);
  });
  return { hits: ins.hits, path: ids ? new Set(ids) : null, pathEdges, deep: !!ins.focus };
}
