/* ADAM/DS — ds/scramble/bind · lab mount orchestration · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
// Exports: mount — refs + state, delegates run/wire/teardown
import { getRefs } from './bind-refs.js';
import { makeSound } from './bind-sound.js';
import { mountUi } from './bind-ui.js';
import { createRunner } from './run.js';
import { teardown } from './teardown.js';
export function mount(root){
  const lab = root.querySelector('[data-scramble-lab]'); if(!lab) return ()=>{};
  const R = getRefs(lab, root);
  let rtl=false, tween=true, soundOn=true, hoverOn=false, tmr=null;
  const refs = {};
  Object.assign(refs,
    { get voiceSel() { return R.voiceSel; },
      get kindSel() { return R.kindSel; },
      get fileSel() { return R.fileSel; },
      soundOn: () => soundOn });
  let lastText = R.inp ? R.inp.value : R.preview.textContent;
  const sound = makeSound(refs, R.status);
  const S = { ...R, sound,
    get rtl() { return rtl; }, set rtl(v) { rtl = v; },
    get tween() { return tween; }, set tween(v) { tween = v; },
    get soundOn() { return soundOn; }, set soundOn(v) { soundOn = v; },
    get lastText() { return lastText; }, set lastText(v) { lastText = v; },
    get tmr() { return tmr; }, set tmr(v) { tmr = v; } };
  const F = createRunner(S);
  const uiOff = mountUi({ get rtl() { return rtl; },
      set rtl(v) { rtl = v; },
      get tween() { return tween; },
      set tween(v) { tween = v; },
      get soundOn() { return soundOn; },
      set soundOn(v) { soundOn = v; },
      get hoverOn() { return hoverOn; },
      set hoverOn(v) { hoverOn = v; },
      rtlBtn: R.rtlBtn,
      tweenBtn: R.tweenBtn,
      soundBtn: R.soundBtn,
      hoverBtn: R.hoverBtn,
      alignBtns: R.alignBtns,
      preview: R.preview,
      alignGroup: R.alignGroup,
      fontSel: R.fontSel,
      stage: R.stage,
      tabBar: R.tabBar,
      root,
      doScramble: F.doScramble,
      applyFont: F.applyFont });
  if(R.fontSel) R.fontSel.addEventListener('change', ()=> { F.applyFont(); F.doScramble(); });
  if(R.stage) R.stage.addEventListener('pointerenter', onStageEnter);
  if(R.tabBar) R.tabBar.addEventListener('click', onTabs);
  // init
  F.applyFont(); F.syncOutputs(); syncSrcCtl();
  if(R.customRow) R.customRow.style.display='none';
  // first run
  setTimeout(F.doScramble, 260);
  return teardown({R, F, uiOff, get tmr() { return tmr; }});
}
