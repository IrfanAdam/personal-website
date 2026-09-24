/* ADAM/DS — primitives/field.js · Field primitive · [plan:2026-09-24_160000-primitives-complete.md#phase-1] */
// Exports: fieldSheet — Field primitive sheet
// — Tokens · Render · Sheet —

import { component } from '../component.js';
import { fieldCode } from './field-code.js';
import { fieldKnobs, fieldAnat, fieldBehav } from './field-meta.js';

const fieldTokens = [
  '--size-input-h',
  '--color-input-bg',
  '--color-input-line',
  '--color-input-focus',
  '--color-accent',
  '--color-ink-muted',
  '--font-mono',
  '--font-sans',
  '--text-meta',
  '--text-body',
  '--space-6',
  '--space-8',
  '--space-10',
  '--border-hairline',
  '--radius-none',
  '--size-frame',
  '--space-2',
];

function fieldRender(s) {
  const err = s.state === 'error';
  const dis = s.state === 'disabled';
  const errCls = err ? ' field--error' : '';
  const disAttr = dis ? ' disabled' : '';
  let input = '';
  if (s.control === 'input') {
    input = `<input placeholder="${s.placeholder}" value="${s.value}"${disAttr}>`;
  } else if (s.control === 'textarea') {
    input = `<textarea placeholder="${s.placeholder}"${disAttr}>${s.value}</textarea>`;
  } else {
    input = `<select${disAttr}><option>${s.placeholder}</option>`
      + `<option selected>${s.value}</option><option>Other</option></select>`;
  }
  const hint = err
    ? `<span class="field-error">${s.errorText}</span>`
    : `<span class="field-hint">${s.hint}</span>`;
  const inner = `<div class="field${errCls}"><label>${s.label}</label>${input}${hint}</div>`;
  if (s.onDark) {
    return `<div data-theme="dark" style="background:var(--color-bg);padding:var(--space-16);`
      + `border:var(--border-hairline)">${inner}</div>`;
  }
  return `<div>${inner}</div>`;
}

export function fieldSheet() {
  return component({
    title: 'Field',
    sub: 'Label (mono uppercase <span class="tok">--tracking-label</span>) + control (hairline '
      + '<span class="tok">--color-input-line</span>, paper <span class="tok">--color-input-bg</span>, '
      + 'ink focus ring 2px+2px) + hint/error (accent).',
    anatomy: fieldAnat,
    behaviour: fieldBehav,
    knobs: fieldKnobs,
    render: fieldRender,
    code: fieldCode,
    tokens: fieldTokens,
  });
}
