/* ADAM/FX — views/init-sound-load · page-load scanner · [plan:2026-09-13_235413-over-limit-splits.md#phase-3] */
// Exports: initLoadScan — once-per-session load sweep via isOn channel
import { playSlot } from './slot-sound.js';
import { getCtx as sharedGetCtx, getNoise as sharedNoise } from './audio-ctx.js';
export function initLoadScan(channel) {
  const { isOn } = channel;
/* Page-load scanner — once per session, ~520ms sweep. Respects muted/reduced-motion; queued to first interaction if
/* AudioContext blocked. */
  let _loadPlayed = false;
  function _getLoadCtx(){ return sharedGetCtx(); }
  function _getLoadBuf(){ return sharedNoise(); }
  function _canLoad(){ if(!isOn()) return false;
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
}
