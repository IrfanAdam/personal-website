/* ADAM/DS — changelog-paint · graph+paint · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
import { marked } from 'marked';
import { hits, badges, unlinked, commits } from './changelog-links.js';
import { shortPhase as short, provenance, descOf } from './changelog-titles.js';
import { MONTHS, fmtDate, fmtTime, pDay, isoDay, state, isDone, iterState } from './changelog-parse.js';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
export function graph({ plans, day }) {
  const dc = {};
  commits.forEach((c) => { if (c.date) dc[c.date] = (dc[c.date] || 0) + 1; });
  const keys = Object.keys(dc).sort();
  const bounds = keys.concat(plans.map((p) => p.date).filter(Boolean)).sort();
  if (!bounds.length) return '';
  const max = Math.max(...Object.values(dc), 1);
  const pad = 6 * 7 * 864e5;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = pDay(bounds[0]), last = pDay(bounds[bounds.length - 1]);
  const start = new Date(first.getTime() - pad); start.setDate(start.getDate() - start.getDay());
  const base = last > today ? last : today;
  const end = new Date(base.getTime() + pad); end.setDate(end.getDate() + (6 - end.getDay()));
  const weeks = [], ws = new Date(start);
  while (ws <= end) {
    const col = [];
    for (let i = 0; i < 7; i++) { const d = new Date(ws); d.setDate(d.getDate() + i); col.push(d); }
    weeks.push(col); ws.setDate(ws.getDate() + 7);
  }
  const DOWS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  const spans = []; let lead = 0;
  weeks.forEach((col) => {
    const f = col.find((d) => d.getDate() === 1);
    if (f) { spans.push({ mo: f.getMonth(), n: lead + 1 }); lead = 0; }
    else if (spans.length) spans[spans.length - 1].n++; else lead++;
  });
  const labels = spans.map((s) => `<span class="ds-month" style="width: calc(${s.n} * (var(--space-16) + var(--space-4)) - var(--space-4))">${MONTHS[s.mo]}</span>`).join('');
  const cols = weeks.map((col) => {
    const cells = col.map((d) => {
      const k = isoDay(d),
        todayCls = k === isoDay(today) ? ' is-today' : '',
        sound = k === isoDay(today) ? ' data-glitch-sound="5000-9000 hum"' : '';
      if (d > today) return `<span class="ds-day is-future" data-tip="${fmtDate(k)} \u00b7 upcoming"></span>`;
      const n = dc[k] || 0;
      if (!n) return `<span class="ds-day${todayCls}"${sound} data-tip="${fmtDate(k)} \u00b7 no changes"></span>`;
      const lv = Math.min(4, Math.ceil(4 * Math.sqrt(n / max)));
      return `<button class="ds-day lv${lv}${day === k ? ' on' : ''}${todayCls}"${sound} data-day="${k}" data-tip="${n} change${n > 1 ? 's' : ''} \u00b7 ${fmtDate(k)}" aria-pressed="${day === k}" aria-label="${n} changes on ${fmtDate(k)} \u2014 filter list"></button>`;
    }).join('');
    return `<div class="ds-week">${cells}</div>`;
  }).join('');
  const dows = `<div class="ds-dows" aria-hidden="true">${DOWS.map((d) => `<span>${d}</span>`).join('')}</div>`;
  return `<div class="ds-graph-labels">${labels}</div><div class="ds-graph-row" role="group" aria-label="Changes by day">${dows}${cols}</div>`;
}
export function paint(root, ctx) {
  const { list, pi, plan, sprints, si, active, day, sel, open, counts, plans, texts } = ctx;
  const showAll = `<button class="ds-chip${(active.size || day) ? '' : ' on'}" data-tag="">All (${plans.length})</button>`;
  const dayChip = day ? `<button class="ds-chip on" data-day-clear aria-label="Clear day filter">${fmtDate(day)} \u2715</button>` : '';
  root.querySelector('[data-col="chips"]').innerHTML = dayChip + showAll + counts.map(([t, n]) => `<button class="ds-chip${active.has(t) ? ' on' : ''}" data-tag="${t}" aria-pressed="${active.has(t)}">${t} (${n})</button>`).join('');
  const gEl = root.querySelector('[data-col="graph"]');
  if (!gEl.dataset.ready) { gEl.innerHTML = graph({ plans, day }); gEl.dataset.ready = '1'; }
  else { gEl.querySelectorAll('[data-day]').forEach((el) => { const k = el.dataset.day,
        on = k === day; el.classList.toggle('on',
          on); if (el.getAttribute('aria-pressed') !== String(on)) el.setAttribute('aria-pressed',
          String(on)); }); }
  const scrim = root.querySelector('[data-scrim]'), drawer = root.querySelector('[data-drawer]');
  if (!plan) {
    const nf = [active.size ? 'these tags' : '', day ? fmtDate(day) : ''].filter(Boolean).join(' \u00b7 ');
    root.querySelector('[data-col="plan"]').innerHTML = `<p class="ds-note">Nothing matches ${nf || 'the archive'} yet.</p>`;
    root
      .querySelector('[data-col="sprint"]')
      .innerHTML = '';
    root
      .querySelector('[data-col="triage"]')
      .innerHTML = unlinked(texts);
    drawer.hidden = true; scrim.hidden = true; return;
  }
  const sprint = sprints[si], sprintDesc = (s) => descOf(s.body);
  root.querySelector('[data-col="plan"]').innerHTML = list.map((p, i) => {
    const it = String(list.length - i).padStart(2, '0'), num = p.id || it, frac = iterState(p.sprints);
    const hcs = p.sprints.flatMap((s) => hits(p.file, s.body, p.sprints.indexOf(s) === 0));
    const valid = hcs.concat(commits.filter((c) => c.plan === p.file && !hcs.includes(c)));
    const tagged = valid.filter((c) => c.date === p.date || (c.time && c.date >= p.date));
    const last = tagged.length ? tagged.reduce((a,
        b) => (b.date + (b.time || '') > a.date + (a.time || '') ? b : a)) : null;
    const sd = fmtDate(p.date),
      st = fmtTime(p.id),
      endDate = last ? last.date : '',
      endTime = last && last.time ? fmtTime(last.time) : '';
    const endTxt = !endDate ? '' : (endDate !== p.date ? ' \u2013 ' + fmtDate(endDate) + (endTime ? ' ' + endTime : '') : (endTime
        && endTime !== st ? ' \u2013 ' + endTime : ''));
    const line1 = [sd + (st ? ' ' + st : '') + (endTxt ? ' ' + endTxt.trim() : ''), `${p.sprints.length} phases`, frac].filter(Boolean).join(' \u00b7 ');
    return `<button class="ds-pick${i === sel[0] ? ' on' : ''}${isDone(frac) ? '' : ' is-open'}" data-tip="${esc(p.goal)}"><span class="ds-row"><span class="ds-num">${num}</span><b>${esc(p.title)}</b><span class="ds-tags">${p.tags.join(' \u00b7 ')}</span></span><small>${line1}</small></button>`;
  }).join('');
  root.querySelector('[data-col="sprint"]').innerHTML = sprints.map((s, i) => {
    const n = (s.head.match(/Phase (\d+)/) || [])[1] || String(i + 1),
      hsS = hits(plan.file, s.body, plan.sprints.indexOf(s) === 0),
      has = hsS.length ? ' \u00b7 ' + hsS.length + ' commit' + (hsS.length > 1 ? 's' : '') : '',
      frac = state(s.body);
    return `<button class="ds-pick${i === sel[1] ? ' on' : ''}${isDone(frac) ? '' : ' is-open'}" data-tip="${esc(sprintDesc(s))}"><span class="ds-row"><span class="ds-num">Phase ${String(n).padStart(2, '0')}</span><b>${esc(short(s.head))}</b></span><small>${[frac + has].filter(Boolean).join(' \u00b7 ')}</small></button>`;
  }).join('') + `<p class="ds-commits" data-prov>${esc(provenance(plan))}</p><div class="ds-rail-foot" data-foot>${esc(plan.goal || sprintDesc(sprint))}</div>`;
  const hs = hits(plan.file, sprint.body, plan.sprints.indexOf(sprint) === 0);
  root.querySelector('[data-col="tasks"]').innerHTML = `<div class="ds-drawer-head"><b>${short(sprint.head)}</b><button data-close aria-label="Close detail">\u2715</button></div><div class="ds-md">${marked.parse(sprint.body) + badges(hs)}</div>`;
  const u = unlinked(texts);
  root.querySelector('[data-col="triage"]').innerHTML = /All tracked/.test(u) ? '' : `<hr class="ds-hr">${u}`;
  if (open) { drawer.hidden = false; scrim.hidden = false; } else { drawer.hidden = true; scrim.hidden = true; }
}
