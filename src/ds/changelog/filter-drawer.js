/* ADAM/DS — ds/changelog/filter-drawer · tags + status drawer ·
   [plan:2026-11-02_192021-changelog-parity#phase-4] */
// Exports: STATUSES, filterBadgeCount, filterDrawer — markup only, no DOM wiring
// Both families are multi-select checkboxes; badge = tags.size + status.size.
// [plan:2026-11-02_192021-changelog-parity#phase-4]
export const STATUSES = [['done', 'Done'], ['incomplete', 'Incomplete'], ['cancelled', 'Cancelled']];
const asSet = (v) => {
  if (v instanceof Set) return v;
  return new Set(v ? [v] : []);
};
export const filterBadgeCount = (sel = {}) => asSet(sel.active).size + asSet(sel.status).size;
const row = (attr, key, label, on) => [
  `<label class="ds-tag-option" ${attr}="${key}"><input type="checkbox"`,
  on ? ' checked' : '',
  `>`,
  label,
  `</label>`,
].join('');
const tagRows = (counts, active) => counts.map(([t, n]) => [t, n, active.has(t)])
  .map(([t, n, on]) => row('data-tag-opt', t, `${t} (${n})`, on)).join('');
const statusRows = (statusCounts, status) => STATUSES
  .map(([v, label]) => row('data-status-opt', v, `${label} (${statusCounts[v] || 0})`, status.has(v)))
  .join('');
const tabBtn = (id, label, n, on) => [
  `<button role="tab" class="ds-filter-tab`,
  on ? ' is-active' : '',
  `" data-tab="`,
  id,
  `" aria-selected="`,
  on,
  `">`,
  label,
  n ? ` · ${n}` : '',
  `</button>`,
].join('');
// [plan:2026-11-02_192021-changelog-parity#phase-4]
export const filterDrawer = (ctx = {}) => {
  const counts = ctx.counts || [];
  const statusCounts = ctx.statusCounts || {};
  const active = asSet(ctx.active);
  const status = asSet(ctx.status);
  const tab = ctx.filterTab === 'status' ? 'status' : 'tags';
  const n = filterBadgeCount({ active, status });
  const tabs = [
    tabBtn('tags', 'Tags', active.size, tab === 'tags'),
    tabBtn('status', 'Status', status.size, tab === 'status'),
  ].join('');
  const panels = [
    `<div data-filter-panel="tags"${tab !== 'tags' ? ' hidden' : ''}>`,
    tagRows(counts, active),
    `</div><div data-filter-panel="status"${tab !== 'status' ? ' hidden' : ''}>`,
    statusRows(statusCounts, status),
    `</div>`,
  ].join('');
  return [
    `<button class="ds-chip ds-chip-filter${n ? ' on' : ''}" data-filter-toggle`,
    ` aria-haspopup="dialog" aria-expanded="${!!ctx.filterOpen}"`,
    ` aria-label="Filters${n ? `, ${n} active` : ''}">`,
    `<svg class="ds-chip-filter__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor"`,
    ` stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">`,
    `<path d="M2 3h12L9.5 8.2V12l-3 1.5V8.2L2 3z"/></svg>`,
    `</button>`,
    `<div class="ds-tag-dropdown ds-filter-drawer" data-filter-drawer`,
    ctx.filterOpen ? '' : ' hidden',
    ` role="dialog" aria-label="Filters"><div class="ds-filter-tabs" role="tablist"`,
    ` aria-label="Filter categories">`,
    tabs,
    `</div><div class="ds-filter-panels">`,
    panels,
    `</div></div>`,
  ].join('');
};
