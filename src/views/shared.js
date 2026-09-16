/* ADAM/SHARED — views/shared · footer + strip items · [plan:2026-09-13_193000-refactor-manageability.md#phase-1] */
import { socials, about, projects, iconFor } from '../data/site.js';
export function footer() {
  return [
    `<footer><div class="footer-big" aria-hidden="true">`,
    `<span>Working on</span><span>stories that last</span></div><nav>`,
    socials.map(([n, u]) => `<a href="${u}" target="_blank" rel="noreferrer">${n}</a>`).join(''),
    `</nav>
  <div>Usually find me listening to Philosophize This, Founders or Acquired.</div>
`,
    `  <div>© 2025 copy to your hearts content</div></footer>`,
  ].join('');
}
export function stripItems(active = '') {
  const items = projects.map(([slug, title]) =>
    [
      `<a href="#/projects/`,
      slug,
      `" title="`,
      title,
      `" class="`,
      slug === active ? 'on' : '',
      `"><img loading="lazy" src="`,
      iconFor(slug),
      `" alt="" /></a>`,
    ].join('')).join('');
  return `<a href="#/contact" title="Contact"><img src="/icons/contact.svg" alt="Contact" /></a>${items}`;
}
export function viewTabs() {
  return `<button class="vtab vtab--close" id="closeBtn" hidden aria-label="Close" title="Close">✕</button>`
    + `<button class="vtab" data-vtab="list" title="List">≡</button>`
    + `<button class="vtab on" data-vtab="grid" title="Grid">▦</button>`;
}
export function aboutBlock() {
  return `<section class="about"><p>${about}</p></section>`;
}
