/* ADAM/DS — Primitives: uniform template (Usage → Anatomy → Behaviour → tabs → knobs). */
import { note, code } from './specimens.js';
import { component, mountComponent } from './component.js';
const btnTokens=['--color-ink',
  '--color-bg',
  '--color-surface',
  '--color-panel',
  '--space-8',
  '--space-14',
  '--size-tap',
  '--border-hairline',
  '--radius-none',
  '--dur-soft'];
function btnRender(s){const c=`btn btn--${s.variant} btn--${s.size}`;const d=s.disabled?' disabled':'';const i=[
  `<button class="`,
  c,
  `"`,
  d,
  `>`,
  s.label,
  `</button> <a class="`,
  c,
  `" href="javascript:void(0)">Link</a>`,
].join('');return s.onDark?[
  `<div data-theme="dark" style="background:var(--color-bg);padding:var(--space-16);border:var(--border-hairline)">`,
  i,
  `</div>`,
].join(''):i;}
function btnCode(s){const c=`btn btn--${s.variant} btn--${s.size}`;return [
  `<button class="`,
  c,
  `"`,
  s.disabled?' disabled':'',
  `>`,
  s.label,
  `</button>`,
].join('');}
const btnKnobs=[{key:'variant',
    label:'variant',
    type:'select',
    default:'primary',
    options:[{value:'primary',label:'primary'},{value:'secondary',label:'secondary'},{value:'ghost',label:'ghost'}]},
  {key:'size',
    label:'size',
    type:'select',
    default:'md',
    options:[{value:'sm',label:'sm · 32'},{value:'md',label:'md · 44'}]},
  {key:'label',
    label:'label',
    type:'select',
    default:'Button',
    options:[{value:'Button',label:'Button'},
      {value:'Save',label:'Save'},
      {value:'View project',label:'View project'},
      {value:'Contact',label:'Contact'}]},
  {key:'disabled',label:'disabled',type:'boolean',default:false},
  {key:'onDark',label:'on dark',type:'boolean',default:false}];
const btnAnatomy=['<span class="tok">.btn</span> + <span class="tok">.btn--primary</span> (ink fill) / <span ',
  'class="tok">--secondary</span> (hairline) / <span class="tok">--ghost</span> (text); size <span ',
  'class="tok">--sm</span> 32 / <span class="tok">--md</span> 44 via <span class="tok">--size-tap</span>.'].join('');
const btnBehav=[
  'Hover: ink fill darkens; focus: <span class="tok">3px</span> ink ring offset <span class="tok">2px</span> '
  ,
  '(<span class="tok">--size-frame</span>); disabled: <span class="tok">opacity + disabled</span>; dark: <span ',
  'class="tok">[data-theme=dark]</span> proof. Try Tab.'].join('');
const tagTokens=['--color-chip',
  '--color-on-media',
  '--font-mono',
  '--text-label',
  '--space-3',
  '--space-7',
  '--radius-none'];
function tagRender(s){return [
  `<span class="tags" style="position:static;opacity:1"><i>`,
  s.label,
  `</i></span>`,
].join('');} function tagCode(s){return [
  `<span class="tags"><i>`,
  s.label,
  `</i></span>`,
]
  .join('');
} const tagKnobs=[{key:'label',
    label:'label',
    type:'select',
    default:'Sales CRM',
    options:[{value:'Sales CRM',label:'Sales CRM'},
      {value:'Product',label:'Product'},
      {value:'AI',label:'AI'},
      {value:'Case study',label:'Case study'}]}];
const tagAnat=['<span class="tok">.tags &gt; i</span> — mono <span class="tok">11px</span> on <span ',
  'class="tok">--color-chip</span> (62% ink) over image.'].join('');
const tagBehav=[
  'Static chip; no focus ring (text only). Dark: chip lightens via <span class="tok">--color-chip</span> probe; '
  ,
  'hover not applicable — tags hide via opacity in cards.'].join('');
const kickerTokens=['--font-mono','--color-ink-muted','--text-meta','--tracking-label'];
function kickerRender(s){return [
  `<p class="kicker">`,
  s.text,
  `</p>`,
].join('');} function kickerCode(s){return [
  `<p class="kicker">`,
  s.text,
  `</p>`,
]
  .join('');
} const kickerKnobs=[{key:'text',
    label:'text',
    type:'select',
    default:'Sales CRM · 2024',
    options:[{value:'Sales CRM · 2024',label:'Sales CRM · 2024'},
      {value:'Case study',label:'Case study'},
      {value:'View project · 2024',label:'View project · 2024'}]}];
const kickerAnat=['<span class="tok">.kicker</span> (also <span class="tok">.case .kicker</span>) — mono <span ',
  'class="tok">12px</span> muted, uppercase <span class="tok">--tracking-label</span>.'].join('');
