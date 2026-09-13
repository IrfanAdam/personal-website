/* ADAM/DS — library/contact.js · Contact · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { playground } from '../playground.js';
/* tokens this composition consumes — read by the playground's Tokens tab */
const contactTokens=['--size-input-h','--color-input-bg','--color-input-line','--color-input-focus','--color-accent',
  '--color-ink-muted','--font-mono','--text-meta','--space-6','--space-8','--border-hairline','--radius-none',
  '--gutter'];
function sendLabel(loading, done) {
  if (loading) return 'Sending…';
  if (done) return 'Sent ✓';
  return 'Send';
}
function contactRender(s){const state=s.state;
  const empty=state==='empty';
  const err=state==='error';
  const load=state==='loading';
  const ok=state==='success';
  const dis=load?' disabled':'';
  const hint=err?[
  `<span class="field-error">Enter a valid email.</span>`,
].join(''):ok?[
  `<span class="field-hint" style="color:var(--color-ink)">✓ Sent — reply in 24h.</span>`,
].join(''):[
  `<span class="field-hint">We’ll never share your email.</span>`,
]
  .join('');
const cls=err?' field--error':'';
const btnLabel = sendLabel(load, ok);
const btnDis=load||ok?' disabled':'';
return [
  `<div class="case-grid" style="border:var(--border-hairline)">`,
  `<div class="case-copy" style="padding:var(--space-16)"><div class="field`,
  cls,
  `"><label>Email</label><input placeholder="you@example.com" value="`,
  empty?'': 'hello@adam.dev',
  `"`,
  dis,
  `><span class="field-hint" style="display:`,
  empty?'block':'none',
  `">We’ll never share your email.</span>`,
  !empty?hint:'',
  `</div><div class="field" style="margin-top:var(--space-14)"><label>Message</label>`,
  `<textarea placeholder="Tell us…"`,
  dis,
  `>`,
  empty?'': 'Hi Irfan — ',
  `</textarea></div><div style="margin-top:var(--space-14);display:flex;gap:var(--space-8)">`,
  `<button class="btn btn--primary"`,
  btnDis,
  `>`,
  btnLabel,
  `</button><button class="btn btn--ghost"`,
  btnDis,
  `>Cancel</button></div>`,
  state==='empty'?[
    `<p `,
    `style="margin-top:var(--space-14);font-family:var(--font-mono);font-size:var(--text-meta);color:var(--color-ink`,
    `-muted)">Empty state: portfolio filters reuse this pattern.</p>`,
  ].join(''):'',
  `</div>`,
  `<div class="case-media" `,
  `style="background:var(--color-panel);min-height:var(--space-90);display:grid;place-items:center;color:var(--color`,
  `-ink-muted);font-family:var(--font-mono);font-size:var(--text-meta)">portrait · `,
  state,
  `</div></div>`,
].join('');} function contactCode(s){return [
  `<div class="case-grid"><div class="case-copy"><div class="field`,
  s.state==='error'?' field--error':'',
  `"><label>Email</label><input value="`,
  s.state==='empty'?'':'hello@adam.dev',
  `"><span class="`,
  s.state==='error'?'field-error':'field-hint',
  `">…</span></div><button class="btn btn--primary">`,
  sendLabel(s.state === 'loading', s.state === 'success'),
  `</button></div><div class="case-media">…</div></div> <!-- state:`,
  s.state,
  ` -->`,
]
  .join('');
} const contactKnobs=[{key:'state',
    label:'state',
    type:'select',
    default:'empty',
    options:[{value:'empty',label:'empty'},
      {value:'error',label:'error'},
      {value:'loading',label:'loading'},
      {value:'success',label:'success'}]}];
export function contactSheet(){return playground({title:'Contact composition',
      sub:['Field composition — Phase-3 <span class="tok">.field</span> inside <span class="tok">.case-grid</span> ',
        'with <span class="tok">empty / error / loading / success</span>. Empty reuses filter empty state.'].join(''),
      knobs:contactKnobs,
      render:contactRender,
      code:contactCode,
      tokens:contactTokens});}
