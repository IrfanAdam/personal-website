/* ADAM/DS — glitch/sound-play · play + tests · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: mountSoundPlay(root, snd) — play button, A/B tests, reset
import { isMuted, testLiveOsc, testFileTone, resetCtx } from '../../../views/audio-ctx.js';
import { getSource } from '../../../views/sound-source.js';
import { playFileId } from '../../../views/element-sound.js';
import { glitchOnce } from '../../../views/glitch.js';

// — Bind —
export function mountSoundPlay(root, snd) {
  const q = (s) => root.querySelector(s);
  const offs = [];
  const on = (el, ev, fn) => {
    if (!el) return;
    el.addEventListener(ev, fn);
    offs.push(() => el.removeEventListener(ev, fn));
  };
  const saySnd = (t) => {
    if (snd.stSnd) snd.stSnd.textContent = t;
  };
  on(q('[data-snd="play"]'), 'click', async () => {
    const gs0 = getSource('glitch');
    const demos = [...root.querySelectorAll('[data-lab]')];
    if (gs0.kind === 'file') {
      let r = 'blocked';
      try {
        r = isMuted() ? 'muted' : await playFileId(gs0.file, 0.8);
      } catch { r = 'blocked'; }
      saySnd(r === 'muted' ? 'muted — enable the speaker toggle' : String(r));
      try { demos.forEach((el) => glitchOnce(el, 420)); } catch {}
      return;
    }
    const tp = snd.typeSel ? snd.typeSel.value : 'hum';
    let s = 'blocked';
    try {
      s = await snd.playViaLabProx(tp, { ms: +snd.len.value || undefined, gain: 1 });
    } catch { s = 'blocked'; }
    saySnd(`${tp} · ${String(s)}`);
    try { demos.forEach((el) => glitchOnce(el, 420)); } catch {}
  });
  on(q('[data-snd="testa"]'), 'click', async () => saySnd('A: ' + await testLiveOsc()));
  on(q('[data-snd="testb"]'), 'click', async () => saySnd('B: ' + await testFileTone()));
  on(q('[data-snd="resetc"]'), 'click', async () => saySnd(await resetCtx()));
  return () => offs.forEach((fn) => { try { fn(); } catch {} });
}
