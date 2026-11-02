/* ADAM/DS — ds/changelog/paint-plan · build cards ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
// Exports: paintPlan — one card per plan: num · title · tags, then date ·
// phases · ruff, so the title never competes with its own metadata
import { fmtDate, fmtTime, buildState, isDone } from '../changelog-parse.js';
import { hits, commits, unlinked } from '../changelog-links.js';
import { clip } from '../changelog-titles.js';
import { planStatus } from './raw-detail.js';
import history from '../plan-history.json';
import { esc } from './esc.js';
const rangeOf = (p, last, st) => {
  const endDate = last ? last.date : '';
  const endTime = last && last.time ? fmtTime(last.time) : '';
  let out = '';
  if (endDate && endDate !== p.date) out = ` – ${fmtDate(endDate)}${endTime ? ` ${endTime}` : ''}`;
  else if (endTime && endTime !== st) out = ` – ${endTime}`;
  return `${fmtDate(p.date)}${st ? ` ${st}` : ''}${out}`;
};
const stateOf = (p, frac) => {
  const revs = history[p.file] || [];
  const rev = revs.length > 1 ? `rev ${revs.length}` : '';
  return [String(p.sprints.length) + ' phases', frac, rev].filter(Boolean).join(' · ');
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export function paintPlan(root, ctx) {
  const { list, pi, plan, sprints, si, active, day, sel, open, counts, plans, texts } = ctx;
  const scrim = root.querySelector('[data-scrim]'), drawer = root.querySelector('[data-drawer]');
  if (!plan) {
    const bits = [];
    if (active.size) bits.push('these tags');
    if (day) bits.push(fmtDate(day));
    const nf = bits.join(' · ');
    root.querySelector('[data-col="plan"]').innerHTML =
      `<p class="ds-note">Nothing matches ${nf || 'the changelog'} yet.</p>`;
    root.querySelector('[data-col="sprint"]').innerHTML = '';
    root.querySelector('[data-col="triage"]').innerHTML = unlinked(texts);
    drawer.hidden = true; scrim.hidden = true; return false;
  }
  root.querySelector('[data-col="plan"]').innerHTML = list.map((p, i) => {
    const seq = String(list.length - i).padStart(2, '0'), num = seq;
    const frac = buildState(p.sprints), st = fmtTime(p.id), pst = planStatus(p);
    const hcs = p.sprints.flatMap((s) => hits(p.file, s.body, p.sprints.indexOf(s) === 0));
    const valid = hcs.concat(commits.filter((c) => c.plan === p.file && !hcs.includes(c)));
    const tagged = valid.filter((c) => c.date === p.date || (c.time && c.date >= p.date));
    const last = tagged.length
      ? tagged.reduce((a, b) => (b.date + (b.time || '') > a.date + (a.time || '') ? b : a))
      : null;
    let cls = ' is-open is-pending';
    if (pst === 'done') cls = ' is-done';
    else if (pst === 'cancelled') cls = ' is-cancelled';
    const tags = p.tags.length ? p.tags.slice(0, 3).join(' · ') : 'untagged';
    return [
      `<button class="ds-pick${i === sel[0] ? ' on' : ''}${cls}" data-tip="`,
      esc(clip(p.goal, 100) || p.purpose || p.title),
      `"><span class="ds-row"><span class="ds-num">${esc(num)}</span>`,
      `<b>${esc(p.title)}</b><span class="ds-tags">${esc(tags)}</span></span>`,
      `<small><span class="ds-date">${esc(rangeOf(p, last, st))}</span>`,
      `<span class="ds-state">${esc(stateOf(p, frac))}</span></small></button>`,
    ].join('');
  }).join('');
  return true;
}
