/* ADAM/DS — ds/changelog/tl-meta · lane + popover metadata ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: plain, dPart, spanText, laneMeta — one payload feeds bar tooltips,
// the popover and the drawer rail, so no surface invents its own wording.
import { isSealed, planStatus } from './raw-detail.js';
import { dueOf } from './due.js';
import history from '../plan-history.json';

export const plain = (s) => String(s || '')
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/^\s*#{1,6}\s+/gm, '')
  .replace(/[*_`>|]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const month = (d, m) => `${d} ${m}`;
export const dPart = (k) => {
  const d = new Date(`${k}T00:00:00`);
  return { t: month(d.getDate(), d.toLocaleString('en', { month: 'short' })), y: d.getFullYear() };
};
export const spanText = (s, e) => {
  const a = dPart(s), b = dPart(e);
  if (s === e) return `${a.t} ${a.y}`;
  return a.y === b.y ? `${a.t} – ${b.t} ${b.y}` : `${a.t} ${a.y} – ${b.t} ${b.y}`;
};
const taskCount = (p) => (p.sprints || [])
  .reduce((n, s) => n + (String(s.body || '').match(/^- \[[ xX]\]/gm) || []).length, 0);
const dueOfPlan = (p) => {
  const open = (p.sprints || []).filter((s) => !isSealed(s));
  for (const s of open) {
    const d = dueOf({ head: s.head, body: s.body });
    if (d) return d;
  }
  return '';
};
const ST = { done: 'Done', cancelled: 'Cancelled', incomplete: 'In progress' };
// One date line for the popover: started · modified · status · due, interpunct
// separated, so a lane never stacks three separate date rows.
const dateLine = (p, end, st, due) => {
  const bits = [];
  if (p.date) bits.push(`Started ${dPart(p.date).t}`);
  if (p.date && end && end !== p.date) bits.push(`Modified ${dPart(end).t}`);
  bits.push(st);
  if (due) bits.push(`Due ${dPart(due).t}`);
  return bits.join(' · ');
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const laneMeta = (p, commits = []) => {
  const sprints = p.sprints || [];
  const ph = sprints.filter(isSealed).length;
  const mine = (commits || []).filter((c) => c && c.plan === p.file);
  const ps = planStatus(p);
  const last = mine.reduce((m, c) => (c.date && c.date > m ? c.date : m), '');
  const end = last && last > p.date ? last : p.date;
  const revs = (history[p.file] || []).length;
  const revTxt = revs === 1 ? '1 rev' : `${revs} revs`;
  const st = ps === 'done' ? `Done ${dPart(end).t}` : ST[ps];
  const due = dueOfPlan(p);
  return {
    title: p.title || p.file,
    desc: plain(p.goal).slice(0, 220) || plain(p.purpose),
    ph: `${ph}/${sprints.length}`,
    tk: String(taskCount(p)),
    cm: String(mine.length),
    rv: revs,
    revTxt,
    dates: dateLine(p, end, st, due),
  };
};
