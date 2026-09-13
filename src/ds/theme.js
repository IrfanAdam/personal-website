/* ADAM/DS — ds/theme · theme toggle · [plan:2026-09-13_193000-refactor-manageability.md#phase-3] */
import { refreshLive } from './specimens.js';
export function mountTheme(){
  const root = document.documentElement;
const saved = localStorage.getItem('adam-theme') || localStorage.getItem('adam-ds-theme') || 'system';
const bar = document.createElement('div');
bar.className = 'ds-controls';
bar.innerHTML = ['system', 'light', 'dark'].map((m) => [
  `<button class="pill" data-theme-btn="`,
  m,
  `\">`,
  m,
  `</button>`,
].join('')).join('');
document.body.prepend(bar);
function applyTheme(m) {
  root.removeAttribute('data-theme');
  if (m === 'light') root.setAttribute('data-theme', 'light');
  if (m === 'dark') root.setAttribute('data-theme', 'dark');
  localStorage.setItem('adam-theme', m);
  localStorage.setItem('adam-ds-theme', m);
  bar.querySelectorAll('[data-theme-btn]').forEach((b) => b.classList.toggle('on', b.dataset.themeBtn === m));
}
bar.addEventListener('click', (e) => {
  const b = e.target.closest('[data-theme-btn]'); if (b) { applyTheme(b.dataset.themeBtn); refreshLive(); }
});
applyTheme(saved);
}
