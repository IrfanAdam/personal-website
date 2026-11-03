/* ADAM/DS — ds/changelog/paint-chips · chips + graph ·
   [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { fmtDate } from '../changelog-parse.js';
import { graph } from './graph.js';
import { planStatus } from './raw-detail.js';
import { filterDrawer } from './filter-drawer.js';
export function paintChips(root, ctx){
  const { list, pi, plan, sprints, si, active, day, sel, open, counts, plans, texts } = ctx;
  const stat = ctx.status || new Set();
  const statusCounts = { done: 0, incomplete: 0, cancelled: 0 };
  plans.forEach((p) => {
    const s = planStatus(p);
    if (statusCounts[s] === undefined) return;
    if (active.size && !p.tags.some((t) => active.has(t))) return;
    statusCounts[s]++;
  });
  const tagCounts = counts.map(([t]) => [t, plans.filter((p) => p.tags.includes(t)
    && (!stat.size || stat.has(planStatus(p)))).length]);
  const showAll = [
    `<button class="ds-chip`,
    (active.size || day) ? '' : ' on',
    `" data-tag="">All (`,
    plans.length,
    `)</button>`,
  ].join('');
  const dayChip = day ? [
    `<button class="ds-chip on" data-day-clear aria-label="Clear day filter">`,
    fmtDate(day),
    ` \u2715</button>`,
  ].join('') : '';
  const pills = tagCounts.map(([t, n]) => [
    `<button class="ds-chip`,
    active.has(t) ? ' on' : '',
    `" data-tag="`,
    t,
    `" aria-pressed="`,
    active.has(t),
    `">`,
    t,
    ` (`,
    n,
    `)</button>`,
  ].join('')).join('');
  const filters = filterDrawer({ counts: tagCounts, statusCounts, active, status: stat,
    filterTab: ctx.filterTab, filterOpen: ctx.filterOpen });
  // Compact gantt glyph: hairline frame + two staggered rounded bars, so the
  // chip still reads at --text-micro beside the funnel on Filters.
  const tlIcon = [
    `<svg class="ds-chip-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor"`,
    ` stroke-width="1.5" aria-hidden="true">`,
    `<rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/>`,
    `<rect x="4" y="5" width="5" height="1.6" rx=".8" fill="currentColor" stroke="none"/>`,
    `<rect x="6.5" y="8.6" width="5.5" height="1.6" rx=".8" fill="currentColor" stroke="none"/>`,
    `</svg>`,
  ].join('');
  const tlChip = [
    `<button class="ds-chip" data-view="timeline" aria-pressed="`,
    ctx.view === 'timeline',
    `">`,
    tlIcon,
    `Timeline</button>`,
  ].join('');
  root.querySelector('[data-col="chips"]').innerHTML = filters + dayChip + showAll + pills + tlChip;
  const gEl = root.querySelector('[data-col="graph"]');
  if (!gEl.dataset.ready) { gEl.innerHTML = graph({ plans, day }); gEl.dataset.ready = '1'; }
  else { gEl.querySelectorAll('[data-day]').forEach((el) => { const k = el.dataset.day,
        on = k === day; el.classList.toggle('on',
          on); if (el.getAttribute('aria-pressed') !== String(on)) el.setAttribute('aria-pressed',
          String(on)); }); }
}
