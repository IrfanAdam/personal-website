/* ADAM/DS — ds/atlas/panel · layer schema detail + connectors + import path
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-6] */
import { neighbors, lookup } from './schema.js';
// Exports: renderPanel
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cap = (cells) => {
  if (cells.length <= 12) return cells.join(', ') || '—';
  return `${cells.slice(0, 12).join(', ')} · +${cells.length - 12} more`;
};
const link = (n) => {
  if (!n) return esc('—');
  if (n.route) return `<a href="${n.route}">${esc(n.title)}</a>`;
  return esc(n.title);
};
const peerName = (n) => (n ? link(n) : '—');
const peer = (e) => {
  if (e.node) return peerName(e.node);
  return esc(e.to || e.from);
};
const peerList = (list) => cap(list.map(peer));
const sameLayer = (all, group) => all.filter((e) => e.node && group.includes(e.node.layer));
// token evidence: self + 1 hop through style nodes (lab → styles/<lab>.css → var names)
// exclude the canonical tokens.css hub — it would slurp in every token in the system
function tokensFor(node, all) {
  const styles = sameLayer(all, ['style']).map((e) => e.node)
    .filter((s) => s.path !== 'src/styles/tokens.css');
  const hops = styles.flatMap((s) => neighbors(s.id).in.concat(neighbors(s.id).out))
    .filter((e) => e.node && e.node.layer === 'style' && e.node.id !== node.id);
  const names = new Set(node.tokens || []);
  [node, ...styles, ...hops.map((e) => e.node)].forEach((n) => (n.tokens || []).forEach((t) => names.add(t)));
  return [...names].sort();
}
function section(title, body) {
  if (!body) return '';
  return `<h3>${title}</h3><dl class="atlas-meta">${body}</dl>`;
}
function layerBlock(node, all) {
  const toks = tokensFor(node, all);
  if (node.layer === 'function') {
    const files = sameLayer(all, ['function']).filter((e) => e.node.id !== node.id);
    const prod = sameLayer(all, ['view']);
    return section('Schema', `<dt>lab files</dt><dd>${peerList(files)}</dd>`
      + `<dt>production</dt><dd>${peerList(prod)}</dd>`
      + `<dt>tokens</dt><dd class="tok">${cap(toks)}</dd>`);
  }
  if (node.layer === 'component') {
    const made = sameLayer(all.filter((e) => e.dir === 'in'), ['component']);
    const owner = all.map((e) => e.node).find((n) => n && n.route);
    return section('Schema', `<dt>page</dt><dd>${link(owner)}</dd>`
      + `<dt>tokens</dt><dd class="tok">${cap(toks)}</dd>`
      + `<dt>importers</dt><dd>${peerList(made)}</dd>`);
  }
  const pane = node.path.split('/').slice(2, 4).join('/');
  const views = sameLayer(all, ['view']);
  return section('Schema', `<dt>pane</dt><dd class="tok">${esc(pane)}</dd>`
    + `<dt>tokens</dt><dd class="tok">${cap(toks)}</dd>`
    + `<dt>views</dt><dd>${peerList(views)}</dd>`);
}
// — Import path (shift-click chain, BFS over imports) —
const hop = (id, i) => {
  const n = lookup(id);
  if (!n) return '';
  const tag = `<span class="atlas-kind">${esc(n.layer)}</span>`;
  return `<li><span class="atlas-hop">${i + 1}</span> ${esc(n.title)} ${tag}</li>`;
};
function pathBlock(info) {
  if (!info) return '';
  if (!info.ids.length) {
    return '<h3>Import path</h3><p class="atlas-empty">No import chain between these two nodes.</p>';
  }
  const rows = info.ids.map(hop).join('');
  return `<h3>Import path · ${info.hops} hops</h3><ul class="atlas-edges atlas-hops">${rows}</ul>`;
}
export function renderPanel(node, pathInfo) {
  if (!node) return '<div class="atlas-empty">Select a node to inspect its connectors.</div>';
  const nb = neighbors(node.id);
  const out = nb.out.map((e) => ({ ...e, dir: 'out' }));
  const inn = nb.in.map((e) => ({ ...e, dir: 'in' }));
  const all = [...out, ...inn];
  const rows = all.slice(0, 40).map((e) => {
    const arrow = e.dir === 'out' ? '→' : '←';
    return `<li><span class="atlas-kind">${e.kind}</span> ${arrow} ${peer(e)}</li>`;
  }).join('');
  const route = node.route ? `<a href="${node.route}">${node.route}</a>` : '—';
  return [
    `<div class="atlas-phead"><strong>${esc(node.title)}</strong>`,
    `<button class="atlas-x" data-close="1" aria-label="Close inspector">✕</button></div>`,
    `<dl class="atlas-meta"><dt>path</dt><dd class="tok">${esc(node.path)}</dd>`,
    `<dt>layer</dt><dd>${esc(node.layer)}</dd><dt>route</dt><dd>${route}</dd></dl>`,
    layerBlock(node, all),
    pathBlock(pathInfo),
    `<h3>Connectors · ${out.length} out / ${inn.length} in</h3>`,
    `<ul class="atlas-edges">${rows || '<li>—</li>'}</ul>`,
  ].join('');
}
