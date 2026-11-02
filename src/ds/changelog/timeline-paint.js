/* ADAM/DS — ds/changelog/timeline-paint · tracks · [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: paintTimeline — dynamic model import with inline fallback, paints [data-col="timeline"]
// — Helpers —
const DAY = 86400000;
const noq = (s) => String(s || '').replace(/"/g, '');
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const atMid = (k) => Date.parse(`${k}T00:00:00Z`);
const spanText = (s, e) => (s === e ? s : `${s} → ${e}`);
const planTitle = (p) => p.title || p.file || 'Untitled plan';
const geomOf = (s, e, startMs) => {
  const off = Math.round((atMid(s) - startMs) / DAY);
  const span = Math.max(Math.round((atMid(e) - startMs) / DAY) - off + 1, 2);
  return `--tl-off:${off};--tl-span:${span}`;
};
const fallbackBouts = (list) => [...new Set(list || [])].sort().map((d) => ({
  kind: 'sporadic', start: d, end: d, dates: [d],
}));
const fallbackActive = (plan = {}, commits = []) => {
  const ds = (commits || []).filter((c) => c && c.plan === plan.file).map((c) => c.date);
  return [plan.date].concat(ds).filter(Boolean).sort();
};
const fallbackModel = { activeDatesOf: fallbackActive, boutsOf: fallbackBouts, ghostOf: () => null };
// — Rows —
const barHtml = (p, b, startMs, n) => {
  const tip = `${planTitle(p)} · ${spanText(b.start, b.end)} · ${b.dates.length}d`;
  return [
    `<div class="ds-tl-bar" data-tl-open="${p.file}" data-tip="${noq(tip)}"`,
    ` data-pop="${noq(planTitle(p))}" data-cm="${n}" data-span="${spanText(b.start, b.end)}"`,
    ` style="${geomOf(b.start, b.end, startMs)}"><span class="ds-tl-barname">${esc(planTitle(p))}</span></div>`,
  ].join('');
};
const ghostHtml = (p, g, startMs) => {
  if (!g) return '';
  const tip = `Due ${g.to}${g.overdue ? ' · overdue' : ''} · ${planTitle(p)}`;
  return [
    `<div class="ds-tl-ghost${g.overdue ? ' is-overdue' : ''}" data-tl-open="${p.file}"`,
    ` data-tip="${noq(tip)}" data-pop="${noq(planTitle(p))}" data-due="${g.to}"`,
    ` style="${geomOf(g.from, g.to, startMs)}"></div>`,
  ].join('');
};
const rowHtml = (p, bouts, ghost, startMs, n) => {
  const bars = bouts.map((b) => barHtml(p, b, startMs, n)).join('');
  return [
    `<div class="ds-tl-row" data-tl-row="${p.file}" data-pop="${noq(planTitle(p))}"><div class="ds-tl-lane">`,
    `<button class="ds-tl-edge is-l" data-tl-edge="l" aria-label="Scroll track into view" hidden>«</button>`,
    bars,
    ghostHtml(p, ghost, startMs),
    `<button class="ds-tl-edge is-r" data-tl-edge="r" aria-label="Scroll track into view" hidden>»</button>`,
    `</div></div>`,
  ].join('');
};
// — Axis —
const ticksHtml = (startMs, days) => Array.from({ length: days }, (_, d) => {
  const dt = new Date(startMs + d * DAY);
  const month = dt.getDate() === 1;
  const label = month ? dt.toLocaleString('en', { month: 'short' }) : dt.getDate();
  const cls = month ? ' is-month' : '';
  return `<span class="ds-tl-tick${cls}" style="left:calc(${d} * var(--tl-day))">${label}</span>`;
}).join('');
const headHtml = `<div class="ds-tl-head"><b>Timeline</b><button data-tl-close aria-label="Close">✕</button></div>`;
// — Paint —
const paintWith = (model, host, plans, commits, today) => {
  const rows = plans.map((p) => {
    const own = (commits || []).filter((c) => c && c.plan === p.file);
    const bouts = model.boutsOf(model.activeDatesOf(p, commits || []));
    return { p, bouts, ghost: model.ghostOf(p, commits || [], today), n: own.length };
  });
  const live = rows.filter((r) => r.bouts.length || r.ghost);
  if (!live.length) {
    host.innerHTML = `${headHtml}<div class="ds-tl-scroll"><p class="ds-tl-empty">Nothing matches yet.</p></div>`;
    return 0;
  }
  const boutKeys = live.flatMap((r) => r.bouts.flatMap((b) => [b.start, b.end]));
  const ghostKeys = live.flatMap((r) => (r.ghost ? [r.ghost.from, r.ghost.to] : []));
  const bounds = boutKeys.concat(ghostKeys).concat([today]).filter(Boolean).sort();
  const startMs = atMid(bounds[0]);
  const days = Math.max(1, Math.round((atMid(bounds[bounds.length - 1]) - startMs) / DAY) + 1);
  const frac = (Date.now() - startMs) / DAY;
  host.innerHTML = [
    headHtml,
    `<div class="ds-tl-scroll"><div class="ds-tl-body" style="--tl-days:${days}">`,
    `<div class="ds-tl-axis"><span class="ds-tl-curmonth" data-tl-curmonth hidden></span>`,
    `<div class="ds-tl-ticks">${ticksHtml(startMs, days)}</div></div>`,
    live.map((r) => rowHtml(r.p, r.bouts, r.ghost, startMs, r.n)).join(''),
    `<div class="ds-tl-today" style="left:calc(${frac.toFixed(4)} * var(--tl-day))"></div>`,
    `</div></div>`,
  ].join('');
  return live.length;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const paintTimeline = (root, ctx = {}) => {
  const host = root.querySelector('[data-col="timeline"]');
  if (!host) return Promise.resolve(0);
  const today = ctx.today || new Date().toISOString().slice(0, 10);
  host.hidden = false;
  return import('./timeline.js').then(
    (m) => paintWith(m, host, ctx.plans || [], ctx.commits || [], today),
    () => paintWith(fallbackModel, host, ctx.plans || [], ctx.commits || [], today),
  );
};
