/* ADAM/DS — ds/atlas/canvas · wires + nodes + emphasis
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase12] */
import { ARCY, COLX, colLabel, position } from './layout.js';
import { merged, wire } from './wire.js';
// Exports: paint, emphasis
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fx = (v) => v.toFixed(1);
const dot = (n, p, isDense, sel) => {
  const dense = isDense ? 1 : 0;
  const open = `<g class="atlas-node" data-layer="${n.layer}" data-node="${n.id}" data-dense="${dense}"`;
  const at = ` transform="translate(${fx(p.x)},${fx(p.y)})" tabindex="0" role="button"`;
  const aria = ` aria-label="${esc(n.title)} · ${esc(n.path)}"`;
  const shape = `<circle r="${isDense ? 3 : 4.5}"></circle>`;
  const label = `<text class="atlas-label" x="8" y="3.5">${esc(n.title)}</text></g>`;
  return `${open}${sel === n.id ? ' data-sel="1"' : ''}${at}${aria}>${shape}${label}`;
};
const labelRow = (layer, count, x, y) => {
  if (!count) return '';
  return `<text class="atlas-col" x="${x}" y="${y}">${colLabel(layer)} · ${count}</text>`;
};
const heads = (list) => ['function', 'component', 'foundation'].map((layer) => {
  const n = list.filter((node) => node.layer === layer).length;
  return labelRow(layer, n, COLX[layer], 18);
}).join('');
const arcHeads = (list) => ['foundation', 'component', 'function'].map((layer) => {
  const n = list.filter((node) => node.layer === layer).length;
  return labelRow(layer, n, 12, ARCY[layer] - 18);
}).join('');
const bandCols = (list, mode) => {
  if (mode === 'layered') return heads(list);
  if (mode === 'arc') return arcHeads(list);
  return '';
};
export function paint(svg, list, view) {
  const { pos, dense } = position(list, view.mode);
  const wires = merged(view.edges || []).map((e) => wire(e, pos, view.mode)).join('');
  const dots = list.map((n) => dot(n, pos.get(n.id), dense.has(n.id), view.sel)).join('');
  const cols = bandCols(list, view.mode);
  svg.innerHTML = `${cols}<g class="atlas-wires">${wires}</g>${dots}`;
}
// — Emphasis —
const touch = (near, focus, e) => {
  if (e.from === focus) near.add(e.to);
  if (e.to === focus) near.add(e.from);
};
const wireDim = (view, hit) => {
  if (hit) return '0';
  if (view.hits || view.deep) return '2';
  if (view.path) return '1';
  if (view.focus) return '1';
  return '0';
};
export function emphasis(svg, view, edges) {
  const { focus, sel, hits, path, pathEdges } = view;
  const near = new Set();
  if (focus) near.add(focus);
  (edges || []).forEach((e) => touch(near, focus, e));
  const keep = (own) => {
    if (near.has(own)) return true;
    if (path && path.has(own)) return true;
    return !!(hits && hits.has(own));
  };
  const dimOf = (own) => {
    if (keep(own)) return '0';
    if (hits) return '2';
    if (path) return '1';
    if (!focus) return '0';
    return view.deep ? '2' : '1';
  };
  svg.querySelectorAll('[data-node]').forEach((g) => {
    const own = g.getAttribute('data-node');
    g.setAttribute('data-hl', keep(own) ? '1' : '0');
    g.setAttribute('data-dim', dimOf(own));
    g.setAttribute('data-sel', own === sel ? '1' : '0');
    g.setAttribute('data-hit', hits && hits.has(own) ? '1' : '0');
    g.setAttribute('data-path', path && path.has(own) ? '1' : '0');
  });
  svg.querySelectorAll('[data-from]').forEach((p) => {
    const from = p.getAttribute('data-from');
    const to = p.getAttribute('data-to');
    const onPath = !!(pathEdges && pathEdges.has(`${from}>${to}`));
    const hit = onPath || (!!focus && (from === focus || to === focus));
    p.setAttribute('data-hl', hit ? '1' : '0');
    p.setAttribute('data-path', onPath ? '1' : '0');
    p.setAttribute('data-dim', wireDim(view, hit));
  });
}
