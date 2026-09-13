/* ADAM/DS — library/header.js · Header section · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { playground } from '../playground.js';
const headerTokens=['--color-header',
  '--color-line',
  '--size-strip',
  '--space-8',
  '--space-12',
  '--border-hairline',
  '--z-header'];
function headerRender(s){const pad=s.density==='compact'?'var(--space-4)':'var(--space-8)';
  const f=s
    .filter;
  const on=i=>i===f?' on':'';
  const wrap=s
    .onDark?
      ' data-theme="dark" style="background:var(--color-bg);padding:var(--space-8);border:var(--border-hairline)"'
      :'';
  return [
  `<div`,
  wrap,
  `><div class="top" style="position:relative;top:auto;bottom:auto"><div class="stripbar" style="padding:`,
  pad,
  ` var(--gutter)"><div class="strip" style="position:relative"><a href="javascript:void(0)" class="`,
  on('a'),
  `"><img src="/icons/helix.jpg" alt=""/></a><a href="javascript:void(0)" class="`,
  on('b'),
  `"><img src="/icons/fluxx.jpg" alt=""/></a><button class="vtab`,
  on('list'),
  `">≡</button><button class="vtab`,
  on('grid'),
  `">▦</button></div><div class="strip-meta"><span class="hint">`,
  s.count,
  `</span></div></div></div></div>`,
].join('');} function headerCode(s){return [
  `<header class="top"><div class="stripbar"><div class="strip"><!-- thumbs + vtab --></div><span class="hint">`,
  s.count,
  `</span></div></header> <!-- filter:`,
  s.filter,
  ` density:`,
  s.density,
  ` -->`,
]
  .join('');
} const headerKnobs=[{key:'filter',
    label:'active',
    type:'select',
    default:'a',
    options:[{value:'a',label:'helix'},
      {value:'b',label:'fluxx'},
      {value:'list',label:'list'},
      {value:'grid',label:'grid'}]},
  {key:'density',
    label:'density',
    type:'select',
    default:'default',
    options:[{value:'default',label:'default'},{value:'compact',label:'compact'}]},
  {key:'count',
    label:'count',
    type:'select',
    default:'14 stories',
    options:[{value:'14 stories',label:'14 stories'},{value:'8 stories',label:'8 stories'}]},
  {key:'onDark',label:'on dark',type:'boolean',default:false}];
export function headerSheet(){return playground({title:'Header',
      sub:['Sticky top — <span class="tok">.top</span> + <span class="tok">.stripbar</span> + <span ',
        'class="tok">.strip</span> + <span class="tok">.vtab</span> + <span class="tok">.tab-frame</span>. ',
        'Density is a padding knob; active drives <span class="tok">.on</span>; count is the <span ',
        'class="tok">.hint</span>. No restyle — framing only.'].join(''),
      knobs:headerKnobs,
      render:headerRender,
      code:headerCode,
      tokens:headerTokens});}