const kickerBehav=[
  'Static eyebrow; no focus. Dark: <span class="tok">--color-ink-muted</span> recomputes; letter-spacing stays '
  ,
  '<span class="tok">--tracking-label</span>.'].join('');
const dividerTokens=['--color-line','--size-hairline','--space-14']; function dividerRender(){return [
  `<div style="width:100%"><p style="margin:0;color:var(--color-ink-muted)">Above</p><hr class="divider">`,
  `<p style="margin:0;color:var(--color-ink-muted)">Below</p></div>`,
].join('');} function dividerCode(){return [
  `<hr class="divider">`,
].join('');} const dividerKnobs=[];
const dividerAnat=['<span class="tok">hr.divider</span> / <span class="tok">.divider</span> — <span ',
  'class="tok">--border-hairline</span> (1px <span class="tok">--color-line</span>) margins <span ',
  'class="tok">--space-14</span>.'].join('');
const dividerBehav=[
  'Static rule; no focus. Dark: <span class="tok">--color-line</span> (10% ink) inverts via probe — same '
  ,
  'hairline.'].join('');
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
const fieldTokens=['--size-input-h',
  '--color-input-bg',
  '--color-input-line',
  '--color-input-focus',
  '--color-accent',
  '--color-ink-muted',
  '--font-mono',
  '--font-sans',
  '--text-meta',
  '--text-body',
  '--space-6',
  '--space-8',
  '--space-10',
  '--border-hairline',
  '--radius-none',
  '--size-frame',
  '--space-2'];
function fieldRender(s){const ctl=s.control;
  const err=s
    .state==='error';
  const dis=s
    .state==='disabled';
  const errCls=err?' field--error':'';
  const disAttr=dis?' disabled':'';
  const hint=err?[
  `<span class="field-error">`,
  s.errorText,
  `</span>`,
].join(''):[
  `<span class="field-hint">`,
  s.hint,
  `</span>`,
].join('');let input='';if(ctl==='input')input=[
  `<input placeholder="`,
  s.placeholder,
  `" value="`,
  s.value,
  `"`,
  disAttr,
  `>`,
].join('');else if(ctl==='textarea')input=[
  `<textarea placeholder="`,
  s.placeholder,
  `"`,
  disAttr,
  `>`,
  s.value,
  `</textarea>`,
].join('');else input=[
  `<select`,
  disAttr,
  `><option>`,
  s.placeholder,
  `</option><option selected>`,
  s.value,
  `</option><option>Other</option></select>`,
].join('');const wrap=s.onDark?[
  ` data-theme="dark" style="background:var(--color-bg);padding:var(--space-16);border:var(--border-hairline)"`,
].join(''):'';return [
  `<div`,
  wrap,
  `><div class="field`,
  errCls,
  `"><label>`,
  s.label,
  `</label>`,
  input,
  hint,
  `</div></div>`,
].join('');}
function fieldCode(s){const err=s.state==='error'?' field--error':'';let c=s.control==='input'?[
  `<input placeholder="`,
  s.placeholder,
  `">`,
].join(''):s.control==='textarea'?[
  `<textarea placeholder="`,
  s.placeholder,
  `"></textarea>`,
].join(''):[
  `<select><option>`,
  s.placeholder,
  `</option></select>`,
].join('');return [
  `<div class="field`,
  err,
  `">\n  <label>`,
  s.label,
  `</label>\n  `,
  c,
  `\n  `,
  s.state==='error'?`<span class="field-error">${s.errorText}</span>`:`<span class="field-hint">${s.hint}</span>`,
  `\n</div>`,
].join('');}
const fieldKnobs=[{key:'control',
    label:'control',
    type:'select',
    default:'input',
    options:[{value:'input',label:'input'},{value:'textarea',label:'textarea'},{value:'select',label:'select'}]},
  {key:'state',
    label:'state',
    type:'select',
    default:'default',
    options:[{value:'default',label:'default'},{value:'error',label:'error'},{value:'disabled',label:'disabled'}]},
  {key:'label',
    label:'label',
    type:'select',
    default:'Email',
    options:[{value:'Email',label:'Email'},{value:'Message',label:'Message'},{value:'Role',label:'Role'}]},
  {key:'placeholder',
    label:'placeholder',
    type:'select',
    default:'you@example.com',
    options:[{value:'you@example.com',label:'you@example.com'},
      {value:'Tell us…',label:'Tell us…'},
      {value:'Select…',label:'Select…'}]},
  {key:'value',
    label:'value',
    type:'select',
    default:'',
    options:[{value:'',label:'(empty)'},
      {value:'hello@adam.dev',label:'hello@adam.dev'},
      {value:'Filled text',label:'Filled text'}]},
  {key:'hint',
    label:'hint',
    type:'select',
    default:'We’ll never share your email.',
    options:[{value:'We’ll never share your email.',label:'hint'},{value:'Required field',label:'Required field'}]},
  {key:'errorText',
    label:'error',
    type:'select',
    default:'Enter a valid email.',
    options:[{value:'Enter a valid email.',label:'Enter a valid email.'},{value:'Required.',label:'Required.'}]},
  {key:'onDark',label:'on dark',type:'boolean',default:false}];
