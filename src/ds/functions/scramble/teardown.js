/* ADAM/DS — ds/scramble/teardown · lab unwire · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
export function teardown(T){
  const {R, F, uiOff} = T;
  return ()=>{
    try { uiOff(); } catch {}
    clearTimeout(T.tmr);
    if(R.inp) R.inp.removeEventListener('input', F.onText);
    if(R.charsSel) R.charsSel.removeEventListener('change', F.onChars);
    if(R.customInp) R.customInp.removeEventListener('input', F.doScramble);
    const onInputFor = (c) => {
      if (c === R.dur) return F.onDur;
      if (c === R.speed) return F.onSpeed;
      return F.onDelay;
    };
    [R.dur,R.speed,R.delay].forEach(c=> c && c.removeEventListener('input', onInputFor(c)));
    [R.dur,R.speed,R.delay].forEach(c=> c && c.removeEventListener('change', F.doScramble));
    if(R.delim) R.delim.removeEventListener('change', F.doScramble);
    if(R.voiceSel) R.voiceSel.removeEventListener('change', onVoice);
    if(R.kindSel) R.kindSel.removeEventListener('change', onKind);
    if(R.fileSel) R.fileSel.removeEventListener('change', onFile);
    if(R.replayBtn) R.replayBtn.removeEventListener('click', onReplay);
    if(R.playLoadBtn) R.playLoadBtn.removeEventListener('click', onPlayLoad);
    /* shared ctx stays alive — no suspend on unmount */
  };
}
