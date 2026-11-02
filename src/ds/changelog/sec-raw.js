/* ADAM/DS — ds/changelog/sec-raw.js · raw section slicing ·
   [plan:2026-11-02_231259-changelog-task-folds.md#phase-1] */
// Exports: sectionRaw, stripGateThread, stripInlineAnchors, DROP_LINE
// — Chunk splitter (private; frozen graph allows no imports) —
const chunks = (md) => {
  const out = [''];
  let at = 0;
  let fence = false;
  for (const ln of String(md || '').split('\n')) {
    if (!fence && /^## /.test(ln)) {
      at += 1;
      out[at] = ln.slice(3);
    } else {
      out[at] += (out[at] ? '\n' : '') + ln;
    }
    if (/^\s*```/.test(ln)) {
      fence = !fence;
    }
  }
  return out;
};
// — Head matching —
const stripHeadMarks = (h) => String(h || '')
  .replace(/\{#[^}]*\}/g, '')
  .replace(/[✓✗]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const firstLineOf = (r) => {
  const nl = r.indexOf('\n');
  return ((nl < 0 ? r : r.slice(0, nl))).replace(/^#{2,4}\s+/, '');
};
const matchHead = (bodies, head) => {
  const want = String(head);
  let hit = bodies.find((r) => firstLineOf(r) === want);
  if (!hit) {
    const bare = stripHeadMarks(want);
    hit = bodies.find((r) => stripHeadMarks(firstLineOf(r)) === bare);
  }
  return hit || '';
};
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const sectionRaw = (md, head) => {
  const text = String(md || '');
  if (!text || head === undefined || head === null) {
    return '';
  }
  const h2 = matchHead(chunks(text).slice(1).map((s) => '## ' + s), head);
  if (h2) {
    return h2;
  }
  return matchHead(text.split(/^### /m).slice(1).map((p) => '### ' + p), head);
};
// — Gate thread stripping —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const stripGateThread = (raw) => {
  const out = String(raw || '');
  const idx = out.indexOf('- REF GATE');
  if (idx === -1) {
    return out;
  }
  const m = out.slice(idx).match(/\{#(?:phase|task|step)[^}]*\}/i);
  if (m) {
    const apos = out.indexOf(m[0], idx);
    return (out.slice(0, idx).trimEnd() + '\n' + out.slice(apos)).trim() + '\n';
  }
  return out
    .replace(/^[ \t]*-[ \t]*REF GATE[^\n]*(\n|$)/gim, '')
    .replace(/^[ \t]*-[ \t]*Evidence\b[^\n]*(\n|$)/gim, '');
};
// — Inline anchors —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const stripInlineAnchors = (src) => String(src || '')
  .split(/(`[^`\n]*`)/g)
  .map((p, i) => (i % 2 === 1 ? p : p.replace(/\{#[^}]*\}/g, '')))
  .join('');
// — Line filter —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const DROP_LINE = (ln) => {
  const t = ln.trim();
  return !t
    || /^\s*\|/.test(ln)
    || /^<!--[\s\S]*-->$/.test(t)
    || /^\{#[^}]*\}$/.test(t)
    || /^\*Due:[^*]*\*$/.test(t)
    || /^---\s*$/.test(t)
    || /^\*{1,2}Tags:\s*[^*]*\*{1,2}$/.test(t);
};