const fieldAnat=[
  '<span class="tok">.field</span> label (mono uppercase <span class="tok">--tracking-label</span>) + control '
  ,
  '(hairline <span class="tok">--color-input-line</span>, paper <span class="tok">--color-input-bg</span>) + ',
  '<span class="tok">.field-hint</span>/<span class="tok">.field-error</span> (accent).'].join('');
const fieldBehav=['Focus: <span class="tok">3px</span> ink ring offset <span class="tok">2px</span> (<span ',
  'class="tok">--size-frame</span>); error swaps to <span class="tok">--color-accent</span>; disabled via <span ',
  'class="tok">disabled</span>; dark proof via <span class="tok">[data-theme]</span>. Tab to test.'].join('');
function toggleRender(s){
  const chk = s.checked ? ' checked' : '';
  const dis = s.disabled ? ' disabled' : '';
  const wrap = s.onDark ? [
  ` data-theme="dark" style="background:var(--color-bg);padding:var(--space-16);border:var(--border-hairline)"`,
].join(''):'';return [
  `<div`,
  wrap,
  `><label class="toggle"><input type="checkbox"`,
  chk,
  dis,
  `><span>`,
  s.label,
  `</span></label></div>`,
].join('');} function toggleCode(s){return [
  `<label class="toggle"><input type="checkbox"`,
  s.checked?' checked':'',
  `> `,
  s.label,
  `</label>`,
]
  .join('');
} const toggleKnobs=[{key:'checked',label:'checked',type:'boolean',default:false},
  {key:'disabled',label:'disabled',type:'boolean',default:false},
  {key:'label',
    label:'label',
    type:'select',
    default:'Notifications',
    options:[{value:'Notifications',label:'Notifications'},
      {value:'Dark mode',label:'Dark mode'},
      {value:'Auto-save',label:'Auto-save'}]},
  {key:'onDark',label:'on dark',type:'boolean',default:false}];
const toggleTokens=['--color-ink',
  '--color-bg',
  '--color-surface',
  '--space-42',
  '--space-22',
  '--space-18',
  '--space-2',
  '--space-8',
  '--border-hairline',
  '--radius-none',
  '--dur-soft',
  '--size-frame'];
const toggleAnat=[
  '<span class="tok">.toggle &gt; input[type=checkbox]</span> — track <span class="tok">42×22</span> ink, knob '
  ,
  '<span class="tok">18px</span> (<span class="tok">--space-18</span>).'].join('');
const toggleBehav=[
  'Checked moves knob; focus ring <span class="tok">3px</span> ink offset <span class="tok">2px</span>; disabled '
  ,
  'mutes track; dark: ink/track invert via probe.'].join('');
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
    options:[{value:'sm',label:'sm · 30'},{value:'md',label:'md · 44'},{value:'lg',label:'lg · 60'}]},
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
  '--space-30',
  '--space-60',
  '--text-small',
  '--text-meta',
  '--text-h3',
  '--weight-semibold',
  '--font-sans',
  '--border-hairline',
  '--radius-none'];
const avatarAnat=['<span class="tok">.avatar</span> + <span class="tok">--sm / --lg</span> — square <span ',
  'class="tok">--radius-none</span> 30/44/60 via <span class="tok">--space-30/--space-60</span>. Image cover or ',
  'fallback initial.'].join('');
