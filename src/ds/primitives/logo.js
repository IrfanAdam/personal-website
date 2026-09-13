/* ADAM/DS — primitives/logo.js · Brand mark primitive · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { component } from '../component.js';
function logoRender(s){const wrap=s.onDark?[
  ` data-theme="dark" style="background:var(--color-bg);padding:var(--space-16);border:var(--border-hairline)"`,
].join(''):'';return [
  `<div`,
  wrap,
  `><span class="logo">Irfan<small>Adam M</small></span>`,
  `<span `,
  `style="font-family:var(--font-mono);font-size:var(--text-meta);color:var(--color-ink-muted);margin-left:var(--spa`,
  `ce-14)">`,
  s.case==='lower'?'irfan — lower?':'Irfan — as authored',
  `</span></div>`,
].join('');} function logoCode(){return [
  `<span class="logo">Irfan<small>Adam M</small></span>`,
]
  .join('');
} const logoKnobs=[{key:'case',
    label:'case',
    type:'select',
    default:'default',
    options:[{value:'default',label:'as authored'},{value:'lower',label:'lower (probe)'}]},
  {key:'onDark',label:'on dark',type:'boolean',default:false}];
const logoTokens=['--font-sans','--weight-bold','--tracking-display','--leading-display','--text-logo'];
const logoAnat=['<span class="tok">.logo</span> — 700 weight, <span class="tok">--tracking-display</span>, <span ',
  'class="tok">--text-logo</span>. As authored; no variants ship.'].join('');
const logoBehav='Static wordmark; no focus. Dark: ink brightens via probe. Lowercase probe is docs-only — never ship.';
export function logoSheet(){return component({title:'Brand mark',
        sub:['Wordmark — <span class="tok">.logo</span> (700, <span class="tok">--tracking-display</span>, <span ',
          'class="tok">--text-logo</span>). Shown as authored.'].join(''),
        anatomy:logoAnat,
        behaviour:logoBehav,
        knobs:logoKnobs,
        render:logoRender,
        code:logoCode,
        tokens:logoTokens});}
