/* ADAM/DS — ds/atlas/panel · layer-aware inspector with deep links
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-3] */
import { neighbors } from './schema.js';
// Exports: renderPanel
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const peerTitle = (e) => {
  if (e.node) return e.node.title;
  if (e.dir === 'out') return e.to;
  return e.from;
};
const peerCell = (e) => {
  if (e.node && e.node.route) return `<a href="${e.node.route}">${esc(e.node.title)}</a>`;
  return esc(peerTitle(e));
};
const edgeRow = (e) => {
  const arrow = e.dir === 'out' ? '→' : '←';
  return `<li><span class="atlas-kind">${e.kind}</span> ${arrow} ${peerCell(e)}</li>`;
};
const titles = (list) => list.map((e) => peerCell(e));
const cap = (cells) => {
  if (cells.length <= 12) return cells.join(', ') || '—';
  return `${cells.slice(0, 12).join(', ')} · +${cells.length - 12} more`;
};
const sameLayer = (all, layer) => all.filter((e) => e.node && e.node.layer === layer);
const ofKind = (all, kind) => all.filter((e) => e.kind === kind);
function layerBlock(node, all) {
  const ins = all.filter((e) => e.dir === 'in');
  const views = titles(sameLayer(all, 'view'));
  const toks = titles(ofKind(all, 'tokens'));
  if (node.layer === 'function') {
    const files = titles(sameLayer(ins, 'function'));
    const prod = `<dt>production</dt><dd>${cap(views)}</dd>`;
    const tokRow = `<dt>tokens</dt><dd>${cap(toks)}</dd>`;
    return `<dt>lab files</dt><dd>${cap(files)}</dd>${prod}${tokRow}`;
  }
  if (node.layer === 'component') {
    const made = titles(sameLayer(ins, 'component'));
    const owner = all.map((e) => e.node).find((n) => n && n.route);
    const page = owner ? `<a href="${owner.route}">${esc(owner.title)}</a>` : '—';
    const tokRow = `<dt>tokens</dt><dd>${cap(toks)}</dd>`;
    return `<dt>page</dt><dd>${page}</dd>${tokRow}<dt>importers</dt><dd>${cap(made)}</dd>`;
  }
  const pane = node.path.split('/').slice(2, 4).join('/');
  const tokRow = `<dt>tokens</dt><dd>${cap(toks)}</dd>`;
  const viewRow = `<dt>views</dt><dd>${cap(views)}</dd>`;
  return `<dt>pane</dt><dd class="tok">${esc(pane)}</dd>${tokRow}${viewRow}`;
}
export function renderPanel(node) {
  if (!node) return '<div class="atlas-empty">Select a node to inspect its connectors.</div>';
  const nb = neighbors(node.id);
  const out = nb.out.map((e) => ({ ...e, dir: 'out' }));
  const inn = nb.in.map((e) => ({ ...e, dir: 'in' }));
  const all = [...out, ...inn];
  const rows = all.slice(0, 40).map(edgeRow).join('');
  const route = node.route ? `<a href="${node.route}">${node.route}</a>` : '—';
  return [
    `<div class="atlas-phead"><strong>${esc(node.title)}</strong>`,
    `<button class="atlas-x" data-close="1" aria-label="Close inspector">✕</button></div>`,
    `<dl class="atlas-meta"><dt>path</dt><dd class="tok">${esc(node.path)}</dd>`,
    `<dt>layer</dt><dd>${esc(node.layer)}</dd><dt>route</dt><dd>${route}</dd>`,
    layerBlock(node, all),
    `</dl><h3>Connectors · ${out.length} out / ${inn.length} in</h3>`,
    `<ul class="atlas-edges">${rows || '<li>—</li>'}</ul>`,
  ].join('');
}
