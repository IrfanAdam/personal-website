/* ADAM/DS — Functions · Glimmer orb (square-cell voice orb). Lab over
   views/glimmer-orb.js — states idle/listening/thinking, mic-level envelope,
   spring scale. Squares via fillRect (radius-none doctrine). */
import { note, code } from '../specimens.js';
import { attachGlimmerOrb } from '../../views/glimmer-orb.js';
export const title = 'Glimmer orb';
export function render(){
  return `<p class="ds-crumb">Functions · Glimmer orb</p><div class="ds-hero"><h1>Glimmer orb — square cells.</h1><p class="lede">Voice-state orb: <span class="tok">idle</span> breathes, <span class="tok">listening</span> ripples with mic level, <span class="tok">thinking</span> runs three orbiters. Cells are squares (<span class="tok">fillRect</span>), color is <span class="tok">--color-accent</span>.</p></div>`
+`<div class="ds-sec"><h2>Lab</h2><p class="sub">State retargets live (no restart); level empty = auto envelope. Reduced-motion paints one static frame.</p>`
+`<div class="ds-spec block"><canvas data-fx-glimmer width="240" height="240" style="width:var(--size-ds-orb,240px);height:var(--size-ds-orb,240px)" aria-label="Glimmer orb lab"></canvas>`
+`<div class="fx-controls" data-fx-glimmer-ctl>`
+`<label class="fx-row">state <select data-k="state"><option value="idle">idle</option><option value="listening" selected>listening</option><option value="thinking">thinking</option></select><output data-v="state">listening</output></label>`
+`<label class="fx-row">dots <input type="range" min="5" max="15" step="2" value="11" data-k="dots"><output data-v="dots">11</output></label>`
+`<label class="fx-row">level <input type="range" min="0" max="100" step="5" value="0" data-k="level"><output data-v="level">auto</output></label>`
+`</div><figure><figcaption>square cells · spring scale 0.88/1/0.92 · dpr ≤ 4 · sub-pixel cells skipped</figcaption></figure></div>`
+`${code("import { attachGlimmerOrb } from '../views/glimmer-orb.js'\\nconst stop = attachGlimmerOrb(canvas, { state: 'listening' }) // color: --color-accent\\nstop.setState('thinking'); stop.setLevel(0.6); stop();")}`
+`${note('Do','Tune states here; graduate only via tokens — cell color stays <span class="tok">--color-accent</span>, never a literal.')}`
+`</div>`
+`<div class="ds-sec"><h2>Single source</h2><p class="sub">One engine, one consumer (this lab). No React — vanilla canvas, same math as the MatrixOrb draft.</p>`
+`<table class="ds-table"><tr><th>Module</th><th>Exports</th><th>Consumers</th></tr>`
+`<tr><td><span class="tok">views/glimmer-orb.js</span></td><td><span class="tok">attachGlimmerOrb</span>(canvas, { state, level, size, dots, color })</td><td>lab (only)</td></tr></table></div>`;
}
export function mount(root){
  const canvas = root.querySelector('[data-fx-glimmer]');
  if (!canvas || !canvas.getContext) return () => {};
  const ctl = root.querySelector('[data-fx-glimmer-ctl]');
  let stop = attachGlimmerOrb(canvas, { state: 'listening' });
  const outs = {}; if (ctl) ctl.querySelectorAll('[data-v]').forEach((o) => { outs[o.dataset.v] = o; });
  const show = (k, v) => { if (outs[k]) outs[k].textContent = v; };
  const restart = () => {
    const dots = ctl ? +ctl.querySelector('[data-k="dots"]').value : 11;
    const state = ctl ? ctl.querySelector('[data-k="state"]').value : 'listening';
    const lv = ctl ? +ctl.querySelector('[data-k="level"]').value : 0;
    try { stop(); } catch (_) {}
    stop = attachGlimmerOrb(canvas, { state, dots, level: lv === 0 ? undefined : lv / 100 });
    show('dots', dots); show('state', state); show('level', lv === 0 ? 'auto' : (lv / 100).toFixed(2));
  };
  const live = (e) => {
    const k = e.target.dataset.k; if (!k) return;
    if (k === 'state' && stop.setState) { stop.setState(e.target.value); show('state', e.target.value); return; }
    if (k === 'level' && stop.setLevel) { const v = +e.target.value; stop.setLevel(v === 0 ? undefined : v / 100); show('level', v === 0 ? 'auto' : (v / 100).toFixed(2)); return; }
    restart();
  };
  if (ctl) { ctl.addEventListener('input', live); ctl.addEventListener('change', live); }
  return () => { if (ctl) { ctl.removeEventListener('input', live); ctl.removeEventListener('change', live); } try { stop(); } catch (_) {} };
}
