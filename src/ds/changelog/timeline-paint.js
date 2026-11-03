/* ADAM/DS — ds/changelog/timeline-paint · side panel shell ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: paintTimeline — panel head + grid + today; rows live in tl-rows.js
import { DAY, timelineGrid, ticksHtml } from './tl-grid.js';
import { rowHtml } from './tl-rows.js';
import { syncTlEdges } from './tl-edges.js';
import { laneMeta, spanText } from './tl-meta.js';
// — Today in view —
// Only when off-screen, fractional x, after layout.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
// The wash owns the whole day cell; the line and the axis dot ride the
// time-of-day fraction, so the marker reads as a moment, not a gridline.
const atX = (v) => `left:calc(var(--tl-label) + ${v} * var(--tl-day))`;
const scrollToday = (host, frac, days) => {
  const sc = host.querySelector('.ds-tl-scroll');
  const lane = host.querySelector('.ds-tl-lane');
  if (!sc || !lane) return;
  // The sticky plan column covers the lane's left edge, so the lane's own x is
  // offset by its width and "in view" starts that far into the scroll box.
  const lab = host.querySelector('.ds-tl-label');
  const pad = lab ? lab.getBoundingClientRect().width : 0;
  const dayPx = lane.getBoundingClientRect().width / Math.max(days, 1);
  if (!dayPx) return;
  const x = pad + frac * dayPx;
  if (x >= sc.scrollLeft + pad && x <= sc.scrollLeft + sc.clientWidth - 24) return;
  const pane = Math.max(sc.clientWidth - pad, 1);
  sc.scrollLeft = Math.max(0, x - pad - pane * 0.5);
};
const headHtml = (grid) => [
  `<div class="ds-tl-head"><b>Timeline</b>`,
  `<small>${spanText(grid.start, grid.end)}</small>`,
  `<button data-tl-close aria-label="Close timeline">✕</button></div>`,
].join('');
// — Paint —
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
const paintWith = (model, host, plans, commits, today, saved) => {
  const rows = (plans || []).map((p, i) => ({
    p,
    seq: String((plans || []).length - i).padStart(2, '0'),
    meta: laneMeta(p, commits || []),
    bouts: model.boutsOf(model.activeDatesOf(p, commits || [])),
    ghost: model.ghostOf(p, commits || [], today),
  }));
  const grid = timelineGrid(rows, today);
  const frac = Math.max((Date.now() - grid.startMs) / DAY, 0);
  const fx = frac.toFixed(3);
  const body = rows.map((r) => rowHtml(r, grid.startMs)).join('');
  host.innerHTML = [
    headHtml(grid),
    `<div class="ds-tl-scroll"><div class="ds-tl-body" style="--tl-days:${grid.days}">`,
    `<div class="ds-tl-axis"><span class="ds-tl-clabel">Plan</span>`,
    `<span class="ds-tl-curmonth" data-tl-curmonth hidden></span>`,
    `<div class="ds-tl-ticks">${ticksHtml(grid.startMs, grid.days)}</div>`,
    `<span class="ds-tl-todaydot" style="${atX(fx)}"></span></div>`,
    body || `<p class="ds-tl-empty">Nothing matches the current filters yet.</p>`,
    `<div class="ds-tl-todaycol" style="${atX(Math.floor(frac))}"></div>`,
    `<div class="ds-tl-today" style="${atX(fx)}"></div>`,
    `</div></div>`,
  ].join('');
  const sc = host.querySelector('.ds-tl-scroll');
  if (sc) sc.onscroll = () => syncTlEdges(host);
  syncTlEdges(host);
  // The panel can be painted while its route is still display:none; a scroll
  // assigned then clamps to 0 and is lost. Retry until it has a measurable width.
  const settle = (n) => requestAnimationFrame(() => {
    const sc2 = host.querySelector('.ds-tl-scroll');
    if (!sc2) return;
    if (!sc2.clientWidth && n > 0) { settle(n - 1); return; }
    if (saved != null) sc2.scrollLeft = saved;
    else scrollToday(host, frac, grid.days);
    syncTlEdges(host);
  });
  settle(40);
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
