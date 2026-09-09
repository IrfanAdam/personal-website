/* ADAM/DS — playground shell. One infra every primitive plugs into.
   Knobs → select/range/boolean drive state; preview renders REAL site class;
   code + token list are copyable. Scoped var knobs use -- prefix. ≤100 lines */
import { copy } from './specimens.js';
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const reg = (window.__pgReg = window.__pgReg || {});
export function playground({ title, sub, knobs = [], render, code, tokens = [] }){
  const id = 'pg-' + Math.random().toString(36).slice(2,6);
  reg[id] = { knobs, render, code };
  const knobsHTML = knobs.map((k)=>{
    if(k.type==='select') return `<label class="fx-row">${k.label} <select data-k="${k.key}" data-pg="${id}">${k.options.map((o)=>`<option value="${o.value}"${o.value===k.default?' selected':''}>${o.label}</option>`).join('')}</select><output data-v="${k.key}">${k.default}</output></label>`;
    if(k.type==='range') return `<label class="fx-row">${k.label} <input type="range" min="${k.min}" max="${k.max}" step="${k.step}" value="${k.default}" data-k="${k.key}" data-pg="${id}"><output data-v="${k.key}">${k.default}${k.unit||''}</output></label>`;
    return `<label class="fx-row">${k.label} <input type="checkbox" ${k.default?'checked':''} data-k="${k.key}" data-pg="${id}"><output data-v="${k.key}">${k.default?'on':'off'}</output></label>`;
  }).join('');
  const tokHTML = tokens.length ? `<div class="fx-btns" style="margin-top:var(--space-8)">${tokens.map((t)=>`<button class="tok" data-copy="${t}">${t}</button>`).join('')}</div>` : '';
  const init = Object.fromEntries(knobs.map((k)=>[k.key,k.default]));
  return `<div class="ds-sec" data-pg-root="${id}"><h2>${title}</h2>${sub?`<p class="sub">${sub}</p>`:''}<div class="ds-spec block"><div data-pg-preview="${id}">${render(init)}</div></div><div class="fx-controls" data-pg-ctrl="${id}">${knobsHTML}<div class="fx-btns"><button class="pill" data-pg-copy="${id}">copy code</button></div></div><div class="ds-code" data-pg-code="${id}"><pre>${esc(code(init))}</pre></div>${tokHTML}</div>`;
}
export function mountPlayground(root){
  const offs=[];
  root.querySelectorAll('[data-pg-root]').forEach((sec)=>{
    const id=sec.getAttribute('data-pg-root'); const cfg=reg[id]; if(!cfg) return;
    const preview=sec.querySelector(`[data-pg-preview="${id}"]`);
    const codeEl=sec.querySelector(`[data-pg-code="${id}"] pre`);
    const ctrls=sec.querySelector(`[data-pg-ctrl="${id}"]`);
    const outs={}; ctrls.querySelectorAll('[data-v]').forEach((o)=> outs[o.dataset.v]=o);
    const state=Object.fromEntries(cfg.knobs.map((k)=>[k.key,k.default]));
    const refresh=()=>{
      preview.innerHTML=cfg.render(state);
      Object.entries(state).forEach(([k,v])=>{ if(k.startsWith('--')&&preview.firstElementChild) preview.firstElementChild.style.setProperty(k,String(v)); });
      if(codeEl) codeEl.textContent=cfg.code(state);
      Object.entries(outs).forEach(([k,el])=>{
        const kn=cfg.knobs.find((x)=>x.key===k); const v=state[k];
        el.textContent=typeof v==='boolean'?(v?'on':'off'):String(v)+(kn&&kn.unit||'');
      });
    };
    const onInput=(e)=>{
      const k=e.target.dataset.k; if(!k||e.target.dataset.pg!==id) return;
      const kn=cfg.knobs.find((x)=>x.key===k);
      let v=e.target.type==='checkbox'?e.target.checked:e.target.value;
      if(kn&&kn.type==='range') v=Number(v);
      state[k]=v; refresh();
    };
    const btn=sec.querySelector(`[data-pg-copy="${id}"]`);
    const onCopy=()=> copy(cfg.code(state), btn);
    ctrls.addEventListener('input', onInput); ctrls.addEventListener('change', onInput);
    if(btn) btn.addEventListener('click', onCopy);
    offs.push(()=>{ ctrls.removeEventListener('input', onInput); ctrls.removeEventListener('change', onInput); if(btn) btn.removeEventListener('click', onCopy); });
  });
  return ()=> offs.forEach((fn)=>fn());
}
