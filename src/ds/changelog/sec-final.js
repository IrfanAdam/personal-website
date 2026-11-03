/* ADAM/DS — ds/changelog/sec-final · close · [plan:2026-11-02_192021-changelog-parity.md#phase-7] */
// Exports: finalizeSection
import { taskTitleOf } from './task-shape.js';
import { taskInner, renderTask } from './render-task.js';
import { renderParts, renderFlow, fieldText } from './render-blocks.js';
import { esc, fmtInline, cleanHead } from './fmt-text.js';
import { joinStatus, gatePassed, gateOnlyLine, headStatus } from './sec-status.js';
// — Section finalizer —
const stampNum = (title) => {
  const tt = taskTitleOf(title);
  if (tt.num) return tt.num.toLowerCase();
  const cut = cleanHead(title).replace(/✓\s*done\s*—?/i, '').replace(/✗\s*cancelled\s*—?/i, '');
  const m = cut.replace(/[✓✗]/g, '').trim().match(/^(Task|Step|Phase)\s+([\d-]+)\s*$/i);
  return m ? m[2].toLowerCase() : '';
};
const isStamp = (t, secNum) => {
  if (t.lead.length || t.loose.length) return false;
  if (t.fields.some((f) => fieldText(f) || (f.parts || []).length)) return false;
  const n = stampNum(t.title);
  return !!n && !!secNum && n === secNum;
};
// [plan:2026-11-02_192021-changelog-parity.md#phase-7]
export const finalizeSection = (sec) => {
  let head = sec.head;
  const htag = sec.htag;
  const { tasks, blocks, suffix, htextRaw } = sec;
  const makeHead = (htext) => {
    const hc = cleanHead(htext).replace(/\s*([✓✗])\s*(done|cancelled)(\s*\([^)]*\))?\s*$/i, '');
    return `<${htag}>${fmtInline(hc.trim())}</${htag}>` + headStatus(htext, suffix);
  };
  const renderBlock = (b) => (b.t === 'raw' ? b.html : renderParts([b]));
  let body = blocks.map(renderBlock).join('');
  let real = tasks.filter((t) => t.title);
  if (htag === 'h2' && real.length) {
    const secNum = (taskTitleOf(cleanHead(htextRaw)).num || '').toLowerCase();
    const stamps = real.filter((t) => isStamp(t, secNum));
    if (stamps.length) {
      real = real.filter((t) => !isStamp(t, secNum));
      if (!/✓ DONE|✗ cancelled/.test(head)) {
        if (stamps.every((t) => t.done)) head = makeHead(`${htextRaw} ✓ done`);
        else if (stamps.every((t) => t.cancelled)) head = makeHead(`${htextRaw} ✗ cancelled`);
      }
    }
  }
  const isPhaseHead = /^Phase\b/i.test(cleanHead(htextRaw));
  if (isPhaseHead && htag === 'h2' && real.length && !/✓ DONE|✗ cancelled/.test(head)) {
    const total = real.length;
    const done = real.filter((t) => t.done || t.cancelled).length;
    const allDone = done === total;
    const hasGate = !!String(suffix || '').trim();
    let statusText = '';
    let cls = 'ds-is-gate';
    if (allDone && (!hasGate || gatePassed(suffix))) {
      statusText = joinStatus('✓ DONE', suffix);
      cls = 'ds-is-done';
    } else if (suffix) statusText = joinStatus(`${done}/${total}`, suffix);
    else statusText = `${done}/${total}`;
    const line = `<p class="ds-status ${cls}">${statusText}</p>`;
    if (head.includes('</h2>')) head = head.replace(/<\/h2>.*/, `</h2>${line}`);
    else head = `<h2>${fmtInline(cleanHead(htextRaw))}</h2>${line}`;
  }
  const carriers = tasks.filter((t) => !t.title);
  const carrierContent = carriers.some((t) => t.lead.length || (t.loose || []).length
    || t.fields.some((f) => fieldText(f) || (f.parts || []).length));
  if (!head && real.length === 1) {
    const ft = taskTitleOf(real[0].title);
    let verdict = '';
    if (real[0].done) verdict = '✓ done';
    else if (real[0].cancelled) verdict = '✗ cancelled';
    head = `<h2>${fmtInline(ft.name || (ft.num ? `Task ${ft.num}` : 'Task'))}</h2>`;
    head += headStatus(verdict, suffix);
  }
  if (htag === 'h3-task' && real.length === 1 && !carrierContent && !blocks.length) {
    const lone = real[0];
    const lt = taskTitleOf(lone.title);
    const gatePart = suffix ? ` · ${esc(suffix.trim().replace(/^[✓·\s]+/, '').trim())}` : '';
    const shipParen = lt.shipped ? ` (${lt.shipped})` : '';
    let status = '<p class="ds-status ds-is-gate">0/1</p>';
    if (lone.done) status = `<p class="ds-status ds-is-done">✓ DONE${esc(shipParen)}${gatePart}</p>`;
    else if (lone.cancelled) {
      status = `<p class="ds-status ds-is-cancelled">✗ cancelled${esc(shipParen)}${gatePart}</p>`;
    } else if (suffix) status = gateOnlyLine(suffix);
    head = `<h2>${fmtInline(lt.name || (lt.num ? `Task ${lt.num}` : 'Task'))}</h2>` + status;
    body += taskInner(lone);
  } else if (real.length) {
    for (const t of carriers) {
      if (t.lead.length) body += `<p>${fmtInline(t.lead.join(' ').trim())}</p>`;
      body += renderFlow(t);
    }
    body += '<div class="ds-tasks">' + real.map(renderTask).join('') + '</div>';
  } else if (tasks.length) {
    for (const t of tasks) {
      if (t.lead.length) body += `<p>${fmtInline(t.lead.join(' ').trim())}</p>`;
      body += renderFlow(t, true);
    }
  }
  return { head, body };
};
