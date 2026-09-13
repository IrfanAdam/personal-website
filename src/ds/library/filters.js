/* ADAM/DS — library/filters.js · Filters section · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { playground } from '../playground.js';
const filtersTokens=['--space-8',
  '--space-14',
  '--color-ink',
  '--color-bg',
  '--border-hairline',
  '--radius-none',
  '--text-meta'];
function filtersRender(s){const pills=['All','Product','AI','Fintech'].map((p)=>[
  `<a class="pill`,
  p===s.active?' on':'',
  `" href="javascript:void(0)">`,
  p,
  `</a>`,
].join('')).join('');return [
  `<div class="filters">`,
  pills,
  `</div>`,
].join('');} function filtersCode(s){return [
  `<div class="filters">`,
  ['All','Product','AI','Fintech'].map((p)=>`<a class="pill${p===s.active?' on':''}">${p}</a>`).join(''),
  `</div> <!-- active:`,
  s.active,
  ` -->`,
]
  .join('');
} const filtersKnobs=[{key:'active',
    label:'active',
    type:'select',
    default:'All',
    options:[{value:'All',label:'All'},
      {value:'Product',label:'Product'},
      {value:'AI',label:'AI'},
      {value:'Fintech',label:'Fintech'}]}];
export function filtersSheet(){return playground({title:'Filters',
      sub:['Filter bar — <span class="tok">.filters</span> + <span class="tok">.pill.on</span>. Active drives the ',
        'ink fill.'].join(''),
      knobs:filtersKnobs,
      render:filtersRender,
      code:filtersCode,
      tokens:filtersTokens});}
