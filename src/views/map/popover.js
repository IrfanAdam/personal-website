/* ADAM/PAGE — views/map/popover · cursor tooltip markup (node + edge + lane)
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-8] */
import { LINKS, KINDS, byId, groupOf, membersOf } from './data.js';
// Exports: nodeTipHTML, edgeTipHTML
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const kindLabel = (k) => (KINDS[k] || {}).label || k;
const rel = (e, dir) => {
  const peer = dir === 'out' ? byId(e.to) : byId(e.from);
  const arrow = dir === 'out' ? '→' : '←';
  const fallback = dir === 'out' ? e.to : e.from;
  const name = esc(peer ? peer.label : fallback);
  const icon = `<i data-kind="${e.kind}"></i>${arrow} ${name}`;
  return `<span class="map-rel">${icon}<em>${esc(e.label)}</em></span>`;
};
const list = (title, rows) => {
  if (!rows.length) return '';
  return `<span class="map-rel-label">${title} (${rows.length})</span>${rows.join('')}`;
};
export function nodeTipHTML(n) {
  const g = groupOf(n);
  const out = LINKS.filter((e) => e.from === n.id).map((e) => rel(e, 'out'));
  const inn = LINKS.filter((e) => e.to === n.id).map((e) => rel(e, 'in'));
  const head = `<strong>${esc(n.label)}</strong><em>${esc(n.desc)}</em>`;
  const meta = `<em>${esc(n.file)} · ${esc(kindLabel(n.kind))} · ${esc(g ? g.label : n.group)} — ${esc(n.sub)}</em>`;
  return `${head}<span class="map-rels">${list('wires out', out)}${list('wires in', inn)}</span>${meta}`;
}
export function edgeTipHTML(e) {
  const a = byId(e.from);
  const b = byId(e.to);
  const from = esc(a ? a.label : e.from);
  const to = esc(b ? b.label : e.to);
  const kind = (KINDS[e.kind] && kindLabel(e.kind)) || e.kind;
  const label = esc(e.label);
  return `<strong>${from} → ${to}</strong><em>${label}</em><em>${e.kind} edge</em>`;
}
export const groupTipHTML = (g) => {
  const n = membersOf(g).length;
  return `<strong>${esc(g.label)}</strong><em>${esc(g.sub)}</em><em>${n} modules · drag the header to move</em>`;
};
