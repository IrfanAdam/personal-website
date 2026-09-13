/* ADAM/DS — library/footer.js · Footer section · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { playground } from '../playground.js';
const footerTokens=['--color-ink-muted','--color-line','--space-14','--space-30','--border-hairline'];
function footerRender(s){
  const wrap=s
    .onDark?
      ' data-theme="dark" style="background:var(--color-bg);padding:var(--space-8);border:var(--border-hairline)"'
      :'';
  return [
  `<div`,
  wrap,
  `><footer style="margin-top:0"><nav><a href="javascript:void(0)">Read.cv</a>`,
  `<a href="javascript:void(0)">LinkedIn</a></nav><div>Usually find me listening to Philosophize This.</div>`,
  `<div>© 2025 copy to your hearts content</div></footer></div>`,
].join('');} function footerCode(){return [
  `<footer><nav><a>Read.cv</a><a>LinkedIn</a></nav><div>© 2025 …</div></footer>`,
].join('');} const footerKnobs=[{key:'onDark',label:'on dark',type:'boolean',default:false}];
export function footerSheet(){return playground({title:'Footer',
      sub:['Site footer — <span class="tok">footer</span> + <span class="tok">nav a</span> dividers via <span ',
        'class="tok">--border-hairline</span>. Same class as production.'].join(''),
      knobs:footerKnobs,
      render:footerRender,
      code:footerCode,
      tokens:footerTokens});}
