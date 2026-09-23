/* ADAM/DS — ds/foundations/sound/board · sound foundations mount ·
   [plan:2026-09-23_174000-motion-elements-vertical.md#phase-4] */
// Exports: mountSoundBoard
// — Mount —
import { playVoice, playFileId } from '../../../views/element-sound.js';
import { testLiveOsc, testFileTone, resetCtx, isMuted } from '../../../views/audio-ctx.js';
import { drawWave, drawFileWave } from './scope-draw.js';
import { renderWave } from './synth-render.js';

export function mountSoundBoard(root) {
  if (!root) return () => {};
  const scope = root.querySelector('#sndScope');
  const status = root.querySelector('[data-snd-status]');
  const info = root.querySelector('[data-snd-info]');
  const master = root.querySelector('[data-snd="master"]');
  const say = (t) => { if (status) status.textContent = t; };
  const sayInfo = (t) => { if (info) info.textContent = t; };
  const offs = [];
  const on = (el, ev, fn) => {
    if (!el) return;
    el.addEventListener(ev, fn);
    offs.push(() => el.removeEventListener(ev, fn));
  };
  const syncOut = (e) => {
    const inp = e.target.closest('input[data-snd]');
    if (!inp) return;
    const k = inp.getAttribute('data-snd');
    const out = inp.parentElement && inp.parentElement.querySelector('[data-snd-v]');
    if (!out) return;
    const v = inp.value;
    if (k === 'gain' || k === 'master' || k === 'fgain') out.textContent = v + '%';
    else if (k === 'ms') out.textContent = v + 'ms';
    else if (k === 'freq') out.textContent = v + 'Hz';
  };
  on(root, 'input', syncOut);
  on(root, 'click', async (e) => {
    const btn = e.target.closest('[data-snd-play]');
    if (btn) {
      const voice = btn.getAttribute('data-snd-play');
      const card = btn.closest('[data-voice]');
      const gIn = card && card.querySelector('[data-snd="gain"]');
      const mIn = card && card.querySelector('[data-snd="ms"]');
      const fIn = card && card.querySelector('[data-snd="freq"]');
      const mg = master ? Number(master.value) / 100 : 0.7;
      const gain = gIn ? (Number(gIn.value) / 100) * mg : 0.6 * mg;
      const ms = mIn ? Number(mIn.value) : 320;
      const freq = fIn ? Number(fIn.value) : undefined;
      if (isMuted()) { say('muted — enable speaker toggle or disable reduced-motion'); return; }
      say(voice + ' · ' + ms + 'ms · playing…');
      sayInfo(voice + ' @ ' + Math.round(gain * 100) + '%');
      const w = await renderWave(voice, { ms, freq, gain: 1 });
      if (w) drawWave(scope, w);
      const r = await playVoice(voice, { ms, gain, freq });
      say(voice + ' · ' + r);
      return;
    }
    const fbtn = e.target.closest('[data-snd-file]');
    if (fbtn) {
      const id = fbtn.getAttribute('data-snd-file');
      const row = fbtn.closest('[data-file]');
      const gIn = row && row.querySelector('[data-snd="fgain"]');
      const mg = master ? Number(master.value) / 100 : 0.7;
      const gain = gIn ? (Number(gIn.value) / 100) * mg : 0.8 * mg;
      if (isMuted()) { say('muted — enable speaker toggle'); return; }
      say(id + ' · playing…');
      sayInfo('file · ' + Math.round(gain * 100) + '%');
      drawFileWave(scope, id);
      const r = await playFileId(id, gain);
      say(id + ' · ' + r);
      return;
    }
    const a = e.target.closest('[data-snd="testa"]');
    if (a) { say('A: ' + await testLiveOsc()); return; }
    const b = e.target.closest('[data-snd="testb"]');
    if (b) { say('B: ' + await testFileTone()); return; }
    const c = e.target.closest('[data-snd="resetc"]');
    if (c) { say(await resetCtx()); return; }
    const cl = e.target.closest('[data-snd="clear"]');
    if (cl) {
      try {
        const ctx = scope && scope.getContext('2d');
        if (ctx) {
          ctx.fillStyle = getComputedStyle(scope).getPropertyValue('--color-panel') || '#f2f4f7';
          ctx.fillRect(0, 0, scope.width, scope.height);
        }
      } catch {}
      say('idle — hit ▶ on any voice or file');
      sayInfo('—');
      return;
    }
  });
  try {
    if (scope) {
      const ctx = scope.getContext('2d');
      ctx.fillStyle = getComputedStyle(scope).getPropertyValue('--color-panel') || '#f2f4f7';
      ctx.fillRect(0, 0, scope.width, scope.height);
    }
  } catch {}
  return () => offs.forEach((fn) => { try { fn(); } catch {} });
}
