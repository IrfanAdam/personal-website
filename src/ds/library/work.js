/* ADAM/DS — library/work.js · Work row section · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { playground } from '../playground.js';
import { workRowHTML } from '../specimens.js';
const workTokens=['--color-ink-muted',
  '--font-mono',
  '--text-meta',
  '--space-12',
  '--space-4',
  '--space-14',
  '--border-hairline',
  '--tracking-body'];
function workRender(s){const rows=Number(s.count);
  let h=[
  `<div class="works">`,
].join('');for(let i=0;i<rows;i++)h+=workRowHTML(s.title,s.meta);h+=[
  `</div>`,
].join('');if(s.layout==='grid')h=[
  `<div class="cols" style="--cols:2"><div class="col">`,
  h,
  `</div><div class="col">`,
  h,
  `</div></div>`,
].join('');return h;} function workCode(s){return s.layout==='grid'?[
  `<div class="cols"><div class="col"><a class="work">…</a>×`,
  s.count,
  `</div></div>`,
].join(''): [
  `<div class="works"><a class="work"><span class="work-title">`,
  s.title,
  `</span><span class="work-meta">`,
  s.meta,
  `</span></a>×`,
  s.count,
  `</div>`,
]
  .join('');
} const workKnobs=[{key:'title',
    label:'title',
    type:'select',
    default:'Velocity — launch analytics',
    options:[{value:'Velocity — launch analytics',label:'Velocity'},{value:'Helix — sales telemetry',label:'Helix'}]},
  {key:'meta',
    label:'meta',
    type:'select',
    default:'SaaS · velocity · 2024',
    options:[{value:'SaaS · velocity · 2024',label:'SaaS · velocity · 2024'},
      {value:'Fintech · 2024',label:'Fintech · 2024'}]},
  {key:'count',
    label:'rows',
    type:'select',
    default:'1',
    options:[{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'}]},
  {key:'layout',
    label:'layout',
    type:'select',
    default:'list',
    options:[{value:'list',label:'list'},{value:'grid',label:'grid (cols 2)'}]}];
export function workSheet(){return playground({title:'Work row',
      sub:['List row — <span class="tok">.works → .work</span> + <span class="tok">.work-title / .work-meta</span>. ',
        'Layout knob switches list → grid (2-col cols).'].join(''),
      knobs:workKnobs,
      render:workRender,
      code:workCode,
      tokens:workTokens});}
