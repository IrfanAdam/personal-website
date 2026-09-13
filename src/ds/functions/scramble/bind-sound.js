/* ADAM/DS — scramble/bind-sound · decode voices · [plan:2026-09-13_193000-refactor-manageability.md#phase-2] */
// Exports: makeSound — muted check, playScramble, src-kind sync
import { playVoice, playFileId } from '../../../views/element-sound.js';
import { playSlot } from '../../../views/slot-sound.js';
import { getSource, setSource } from '../../../views/sound-source.js';

// — Factory —
export function makeSound(refs, status) {
  const muted = () => {
    try {
      if (localStorage.getItem('adam-sound') === 'off') return true;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    } catch {}
    return false;
  };
  const playScramble = async (ms) => {
    if (!refs.soundOn() || muted()) return;
    const slot = getSource('scramble');
    if (slot.kind === 'file') {
      try { await playFileId(slot.file, 0.42); } catch {}
      return;
    }
    const v = refs.voiceSel ? refs.voiceSel.value : (slot.voice || 'random');
    try { await playVoice(v, { ms: Math.max(80, Math.min(900, ms)), gain: 0.42 }); } catch {}
    if (Math.random() < 0.34) {
      try { playVoice('tick', { ms: 70, gain: 0.22 }); } catch {}
    }
  };
  const syncSrcCtl = () => {
    const s = getSource('scramble');
    const isFile = s.kind === 'file';
    if (refs.voiceSel) refs.voiceSel.disabled = isFile;
    if (refs.fileSel) refs.fileSel.disabled = !isFile;
  };
  const onVoice = () => {
    try { setSource('scramble', { voice: refs.voiceSel.value }); } catch {}
    if (refs.soundOn()) playScramble(240);
  };
  const onKind = () => {
    try { setSource('scramble', { kind: refs.kindSel.value }); } catch {}
    syncSrcCtl();
    if (refs.soundOn()) playScramble(240);
  };
  const onFile = () => {
    try { setSource('scramble', { file: refs.fileSel.value }); } catch {}
    if (refs.soundOn()) playScramble(240);
  };
  const onPlayLoad = async () => {
    if (!refs.soundOn() || muted()) return;
    try {
      const r = await playSlot('load', 0.5);
      if (status) status.textContent = 'load · ' + r;
    } catch {}
  };
  return { muted, playScramble, syncSrcCtl, onVoice, onKind, onFile, onPlayLoad };
}
