/* ADAM/DS — ds/changelog/timeline-paint · tracks ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: paintTimeline — shell + grid + today; row markup lives in tl-rows.js
import { DAY, timelineGrid, ticksHtml } from './tl-grid.js';
import { rowHtml } from './tl-rows.js';
import { syncTlEdges } from './tl-edges.js';
// — Today in view —
// Only when off-screen, fractional x, after layout.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const scrollToday = (host, frac, days) => {
  const sc = host.querySelector('.ds-tl-scroll');
  const lane = host.querySelector('.ds-tl-lane');
  if (!sc || !lane) return;
  const dayPx = lane.getBoundingClientRect().width / Math.max(days, 1);
  if (!dayPx) return;
  const x = frac * dayPx;
  if (x >= sc.scrollLeft && x <= sc.scrollLeft + sc.clientWidth - 8) return;
  sc.scrollLeft = Math.max(0, x - sc.clientWidth * 0.3);
};
// — Paint —
const paintWith = (model, host, plans, commits, today, saved) => {
  const rows = (plans || []).map((p) => ({
    p,
    bouts: model.boutsOf(model.activeDatesOf(p, commits || [])),
    ghost: model.ghostOf(p, commits || [], today),
  }));
  const grid = timelineGrid(rows, today);
  const frac = Math.max((Date.now() - grid.startMs) / DAY, 0);
  const body = rows.map((r) => rowHtml(r, grid.startMs)).join('');
  host.innerHTML = [
    `<div class="ds-tl-head"><b>Timeline</b><small>${grid.start} → ${grid.end}</small>`,
    `<button data-tl-close aria-label="Close timeline">✕</button></div>`,
    `<div class="ds-tl-scroll"><div class="ds-tl-body" style="--tl-days:${grid.days}">`,
    `<div class="ds-tl-axis"><span class="ds-tl-curmonth" data-tl-curmonth hidden></span>`,
    `<div class="ds-tl-ticks">${ticksHtml(grid.startMs, grid.days)}</div></div>`,
    body || `<p class="ds-tl-empty">Nothing matches the current filters yet.</p>`,
    `<div class="ds-tl-todaycol" style="left:calc(${Math.floor(frac)} * var(--tl-day))"></div>`,
    `<div class="ds-tl-today" style="left:calc(${frac.toFixed(4)} * var(--tl-day))"></div>`,
    `</div></div>`,
  ].join('');
  const sc = host.querySelector('.ds-tl-scroll');
  if (sc) sc.onscroll = () => syncTlEdges(host);
  syncTlEdges(host);
  requestAnimationFrame(() => {
    const sc2 = host.querySelector('.ds-tl-scroll');
    if (saved != null && sc2) sc2.scrollLeft = saved;
    else scrollToday(host, frac, grid.days);
    syncTlEdges(host);
  });
  return rows.length;
};
const fallbackModel = {
  activeDatesOf: (p = {}, cs = []) => [p.date].concat((cs || [])
    .filter((c) => c && c.plan === p.file).map((c) => c.date)).filter(Boolean).sort(),
  boutsOf: (ds = []) => [...new Set(ds)].sort()
    .map((d) => ({ kind: 'sporadic', start: d, end: d, dates: [d] })),
  ghostOf: () => null,
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const paintTimeline = (root, ctx = {}) => {
  const host = root.querySelector('[data-col="timeline"]');
  if (!host) return Promise.resolve(0);
  host.hidden = false;
  const today = ctx.today || new Date().toISOString().slice(0, 10);
  const paint = (m) => paintWith(m, host, ctx.plans, ctx.commits, today, ctx.scroll);
  return import('./timeline.js').then(paint, () => paint(fallbackModel));
};
