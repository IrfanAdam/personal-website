/* ADAM/DS — library/card.js · Card section · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { playground } from '../playground.js';
import { cardHTML } from '../specimens.js';
const cardTokens=['--color-surface',
  '--color-chip',
  '--color-on-media',
  '--border-hairline',
  '--radius-none',
  '--dur-blur',
  '--dur-zoom',
  '--scale-zoom',
  '--space-10',
  '--space-6'];
function cardRender(s){const tags=s.tags?s.label.split(','):[];
  const extra = [
    s.hover ? 'force-hover' : '',
    s.linger ? 'in-view' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return cardHTML(s.title,s.meta,'/images/helix.png',tags,extra);
} function cardCode(s){const tags=s.tags?[
  `['`,
  s.label.split(',').join("','"),
  `']`,
].join(''):'[]';return [
  `<a class="card`,
  s.hover?' force-hover':'',
  s.linger?' in-view':'',
  `"><span class="img"><img src="/images/helix.png"/></span><span class="tags">`,
  s.tags?`<i>${s.label.split(',')[0]}</i>`:'',
  `</span><span class="scrim"></span><span class="card-info"><b>`,
  s.title,
  `</b><small>`,
  s.meta,
  `</small></span></a> <!-- tags:`,
  tags,
  ` hover:`,
  s.hover,
  ` linger:`,
  s.linger,
  ` -->`,
]
  .join('');
} const cardKnobs=[{key:'title',
    label:'title',
    type:'select',
    default:'Helix — sales telemetry',
    options:[{value:'Helix — sales telemetry',label:'Helix'},{value:'Fluxx',label:'Fluxx'}]},
  {key:'meta',
    label:'meta',
    type:'select',
    default:'helix · 2024',
    options:[{value:'helix · 2024',label:'helix · 2024'},{value:'fluxx · 2024',label:'fluxx · 2024'}]},
  {key:'label',
    label:'tags',
    type:'select',
    default:'Sales CRM',
    options:[{value:'Sales CRM',label:'Sales CRM'},
      {value:'Fintech',label:'Fintech'},
      {value:'Sales CRM,Fintech',label:'2 tags'}]},
  {key:'tags',label:'show tags',type:'boolean',default:true},
  {key:'hover',label:'force hover',type:'boolean',default:false},
  {key:'linger',label:'in-view',type:'boolean',default:true}];
export function cardSheet(){return playground({title:'Card',
      sub:['Masonry card — image-only surface, <span class="tok">.tags → .scrim + .card-info</span> on hover. Knobs: ',
        'tags, <span class="tok">.force-hover</span> pin, <span class="tok">.in-view</span> linger (mobile).'].join(''),
      knobs:cardKnobs,
      render:cardRender,
      code:cardCode,
      tokens:cardTokens});}
