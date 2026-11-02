/* ADAM/DS — ds/changelog/tl-grid · bounds, month padding, ticks, geometry ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: DAY, atMid, isoOf, spanText, timelineGrid, geomOf, ticksHtml — pure, no DOM
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const DAY = 86400000;
export const atMid = (k) => Date.parse(`${k}T00:00:00Z`);
export const isoOf = (ms) => new Date(ms).toISOString().slice(0, 10);
export const spanText = (s, e) => (s === e ? s : `${s} → ${e}`);
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const isDay = (s) => ISO.test(s || '') && !Number.isNaN(atMid(s));
const shiftMonth = (k, n) => {
  const [y, m] = k.split('-').map(Number);
  return isoOf(Date.UTC(y, m - 1 + n, 1));
};
const firstOf = (k) => `${k.slice(0, 7)}-01`;
const lastOf = (k) => {
  const [y, m] = k.split('-').map(Number);
  return isoOf(Date.UTC(y, m, 0));
};
// Bounds = plan dates + bout edges + ghost edges + today, padded to whole
// previous and next months so empty month context still shows.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const timelineGrid = (rows = [], today) => {
  const t = isDay(today) ? today : isoOf(Date.now());
  const pts = [t];
  for (const r of rows) {
    if (r.plan && isDay(r.plan.date)) pts.push(r.plan.date);
    for (const b of r.bouts || []) { pts.push(b.start); pts.push(b.end); }
    if (r.ghost) { pts.push(r.ghost.from); pts.push(r.ghost.to); }
  }
  const valid = pts.filter(isDay).sort();
  const start = firstOf(shiftMonth(valid[0] || t, -1));
  const end = lastOf(shiftMonth(valid[valid.length - 1] || t, 1));
  const startMs = atMid(start);
  const days = Math.max(1, Math.round((atMid(end) - startMs) / DAY) + 1);
  return { start, end, startMs, days };
};
// Day-unit geometry: never percentages — they drift off the tick grid once the
// axis is padded. Span floor of 2 keeps one-day work readable as a bar.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const geomOf = (s, e, startMs) => {
  const off = Math.max(Math.round((atMid(s) - startMs) / DAY), 0);
  const span = Math.max(Math.round((atMid(e) - startMs) / DAY) - off + 1, 2);
  return `--tl-off:${off};--tl-span:${span}`;
};
// Daily ticks: bare day numbers, month name on the 1st, month marked.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const ticksHtml = (startMs, days) => Array.from({ length: days }, (_, d) => {
  const dt = new Date(startMs + d * DAY);
  const month = dt.getUTCDate() === 1;
  const label = month ? dt.toLocaleString('en', { month: 'short', timeZone: 'UTC' }) : dt.getUTCDate();
  const cls = month ? ' is-month' : '';
  return `<span class="ds-tl-tick${cls}" style="left:calc(${d} * var(--tl-day))">${label}</span>`;
}).join('');
