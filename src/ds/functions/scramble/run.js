/* ADAM/DS — ds/scramble/run · scramble run closures · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { scrambleText } from '../../../views/scramble-text.js';
import { getSource } from '../../../views/sound-source.js';
import { FONT_STYLES, CHARS } from './meta.js';
export function createRunner(S){
  const {preview, inp, charsSel, customRow, customInp, dur, outDur, speed, outSpeed,
    delay, outDelay, delim, fontSel, outFont, outChars, status, voiceSel, sound} = S;
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
    const text = inp ? inp.value : S.lastText;
    S.lastText = text;
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
      S.rtl?' · rtl':'',
    ].join('');
    const sourceLabel = () => {
      const s = getSource('scramble');
      if (s.kind === 'file') return 'file ' + s.file;
      return voiceSel ? voiceSel.value : 'random';
    };
    if (status) {
      const soundBit = S.soundOn && !sound.muted() ? ' · ♪ ' + sourceLabel() : '';
      status.textContent = label + soundBit;
    }
    // sound synced
    sound.playScramble(d*1000);
    // animate
    try{
      document.documentElement.style.setProperty('--dur-scramble', d.toFixed(1)+'s');
      scrambleText(preview,
        { text, chars: cs, duration: d, speed: sp, revealDelay: dl, delimiter: dm,
          rightToLeft: S.rtl, tweenLength: S.tween,
      });
    }catch{}
  };
  const onText = () => { clearTimeout(S.tmr); S.tmr=setTimeout(doScramble, 180); };
  const onChars = () => { if(customRow) customRow.style.display = (charsSel.value==='custom')?'':'none';
    syncOutputs();
    doScramble();
  };
  const onDur = () => { syncOutputs(); };
  const onSpeed = () => { syncOutputs(); };
  const onDelay = () => { syncOutputs(); };
  return {doScramble, applyFont, syncOutputs, onText, onChars, onDur, onSpeed, onDelay};
}
