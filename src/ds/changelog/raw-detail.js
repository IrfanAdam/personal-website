/* ADAM/DS — ds/changelog/raw-detail · honest section body · [plan:2026-11-02_192021-changelog-parity.md#phase-3] */
// Exports: planStatus, renderSection, orphanRail
import { esc } from './esc.js';
import { isDone, state } from '../changelog-parse.js';
// — Head marks —
const cleanHead = (h) => String(h || '').replace(/\{#.*?\}/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();
const stripMarks = (t) => String(t || '').replace(/✓\s*done\s*—?/i, '').replace(/✗\s*cancelled\s*—?/i, '');
const headMark = (head) => {
  if (/✗\s*cancelled/i.test(String(head || ''))) return 'cancelled';
  return /✓\s*done/i.test(String(head || '')) ? 'done' : 'open';
};
const splitNote = (title) => {
  const s = String(title || '').trim();
  const m = s.match(/\(([^()]*)\)\s*$/);
  if (!m || /`?[0-9a-f]{7,40}`?$/i.test(m[1].trim())) return { name: s, note: '' };
  return { name: s.slice(0, m.index).trim(), note: m[1].trim() };
};
const stampNum = (t) => {
  const s = stripMarks(cleanHead(t)).replace(/[✓✗]/g, '').trim().match(/^(Task|Step|Phase)\s+([\d-]+)/i);
  return s ? s[2].toLowerCase() : '';
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
const fmtInline = (t) => esc(String(t || '')).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const plain = (t) => String(t || '').split('\n').filter((s) => s.trim()).map((s) => `<p>${esc(s)}</p>`).join('');
const foldOf = (t, md) => {
  let tick = '☐';
  if (headMark(t.title) === 'done') tick = '☑';
  if (headMark(t.title) === 'cancelled') tick = '☒';
  const label = splitNote(stripMarks(cleanHead(t.title))).name || 'Task';
  return `<details class="ds-task"><summary>${tick} ${esc(label)}</summary>${md(t.lines.join('\n'))}</details>`;
};
// renderSection(head, body, suffix, md): honest DONE from the head mark only.
// md renders markdown (marked in browser); plain paragraphs keep node probes
// honest without a DOM.
// [plan:2026-11-02_192021-changelog-parity.md#phase-3]
export const renderSection = (head, body, suffix = '', md = null) => {
  const raw = String(head || '').replace(/^#{1,4}\s+/, '');
  const mark = headMark(raw);
  const base = stripMarks(cleanHead(raw)).replace(/[✓✗]/g, '').trim();
  const note = splitNote(base);
  const render = md || plain;
  const lines = String(body || '').split('\n');
  // Drop a body that repeats its own heading — the pane injects the title once.
  const first = lines.findIndex((l) => l.trim());
  if (first > -1 && /^#{1,4}\s/.test(lines[first])
    && cleanHead(lines[first]).replace(/[#\s]/g, '') === cleanHead(raw).replace(/[#\s]/g, '')) {
    lines[first] = '';
  }
  const tasks = [];
  let cur = null;
  const prose = [];
  for (const ln of lines) {
    const m = ln.match(/^###\s+(.+)$/);
    if (m) tasks.push({ title: m[1], lines: [] });
    if (m) cur = tasks[tasks.length - 1];
    if (!m) (cur ? cur.lines : prose).push(ln);
  }
  const stamps = stampNum(base) && tasks.length && tasks.every((t) => stampNum(t.title) === stampNum(base));
  const bare = stamps && !prose.join('').trim() && tasks.every((t) => !t.lines.join('').trim());
  let eff = bare && mark === 'open' ? headMark(tasks[0].title) : mark;
  // A section whose every task is ticked is done even when the heading lacks
  // the mark — the list card already reads that way, so the pane must too.
  if (eff === 'open' && isDone(state(body))) eff = 'done';
  const gate = suffix ? ` · ${esc(String(suffix).replace(/^[✓·\s]+/, ''))}` : '';
  let st = '';
  if (eff === 'done') st = `<p class="ds-status ds-is-done">✓ DONE${gate}</p>`;
  if (eff === 'cancelled') st = `<p class="ds-status ds-is-cancelled">✗ cancelled${gate}</p>`;
  if (eff === 'open' && gate) st = `<p class="ds-status ds-is-gate">${esc(gate.slice(3))}</p>`;
  const title = `<h2>${esc(note.name || 'Task')}</h2>`;
  const noteHtml = note.note ? `<p>${fmtInline(note.note)}</p>` : '';
  if (bare) return { head: title, body: `${st}${noteHtml}` };
  const folds = tasks.map((t) => foldOf(t, render)).join('');
  return { head: title, body: `${st}${noteHtml}${render(prose.join('\n'))}${folds}` };
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
