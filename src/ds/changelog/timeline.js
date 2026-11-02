/* ADAM/DS — ds/changelog/timeline · model · [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: MERGE_GAP, isOpenSection, earliestDueOf, activeDatesOf, boutsOf, ghostOf — no DOM
// — Constants —
export const MERGE_GAP = 3;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const DAY = 86400000;
import { dueOf } from './due.js';
const CLOSED = /[✓✗]/;
const liveToday = () => new Date().toISOString().slice(0, 10);
const dayNum = (iso) => Date.parse(`${iso}T00:00:00Z`);
const isRealDay = (s) => ISO.test(s || '') && !Number.isNaN(dayNum(s));
const sectionsOf = (plan) => (plan && (plan.sprints || plan.sections)) || [];
// — Open sections —
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const isOpenSection = (s) => !CLOSED.test(String((s && s.head) || ''));
const dueOfSection = (s) => {
  try {
    return dueOf({ head: (s && s.head) || '', body: (s && s.body) || '' });
  } catch { return null; }
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const earliestDueOf = (plan) => {
  let best = null;
  for (const s of sectionsOf(plan)) {
    if (!isOpenSection(s)) continue;
    const d = dueOfSection(s);
    if (d && (!best || d < best)) best = d;
  }
  return best;
};
// — Active dates —
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const activeDatesOf = (plan = {}, commits = []) => {
  const out = new Set();
  if (isRealDay(plan.date)) out.add(plan.date);
  for (const c of commits || []) {
    if (c && c.plan === plan.file && isRealDay(c.date)) out.add(c.date);
  }
  return [...out].sort();
};
// — Bouts —
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const boutsOf = (dates = [], gap = MERGE_GAP) => {
  const sorted = [...new Set((dates || []).filter(isRealDay))].sort();
  const bouts = [];
  let cur = [];
  const flush = () => {
    if (!cur.length) return;
    const kind = cur.length > 1 ? 'streak' : 'sporadic';
    bouts.push({ kind, start: cur[0], end: cur[cur.length - 1], dates: cur });
    cur = [];
  };
  for (const d of sorted) {
    if (cur.length && (dayNum(d) - dayNum(cur[cur.length - 1])) / DAY > gap) flush();
    cur.push(d);
  }
  flush();
  return bouts;
};
// — Ghost —
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const ghostOf = (plan = {}, commits = [], todayISO) => {
  const today = isRealDay(todayISO) ? todayISO : liveToday();
  const due = earliestDueOf(plan);
  if (!due) return null;
  const active = activeDatesOf(plan, commits);
  const last = active.length ? active[active.length - 1] : null;
  const from = last && last > today ? last : today;
  return { from, to: due, overdue: due < today };
};
