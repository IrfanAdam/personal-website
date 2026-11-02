/* ADAM/DS — ds/changelog/render-blocks.js · block + field renderers ·
   [plan:2026-11-02_231259-changelog-task-folds.md#phase-2] */
// Exports: renderParts, fieldText, renderFieldOpen, renderFieldsOpen, renderFlow
import { fmtInline, escHtml } from './fmt-text.js';
import { isObjective, fieldRank } from './task-shape.js';
// — Blocks —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-2]
export const renderParts = (parts) => parts.map((p) => {
  if (p.t === 'list') {
    const tag = p.ordered ? 'ol' : 'ul';
    const items = p.items.map((it) => `<li>${fmtInline(it)}</li>`).join('');
    return `<${tag}>${items}</${tag}>`;
  }
  if (p.t === 'pre') {
    const cls = p.lang ? ` class="language-${escHtml(p.lang)}"` : '';
    return `<pre><code${cls}>${p.code}</code></pre>`;
  }
  return `<p>${fmtInline(p.text)}</p>`;
}).join('');
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-2]
export const fieldText = (f) => (f.inline || []).filter(Boolean).join(' ').trim();
// — Fields —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-2]
export const renderFieldOpen = (f) => {
  const inline = fieldText(f);
  const blocks = renderParts(f.parts || []);
  if (!inline && !blocks) return '';
  const val = inline ? `<span class="ds-f-v">${fmtInline(inline)}</span>` : '';
  const key = `<span class="ds-f-t">${fmtInline(f.label)}</span>`;
  return `<div class="ds-field">${key}${val}${blocks}</div>`;
};
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-2]
export const renderFieldsOpen = (fields) => (fields || []).map(renderFieldOpen).filter(Boolean).join('');
// — Flow —
// [plan:2026-11-02_231259-changelog-task-folds.md#phase-2]
export const renderFlow = (t, ledeObj) => {
  const units = [];
  for (const f of (t.fields || [])) {
    if (ledeObj && isObjective(f.label)) {
      const paras = f.parts.filter((p) => p.t === 'para').map((p) => p.text);
      const otext = [...f.inline, ...paras].filter(Boolean).join(' ').trim();
      let html = otext ? `<p>${fmtInline(otext)}</p>` : '';
      html += renderParts(f.parts.filter((p) => p.t !== 'para'));
      if (html) units.push({ seq: f.seq ?? 0, html });
    } else {
      const html = renderFieldOpen(f);
      if (html) units.push({ seq: f.seq ?? 0, html });
    }
  }
  for (const p of (t.loose || [])) {
    const html = renderParts([p]);
    if (html) units.push({ seq: p.seq ?? 0, html });
  }
  units.sort((a, b) => a.seq - b.seq);
  return units.map((u) => u.html).join('');
};
