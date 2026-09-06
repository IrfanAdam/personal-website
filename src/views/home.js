import { projects } from '../data/site.js';
import { footer, iconStrip, aboutBlock } from './shared.js';
export function Home() {
  const rows = projects.map(([slug, title, a, b, date]) => {
    const cats = [a, b].filter(Boolean).join(' · ');
    return `<a class="work" href="#/projects/${slug}">
      <span class="work-title">${title}</span>
      <span class="work-meta">${cats ? cats + ' · ' : ''}${slug} · ${date}</span></a>`;
  }).join('');
  return `${iconStrip()}<section class="hero"><h1>Working on stories that last</h1>
  <p>Irfan Adam M — portfolio. This is the home index; <a href="#/masonry">masonry view</a> here.</p></section>
  <section class="works"><h2>All of my works</h2>${rows}</section>${aboutBlock()}${footer()}`;
}
