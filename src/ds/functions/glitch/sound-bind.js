/* ADAM/DS — glitch/sound-bind · palette state + chips · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: mountSoundBind — prox state, updSnd, chips; returns api
import { getSource } from '../../../views/sound-source.js';
import { FILES } from '../../../views/sound-files.js';
import { playVoice } from '../../../views/element-sound.js';
import { isMuted } from '../../../views/audio-ctx.js';
import { TYPE_META, VOICE_DEFAULTS } from './meta.js';

// — Bind —
export function mountSoundBind(root) {
  const q = (s) => root.querySelector(s);
  const typeSel = q('[data-snd="type"]');
  const pitch = q('[data-snd="pitch"]');
  const len = q('[data-snd="len"]');
  const lvl = q('[data-snd="level"]');
  const outL = q('[data-snd-v]');
  const outG = q('[data-snd-g]');
  const desc = q('[data-snd-desc]');
  const levelRow = q('[data-snd-level-row]');
  const proxBtn = q('[data-snd="prox"]');
  const stSnd = q('[data-snd-status]');
  const cardEl = q('[data-lab="grid-card"]');
  const offs = [];
  const on = (el, ev, fn) => {
    if (!el) return;
    el.addEventListener(ev, fn);
    offs.push(() => el.removeEventListener(ev, fn));
  };
  let proxOn = true;
  let mx = -1e4;
  let my = -1e4;
  const R = 260;
  const labProx = () => {
    if (!cardEl || mx < -5e3) return 0.6;
    const r = cardEl.getBoundingClientRect();
    const dx = Math.max(r.left - mx, 0, mx - r.right);
    const dy = Math.max(r.top - my, 0, my - r.bottom);
    if (Math.hypot(dx, dy) >= R) return 0;
    return 1 - Math.hypot(dx, dy) / R;
  };
  const hearVoice = (t, o) => playVoice(t, { ms: o.ms, freq: o.freq, gain: o.gain ?? 0.6 });
  const playViaLabProx = async (t, o) => {
    if (isMuted()) return 'muted';
    if (!proxOn) return hearVoice(t, o);
    const g = 0.08 + 0.92 * labProx();
    if (g <= 0.08) return 'far';
    return hearVoice(t, { ...o, gain: g * 0.8 });
  };
  const syncProxUI = () => {
    if (proxBtn) proxBtn.textContent = proxOn ? 'proximity: on' : 'proximity: off';
    if (levelRow) levelRow.style.display = proxOn ? 'none' : '';
  };
  const updSnd = () => {
    if (outL && len) outL.textContent = `${len.value}ms`;
    if (outG && lvl) outG.textContent = `${lvl.value}%`;
    if (desc && typeSel) desc.textContent = TYPE_META[typeSel.value] || '';
    if (typeSel && len && document.activeElement === typeSel) {
      const d = VOICE_DEFAULTS[typeSel.value];
      if (d) len.value = String(d);
    }
  };
  on(len, 'input', updSnd);
  on(lvl, 'input', updSnd);
  on(typeSel, 'change', updSnd);
  on(proxBtn, 'click', () => {
    proxOn = !proxOn;
    syncProxUI();
    updSnd();
  });
  q('[data-snd-chip]');
  root.querySelectorAll('[data-snd-chip]').forEach((b) => {
    on(b, 'click', () => {
      if (typeSel) typeSel.value = b.dataset.sndChip;
      updSnd();
    });
  });
  const onMove = (e) => { mx = e.clientX; my = e.clientY; };
  root.addEventListener('pointermove', onMove, { passive: true });
  offs.push(() => root.removeEventListener('pointermove', onMove));
  updSnd();
  syncProxUI();
  const api = { typeSel, pitch, len, lvl, stSnd, labProx, hearVoice, playViaLabProx, updSnd };
  return { api, offs, on };
}
