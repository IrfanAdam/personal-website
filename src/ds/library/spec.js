/* ADAM/DS — library/spec.js · Spec list section · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { playground } from '../playground.js';
import { specItemHTML } from '../specimens.js';
const specTokens=['--color-ink-muted',
  '--color-line',
  '--space-14',
  '--space-8',
  '--space-10',
  '--space-18',
  '--border-hairline',
  '--text-label',
  '--tracking-mono',
  '--weight-semibold'];
function specRender(){return [
  `<dl class="spec">`,
  specItemHTML('Deliverables','Design system, web'),
  specItemHTML('Role','Design engineer'),
  specItemHTML('Platform','Web'),
  `</dl>`,
].join('');} function specCode(){return [
  `<dl class="spec"><div><dt>Deliverables</dt><dd>Design system, web</dd></div><div><dt>Role</dt>`,
  `<dd>Design engineer</dd></div></dl>`,
].join('');} const specKnobs=[];
export function specSheet(){return playground({title:'Spec list',
      sub:['Case metadata — <span class="tok">dl.spec</span> 2-col grid, hairline rule per group, <span ',
        'class="tok">dt</span> mono label.'].join(''),
      knobs:specKnobs,
      render:specRender,
      code:specCode,
      tokens:specTokens});}
