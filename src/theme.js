const KEY = 'adam-theme';
const LEGACY = 'adam-ds-theme';

export function getTheme() {
  try { return localStorage.getItem(KEY) || localStorage.getItem(LEGACY) || 'system'; }
  catch { return 'system'; }
}

export function applyTheme(m) {
  const r = document.documentElement;
  r.removeAttribute('data-theme');
  if (m === 'light') r.setAttribute('data-theme', 'light');
  if (m === 'dark') r.setAttribute('data-theme', 'dark');
  try { localStorage.setItem(KEY, m); localStorage.setItem(LEGACY, m); } catch {}
  document.querySelectorAll('[data-theme-btn]').forEach((b) => b.classList.toggle('on', b.dataset.themeBtn === m));
}

export function initTheme() {
  applyTheme(getTheme());
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-theme-btn]');
    if (b) applyTheme(b.dataset.themeBtn);
  });
}
