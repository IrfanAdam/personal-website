/* ADAM/DS — ds/changelog/raw-detail · status + orphan rail ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-3] [plan:2026-11-02_231259-changelog-task-folds.md#phase-3] */
// Exports: planStatus, isSealed, orphanRail
import { isDone, state } from '../changelog-parse.js';
// — Head marks —
const cleanHead = (h) => String(h || '').replace(/\{#.*?\}/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();
const stripMarks = (t) => String(t || '').replace(/✓\s*done\s*—?/i, '').replace(/✗\s*cancelled\s*—?/i, '');
const headMark = (head) => {
  if (/✗\s*cancelled/i.test(String(head || ''))) return 'cancelled';
  return /✓\s*done/i.test(String(head || '')) ? 'done' : 'open';
};
// Shared seal: cancelled outranks done outranks incomplete. Every surface
// imports this helper; the expression lives here exactly once.
// [plan:2026-11-02_192021-changelog-parity.md#phase-3]
export const isSealed = (s) => headMark((s || {}).head) !== 'open' || isDone(state((s || {}).body));
export const planStatus = (p) => {
  try {
    const ss = (p && p.sprints) || [];
    if (!ss.length) return 'incomplete';
    if (ss.every(isSealed)) return headMark(ss[ss.length - 1].head) === 'cancelled' ? 'cancelled' : 'done';
    return 'incomplete';
  } catch { return 'incomplete'; }
};
const anchorOf = (head) => {
  const m = String(head || '').match(/\{#([^}]*)\}/);
  if (m) return m[1].toLowerCase();
  const n = cleanHead(head).match(/^(Phase|Task|Step)\s+(\d+)/i);
  return n ? `${n[1].toLowerCase()}-${n[2]}` : '';
};
// Further-commits rail: only the first section owning an anchor renders it.
// [plan:2026-11-02_192021-changelog-parity.md#phase-3]
export const orphanRail = (sprints, idx, badgesHtml) => {
  if (!badgesHtml) return '';
  const mine = anchorOf((sprints[idx] || {}).head);
  const first = mine ? sprints.findIndex((s) => anchorOf(s.head) === mine) : idx;
  if (first !== idx) return '';
  return `<p class="ds-orphans">Further commits ${badgesHtml}</p>`;
};
