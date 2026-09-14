/* ADAM/DS — ds/atlas/search · find-by-title/path + dock input wiring
   [plan:2026-09-14_120000-arch-atlas-canvas.md#phase-6] */
import { nodes } from './schema.js';
// Exports: hits, findHTML, bindFind
const rank = (n, q) => {
  const title = n.title.toLowerCase();
  if (title.startsWith(q)) return 0;
  if (title.includes(q)) return 1;
  if (n.path.toLowerCase().includes(q)) return 2;
  if (n.id.toLowerCase().includes(q)) return 3;
  return -1;
};
export function hits(q) {
  const needle = String(q || '').trim().toLowerCase();
  if (!needle) return [];
  return nodes()
    .map((n) => ({ n, r: rank(n, needle) }))
    .filter((x) => x.r >= 0)
    .sort((a, b) => a.r - b.r || a.n.title.localeCompare(b.n.title))
    .map((x) => x.n);
}
export const findHTML = () => [
  '<span class="atlas-div" aria-hidden="true"></span>',
  '<input class="atlas-find" id="atlasFind" type="search" placeholder="find node" aria-label="Find node" ',
  'autocomplete="off" spellcheck="false"><span class="atlas-hit" id="atlasHit" aria-live="polite"></span>',
].join('');
export function bindFind(root, on) {
  const el = root.querySelector('#atlasFind');
  const hitEl = root.querySelector('#atlasHit');
  const emit = (commit) => {
    const list = hits(el.value);
    hitEl.textContent = el.value.trim() ? String(list.length) : '';
    on(list, commit);
  };
  const onInput = () => emit(false);
  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      emit(true);
    }
    if (e.key === 'Escape' && el.value) {
      e.stopPropagation();
      el.value = '';
      emit(false);
    }
  };
  el.addEventListener('input', onInput);
  el.addEventListener('keydown', onKey);
  return {
    clear() {
      el.value = '';
      hitEl.textContent = '';
    },
    unbind() {
      el.removeEventListener('input', onInput);
      el.removeEventListener('keydown', onKey);
    },
  };
}
