/* ADAM/FX — Sound wiring: toggle + auto-scan for [data-glitch-sound].
   Persists adam-sound (on/off, default on). Off suspends AudioContext.
   MutationObserver attaches new nodes only — never resets live timers. */
import { attach, setEnabled } from './glitch-sound.js';
import { playSlot } from './slot-sound.js';
import { getCtx as sharedGetCtx, getNoise as sharedNoise } from './audio-ctx.js';

let on = true;
try {
  const s = localStorage.getItem('adam-sound');
  on = s !== 'off';
  if (s === 'off') on = false;
  if (!s) on = true;
} catch {}
try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) on = false; } catch {}
setEnabled(on);

/* Speaker icon — waves (enabled) + slashed (muted); CSS swaps via .on. */
const SND_ICON = '<svg class="ic-on" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6v4h3l4 3.5v-11L5 6H2z" fill="currentColor"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6 6 0 0 1 0 9" stroke="currentColor" fill="none" stroke-width="1.6" stroke-linecap="square"/></svg><svg class="ic-off" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6v4h3l4 3.5v-11L5 6H2z" fill="currentColor"/><path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>';
const SND_BTN = '<button class="pill snd-pill" data-sound-toggle aria-pressed="true" aria-label="sound on">' + SND_ICON + '</button>';

function syncUI() {
  document.querySelectorAll('[data-sound-toggle]').forEach((b) => {
    const txt = on ? 'sound on' : 'sound off';
    // Icon-only switch: state reads via filled .on + aria. Attribute-only
    // writes stay safe inside the childList MutationObserver below.
    if (b.getAttribute('aria-label') !== txt) b.setAttribute('aria-label', txt);
    const pressed = String(on);
    if (b.getAttribute('aria-pressed') !== pressed) b.setAttribute('aria-pressed', pressed);
    if (b.classList.contains('on') !== on) b.classList.toggle('on', on);
  });
}
function apply() {
  on = !on;
  try { localStorage.setItem('adam-sound', on ? 'on' : 'off'); } catch {}
  setEnabled(on);
  syncUI();
}
function ensureToggles() {
  const site = document.getElementById('stripbar');
  if (site) {
    const old = site.querySelectorAll('[data-sound-btn]');
    old.forEach((n) => { const w = n.closest('.sound-switch'); (w || n).remove(); });
    if (!site.querySelector('[data-sound-toggle]')) {
      const meta = site.querySelector('.strip-meta');
      const wrap = document.createElement('div');
      wrap.className = 'sound-switch';
      wrap.style.display = 'flex'; wrap.style.gap = 'var(--space-6)';
      wrap.innerHTML = SND_BTN;
      (meta || site).appendChild(wrap);
    }
  }
  const ds = document.querySelector('.ds-controls');
  if (ds) {
    const old = ds.querySelectorAll('[data-sound-btn]');
    old.forEach((n) => n.remove());
    if (!ds.querySelector('[data-sound-toggle]')) {
      ds.insertAdjacentHTML('beforeend', SND_BTN);
    }
  }
  syncUI();
}
function scan(root = document) {
  root.querySelectorAll('[data-glitch-sound]').forEach((el) => attach(el));
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-sound-toggle]');
  if (b) apply();
});
const mo = new MutationObserver((muts) => {
  ensureToggles();
  muts.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    if (n.matches && n.matches('[data-glitch-sound]')) attach(n);
    if (n.querySelectorAll) n.querySelectorAll('[data-glitch-sound]').forEach((el) => attach(el));
  }));
});
try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch {}
/* Page-load scanner — once per session, ~520ms sweep. Respects muted/reduced-motion; queued to first interaction if
/* AudioContext blocked. */
let _loadPlayed = false;
function _getLoadCtx(){ return sharedGetCtx(); }
function _getLoadBuf(){ return sharedNoise(); }
function _canLoad(){ if(!on) return false;
  try{ if(matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  }catch{} try{ if(sessionStorage.getItem('adam-load-played')) return false;
  }catch{} if(_loadPlayed) return false;
  return true;
}
function _playLoad(){ if(!_canLoad()) return; const c=_getLoadCtx(),
  b=_getLoadBuf(); if(!c||!b) return; const go=async ()=>{ try{ const r=await playSlot('load',
        0.5); if(String(r).startsWith('played')){ _loadPlayed=true; try{ sessionStorage.setItem('adam-load-played',
              '1');
              }catch{} } }catch{} };
              if(c.state==='suspended'){ c.resume().then(go).catch(()=>{ // queue to first gesture
  const once=()=>{ try{ if(_canLoad()) go();
    }catch{};
    try{ removeEventListener('pointerdown', once);
      removeEventListener('keydown', once);
    }catch{} };
  addEventListener('pointerdown',
    once,
    {once:true}); addEventListener('keydown',
    once,
    {once:true}); }); } else go(); }
setTimeout(()=>{ try{ _playLoad(); }catch{} }, 820);
document.addEventListener('pointerdown', ()=>{ try{ if(!_loadPlayed) _playLoad(); }catch{} }, {once:true});
if (document.readyState === 'loading') document
  .addEventListener('DOMContentLoaded', () => { ensureToggles(); scan(); });
else { ensureToggles(); scan(); }
