/* ADAM/DS — ds/changelog/panels · evals timeline panel (drawer footer)
   [plan:2026-11-02_192021-changelog-parity.md#phase-3] */
// Exports: stripGateThread, renderEvals, renderCommits (re-export of footer.js)
import { esc } from './esc.js';
import { fmtDate } from '../changelog-parse.js';
import { parseGates } from './gates.js';
import { dueOf } from './due.js';
export { renderCommits } from './footer.js';
const dueAttr = (head, body) => {
  try {
    const d = dueOf({ head, body });
    return d ? ` data-due="${esc(d)}"` : '';
  } catch {}
  return '';
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-3]
export const stripGateThread = (body) => String(body || '').split('\n').filter((l) => {
  if (/^\s*-\s*REF GATE\b/i.test(l)) return false;
  if (/^\s*-\s*Evidence\b/i.test(l)) return false;
  return true;
}).join('\n');
const revNotes = (head, body) => {
  try {
    if (parseGates) {
      const g = parseGates(head, body);
      if (g && Array.isArray(g.revLines)) return g.revLines.map(String);
    }
  } catch {}
  return String(body || '').split('\n').filter((l) => /REF GATE/i.test(l) && /·\s*rev\b/.test(l));
};
const revDate = (t) => (String(t).match(/(20\d{2}-\d{2}-\d{2})/) || [])[1] || '';
const revText = (t) => {
  const s = String(t).replace(/^\s*-\s*/, '').replace(/^REF GATE\s+\d+\s*(\([^)]*\))?\s*/i, '');
  return s.replace(/^[·—–-]\s*rev\s*\d{4}-\d{2}-\d{2}\s*/i, '').replace(/^["“]+|["”]+$/g, '').trim();
};
const histRevs = (planFile, head, history) => {
  const rows = [];
  const entries = (history && history[planFile]) || [];
  for (let i = 1; i < entries.length; i++) {
    const prev = (entries[i - 1].sections || []).find((s) => s.head === head);
    const cur = (entries[i].sections || []).find((s) => s.head === head);
    if (!cur || !prev || cur.hash === prev.hash) continue;
    const moved = prev.state && cur.state && prev.state !== cur.state;
    const txt = moved ? `tasks ${prev.state} → ${cur.state}` : 'section updated';
    rows.push({ date: entries[i].date || '', text: txt });
  }
  return rows;
};
// — Timeline rows: eval = accent ring bullet, iter = indented branch under it —
const row = (kind, text, small) => {
  const cls = `ds-timeline-item ds-timeline-item--${kind}`;
  const sm = small ? `<small>${esc(small)}</small>` : '';
  return `<div class="${cls}"><span>${esc(text)}</span>${sm}</div>`;
};
const group = (dayNum, dateLabel, count, inner) => [
  `<details class="ds-timeline-group" open><summary class="ds-timeline-date">`,
  `<span class="ds-caret">‹›</span><span class="ds-day-num">Day ${dayNum}</span>`,
  ` · ${dateLabel} · ${count}</summary>`,
  `<div class="ds-timeline-items">${inner}</div></details>`,
].join('');
// [plan:2026-11-02_192021-changelog-parity.md#phase-3]
export const renderEvals = (planFile, head, body, history) => {
  const notes = revNotes(head, body).map((t) => ({ date: revDate(t), text: revText(t) }));
  const revs = histRevs(planFile, head, history);
  if (!notes.length && !revs.length) return '';
  const dates = [...new Set([...notes.map((r) => r.date), ...revs.map((r) => r.date)])].sort().reverse();
  const groups = dates.map((d, di) => {
    const ps = notes.filter((r) => r.date === d);
    const its = revs.filter((r) => r.date === d);
    const label = esc(d ? fmtDate(d) || d : 'Undated');
    const inner = ps.map((r) => row('eval', r.text)).join('')
      + its.map((r) => row('iter', r.text, d)).join('');
    return group(dates.length - di, label, ps.length + its.length, inner);
  }).join('');
  const n = notes.length + revs.length;
  const sum = `<summary class="ds-panel-title"><span class="ds-caret">‹›</span>Evals · `
    + `<span class="ds-panel-num">${n}</span></summary>`;
  const box = `<div class="ds-timeline">${groups}</div>`;
  const open = `<details class="ds-panel ds-evals ds-revs"${dueAttr(head, body)} open>`;
  return `<hr class="ds-hr">${open}${sum}${box}</details>`;
};
