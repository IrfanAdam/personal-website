/* ADAM/FX — views/proceed-gate · entry capture for sound · [plan:2026-09-15_183400-lump-sum-builds.md#phase-4] */
// Exports: initProceedGate — cyberpunk authorize gate, first thing visitors do
import { ensureRunning, hasGesture } from './audio-ctx.js';
import { playFileId } from './element-sound.js';
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
  gate.setAttribute('aria-label', 'Authorize sound');
  gate.innerHTML = [
    '<div class="proceed-card">',
    '<div class="proceed-kicker">Sound protocol // 01</div>',
    '<h2 class="proceed-title">Authorize audio link</h2>',
    '<p class="proceed-copy">This site speaks in ticks and zings. Proceed to unlock.</p>',
    '<button class="proceed-btn" data-proceed aria-label="Proceed — enable sound">PROCEED →</button>',
    '<div class="proceed-hint">One tap unlocks AudioContext</div>',
    '</div>',
  ].join('');
  document.body.appendChild(gate);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const btn = gate.querySelector('[data-proceed]');
  let done = false;
  const dismiss = async () => {
    if (done) return;
    done = true;
    try { localStorage.setItem(KEY, 'done'); } catch {}
    gate.classList.add('hide');
    document.body.style.overflow = prevOverflow;
    try { await ensureRunning(); } catch {}
    try { await playFileId('authorize.mp3', 0.8); } catch {}
    setTimeout(() => { try { gate.remove(); } catch {} }, 380);
  };
  btn.addEventListener('click', dismiss);
  gate.addEventListener('click', (e) => {
    if (e.target === gate) dismiss();
  });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', esc); }
  });
  try { btn.focus(); } catch {}
}
