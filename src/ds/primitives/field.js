/* ADAM/DS — primitives/field.js · Field primitive · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { component } from '../component.js';
import { fieldCode } from './field-code.js';
import { fieldKnobs, fieldAnat, fieldBehav } from './field-meta.js';
const fieldTokens=['--size-input-h',
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
  '--space-2'];
function fieldRender(s){const ctl=s.control;
  const err=s
    .state==='error';
  const dis=s
    .state==='disabled';
  const errCls=err?' field--error':'';
  const disAttr=dis?' disabled':'';
  const hint=err?[
  `<span class="field-error">`,
  s.errorText,
  `</span>`,
].join(''):[
  `<span class="field-hint">`,
  s.hint,
  `</span>`,
].join('');let input='';if(ctl==='input')input=[
  `<input placeholder="`,
  s.placeholder,
  `" value="`,
  s.value,
  `"`,
  disAttr,
  `>`,
].join('');else if(ctl==='textarea')input=[
  `<textarea placeholder="`,
  s.placeholder,
  `"`,
  disAttr,
  `>`,
  s.value,
  `</textarea>`,
].join('');else input=[
  `<select`,
  disAttr,
  `><option>`,
  s.placeholder,
  `</option><option selected>`,
  s.value,
  `</option><option>Other</option></select>`,
].join('');const wrap=s.onDark?[
  ` data-theme="dark" style="background:var(--color-bg);padding:var(--space-16);border:var(--border-hairline)"`,
].join(''):'';return [
  `<div`,
  wrap,
  `><div class="field`,
  errCls,
  `"><label>`,
  s.label,
  `</label>`,
  input,
  hint,
  `</div></div>`,
].join('');}
export function fieldSheet(){return component({title:'Field',
        sub:['Label (mono uppercase <span class="tok">--tracking-label</span>) + control (hairline <span ',
          'class="tok">--color-input-line</span>, paper <span class="tok">--color-input-bg</span>, ink focus ring ',
          '2px+2px) + hint/error (accent).'].join(''),
        anatomy:fieldAnat,
        behaviour:fieldBehav,
        knobs:fieldKnobs,
        render:fieldRender,
        code:fieldCode,
        tokens:fieldTokens});}
