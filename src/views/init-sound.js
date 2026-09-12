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
  const v = on ? 'on' : 'off';
  document.querySelectorAll('[data-sound-btn]').forEach((b) => {
    b.classList.toggle('on', b.dataset.soundBtn === v);
    b.setAttribute('aria-pressed', String(b.dataset.soundBtn === v));
  });
}
function apply(v) {
  on = !!v;
  try { localStorage.setItem('adam-sound', on ? 'on' : 'off'); } catch {}
  setEnabled(on);
  syncUI();
}
function ensureToggles() {
  const site = document.getElementById('stripbar');
  if (site && !site.querySelector('[data-sound-btn]')) {
    const meta = site.querySelector('.strip-meta');
    const wrap = document.createElement('div');
    wrap.className = 'sound-switch';
    wrap.style.display = 'flex'; wrap.style.gap = 'var(--space-6)';
    wrap.innerHTML = '<button class="pill" data-sound-btn="on" aria-label="Sound on">sound on</button><button class="pill" data-sound-btn="off" aria-label="Sound off">sound off</button>';
    (meta || site).appendChild(wrap);
  }
  const ds = document.querySelector('.ds-controls');
  if (ds && !ds.querySelector('[data-sound-btn]')) {
    const wrap = document.createElement('span');
    wrap.style.display = 'contents';
    wrap.innerHTML = '<button class="pill" data-sound-btn="on" aria-label="Sound on">sound on</button><button class="pill" data-sound-btn="off" aria-label="Sound off">sound off</button>';
    ds.appendChild(wrap);
  }
  syncUI();
}
function scan(root = document) {
  root.querySelectorAll('[data-glitch-sound]').forEach((el) => attach(el));
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-sound-btn]');
  if (b) apply(b.dataset.soundBtn === 'on');
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