const avatarBehav=[
  'Static square; no focus ring. Fallback is centered mono. Dark: <span class="tok">--color-panel</span> border '
  ,
  'recomputes; no state change.'].join('');
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
export function render(){
  return [
    `<p class="ds-crumb">Primitives · Components</p><div class="ds-hero"><h1>Actions, not decoration.</h1>`,
    `<p class="lede">Primitives are the smallest reusable parts — each in one uniform sheet: Usage → Anatomy → `,
    `Behaviour → Preview / Code / Tokens → knobs. Pill keeps filter/tab role.</p></div>`,
  ].join('')
    + component({title:'Button',
        sub:['Canonical action primitive — <span class="tok">.btn</span> with <span class="tok">--primary</span> ',
          '(ink fill), <span class="tok">--secondary</span> (hairline), <span class="tok">--ghost</span> ',
          '(text-only). Sizes sm/md via <span class="tok">--size-tap</span> (44px).'].join(''),
        anatomy:btnAnatomy,
        behaviour:btnBehav,
        knobs:btnKnobs,
        render:btnRender,
        code:btnCode,
        tokens:btnTokens})
    + component({title:'Tag',
        sub:['Chip inside <span class="tok">.tags &gt; i</span> — mono 11px on <span class="tok">--color-chip</span> ',
          '(62% ink) over image. Same class as masonry cards.'].join(''),
        anatomy:tagAnat,
        behaviour:tagBehav,
        knobs:tagKnobs,
        render:tagRender,
        code:tagCode,
        tokens:tagTokens})
    + component({title:'Kicker',
        sub:['Eyebrow via <span class="tok">.kicker</span> — mono 12px muted, uppercase <span ',
          'class="tok">--tracking-label</span>.'].join(''),
        anatomy:kickerAnat,
        behaviour:kickerBehav,
        knobs:kickerKnobs,
        render:kickerRender,
        code:kickerCode,
        tokens:kickerTokens})
    + component({title:'Divider',
        sub:['Hairline rule — <span class="tok">hr.divider</span> via <span class="tok">--border-hairline</span>. ',
          'Margins <span class="tok">--space-14</span>.'].join(''),
        anatomy:dividerAnat,
        behaviour:dividerBehav,
        knobs:dividerKnobs,
        render:dividerRender,
        code:dividerCode,
        tokens:dividerTokens})
    + component({title:'Badge',
        sub:['Accent chip — <span class="tok">.badge</span> on <span class="tok">--color-accent</span> (vermilion). ',
          'A11y: large text only — muted is ink for body.'].join(''),
        anatomy:badgeAnat,
        behaviour:badgeBehav,
        knobs:badgeKnobs,
        render:badgeRender,
        code:badgeCode,
        tokens:badgeTokens})
    + component({title:'Field',
        sub:['Label (mono uppercase <span class="tok">--tracking-label</span>) + control (hairline <span ',
          'class="tok">--color-input-line</span>, paper <span class="tok">--color-input-bg</span>, ink focus ring ',
          '2px+2px) + hint/error (accent).'].join(''),
        anatomy:fieldAnat,
        behaviour:fieldBehav,
        knobs:fieldKnobs,
        render:fieldRender,
        code:fieldCode,
        tokens:fieldTokens})
    + component({title:'Toggle',
        sub:['Switch — <span class="tok">.toggle &gt; input[type=checkbox]</span> ink track 42×22, knob <span ',
          'class="tok">--space-18</span>. Focus ring <span class="tok">--size-frame</span> offset <span ',
          'class="tok">--space-2</span>.'].join(''),
        anatomy:toggleAnat,
        behaviour:toggleBehav,
        knobs:toggleKnobs,
        render:toggleRender,
        code:toggleCode,
        tokens:toggleTokens})
    + component({title:'Avatar',
        sub:['Zero-radius square — <span class="tok">.avatar</span> + <span class="tok">--sm / --lg</span>. Image ',
          'cover or fallback initial. 44px default via <span class="tok">--size-tap</span>.'].join(''),
        anatomy:avatarAnat,
        behaviour:avatarBehav,
        knobs:avatarKnobs,
        render:avatarRender,
        code:avatarCode,
        tokens:avatarTokens})
    + component({title:'Brand mark',
        sub:['Wordmark — <span class="tok">.logo</span> (700, <span class="tok">--tracking-display</span>, <span ',
          'class="tok">--text-logo</span>). Shown as authored.'].join(''),
        anatomy:logoAnat,
        behaviour:logoBehav,
        knobs:logoKnobs,
        render:logoRender,
        code:logoCode,
        tokens:logoTokens})
    + note('Do',
      ['Use <span class="tok">.btn--primary</span> once per view; <span class="tok">.badge</span> only for large ',
        'labels — mute elsewhere. Tags stay in <span class="tok">.tags</span> for linger. Field error is <span ',
        'class="tok">.field--error</span>. Toggle is checkbox — no JS. Avatar square (<span ',
        'class="tok">--radius-none</span>) by doctrine.'].join(''),
      'do')
    + code(['<span class="tags"><i>Sales CRM</i></span>\n<p class="kicker">Sales CRM · 2024</p>\n<hr ',
      'class="divider">\n<span class="badge">New</span>\n<div class="field"><label>Email</label><input><span ',
      'class="field-hint"></span></div>\n<label class="toggle"><input type="checkbox"> ',
      'Notifications</label>\n<span class="avatar">IA</span>'].join(''));
}
export function mount(root){return mountComponent(root);}
