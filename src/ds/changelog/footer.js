/* ADAM/DS — ds/changelog/footer · commits timeline panel (drawer footer)
   [plan:2026-11-02_192021-changelog-parity.md#phase-3] */
// Exports: renderCommits
import { esc } from './esc.js';
import { fmtDate } from '../changelog-parse.js';
const GH = 'https://github.com/IrfanAdam/personal-website/commit/';
// — Commits timeline —
const when = (c) => `${c.date || ''} ${c.time || ''}`;
const newestFirst = (a, b) => when(b).localeCompare(when(a));
const dayLabel = (d) => esc(d ? fmtDate(d) || d : 'Undated');
const row = (c) => {
  const href = `${GH}${esc(c.full || c.sha || '')}`;
  const sha = esc(c.sha || '');
  const stamp = c.time ? `${esc(c.date || '')} ${esc(c.time)}` : esc(c.date || '');
  const sm = stamp ? `<small>${stamp}</small>` : '';
  return `<div class="ds-timeline-item"><a href="${href}">${sha}</a>`
    + `<span>${esc(c.subject || '')}</span>${sm}</div>`;
};
const group = (dayNum, label, count, inner) => [
  `<details class="ds-timeline-group" open><summary class="ds-timeline-date">`,
  `<span class="ds-caret">‹›</span><span class="ds-day-num">Day ${dayNum}</span>`,
  ` · ${label} · ${count}</summary>`,
  `<div class="ds-timeline-items">${inner}</div></details>`,
].join('');
// [plan:2026-11-02_192021-changelog-parity.md#phase-3]
export const renderCommits = (list) => {
  const rows = [...(list || [])].filter(Boolean).sort(newestFirst);
  if (!rows.length) return '';
  const dates = [...new Set(rows.map((c) => c.date || ''))].sort().reverse();
  const groups = dates.map((d, di) => {
    const day = rows.filter((c) => (c.date || '') === d);
    const inner = day.map(row).join('');
    return group(dates.length - di, dayLabel(d), day.length, inner);
  }).join('');
  const n = rows.length;
  const sum = `<summary class="ds-panel-title"><span class="ds-caret">‹›</span>Commits · `
    + `<span class="ds-panel-num">${n}</span></summary>`;
  const box = `<div class="ds-timeline">${groups}</div>`;
  return `<hr class="ds-hr"><details class="ds-panel ds-commits-panel" open>${sum}${box}</details>`;
};
