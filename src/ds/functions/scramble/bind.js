/* ADAM/DS — scramble/bind · lab wiring · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: mount — controls + sound + tabs
import { scrambleText } from '../../../views/scramble-text.js';
import { getSource } from '../../../views/sound-source.js';
import { FONT_STYLES, CHARS } from './meta.js';
import { makeSound } from './bind-sound.js';
import { mountUi } from './bind-ui.js';
import { getRefs } from './bind-refs.js';

export function mount(root){
  const lab = root.querySelector('[data-scramble-lab]'); if(!lab) return ()=>{};
  const R = getRefs(lab, root);
  const { preview,
    inp,
    charsSel,
    customRow,
    customInp,
    dur,
    outDur,
    speed,
    outSpeed,
    delay,
    outDelay,
    delim,
    rtlBtn,
    tweenBtn,
    fontSel,
    soundBtn,
    voiceSel,
    kindSel,
    fileSel,
    replayBtn,
    hoverBtn,
    playLoadBtn,
    outChars,
    outFont,
    status,
    stage,
    alignBtns,
    alignGroup,
    tabBar } = R;
  let rtl=false, tween=true, soundOn=true, hoverOn=false;
  const refs = {};
  Object.assign(refs,
    { get voiceSel() { return voiceSel; },
      get kindSel() { return kindSel; },
      get fileSel() { return fileSel; },
      soundOn: () => soundOn });
  let lastText = inp ? inp.value : preview.textContent;
  const sound = makeSound(refs, status);
  const muted = sound.muted;
  const playScramble = sound.playScramble;
  const applyFont = () => {
    const k = fontSel ? fontSel.value : 'display';
    const f = FONT_STYLES[k] || FONT_STYLES.display;
    preview.style.fontFamily = f.family;
    preview.style.fontSize = f.size;
    preview.style.lineHeight = f.leading;
    preview.style.letterSpacing = f.tracking;
    preview.style.fontWeight = f.weight;
    if(outFont) outFont.textContent = k;
  };
  const syncOutputs = () => {
    if(outDur && dur) outDur.textContent = (+dur.value).toFixed(1)+'s';
    if(outSpeed && speed) outSpeed.textContent = (+speed.value).toFixed(1);
    if(outDelay && delay) outDelay.textContent = (+delay.value).toFixed(2)+'s';
    if(outChars && charsSel) outChars.textContent = charsSel.value;
  };
  const curChars = () => {
    const v = charsSel ? charsSel.value : 'upperCase';
    if(v==='custom') return (customInp && customInp.value.trim()) ? customInp.value : '!<>-_\\/[]{}—=+*^?#';
    return CHARS[v] ?? v;
  };
  const doScramble = () => {
    const text = inp ? inp.value : lastText;
    lastText = text;
    const key = charsSel ? charsSel.value : 'upperCase';
    const cs = curChars();
    const d = dur ? +dur.value : 0.9;
    const sp = speed ? +speed.value : 1;
    const dl = delay ? +delay.value : 0;
    const dm = delim ? delim.value : '';
    const label = [
      `scramble · `,
      key,
      key==='custom' ? ':'+cs.slice(0,10):'',
      ` · `,
      d.toFixed(1),
      `s · `,
      dm ? 'words' : 'chars',
      rtl?' · rtl':'',
    ].join('');
    const sourceLabel = () => {
      const s = getSource('scramble');
      if (s.kind === 'file') return 'file ' + s.file;
      return voiceSel ? voiceSel.value : 'random';
    };
    if (status) {
      const soundBit = soundOn && !muted() ? ' · ♪ ' + sourceLabel() : '';
      status.textContent = label + soundBit;
    }
    // sound synced
    playScramble(d*1000);
    // animate
    try{
      document.documentElement.style.setProperty('--dur-scramble', d.toFixed(1)+'s');
      scrambleText(preview,
        { text, chars: cs, duration: d, speed: sp, revealDelay: dl, delimiter: dm, rightToLeft: rtl, tweenLength: tween,
      });
    }catch{}
  };
  let tmr=null;
  const onText = () => { clearTimeout(tmr); tmr=setTimeout(doScramble, 180); };
  const onChars = () => { if(customRow) customRow.style.display = (charsSel.value==='custom')?'':'none';
    syncOutputs();
    doScramble();
  };
  const onDur = () => { syncOutputs(); };
  const onSpeed = () => { syncOutputs(); };
  const onDelay = () => { syncOutputs(); };
  const uiOff = mountUi({ get rtl() { return rtl; },
      set rtl(v) { rtl = v; },
      get tween() { return tween; },
      set tween(v) { tween = v; },
      get soundOn() { return soundOn; },
      set soundOn(v) { soundOn = v; },
      get hoverOn() { return hoverOn; },
      set hoverOn(v) { hoverOn = v; },
      rtlBtn,
      tweenBtn,
      soundBtn,
      hoverBtn,
      alignBtns,
      preview,
      alignGroup,
      fontSel,
      stage,
      tabBar,
      root,
      doScramble,
      applyFont });
  if(fontSel) fontSel.addEventListener('change', ()=> { applyFont(); doScramble(); });
  if(stage) stage.addEventListener('pointerenter', onStageEnter);
  if(tabBar) tabBar.addEventListener('click', onTabs);
  // init
  applyFont(); syncOutputs(); syncSrcCtl(); if(customRow) customRow.style.display='none';
  // first run
  setTimeout(doScramble, 260);
  return ()=>{
    try { uiOff(); } catch {}
    clearTimeout(tmr);
    if(inp) inp.removeEventListener('input', onText);
    if(charsSel) charsSel.removeEventListener('change', onChars);
    if(customInp) customInp.removeEventListener('input', doScramble);
    const onInputFor = (c) => {
      if (c === dur) return onDur;
      if (c === speed) return onSpeed;
      return onDelay;
    };
    [dur,speed,delay].forEach(c=> c && c.removeEventListener('input', onInputFor(c)));
    [dur,speed,delay].forEach(c=> c && c.removeEventListener('change', doScramble));
    if(delim) delim.removeEventListener('change', doScramble);
    if(voiceSel) voiceSel.removeEventListener('change', onVoice);
    if(kindSel) kindSel.removeEventListener('change', onKind);
    if(fileSel) fileSel.removeEventListener('change', onFile);
    if(replayBtn) replayBtn.removeEventListener('click', onReplay);
    if(playLoadBtn) playLoadBtn.removeEventListener('click', onPlayLoad);
    /* shared ctx stays alive — no suspend on unmount */
  };
}
