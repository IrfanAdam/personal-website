/* ADAM/DS — Changelog archive, Miller columns. Plans → sprints → detail.
   Single source: .hermes/plans/*.md via import.meta.glob + git manifest
   — bidirectional: plan file → commits via [plan:file#anchor] trailer. */
import { marked } from 'marked';
import { hits, badges, unlinked } from './changelog-links.js';
const raws = import.meta.glob('../../.hermes/plans/*.md', { query: '?raw', import: 'default', eager: true });
const chunks = (md) => md.split(/^## /m);
const goal = (md) => (md.match(/\*\*Goal:\*\*\s*([\s\S]+?)(?:\n\s*\n|$)/) || [])[1]?.trim() || '';
const short = (h) => h.replace(/^Phase \d+ [·—–-]\s*/, '');
const norm = (body) => {
  if (/^- \[[ xX]\]/m.test(body)) return body;
  const parts = body.split(/^### /m); const head = parts.shift();
  const items = parts.map((p) => {
    const lines = p.split('\n'); const title = lines.shift().trim();
    const m = title.match(/^Task\s+([\d-]+):\s*(.+)$/); const num = m ? m[1] : ''; let name = m ? m[2] : title;
    const done = /✓/i.test(title); name = name.replace(/✓\s*done\s*—?/i, '').replace(/✓/g, '').trim().replace(/\.*$/, '.');
    const detail = lines.join(' ').replace(/\s+/g, ' ').trim();
    return `- [${done ? 'x' : ' '}] **${num} ${name}** ${done ? '✓ done — ' : ''}${detail}`;
  }); return head + items.join('\n');
};
const split = (md) => chunks(md).slice(1).map((s) => {
  const nl = s.indexOf('\n'); return { head: s.slice(0, nl).trim(), body: norm('## ' + s) };
}).filter((s) => /^Phase /.test(s.head));
const state = (body) => {
  const d = (body.match(/- \[x\]/gi) || []).length; const t = (body.match(/- \[ \]/g) || []).length;
  return d + t ? `${d}/${d + t}` : '';
};
const iterState = (ss) => {
  let d = 0, t = 0; ss.forEach((s) => { const m = state(s.body).match(/(\d+)\/(\d+)/); if (m) { d += Number(m[1]); t += Number(m[2]); } });
  return t ? `${d}/${t}` : '';
};
const parseMeta = (file) => {
  let m = file.match(/^(\d{4}-\d{2}-\d{2})[_-](\d{5,6})[_-](.+)\.md$/);
  if (m) return { date: m[1], id: m[2], slug: m[3] };
  m = file.match(/^(\d{4}-\d{2}-\d{2})[_-](.+)\.md$/);
  if (m) return { date: m[1], id: '', slug: m[2] };
  return { date: '', id: '', slug: file.replace(/\.md$/, '') };
};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtDate = (iso) => {
  if (!iso) return '';
  const [y, mo, d] = iso.split('-').map(Number);
  if (!y || !mo || !d) return iso;
  return `${String(d).padStart(2,'0')} ${MONTHS[mo - 1]} ${y}`;
};
const fmtTime = (id) => {
  if (!/^\d{6}$/.test(id)) return id;
  return `${id.slice(0,2)}:${id.slice(2,4)}`;
};
const labelOf = (file, md) => {
  const h1 = (md.match(/^#\s+(.+)$/m) || [])[1] || '';
  const { slug } = parseMeta(file);
  const pretty = slug.replace(/[_-]/g, ' ').trim();
  if (!h1) return pretty;
  return `${pretty} — ${h1.slice(0, 42)}`;
};
const entries = Object.entries(raws).sort(([a], [b]) => b.localeCompare(a));
const texts = Object.fromEntries(entries.map(([p, md]) => [p.split('/').pop(), md]));
const plans = entries.map(([p, md]) => {
  const file = p.split('/').pop(); const { date, id, slug } = parseMeta(file);
  return { file, date, id, slug, label: labelOf(file, md), goal: goal(md), sprints: split(md), raw: md };
}).filter((pl) => pl.sprints.length);
let sel = [0, 0];
export function render() {
  return `<p class="ds-crumb">Start · Archive</p><div class="ds-hero wide"><h1>What shipped, in order.</h1>`
    + `<p class="lede">Pick a phase — detail opens in the next column. Source: the maturity plans, as-written. Commits cite <code>[plan:file#anchor]</code>.</p></div>`
    + `<div class="ds-miller"><div class="ds-col" data-col="plan"></div><div class="ds-col" data-col="sprint"></div><div class="ds-detail" data-col="detail"></div></div>`;
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const btn = (label, subs, on, tip = '') => {
  const sm = (Array.isArray(subs) ? subs : subs ? [subs] : []).filter(Boolean).map((s) => `<small>${s}</small>`).join('');
  return `<button class="ds-pick${on ? ' on' : ''}"><b>${label}</b>${sm}${tip ? `<span class="ds-tip" role="tooltip">${esc(tip)}</span>` : ''}</button>`;
};
function paint(root) {
  const [pi, si] = sel; const plan = plans[pi] || plans[0]; const sprint = plan?.sprints[si] || plan?.sprints[0];
  if (!plan || !sprint) { root.querySelector('[data-col="detail"]').innerHTML = unlinked(texts); return; }
  root.querySelector('[data-col="plan"]').innerHTML = plans.map((p, i) => {
    const it = String(plans.length - i).padStart(2, '0');
    const num = p.id || it;
    const line1 = [`${p.sprints.length} phases`, iterState(p.sprints)].filter(Boolean).join(' · ');
    const d = fmtDate(p.date); const t = fmtTime(p.id);
    const line2 = p.id && /^\d{6}$/.test(p.id) ? [`Iteration ${it}`, d, t].filter(Boolean).join(' · ') : [`Iteration ${it}`, d].filter(Boolean).join(' · ');
    return btn(`<span class="ds-num">${num}</span>${p.label}`, [line1, line2], i === pi, p.goal);
  }).join('');
  root.querySelector('[data-col="sprint"]').innerHTML = plan.sprints.map((s, i) => {
    const n = (s.head.match(/Phase (\d+)/) || [])[1] || String(i + 1);
    const hs = hits(plan.file, s.body, i === 0); const has = hs.length ? ' · ' + hs.length + ' commit' + (hs.length > 1 ? 's' : '') : '';
    return btn(`<span class="ds-num">Phase ${String(n).padStart(2, '0')}</span>${short(s.head)}`, state(s.body) + has, i === si);
  }).join('');
  const hs = hits(plan.file, sprint.body, si === 0);
  const extra = (() => { const u = unlinked(texts); return /All tracked/.test(u) ? '' : `<hr class="ds-hr">${u}`; })();
  root.querySelector('[data-col="detail"]').innerHTML = `<div class="ds-col wide"><div class="ds-md">${marked.parse(sprint.body)}${badges(hs)}${extra}</div></div>`;
}
export function mount(root) {
  paint(root);
  const onClick = (e) => {
    const b = e.target.closest('.ds-pick'); if (!b) return;
    const i = [...b.parentElement.children].indexOf(b);
    sel = b.parentElement.dataset.col === 'plan' ? [i, 0] : [sel[0], i]; paint(root);
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
