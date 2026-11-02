/* ADAM/DS — ds/changelog/tl-grid · bounds, month padding, ticks, geometry ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-4] */
// Exports: DAY, atMid, isoOf, timelineGrid, geomOf, ticksHtml — pure, no DOM
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const DAY = 86400000;
export const atMid = (k) => Date.parse(`${k}T00:00:00Z`);
export const isoOf = (ms) => new Date(ms).toISOString().slice(0, 10);
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
    const p = r.p || r.plan || {};
    if (isDay(p.date)) pts.push(p.date);
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
// Daily ticks: the number always owns its cell. The 1st adds a month stamp on
// the band above, pinned to its own left edge so it can never reach a neighbour.
// A month tick's text stays the bare month name — the sticky badge in tl-edges
// reads textContent — so its day number rides in data-d and paints via ::after.
// [plan:2026-11-02_192021-changelog-parity.md#phase-4]
export const ticksHtml = (startMs, days) => Array.from({ length: days }, (_, d) => {
  const dt = new Date(startMs + d * DAY);
  const day = dt.getUTCDate();
  const at = `style="left:calc(${d} * var(--tl-day))"`;
  if (day !== 1) return `<span class="ds-tl-tick" ${at}>${day}</span>`;
  const mon = dt.toLocaleString('en', { month: 'short', timeZone: 'UTC' });
  const stamp = `<span class="ds-tl-mon">${mon}</span>`;
  return `<span class="ds-tl-tick is-month" data-d="${day}" ${at}>${stamp}</span>`;
}).join('');
