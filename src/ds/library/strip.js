/* ADAM/DS — library/strip.js · Strip tabs section · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { playground } from '../playground.js';
const stripTokens=['--size-strip',
  '--size-strip-tab',
  '--border-hairline',
  '--radius-none',
  '--color-surface',
  '--color-ink',
  '--color-ink-muted',
  '--dur-base',
  '--scale-press'];
function stripRender(s){const a=s.active;
  const t=(i,n)=>[
  `<a href="javascript:void(0)" class="`,
  a===String(i)?'on':'',
  `"><img src="/icons/`,
  n,
  `.jpg" alt=""/></a>`,
].join('');return [
  `<div class="strip" style="position:relative;max-width:var(--size-ds-demo-strip)">`,
  t(0,'helix'),
  t(1,'fluxx'),
  `<button class="vtab`,
  a==='2'?' on':'',
  `">≡</button><button class="vtab`,
  a==='3'?' on':'',
  `">▦</button></div>`,
].join('');} function stripCode(s){return [
  `<div class="strip"><a class="`,
  s.active==='0'?'on':'',
  `"><img/></a><a class="`,
  s.active==='1'?'on':'',
  `"><img/></a><button class="vtab`,
  s.active==='2'?' on':'',
  `">≡</button><button class="vtab`,
  s.active==='3'?' on':'',
  `">▦</button></div>`,
]
  .join('');
} const stripKnobs=[{key:'active',
    label:'active',
    type:'select',
    default:'0',
    options:[{value:'0',label:'thumb 1'},
      {value:'1',label:'thumb 2'},
      {value:'2',label:'list tab'},
      {value:'3',label:'grid tab'}]}];
export function stripSheet(){return playground({title:'Strip tabs',
      sub:['Header tabs — <span class="tok">.strip a</span> 56×56 + <span class="tok">.vtab</span>, shared gliding ',
        'frame <span class="tok">.tab-frame</span> (380ms signature).'].join(''),
      knobs:stripKnobs,
      render:stripRender,
      code:stripCode,
      tokens:stripTokens});}
