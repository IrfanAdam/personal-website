/* ADAM/SHARED — views/shared · footer + strip items · [plan:2026-09-15_183400-lump-sum-builds.md#phase-12] */
import { socials, about, projects, iconFor } from '../data/site.js';

const yearNow = () => new Date().getFullYear();

export function footer() {
  return [
    `<footer><div class="footer-cols">`,
    `  <i class="footer-corner footer-corner--tl"></i>`,
    `  <i class="footer-corner footer-corner--tr"></i>`,
    `  <i class="footer-corner footer-corner--bl"></i>`,
    `  <i class="footer-corner footer-corner--br"></i>`,
    `  <div class="footer-info">`,
    `    <nav class="footer-links">`,
    socials.map(([n, u]) => `<a href="${u}" target="_blank" rel="noreferrer">${n}</a>`).join(''),
    `    </nav>`,
    `    <hr class="divider" />`,
    `    <div class="footer-note">Usually find me listening to Philosophize This, Founders or Acquired.</div>`,
    `    <div class="footer-copy">© ${yearNow()} copy to your hearts content</div>`,
    `  </div>`,
    `  <div class="footer-big" aria-hidden="true">`,
    `    <span>Working on</span><span>stories that last</span>`,
    `  </div>`,
    `</div></footer>`,
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
