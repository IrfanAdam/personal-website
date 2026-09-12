/* ADAM/FX — Sound wiring: toggle + auto-scan for [data-glitch-sound].
   Persists adam-sound (on/off, default on). Off suspends AudioContext.
   MutationObserver attaches new nodes only — never resets live timers. */
import { attach, setEnabled } from './glitch-sound.js';

let on = true;
try {
  const s = localStorage.getItem('adam-sound');
  on = s !== 'off';
  if (s === 'off') on = false;
  if (!s) on = true;
} catch {}
try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) on = false; } catch {}
setEnabled(on);

function syncUI() {
  document.querySelectorAll('[data-sound-toggle]').forEach((b) => {
    const txt = on ? 'sound on' : 'sound off';
    b.textContent = txt;
    b.setAttribute('aria-label', txt);
    b.setAttribute('aria-pressed', String(on));
    b.classList.toggle('on', on);
  });
}
function apply() {
  on = !on;
  try { localStorage.setItem('adam-sound', on ? 'on' : 'off'); } catch {}
  setEnabled(on);
  syncUI();
}
function ensureToggles() {
  const site = document.getElementById('stripbar');
  if (site) {
    const old = site.querySelectorAll('[data-sound-btn]');
    old.forEach((n) => { const w = n.closest('.sound-switch'); (w || n).remove(); });
    if (!site.querySelector('[data-sound-toggle]')) {
      const meta = site.querySelector('.strip-meta');
      const wrap = document.createElement('div');
      wrap.className = 'sound-switch';
      wrap.style.display = 'flex'; wrap.style.gap = 'var(--space-6)';
      wrap.innerHTML = '<button class="pill" data-sound-toggle aria-pressed="true">sound on</button>';
      (meta || site).appendChild(wrap);
    }
  }
  const ds = document.querySelector('.ds-controls');
  if (ds) {
    const old = ds.querySelectorAll('[data-sound-btn]');
    old.forEach((n) => n.remove());
    if (!ds.querySelector('[data-sound-toggle]')) {
      ds.insertAdjacentHTML('beforeend', '<button class="pill" data-sound-toggle aria-pressed="true">sound on</button>');
    }
  }
  syncUI();
}
function scan(root = document) {
  root.querySelectorAll('[data-glitch-sound]').forEach((el) => attach(el));
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-sound-toggle]');
  if (b) apply();
});
const mo = new MutationObserver((muts) => {
  ensureToggles();
  muts.forEach((m) => m.addedNodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    if (n.matches && n.matches('[data-glitch-sound]')) attach(n);
    if (n.querySelectorAll) n.querySelectorAll('[data-glitch-sound]').forEach((el) => attach(el));
  }));
});
try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch {}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { ensureToggles(); scan(); });
else { ensureToggles(); scan(); }
