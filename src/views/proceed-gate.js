/* ADAM/FX — views/proceed-gate · subtle redux gate · [plan:2026-09-15_183400-lump-sum-builds.md#phase-4] */
// Exports: initProceedGate — first thing visitors do, captures gesture for sound
import { ensureRunning, hasGesture } from './audio-ctx.js';
import { playFileId } from './element-sound.js';
import { attachGlimmerOrb } from './glimmer-orb.js';
const KEY = 'adam-proceed';
export function initProceedGate() {
  try {
    if (localStorage.getItem(KEY) === 'done' && hasGesture()) return;
  } catch {}
  if (document.getElementById('proceedGate')) return;
  const gate = document.createElement('div');
  gate.id = 'proceedGate';
  gate.className = 'proceed-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-label', 'Proceed');
  gate.innerHTML = [
    '<div class="proceed-corner proceed-corner--bl" aria-hidden="true"></div>',
    '<div class="proceed-corner proceed-corner--br" aria-hidden="true"></div>',
    '<div class="proceed-shell">',
    '<div class="proceed-orb-wrap" aria-hidden="true">',
    '<canvas data-glimmer width="96" height="96" aria-hidden="true"></canvas>',
    '<svg class="proceed-orb-lines" viewBox="0 0 340 140" fill="none" aria-hidden="true">',
    '<path d="M6 20 H92 L138 46" stroke="var(--color-line)" stroke-width="0.7"/>',
    '<path d="M6 118 H92 L138 94" stroke="var(--color-line)" stroke-width="0.7"/>',
    '<path d="M334 20 H248 L202 46" stroke="var(--color-line)" stroke-width="0.7"/>',
    '<path d="M334 118 H248 L202 94" stroke="var(--color-line)" stroke-width="0.7"/>',
    '<rect x="91" y="18" width="6" height="6" fill="var(--color-ink)"/>',
    '<rect x="91" y="116" width="6" height="6" fill="var(--color-ink)"/>',
    '<rect x="243" y="18" width="6" height="6" fill="var(--color-ink)"/>',
    '<rect x="243" y="116" width="6" height="6" fill="var(--color-ink)"/>',
    '</svg>',
    '</div>',
    '<div class="proceed-label">Private preview</div>',
    '<h1 class="proceed-title">Proceed to witness<br>Irfan In Redux.</h1>',
    '<p class="proceed-copy">The same stories, distilled — a quiet edit.</p>',
    '<button class="proceed-btn" data-proceed>Proceed</button>',
    '</div>',
  ].join('');
  document.body.appendChild(gate);
  const canvas = gate.querySelector('[data-glimmer]');
  let stopOrb = null;
  try { stopOrb = attachGlimmerOrb(canvas, { state: 'idle', dots: 9 }); } catch {}
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  let done = false;
  const dismiss = async () => {
    if (done) return;
    done = true;
    try { localStorage.setItem(KEY, 'done'); } catch {}
    gate.classList.add('hide');
    document.body.style.overflow = prevOverflow;
    try { if (stopOrb) stopOrb(); } catch {}
    try { await ensureRunning(); } catch {}
    try { await playFileId('authorize.mp3', 0.7); } catch {}
    setTimeout(() => { try { gate.remove(); } catch {} }, 380);
  };
  gate.querySelector('[data-proceed]').addEventListener('click', dismiss);
  gate.addEventListener('click', (e) => { if (e.target === gate) dismiss(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', esc); }
  });
  try { gate.querySelector('[data-proceed]').focus(); } catch {}
}
