/* ADAM/DS — ds/changelog/render-task · task fold renderer ·
   [plan:2026-11-02_192021-changelog-parity.md#phase-7] */
// Exports: taskInner, renderTask
// — Imports —
import { renderParts, fieldText, renderFieldsOpen, renderFlow } from './render-blocks.js';
import { taskTitleOf, taskTick, isObjective, fieldRank } from './task-shape.js';
import { fmtInline } from './fmt-text.js';
// — Task inner —
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const taskInner = (task) => {
  const { note } = taskTitleOf(task.title);
  const obj = task.fields.find((f) => isObjective(f.label));
  const rest = task.fields.filter((f) => !isObjective(f.label));
  let inner = note ? `<p>${fmtInline(note)}</p>` : '';
  if (obj) {
    const otext = [...obj.inline, ...obj.parts.filter((p) => p.t === 'para').map((p) => p.text)]
      .filter(Boolean).join(' ').trim();
    if (otext) inner += `<p>${fmtInline(otext)}</p>`;
    inner += renderParts(obj.parts.filter((p) => p.t !== 'para'));
  }
  if (task.lead.length) inner += `<p>${fmtInline(task.lead.join(' ').trim())}</p>`;
  rest.sort((a, b) => (fieldRank(a.label) - fieldRank(b.label)) || (a.idx - b.idx));
  inner += renderFieldsOpen(rest);
  inner += renderParts(task.loose);
  return inner;
};
// — Task fold —
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const renderTask = (task) => {
  const { num, name, shipped, note } = taskTitleOf(task.title);
  const h3 = name || (num ? `Task ${num}` : 'Task');
  const trig = `${taskTick(task)}<h3>${fmtInline(h3)}</h3><span class="ds-caret">›</span>`;
  const obj = task.fields.find((f) => isObjective(f.label));
  const rest = task.fields.filter((f) => !isObjective(f.label));
  const hasContent = !!note || !!obj || task.lead.length > 0
    || rest.some((f) => fieldText(f) || (f.parts || []).length)
    || (task.loose || []).length > 0;
  const bare = (extra) => `<section class="ds-subtask"><div class="ds-task-bare">${taskTick(task)}` +
    `<h3>${fmtInline(h3)}</h3></div>${extra || ''}</section>`;
  if (!hasContent) return bare();
  const inner = taskInner(task);
  if (!rest.length && !obj && !task.lead.length && !(task.loose || []).length) return bare(inner);
  if (!inner) return bare();
  return `<section class="ds-subtask"><details class="ds-task-fold"><summary class="ds-acc-head">${trig}` +
    `</summary><div class="ds-acc-body">${inner}</div></details></section>`;
};
