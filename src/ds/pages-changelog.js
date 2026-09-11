/* ADAM/DS — Changelog archive, Miller columns. Plans → sprints → detail.
   Single source: .hermes/plans/*.md via import.meta.glob + git manifest
   — bidirectional: plan file → commits via [plan:file#anchor] trailer.
   Tags: closed taxonomy (changelog-tags.js); chips filter both columns (OR);
   Iter N derives from the FILTERED list — strictly client-side, dynamic. */
import { marked } from 'marked';
import { hits, badges, unlinked, commits } from './changelog-links.js';
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
    const cancelled = /✗/i.test(title); const done = /✓/i.test(title);
    name = name.replace(/✓\s*done\s*—?/i, '').replace(/✗\s*cancelled\s*—?/i, '').replace(/[✓✗]/g, '').trim().replace(/\.*$/, '.');
    const detail = lines.join(' ').replace(/\s+/g, ' ').trim();
    const flag = cancelled ? '<span class="ds-cancelled">✗ cancelled</span> — ' : (done ? '✓ done — ' : '');
    return `- [${done || cancelled ? 'x' : ' '}] **${num} ${name}** ${flag}${detail}`;
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
let active = new Set(); let day = ''; let sel = [0, 0]; let open = false; let stage = 'list'; // drawer: 'list' shows phases, 'tasks' shows a phase's detail
const visiblePlans = () => plans.filter((p) => (!active.size || p.tags.some((t) => active.has(t))) && (!day || p.date === day || commits.some((c) => c.plan === p.file && c.date === day)));
const visibleSprints = (plan) => {
  const ss = active.size ? plan.sprints.filter((s) => s.tags.some((t) => active.has(t))) : plan.sprints;
  return ss.length ? ss : plan.sprints;
};
const cur = () => { const list = visiblePlans(); const pi = Math.min(sel[0], Math.max(list.length - 1, 0)); const plan = list[pi]; const sprints = plan ? visibleSprints(plan) : []; return { list, pi, plan, sprints, si: Math.min(sel[1], Math.max(sprints.length - 1, 0)) }; };
export function render() {
  return `<p class="ds-crumb">Start · Archive</p><div class="ds-hero wide"><h1>What shipped, in order.</h1>`
    + `<p class="lede">Pick an iteration — phases slide in from the right. Source: the maturity plans, as-written. Commits cite <code>[plan:file#anchor]</code>.</p></div>`
    + `<div class="ds-graph" data-col="graph"></div>`
    + `<div class="ds-chips" data-col="chips"></div>`
    + `<div class="ds-plan-grid"><div class="ds-col" data-col="plan"></div></div>`
    + `<div class="ds-md" data-col="triage"></div>`
    + `<div class="ds-scrim" data-scrim hidden></div><span class="ds-cursor-tip" hidden role="tooltip"></span><aside class="ds-drawer" data-drawer hidden aria-label="Iteration detail"><div class="ds-rail" data-col="sprint"></div><div class="ds-task" data-col="tasks"></div></aside>`;
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
/* Contribution timeline: Sun–Sat week columns from the first logged day; blobs only where changes exist. */
const pDay = (s) => { const [y, mo, d] = s.split('-').map(Number); return new Date(y, mo - 1, d); };
const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const graph = () => {
  const dc = {}; commits.forEach((c) => { if (c.date) dc[c.date] = (dc[c.date] || 0) + 1; });
  const keys = Object.keys(dc).sort();
  const bounds = keys.concat(plans.map((p) => p.date).filter(Boolean)).sort(); // plan dates stretch the window over planned-ahead work
  if (!bounds.length) return '';
  const max = Math.max(...Object.values(dc), 1);
  const pad = 6 * 7 * 864e5; // six quiet weeks either side
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = pDay(bounds[0]); const last = pDay(bounds[bounds.length - 1]);
  const start = new Date(first.getTime() - pad); start.setDate(start.getDate() - start.getDay());
  const base = last > today ? last : today;
  const end = new Date(base.getTime() + pad); end.setDate(end.getDate() + (6 - end.getDay()));
  const weeks = []; const ws = new Date(start);
  while (ws <= end) { const col = []; for (let i = 0; i < 7; i++) { const d = new Date(ws); d.setDate(d.getDate() + i); col.push(d); } weeks.push(col); ws.setDate(ws.getDate() + 7); }
  const DOWS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const spans = []; // a month labels only its start-of-month week; leading edge columns fold into the first month — no one-week stubs
  let lead = 0;
  weeks.forEach((col) => {
    const first = col.find((d) => d.getDate() === 1);
    if (first) { spans.push({ mo: first.getMonth(), n: lead + 1 }); lead = 0; }
    else if (spans.length) spans[spans.length - 1].n++;
    else lead++;
  });
  const labels = spans.map((s) => `<span class="ds-month" style="width: calc(${s.n} * (var(--space-16) + var(--space-4)) - var(--space-4))">${MONTHS[s.mo]}</span>`).join('');
  const cols = weeks.map((col) => {
    const cells = col.map((d) => {
      const k = isoDay(d); const todayCls = k === isoDay(today) ? ' is-today' : ''; const num = d.getDate();
      if (d > today) return `<span class="ds-day is-future" data-tip="${fmtDate(k)} · upcoming">${num}</span>`;
      const n = dc[k] || 0;
      if (!n) return `<span class="ds-day${todayCls}" data-tip="${fmtDate(k)} · no changes">${num}</span>`;
      const lv = Math.min(4, Math.ceil((4 * n) / max));
      return `<button class="ds-day lv${lv}${day === k ? ' on' : ''}${todayCls}" data-day="${k}" data-tip="${n} change${n > 1 ? 's' : ''} · ${fmtDate(k)}" aria-pressed="${day === k}" aria-label="${n} changes on ${fmtDate(k)} — filter list"><span>${num}</span></button>`;
    }).join('');
    return `<div class="ds-week">${cells}</div>`;
  }).join('');
  const dows = `<div class="ds-dows" aria-hidden="true">${DOWS.map((d) => `<span>${d}</span>`).join('')}</div>`;
  return `<div class="ds-graph-labels">${labels}</div><div class="ds-graph-row" role="group" aria-label="Changes by day">${dows}${cols}</div><p class="ds-graph-cap">${commits.length} logged changes · click a day to filter${day ? ` · showing ${fmtDate(day)}` : ''}</p>`;
};
function paint(root) {
  const { list, pi, plan, sprints, si } = cur(); sel = [pi, si];
  const showAll = `<button class="ds-chip${(active.size || day) ? '' : ' on'}" data-tag="">All (${plans.length})</button>`;
  root.querySelector('[data-col="chips"]').innerHTML = showAll + counts.map(([t, n]) => `<button class="ds-chip${active.has(t) ? ' on' : ''}" data-tag="${t}" aria-pressed="${active.has(t)}">${t} (${n})</button>`).join('') + (day ? `<button class="ds-chip on" data-day-clear aria-label="Clear day filter">${fmtDate(day)} ✕</button>` : '');
  root.querySelector('[data-col="graph"]').innerHTML = graph();
  const scrim = root.querySelector('[data-scrim]'); const drawer = root.querySelector('[data-drawer]');
  if (!plan) { const nf = [active.size ? 'these tags' : '', day ? fmtDate(day) : ''].filter(Boolean).join(' · '); root.querySelector('[data-col="plan"]').innerHTML = `<p class="ds-note">Nothing matches ${nf || 'the archive'} yet.</p>`; root.querySelector('[data-col="sprint"]').innerHTML = ''; root.querySelector('[data-col="triage"]').innerHTML = unlinked(texts); drawer.hidden = true; scrim.hidden = true; return; }
  const sprint = sprints[si];
  const sprintDesc = (s) => { // exactly what the hover popover showed: the sprint's italic description line, untruncated
    const body = s.body.replace(/^## .*$/m, '');
    const para = body.split(/\n\n+/).map((b) => b.trim()).find((b) => b && !/^(#|\*Tags\*?|\*Shipped|- |\* |\d\. |\|)/.test(b)) || '';
    return para.replace(/^\*|\*$/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*`_]/g, '');
  };
  root.querySelector('[data-col="plan"]').innerHTML = list.map((p, i) => {
    const it = String(list.length - i).padStart(2, '0');
    const num = p.id || it; const frac = iterState(p.sprints);
    // span: start date+time → end; end date only if it differs, else end time
    const hcs = p.sprints.flatMap((s) => hits(p.file, s.body, p.sprints.indexOf(s) === 0));
    const valid = hcs.concat(commits.filter((c) => c.plan === p.file && !hcs.includes(c)));
    const tagged = valid.filter((c) => c.date === p.date || (c.time && c.date >= p.date)); // day-precision: keep same plan-day or later
    const last = tagged.length ? tagged.reduce((a, b) => (b.date + (b.time || '') > a.date + (a.time || '') ? b : a)) : null;
    const sd = fmtDate(p.date); const st = fmtTime(p.id);
    const endDate = last ? last.date : ''; const endTime = last && last.time ? fmtTime(last.time) : '';
    const endTxt = !endDate ? '' : (endDate !== p.date ? ' – ' + fmtDate(endDate) + (endTime ? ' ' + endTime : '') : (endTime && endTime !== st ? ' – ' + endTime : ''));
    const line1 = [sd + (st ? ' ' + st : '') + (endTxt ? ' ' + endTxt.trim() : ''), `${p.sprints.length} phases`, frac].filter(Boolean).join(' · ');
    return `<button class="ds-pick${i === sel[0] ? ' on' : ''}${done(frac) ? '' : ' is-open'}" data-tip="${esc(p.goal)}">`
      + `<span class="ds-row"><span class="ds-num">${num}</span><b>${p.label}</b><span class="ds-tags">${p.tags.join(' · ')}</span></span>`
      + `<small>${line1}</small></button>`;
  }).join('');
  root.querySelector('[data-col="sprint"]').innerHTML = sprints.map((s, i) => {
    const n = (s.head.match(/Phase (\d+)/) || [])[1] || String(i + 1);
    const hsS = hits(plan.file, s.body, plan.sprints.indexOf(s) === 0); const has = hsS.length ? ' · ' + hsS.length + ' commit' + (hsS.length > 1 ? 's' : '') : '';
    const frac = state(s.body);
    return `<button class="ds-pick${i === sel[1] ? ' on' : ''}${done(frac) ? '' : ' is-open'}" data-tip="${esc(sprintDesc(s))}">`
      + `<span class="ds-row"><span class="ds-num">Phase ${String(n).padStart(2, '0')}</span><b>${short(s.head)}</b></span>`
      + `<small>${[frac + has].filter(Boolean).join(' · ')}</small></button>`;
  }).join('')
    + `<div class="ds-rail-foot" data-foot>${esc(plan.goal || sprintDesc(sprint))}</div>`;
  const hs = hits(plan.file, sprint.body, plan.sprints.indexOf(sprint) === 0);
  root.querySelector('[data-col="tasks"]').innerHTML = `<div class="ds-drawer-head"><b>${short(sprint.head)}</b>`
    + `<button data-close aria-label="Close detail">✕</button></div>`
    + `<div class="ds-md">${marked.parse(sprint.body) + badges(hs)}</div>`;
  const u = unlinked(texts);
  root.querySelector('[data-col="triage"]').innerHTML = /All tracked/.test(u) ? '' : `<hr class="ds-hr">${u}`;
  if (open) { drawer.hidden = false; scrim.hidden = false; }
  else { drawer.hidden = true; scrim.hidden = true; }
}
export function mount(root) {
  open = false; stage = 'list'; paint(root);
  const onClick = (e) => {
    if (e.target.closest('[data-day-clear]')) { day = ''; sel = [0, 0]; paint(root); return; }
    const dd = e.target.closest('[data-day]');
    if (dd) { day = day === dd.dataset.day ? '' : dd.dataset.day; sel = [0, 0]; paint(root); return; }
    const chip = e.target.closest('.ds-chip');
    if (chip) { const t = chip.dataset.tag; if (!t) { active = new Set(); day = ''; } else { active.has(t) ? active.delete(t) : active.add(t); } sel = [0, 0]; paint(root); return; }
    if (e.target.closest('[data-close]') || e.target.closest('[data-scrim]')) { open = false; stage = 'list'; paint(root); return; }
    if (e.target.closest('[data-back]')) { stage = 'list'; paint(root); return; } // retained for safety; drawer no longer has a back button
    const st = e.target.closest('[data-step]');
    if (st && !st.disabled) { const c = cur(); sel = [c.pi, Math.min(Math.max(c.si + Number(st.dataset.step), 0), c.sprints.length - 1)]; open = true; paint(root); return; }
    const b = e.target.closest('.ds-pick'); if (!b) return;
    const col = b.closest('[data-col]'); const i = [...col.querySelectorAll('.ds-pick')].indexOf(b);
    if (col.dataset.col === 'plan') { sel = [i, sel[1]]; open = true; stage = 'tasks'; } else { sel = [sel[0], i]; stage = 'tasks'; }
    paint(root);
  };
  const onKey = (e) => { if (e.key === 'Escape' && open) { open = false; paint(root); } };
  const move = (e) => { // cursor-following popover for [data-tip]
    const el = e.target.closest('[data-tip]'); const tip = root.querySelector('.ds-cursor-tip');
    if (!tip) return;
    if (!el) { tip.hidden = true; return; }
    tip.textContent = el.dataset.tip; tip.hidden = false;
    const pad = 14; let x = e.clientX + pad, y = e.clientY + pad;
    const r = tip.getBoundingClientRect();
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - pad;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - pad;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  };
  root.addEventListener('click', onClick); document.addEventListener('keydown', onKey);
  root.addEventListener('mousemove', move); document.addEventListener('mouseleave', () => { const t = root.querySelector('.ds-cursor-tip'); if (t) t.hidden = true; });
  return () => { root.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); root.removeEventListener('mousemove', move); };
}
