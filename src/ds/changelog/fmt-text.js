/* ADAM/DS — ds/changelog/fmt-text.js · inline text formatting ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-6] */
// Exports: esc, escHtml, fmtInline, cleanHead, isTaskHead, LABEL_LINE, TASK_HEAD
// — Escaping —
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const esc = (t) => String(t || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const escHtml = (t) => esc(t)
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
// — Inline spans —
// Code spans are parked behind sentinels first so emphasis can still pair its
// markers across a code span (e.g. `*Merged from `x`.*`).
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const fmtInline = (t) => {
  const codes = [];
  const src = String(t || '').replace(/`([^`\n]*)`/g, (_, c) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0000`;
  });
  const out = src
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[Number(i)]}</code>`);
};
// — Head matchers —
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const LABEL_LINE = (ln) => ln.match(/^\*\*([^*]{1,80}?):\*\*\s?(.*)$/);
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const TASK_HEAD = (ln) => ln.match(/^###\s+(.+)$/);
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
// [plan:2026-11-02_192021-changelog-parity.md#phase-13]
export const phaseColon = (t) => String(t || '').replace(/^Phase\s+(\d+)\s*[—–-]\s*/i, 'Phase $1 : ');
export const isTaskHead = (title) => /^(Task|Step|Phase)\b/i.test(String(title || '').trim());
// — Head cleaning —
// [plan:2026-11-02_192021-changelog-parity.md#phase-6]
export const cleanHead = (t) => String(t || '')
  .replace(/\{#[^}]*\}/g, '')
  .replace(/<!--[\s\S]*?-->/g, '');
