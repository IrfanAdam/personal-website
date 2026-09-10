/* ADAM/DS — Changelog archive, Miller columns. Plans → sprints → detail.
   Single source: .hermes/plans/*.md via import.meta.glob + git manifest
   — bidirectional: plan file → commits via [plan:file#anchor] trailer.
   Tags: closed taxonomy (changelog-tags.js); chips filter both columns (OR);
   Iter N derives from the FILTERED list — strictly client-side, dynamic. */
import { marked } from 'marked';
import { hits, badges, unlinked } from './changelog-links.js';
import { TAGS, tagsFor, planTags, parseExplicit } from './changelog-tags.js';
const raws = import.meta.glob('../../.hermes/plans/*.md', { query: '?raw', import: 'default', eager: true });
const chunks = (md) => md.split(/^## /m);
const goal = (md) => (md.match(/\*\*Goal:\*\*\s*([\s\S]+?)(?:\n\s*\n|$)/) || [])[1]?.trim() || '';
const short = (h) => h.replace(/^Phase \d+ [·—–-]\s*/, '').replace(/\s*\{#.*\}\s*$/, '');
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
const done = (frac) => { const m = String(frac || '').match(/(\d+)\/(\d+)/); return !!m && Number(m[2]) > 0 && Number(m[1]) === Number(m[2]); };
const iterState = (ss) => {
  let d = 0, t = 0; ss.forEach((s) => { const m = state(s.body).match(/(\d+)\/(\d+)/); if (m) { d += Number(m[1]); t += Number(m[2]); } }); return t ? `${d}/${t}` : '';
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
  if (!iso) return ''; const [y, mo, d] = iso.split('-').map(Number);
  if (!y || !mo || !d) return iso; return `${String(d).padStart(2,'0')} ${MONTHS[mo - 1]} ${y}`;
};
const fmtTime = (id) => (/^\d{6}$/.test(id) ? `${id.slice(0,2)}:${id.slice(2,4)}` : id);
const labelOf = (file, md) => {
  const h1 = (md.match(/^#\s+(.+)$/m) || [])[1] || '';
  const pretty = parseMeta(file).slug.replace(/[_-]/g, ' ').trim();
  return h1 ? `${pretty} — ${h1.slice(0, 42)}` : pretty;
};
const entries = Object.entries(raws).sort(([a], [b]) => b.localeCompare(a));
const texts = Object.fromEntries(entries.map(([p, md]) => [p.split('/').pop(), md]));
const plans = entries.map(([p, md]) => {
  const file = p.split('/').pop(); const { date, id, slug } = parseMeta(file);
  const sprints = split(md); const steer = parseExplicit(md.split(/^## /m)[0]);
  sprints.forEach((s) => { s.tags = tagsFor(s.head, s.body, steer); });
  return { file, date, id, slug, label: labelOf(file, md), goal: goal(md), sprints, tags: planTags(md, sprints), raw: md };
}).filter((pl) => pl.sprints.length);
const counts = TAGS.map((t) => [t, plans.filter((p) => p.tags.includes(t)).length]).filter(([, n]) => n);
let active = new Set(); let sel = [0, 0];
const visiblePlans = () => (active.size ? plans.filter((p) => p.tags.some((t) => active.has(t))) : plans);
const visibleSprints = (plan) => {
  const ss = active.size ? plan.sprints.filter((s) => s.tags.some((t) => active.has(t))) : plan.sprints;
  return ss.length ? ss : plan.sprints;
};
export function render() {
  return `<p class="ds-crumb">Start · Archive</p><div class="ds-hero wide"><h1>What shipped, in order.</h1>`
    + `<p class="lede">Pick a phase — detail opens in the next column. Source: the maturity plans, as-written. Commits cite <code>[plan:file#anchor]</code>.</p></div>`
    + `<div class="ds-chips" data-col="chips"></div>`
    + `<div class="ds-miller"><div class="ds-col" data-col="plan"></div><div class="ds-col" data-col="sprint"></div><div class="ds-detail" data-col="detail"></div></div>`;
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const tagline = (tags) => (tags.length ? `<small>${tags.join(' · ')}</small>` : '');
const btn = (label, subs, on, tip = '', cls = '') => {
  const sm = (Array.isArray(subs) ? subs : subs ? [subs] : []).filter(Boolean).map((s) => `<small>${s}</small>`).join('');
  return `<button class="ds-pick${on ? ' on' : ''}${cls ? ` ${cls}` : ''}"><b>${label}</b>${sm}${tip ? `<span class="ds-tip" role="tooltip">${esc(tip)}</span>` : ''}</button>`;
};
function paint(root) {
  const list = visiblePlans();
  sel = [Math.min(sel[0], Math.max(list.length - 1, 0)), sel[1]];
  const plan = list[sel[0]]; const showAll = `<button class="ds-chip${active.size ? '' : ' on'}" data-tag="">All (${plans.length})</button>`;
  root.querySelector('[data-col="chips"]').innerHTML = showAll + counts.map(([t, n]) => `<button class="ds-chip${active.has(t) ? ' on' : ''}" data-tag="${t}" aria-pressed="${active.has(t)}">${t} (${n})</button>`).join('');
  if (!plan) { root.querySelector('[data-col="plan"]').innerHTML = '<p class="ds-note">No plans carry these tags yet.</p>'; root.querySelector('[data-col="sprint"]').innerHTML = ''; root.querySelector('[data-col="detail"]').innerHTML = unlinked(texts); return; }
  const sprints = visibleSprints(plan); sel[1] = Math.min(sel[1], sprints.length - 1);
  const sprint = sprints[sel[1]];
  root.querySelector('[data-col="plan"]').innerHTML = list.map((p, i) => {
    const it = String(list.length - i).padStart(2, '0');
    const num = p.id || it; const frac = iterState(p.sprints);
    const line1 = [`${p.sprints.length} phases`, frac].filter(Boolean).join('·');
    const d = fmtDate(p.date); const t = fmtTime(p.id);
    const line2 = [`Iter ${it}`, d, t].filter(Boolean).join('·');
    return btn(`<span class="ds-num">${num}</span>${p.label}`, [line2, line1, p.tags.join(' · ')], i === sel[0], p.goal, done(frac) ? '' : 'is-open');
  }).join('');
  root.querySelector('[data-col="sprint"]').innerHTML = sprints.map((s, i) => {
    const n = (s.head.match(/Phase (\d+)/) || [])[1] || String(i + 1);
    const hs = hits(plan.file, s.body, plan.sprints.indexOf(s) === 0); const has = hs.length ? '·' + hs.length + ' commit' + (hs.length > 1 ? 's' : '') : '';
    const frac = state(s.body);
    return btn(`<span class="ds-num">Phase ${String(n).padStart(2, '0')}</span>${short(s.head)}`, [frac + has, s.tags.join(' · ')], i === sel[1], '', done(frac) ? '' : 'is-open');
  }).join('');
  const hs = hits(plan.file, sprint.body, plan.sprints.indexOf(sprint) === 0);
  const extra = (() => { const u = unlinked(texts); return /All tracked/.test(u) ? '' : `<hr class="ds-hr">${u}`; })();
  root.querySelector('[data-col="detail"]').innerHTML = `<div class="ds-col wide"><div class="ds-md">${marked.parse(sprint.body)}${badges(hs)}${extra}</div></div>`;
}
export function mount(root) {
  paint(root);
  const onClick = (e) => {
    const chip = e.target.closest('.ds-chip');
    if (chip) { const t = chip.dataset.tag; if (!t) active = new Set(); else { active.has(t) ? active.delete(t) : active.add(t); } sel = [0, 0]; paint(root); return; }
    const b = e.target.closest('.ds-pick'); if (!b) return;
    const i = [...b.parentElement.children].indexOf(b);
    sel = b.parentElement.dataset.col === 'plan' ? [i, 0] : [sel[0], i]; paint(root);
  };
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
