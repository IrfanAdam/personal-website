import { socials, about, projects, iconFor } from '../data/site.js';
export function footer() {
  return `<footer><nav>${socials.map(([n, u]) => `<a href="${u}" target="_blank" rel="noreferrer">${n}</a>`).join('')}</nav>
  <div>Usually find me listening to Philosophize This, Founders or Acquired.</div>
  <div>© 2025 copy to your hearts content</div></footer>`;
}
export function stripItems(active = '') {
  const items = projects.map(([slug, title]) =>
    `<a href="#/projects/${slug}" title="${title}" class="${slug === active ? 'on' : ''}"><img loading="lazy" src="${iconFor(slug)}" alt="" /></a>`).join('');
  return `<a href="#/contact" title="Contact"><img src="/icons/contact.svg" alt="Contact" /></a>${items}`;
}
export function viewTabs() {
  return `<button class="vtab" data-vtab="list" title="List">≡</button>`
    + `<button class="vtab on" data-vtab="grid" title="Grid">▦</button>`;
}
export function aboutBlock() {
  return `<section class="about"><p>${about}</p></section>`;
}
