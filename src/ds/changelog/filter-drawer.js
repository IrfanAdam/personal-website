/* ADAM/DS — ds/changelog/filter-drawer · drawer · [plan:2026-11-02_192021-changelog-parity#phase-4] */
// Exports: STATUSES, filterBadgeCount, filterDrawer — markup only, no DOM wiring
// — Shape —
export const STATUSES = [['done', 'Done'], ['incomplete', 'Incomplete'], ['cancelled', 'Cancelled']];
// Status accepts a Set (single radio) or a plain string; radio counts max 1.
// [plan:2026-11-02_192021-changelog-parity#phase-4]
export const filterBadgeCount = (sel = {}) => {
  const tags = sel.active ? sel.active.size : 0;
  const set = sel.status instanceof Set ? sel.status.size : 0;
  const one = typeof sel.status === 'string' && sel.status ? 1 : 0;
  return tags + Math.min(set + one, 1);
};
const statusVal = (s) => (s instanceof Set ? [...s][0] || '' : (s || ''));
const tagRows = (counts, active) => counts.map(([t, n]) => [
  `<label class="ds-tag-option" data-tag-opt="`,
  t,
  `"><input type="checkbox"`,
  active.has(t) ? ' checked' : '',
  `>`,
  t,
  ` (`,
  n,
  `)</label>`,
].join('')).join('');
const statusRows = (statusCounts, status) => STATUSES.map(([v, label]) => [
  `<label class="ds-tag-option" data-status-opt="`,
  v,
  `"><input type="radio" name="ds-status"`,
  status === v ? ' checked' : '',
  `>`,
  label,
  ` (`,
  statusCounts[v] || 0,
  `)</label>`,
].join('')).join('');
const tabBtn = (id, label, n, on) => [
  `<button role="tab" class="ds-filter-tab`,
  on ? ' is-active' : '',
  `" data-filter-tab="`,
  id,
  `" aria-selected="`,
  on,
  `"`,
  on ? ' aria-current="true"' : '',
  `>`,
  label,
  n ? ` · ${n}` : '',
  `</button>`,
].join('');
// [plan:2026-11-02_192021-changelog-parity#phase-4]
export const filterDrawer = (ctx = {}) => {
  const counts = ctx.counts || [];
  const statusCounts = ctx.statusCounts || {};
  const active = ctx.active || new Set();
  const status = statusVal(ctx.status);
  const tab = ctx.filterTab === 'status' ? 'status' : 'tags';
  const n = filterBadgeCount({ active, status });
  const tabs = [
    tabBtn('tags', 'Tags', active.size, tab === 'tags'),
    tabBtn('status', 'Status', status ? 1 : 0, tab === 'status'),
  ].join('');
  const panels = [
    `<div data-filter-panel="tags"${tab !== 'tags' ? ' hidden' : ''}>`,
    tagRows(counts, active),
    `</div>`,
    `<div data-filter-panel="status"${tab !== 'status' ? ' hidden' : ''}>`,
    statusRows(statusCounts, status),
    `</div>`,
  ].join('');
  return [
    `<button class="ds-chip ds-chip-filter${n ? ' on' : ''}" data-filter-toggle`,
    ` aria-haspopup="dialog" aria-expanded="${!!ctx.filterOpen}"`,
    ` aria-label="Filters${n ? `, ${n} active` : ''}">`,
    `<span class="ds-chip-filter__n">${n || ''}</span>`,
    `</button>`,
    `<div class="ds-tag-dropdown ds-filter-drawer" data-filter-drawer`,
    ctx.filterOpen ? '' : ' hidden',
    ` role="dialog" aria-label="Filters">`,
    `<div class="ds-filter-tabs" role="tablist" aria-label="Filter categories">`,
    tabs,
    `</div><div class="ds-filter-panels">`,
    panels,
    `</div></div>`,
  ].join('');
};
