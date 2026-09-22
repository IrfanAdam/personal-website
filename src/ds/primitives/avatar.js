/* ADAM/DS — primitives/avatar.js · Avatar primitive · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { component } from '../component.js';
const AVATAR_SZ = { sm: ' avatar--sm', lg: ' avatar--lg' };
function avatarRender(s){const sz = AVATAR_SZ[s.size] || '';
  const img=s
    .kind==='image'?[
  `<img src="/icons/helix.jpg" alt="">`,
].join(''):[
  s.initial,
].join('');const wrap=s.onDark?[
  ` data-theme="dark" `,
  `style="background:var(--color-bg);padding:var(--space-16);border:var(--border-hairline);display:inline-flex"`,
].join(''):'';return [
  `<div`,
  wrap,
  `><span class="avatar`,
  sz,
  `">`,
  img,
  `</span> <span `,
  `style="font-family:var(--font-mono);font-size:var(--text-meta);color:var(--color-ink-muted);margin-left:var(--spa`,
  `ce-8)">`,
  s.size,
  ` · `,
  s.kind,
  `</span></div>`,
]
  .join('');
} function avatarCode(s){const sz = AVATAR_SZ[s.size] || '';
const inner=s
  .kind==='image'?[
  `<img src="/icons/helix.jpg" alt="">`,
].join(''):[
  s.initial,
].join('');return [
  `<span class="avatar`,
  sz,
  `">`,
  inner,
  `</span>`,
]
  .join('');
} const avatarKnobs=[{key:'size',
    label:'size',
    type:'select',
    default:'md',
    options:[{value:'sm',label:'sm · 44 (min tap)'},{value:'md',label:'md · 44'},{value:'lg',label:'lg · 60'}]},
  {key:'kind',
    label:'kind',
    type:'select',
    default:'image',
    options:[{value:'image',label:'image'},{value:'initial',label:'initial'}]},
  {key:'initial',
    label:'initial',
    type:'select',
    default:'IA',
    options:[{value:'IA',label:'IA'},{value:'AD',label:'AD'},{value:'●',label:'●'}]},
  {key:'onDark',label:'on dark',type:'boolean',default:false}];
const avatarTokens=['--color-panel',
  '--color-ink',
  '--size-tap',
  '--space-60',
  '--text-small',
  '--text-meta',
  '--text-h3',
  '--weight-semibold',
  '--font-sans',
  '--border-hairline',
  '--radius-none'];
const avatarAnat=['<span class="tok">.avatar</span> + <span class="tok">--sm / --lg</span> — square <span ',
  'class="tok">--radius-none</span> 44/44/60 via <span class="tok">--size-tap/--space-60</span>. Image cover or ',
  'fallback initial.'].join('');
const avatarBehav=[
  'Static square; no focus ring. Fallback is centered mono. Dark: <span class="tok">--color-panel</span> border '
  ,
  'recomputes; no state change.'].join('');
export function avatarSheet(){return component({title:'Avatar',
        sub:['Zero-radius square — <span class="tok">.avatar</span> + <span class="tok">--sm / --lg</span>. Image ',
          'cover or fallback initial. 44px default via ',
          '<span class="tok">--size-tap</span> (sm bumped to meet min tap).'].join(''),
        anatomy:avatarAnat,
        behaviour:avatarBehav,
        knobs:avatarKnobs,
        render:avatarRender,
        code:avatarCode,
        tokens:avatarTokens});}
