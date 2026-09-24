/* ADAM/DS — ds/changelog/paint-detail · rail + detail · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { marked } from 'marked';
import { hits, badges, unlinked } from '../changelog-links.js';
import { shortPhase as short, provenance, descOf, clip } from '../changelog-titles.js';
import { isDone, state } from '../changelog-parse.js';
import { esc } from './esc.js';
export function paintDetail(root, ctx){
  const { list, pi, plan, sprints, si, active, day, sel, open, counts, plans, texts } = ctx;
  const scrim = root.querySelector('[data-scrim]'), drawer = root.querySelector('[data-drawer]');
  const sprint = sprints[si], sprintDesc = (s) => descOf(s.body);
  root.querySelector('[data-col="sprint"]').innerHTML = sprints.map((s, i) => {
    const n = (s.head.match(/Phase (\d+)/) || [])[1] || String(i + 1),
      hsS = hits(plan.file, s.body, plan.sprints.indexOf(s) === 0),
      has = hsS.length ? ' \u00b7 ' + hsS.length + ' commit' + (hsS.length > 1 ? 's' : '') : '',
      frac = state(s.body);
    return [
      `<button class="ds-pick`,
      i === sel[1] ? ' on' : '',
      isDone(frac) ? '' : ' is-open',
      `" data-tip="`,
      esc(clip(sprintDesc(s), 100)),
      `"><span class="ds-row"><span class="ds-num">Phase `,
      String(n).padStart(2, '0'),
      `</span><b>`,
      esc(short(s.head)),
      `</b></span><small>`,
      [frac + has].filter(Boolean).join(' \u00b7 '),
      `</small></button>`,
    ].join('');
  }).join('') + [
    `<p class="ds-commits" data-prov>`,
    esc(provenance(plan)),
    `</p><div class="ds-rail-foot" data-foot>`,
    esc(plan.goal || sprintDesc(sprint)),
    `</div>`,
  ].join('');
  const hs = hits(plan.file, sprint.body, plan.sprints.indexOf(sprint) === 0);
  root.querySelector('[data-col="tasks"]').innerHTML = [
    `<div class="ds-drawer-head"><b>`,
    short(sprint.head),
    `</b><button data-close aria-label="Close detail">\u2715</button></div><div class="ds-md">`,
    marked.parse(sprint.body) + badges(hs),
    `</div>`,
  ].join('');
  const u = unlinked(texts);
  root.querySelector('[data-col="triage"]').innerHTML = /All tracked/.test(u) ? '' : `<hr class="ds-hr">${u}`;
  if (open) { drawer.hidden = false; scrim.hidden = false; } else { drawer.hidden = true; scrim.hidden = true; }
}
