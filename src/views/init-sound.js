/* ADAM/FX — Sound wiring: toggle + auto-scan for [data-glitch-sound].
   Persists adam-sound (on/off). Off suspends AudioContext. */
import { attach, setEnabled } from './glitch-sound.js';
import { initLoadScan } from './init-sound-load.js';
import { initStripSound } from './strip-sound.js';
import { getVolume, setVolume } from './audio-ctx.js';
import { volHTML, syncVolume } from './init-sound-vol.js';

let on = true;
try {
  const s = localStorage.getItem('adam-sound');
  on = s !== 'off';
} catch {}
try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) on = false; } catch {}
setEnabled(on);

const SND_ICON = ['<svg class="ic-on" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6v4h3l4 3.5v-11L5 6H2z" ',
  'fill="currentColor"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6 6 0 0 1 0 9" stroke="currentColor" ',
  'fill="none" stroke-width="1.6" stroke-linecap="square"/></svg><svg class="ic-off" viewBox="0 0 16 16" ',
  'aria-hidden="true"><path d="M2 6v4h3l4 3.5v-11L5 6H2z" fill="currentColor"/><path d="M11 6l4 4M15 6l-4 4" ',
  'stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>'].join('');
const SND_BTN = '<button class="pill snd-pill" data-sound-toggle aria-pressed="true" aria-label="sound on">'
  + SND_ICON + '</button>';
const VOL = (v) => volHTML(v);

function syncUI() {
  document.querySelectorAll('[data-sound-toggle]').forEach((b) => {
    const txt = on ? 'sound on' : 'sound off';
    if (b.getAttribute('aria-label') !== txt) b.setAttribute('aria-label', txt);
    if (b.getAttribute('aria-pressed') !== String(on)) b.setAttribute('aria-pressed', String(on));
    b.classList.toggle('on', on);
  });
  syncVolume();
  document.querySelectorAll('[data-volume-slider]').forEach((s) => { s.disabled = !on; });
}
function apply() {
  on = !on;
  try { localStorage.setItem('adam-sound', on ? 'on' : 'off'); } catch {}
  setEnabled(on); syncUI();
}
function ensureToggles() {
  const site = document.getElementById('stripbar');
  const slot = site ? site.querySelector('#soundSlot') : null;
  if (slot && !slot.querySelector('[data-sound-toggle]')) {
    const wrap = document.createElement('div');
    wrap.className = 'sound-switch';
    wrap.style.display = 'flex'; wrap.style.gap = 'var(--space-6)'; wrap.style.alignItems = 'center';
    wrap.innerHTML = SND_BTN + VOL(getVolume());
    slot.appendChild(wrap);
  }
  // cleanup legacy header-inserted switches (from previous iteration)
  site?.querySelectorAll(':scope > .sound-switch').forEach((n) => n.remove());
  document.querySelectorAll('[data-sound-btn]').forEach((n) => {
    const w = n.closest('.sound-switch');
    if (w && w.parentElement?.id !== 'soundSlot') w.remove();
    else if (!w) n.remove();
  });
  const ds = document.querySelector('.ds-controls');
  if (ds && !ds.querySelector('[data-sound-toggle]')) ds.insertAdjacentHTML('beforeend', SND_BTN);
  syncUI();
}
function scan(root = document) { root.querySelectorAll('[data-glitch-sound]').forEach((el) => attach(el)); }
document.addEventListener('click', (e) => { const b = e.target.closest('[data-sound-toggle]'); if (b) apply(); });
document.addEventListener('input', (e) => {
  const s = e.target.closest('[data-volume-slider]'); if (!s) return;
  const v = setVolume(s.value);
  s.setAttribute('aria-label', `volume ${Math.round(v * 100)}%`);
  if (v > 0.001 && !on) {
    on = true; try { localStorage.setItem('adam-sound', 'on'); } catch {}
    setEnabled(true); syncUI();
  }
});
try { addEventListener('adam-volume', () => syncUI()); } catch {}
const mo = new MutationObserver((muts) => {
  ensureToggles();
  muts.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    if (n.matches && n.matches('[data-glitch-sound]')) attach(n);
    if (n.querySelectorAll) n.querySelectorAll('[data-glitch-sound]').forEach((el) => attach(el));
  }));
});
try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch {}
initLoadScan({ isOn: () => on });
initStripSound();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { ensureToggles(); scan(); });
} else { ensureToggles(); scan(); }
