/* ADAM/DS — primitives/badge.js · Badge primitive · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { component } from '../component.js';
const badgeTokens=['--color-accent',
  '--color-on-accent',
  '--color-ink',
  '--color-bg',
  '--font-mono',
  '--text-label',
  '--space-3',
  '--space-8',
  '--radius-none'];
function badgeRender(s){const m=s.variant==='muted'?' badge--muted':'';
  return [
  `<span class="badge`,
  m,
  `">`,
  s.label,
  `</span>`,
].join('');} function badgeCode(s){const m=s.variant==='muted'?' badge--muted':'';return [
  `<span class="badge`,
  m,
  `">`,
  s.label,
  `</span>`,
]
  .join('');
} const badgeKnobs=[{key:'variant',
    label:'variant',
    type:'select',
    default:'accent',
    options:[{value:'accent',label:'accent · vermilion'},{value:'muted',label:'muted · ink'}]},
  {key:'label',
    label:'label',
    type:'select',
    default:'New',
    options:[{value:'New',label:'New'},{value:'Beta',label:'Beta'},{value:'Limited',label:'Limited'}]}];
const badgeAnat=['<span class="tok">.badge</span> — vermilion <span class="tok">--color-accent</span> + <span ',
  'class="tok">--color-on-accent</span>; <span class="tok">--muted</span> is ink for body-safe AA.'].join('');
const badgeBehav=[
  'Static chip; no focus ring. Accent variant is large-text/graphics only (3.55/4.71:1). Dark proof via probe; '
  ,
  'muted passes AA body.'].join('');
export function badgeSheet(){return component({title:'Badge',
        sub:['Accent chip — <span class="tok">.badge</span> on <span class="tok">--color-accent</span> (vermilion). ',
          'A11y: large text only — muted is ink for body.'].join(''),
        anatomy:badgeAnat,
        behaviour:badgeBehav,
        knobs:badgeKnobs,
        render:badgeRender,
        code:badgeCode,
        tokens:badgeTokens});}
