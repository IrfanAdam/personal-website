/* ADAM/DS — ds/changelog/fmt-text.js · inline text formatting ·
   [plan:2026-11-02_231259-changelog-task-folds.md#phase-1] */
// Exports: esc, escHtml, fmtInline, cleanHead, isTaskHead, LABEL_LINE, TASK_HEAD
// — Escaping —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const esc = (t) => String(t || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const escHtml = (t) => esc(t)
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
// — Inline spans —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const fmtInline = (t) => String(t || '').split(/(`[^`\n]*`)/g).map((p, i) => {
  if (i % 2 === 1) {
    return `<code>${p.slice(1, -1)}</code>`;
  }
  return p
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\n]+?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}).join('');
// — Head matchers —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const LABEL_LINE = (ln) => ln.match(/^\*\*([^*]{1,80}?):\*\*\s?(.*)$/);
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const TASK_HEAD = (ln) => ln.match(/^###\s+(.+)$/);
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const isTaskHead = (title) => /^(Task|Step|Phase)\b/i.test(String(title || '').trim());
// — Head cleaning —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-1]
export const cleanHead = (t) => String(t || '')
  .replace(/\{#[^}]*\}/g, '')
  .replace(/<!--[\s\S]*?-->/g, '');
