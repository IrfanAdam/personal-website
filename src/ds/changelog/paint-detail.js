/* ADAM/DS — ds/changelog/paint-detail · rail + raw detail ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-8] */
// Exports: paintDetail — rail (plan head + phase picks + goal foot) and the
// raw section pane (crumb → title → status → due → body → evals → commits)
import { hits, badges, orphans, unlinked } from '../changelog-links.js';
import { shortPhase as short, provenance, descOf, clip } from '../changelog-titles.js';
import { isDone, state } from '../changelog-parse.js';
import { esc } from './esc.js';
import { orphanRail } from './raw-detail.js';
import { renderSection } from './render-section.js';
import { sectionRaw } from './sec-raw.js';
import { suffixOf } from './sec-status.js';
import { renderEvals } from './panels.js';
import { parseGates } from './gates.js';
import { dueOf } from './due.js';
import { drawerHeadHtml, railHeadHtml } from './drawer-head.js';
import history from '../plan-history.json';
const gateTag = (head, body) => {
  const g = parseGates(head, body);
  if (!g) return '';
  let v = 'GATE OPEN';
  if (g.verdict === 'passed') v = 'GATE PASSED';
  else if (g.verdict === 'failed') v = 'GATE FAILED';
  if (!g.revCount) return v;
  return `${v} · ${g.revCount} rev${g.revCount > 1 ? 's' : ''}`;
};
const railHead = (plan, seq) => railHeadHtml(plan, seq);
const dueLine = (sprint) => {
  if (isDone(state(sprint.body)) || /✗/.test(sprint.head)) return '';
  const d = dueOf({ head: sprint.head, body: sprint.body });
  return d ? `<p class="ds-due">Deadline · ${esc(d)}</p>` : '';
};
const crumbOf = (plan) => {
  const tags = plan.tags || [];
  if (!tags.length) return '';
  const more = tags.length > 2 ? ` · +${tags.length - 2}` : '';
  return `<p class="ds-crumb">${esc(tags.slice(0, 2).join(' · '))}${more}</p>`;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export function paintDetail(root, ctx) {
  const { list, pi, plan, sprints, si, sel, open, stage, texts } = ctx;
  const scrim = root.querySelector('[data-scrim]'), drawer = root.querySelector('[data-drawer]');
  const sprint = sprints[si], sprintDesc = (s) => descOf(s.body);
  const seq = String(Math.max(list.length - pi, 1)).padStart(2, '0');
  const picks = sprints.map((s, i) => {
    const n = (s.head.match(/Phase (\d+)/) || [])[1] || String(i + 1);
    const hsS = hits(plan.file, s.body, plan.sprints.indexOf(s) === 0);
    const frac = state(s.body), done = isDone(frac), cancelled = /✗/.test(s.head);
    const gate = gateTag(s.head, s.body);
    const meta = [frac, hsS.length ? `${hsS.length} commit${hsS.length > 1 ? 's' : ''}` : '',
      gate].filter(Boolean).join(' · ');
    let cls = ' is-open is-pending';
    if (done) cls = ' is-done';
    else if (cancelled) cls = ' is-cancelled';
    return [
      `<button class="ds-pick${i === sel[1] ? ' on' : ''}${cls}" data-tip="`,
      esc(clip(sprintDesc(s), 100)),
      `"><span class="ds-row"><span class="ds-num">Phase ${String(n).padStart(2, '0')}</span>`,
      `<b>${esc(short(s.head))}</b></span><small>${esc(meta)}</small></button>`,
    ].join('');
  }).join('');
  root.querySelector('[data-col="sprint"]').innerHTML = railHead(plan, seq) + picks + [
    `<p class="ds-commits" data-prov>${esc(provenance(plan))}</p>`,
    `<div class="ds-rail-foot" data-foot>${esc(plan.goal || sprintDesc(sprint))}</div>`,
  ].join('');
  const sii = plan.sprints.indexOf(sprint);
  const hs = hits(plan.file, sprint.body, sii === 0);
  const raw = sectionRaw(texts[plan.file] || '', sprint.head);
  const suffix = suffixOf(sprint.head, raw);
  const frac = state(sprint.body);
  const sec = raw
    ? renderSection(raw, { suffix, frac })
    : renderSection(`## ${sprint.head}\n${sprint.body}`, { suffix, frac });
  const evals = renderEvals(plan.file, sprint.head, sprint.body, history);
  const commitsHtml = badges(hs || []);
  const orph = orphans(plan.file, plan.sprints).filter((c) => !hs.includes(c));
  root.querySelector('[data-col="tasks"]').innerHTML = [
    drawerHeadHtml(stage),
    `<div class="ds-md">`, crumbOf(plan), sec.head, sec.body, dueLine(sprint),
    evals, commitsHtml, orphanRail(plan.sprints, sii, badges(orph)), `</div>`,
  ].join('');
  const u = unlinked(texts);
  const triage = root.querySelector('[data-col="triage"]');
  triage.innerHTML = /All tracked/.test(u) ? '' : `<hr class="ds-hr">${u}`;
  // A new plan or phase starts at its top: the drawer keeps one scroll owner,
  // so without this a deep scroll lands the reader mid-section on open.
  // [plan:2026-11-02_192021-changelog-parity.md#phase-8]
  const key = `${plan.file}#${sii}`;
  if (drawer.dataset.key !== key) {
    drawer.dataset.key = key;
    drawer.scrollTop = 0;
    root.querySelector('[data-col="sprint"]').scrollTop = 0;
  }
  if (open) { drawer.hidden = false; scrim.hidden = false; }
  else { drawer.hidden = true; scrim.hidden = !ctx.timeline; }
}
