/* ADAM/DS — component template: Usage → Anatomy → Behaviour → tabs(Preview/Code/Tokens) → knobs.
   One helper every primitive/component reuses. Preview-first tabs via tabs.js; knobs drive live preview+code. */
import { tabs } from './tabs.js';
import { copy } from './specimens.js';
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const reg = (window.__compReg = window.__compReg || {});
export function component({ title, sub, anatomy, behaviour, knobs = [], render, code, tokens = [] }){
  const id = 'comp-' + Math.random().toString(36).slice(2,6);
  reg[id] = { knobs, render, code };
  const init = Object.fromEntries(knobs.map((k)=>[k.key,k.default]));
  const knobsHTML = knobs.map((k)=>{
    if(k.type==='select') return `<label class="fx-row">${k.label} <select data-k="${k.key}" data-comp="${id}">${k.options.map((o)=>`<option value="${o.value}"${o.value===k.default?' selected':''}>${o.label}</option>`).join('')}</select><output data-v="${k.key}">${k.default}</output></label>`;
    if(k.type==='range') return `<label class="fx-row">${k.label} <input type="range" min="${k.min}" max="${k.max}" step="${k.step}" value="${k.default}" data-k="${k.key}" data-comp="${id}"><output data-v="${k.key}">${k.default}${k.unit||''}</output></label>`;
    return `<label class="fx-row">${k.label} <input type="checkbox" ${k.default?'checked':''} data-k="${k.key}" data-comp="${id}"><output data-v="${k.key}">${k.default?'on':'off'}</output></label>`;
  }).join('');
  const tokHTML = tokens.length ? `<div class="fx-btns" style="margin-top:var(--space-8)">${tokens.map((t)=>`<button class="tok" data-copy="${t}">${t}</button>`).join('')}</div>` : '';
  const previewHTML = `<div data-comp-preview="${id}">${render(init)}</div>`;
  const codeHTML = `<div class="ds-code" data-comp-code="${id}"><pre>${esc(code(init))}</pre></div><div class="fx-btns"><button class="pill" data-comp-copy="${id}">copy code</button></div>`;
  const tokensHTML = tokens.length ? `${tokHTML}<p class="sub" style="margin-top:var(--space-8)">Click any <span class="tok">var()</span> to copy. All values read live <span class="tok">var()</span> — no literals.</p>` : '<p class="sub">No component tokens — inherits global rhythm.</p>';
  const tabsHTML = tabs({ panes: [{ label:'Preview', html: previewHTML },{ label:'Code', html: codeHTML },{ label:'Tokens', html: tokensHTML }] });
  return `<div class="ds-sec" data-comp-root="${id}"><h2>${title}</h2>${sub?`<p class="sub">${sub}</p>`:''}${anatomy?`<h3>Anatomy</h3><p class="sub">${anatomy}</p>`:''}${behaviour?`<h3>Behaviour</h3><p class="sub">${behaviour}</p>`:''}${tabsHTML}<div class="fx-controls" data-comp-ctrl="${id}">${knobsHTML}</div></div>`;
}
export function mountComponent(root){
  const offs=[];
  root.querySelectorAll('[data-comp-root]').forEach((sec)=>{
    const id=sec.getAttribute('data-comp-root'); const cfg=reg[id]; if(!cfg) return;
    const preview=sec.querySelector(`[data-comp-preview="${id}"]`);
    const codeEl=sec.querySelector(`[data-comp-code="${id}"] pre`);
    const ctrls=sec.querySelector(`[data-comp-ctrl="${id}"]`);
    if(!preview||!ctrls) return;
    const outs={}; ctrls.querySelectorAll('[data-v]').forEach((o)=> outs[o.dataset.v]=o);
    const state=Object.fromEntries(cfg.knobs.map((k)=>[k.key,k.default]));
    const refresh=()=>{
      preview.innerHTML=cfg.render(state);
      if(codeEl) codeEl.textContent=cfg.code(state);
      Object.entries(outs).forEach(([k,el])=>{
        const kn=cfg.knobs.find((x)=>x.key===k); const v=state[k];
        el.textContent=typeof v==='boolean'?(v?'on':'off'):String(v)+(kn&&kn.unit||'');
      });
    };
    const onInput=(e)=>{
      const k=e.target.dataset.k; if(!k||e.target.dataset.comp!==id) return;
      const kn=cfg.knobs.find((x)=>x.key===k);
      let v=e.target.type==='checkbox'?e.target.checked:e.target.value;
      if(kn&&kn.type==='range') v=Number(v);
      state[k]=v; refresh();
    };
    const btn=sec.querySelector(`[data-comp-copy="${id}"]`);
    const onCopy=()=> copy(cfg.code(state), btn);
    ctrls.addEventListener('input', onInput); ctrls.addEventListener('change', onInput);
    if(btn) btn.addEventListener('click', onCopy);
    offs.push(()=>{ ctrls.removeEventListener('input', onInput); ctrls.removeEventListener('change', onInput); if(btn) btn.removeEventListener('click', onCopy); });
  });
  return ()=> offs.forEach((fn)=>fn());
}
