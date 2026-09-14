/* ADAM/DS — ds/atlas/schema · load + filter arch-schema for canvas
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-3] */
import raw from '../arch-schema.json';
// Exports: LAYERS, KINDS, nodes, byLayer, visible, lookup, neighbors, edgesVisible
export const LAYERS = ['function', 'component', 'foundation'];
export const KINDS = ['imports', 'styles', 'tokens'];
export const nodes = () => raw.nodes.filter((n) => LAYERS.includes(n.layer));
export const byLayer = (layer) => raw.nodes.filter((n) => n.layer === layer);
export const visible = (on) => nodes().filter((n) => on.has(n.layer));
export const lookup = (id) => raw.nodes.find((n) => n.id === id) || null;
export function neighbors(id) {
  const out = raw.edges.filter((e) => e.from === id).map((e) => ({ ...e, node: lookup(e.to) }));
  const inn = raw.edges.filter((e) => e.to === id).map((e) => ({ ...e, node: lookup(e.from) }));
  return { out, in: inn };
}
export function edgesVisible(ids, kinds) {
  return raw.edges.filter((e) => kinds.has(e.kind) && ids.has(e.from) && ids.has(e.to));
}
