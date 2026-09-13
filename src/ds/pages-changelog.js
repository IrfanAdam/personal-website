/* ADAM/DS — pages-changelog · composer+glob · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: render, mount — eager glob + hits contract preserved
import { hits } from './changelog-links.js';
import { commits } from './changelog-links.js';
import { TAGS, tagsFor, planTags, parseExplicit } from './changelog-tags.js';
import { h1Of, planSentence } from './changelog-titles.js';
import names from './changelog-names.json';
import { goal, split, parseMeta } from './changelog-parse.js';
import { paint } from './changelog-paint.js';

const raws = import.meta.glob('../../.hermes/plans/*.md', { query: '?raw', import: 'default', eager: true });
const entries = Object.entries(raws).sort(([a], [b]) => b.localeCompare(a));
const texts = Object.fromEntries(entries.map(([p, md]) => [p.split('/').pop(), md]));
const plans = entries.map(([p, md]) => {
  const file = p.split('/').pop();
  const { date, id, slug } = parseMeta(file);
  const h1 = h1Of(md), g = goal(md), nm = names[file] || {};
  const sprints = split(md), steer = parseExplicit(md.split(/^## /m)[0]);
  sprints.forEach((s) => { s.tags = tagsFor(s.head, s.body, steer); });
  return { file,
    date,
    id,
    slug,
    h1,
    title: nm.title || planSentence({ h1, goal: g, slug }),
    purpose: nm.purpose || '',
    goal: g,
    sprints,
    tags: planTags(md, sprints),
    raw: md };
}).filter((pl) => pl.sprints.length);
const counts = TAGS.map((t) => [t, plans.filter((p) => p.tags.includes(t)).length]).filter(([, n]) => n);
let active = new Set(), day = '', sel = [0, 0], open = false, stage = 'list';
const visiblePlans = () => plans
  .filter((p) => (!active.size || p.tags.some((t) => active.has(t)))
    && (!day || p.date === day || commits.some((c) => c.plan === p.file && c.date === day)));
const visibleSprints = (plan) => {
  const ss = active.size ? plan.sprints.filter((s) => s.tags.some((t) => active.has(t))) : plan.sprints;
  return ss.length ? ss : plan.sprints;
};
const cur = () => {
  const list = visiblePlans(), pi = Math.min(sel[0], Math.max(list.length - 1, 0));
  const plan = list[pi], sprints = plan ? visibleSprints(plan) : [];
  return { list, pi, plan, sprints, si: Math.min(sel[1], Math.max(sprints.length - 1, 0)) };
};
export function render() {
  return `<p class="ds-crumb">Start \u00b7 Archive</p><div class="ds-hero wide"><h1>What shipped, in order.</h1></div><hr class="ds-hr"><div class="ds-graph" data-col="graph"></div><div class="ds-chips" data-col="chips"></div><div class="ds-plan-grid"><div class="ds-col" data-col="plan"></div></div><div class="ds-md" data-col="triage"></div><div class="ds-scrim" data-scrim hidden></div><span class="ds-cursor-tip" hidden role="tooltip"></span><aside class="ds-drawer" data-drawer hidden aria-label="Iteration detail"><div class="ds-rail" data-col="sprint"></div><div class="ds-task" data-col="tasks"></div></aside>`;
}
function doPaint(root) {
  const { list, pi, plan, sprints, si } = cur();
  sel = [pi, si];
  paint(root, { list, pi, plan, sprints, si, active, day, sel, open, stage, counts, plans, texts });
}
export function mount(root) {
  open = false; stage = 'list'; doPaint(root);
  const onClick = (e) => {
    if (e.target.closest('[data-day-clear]')) { day = ''; sel = [0, 0]; doPaint(root); return; }
    const dd = e.target.closest('[data-day]'); if (dd) { day = day === dd.dataset.day ? '' : dd.dataset.day; sel = [0,
        0]; doPaint(root); return; }
    const chip = e
      .target
      .closest('.ds-chip');
    if (chip) { const t = chip.dataset.tag;
      if (!t) { active = new Set();
        day = '';
      } else { active.has(t) ? active.delete(t) : active.add(t);
      } sel = [0,
        0]; doPaint(root); return; }
    if (e.target.closest('[data-close]')
      || e.target.closest('[data-scrim]')) { open = false; stage = 'list'; doPaint(root); return; }
    if (e.target.closest('[data-back]')) { stage = 'list'; doPaint(root); return; }
    const st = e.target.closest('[data-step]');
    if (st && !st.disabled) { const c = cur(); sel = [c.pi,
        Math.min(Math.max(c.si + Number(st.dataset.step), 0),
          c.sprints.length - 1)]; open = true; doPaint(root); return; }
    const b = e.target.closest('.ds-pick'); if (!b) return;
    const col = b.closest('[data-col]'), i = [...col.querySelectorAll('.ds-pick')].indexOf(b);
    if (col.dataset.col === 'plan') { sel = [i,
        sel[1]]; open = true; stage = 'tasks'; } else { sel = [sel[0],
        i]; stage = 'tasks'; }
    doPaint(root);
  };
  const onKey = (e) => { if (e.key === 'Escape' && open) { open = false; doPaint(root); } };
  const move = (e) => {
    const el = e.target.closest('[data-tip]'), tip = root.querySelector('.ds-cursor-tip');
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
  root.addEventListener('mousemove',
    move); document.addEventListener('mouseleave',
    () => { const t = root.querySelector('.ds-cursor-tip'); if (t) t.hidden = true; });
  return () => { root.removeEventListener('click',
      onClick); document.removeEventListener('keydown',
      onKey); root.removeEventListener('mousemove',
      move); };
}
