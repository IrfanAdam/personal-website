/* ADAM/DS — ds/changelog/sec-scan.js · line state machine ·
   [plan:2026-11-02_231259-changelog-task-folds.md#phase-3] */
// Exports: scanLines(lines, start, seed)
import { LABEL_LINE, TASK_HEAD, isTaskHead, fmtInline, cleanHead } from './fmt-text.js';
import { fieldRank, splitItemContent } from './task-shape.js';
import { DROP_LINE } from './sec-raw.js';
// — Scan state —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-3]
export const scanLines = (lines, start, seed) => {
  const tasks = [];
  let cur = null;
  const blocks = [];
  let openList = null;
  let fieldIdx = 0;
  let seq = 0;
  const flushList = () => { openList = null; };
  const curParts = () => { if (cur) return cur.field ? cur.field.parts : cur.loose; return blocks; };
  const rawHead = (x) => blocks.push({ t: 'raw', html: `<h3>${fmtInline(cleanHead(x))}</h3>` });
  const bare = (title, done, cancelled) => ({ title, done, cancelled, fields: [], lead: [], loose: [], field: null });
  const pushInline = (text) => {
    if (!text.trim()) return;
    const into = curParts();
    const last = into[into.length - 1];
    let host = openList && openList.items.length ? openList : null;
    if (!host && last && last.t === 'list' && last.items.length) host = last;
    if (/^\s+\S/.test(text) && host) { host.items[host.items.length - 1] += ' ' + text.trim(); return; }
    if (cur && cur.field && last && last.t === 'para') last.text += ' ' + text.trim();
    else if (!cur && last && last.t === 'para') last.text += ' ' + text.trim();
    else if (cur && cur.field) cur.field.inline.push(text.trim());
    else if (cur) cur.lead.push(text.trim());
    else into.push({ t: 'para', text: text.trim(), seq: seq++ });
  };
  const startField = (label, val) => {
    if (!cur) { cur = { title: '', fields: [], lead: [], loose: [], field: null }; tasks.push(cur); }
    flushList();
    cur.fields.push(cur.field = { label, inline: val ? [val] : [], parts: [], idx: fieldIdx++, seq: seq++ });
  };
  const closeTask = () => { if (!cur) return; flushList(); cur.field = null; cur = null; };
  const listItem = (ordered, text) => {
    let into = curParts();
    const peer = ordered && cur && cur.field && ![3, 4].includes(fieldRank(cur.field.label));
    if (peer) { if (!openList || openList.home !== cur.loose) flushList(); into = cur.loose; }
    if (!openList || openList.ordered !== ordered || openList.home !== into) {
      flushList();
      openList = { t: 'list', ordered, items: [], home: into, seq: seq++ };
      into.push(openList);
    }
    openList.items.push(text.trim());
  };
  let fence = null;
  let m = null;
  if (seed) {
    cur = bare(seed.title, seed.done, seed.cancelled);
    tasks.push(cur);
  }
  for (let i = start; i < lines.length; i++) {
    const ln = lines[i];
    if (fence) {
      if (/^\s*```\s*$/.test(ln)) {
        const code = fence.lines.join('\n');
        if (code.trim()) curParts().push({ t: 'pre', lang: fence.lang, code, seq: seq++ });
        flushList(); fence = null;
      } else fence.lines.push(ln); continue; }
    if ((m = ln.match(/^\s*```\s*([\w-]*)\s*$/))) { flushList(); fence = { lang: m[1] || '', lines: [] }; continue; }
    if (DROP_LINE(ln)) { flushList(); continue; }
    if ((m = TASK_HEAD(ln))) {
      closeTask();
      const title = m[1];
      if (isTaskHead(title)) {
        cur = bare(title, /✓/i.test(title), /✗/i.test(title));
        tasks.push(cur);
      } else rawHead(title);
      continue;
    }
    if (/^#{1,4}\s+/.test(ln)) { closeTask(); flushList(); rawHead(ln.replace(/^#{1,4}\s+/, '')); continue; }
    if ((m = ln.match(/^- \[(x|X| )\]\s?(.*)$/))) {
      closeTask();
      const { lead, fields } = splitItemContent(m[2]);
      const tt = lead.replace(/✓\s*done\s*—?/i, '').replace(/✗\s*cancelled\s*—?/i, '').trim();
      cur = { title: tt, done: m[1].toLowerCase() === 'x', cancelled: /✗/.test(m[2]) };
      cur.fields = fields.map((f) => ({ ...f, parts: [], idx: fieldIdx++ }));
      Object.assign(cur, { lead: [], loose: [], field: null });
      tasks.push(cur); closeTask(); continue;
    }
    if ((m = ln.match(/^- (.*)$/))) { listItem(false, m[1]); continue; }
    if ((m = ln.match(/^\d+[.)]\s+(.*)$/))) { listItem(true, m[1]); continue; }
    const lm = LABEL_LINE(ln);
    if (lm) { flushList(); startField(lm[1].trim(), (lm[2] || '').trim()); continue; }
    const bm = ln.match(/^\*\*\s*((?:Steps?|Drill|Procedure)(?:\s+[\d-]+)?)\s*:\s*(.+?)\s*\*\*\s?(.*)$/i);
    if (bm) {
      flushList();
      startField(bm[1].trim(), bm[3].trim() ? `${bm[2].trim()} ${bm[3].trim()}` : bm[2].trim());
      continue;
    }
    if (!(openList && /^\s+\S/.test(ln))) flushList();
    pushInline(ln);
  }
  flushList(); closeTask();
  return { tasks, blocks };
};
