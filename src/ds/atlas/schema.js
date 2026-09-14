/* ADAM/DS — ds/atlas/schema · load + filter arch-schema for canvas
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-4] */
import raw from '../arch-schema.json';
// Exports: LAYERS, KINDS, nodes, byLayer, visible, lookup, neighbors, family, edgesVisible
// — Layers —
export const LAYERS = ['function', 'component', 'foundation'];
export const KINDS = ['imports', 'styles', 'tokens'];
// — Queries —
export const nodes = () => raw.nodes.filter((n) => LAYERS.includes(n.layer));
export const byLayer = (layer) => raw.nodes.filter((n) => n.layer === layer);
export const visible = (on) => nodes().filter((n) => on.has(n.layer));
export const lookup = (id) => raw.nodes.find((n) => n.id === id) || null;
export function neighbors(id) {
  const out = raw.edges.filter((e) => e.from === id).map((e) => ({ ...e, node: lookup(e.to) }));
  const inn = raw.edges.filter((e) => e.to === id).map((e) => ({ ...e, node: lookup(e.from) }));
  return { out, in: inn };
}
export function family(id) {
  const self = lookup(id);
  if (!self) return [];
  const seen = new Set([id]);
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop();
    const outs = raw.edges.filter((e) => e.from === cur);
    outs.forEach((e) => {
      const peer = lookup(e.to);
      if (peer && peer.layer === self.layer && !seen.has(e.to)) {
        seen.add(e.to);
        stack.push(e.to);
      }
    });
  }
  return [...seen].map((x) => lookup(x)).filter((n) => n);
}
export function edgesVisible(ids, kinds) {
  const keep = (e) => kinds.has(e.kind) && ids.has(e.from) && ids.has(e.to);
  return raw.edges.filter(keep);
}
